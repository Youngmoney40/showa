// // // import React, { useState, useRef, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StatusBar,
// // //   Image,
// // //   Animated,
// // //   Easing,
// // //   Dimensions,
// // //   Modal,
// // //   Alert,
// // //   TextInput,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


// // // const { width } = Dimensions.get('window');
// // // const API_BASE_URL = 'http://192.168.1.103:8000/api';

// // // const AnalysisScreen = ({ navigation }) => {
// // //   const [selectedImage, setSelectedImage] = useState(null);
// // //   const [bookingId, setBookingId] = useState('');
// // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // //   const [showScanModal, setShowScanModal] = useState(false);
// // //   const [showResultsModal, setShowResultsModal] = useState(false);
// // //   const [scanProgress, setScanProgress] = useState(0);
// // //   const [analysisResult, setAnalysisResult] = useState(null);
// // //   const [currentTestimonial, setCurrentTestimonial] = useState(0);

// // //   const slideAnim = useRef(new Animated.Value(0)).current;
// // //   const progressAnim = useRef(new Animated.Value(0)).current;
// // //   const [manualMatches, setManualMatches] = useState([]);
// // //   const [currentMatchInput, setCurrentMatchInput] = useState('');

// // //   const [isGeminiProcessing, setIsGeminiProcessing] = useState(false);

// // //   // Testimonials data
// // //   const testimonials = [
// // //     {
// // //       id: 1,
// // //       text: "I scanned my bet before placing it — the AI flagged 2 risky picks. I changed them and ended up winning ₦45,000!",
// // //       author: "Emmanuel, Lagos",
// // //       amount: "₦45,000"
// // //     },
// // //     {
// // //       id: 2,
// // //       text: "This app saved me from losing ₦20,000! The analysis showed one game was too risky. I removed it and won!",
// // //       author: "Sarah, Abuja",
// // //       amount: "₦20,000"
// // //     },
// // //     {
// // //       id: 3,
// // //       text: "Never betting blind again! The AI analysis helped me spot bad odds and I turned ₦500 into ₦15,000!",
// // //       author: "Mike, Port Harcourt",
// // //       amount: "₦15,000"
// // //     }
// // //   ];


// // //   // Auto-rotate testimonials
// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setCurrentTestimonial((prev) => 
// // //         prev === testimonials.length - 1 ? 0 : prev + 1
// // //       );
// // //     }, 4000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   // Animate testimonial slide
// // //   useEffect(() => {
// // //     Animated.timing(slideAnim, {
// // //       toValue: 1,
// // //       duration: 500,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, [currentTestimonial]);

// // //   // const handleImageSelect = () => {
// // //   //   setSelectedImage('placeholder');
// // //   // };

// // //   const handleImageSelect = async () => {
// // //   try {
// // //     // Your existing image picker logic
// // //     const result = await ImagePicker.launchImageLibraryAsync({
// // //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // //       allowsEditing: true,
// // //       aspect: [4, 3],
// // //       quality: 0.8,
// // //       base64: true, // Send base64 for better processing
// // //     });

// // //     if (!result.canceled) {
// // //       setSelectedImage(result.assets[0].uri);
      
// // //       // Show preview with processing indicator
// // //       Alert.alert(
// // //         'Image Selected', 
// // //         'Bet slip image ready for AI analysis with Gemini Vision',
// // //         [{ text: 'OK' }]
// // //       );
// // //     }
// // //   } catch (error) {
// // //     console.error('Image selection error:', error);
// // //     Alert.alert('Error', 'Failed to select image. Please try again.');
// // //   }
// // // };

// // //   const addManualMatch = () => {
// // //     if (!currentMatchInput.trim()) return;

// // //     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
// // //     const match = currentMatchInput.match(matchRegex);

// // //     if (match) {
// // //       const homeTeam = match[1].trim();
// // //       const awayTeam = match[2].trim();
      
// // //       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
// // //       setCurrentMatchInput('');
// // //     } else {
// // //       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
// // //     }
// // //   };

// // //   const removeManualMatch = (index) => {
// // //     setManualMatches(prev => prev.filter((_, i) => i !== index));
// // //   };

// // //   const handleAnalyze = async () => {
// // //     const hasImage = !!selectedImage;
// // //     const hasBookingId = !!bookingId;
// // //     const hasManualMatches = manualMatches.length > 0;

// // //     if (!hasImage && !hasBookingId && !hasManualMatches) {
// // //       Alert.alert('No Input', 'Please upload a bet slip, enter booking ID, or add matches manually');
// // //       return;
// // //     }

// // //     setIsAnalyzing(true);
// // //     setShowScanModal(true);
// // //     startScanAnimation();

// // //     try {
// // //       let response;
// // //       const token = await AsyncStorage.getItem('access_token');

// // //       if (hasManualMatches) {
// // //         console.log('Using manual matches analysis with:', manualMatches);
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({
// // //             matches: manualMatches,
// // //           }),
// // //         });
// // //       } else if (selectedImage) {
// // //         const formData = new FormData();
// // //         formData.append('image', {
// // //           uri: selectedImage,
// // //           type: 'image/jpeg',
// // //           name: 'bet_slip.jpg',
// // //         });
// // //         if (bookingId) {
// // //           formData.append('booking_id', bookingId);
// // //         }

// // //         response = await fetch(`${API_BASE_URL}/bets/slips/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'multipart/form-data',
// // //           },
// // //           body: formData,
// // //         });
// // //       } else {
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({
// // //             booking_id: bookingId,
// // //           }),
// // //         });
// // //       }

// // //       const result = await response.json();
      
// // //       console.log('Analysis response:', result);

// // //       if (response.ok) {
// // //         setAnalysisResult(result);
// // //         setTimeout(() => {
// // //           setShowScanModal(false);
// // //           setShowResultsModal(true);
// // //         }, 500);
// // //       } else {
// // //         throw new Error(result.error || 'Analysis failed');
// // //       }
// // //     } catch (error) {
// // //       console.error('Analysis error:', error);
// // //       Alert.alert('Error', 'Analysis failed. Please try again.');
// // //       setShowScanModal(false);
// // //     } finally {
// // //       setIsAnalyzing(false);
// // //     }
// // //   };

// // //   const startScanAnimation = () => {
// // //     setScanProgress(0);
// // //     progressAnim.setValue(0);
    
// // //     const duration = 3000;
// // //     const interval = 100;
// // //     const steps = duration / interval;
// // //     let currentStep = 0;

// // //     const progressInterval = setInterval(() => {
// // //       currentStep++;
// // //       const progress = (currentStep / steps) * 100;
// // //       setScanProgress(progress);
      
// // //       Animated.timing(progressAnim, {
// // //         toValue: progress,
// // //         duration: interval,
// // //         useNativeDriver: false,
// // //       }).start();

// // //       if (currentStep >= steps) {
// // //         clearInterval(progressInterval);
// // //       }
// // //     }, interval);
// // //   };

// // //   const renderTestimonial = () => {
// // //     const testimonial = testimonials[currentTestimonial];
    
// // //     return (
// // //       <Animated.View 
// // //         style={[
// // //           styles.testimonialSlide,
// // //           {
// // //             opacity: slideAnim,
// // //             transform: [{
// // //               translateX: slideAnim.interpolate({
// // //                 inputRange: [0, 1],
// // //                 outputRange: [50, 0],
// // //               })
// // //             }]
// // //           }
// // //         ]}
// // //       >
// // //         <View style={styles.testimonialHeader}>
// // //           <Icon name="emoji-events" size={20} color="#39FF14" />
// // //           <Text style={styles.winAmount}>WON {testimonial.amount}</Text>
// // //         </View>
// // //         <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
// // //         <Text style={styles.testimonialAuthor}>— {testimonial.author}</Text>
        
// // //         <View style={styles.testimonialIndicators}>
// // //           {testimonials.map((_, index) => (
// // //             <View 
// // //               key={index}
// // //               style={[
// // //                 styles.indicator,
// // //                 index === currentTestimonial && styles.indicatorActive
// // //               ]}
// // //             />
// // //           ))}
// // //         </View>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const renderResultsModal = () => {
// // //     if (!analysisResult) return null;

// // //     console.log('Full analysisResult:', JSON.stringify(analysisResult, null, 2));

// // //     // Extract data with proper fallbacks
// // //     const analysis = analysisResult.analysis || {};
// // //     const analysisData = analysis.analysis_data || {};
    
// // //     // Enhanced data extraction
// // //     const matches = analysisData.match_analyses || [];
// // //     const confidenceScore = analysis.confidence_score || 0;
// // //     const lowRiskGames = analysis.low_risk_games || 0;
// // //     const mediumRiskGames = analysis.medium_risk_games || 0;
// // //     const highRiskGames = analysis.high_risk_games || 0;
    
// // //     // Enhanced features
// // //     const betSlipHealth = analysisData.bet_slip_health || {};
// // //     const globalInsights = analysisData.global_insights || {};
// // //     const smartSuggestions = analysisData.smart_suggestions || [];
// // //     const achievements = analysisData.achievements || [];
// // //     const proTips = analysisData.pro_tips || [];
// // //     const userRiskProfile = analysisData.user_risk_profile || {};
// // //     const overallConfidence = analysisData.overall_confidence || confidenceScore;

// // //     const getRiskColor = (riskLevel) => {
// // //       switch (riskLevel?.toUpperCase()) {
// // //         case 'LOW_RISK': return '#39FF14';
// // //         case 'MEDIUM_RISK': return '#FFA500';
// // //         case 'HIGH_RISK': return '#FF4444';
// // //         default: return '#666';
// // //       }
// // //     };

// // //     const getRiskEmoji = (riskLevel) => {
// // //       switch (riskLevel?.toUpperCase()) {
// // //         case 'LOW_RISK': return '💎';
// // //         case 'MEDIUM_RISK': return '⚠️';
// // //         case 'HIGH_RISK': return '🚨';
// // //         default: return '❓';
// // //       }
// // //     };

// // //     // Determine analysis type for display
// // //     const getAnalysisType = () => {
// // //       if (manualMatches.length > 0) return 'Manual Bet Analysis';
// // //       if (selectedImage) return 'Bet Slip Scan Analysis';
// // //       if (bookingId) return 'Booking ID Analysis';
// // //       return 'Bet Analysis';
// // //     };

// // //     // Extract injury information from match data
// // //     const getInjuryInfo = (match) => {
// // //       const injuries = [];
      
// // //       // Check for home team injuries
// // //       if (match.home_injuries && match.home_injuries.length > 0) {
// // //         injuries.push({
// // //           team: match.home_team,
// // //           count: match.home_injuries.length,
// // //           players: match.home_injuries.slice(0, 3) // Show first 3 injuries
// // //         });
// // //       }
      
// // //       // Check for away team injuries
// // //       if (match.away_injuries && match.away_injuries.length > 0) {
// // //         injuries.push({
// // //           team: match.away_team,
// // //           count: match.away_injuries.length,
// // //           players: match.away_injuries.slice(0, 3)
// // //         });
// // //       }
      
// // //       return injuries;
// // //     };

// // //     return (
// // //       <Modal
// // //         visible={showResultsModal}
// // //         transparent={true}
// // //         animationType="slide"
// // //         statusBarTranslucent={true}
// // //         onRequestClose={() => setShowResultsModal(false)}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.resultsModal}>
// // //             {/* Fixed Header */}
// // //             <View style={styles.resultsHeader}>
// // //               <TouchableOpacity 
// // //                 style={styles.closeButton}
// // //                 onPress={() => setShowResultsModal(false)}
// // //               >
// // //                 <Icon name="close" size={24} color="#fff" />
// // //               </TouchableOpacity>
// // //               <Text style={styles.resultsTitle}>🎯 Analysis Complete</Text>
// // //               <Text style={styles.resultsSubtitle}>
// // //                 {getAnalysisType()}
// // //                 {analysisResult.booking_id && ` • ID: ${analysisResult.booking_id}`}
// // //                 {manualMatches.length > 0 && ` • ${manualMatches.length} match${manualMatches.length > 1 ? 'es' : ''}`}
// // //               </Text>
// // //             </View>

// // //             {/* ScrollView for content */}
// // //             <ScrollView 
// // //               style={styles.resultsContent} 
// // //               contentContainerStyle={styles.resultsContentContainer}
// // //               showsVerticalScrollIndicator={false}
// // //             >
// // //               {/* AI Confidence Score - Prominent Display */}
// // //               <View style={styles.confidenceCard}>
// // //                 <View style={styles.confidenceHeader}>
// // //                   <Icon name="psychology" size={28} color="#39FF14" />
// // //                   <Text style={styles.confidenceTitle}>AI CONFIDENCE SCORE</Text>
// // //                 </View>
// // //                 <View style={styles.confidenceScoreContainer}>
// // //                   <Text style={styles.confidenceScore}>{overallConfidence}%</Text>
// // //                   <View style={styles.confidenceMeter}>
// // //                     <View 
// // //                       style={[
// // //                         styles.confidenceFill,
// // //                         { width: `${overallConfidence}%` }
// // //                       ]} 
// // //                     />
// // //                   </View>
// // //                 </View>
// // //                 <Text style={styles.confidenceDescription}>
// // //                   {overallConfidence >= 70 ? 'High confidence in analysis' : 
// // //                    overallConfidence >= 50 ? 'Moderate confidence in analysis' : 
// // //                    'Low confidence - consider additional research'}
// // //                 </Text>
// // //               </View>

// // //               {/* Bet Slip Health Score */}
// // //               <View style={styles.healthCard}>
// // //                 <View style={styles.healthHeader}>
// // //                   <Text style={styles.healthEmoji}>{'💎' || '💎'}</Text>
// // //                   <View style={styles.healthTextContainer}>
// // //                     <Text style={styles.healthTitle}>BET SLIP HEALTH</Text>
// // //                     <Text style={styles.healthScore}>{betSlipHealth.score || 'ANALYZING'}</Text>
// // //                   </View>
// // //                 </View>
// // //                 <Text style={styles.healthMessage}>
// // //                   {betSlipHealth.message || 'Analysis completed successfully'}
// // //                 </Text>
// // //                 <View style={styles.healthStats}>
// // //                   <View style={styles.healthStat}>
// // //                     <Text style={styles.healthStatLabel}>Avg Risk</Text>
// // //                     <Text style={styles.healthStatValue}>
// // //                       {betSlipHealth.average_risk || analysisData.overall_risk_score || 50}%
// // //                     </Text>
// // //                   </View>
// // //                   <View style={styles.healthStat}>
// // //                     <Text style={styles.healthStatLabel}>AI Confidence</Text>
// // //                     <Text style={styles.healthStatValue}>{overallConfidence}%</Text>
// // //                   </View>
// // //                   <View style={styles.healthStat}>
// // //                     <Text style={styles.healthStatLabel}>Matches</Text>
// // //                     <Text style={styles.healthStatValue}>{matches.length}</Text>
// // //                   </View>
// // //                 </View>
// // //               </View>

// // //               {/* Global Insights */}
// // //               {globalInsights.community_data && (
// // //                 <View style={styles.insightsCard}>
// // //                   <View style={styles.insightsHeader}>
// // //                     <Icon name="public" size={20} color="#39FF14" />
// // //                     <Text style={styles.insightsTitle}>Global Insights</Text>
// // //                   </View>
// // //                   <Text style={styles.insightText}>{globalInsights.community_data}</Text>
// // //                   <Text style={styles.insightText}>{globalInsights.trending_matches}</Text>
// // //                   <Text style={styles.insightText}>{globalInsights.success_rate}</Text>
// // //                 </View>
// // //               )}

// // //               {/* Risk Distribution */}
// // //               <View style={styles.riskDistributionCard}>
// // //                 <Text style={styles.sectionTitle}>Risk Distribution</Text>
// // //                 <View style={styles.riskBars}>
// // //                   <View style={styles.riskBar}>
// // //                     <View style={[styles.riskBarFill, styles.lowRisk, { width: `${(lowRiskGames / matches.length) * 100}%` }]} />
// // //                     <Text style={styles.riskBarLabel}>Low Risk: {lowRiskGames}</Text>
// // //                   </View>
// // //                   <View style={styles.riskBar}>
// // //                     <View style={[styles.riskBarFill, styles.mediumRisk, { width: `${(mediumRiskGames / matches.length) * 100}%` }]} />
// // //                     <Text style={styles.riskBarLabel}>Medium Risk: {mediumRiskGames}</Text>
// // //                   </View>
// // //                   <View style={styles.riskBar}>
// // //                     <View style={[styles.riskBarFill, styles.highRisk, { width: `${(highRiskGames / matches.length) * 100}%` }]} />
// // //                     <Text style={styles.riskBarLabel}>High Risk: {highRiskGames}</Text>
// // //                   </View>
// // //                 </View>
// // //               </View>

// // //               {/* Smart Suggestions */}
// // //               {smartSuggestions.length > 0 && (
// // //                 <View style={styles.suggestionsCard}>
// // //                   <View style={styles.suggestionsHeader}>
// // //                     <Icon name="auto-awesome" size={20} color="#39FF14" />
// // //                     <Text style={styles.suggestionsTitle}>Smart Suggestions</Text>
// // //                   </View>
// // //                   {smartSuggestions.map((suggestion, index) => (
// // //                     <View key={index} style={styles.suggestionItem}>
// // //                       <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
// // //                       {suggestion.actions?.map((action, actionIndex) => (
// // //                         <Text key={actionIndex} style={styles.suggestionAction}>• {action}</Text>
// // //                       ))}
// // //                       <Text style={styles.suggestionImprovement}>{suggestion.improvement}</Text>
// // //                       <Text style={styles.suggestionImpact}>{suggestion.impact}</Text>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}

// // //               {/* Match Analysis */}
// // //               {matches.length > 0 ? (
// // //                 <View style={styles.matchesSection}>
// // //                   <Text style={styles.sectionTitle}>Match Analysis ({matches.length} matches)</Text>
// // //                   {matches.map((match, index) => {
// // //                     const injuries = getInjuryInfo(match);
                    
// // //                     return (
// // //                       <View 
// // //                         key={index} 
// // //                         style={[
// // //                           styles.matchCard,
// // //                           { borderLeftColor: getRiskColor(match.risk_level) }
// // //                         ]}
// // //                       >
// // //                         <View style={styles.matchHeader}>
// // //                           <Text style={styles.matchTeams}>
// // //                             {match.home_team} vs {match.away_team}
// // //                           </Text>
// // //                           <View style={styles.matchRiskBadge}>
// // //                             <Text style={styles.riskEmoji}>
// // //                               {getRiskEmoji(match.risk_level)}
// // //                             </Text>
// // //                             <Text style={[
// // //                               styles.riskLevelText,
// // //                               { color: getRiskColor(match.risk_level) }
// // //                             ]}>
// // //                               {match.risk_level?.replace('_', ' ') || 'UNKNOWN'}
// // //                             </Text>
// // //                           </View>
// // //                         </View>

// // //                         <View style={styles.matchStats}>
// // //                           <View style={styles.matchStat}>
// // //                             <Text style={styles.matchStatLabel}>Risk Score</Text>
// // //                             <Text style={styles.matchStatValue}>{match.risk_score}%</Text>
// // //                           </View>
// // //                           <View style={styles.matchStat}>
// // //                             <Text style={styles.matchStatLabel}>Confidence</Text>
// // //                             <Text style={styles.matchStatValue}>
// // //                               {match.confidence || (100 - match.risk_score)}%
// // //                             </Text>
// // //                           </View>
// // //                         </View>

// // //                         {/* Injury Information */}
// // //                         {injuries.length > 0 && (
// // //                           <View style={styles.injuriesContainer}>
// // //                             <Text style={styles.injuriesTitle}>🚑 Injury Report</Text>
// // //                             {injuries.map((injury, injuryIndex) => (
// // //                               <View key={injuryIndex} style={styles.injuryItem}>
// // //                                 <Text style={styles.injuryTeam}>
// // //                                   {injury.team}: {injury.count} player{injury.count > 1 ? 's' : ''} injured
// // //                                 </Text>
// // //                                 {injury.players && injury.players.map((player, playerIndex) => (
// // //                                   <Text key={playerIndex} style={styles.injuryPlayer}>
// // //                                     • {player}
// // //                                   </Text>
// // //                                 ))}
// // //                               </View>
// // //                             ))}
// // //                           </View>
// // //                         )}

// // //                         {match.risk_insights && match.risk_insights.length > 0 && (
// // //                           <View style={styles.insightsContainer}>
// // //                             <Text style={styles.insightsTitle}>Key Insights:</Text>
// // //                             {match.risk_insights.slice(0, 3).map((insight, insightIndex) => (
// // //                               <View key={insightIndex} style={styles.insightItem}>
// // //                                 <Icon 
// // //                                   name="info" 
// // //                                   size={14} 
// // //                                   color={getRiskColor(match.risk_level)} 
// // //                                 />
// // //                                 <Text style={styles.insightText}>{insight}</Text>
// // //                               </View>
// // //                             ))}
// // //                           </View>
// // //                         )}

// // //                         {match.recommendation && (
// // //                           <View style={styles.recommendationBox}>
// // //                             <Icon 
// // //                               name="lightbulb" 
// // //                               size={16} 
// // //                               color={getRiskColor(match.risk_level)} 
// // //                             />
// // //                             <Text style={styles.recommendationText}>
// // //                               {match.recommendation}
// // //                             </Text>
// // //                           </View>
// // //                         )}
// // //                       </View>
// // //                     );
// // //                   })}
// // //                 </View>
// // //               ) : (
// // //                 <View style={styles.noMatchesSection}>
// // //                   <Icon name="search-off" size={40} color="#666" />
// // //                   <Text style={styles.noMatchesText}>No matches analyzed</Text>
// // //                 </View>
// // //               )}

// // //               {/* Achievements */}
// // //               {achievements.length > 0 && (
// // //                 <View style={styles.achievementsCard}>
// // //                   <View style={styles.achievementsHeader}>
// // //                     <Icon name="emoji-events" size={20} color="#FFD700" />
// // //                     <Text style={styles.achievementsTitle}>Achievements Unlocked</Text>
// // //                   </View>
// // //                   <View style={styles.achievementsList}>
// // //                     {achievements.map((achievement, index) => (
// // //                       <Text key={index} style={styles.achievementItem}>🏆 {achievement}</Text>
// // //                     ))}
// // //                   </View>
// // //                 </View>
// // //               )}

// // //               {/* Pro Tips */}
// // //               {proTips.length > 0 && (
// // //                 <View style={styles.tipsCard}>
// // //                   <View style={styles.tipsHeader}>
// // //                     <Icon name="tips-and-updates" size={20} color="#39FF14" />
// // //                     <Text style={styles.tipsTitle}>Pro Tips</Text>
// // //                   </View>
// // //                   {proTips.slice(0, 2).map((tip, index) => (
// // //                     <View key={index} style={styles.tipItem}>
// // //                       <Text style={styles.tipIcon}>{tip.icon}</Text>
// // //                       <View style={styles.tipContent}>
// // //                         <Text style={styles.tipText}>{tip.tip}</Text>
// // //                         <Text style={styles.tipAdvice}>{tip.advice}</Text>
// // //                         <Text style={styles.tipImpact}>{tip.impact}</Text>
// // //                       </View>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}

// // //               {/* User Risk Profile */}
// // //               {userRiskProfile.profile && (
// // //                 <View style={styles.profileCard}>
// // //                   <View style={styles.profileHeader}>
// // //                     <Icon name="person" size={20} color="#39FF14" />
// // //                     <Text style={styles.profileTitle}>Your Betting Profile</Text>
// // //                   </View>
// // //                   <Text style={styles.profileType}>{userRiskProfile.profile}</Text>
// // //                   <Text style={styles.profileDescription}>{userRiskProfile.description}</Text>
// // //                   <Text style={styles.profileTip}>💡 {userRiskProfile.tip}</Text>
// // //                 </View>
// // //               )}

// // //               {/* Action Buttons */}
// // //               <View style={styles.actionButtons}>
// // //                 <TouchableOpacity 
// // //                   style={styles.newScanButton}
// // //                   onPress={() => {
// // //                     setShowResultsModal(false);
// // //                     setSelectedImage(null);
// // //                     setBookingId('');
// // //                     setManualMatches([]);
// // //                     setAnalysisResult(null);
// // //                   }}
// // //                 >
// // //                   <Icon name="add" size={20} color="#000" />
// // //                   <Text style={styles.newScanButtonText}>New Analysis</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </ScrollView>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
// // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // //         {/* HEADER */}
// // //         <View style={styles.header}>
// // //           <Text style={styles.title}>Smart Bet Slip Analyzer</Text>
// // //           <Text style={styles.subtitle}>
// // //             Don't bet blind — let AI reveal your ticket's hidden risks.
// // //           </Text>
// // //         </View>

// // //         {/* SLIDING TESTIMONIALS SECTION */}
// // //         <View style={styles.testimonialsSection}>
// // //           <View style={styles.testimonialsHeader}>
// // //             <Icon name="star" size={20} color="#39FF14" />
// // //             <Text style={styles.testimonialsTitle}>Recent Winners</Text>
// // //           </View>
// // //           {renderTestimonial()}
// // //         </View>

// // //         {/* Booking ID Input */}
// // //         <View style={styles.bookingIdSection}>
// // //           <Text style={styles.sectionLabel}>Or enter Booking ID</Text>
// // //           <View style={styles.bookingIdInputContainer}>
// // //             <Icon name="receipt" size={22} color="#666666" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.bookingIdInput}
// // //               placeholder="Enter Bet9ja booking ID"
// // //               placeholderTextColor="#666666"
// // //               value={bookingId}
// // //               onChangeText={setBookingId}
// // //               editable={!isAnalyzing}
// // //             />
// // //           </View>
// // //         </View>
       
// // //         {/* Manual Input Section */}
// // //         <View style={styles.manualInputSection}>
// // //           <Text style={styles.sectionLabel}>Or Enter Matches Manually</Text>
          
// // //           <View style={styles.matchInputContainer}>
// // //             <Icon name="sports-soccer" size={22} color="#666666" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.matchInput}
// // //               placeholder="e.g., Arsenal vs Tottenham"
// // //               placeholderTextColor="#666666"
// // //               value={currentMatchInput}
// // //               onChangeText={setCurrentMatchInput}
// // //               onSubmitEditing={addManualMatch}
// // //               editable={!isAnalyzing}
// // //             />
// // //             <TouchableOpacity 
// // //               style={styles.addMatchButton} 
// // //               onPress={addManualMatch}
// // //               disabled={!currentMatchInput.trim() || isAnalyzing}
// // //             >
// // //               <Icon name="add" size={20} color="#fff" />
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           <Text style={styles.inputHint}>
// // //             Enter matches in format: Home Team vs Away Team
// // //           </Text>

// // //           {/* Display added matches */}
// // //           {manualMatches.length > 0 && (
// // //             <View style={styles.addedMatchesContainer}>
// // //               <Text style={styles.addedMatchesTitle}>
// // //                 Matches to Analyze ({manualMatches.length})
// // //               </Text>
// // //               {manualMatches.map((match, index) => (
// // //                 <View key={index} style={styles.addedMatchItem}>
// // //                   <Text style={styles.addedMatchText}>
// // //                     {match.homeTeam} vs {match.awayTeam}
// // //                   </Text>
// // //                   <TouchableOpacity 
// // //                     onPress={() => removeManualMatch(index)}
// // //                     style={styles.removeMatchButton}
// // //                     disabled={isAnalyzing}
// // //                   >
// // //                     <Icon name="close" size={16} color="#FF4444" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           )}
// // //         </View>

// // //         {/* Upload Section */}
// // //         <View style={styles.uploadSection}>
// // //           <TouchableOpacity
// // //             style={styles.uploadCard}
// // //             onPress={handleImageSelect}
// // //             disabled={isAnalyzing}
// // //           >
// // //             {selectedImage ? (
// // //               <View style={styles.imagePreview}>
// // //                 <Icon name="check-circle" size={50} color="#39FF14" />
// // //                 <Text style={styles.uploadSuccess}>Bet Slip Ready for Analysis</Text>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.uploadPlaceholder}>
// // //                 <Icon name="cloud-upload" size={60} color="#39FF14" />
// // //                 <Text style={styles.uploadText}>Tap to Upload Bet Slip</Text>
// // //                 <Text style={styles.uploadSubtext}>
// // //                   Take photo or select from gallery
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </TouchableOpacity>

// // //           <View style={styles.supportedBooks}>
// // //             <Text style={styles.supportedTitle}>Supported Bookmakers:</Text>
// // //             <View style={styles.bookmakerList}>
// // //               <Text style={styles.bookmakerItem}>Bet9ja</Text>
// // //               <Text style={styles.bookmakerItem}>SportyBet</Text>
// // //               <Text style={styles.bookmakerItem}>Nairabet</Text>
// // //               <Text style={styles.bookmakerItem}>1xBet</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Analyze Button */}
// // //         <TouchableOpacity
// // //           style={[
// // //             styles.analyzeButton,
// // //             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
// // //           ]}
// // //           onPress={handleAnalyze}
// // //           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
// // //         >
// // //           {isAnalyzing ? (
// // //             <ActivityIndicator color="#000000" />
// // //           ) : (
// // //             <View style={styles.analyzeContent}>
// // //               <Icon name="search" size={20} color="#000" />
// // //               <Text style={styles.analyzeButtonText}>
// // //                 {manualMatches.length > 0 ? `Analyze ${manualMatches.length} Match${manualMatches.length > 1 ? 'es' : ''}` : 'Analyze Bet Slip'}
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>

// // //         {/* Guarantee */}
// // //         <Text style={styles.guaranteeText}>
// // //           Stop losing tickets due to unseen risks — let AI protect your stake.
// // //         </Text>
// // //       </ScrollView>

// // //       {/* Scanning Modal */}
// // //       <Modal
// // //         visible={showScanModal}
// // //         transparent={true}
// // //         animationType="fade"
// // //         statusBarTranslucent={true}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.scanModal}>
// // //             <View style={styles.scanHeader}>
// // //               <Text style={styles.scanTitle}>Analyzing Your Bet Slip</Text>
// // //               <Text style={styles.scanSubtitle}>AI is scanning for risks and opportunities</Text>
// // //             </View>

// // //             {/* Scanning Animation */}
// // //             <View style={styles.scanAnimation}>
// // //               <Icon name="search" size={80} color="#39FF14" />
// // //               <View style={styles.pulseCircle} />
// // //             </View>

// // //             {/* Progress Bar */}
// // //             <View style={styles.progressContainer}>
// // //               <View style={styles.progressBackground}>
// // //                 <Animated.View 
// // //                   style={[
// // //                     styles.progressFill,
// // //                     {
// // //                       width: progressAnim.interpolate({
// // //                         inputRange: [0, 100],
// // //                         outputRange: ['0%', '100%'],
// // //                       })
// // //                     }
// // //                   ]} 
// // //                 />
// // //               </View>
// // //               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
// // //             </View>

// // //             {/* Scanning Steps */}
// // //             <View style={styles.scanSteps}>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 25 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Reading Bet Slip</Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 50 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Analyzing Teams</Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 75 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Checking Odds</Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 100 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Generating Report</Text>
// // //               </View>
// // //             </View>

// // //             <Text style={styles.scanTip}>
// // //               Our AI compares your slip with thousands of successful bets
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </Modal>

// // //       {/* Results Modal */}
// // //       {renderResultsModal()}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// //   // container: { 
// //   //   flex: 1, 
// //   //   backgroundColor: '#000', 
// //   // },
// //   // scrollView: {
// //   //   flex: 1,
// //   //   padding: 20,
// //   // },
// //   // header: { 
// //   //   alignItems: 'center', 
// //   //   marginBottom: 25,
// //   //   marginTop: 10,
// //   // },
// //   // title: { 
// //   //   fontSize: 28, 
// //   //   fontWeight: 'bold', 
// //   //   color: '#fff', 
// //   //   marginBottom: 8,
// //   //   textAlign: 'center',
// //   // },
// //   // subtitle: { 
// //   //   fontSize: 16, 
// //   //   color: '#a6a5a5', 
// //   //   textAlign: 'center',
// //   //   lineHeight: 22,
// //   // },

// //   // // Testimonials Section
// //   // testimonialsSection: {
// //   //   backgroundColor: '#111',
// //   //   borderRadius: 16,
// //   //   padding: 20,
// //   //   marginBottom: 25,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#39FF14',
// //   // },
// //   // testimonialsHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 15,
// //   // },
// //   // testimonialsTitle: {
// //   //   fontSize: 18,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 8,
// //   // },
// //   // testimonialSlide: {
// //   //   alignItems: 'center',
// //   // },
// //   // testimonialHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 12,
// //   // },
// //   // winAmount: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 8,
// //   // },
// //   // testimonialText: { 
// //   //   color: '#fff', 
// //   //   fontStyle: 'italic', 
// //   //   fontSize: 15, 
// //   //   lineHeight: 22,
// //   //   textAlign: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // testimonialAuthor: { 
// //   //   color: '#39FF14', 
// //   //   marginBottom: 15,
// //   //   fontWeight: '600',
// //   //   fontSize: 14,
// //   // },
// //   // testimonialIndicators: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'center',
// //   //   alignItems: 'center',
// //   // },
// //   // indicator: {
// //   //   width: 6,
// //   //   height: 6,
// //   //   borderRadius: 3,
// //   //   backgroundColor: '#333',
// //   //   marginHorizontal: 3,
// //   // },
// //   // indicatorActive: {
// //   //   backgroundColor: '#39FF14',
// //   //   width: 20,
// //   // },

// //   // // Booking ID Section
// //   // bookingIdSection: {
// //   //   marginBottom: 25,
// //   // },
// //   // sectionLabel: {
// //   //   fontSize: 16,
// //   //   color: '#39FF14',
// //   //   fontWeight: '600',
// //   //   marginBottom: 10,
// //   // },
// //   // bookingIdInputContainer: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   backgroundColor: '#111',
// //   //   borderRadius: 12,
// //   //   borderWidth: 1,
// //   //   borderColor: '#39FF14',
// //   // },
// //   // bookingIdInput: {
// //   //   flex: 1,
// //   //   color: '#fff',
// //   //   fontSize: 16,
// //   //   paddingVertical: 15,
// //   //   paddingHorizontal: 15,
// //   // },

// //   // // Manual Input Section
// //   // manualInputSection: {
// //   //   marginBottom: 25,
// //   // },
// //   // matchInputContainer: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   backgroundColor: '#111',
// //   //   borderRadius: 12,
// //   //   borderWidth: 1,
// //   //   borderColor: '#39FF14',
// //   //   marginBottom: 10,
// //   // },
// //   // matchInput: {
// //   //   flex: 1,
// //   //   color: '#fff',
// //   //   fontSize: 16,
// //   //   paddingVertical: 15,
// //   //   paddingHorizontal: 15,
// //   // },
// //   // addMatchButton: {
// //   //   backgroundColor: '#39FF14',
// //   //   padding: 12,
// //   //   margin: 8,
// //   //   borderRadius: 8,
// //   // },
// //   // inputHint: {
// //   //   color: '#666',
// //   //   fontSize: 12,
// //   //   marginBottom: 10,
// //   //   fontStyle: 'italic',
// //   // },
// //   // addedMatchesContainer: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   borderWidth: 1,
// //   //   borderColor: '#39FF14',
// //   // },
// //   // addedMatchesTitle: {
// //   //   color: '#39FF14',
// //   //   fontSize: 14,
// //   //   fontWeight: '600',
// //   //   marginBottom: 10,
// //   // },
// //   // addedMatchItem: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'space-between',
// //   //   alignItems: 'center',
// //   //   paddingVertical: 8,
// //   //   borderBottomWidth: 1,
// //   //   borderBottomColor: '#333',
// //   // },
// //   // addedMatchText: {
// //   //   color: '#fff',
// //   //   fontSize: 14,
// //   //   flex: 1,
// //   // },
// //   // removeMatchButton: {
// //   //   padding: 6,
// //   //   marginLeft: 10,
// //   // },

// //   // // Upload Section
// //   // uploadSection: { marginBottom: 25 },
// //   // uploadCard: {
// //   //   backgroundColor: '#111',
// //   //   borderWidth: 2,
// //   //   borderColor: '#333',
// //   //   borderStyle: 'dashed',
// //   //   borderRadius: 16,
// //   //   padding: 40,
// //   //   alignItems: 'center',
// //   //   justifyContent: 'center',
// //   //   marginBottom: 20,
// //   // },
// //   // uploadPlaceholder: { alignItems: 'center' },
// //   // uploadText: {
// //   //   fontSize: 18,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginTop: 15,
// //   //   marginBottom: 5,
// //   // },
// //   // uploadSubtext: { fontSize: 14, color: '#CCC', textAlign: 'center' },
// //   // imagePreview: { alignItems: 'center' },
// //   // uploadSuccess: {
// //   //   fontSize: 16,
// //   //   color: '#39FF14',
// //   //   fontWeight: 'bold',
// //   //   marginTop: 10,
// //   // },

// //   // supportedBooks: { alignItems: 'center' },
// //   // supportedTitle: { fontSize: 14, color: '#39FF14', marginBottom: 10, fontWeight: '600' },
// //   // bookmakerList: {
// //   //   flexDirection: 'row',
// //   //   flexWrap: 'wrap',
// //   //   justifyContent: 'center',
// //   // },
// //   // bookmakerItem: {
// //   //   backgroundColor: '#222',
// //   //   color: '#fff',
// //   //   paddingHorizontal: 12,
// //   //   paddingVertical: 6,
// //   //   borderRadius: 12,
// //   //   margin: 4,
// //   //   fontSize: 12,
// //   //   fontWeight: '500',
// //   // },

// //   // // Analyze Button
// //   // analyzeButton: {
// //   //   backgroundColor: '#39FF14',
// //   //   padding: 18,
// //   //   borderRadius: 16,
// //   //   alignItems: 'center',
// //   //   marginBottom: 12,
// //   // },
// //   // analyzeButtonDisabled: { backgroundColor: '#333' },
// //   // analyzeContent: { flexDirection: 'row', alignItems: 'center' },
// //   // analyzeButtonText: {
// //   //   color: '#000',
// //   //   fontSize: 18,
// //   //   fontWeight: 'bold',
// //   //   marginLeft: 10,
// //   // },

// //   // guaranteeText: {
// //   //   color: '#39FF14',
// //   //   textAlign: 'center',
// //   //   fontSize: 14,
// //   //   fontWeight: '600',
// //   //   marginBottom: 20,
// //   // },

// //   // // Modal Styles
// //   // modalOverlay: {
// //   //   flex: 1,
// //   //   backgroundColor: 'rgba(0, 0, 0, 0.9)',
// //   //   justifyContent: 'center',
// //   //   alignItems: 'center',
// //   //   padding: 10,
// //   // },
// //   // scanModal: {
// //   //   backgroundColor: '#111',
// //   //   borderRadius: 20,
// //   //   padding: 30,
// //   //   width: '100%',
// //   //   maxWidth: 400,
// //   //   alignItems: 'center',
// //   //   borderWidth: 2,
// //   //   borderColor: '#39FF14',
// //   // },
// //   // scanHeader: {
// //   //   alignItems: 'center',
// //   //   marginBottom: 30,
// //   // },
// //   // scanTitle: {
// //   //   fontSize: 24,
// //   //   fontWeight: 'bold',
// //   //   color: '#fff',
// //   //   marginBottom: 8,
// //   //   textAlign: 'center',
// //   // },
// //   // scanSubtitle: {
// //   //   fontSize: 14,
// //   //   color: '#ccc',
// //   //   textAlign: 'center',
// //   //   lineHeight: 20,
// //   // },
// //   // scanAnimation: {
// //   //   alignItems: 'center',
// //   //   marginBottom: 30,
// //   //   position: 'relative',
// //   // },
// //   // pulseCircle: {
// //   //   position: 'absolute',
// //   //   width: 100,
// //   //   height: 100,
// //   //   borderRadius: 50,
// //   //   backgroundColor: 'rgba(57, 255, 20, 0.2)',
// //   //   top: -10,
// //   // },
// //   // progressContainer: {
// //   //   width: '100%',
// //   //   marginBottom: 25,
// //   // },
// //   // progressBackground: {
// //   //   height: 8,
// //   //   backgroundColor: '#333',
// //   //   borderRadius: 4,
// //   //   overflow: 'hidden',
// //   //   marginBottom: 10,
// //   // },
// //   // progressFill: {
// //   //   height: '100%',
// //   //   backgroundColor: '#39FF14',
// //   //   borderRadius: 4,
// //   // },
// //   // progressText: {
// //   //   color: '#fff',
// //   //   fontSize: 14,
// //   //   fontWeight: '600',
// //   //   textAlign: 'center',
// //   // },
// //   // scanSteps: {
// //   //   width: '100%',
// //   //   marginBottom: 20,
// //   // },
// //   // scanStep: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 12,
// //   // },
// //   // scanStepText: {
// //   //   color: '#fff',
// //   //   marginLeft: 12,
// //   //   fontSize: 14,
// //   //   fontWeight: '500',
// //   // },
// //   // scanTip: {
// //   //   color: '#39FF14',
// //   //   fontSize: 12,
// //   //   textAlign: 'center',
// //   //   fontStyle: 'italic',
// //   //   lineHeight: 18,
// //   // },

// //   // // Results Modal Styles
// //   // resultsModal: {
// //   //   backgroundColor: '#111',
// //   //   borderRadius: 20,
// //   //   width: '100%',
// //   //   maxWidth: 400,
// //   //   height: '85%',
// //   //   borderWidth: 2,
// //   //   borderColor: '#39FF14',
// //   //   overflow: 'hidden',
// //   // },
// //   // resultsHeader: {
// //   //   padding: 20,
// //   //   borderBottomWidth: 1,
// //   //   borderBottomColor: '#333',
// //   //   alignItems: 'center',
// //   //   backgroundColor: '#111',
// //   // },
// //   // closeButton: {
// //   //   position: 'absolute',
// //   //   top: 20,
// //   //   right: 20,
// //   //   zIndex: 1,
// //   // },
// //   // resultsTitle: {
// //   //   fontSize: 24,
// //   //   fontWeight: 'bold',
// //   //   color: '#fff',
// //   //   textAlign: 'center',
// //   //   marginBottom: 8,
// //   // },
// //   // resultsSubtitle: {
// //   //   fontSize: 14,
// //   //   color: '#ccc',
// //   //   textAlign: 'center',
// //   //   lineHeight: 20,
// //   // },
// //   // resultsContent: {
// //   //   flex: 1,
// //   // },
// //   // resultsContentContainer: {
// //   //   padding: 15,
// //   //   paddingBottom: 30,
// //   // },

// //   // // AI Confidence Card - Prominent
// //   // confidenceCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 20,
// //   //   borderRadius: 16,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#39FF14',
// //   //   borderRightWidth: 4,
// //   //   borderRightColor: '#39FF14',
// //   // },
// //   // confidenceHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 15,
// //   //   justifyContent: 'center',
// //   // },
// //   // confidenceTitle: {
// //   //   fontSize: 18,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 10,
// //   //   textAlign: 'center',
// //   // },
// //   // confidenceScoreContainer: {
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // confidenceScore: {
// //   //   fontSize: 42,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginBottom: 10,
// //   // },
// //   // confidenceMeter: {
// //   //   width: '100%',
// //   //   height: 12,
// //   //   backgroundColor: '#333',
// //   //   borderRadius: 6,
// //   //   overflow: 'hidden',
// //   // },
// //   // confidenceFill: {
// //   //   height: '100%',
// //   //   backgroundColor: '#39FF14',
// //   //   borderRadius: 6,
// //   // },
// //   // confidenceDescription: {
// //   //   color: '#fff',
// //   //   fontSize: 14,
// //   //   textAlign: 'center',
// //   //   fontWeight: '500',
// //   //   marginTop: 10,
// //   // },

// //   // // Health Card
// //   // healthCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 20,
// //   //   borderRadius: 16,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#39FF14',
// //   // },
// //   // healthHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // healthEmoji: {
// //   //   fontSize: 32,
// //   //   marginRight: 12,
// //   // },
// //   // healthTextContainer: {
// //   //   flex: 1,
// //   // },
// //   // healthTitle: {
// //   //   fontSize: 16,
// //   //   color: '#ccc',
// //   //   marginBottom: 4,
// //   //   fontWeight: '600',
// //   // },
// //   // healthScore: {
// //   //   fontSize: 20,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   // },
// //   // healthMessage: {
// //   //   color: '#fff',
// //   //   fontSize: 14,
// //   //   marginBottom: 15,
// //   //   lineHeight: 20,
// //   // },
// //   // healthStats: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'space-between',
// //   // },
// //   // healthStat: {
// //   //   alignItems: 'center',
// //   // },
// //   // healthStatLabel: {
// //   //   color: '#ccc',
// //   //   fontSize: 12,
// //   //   marginBottom: 4,
// //   // },
// //   // healthStatValue: {
// //   //   color: '#fff',
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   // },

// //   // // Insights Card
// //   // insightsCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#39FF14',
// //   // },
// //   // insightsHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // insightsTitle: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 8,
// //   // },
// //   // insightText: {
// //   //   color: '#ccc',
// //   //   fontSize: 12,
// //   //   marginBottom: 6,
// //   //   lineHeight: 16,
// //   // },

// //   // // Risk Distribution
// //   // riskDistributionCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   // },
// //   // sectionTitle: {
// //   //   fontSize: 18,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginBottom: 15,
// //   // },
// //   // riskBars: {
// //   //   gap: 10,
// //   // },
// //   // riskBar: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   // },
// //   // riskBarFill: {
// //   //   height: 8,
// //   //   borderRadius: 4,
// //   //   marginRight: 10,
// //   // },
// //   // lowRisk: { backgroundColor: '#39FF14' },
// //   // mediumRisk: { backgroundColor: '#FFA500' },
// //   // highRisk: { backgroundColor: '#FF4444' },
// //   // riskBarLabel: {
// //   //   color: '#fff',
// //   //   fontSize: 12,
// //   //   fontWeight: '500',
// //   // },

// //   // // Suggestions Card
// //   // suggestionsCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#FFD700',
// //   // },
// //   // suggestionsHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // suggestionsTitle: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#FFD700',
// //   //   marginLeft: 8,
// //   // },
// //   // suggestionItem: {
// //   //   marginBottom: 12,
// //   // },
// //   // suggestionTitle: {
// //   //   color: '#FFD700',
// //   //   fontSize: 14,
// //   //   fontWeight: 'bold',
// //   //   marginBottom: 6,
// //   // },
// //   // suggestionAction: {
// //   //   color: '#ccc',
// //   //   fontSize: 12,
// //   //   marginBottom: 3,
// //   //   marginLeft: 10,
// //   // },
// //   // suggestionImprovement: {
// //   //   color: '#39FF14',
// //   //   fontSize: 11,
// //   //   fontWeight: '500',
// //   //   marginTop: 4,
// //   // },
// //   // suggestionImpact: {
// //   //   color: '#ccc',
// //   //   fontSize: 10,
// //   //   fontStyle: 'italic',
// //   // },

// //   // // Matches Section
// //   // matchesSection: {
// //   //   marginBottom: 15,
// //   // },
// //   // matchCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 12,
// //   //   borderLeftWidth: 4,
// //   // },
// //   // matchHeader: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'space-between',
// //   //   alignItems: 'flex-start',
// //   //   marginBottom: 10,
// //   // },
// //   // matchTeams: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#fff',
// //   //   flex: 1,
// //   //   marginRight: 10,
// //   // },
// //   // matchRiskBadge: {
// //   //   alignItems: 'center',
// //   // },
// //   // riskEmoji: {
// //   //   fontSize: 16,
// //   //   marginBottom: 4,
// //   // },
// //   // riskLevelText: {
// //   //   fontSize: 10,
// //   //   fontWeight: 'bold',
// //   //   textAlign: 'center',
// //   // },
// //   // matchStats: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'space-around',
// //   //   marginBottom: 10,
// //   //   paddingVertical: 8,
// //   //   borderTopWidth: 1,
// //   //   borderBottomWidth: 1,
// //   //   borderColor: '#333',
// //   // },
// //   // matchStat: {
// //   //   alignItems: 'center',
// //   // },
// //   // matchStatLabel: {
// //   //   color: '#ccc',
// //   //   fontSize: 10,
// //   //   marginBottom: 4,
// //   // },
// //   // matchStatValue: {
// //   //   color: '#fff',
// //   //   fontSize: 14,
// //   //   fontWeight: 'bold',
// //   // },

// //   // // Injuries Section
// //   // injuriesContainer: {
// //   //   backgroundColor: 'rgba(255, 68, 68, 0.1)',
// //   //   padding: 10,
// //   //   borderRadius: 8,
// //   //   marginBottom: 10,
// //   //   borderLeftWidth: 3,
// //   //   borderLeftColor: '#FF4444',
// //   // },
// //   // injuriesTitle: {
// //   //   color: '#FF4444',
// //   //   fontSize: 12,
// //   //   fontWeight: 'bold',
// //   //   marginBottom: 6,
// //   // },
// //   // injuryItem: {
// //   //   marginBottom: 8,
// //   // },
// //   // injuryTeam: {
// //   //   color: '#FF4444',
// //   //   fontSize: 11,
// //   //   fontWeight: 'bold',
// //   //   marginBottom: 4,
// //   // },
// //   // injuryPlayer: {
// //   //   color: '#ccc',
// //   //   fontSize: 10,
// //   //   marginLeft: 8,
// //   //   marginBottom: 2,
// //   // },

// //   // insightsContainer: {
// //   //   marginBottom: 10,
// //   // },
// //   // insightsTitle: {
// //   //   color: '#39FF14',
// //   //   fontSize: 12,
// //   //   fontWeight: 'bold',
// //   //   marginBottom: 6,
// //   // },
// //   // insightItem: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'flex-start',
// //   //   marginBottom: 4,
// //   // },
// //   // insightText: {
// //   //   color: '#ccc',
// //   //   fontSize: 11,
// //   //   marginLeft: 6,
// //   //   flex: 1,
// //   //   lineHeight: 14,
// //   // },
// //   // recommendationBox: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   backgroundColor: 'rgba(57, 255, 20, 0.1)',
// //   //   padding: 10,
// //   //   borderRadius: 8,
// //   //   borderLeftWidth: 3,
// //   //   borderLeftColor: '#39FF14',
// //   // },
// //   // recommendationText: {
// //   //   color: '#fff',
// //   //   fontSize: 12,
// //   //   marginLeft: 8,
// //   //   flex: 1,
// //   //   lineHeight: 16,
// //   // },

// //   // // No Matches Section
// //   // noMatchesSection: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 30,
// //   //   borderRadius: 12,
// //   //   alignItems: 'center',
// //   //   marginBottom: 15,
// //   // },
// //   // noMatchesText: {
// //   //   color: '#666',
// //   //   fontSize: 16,
// //   //   marginTop: 10,
// //   // },

// //   // // Achievements Card
// //   // achievementsCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#FFD700',
// //   // },
// //   // achievementsHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // achievementsTitle: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#FFD700',
// //   //   marginLeft: 8,
// //   // },
// //   // achievementsList: {
// //   //   gap: 6,
// //   // },
// //   // achievementItem: {
// //   //   color: '#FFD700',
// //   //   fontSize: 12,
// //   //   fontWeight: '500',
// //   // },

// //   // // Tips Card
// //   // tipsCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   // },
// //   // tipsHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // tipsTitle: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 8,
// //   // },
// //   // tipItem: {
// //   //   flexDirection: 'row',
// //   //   marginBottom: 12,
// //   // },
// //   // tipIcon: {
// //   //   fontSize: 20,
// //   //   marginRight: 10,
// //   // },
// //   // tipContent: {
// //   //   flex: 1,
// //   // },
// //   // tipText: {
// //   //   color: '#fff',
// //   //   fontSize: 13,
// //   //   fontWeight: '500',
// //   //   marginBottom: 4,
// //   // },
// //   // tipAdvice: {
// //   //   color: '#ccc',
// //   //   fontSize: 11,
// //   //   marginBottom: 4,
// //   //   lineHeight: 14,
// //   // },
// //   // tipImpact: {
// //   //   color: '#39FF14',
// //   //   fontSize: 10,
// //   //   fontWeight: '500',
// //   // },

// //   // // Profile Card
// //   // profileCard: {
// //   //   backgroundColor: '#1a1a1a',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   marginBottom: 15,
// //   //   borderLeftWidth: 4,
// //   //   borderLeftColor: '#39FF14',
// //   // },
// //   // profileHeader: {
// //   //   flexDirection: 'row',
// //   //   alignItems: 'center',
// //   //   marginBottom: 10,
// //   // },
// //   // profileTitle: {
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   color: '#39FF14',
// //   //   marginLeft: 8,
// //   // },
// //   // profileType: {
// //   //   color: '#fff',
// //   //   fontSize: 16,
// //   //   fontWeight: 'bold',
// //   //   marginBottom: 6,
// //   // },
// //   // profileDescription: {
// //   //   color: '#ccc',
// //   //   fontSize: 12,
// //   //   marginBottom: 8,
// //   //   lineHeight: 16,
// //   // },
// //   // profileTip: {
// //   //   color: '#39FF14',
// //   //   fontSize: 11,
// //   //   fontStyle: 'italic',
// //   // },

// //   // // Action Buttons
// //   // actionButtons: {
// //   //   marginTop: 10,
// //   // },
// //   // newScanButton: {
// //   //   flexDirection: 'row',
// //   //   backgroundColor: '#39FF14',
// //   //   padding: 15,
// //   //   borderRadius: 12,
// //   //   alignItems: 'center',
// //   //   justifyContent: 'center',
// //   // },
// //   // newScanButtonText: {
// //   //   color: '#000',
// //   //   fontWeight: 'bold',
// //   //   marginLeft: 8,
// //   // },
// // // });

// // // export default AnalysisScreen;


// // // import React, { useState, useRef, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StatusBar,
// // //   Image,
// // //   Animated,
// // //   Easing,
// // //   Dimensions,
// // //   Modal,
// // //   Alert,
// // //   TextInput,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // // const { width } = Dimensions.get('window');
// // // const API_BASE_URL = 'http://192.168.43.73:8000/api';

// // // const AnalysisScreen = ({ navigation }) => {
// // //   const [selectedImage, setSelectedImage] = useState(null);
// // //   const [bookingId, setBookingId] = useState('');
// // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // //   const [showScanModal, setShowScanModal] = useState(false);
// // //   const [showResultsModal, setShowResultsModal] = useState(false);
// // //   const [scanProgress, setScanProgress] = useState(0);
// // //   const [analysisResult, setAnalysisResult] = useState(null);
// // //   const [currentTestimonial, setCurrentTestimonial] = useState(0);
// // //   const [showImageOptions, setShowImageOptions] = useState(false);

// // //   const slideAnim = useRef(new Animated.Value(0)).current;
// // //   const progressAnim = useRef(new Animated.Value(0)).current;
// // //   const [manualMatches, setManualMatches] = useState([]);
// // //   const [currentMatchInput, setCurrentMatchInput] = useState('');

// // //   // Testimonials data
// // //   const testimonials = [
// // //     {
// // //       id: 1,
// // //       text: "I scanned my bet before placing it — the AI flagged 2 risky picks. I changed them and ended up winning ₦45,000!",
// // //       author: "Emmanuel, Lagos",
// // //       amount: "₦45,000"
// // //     },
// // //     {
// // //       id: 2,
// // //       text: "This app saved me from losing ₦20,000! The analysis showed one game was too risky. I removed it and won!",
// // //       author: "Sarah, Abuja",
// // //       amount: "₦20,000"
// // //     },
// // //     {
// // //       id: 3,
// // //       text: "Never betting blind again! The AI analysis helped me spot bad odds and I turned ₦500 into ₦15,000!",
// // //       author: "Mike, Port Harcourt",
// // //       amount: "₦15,000"
// // //     }
// // //   ];

// // //   // Image Picker Options
// // //   const imagePickerOptions = {
// // //     mediaType: 'photo',
// // //     quality: 0.8,
// // //     maxWidth: 1024,
// // //     maxHeight: 1024,
// // //     includeBase64: true, // Important for sending to backend
// // //   };

// // //   // Auto-rotate testimonials
// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setCurrentTestimonial((prev) => 
// // //         prev === testimonials.length - 1 ? 0 : prev + 1
// // //       );
// // //     }, 4000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   // Animate testimonial slide
// // //   useEffect(() => {
// // //     Animated.timing(slideAnim, {
// // //       toValue: 1,
// // //       duration: 500,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, [currentTestimonial]);

// // //   // Enhanced Image Selection with Camera and Gallery Options
// // //   const handleImageSelect = () => {
// // //     setShowImageOptions(true);
// // //   };

// // //   const takePhoto = () => {
// // //     setShowImageOptions(false);
// // //     launchCamera(imagePickerOptions, (response) => {
// // //       if (response.didCancel) {
// // //         console.log('User cancelled camera');
// // //       } else if (response.error) {
// // //         console.log('Camera Error: ', response.error);
// // //         Alert.alert('Error', 'Failed to take photo. Please try again.');
// // //       } else if (response.assets && response.assets[0]) {
// // //         const imageUri = response.assets[0].uri;
// // //         setSelectedImage(imageUri);
// // //         Alert.alert(
// // //           'Photo Taken', 
// // //           'Bet slip photo ready for AI analysis with Gemini Vision',
// // //           [{ text: 'OK' }]
// // //         );
// // //       }
// // //     });
// // //   };

// // //   const chooseFromGallery = () => {
// // //     setShowImageOptions(false);
// // //     launchImageLibrary(imagePickerOptions, (response) => {
// // //       if (response.didCancel) {
// // //         console.log('User cancelled image picker');
// // //       } else if (response.error) {
// // //         console.log('ImagePicker Error: ', response.error);
// // //         Alert.alert('Error', 'Failed to select image. Please try again.');
// // //       } else if (response.assets && response.assets[0]) {
// // //         const imageUri = response.assets[0].uri;
// // //         setSelectedImage(imageUri);
// // //         Alert.alert(
// // //           'Image Selected', 
// // //           'Bet slip image ready for AI analysis with Gemini Vision',
// // //           [{ text: 'OK' }]
// // //         );
// // //       }
// // //     });
// // //   };

// // //   const addManualMatch = () => {
// // //     if (!currentMatchInput.trim()) return;

// // //     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
// // //     const match = currentMatchInput.match(matchRegex);

// // //     if (match) {
// // //       const homeTeam = match[1].trim();
// // //       const awayTeam = match[2].trim();
      
// // //       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
// // //       setCurrentMatchInput('');
// // //     } else {
// // //       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
// // //     }
// // //   };

// // //   const removeManualMatch = (index) => {
// // //     setManualMatches(prev => prev.filter((_, i) => i !== index));
// // //   };

// // //   const handleAnalyze = async () => {
// // //     const hasImage = !!selectedImage;
// // //     const hasBookingId = !!bookingId;
// // //     const hasManualMatches = manualMatches.length > 0;

// // //     if (!hasImage && !hasBookingId && !hasManualMatches) {
// // //       Alert.alert('No Input', 'Please upload a bet slip, enter booking ID, or add matches manually');
// // //       return;
// // //     }

// // //     setIsAnalyzing(true);
// // //     setShowScanModal(true);
// // //     startScanAnimation();

// // //     try {
// // //       let response;
// // //       const token = await AsyncStorage.getItem('access_token');

// // //       if (hasManualMatches) {
// // //         console.log('Using manual matches analysis with:', manualMatches);
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({
// // //             matches: manualMatches,
// // //           }),
// // //         });
// // //       } else if (selectedImage) {
// // //         // Create FormData for image upload
// // //         const formData = new FormData();
        
// // //         // Get filename from URI
// // //         const filename = selectedImage.split('/').pop();
// // //         const match = /\.(\w+)$/.exec(filename);
// // //         const type = match ? `image/${match[1]}` : `image/jpeg`;

// // //         formData.append('image', {
// // //           uri: selectedImage,
// // //           type: type,
// // //           name: filename || 'bet_slip.jpg',
// // //         });
        
// // //         if (bookingId) {
// // //           formData.append('booking_id', bookingId);
// // //         }

// // //         response = await fetch(`${API_BASE_URL}/bets/slips/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'multipart/form-data',
// // //           },
// // //           body: formData,
// // //         });
// // //       } else {
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({
// // //             booking_id: bookingId,
// // //           }),
// // //         });
// // //       }

// // //       const result = await response.json();
      
// // //       console.log('Analysis response:', result);

// // //       if (response.ok) {
// // //         setAnalysisResult(result);
// // //         setTimeout(() => {
// // //           setShowScanModal(false);
// // //           setShowResultsModal(true);
// // //         }, 500);
// // //       } else {
// // //         throw new Error(result.error || 'Analysis failed');
// // //       }
// // //     } catch (error) {
// // //       console.error('Analysis error:', error);
// // //       Alert.alert('Error', 'Analysis failed. Please try again.');
// // //       setShowScanModal(false);
// // //     } finally {
// // //       setIsAnalyzing(false);
// // //     }
// // //   };

// // //   const startScanAnimation = () => {
// // //     setScanProgress(0);
// // //     progressAnim.setValue(0);
    
// // //     const duration = 3000;
// // //     const interval = 100;
// // //     const steps = duration / interval;
// // //     let currentStep = 0;

// // //     const progressInterval = setInterval(() => {
// // //       currentStep++;
// // //       const progress = (currentStep / steps) * 100;
// // //       setScanProgress(progress);
      
// // //       Animated.timing(progressAnim, {
// // //         toValue: progress,
// // //         duration: interval,
// // //         useNativeDriver: false,
// // //       }).start();

// // //       if (currentStep >= steps) {
// // //         clearInterval(progressInterval);
// // //       }
// // //     }, interval);
// // //   };

// // //   const renderTestimonial = () => {
// // //     const testimonial = testimonials[currentTestimonial];
    
// // //     return (
// // //       <Animated.View 
// // //         style={[
// // //           styles.testimonialSlide,
// // //           {
// // //             opacity: slideAnim,
// // //             transform: [{
// // //               translateX: slideAnim.interpolate({
// // //                 inputRange: [0, 1],
// // //                 outputRange: [50, 0],
// // //               })
// // //             }]
// // //           }
// // //         ]}
// // //       >
// // //         <View style={styles.testimonialHeader}>
// // //           <Icon name="emoji-events" size={20} color="#39FF14" />
// // //           <Text style={styles.winAmount}>WON {testimonial.amount}</Text>
// // //         </View>
// // //         <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
// // //         <Text style={styles.testimonialAuthor}>— {testimonial.author}</Text>
        
// // //         <View style={styles.testimonialIndicators}>
// // //           {testimonials.map((_, index) => (
// // //             <View 
// // //               key={index}
// // //               style={[
// // //                 styles.indicator,
// // //                 index === currentTestimonial && styles.indicatorActive
// // //               ]}
// // //             />
// // //           ))}
// // //         </View>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   // Image Options Modal
// // //   const renderImageOptionsModal = () => (
// // //     <Modal
// // //       visible={showImageOptions}
// // //       transparent={true}
// // //       animationType="slide"
// // //       onRequestClose={() => setShowImageOptions(false)}
// // //     >
// // //       <View style={styles.imageOptionsOverlay}>
// // //         <View style={styles.imageOptionsModal}>
// // //           <Text style={styles.imageOptionsTitle}>Select Image Source</Text>
          
// // //           <TouchableOpacity 
// // //             style={styles.imageOptionButton}
// // //             onPress={takePhoto}
// // //           >
// // //             <Icon name="camera-alt" size={28} color="#39FF14" />
// // //             <Text style={styles.imageOptionText}>Take Photo</Text>
// // //           </TouchableOpacity>
          
// // //           <TouchableOpacity 
// // //             style={styles.imageOptionButton}
// // //             onPress={chooseFromGallery}
// // //           >
// // //             <Icon name="photo-library" size={28} color="#39FF14" />
// // //             <Text style={styles.imageOptionText}>Choose from Gallery</Text>
// // //           </TouchableOpacity>
          
// // //           <TouchableOpacity 
// // //             style={styles.cancelButton}
// // //             onPress={() => setShowImageOptions(false)}
// // //           >
// // //             <Text style={styles.cancelButtonText}>Cancel</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     </Modal>
// // //   );

// // //   const renderResultsModal = () => {
// // //     if (!analysisResult) return null;

// // //     // ... (keep your existing results modal rendering logic)
// // //     // This part remains the same as your original code
// // //     return (
// // //       <Modal
// // //         visible={showResultsModal}
// // //         transparent={true}
// // //         animationType="slide"
// // //         statusBarTranslucent={true}
// // //         onRequestClose={() => setShowResultsModal(false)}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.resultsModal}>
// // //             {/* Your existing results modal content */}
// // //             <Text style={styles.resultsTitle}>Analysis Complete</Text>
// // //             {/* ... rest of your results modal */}
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
// // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // //         {/* HEADER */}
// // //         <View style={styles.header}>
// // //           <Text style={styles.title}>Smart Bet Slip Analyzer</Text>
// // //           <Text style={styles.subtitle}>
// // //             Don't bet blind — let AI reveal your ticket's hidden risks.
// // //           </Text>
// // //         </View>

// // //         {/* SLIDING TESTIMONIALS SECTION */}
// // //         <View style={styles.testimonialsSection}>
// // //           <View style={styles.testimonialsHeader}>
// // //             <Icon name="star" size={20} color="#39FF14" />
// // //             <Text style={styles.testimonialsTitle}>Recent Winners</Text>
// // //           </View>
// // //           {renderTestimonial()}
// // //         </View>

// // //         {/* Booking ID Input */}
// // //         <View style={styles.bookingIdSection}>
// // //           <Text style={styles.sectionLabel}>Or enter Booking ID</Text>
// // //           <View style={styles.bookingIdInputContainer}>
// // //             <Icon name="receipt" size={22} color="#666666" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.bookingIdInput}
// // //               placeholder="Enter Bet9ja booking ID"
// // //               placeholderTextColor="#666666"
// // //               value={bookingId}
// // //               onChangeText={setBookingId}
// // //               editable={!isAnalyzing}
// // //             />
// // //           </View>
// // //         </View>
       
// // //         {/* Manual Input Section */}
// // //         <View style={styles.manualInputSection}>
// // //           <Text style={styles.sectionLabel}>Or Enter Matches Manually</Text>
          
// // //           <View style={styles.matchInputContainer}>
// // //             <Icon name="sports-soccer" size={22} color="#666666" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.matchInput}
// // //               placeholder="e.g., Arsenal vs Tottenham"
// // //               placeholderTextColor="#666666"
// // //               value={currentMatchInput}
// // //               onChangeText={setCurrentMatchInput}
// // //               onSubmitEditing={addManualMatch}
// // //               editable={!isAnalyzing}
// // //             />
// // //             <TouchableOpacity 
// // //               style={styles.addMatchButton} 
// // //               onPress={addManualMatch}
// // //               disabled={!currentMatchInput.trim() || isAnalyzing}
// // //             >
// // //               <Icon name="add" size={20} color="#fff" />
// // //             </TouchableOpacity>
// // //           </View>
          
// // //           <Text style={styles.inputHint}>
// // //             Enter matches in format: Home Team vs Away Team
// // //           </Text>

// // //           {/* Display added matches */}
// // //           {manualMatches.length > 0 && (
// // //             <View style={styles.addedMatchesContainer}>
// // //               <Text style={styles.addedMatchesTitle}>
// // //                 Matches to Analyze ({manualMatches.length})
// // //               </Text>
// // //               {manualMatches.map((match, index) => (
// // //                 <View key={index} style={styles.addedMatchItem}>
// // //                   <Text style={styles.addedMatchText}>
// // //                     {match.homeTeam} vs {match.awayTeam}
// // //                   </Text>
// // //                   <TouchableOpacity 
// // //                     onPress={() => removeManualMatch(index)}
// // //                     style={styles.removeMatchButton}
// // //                     disabled={isAnalyzing}
// // //                   >
// // //                     <Icon name="close" size={16} color="#FF4444" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           )}
// // //         </View>

// // //         {/* Upload Section */}
// // //         <View style={styles.uploadSection}>
// // //           <TouchableOpacity
// // //             style={styles.uploadCard}
// // //             onPress={handleImageSelect}
// // //             disabled={isAnalyzing}
// // //           >
// // //             {selectedImage ? (
// // //               <View style={styles.imagePreview}>
// // //                 <Image 
// // //                   source={{ uri: selectedImage }} 
// // //                   style={styles.previewImage}
// // //                   resizeMode="cover"
// // //                 />
// // //                 <View style={styles.imageOverlay}>
// // //                   <Icon name="check-circle" size={40} color="#39FF14" />
// // //                   <Text style={styles.uploadSuccess}>Bet Slip Ready for Analysis</Text>
// // //                   <Text style={styles.changePhotoText}>Tap to change photo</Text>
// // //                 </View>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.uploadPlaceholder}>
// // //                 <Icon name="camera-alt" size={50} color="#39FF14" />
// // //                 <Text style={styles.uploadText}>Tap to Upload Bet Slip</Text>
// // //                 <Text style={styles.uploadSubtext}>
// // //                   Take photo or select from gallery
// // //                 </Text>
// // //                 <View style={styles.uploadOptionsHint}>
// // //                   <Text style={styles.uploadOptionsText}>📷 Camera or 🖼️ Gallery</Text>
// // //                 </View>
// // //               </View>
// // //             )}
// // //           </TouchableOpacity>

// // //           <View style={styles.supportedBooks}>
// // //             <Text style={styles.supportedTitle}>Supported Bookmakers:</Text>
// // //             <View style={styles.bookmakerList}>
// // //               <Text style={styles.bookmakerItem}>Bet9ja</Text>
// // //               <Text style={styles.bookmakerItem}>SportyBet</Text>
// // //               <Text style={styles.bookmakerItem}>Nairabet</Text>
// // //               <Text style={styles.bookmakerItem}>1xBet</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Analyze Button */}
// // //         <TouchableOpacity
// // //           style={[
// // //             styles.analyzeButton,
// // //             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
// // //           ]}
// // //           onPress={handleAnalyze}
// // //           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
// // //         >
// // //           {isAnalyzing ? (
// // //             <ActivityIndicator color="#000000" />
// // //           ) : (
// // //             <View style={styles.analyzeContent}>
// // //               <Icon name="search" size={20} color="#000" />
// // //               <Text style={styles.analyzeButtonText}>
// // //                 {manualMatches.length > 0 ? `Analyze ${manualMatches.length} Match${manualMatches.length > 1 ? 'es' : ''}` : 
// // //                  selectedImage ? 'Analyze Bet Slip Image' : 'Analyze Booking ID'}
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>

// // //         {/* Guarantee */}
// // //         <Text style={styles.guaranteeText}>
// // //           Stop losing tickets due to unseen risks — let AI protect your stake.
// // //         </Text>
// // //       </ScrollView>

// // //       {/* Image Options Modal */}
// // //       {renderImageOptionsModal()}

// // //       {/* Scanning Modal */}
// // //       <Modal
// // //         visible={showScanModal}
// // //         transparent={true}
// // //         animationType="fade"
// // //         statusBarTranslucent={true}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.scanModal}>
// // //             <View style={styles.scanHeader}>
// // //               <Text style={styles.scanTitle}>Analyzing Your Bet Slip</Text>
// // //               <Text style={styles.scanSubtitle}>AI is scanning for risks and opportunities</Text>
// // //             </View>

// // //             {/* Scanning Animation */}
// // //             <View style={styles.scanAnimation}>
// // //               <Icon name="search" size={80} color="#39FF14" />
// // //               <View style={styles.pulseCircle} />
// // //             </View>

// // //             {/* Progress Bar */}
// // //             <View style={styles.progressContainer}>
// // //               <View style={styles.progressBackground}>
// // //                 <Animated.View 
// // //                   style={[
// // //                     styles.progressFill,
// // //                     {
// // //                       width: progressAnim.interpolate({
// // //                         inputRange: [0, 100],
// // //                         outputRange: ['0%', '100%'],
// // //                       })
// // //                     }
// // //                   ]} 
// // //                 />
// // //               </View>
// // //               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
// // //             </View>

// // //             {/* Scanning Steps */}
// // //             <View style={styles.scanSteps}>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 25 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>
// // //                   {selectedImage ? 'Reading Bet Slip Image' : 'Processing Input'}
// // //                 </Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 50 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Analyzing Teams with AI</Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 75 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Checking Odds & Risks</Text>
// // //               </View>
// // //               <View style={styles.scanStep}>
// // //                 <Icon 
// // //                   name="check-circle" 
// // //                   size={20} 
// // //                   color={scanProgress >= 100 ? "#39FF14" : "#666"} 
// // //                 />
// // //                 <Text style={styles.scanStepText}>Generating AI Report</Text>
// // //               </View>
// // //             </View>

// // //             <Text style={styles.scanTip}>
// // //               {selectedImage 
// // //                 ? "Our AI is analyzing your bet slip image with Gemini Vision technology"
// // //                 : "Our AI compares your slip with thousands of successful bets"
// // //               }
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </Modal>

// // //       {/* Results Modal */}
// // //       {renderResultsModal()}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //     container: { 
// // //     flex: 1, 
// // //     backgroundColor: '#000', 
// // //   },
// // //   scrollView: {
// // //     flex: 1,
// // //     padding: 20,
// // //   },
// // //   header: { 
// // //     alignItems: 'center', 
// // //     marginBottom: 25,
// // //     marginTop: 10,
// // //   },
// // //   title: { 
// // //     fontSize: 28, 
// // //     fontWeight: 'bold', 
// // //     color: '#fff', 
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   subtitle: { 
// // //     fontSize: 16, 
// // //     color: '#a6a5a5', 
// // //     textAlign: 'center',
// // //     lineHeight: 22,
// // //   },

// // //   // Testimonials Section
// // //   testimonialsSection: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     marginBottom: 25,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#39FF14',
// // //   },
// // //   testimonialsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 15,
// // //   },
// // //   testimonialsTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 8,
// // //   },
// // //   testimonialSlide: {
// // //     alignItems: 'center',
// // //   },
// // //   testimonialHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   winAmount: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 8,
// // //   },
// // //   testimonialText: { 
// // //     color: '#fff', 
// // //     fontStyle: 'italic', 
// // //     fontSize: 15, 
// // //     lineHeight: 22,
// // //     textAlign: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   testimonialAuthor: { 
// // //     color: '#39FF14', 
// // //     marginBottom: 15,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   testimonialIndicators: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   indicator: {
// // //     width: 6,
// // //     height: 6,
// // //     borderRadius: 3,
// // //     backgroundColor: '#333',
// // //     marginHorizontal: 3,
// // //   },
// // //   indicatorActive: {
// // //     backgroundColor: '#39FF14',
// // //     width: 20,
// // //   },

// // //   // Booking ID Section
// // //   bookingIdSection: {
// // //     marginBottom: 25,
// // //   },
// // //   sectionLabel: {
// // //     fontSize: 16,
// // //     color: '#39FF14',
// // //     fontWeight: '600',
// // //     marginBottom: 10,
// // //   },
// // //   bookingIdInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#39FF14',
// // //   },
// // //   bookingIdInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },

// // //   // Manual Input Section
// // //   manualInputSection: {
// // //     marginBottom: 25,
// // //   },
// // //   matchInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#39FF14',
// // //     marginBottom: 10,
// // //   },
// // //   matchInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },
// // //   addMatchButton: {
// // //     backgroundColor: '#39FF14',
// // //     padding: 12,
// // //     margin: 8,
// // //     borderRadius: 8,
// // //   },
// // //   inputHint: {
// // //     color: '#666',
// // //     fontSize: 12,
// // //     marginBottom: 10,
// // //     fontStyle: 'italic',
// // //   },
// // //   addedMatchesContainer: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#39FF14',
// // //   },
// // //   addedMatchesTitle: {
// // //     color: '#39FF14',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginBottom: 10,
// // //   },
// // //   addedMatchItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 8,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#333',
// // //   },
// // //   addedMatchText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     flex: 1,
// // //   },
// // //   removeMatchButton: {
// // //     padding: 6,
// // //     marginLeft: 10,
// // //   },

// // //   // Upload Section
// // //   uploadSection: { marginBottom: 25 },
// // //   uploadCard: {
// // //     backgroundColor: '#111',
// // //     borderWidth: 2,
// // //     borderColor: '#333',
// // //     borderStyle: 'dashed',
// // //     borderRadius: 16,
// // //     padding: 40,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginBottom: 20,
// // //   },
// // //   uploadPlaceholder: { alignItems: 'center' },
// // //   uploadText: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginTop: 15,
// // //     marginBottom: 5,
// // //   },
// // //   uploadSubtext: { fontSize: 14, color: '#CCC', textAlign: 'center' },
// // //   imagePreview: { alignItems: 'center' },
// // //   uploadSuccess: {
// // //     fontSize: 16,
// // //     color: '#39FF14',
// // //     fontWeight: 'bold',
// // //     marginTop: 10,
// // //   },

// // //   supportedBooks: { alignItems: 'center' },
// // //   supportedTitle: { fontSize: 14, color: '#39FF14', marginBottom: 10, fontWeight: '600' },
// // //   bookmakerList: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     justifyContent: 'center',
// // //   },
// // //   bookmakerItem: {
// // //     backgroundColor: '#222',
// // //     color: '#fff',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 12,
// // //     margin: 4,
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // Analyze Button
// // //   analyzeButton: {
// // //     backgroundColor: '#39FF14',
// // //     padding: 18,
// // //     borderRadius: 16,
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   analyzeButtonDisabled: { backgroundColor: '#333' },
// // //   analyzeContent: { flexDirection: 'row', alignItems: 'center' },
// // //   analyzeButtonText: {
// // //     color: '#000',
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginLeft: 10,
// // //   },

// // //   guaranteeText: {
// // //     color: '#39FF14',
// // //     textAlign: 'center',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginBottom: 20,
// // //   },

// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.9)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 10,
// // //   },
// // //   scanModal: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 20,
// // //     padding: 30,
// // //     width: '100%',
// // //     maxWidth: 400,
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#39FF14',
// // //   },
// // //   scanHeader: {
// // //     alignItems: 'center',
// // //     marginBottom: 30,
// // //   },
// // //   scanTitle: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   scanSubtitle: {
// // //     fontSize: 14,
// // //     color: '#ccc',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //   },
// // //   scanAnimation: {
// // //     alignItems: 'center',
// // //     marginBottom: 30,
// // //     position: 'relative',
// // //   },
// // //   pulseCircle: {
// // //     position: 'absolute',
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: 'rgba(57, 255, 20, 0.2)',
// // //     top: -10,
// // //   },
// // //   progressContainer: {
// // //     width: '100%',
// // //     marginBottom: 25,
// // //   },
// // //   progressBackground: {
// // //     height: 8,
// // //     backgroundColor: '#333',
// // //     borderRadius: 4,
// // //     overflow: 'hidden',
// // //     marginBottom: 10,
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     backgroundColor: '#39FF14',
// // //     borderRadius: 4,
// // //   },
// // //   progressText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     textAlign: 'center',
// // //   },
// // //   scanSteps: {
// // //     width: '100%',
// // //     marginBottom: 20,
// // //   },
// // //   scanStep: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   scanStepText: {
// // //     color: '#fff',
// // //     marginLeft: 12,
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   scanTip: {
// // //     color: '#39FF14',
// // //     fontSize: 12,
// // //     textAlign: 'center',
// // //     fontStyle: 'italic',
// // //     lineHeight: 18,
// // //   },

// // //   // Results Modal Styles
// // //   resultsModal: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 20,
// // //     width: '100%',
// // //     maxWidth: 400,
// // //     height: '85%',
// // //     borderWidth: 2,
// // //     borderColor: '#39FF14',
// // //     overflow: 'hidden',
// // //   },
// // //   resultsHeader: {
// // //     padding: 20,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#333',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //   },
// // //   closeButton: {
// // //     position: 'absolute',
// // //     top: 20,
// // //     right: 20,
// // //     zIndex: 1,
// // //   },
// // //   resultsTitle: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //     textAlign: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   resultsSubtitle: {
// // //     fontSize: 14,
// // //     color: '#ccc',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //   },
// // //   resultsContent: {
// // //     flex: 1,
// // //   },
// // //   resultsContentContainer: {
// // //     padding: 15,
// // //     paddingBottom: 30,
// // //   },

// // //   // AI Confidence Card - Prominent
// // //   confidenceCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#39FF14',
// // //     borderRightWidth: 4,
// // //     borderRightColor: '#39FF14',
// // //   },
// // //   confidenceHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 15,
// // //     justifyContent: 'center',
// // //   },
// // //   confidenceTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 10,
// // //     textAlign: 'center',
// // //   },
// // //   confidenceScoreContainer: {
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   confidenceScore: {
// // //     fontSize: 42,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginBottom: 10,
// // //   },
// // //   confidenceMeter: {
// // //     width: '100%',
// // //     height: 12,
// // //     backgroundColor: '#333',
// // //     borderRadius: 6,
// // //     overflow: 'hidden',
// // //   },
// // //   confidenceFill: {
// // //     height: '100%',
// // //     backgroundColor: '#39FF14',
// // //     borderRadius: 6,
// // //   },
// // //   confidenceDescription: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     textAlign: 'center',
// // //     fontWeight: '500',
// // //     marginTop: 10,
// // //   },

// // //   // Health Card
// // //   healthCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#39FF14',
// // //   },
// // //   healthHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   healthEmoji: {
// // //     fontSize: 32,
// // //     marginRight: 12,
// // //   },
// // //   healthTextContainer: {
// // //     flex: 1,
// // //   },
// // //   healthTitle: {
// // //     fontSize: 16,
// // //     color: '#ccc',
// // //     marginBottom: 4,
// // //     fontWeight: '600',
// // //   },
// // //   healthScore: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //   },
// // //   healthMessage: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     marginBottom: 15,
// // //     lineHeight: 20,
// // //   },
// // //   healthStats: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //   },
// // //   healthStat: {
// // //     alignItems: 'center',
// // //   },
// // //   healthStatLabel: {
// // //     color: '#ccc',
// // //     fontSize: 12,
// // //     marginBottom: 4,
// // //   },
// // //   healthStatValue: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //   },

// // //   // Insights Card
// // //   insightsCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#39FF14',
// // //   },
// // //   insightsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   insightsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 8,
// // //   },
// // //   insightText: {
// // //     color: '#ccc',
// // //     fontSize: 12,
// // //     marginBottom: 6,
// // //     lineHeight: 16,
// // //   },

// // //   // Risk Distribution
// // //   riskDistributionCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginBottom: 15,
// // //   },
// // //   riskBars: {
// // //     gap: 10,
// // //   },
// // //   riskBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   riskBarFill: {
// // //     height: 8,
// // //     borderRadius: 4,
// // //     marginRight: 10,
// // //   },
// // //   lowRisk: { backgroundColor: '#39FF14' },
// // //   mediumRisk: { backgroundColor: '#FFA500' },
// // //   highRisk: { backgroundColor: '#FF4444' },
// // //   riskBarLabel: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // Suggestions Card
// // //   suggestionsCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#FFD700',
// // //   },
// // //   suggestionsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   suggestionsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#FFD700',
// // //     marginLeft: 8,
// // //   },
// // //   suggestionItem: {
// // //     marginBottom: 12,
// // //   },
// // //   suggestionTitle: {
// // //     color: '#FFD700',
// // //     fontSize: 14,
// // //     fontWeight: 'bold',
// // //     marginBottom: 6,
// // //   },
// // //   suggestionAction: {
// // //     color: '#ccc',
// // //     fontSize: 12,
// // //     marginBottom: 3,
// // //     marginLeft: 10,
// // //   },
// // //   suggestionImprovement: {
// // //     color: '#39FF14',
// // //     fontSize: 11,
// // //     fontWeight: '500',
// // //     marginTop: 4,
// // //   },
// // //   suggestionImpact: {
// // //     color: '#ccc',
// // //     fontSize: 10,
// // //     fontStyle: 'italic',
// // //   },

// // //   // Matches Section
// // //   matchesSection: {
// // //     marginBottom: 15,
// // //   },
// // //   matchCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 12,
// // //     borderLeftWidth: 4,
// // //   },
// // //   matchHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 10,
// // //   },
// // //   matchTeams: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //     flex: 1,
// // //     marginRight: 10,
// // //   },
// // //   matchRiskBadge: {
// // //     alignItems: 'center',
// // //   },
// // //   riskEmoji: {
// // //     fontSize: 16,
// // //     marginBottom: 4,
// // //   },
// // //   riskLevelText: {
// // //     fontSize: 10,
// // //     fontWeight: 'bold',
// // //     textAlign: 'center',
// // //   },
// // //   matchStats: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     marginBottom: 10,
// // //     paddingVertical: 8,
// // //     borderTopWidth: 1,
// // //     borderBottomWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   matchStat: {
// // //     alignItems: 'center',
// // //   },
// // //   matchStatLabel: {
// // //     color: '#ccc',
// // //     fontSize: 10,
// // //     marginBottom: 4,
// // //   },
// // //   matchStatValue: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     fontWeight: 'bold',
// // //   },

// // //   // Injuries Section
// // //   injuriesContainer: {
// // //     backgroundColor: 'rgba(255, 68, 68, 0.1)',
// // //     padding: 10,
// // //     borderRadius: 8,
// // //     marginBottom: 10,
// // //     borderLeftWidth: 3,
// // //     borderLeftColor: '#FF4444',
// // //   },
// // //   injuriesTitle: {
// // //     color: '#FF4444',
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //     marginBottom: 6,
// // //   },
// // //   injuryItem: {
// // //     marginBottom: 8,
// // //   },
// // //   injuryTeam: {
// // //     color: '#FF4444',
// // //     fontSize: 11,
// // //     fontWeight: 'bold',
// // //     marginBottom: 4,
// // //   },
// // //   injuryPlayer: {
// // //     color: '#ccc',
// // //     fontSize: 10,
// // //     marginLeft: 8,
// // //     marginBottom: 2,
// // //   },

// // //   insightsContainer: {
// // //     marginBottom: 10,
// // //   },
// // //   insightsTitle: {
// // //     color: '#39FF14',
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //     marginBottom: 6,
// // //   },
// // //   insightItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 4,
// // //   },
// // //   insightText: {
// // //     color: '#ccc',
// // //     fontSize: 11,
// // //     marginLeft: 6,
// // //     flex: 1,
// // //     lineHeight: 14,
// // //   },
// // //   recommendationBox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(57, 255, 20, 0.1)',
// // //     padding: 10,
// // //     borderRadius: 8,
// // //     borderLeftWidth: 3,
// // //     borderLeftColor: '#39FF14',
// // //   },
// // //   recommendationText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     marginLeft: 8,
// // //     flex: 1,
// // //     lineHeight: 16,
// // //   },

// // //   // No Matches Section
// // //   noMatchesSection: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 30,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     marginBottom: 15,
// // //   },
// // //   noMatchesText: {
// // //     color: '#666',
// // //     fontSize: 16,
// // //     marginTop: 10,
// // //   },

// // //   // Achievements Card
// // //   achievementsCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#FFD700',
// // //   },
// // //   achievementsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   achievementsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#FFD700',
// // //     marginLeft: 8,
// // //   },
// // //   achievementsList: {
// // //     gap: 6,
// // //   },
// // //   achievementItem: {
// // //     color: '#FFD700',
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // Tips Card
// // //   tipsCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //   },
// // //   tipsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   tipsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 8,
// // //   },
// // //   tipItem: {
// // //     flexDirection: 'row',
// // //     marginBottom: 12,
// // //   },
// // //   tipIcon: {
// // //     fontSize: 20,
// // //     marginRight: 10,
// // //   },
// // //   tipContent: {
// // //     flex: 1,
// // //   },
// // //   tipText: {
// // //     color: '#fff',
// // //     fontSize: 13,
// // //     fontWeight: '500',
// // //     marginBottom: 4,
// // //   },
// // //   tipAdvice: {
// // //     color: '#ccc',
// // //     fontSize: 11,
// // //     marginBottom: 4,
// // //     lineHeight: 14,
// // //   },
// // //   tipImpact: {
// // //     color: '#39FF14',
// // //     fontSize: 10,
// // //     fontWeight: '500',
// // //   },

// // //   // Profile Card
// // //   profileCard: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#39FF14',
// // //   },
// // //   profileHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   profileTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#39FF14',
// // //     marginLeft: 8,
// // //   },
// // //   profileType: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     marginBottom: 6,
// // //   },
// // //   profileDescription: {
// // //     color: '#ccc',
// // //     fontSize: 12,
// // //     marginBottom: 8,
// // //     lineHeight: 16,
// // //   },
// // //   profileTip: {
// // //     color: '#39FF14',
// // //     fontSize: 11,
// // //     fontStyle: 'italic',
// // //   },

// // //   // Action Buttons
// // //   actionButtons: {
// // //     marginTop: 10,
// // //   },
// // //   newScanButton: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#39FF14',
// // //     padding: 15,
// // //     borderRadius: 13,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   newScanButtonText: {
// // //     color: '#000',
// // //     fontWeight: 'bold',
// // //     marginLeft: 8,
// // //   },
// // //   scrollView: {
// // //     flex: 1,
// // //     padding: 20,
// // //   },
// // //   header: { 
// // //     alignItems: 'center', 
// // //     marginBottom: 25,
// // //     marginTop: 10,
// // //   },
// // //   title: { 
// // //     fontSize: 28, 
// // //     fontWeight: 'bold', 
// // //     color: '#fff', 
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   subtitle: { 
// // //     fontSize: 16, 
// // //     color: '#a6a5a5', 
// // //     textAlign: 'center',
// // //     lineHeight: 22,
// // //   },

// // //   // Image Options Modal Styles
// // //   imageOptionsOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 20,
// // //   },
// // //   imageOptionsModal: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 20,
// // //     padding: 30,
// // //     width: '100%',
// // //     maxWidth: 300,
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#24ad0cff',
// // //   },
// // //   imageOptionsTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //     marginBottom: 25,
// // //     textAlign: 'center',
// // //   },
// // //   imageOptionButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 18,
// // //     borderRadius: 12,
// // //     marginBottom: 15,
// // //     width: '100%',
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   imageOptionText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     marginLeft: 15,
// // //   },
// // //   cancelButton: {
// // //     backgroundColor: '#333',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     width: '100%',
// // //     alignItems: 'center',
// // //     marginTop: 10,
// // //   },
// // //   cancelButtonText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },

// // //   // Enhanced Upload Section
// // //   uploadCard: {
// // //     backgroundColor: '#111',
// // //     borderWidth: 2,
// // //     borderColor: '#333',
// // //     borderStyle: 'dashed',
// // //     borderRadius: 16,
// // //     overflow: 'hidden',
// // //     marginBottom: 20,
// // //   },
// // //   imagePreview: {
// // //     position: 'relative',
// // //     height: 200,
// // //   },
// // //   previewImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //   },
// // //   imageOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   changePhotoText: {
// // //     color: '#24ad0cff',
// // //     fontSize: 12,
// // //     marginTop: 5,
// // //   },
// // //   uploadOptionsHint: {
// // //     marginTop: 10,
// // //     padding: 8,
// // //     backgroundColor: 'rgba(57, 255, 20, 0.1)',
// // //     borderRadius: 8,
// // //   },
// // //   uploadOptionsText: {
// // //     color: '#24ad0cff',
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // ... (keep all your existing styles from previous code)
// // //   // Add any missing styles from your original code here

// // //   // Testimonials Section
// // //   testimonialsSection: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     marginBottom: 25,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: '#24ad0cff',
// // //   },
// // //   testimonialsHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 15,
// // //   },
// // //   testimonialsTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#24ad0cff',
// // //     marginLeft: 8,
// // //   },
// // //   testimonialSlide: {
// // //     alignItems: 'center',
// // //   },
// // //   testimonialHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   winAmount: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#24ad0cff',
// // //     marginLeft: 8,
// // //   },
// // //   testimonialText: { 
// // //     color: '#fff', 
// // //     fontStyle: 'italic', 
// // //     fontSize: 15, 
// // //     lineHeight: 22,
// // //     textAlign: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   testimonialAuthor: { 
// // //     color: '#24ad0cff', 
// // //     marginBottom: 15,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   testimonialIndicators: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   indicator: {
// // //     width: 6,
// // //     height: 6,
// // //     borderRadius: 3,
// // //     backgroundColor: '#333',
// // //     marginHorizontal: 3,
// // //   },
// // //   indicatorActive: {
// // //     backgroundColor: '#24ad0cff',
// // //     width: 20,
// // //   },

// // //   // Booking ID Section
// // //   bookingIdSection: {
// // //     marginBottom: 25,
// // //   },
// // //   sectionLabel: {
// // //     fontSize: 16,
// // //     color: '#24ad0cff',
// // //     fontWeight: '600',
// // //     marginBottom: 10,
// // //   },
// // //   bookingIdInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#24ad0cff',
// // //   },
// // //   bookingIdInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },

// // //   // Manual Input Section
// // //   manualInputSection: {
// // //     marginBottom: 25,
// // //   },
// // //   matchInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#24ad0cff',
// // //     marginBottom: 10,
// // //   },
// // //   matchInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },
// // //   addMatchButton: {
// // //     backgroundColor: '#24ad0cff',
// // //     padding: 12,
// // //     margin: 8,
// // //     borderRadius: 8,
// // //   },
// // //   inputHint: {
// // //     color: '#666',
// // //     fontSize: 12,
// // //     marginBottom: 10,
// // //     fontStyle: 'italic',
// // //   },
// // //   addedMatchesContainer: {
// // //     backgroundColor: '#1a1a1a',
// // //     padding: 15,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#24ad0cff',
// // //   },
// // //   addedMatchesTitle: {
// // //     color: '#24ad0cff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginBottom: 10,
// // //   },
// // //   addedMatchItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 8,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#333',
// // //   },
// // //   addedMatchText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     flex: 1,
// // //   },
// // //   removeMatchButton: {
// // //     padding: 6,
// // //     marginLeft: 10,
// // //   },

// // //   // Upload Section
// // //   uploadSection: { marginBottom: 25 },
// // //   uploadPlaceholder: { 
// // //     alignItems: 'center',
// // //     padding: 40,
// // //   },
// // //   uploadText: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#24ad0cff',
// // //     marginTop: 15,
// // //     marginBottom: 5,
// // //   },
// // //   uploadSubtext: { fontSize: 14, color: '#CCC', textAlign: 'center' },
// // //   uploadSuccess: {
// // //     fontSize: 16,
// // //     color: '#24ad0cff',
// // //     fontWeight: 'bold',
// // //     marginTop: 10,
// // //   },

// // //   supportedBooks: { alignItems: 'center' },
// // //   supportedTitle: { fontSize: 14, color: '#24ad0cff', marginBottom: 10, fontWeight: '600' },
// // //   bookmakerList: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     justifyContent: 'center',
// // //   },
// // //   bookmakerItem: {
// // //     backgroundColor: '#222',
// // //     color: '#fff',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 12,
// // //     margin: 4,
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // Analyze Button
// // //   analyzeButton: {
// // //     backgroundColor: '#24ad0cff',
// // //     padding: 18,
// // //     borderRadius: 16,
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   analyzeButtonDisabled: { backgroundColor: '#333' },
// // //   analyzeContent: { flexDirection: 'row', alignItems: 'center' },
// // //   analyzeButtonText: {
// // //     color: '#000',
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginLeft: 10,
// // //   },

// // //   guaranteeText: {
// // //     color: '#24ad0cff',
// // //     textAlign: 'center',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginBottom: 20,
// // //   },

// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.9)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 10,
// // //   },
// // //   scanModal: {
// // //     backgroundColor: '#111',
// // //     borderRadius: 20,
// // //     padding: 30,
// // //     width: '100%',
// // //     maxWidth: 400,
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#24ad0cff',
// // //   },
// // //   scanHeader: {
// // //     alignItems: 'center',
// // //     marginBottom: 30,
// // //   },
// // //   scanTitle: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //     marginBottom: 8,
// // //     textAlign: 'center',
// // //   },
// // //   scanSubtitle: {
// // //     fontSize: 14,
// // //     color: '#ccc',
// // //     textAlign: 'center',
// // //     lineHeight: 20,
// // //   },
// // //   scanAnimation: {
// // //     alignItems: 'center',
// // //     marginBottom: 30,
// // //     position: 'relative',
// // //   },
// // //   pulseCircle: {
// // //     position: 'absolute',
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: 'rgba(57, 255, 20, 0.2)',
// // //     top: -10,
// // //   },
// // //   progressContainer: {
// // //     width: '100%',
// // //     marginBottom: 25,
// // //   },
// // //   progressBackground: {
// // //     height: 8,
// // //     backgroundColor: '#333',
// // //     borderRadius: 4,
// // //     overflow: 'hidden',
// // //     marginBottom: 10,
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     backgroundColor: '#24ad0cff',
// // //     borderRadius: 4,
// // //   },
// // //   progressText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     textAlign: 'center',
// // //   },
// // //   scanSteps: {
// // //     width: '100%',
// // //     marginBottom: 20,
// // //   },
// // //   scanStep: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   scanStepText: {
// // //     color: '#fff',
// // //     marginLeft: 12,
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   scanTip: {
// // //     color: '#24ad0cff',
// // //     fontSize: 12,
// // //     textAlign: 'center',
// // //     fontStyle: 'italic',
// // //     lineHeight: 18,

// // //   },
// // // });

// // // export default AnalysisScreen;

// // // import React, { useState, useRef, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StatusBar,
// // //   Image,
// // //   Animated,
// // //   Easing,
// // //   Dimensions,
// // //   Modal,
// // //   Alert,
// // //   TextInput,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // // const { width, height } = Dimensions.get('window');
// // // const API_BASE_URL = 'http://192.168.43.73:8000/api';

// // // const AnalysisScreen = ({ navigation }) => {
// // //   const [selectedImage, setSelectedImage] = useState(null);
// // //   const [bookingId, setBookingId] = useState('');
// // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // //   const [showScanModal, setShowScanModal] = useState(false);
// // //   const [showResultsModal, setShowResultsModal] = useState(false);
// // //   const [scanProgress, setScanProgress] = useState(0);
// // //   const [analysisResult, setAnalysisResult] = useState(null);
// // //   const [currentTestimonial, setCurrentTestimonial] = useState(0);
// // //   const [showImageOptions, setShowImageOptions] = useState(false);
// // //   const [showReasonsModal, setShowReasonsModal] = useState(false);
// // //   const [selectedMatch, setSelectedMatch] = useState(null);

// // //   const slideAnim = useRef(new Animated.Value(0)).current;
// // //   const progressAnim = useRef(new Animated.Value(0)).current;
// // //   const [manualMatches, setManualMatches] = useState([]);
// // //   const [currentMatchInput, setCurrentMatchInput] = useState('');

// // //   // Testimonials data
// // //   const testimonials = [
// // //     {
// // //       id: 1,
// // //       text: "This AI scanner saved me from a huge loss! It flagged a 'sure bet' as high risk - turned out key players were injured. Professional analysis!",
// // //       author: "David, Professional Bettor",
// // //       amount: "₦85,000"
// // //     },
// // //     {
// // //       id: 2,
// // //       text: "The detailed risk breakdown helped me understand WHY certain matches are risky. Not just predictions - real insights!",
// // //       author: "Sarah, Sports Analyst",
// // //       amount: "₦120,000"
// // //     },
// // //     {
// // //       id: 3,
// // //       text: "Gemini AI explanations are game-changing. I finally understand betting risks beyond just odds. This is next-level!",
// // //       author: "Mike, Investment Banker",
// // //       amount: "₦45,000"
// // //     }
// // //   ];

// // //   // Image Picker Options
// // //   const imagePickerOptions = {
// // //     mediaType: 'photo',
// // //     quality: 0.9,
// // //     maxWidth: 2048,
// // //     maxHeight: 2048,
// // //     includeBase64: true,
// // //   };

// // //   // Auto-rotate testimonials
// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setCurrentTestimonial((prev) => 
// // //         prev === testimonials.length - 1 ? 0 : prev + 1
// // //       );
// // //     }, 5000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   // Enhanced Image Selection
// // //   const handleImageSelect = () => {
// // //     setShowImageOptions(true);
// // //   };

// // //   const takePhoto = () => {
// // //     setShowImageOptions(false);
// // //     launchCamera(imagePickerOptions, (response) => {
// // //       if (response.didCancel) return;
// // //       if (response.error) {
// // //         Alert.alert('Camera Error', 'Please allow camera permissions');
// // //         return;
// // //       }
// // //       if (response.assets && response.assets[0]) {
// // //         setSelectedImage(response.assets[0].uri);
// // //       }
// // //     });
// // //   };

// // //   const chooseFromGallery = () => {
// // //     setShowImageOptions(false);
// // //     launchImageLibrary(imagePickerOptions, (response) => {
// // //       if (response.didCancel) return;
// // //       if (response.error) {
// // //         Alert.alert('Gallery Error', 'Cannot access photo library');
// // //         return;
// // //       }
// // //       if (response.assets && response.assets[0]) {
// // //         setSelectedImage(response.assets[0].uri);
// // //       }
// // //     });
// // //   };

// // //   const addManualMatch = () => {
// // //     if (!currentMatchInput.trim()) return;

// // //     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
// // //     const match = currentMatchInput.match(matchRegex);

// // //     if (match) {
// // //       const homeTeam = match[1].trim();
// // //       const awayTeam = match[2].trim();
      
// // //       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
// // //       setCurrentMatchInput('');
// // //     } else {
// // //       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
// // //     }
// // //   };

// // //   const removeManualMatch = (index) => {
// // //     setManualMatches(prev => prev.filter((_, i) => i !== index));
// // //   };

// // //   const handleAnalyze = async () => {
// // //     const hasImage = !!selectedImage;
// // //     const hasBookingId = !!bookingId;
// // //     const hasManualMatches = manualMatches.length > 0;

// // //     if (!hasImage && !hasBookingId && !hasManualMatches) {
// // //       Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
// // //       return;
// // //     }

// // //     setIsAnalyzing(true);
// // //     setShowScanModal(true);
// // //     startScanAnimation();

// // //     try {
// // //       let response;
// // //       const token = await AsyncStorage.getItem('access_token');

// // //       if (hasManualMatches) {
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({ matches: manualMatches }),
// // //         });
// // //       } else if (selectedImage) {
// // //         const formData = new FormData();
// // //         const filename = selectedImage.split('/').pop();
// // //         const match = /\.(\w+)$/.exec(filename);
// // //         const type = match ? `image/${match[1]}` : `image/jpeg`;

// // //         formData.append('image', {
// // //           uri: selectedImage,
// // //           type: type,
// // //           name: filename || 'bet_slip.jpg',
// // //         });
        
// // //         if (bookingId) formData.append('booking_id', bookingId);

// // //         response = await fetch(`${API_BASE_URL}/bets/slips/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'multipart/form-data',
// // //           },
// // //           body: formData,
// // //         });
// // //       } else {
// // //         response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({ booking_id: bookingId }),
// // //         });
// // //       }

// // //       const result = await response.json();
      
// // //       if (response.ok) {
// // //         setAnalysisResult(result);
// // //         setTimeout(() => {
// // //           setShowScanModal(false);
// // //           setShowResultsModal(true);
// // //         }, 800);
// // //       } else {
// // //         throw new Error(result.error || 'Analysis failed');
// // //       }
// // //     } catch (error) {
// // //       Alert.alert('Analysis Error', 'Please check your connection and try again');
// // //       setShowScanModal(false);
// // //     } finally {
// // //       setIsAnalyzing(false);
// // //     }
// // //   };

// // //   const startScanAnimation = () => {
// // //     setScanProgress(0);
// // //     progressAnim.setValue(0);
    
// // //     const duration = 4000;
// // //     const interval = 100;
// // //     const steps = duration / interval;
// // //     let currentStep = 0;

// // //     const progressInterval = setInterval(() => {
// // //       currentStep++;
// // //       const progress = (currentStep / steps) * 100;
// // //       setScanProgress(progress);
      
// // //       Animated.timing(progressAnim, {
// // //         toValue: progress,
// // //         duration: interval,
// // //         useNativeDriver: false,
// // //         easing: Easing.out(Easing.ease),
// // //       }).start();

// // //       if (currentStep >= steps) clearInterval(progressInterval);
// // //     }, interval);
// // //   };

// // //   const openReasonsModal = (match) => {
// // //     setSelectedMatch(match);
// // //     setShowReasonsModal(true);
// // //   };

// // //   const getRiskColor = (riskLevel) => {
// // //     switch (riskLevel?.toUpperCase()) {
// // //       case 'LOW_RISK': return '#10B981';
// // //       case 'MEDIUM_RISK': return '#F59E0B';
// // //       case 'HIGH_RISK': return '#EF4444';
// // //       default: return '#6B7280';
// // //     }
// // //   };

// // //   const getRiskEmoji = (riskLevel) => {
// // //     switch (riskLevel?.toUpperCase()) {
// // //       case 'LOW_RISK': return '💎';
// // //       case 'MEDIUM_RISK': return '⚠️';
// // //       case 'HIGH_RISK': return '🚨';
// // //       default: return '❓';
// // //     }
// // //   };

// // //   const renderTestimonial = () => {
// // //     const testimonial = testimonials[currentTestimonial];
    
// // //     return (
// // //       <Animated.View style={styles.testimonialSlide}>
// // //         <View style={styles.testimonialCard}>
// // //           <View style={styles.testimonialHeader}>
// // //             <Icon name="verified" size={20} color="#10B981" />
// // //             <Text style={styles.winAmount}>PROFESSIONAL GRADE</Text>
// // //           </View>
// // //           <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
// // //           <View style={styles.testimonialFooter}>
// // //             <Text style={styles.testimonialAuthor}>— {testimonial.author}</Text>
// // //             <Text style={styles.savingsAmount}>Saved {testimonial.amount}</Text>
// // //           </View>
// // //           <View style={styles.testimonialIndicators}>
// // //             {testimonials.map((_, index) => (
// // //               <View key={index} style={[styles.indicator, index === currentTestimonial && styles.indicatorActive]} />
// // //             ))}
// // //           </View>
// // //         </View>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const renderImageOptionsModal = () => (
// // //     <Modal visible={showImageOptions} transparent animationType="slide">
// // //       <View style={styles.modalOverlay}>
// // //         <View style={styles.imageOptionsModal}>
// // //           <Text style={styles.modalTitle}>Capture Bet Slip</Text>
// // //           <Text style={styles.modalSubtitle}>AI Vision will analyze your slip automatically</Text>
          
// // //           <TouchableOpacity style={styles.imageOptionButton} onPress={takePhoto}>
// // //             <View style={styles.optionIconContainer}>
// // //               <Icon name="camera-alt" size={28} color="#FFFFFF" />
// // //             </View>
// // //             <View style={styles.optionTextContainer}>
// // //               <Text style={styles.optionTitle}>Take Photo</Text>
// // //               <Text style={styles.optionSubtitle}>Instant AI analysis</Text>
// // //             </View>
// // //             <Icon name="chevron-right" size={24} color="#9CA3AF" />
// // //           </TouchableOpacity>
          
// // //           <TouchableOpacity style={styles.imageOptionButton} onPress={chooseFromGallery}>
// // //             <View style={styles.optionIconContainer}>
// // //               <Icon name="photo-library" size={28} color="#FFFFFF" />
// // //             </View>
// // //             <View style={styles.optionTextContainer}>
// // //               <Text style={styles.optionTitle}>Choose from Gallery</Text>
// // //               <Text style={styles.optionSubtitle}>Select existing photo</Text>
// // //             </View>
// // //             <Icon name="chevron-right" size={24} color="#9CA3AF" />
// // //           </TouchableOpacity>
          
// // //           <TouchableOpacity style={styles.cancelButton} onPress={() => setShowImageOptions(false)}>
// // //             <Text style={styles.cancelButtonText}>Cancel</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     </Modal>
// // //   );

// // //   const renderReasonsModal = () => {
// // //     if (!selectedMatch) return null;

// // //     return (
// // //       <Modal visible={showReasonsModal} transparent animationType="slide">
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.reasonsModal}>
// // //             <View style={styles.reasonsHeader}>
// // //               <TouchableOpacity onPress={() => setShowReasonsModal(false)} style={styles.closeButton}>
// // //                 <Icon name="close" size={24} color="#6B7280" />
// // //               </TouchableOpacity>
// // //               <Text style={styles.reasonsTitle}>Detailed Analysis</Text>
// // //               <Text style={styles.reasonsSubtitle}>{selectedMatch.home_team} vs {selectedMatch.away_team}</Text>
// // //             </View>

// // //             <ScrollView style={styles.reasonsContent}>
// // //               {/* Risk Overview */}
// // //               <View style={styles.reasonSection}>
// // //                 <Text style={styles.sectionTitle}>Risk Assessment</Text>
// // //                 <View style={styles.riskOverview}>
// // //                   <View style={[styles.riskBadge, { backgroundColor: getRiskColor(selectedMatch.risk_level) }]}>
// // //                     <Text style={styles.riskBadgeText}>
// // //                       {getRiskEmoji(selectedMatch.risk_level)} {selectedMatch.risk_level?.replace('_', ' ')}
// // //                     </Text>
// // //                   </View>
// // //                   <Text style={styles.riskScore}>Risk Score: {selectedMatch.risk_score}%</Text>
// // //                   <Text style={styles.confidenceScore}>Confidence: {selectedMatch.confidence || (100 - selectedMatch.risk_score)}%</Text>
// // //                 </View>
// // //               </View>

// // //               {/* Key Risk Factors */}
// // //               {selectedMatch.risk_factors && selectedMatch.risk_factors.length > 0 && (
// // //                 <View style={styles.reasonSection}>
// // //                   <Text style={styles.sectionTitle}>Key Risk Factors</Text>
// // //                   {selectedMatch.risk_factors.map((factor, index) => (
// // //                     <View key={index} style={styles.factorItem}>
// // //                       <View style={[styles.factorIcon, { backgroundColor: factor.risk_impact > 0 ? '#FEF2F2' : '#F0FDF4' }]}>
// // //                         <Icon 
// // //                           name={factor.risk_impact > 0 ? "warning" : "check-circle"} 
// // //                           size={16} 
// // //                           color={factor.risk_impact > 0 ? '#DC2626' : '#16A34A'} 
// // //                         />
// // //                       </View>
// // //                       <View style={styles.factorContent}>
// // //                         <Text style={styles.factorTitle}>{factor.factor}</Text>
// // //                         <Text style={styles.factorDescription}>{factor.description}</Text>
// // //                         <Text style={styles.factorImpact}>
// // //                           Impact: {factor.risk_impact > 0 ? '+' : ''}{factor.risk_impact} risk points
// // //                         </Text>
// // //                       </View>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}

// // //               {/* Insights */}
// // //               {selectedMatch.risk_insights && selectedMatch.risk_insights.length > 0 && (
// // //                 <View style={styles.reasonSection}>
// // //                   <Text style={styles.sectionTitle}>AI Insights</Text>
// // //                   {selectedMatch.risk_insights.map((insight, index) => (
// // //                     <View key={index} style={styles.insightItem}>
// // //                       <Text style={styles.insightText}>{insight}</Text>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}

// // //               {/* Recommendation */}
// // //               {selectedMatch.recommendation && (
// // //                 <View style={styles.reasonSection}>
// // //                   <Text style={styles.sectionTitle}>Expert Recommendation</Text>
// // //                   <View style={styles.recommendationBox}>
// // //                     <Icon name="lightbulb" size={20} color={getRiskColor(selectedMatch.risk_level)} />
// // //                     <Text style={styles.recommendationText}>{selectedMatch.recommendation}</Text>
// // //                   </View>
// // //                 </View>
// // //               )}

// // //               {/* Data Quality */}
// // //               <View style={styles.reasonSection}>
// // //                 <Text style={styles.sectionTitle}>Analysis Details</Text>
// // //                 <View style={styles.detailsGrid}>
// // //                   <View style={styles.detailItem}>
// // //                     <Text style={styles.detailLabel}>Data Source</Text>
// // //                     <Text style={styles.detailValue}>
// // //                       {selectedMatch.data_quality === false ? 'Simulated Analysis' : 'Live API Data'}
// // //                     </Text>
// // //                   </View>
// // //                   <View style={styles.detailItem}>
// // //                     <Text style={styles.detailLabel}>Analysis Method</Text>
// // //                     <Text style={styles.detailValue}>AI Risk Assessment Engine</Text>
// // //                   </View>
// // //                   <View style={styles.detailItem}>
// // //                     <Text style={styles.detailLabel}>Risk Factors</Text>
// // //                     <Text style={styles.detailValue}>{selectedMatch.total_risk_factors || 0} evaluated</Text>
// // //                   </View>
// // //                 </View>
// // //               </View>
// // //             </ScrollView>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   const renderResultsModal = () => {
// // //     if (!analysisResult) return null;

// // //     const analysis = analysisResult.analysis || {};
// // //     const analysisData = analysis.analysis_data || {};
// // //     const matches = analysisData.match_analyses || [];
// // //     const emotionalVerdict = analysisData.emotional_verdict || {};
// // //     const geminiSummary = analysisData.gemini_summary || {};

// // //     return (
// // //       <Modal visible={showResultsModal} transparent animationType="slide" statusBarTranslucent>
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.resultsModal}>
// // //             {/* Header */}
// // //             <View style={styles.resultsHeader}>
// // //               <TouchableOpacity onPress={() => setShowResultsModal(false)} style={styles.closeButton}>
// // //                 <Icon name="close" size={24} color="#6B7280" />
// // //               </TouchableOpacity>
// // //               <View style={styles.resultsTitleContainer}>
// // //                 <Text style={styles.resultsTitle}>AI Analysis Complete</Text>
// // //                 <Text style={styles.resultsSubtitle}>Professional Betting Insights</Text>
// // //               </View>
// // //               <View style={styles.headerBadge}>
// // //                 <Icon name="psychology" size={16} color="#FFFFFF" />
// // //                 <Text style={styles.headerBadgeText}>AI POWERED</Text>
// // //               </View>
// // //             </View>

// // //             <ScrollView style={styles.resultsContent}>
// // //               {/* Emotional Verdict */}
// // //               {emotionalVerdict.type && (
// // //                 <View style={[styles.verdictCard, { borderLeftColor: emotionalVerdict.color === 'green' ? '#10B981' : emotionalVerdict.color === 'orange' ? '#F59E0B' : '#EF4444' }]}>
// // //                   <Text style={styles.verdictType}>{emotionalVerdict.type}</Text>
// // //                   <Text style={styles.verdictMessage}>{emotionalVerdict.verdict}</Text>
// // //                   <Text style={styles.verdictDescription}>{emotionalVerdict.message}</Text>
// // //                   <View style={styles.verdictRecommendation}>
// // //                     <Icon name="tips_and_updates" size={16} color={emotionalVerdict.color === 'green' ? '#10B981' : emotionalVerdict.color === 'orange' ? '#F59E0B' : '#EF4444'} />
// // //                     <Text style={styles.recommendationText}>{emotionalVerdict.recommendation}</Text>
// // //                   </View>
// // //                 </View>
// // //               )}

// // //               {/* Confidence Score */}
// // //               <View style={styles.confidenceCard}>
// // //                 <View style={styles.confidenceHeader}>
// // //                   <Icon name="auto_awesome" size={24} color="#8B5CF6" />
// // //                   <Text style={styles.confidenceTitle}>AI CONFIDENCE SCORE</Text>
// // //                 </View>
// // //                 <View style={styles.confidenceScoreContainer}>
// // //                   <Text style={styles.confidenceScore}>{analysis.confidence_score || analysisData.overall_confidence || 50}%</Text>
// // //                   <View style={styles.confidenceMeter}>
// // //                     <View style={[styles.confidenceFill, { width: `${analysis.confidence_score || analysisData.overall_confidence || 50}%` }]} />
// // //                   </View>
// // //                 </View>
// // //                 <Text style={styles.confidenceDescription}>
// // //                   {geminiSummary.summary || "Professional analysis based on multiple risk factors"}
// // //                 </Text>
// // //               </View>

// // //               {/* Match Analyses */}
// // //               <View style={styles.matchesSection}>
// // //                 <Text style={styles.sectionTitle}>Match Analysis ({matches.length} matches)</Text>
// // //                 {matches.map((match, index) => (
// // //                   <View key={index} style={[styles.matchCard, { borderLeftColor: getRiskColor(match.risk_level) }]}>
// // //                     <View style={styles.matchHeader}>
// // //                       <View style={styles.matchTeams}>
// // //                         <Text style={styles.homeTeam}>{match.home_team}</Text>
// // //                         <Text style={styles.vsText}>vs</Text>
// // //                         <Text style={styles.awayTeam}>{match.away_team}</Text>
// // //                       </View>
// // //                       <View style={styles.matchRisk}>
// // //                         <Text style={styles.riskEmoji}>{getRiskEmoji(match.risk_level)}</Text>
// // //                         <Text style={[styles.riskLevel, { color: getRiskColor(match.risk_level) }]}>
// // //                           {match.risk_level?.replace('_', ' ')}
// // //                         </Text>
// // //                       </View>
// // //                     </View>

// // //                     <View style={styles.matchStats}>
// // //                       <View style={styles.statItem}>
// // //                         <Text style={styles.statLabel}>Risk Score</Text>
// // //                         <Text style={styles.statValue}>{match.risk_score}%</Text>
// // //                       </View>
// // //                       <View style={styles.statItem}>
// // //                         <Text style={styles.statLabel}>Confidence</Text>
// // //                         <Text style={styles.statValue}>{match.confidence || (100 - match.risk_score)}%</Text>
// // //                       </View>
// // //                       <View style={styles.statItem}>
// // //                         <Text style={styles.statLabel}>Recommendation</Text>
// // //                         <Text style={[styles.statValue, { color: getRiskColor(match.risk_level) }]}>
// // //                           {match.risk_level === 'HIGH_RISK' ? 'Avoid' : match.risk_level === 'MEDIUM_RISK' ? 'Caution' : 'Good'}
// // //                         </Text>
// // //                       </View>
// // //                     </View>

// // //                     <TouchableOpacity 
// // //                       style={styles.viewReasonsButton}
// // //                       onPress={() => openReasonsModal(match)}
// // //                     >
// // //                       <Text style={styles.viewReasonsText}>View Detailed Reasons</Text>
// // //                       <Icon name="info" size={16} color="#8B5CF6" />
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                 ))}
// // //               </View>

// // //               {/* Key Insights */}
// // //               {geminiSummary.key_insights && (
// // //                 <View style={styles.insightsCard}>
// // //                   <View style={styles.insightsHeader}>
// // //                     <Icon name="insights" size={20} color="#8B5CF6" />
// // //                     <Text style={styles.insightsTitle}>Key Insights</Text>
// // //                   </View>
// // //                   {geminiSummary.key_insights.map((insight, index) => (
// // //                     <View key={index} style={styles.insightItem}>
// // //                       <Text style={styles.insightText}>{insight}</Text>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}

// // //               {/* Action Buttons */}
// // //               <View style={styles.actionButtons}>
// // //                 <TouchableOpacity 
// // //                   style={styles.newScanButton}
// // //                   onPress={() => {
// // //                     setShowResultsModal(false);
// // //                     setSelectedImage(null);
// // //                     setBookingId('');
// // //                     setManualMatches([]);
// // //                     setAnalysisResult(null);
// // //                   }}
// // //                 >
// // //                   <Icon name="autorenew" size={20} color="#FFFFFF" />
// // //                   <Text style={styles.newScanButtonText}>New Analysis</Text>
// // //                 </TouchableOpacity>
                
// // //                 <TouchableOpacity style={styles.shareButton}>
// // //                   <Icon name="share" size={20} color="#8B5CF6" />
// // //                   <Text style={styles.shareButtonText}>Share Results</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </ScrollView>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
// // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // //         {/* Professional Header */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerBadge}>
// // //             <Icon name="psychology" size={16} color="#FFFFFF" />
// // //             <Text style={styles.headerBadgeText}>AI POWERED</Text>
// // //           </View>
// // //           <Text style={styles.title}>Professional Bet Scanner</Text>
// // //           <Text style={styles.subtitle}>
// // //             Advanced AI analysis with Gemini Vision. Get professional insights beyond basic predictions.
// // //           </Text>
// // //         </View>

// // //         {/* Testimonials Section */}
// // //         <View style={styles.testimonialsSection}>
// // //           {renderTestimonial()}
// // //         </View>

// // //         {/* Input Methods */}
// // //         <View style={styles.inputSection}>
// // //           <Text style={styles.sectionLabel}>ANALYSIS METHODS</Text>
          
// // //           {/* Booking ID */}
// // //           <View style={styles.inputCard}>
// // //             <View style={styles.inputHeader}>
// // //               <Icon name="receipt" size={20} color="#8B5CF6" />
// // //               <Text style={styles.inputTitle}>Booking ID Analysis</Text>
// // //             </View>
// // //             <View style={styles.bookingIdInputContainer}>
// // //               <TextInput
// // //                 style={styles.bookingIdInput}
// // //                 placeholder="Enter Bet9ja booking ID"
// // //                 placeholderTextColor="#9CA3AF"
// // //                 value={bookingId}
// // //                 onChangeText={setBookingId}
// // //                 editable={!isAnalyzing}
// // //               />
// // //             </View>
// // //           </View>

// // //           {/* Manual Input */}
// // //           <View style={styles.inputCard}>
// // //             <View style={styles.inputHeader}>
// // //               <Icon name="edit" size={20} color="#8B5CF6" />
// // //               <Text style={styles.inputTitle}>Manual Match Entry</Text>
// // //             </View>
// // //             <View style={styles.matchInputContainer}>
// // //               <TextInput
// // //                 style={styles.matchInput}
// // //                 placeholder="e.g., Arsenal vs Tottenham"
// // //                 placeholderTextColor="#9CA3AF"
// // //                 value={currentMatchInput}
// // //                 onChangeText={setCurrentMatchInput}
// // //                 onSubmitEditing={addManualMatch}
// // //                 editable={!isAnalyzing}
// // //               />
// // //               <TouchableOpacity 
// // //                 style={styles.addMatchButton} 
// // //                 onPress={addManualMatch}
// // //                 disabled={!currentMatchInput.trim() || isAnalyzing}
// // //               >
// // //                 <Icon name="add" size={20} color="#FFFFFF" />
// // //               </TouchableOpacity>
// // //             </View>
            
// // //             {manualMatches.length > 0 && (
// // //               <View style={styles.addedMatchesContainer}>
// // //                 <Text style={styles.addedMatchesTitle}>Matches to Analyze</Text>
// // //                 {manualMatches.map((match, index) => (
// // //                   <View key={index} style={styles.addedMatchItem}>
// // //                     <Text style={styles.addedMatchText}>{match.homeTeam} vs {match.awayTeam}</Text>
// // //                     <TouchableOpacity onPress={() => removeManualMatch(index)}>
// // //                       <Icon name="close" size={16} color="#EF4444" />
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* Image Upload */}
// // //           <View style={styles.inputCard}>
// // //             <View style={styles.inputHeader}>
// // //               <Icon name="camera-alt" size={20} color="#8B5CF6" />
// // //               <Text style={styles.inputTitle}>AI Vision Analysis</Text>
// // //             </View>
// // //             <TouchableOpacity
// // //               style={styles.uploadCard}
// // //               onPress={handleImageSelect}
// // //               disabled={isAnalyzing}
// // //             >
// // //               {selectedImage ? (
// // //                 <View style={styles.imagePreview}>
// // //                   <Image source={{ uri: selectedImage }} style={styles.previewImage} />
// // //                   <View style={styles.imageOverlay}>
// // //                     <Icon name="check-circle" size={32} color="#10B981" />
// // //                     <Text style={styles.uploadSuccess}>Ready for AI Analysis</Text>
// // //                   </View>
// // //                 </View>
// // //               ) : (
// // //                 <View style={styles.uploadPlaceholder}>
// // //                   <Icon name="camera-alt" size={48} color="#8B5CF6" />
// // //                   <Text style={styles.uploadText}>Capture Bet Slip</Text>
// // //                   <Text style={styles.uploadSubtext}>AI Vision will extract matches automatically</Text>
// // //                 </View>
// // //               )}
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* Analyze Button */}
// // //         <TouchableOpacity
// // //           style={[
// // //             styles.analyzeButton,
// // //             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
// // //           ]}
// // //           onPress={handleAnalyze}
// // //           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
// // //         >
// // //           {isAnalyzing ? (
// // //             <ActivityIndicator color="#FFFFFF" />
// // //           ) : (
// // //             <View style={styles.analyzeContent}>
// // //               <Icon name="auto_awesome" size={24} color="#FFFFFF" />
// // //               <Text style={styles.analyzeButtonText}>Start AI Analysis</Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>

// // //         {/* Professional Guarantee */}
// // //         <View style={styles.guaranteeCard}>
// // //           <Icon name="verified" size={24} color="#10B981" />
// // //           <View style={styles.guaranteeContent}>
// // //             <Text style={styles.guaranteeTitle}>Professional Grade Analysis</Text>
// // //             <Text style={styles.guaranteeText}>
// // //               Advanced AI risk assessment with detailed reasoning and professional insights
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </ScrollView>

// // //       {/* Modals */}
// // //       {renderImageOptionsModal()}
// // //       {renderReasonsModal()}
// // //       {renderResultsModal()}

// // //       {/* Scanning Modal */}
// // //       <Modal visible={showScanModal} transparent animationType="fade" statusBarTranslucent>
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.scanModal}>
// // //             <View style={styles.scanHeader}>
// // //               <Text style={styles.scanTitle}>AI Analysis in Progress</Text>
// // //               <Text style={styles.scanSubtitle}>Professional risk assessment underway</Text>
// // //             </View>

// // //             <View style={styles.scanAnimation}>
// // //               <View style={styles.scanIconContainer}>
// // //                 <Icon name="psychology" size={64} color="#8B5CF6" />
// // //                 <View style={styles.pulseCircle} />
// // //               </View>
// // //             </View>

// // //             <View style={styles.progressContainer}>
// // //               <View style={styles.progressBackground}>
// // //                 <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
// // //               </View>
// // //               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
// // //             </View>

// // //             <View style={styles.scanSteps}>
// // //               {['Processing Input', 'AI Vision Analysis', 'Risk Assessment', 'Generating Report'].map((step, index) => (
// // //                 <View key={index} style={styles.scanStep}>
// // //                   <Icon 
// // //                     name="check-circle" 
// // //                     size={20} 
// // //                     color={scanProgress >= (index + 1) * 25 ? "#10B981" : "#6B7280"} 
// // //                   />
// // //                   <Text style={styles.scanStepText}>{step}</Text>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#111827' },
// // //   scrollView: { flex: 1, padding: 20 },
  
// // //   // Header Styles
// // //   header: { alignItems: 'center', marginBottom: 32, marginTop: 10 },
// // //   headerBadge: { 
// // //     flexDirection: 'row', 
// // //     alignItems: 'center', 
// // //     backgroundColor: 'rgba(139, 92, 246, 0.2)', 
// // //     paddingHorizontal: 12, 
// // //     paddingVertical: 6, 
// // //     borderRadius: 12, 
// // //     marginBottom: 12 
// // //   },
// // //   headerBadgeText: { color: '#8B5CF6', fontSize: 12, fontWeight: '600', marginLeft: 4 },
// // //   title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
// // //   subtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  
// // //   // Testimonials
// // //   testimonialsSection: { marginBottom: 32 },
// // //   testimonialSlide: { alignItems: 'center' },
// // //   testimonialCard: { backgroundColor: '#1F2937', padding: 20, borderRadius: 16, width: '100%' },
// // //   testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // //   winAmount: { fontSize: 14, fontWeight: 'bold', color: '#10B981', marginLeft: 8 },
// // //   testimonialText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22, marginBottom: 12, fontStyle: 'italic' },
// // //   testimonialFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // //   testimonialAuthor: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
// // //   savingsAmount: { color: '#10B981', fontSize: 14, fontWeight: 'bold' },
// // //   testimonialIndicators: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
// // //   indicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#374151', marginHorizontal: 3 },
// // //   indicatorActive: { backgroundColor: '#8B5CF6', width: 20 },
  
// // //   // Input Section
// // //   inputSection: { marginBottom: 24 },
// // //   sectionLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginBottom: 16, letterSpacing: 1 },
// // //   inputCard: { backgroundColor: '#1F2937', padding: 20, borderRadius: 16, marginBottom: 16 },
// // //   inputHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // //   inputTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginLeft: 8 },
  
// // //   // Booking ID Input
// // //   bookingIdInputContainer: { backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
// // //   bookingIdInput: { color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
  
// // //   // Manual Input
// // //   matchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
// // //   matchInput: { flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
// // //   addMatchButton: { backgroundColor: '#8B5CF6', padding: 12, margin: 6, borderRadius: 8 },
// // //   addedMatchesContainer: { backgroundColor: '#374151', padding: 12, borderRadius: 8, marginTop: 12 },
// // //   addedMatchesTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
// // //   addedMatchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#4B5563' },
// // //   addedMatchText: { color: '#FFFFFF', fontSize: 14, flex: 1 },
  
// // //   // Image Upload
// // //   uploadCard: { backgroundColor: '#374151', borderWidth: 2, borderColor: '#4B5563', borderStyle: 'dashed', borderRadius: 16, overflow: 'hidden' },
// // //   uploadPlaceholder: { alignItems: 'center', padding: 40 },
// // //   uploadText: { fontSize: 18, fontWeight: 'bold', color: '#8B5CF6', marginTop: 12, marginBottom: 4 },
// // //   uploadSubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
// // //   imagePreview: { position: 'relative', height: 160 },
// // //   previewImage: { width: '100%', height: '100%' },
// // //   imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center', justifyContent: 'center' },
// // //   uploadSuccess: { color: '#10B981', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  
// // //   // Analyze Button
// // //   analyzeButton: { backgroundColor: '#8B5CF6', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
// // //   analyzeButtonDisabled: { backgroundColor: '#374151' },
// // //   analyzeContent: { flexDirection: 'row', alignItems: 'center' },
// // //   analyzeButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  
// // //   // Guarantee Card
// // //   guaranteeCard: { flexDirection: 'row', backgroundColor: '#1F2937', padding: 20, borderRadius: 16, alignItems: 'center' },
// // //   guaranteeContent: { flex: 1, marginLeft: 12 },
// // //   guaranteeTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
// // //   guaranteeText: { color: '#9CA3AF', fontSize: 14, lineHeight: 18 },
  
// // //   // Modal Overlay
// // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  
// // //   // Image Options Modal
// // //   imageOptionsModal: { backgroundColor: '#1F2937', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
// // //   modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
// // //   modalSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 24 },
// // //   imageOptionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 12 },
// // //   optionIconContainer: { backgroundColor: '#8B5CF6', padding: 8, borderRadius: 8, marginRight: 12 },
// // //   optionTextContainer: { flex: 1 },
// // //   optionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// // //   optionSubtitle: { color: '#9CA3AF', fontSize: 12 },
// // //   cancelButton: { backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
// // //   cancelButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  
// // //   // Scan Modal
// // //   scanModal: { backgroundColor: '#1F2937', borderRadius: 20, padding: 30, width: '100%', maxWidth: 400, alignItems: 'center' },
// // //   scanHeader: { alignItems: 'center', marginBottom: 30 },
// // //   scanTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
// // //   scanSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
// // //   scanAnimation: { alignItems: 'center', marginBottom: 30 },
// // //   scanIconContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
// // //   pulseCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(139, 92, 246, 0.2)', top: -8 },
// // //   progressContainer: { width: '100%', marginBottom: 25 },
// // //   progressBackground: { height: 8, backgroundColor: '#374151', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
// // //   progressFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
// // //   progressText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
// // //   scanSteps: { width: '100%', marginBottom: 20 },
// // //   scanStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // //   scanStepText: { color: '#FFFFFF', marginLeft: 12, fontSize: 14, fontWeight: '500' },
  
// // //   // Results Modal
// // //   resultsModal: { backgroundColor: '#1F2937', borderRadius: 20, width: '100%', maxWidth: 500, height: '90%' },
// // //   resultsHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
// // //   resultsTitleContainer: { flex: 1, marginLeft: 12 },
// // //   resultsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
// // //   resultsSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
// // //   closeButton: { padding: 4 },
// // //   resultsContent: { flex: 1, padding: 20 },
  
// // //   // Verdict Card
// // //   verdictCard: { backgroundColor: '#374151', padding: 20, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4 },
// // //   verdictType: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
// // //   verdictMessage: { fontSize: 16, color: '#FFFFFF', marginBottom: 8 },
// // //   verdictDescription: { fontSize: 14, color: '#9CA3AF', marginBottom: 12, lineHeight: 18 },
// // //   verdictRecommendation: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 12, borderRadius: 8 },
// // //   recommendationText: { color: '#FFFFFF', fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 18 },
  
// // //   // Confidence Card
// // //   confidenceCard: { backgroundColor: '#374151', padding: 20, borderRadius: 12, marginBottom: 20 },
// // //   confidenceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // //   confidenceTitle: { fontSize: 16, fontWeight: 'bold', color: '#8B5CF6', marginLeft: 8 },
// // //   confidenceScoreContainer: { alignItems: 'center', marginBottom: 12 },
// // //   confidenceScore: { fontSize: 48, fontWeight: 'bold', color: '#8B5CF6', marginBottom: 12 },
// // //   confidenceMeter: { width: '100%', height: 12, backgroundColor: '#4B5563', borderRadius: 6, overflow: 'hidden' },
// // //   confidenceFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 6 },
// // //   confidenceDescription: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', lineHeight: 18 },
  
// // //   // Matches Section
// // //   matchesSection: { marginBottom: 20 },
// // //   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
// // //   matchCard: { backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4 },
// // //   matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
// // //   matchTeams: { flex: 1, marginRight: 12 },
// // //   homeTeam: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// // //   vsText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginVertical: 2 },
// // //   awayTeam: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// // //   matchRisk: { alignItems: 'center' },
// // //   riskEmoji: { fontSize: 16, marginBottom: 4 },
// // //   riskLevel: { fontSize: 12, fontWeight: 'bold' },
// // //   matchStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#4B5563' },
// // //   statItem: { alignItems: 'center', flex: 1 },
// // //   statLabel: { color: '#9CA3AF', fontSize: 10, marginBottom: 4 },
// // //   statValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
// // //   viewReasonsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: 12, borderRadius: 8 },
// // //   viewReasonsText: { color: '#8B5CF6', fontSize: 14, fontWeight: '600', marginRight: 8 },
  
// // //   // Insights Card
// // //   insightsCard: { backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 20 },
// // //   insightsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// // //   insightsTitle: { fontSize: 16, fontWeight: 'bold', color: '#8B5CF6', marginLeft: 8 },
// // //   insightItem: { backgroundColor: '#4B5563', padding: 12, borderRadius: 8, marginBottom: 8 },
// // //   insightText: { color: '#FFFFFF', fontSize: 14, lineHeight: 18 },
  
// // //   // Action Buttons
// // //   actionButtons: { flexDirection: 'row', gap: 12 },
// // //   newScanButton: { flex: 1, flexDirection: 'row', backgroundColor: '#8B5CF6', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// // //   newScanButtonText: { color: '#FFFFFF', fontWeight: 'bold', marginLeft: 8 },
// // //   shareButton: { flex: 1, flexDirection: 'row', backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// // //   shareButtonText: { color: '#8B5CF6', fontWeight: 'bold', marginLeft: 8 },
  
// // //   // Reasons Modal
// // //   reasonsModal: { backgroundColor: '#1F2937', borderRadius: 20, width: '100%', maxWidth: 500, height: '90%' },
// // //   reasonsHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
// // //   reasonsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
// // //   reasonsSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 },
// // //   reasonsContent: { flex: 1, padding: 20 },
  
// // //   // Reason Sections
// // //   reasonSection: { marginBottom: 24 },
// // //   sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
// // //   riskOverview: { backgroundColor: '#374151', padding: 16, borderRadius: 12 },
// // //   riskBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
// // //   riskBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
// // //   riskScore: { color: '#EF4444', fontSize: 14, fontWeight: '600', marginBottom: 4 },
// // //   confidenceScore: { color: '#10B981', fontSize: 14, fontWeight: '600' },
  
// // //   // Factor Items
// // //   factorItem: { flexDirection: 'row', backgroundColor: '#374151', padding: 12, borderRadius: 8, marginBottom: 8 },
// // //   factorIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
// // //   factorContent: { flex: 1 },
// // //   factorTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
// // //   factorDescription: { color: '#9CA3AF', fontSize: 12, marginBottom: 4, lineHeight: 16 },
// // //   factorImpact: { color: '#6B7280', fontSize: 11, fontWeight: '500' },
  
// // //   // Recommendation Box
// // //   recommendationBox: { flexDirection: 'row', backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'flex-start' },
  
// // //   // Details Grid
// // //   detailsGrid: { backgroundColor: '#374151', padding: 16, borderRadius: 12 },
// // //   detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
// // //   detailLabel: { color: '#9CA3AF', fontSize: 14 },
// // //   detailValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
// // // });

// // // export default AnalysisScreen;

// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   StatusBar,
// //   Image,
// //   Animated,
// //   Easing,
// //   Dimensions,
// //   Modal,
// //   Alert,
// //   TextInput,
// //   ActivityIndicator,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // const { width, height } = Dimensions.get('window');
// // const API_BASE_URL = 'http://192.168.1.100:8000/api';

// // const AnalysisScreen = ({ navigation }) => {
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [bookingId, setBookingId] = useState('');
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [showScanModal, setShowScanModal] = useState(false);
// //   const [showResultsModal, setShowResultsModal] = useState(false);
// //   const [scanProgress, setScanProgress] = useState(0);
// //   const [analysisResult, setAnalysisResult] = useState(null);
// //   const [showImageOptions, setShowImageOptions] = useState(false);
// //   const [showReasonsModal, setShowReasonsModal] = useState(false);
// //   const [selectedMatch, setSelectedMatch] = useState(null);
// //   const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

// //   const slideAnim = useRef(new Animated.Value(0)).current;
// //   const progressAnim = useRef(new Animated.Value(0)).current;
// //   const [manualMatches, setManualMatches] = useState([]);
// //   const [currentMatchInput, setCurrentMatchInput] = useState('');

// //   // Analysis steps with descriptions
// //   const analysisSteps = [
// //     { id: 1, text: "Checking team forms...", icon: "trending-up" },
// //     { id: 2, text: "Checking injuries...", icon: "healing" },
// //     { id: 3, text: "Checking head-to-head...", icon: "compare-arrows" },
// //     { id: 4, text: "Evaluating risk factors...", icon: "warning" },
// //     { id: 5, text: "Generating confidence score...", icon: "psychology" }
// //   ];

// //   // Image Picker Options
// //   const imagePickerOptions = {
// //     mediaType: 'photo',
// //     quality: 0.9,
// //     maxWidth: 2048,
// //     maxHeight: 2048,
// //     includeBase64: true,
// //   };

// //   // Enhanced Image Selection
// //   const handleImageSelect = () => {
// //     setShowImageOptions(true);
// //   };

// //   const takePhoto = () => {
// //     setShowImageOptions(false);
// //     launchCamera(imagePickerOptions, (response) => {
// //       if (response.didCancel) return;
// //       if (response.error) {
// //         Alert.alert('Camera Error', 'Please allow camera permissions');
// //         return;
// //       }
// //       if (response.assets && response.assets[0]) {
// //         setSelectedImage(response.assets[0].uri);
// //       }
// //     });
// //   };

// //   const chooseFromGallery = () => {
// //     setShowImageOptions(false);
// //     launchImageLibrary(imagePickerOptions, (response) => {
// //       if (response.didCancel) return;
// //       if (response.error) {
// //         Alert.alert('Gallery Error', 'Cannot access photo library');
// //         return;
// //       }
// //       if (response.assets && response.assets[0]) {
// //         setSelectedImage(response.assets[0].uri);
// //       }
// //     });
// //   };

// //   const addManualMatch = () => {
// //     if (!currentMatchInput.trim()) return;

// //     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
// //     const match = currentMatchInput.match(matchRegex);

// //     if (match) {
// //       const homeTeam = match[1].trim();
// //       const awayTeam = match[2].trim();
      
// //       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
// //       setCurrentMatchInput('');
// //     } else {
// //       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
// //     }
// //   };

// //   const removeManualMatch = (index) => {
// //     setManualMatches(prev => prev.filter((_, i) => i !== index));
// //   };

// //   const handleAnalyze = async () => {
// //     const hasImage = !!selectedImage;
// //     const hasBookingId = !!bookingId;
// //     const hasManualMatches = manualMatches.length > 0;

// //     if (!hasImage && !hasBookingId && !hasManualMatches) {
// //       Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
// //       return;
// //     }

// //     setIsAnalyzing(true);
// //     setShowScanModal(true);
// //     setCurrentAnalysisStep(0);
// //     startScanAnimation();

// //     try {
// //       let response;
// //       const token = await AsyncStorage.getItem('access_token');

// //       if (hasManualMatches) {
// //         response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
// //           method: 'POST',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({ matches: manualMatches }),
// //         });
// //       } else if (selectedImage) {
// //         const formData = new FormData();
// //         const filename = selectedImage.split('/').pop();
// //         const match = /\.(\w+)$/.exec(filename);
// //         const type = match ? `image/${match[1]}` : `image/jpeg`;

// //         formData.append('image', {
// //           uri: selectedImage,
// //           type: type,
// //           name: filename || 'bet_slip.jpg',
// //         });
        
// //         if (bookingId) formData.append('booking_id', bookingId);

// //         response = await fetch(`${API_BASE_URL}/bets/slips/`, {
// //           method: 'POST',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'multipart/form-data',
// //           },
// //           body: formData,
// //         });
// //       } else {
// //         response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
// //           method: 'POST',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({ booking_id: bookingId }),
// //         });
// //       }

// //       const result = await response.json();
      
// //       if (response.ok) {
// //         setAnalysisResult(result);
// //         setTimeout(() => {
// //           setShowScanModal(false);
// //           navigation.navigate('AiResults', { 
// //             analysisResult: result,
// //             onNewAnalysis: () => {
// //               setSelectedImage(null);
// //               setBookingId('');
// //               setManualMatches([]);
// //               setAnalysisResult(null);
// //             }
// //           });
// //         }, 800);
// //       } else {
// //         throw new Error(result.error || 'Analysis failed');
// //       }
// //     } catch (error) {
// //       Alert.alert('Analysis Error', 'Please check your connection and try again');
// //       setShowScanModal(false);
// //     } finally {
// //       setIsAnalyzing(false);
// //     }
// //   };

// //   const startScanAnimation = () => {
// //     setScanProgress(0);
// //     progressAnim.setValue(0);
    
// //     const duration = 5000;
// //     const stepDuration = duration / analysisSteps.length;
// //     let currentStep = 0;

// //     const progressInterval = setInterval(() => {
// //       currentStep++;
// //       const progress = (currentStep / analysisSteps.length) * 100;
// //       setScanProgress(progress);
      
// //       Animated.timing(progressAnim, {
// //         toValue: progress,
// //         duration: stepDuration,
// //         useNativeDriver: false,
// //         easing: Easing.out(Easing.ease),
// //       }).start();

// //       // Update current analysis step
// //       if (currentStep <= analysisSteps.length) {
// //         setCurrentAnalysisStep(currentStep - 1);
// //       }

// //       if (currentStep >= analysisSteps.length) {
// //         clearInterval(progressInterval);
// //       }
// //     }, stepDuration);
// //   };

// //   const getRiskColor = (riskLevel) => {
// //     switch (riskLevel?.toUpperCase()) {
// //       case 'LOW_RISK': return '#10B981';
// //       case 'MEDIUM_RISK': return '#F59E0B';
// //       case 'HIGH_RISK': return '#EF4444';
// //       default: return '#6B7280';
// //     }
// //   };

// //   const getRiskEmoji = (riskLevel) => {
// //     switch (riskLevel?.toUpperCase()) {
// //       case 'LOW_RISK': return '💎';
// //       case 'MEDIUM_RISK': return '⚠️';
// //       case 'HIGH_RISK': return '🚨';
// //       default: return '❓';
// //     }
// //   };

// //   const renderImageOptionsModal = () => (
// //     <Modal visible={showImageOptions} transparent animationType="slide">
// //       <View style={styles.modalOverlay}>
// //         <View style={styles.imageOptionsModal}>
// //           <Text style={styles.modalTitle}>Capture Bet Slip</Text>
// //           <Text style={styles.modalSubtitle}>AI Vision will analyze your slip automatically</Text>
          
// //           <TouchableOpacity style={styles.imageOptionButton} onPress={takePhoto}>
// //             <View style={styles.optionIconContainer}>
// //               <Icon name="camera-alt" size={28} color="#FFFFFF" />
// //             </View>
// //             <View style={styles.optionTextContainer}>
// //               <Text style={styles.optionTitle}>Take Photo</Text>
// //               <Text style={styles.optionSubtitle}>Instant AI analysis</Text>
// //             </View>
// //             <Icon name="chevron-right" size={24} color="#9CA3AF" />
// //           </TouchableOpacity>
          
// //           <TouchableOpacity style={styles.imageOptionButton} onPress={chooseFromGallery}>
// //             <View style={styles.optionIconContainer}>
// //               <Icon name="photo-library" size={28} color="#FFFFFF" />
// //             </View>
// //             <View style={styles.optionTextContainer}>
// //               <Text style={styles.optionTitle}>Choose from Gallery</Text>
// //               <Text style={styles.optionSubtitle}>Select existing photo</Text>
// //             </View>
// //             <Icon name="chevron-right" size={24} color="#9CA3AF" />
// //           </TouchableOpacity>
          
// //           <TouchableOpacity style={styles.cancelButton} onPress={() => setShowImageOptions(false)}>
// //             <Text style={styles.cancelButtonText}>Cancel</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </Modal>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
// //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// //         {/* Professional Header */}
// //         <View style={styles.header}>
// //           <View style={styles.headerBadge}>
// //             <Icon name="psychology" size={16} color="#FFFFFF" />
// //             <Text style={styles.headerBadgeText}>AI POWERED</Text>
// //           </View>
// //           <Text style={styles.title}>Professional Bet Analysis</Text>
// //           <Text style={styles.subtitle}>
// //             Advanced AI-powered risk assessment with professional insights and detailed analysis
// //           </Text>
// //         </View>

// //         {/* Input Methods */}
// //         <View style={styles.inputSection}>
// //           <Text style={styles.sectionLabel}>ANALYSIS METHODS</Text>
          
// //           {/* Booking ID */}
// //           <View style={styles.inputCard}>
// //             <View style={styles.inputHeader}>
// //               <Icon name="receipt" size={20} color="#24ad0c" />
// //               <Text style={styles.inputTitle}>Booking ID Analysis</Text>
// //             </View>
// //             <View style={styles.bookingIdInputContainer}>
// //               <TextInput
// //                 style={styles.bookingIdInput}
// //                 placeholder="Enter Bet9ja booking ID"
// //                 placeholderTextColor="#9CA3AF"
// //                 value={bookingId}
// //                 onChangeText={setBookingId}
// //                 editable={!isAnalyzing}
// //               />
// //             </View>
// //           </View>

// //           {/* Manual Input */}
// //           <View style={styles.inputCard}>
// //             <View style={styles.inputHeader}>
// //               <Icon name="edit" size={20} color="#24ad0c" />
// //               <Text style={styles.inputTitle}>Manual Match Entry</Text>
// //             </View>
// //             <View style={styles.matchInputContainer}>
// //               <TextInput
// //                 style={styles.matchInput}
// //                 placeholder="e.g., Arsenal vs Tottenham"
// //                 placeholderTextColor="#9CA3AF"
// //                 value={currentMatchInput}
// //                 onChangeText={setCurrentMatchInput}
// //                 onSubmitEditing={addManualMatch}
// //                 editable={!isAnalyzing}
// //               />
// //               <TouchableOpacity 
// //                 style={styles.addMatchButton} 
// //                 onPress={addManualMatch}
// //                 disabled={!currentMatchInput.trim() || isAnalyzing}
// //               >
// //                 <Icon name="add" size={20} color="#FFFFFF" />
// //               </TouchableOpacity>
// //             </View>
            
// //             {manualMatches.length > 0 && (
// //               <View style={styles.addedMatchesContainer}>
// //                 <Text style={styles.addedMatchesTitle}>Matches to Analyze ({manualMatches.length})</Text>
// //                 {manualMatches.map((match, index) => (
// //                   <View key={index} style={styles.addedMatchItem}>
// //                     <Text style={styles.addedMatchText}>{match.homeTeam} vs {match.awayTeam}</Text>
// //                     <TouchableOpacity onPress={() => removeManualMatch(index)}>
// //                       <Icon name="close" size={16} color="#EF4444" />
// //                     </TouchableOpacity>
// //                   </View>
// //                 ))}
// //               </View>
// //             )}
// //           </View>

// //           {/* Image Upload */}
// //           <View style={styles.inputCard}>
// //             <View style={styles.inputHeader}>
// //               <Icon name="camera-alt" size={20} color="#24ad0c" />
// //               <Text style={styles.inputTitle}>AI Vision Analysis</Text>
// //             </View>
// //             <TouchableOpacity
// //               style={styles.uploadCard}
// //               onPress={handleImageSelect}
// //               disabled={isAnalyzing}
// //             >
// //               {selectedImage ? (
// //                 <View style={styles.imagePreview}>
// //                   <Image source={{ uri: selectedImage }} style={styles.previewImage} />
// //                   <View style={styles.imageOverlay}>
// //                     <Icon name="check-circle" size={32} color="#24ad0c" />
// //                     <Text style={styles.uploadSuccess}>Ready for AI Analysis</Text>
// //                   </View>
// //                 </View>
// //               ) : (
// //                 <View style={styles.uploadPlaceholder}>
// //                   <Icon name="camera-alt" size={48} color="#24ad0c" />
// //                   <Text style={styles.uploadText}>Capture Bet Slip</Text>
// //                   <Text style={styles.uploadSubtext}>AI Vision will extract matches automatically</Text>
// //                 </View>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* Analyze Button */}
// //         <TouchableOpacity
// //           style={[
// //             styles.analyzeButton,
// //             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
// //           ]}
// //           onPress={handleAnalyze}
// //           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
// //         >
// //           {isAnalyzing ? (
// //             <ActivityIndicator color="#FFFFFF" />
// //           ) : (
// //             <View style={styles.analyzeContent}>
// //               <Icon name="auto_awesome" size={24} color="#FFFFFF" />
// //               <Text style={styles.analyzeButtonText}>Start Professional Analysis</Text>
// //             </View>
// //           )}
// //         </TouchableOpacity>

// //         {/* Professional Guarantee */}
// //         <View style={styles.guaranteeCard}>
// //           <Icon name="verified" size={24} color="#24ad0c" />
// //           <View style={styles.guaranteeContent}>
// //             <Text style={styles.guaranteeTitle}>Professional Grade Analysis</Text>
// //             <Text style={styles.guaranteeText}>
// //               Advanced AI risk assessment with detailed reasoning and professional insights
// //             </Text>
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Modals */}
// //       {renderImageOptionsModal()}

// //       {/* Scanning Modal */}
// //       <Modal visible={showScanModal} transparent animationType="fade" statusBarTranslucent>
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.scanModal}>
// //             <View style={styles.scanHeader}>
// //               <Text style={styles.scanTitle}>Professional Analysis in Progress</Text>
// //               <Text style={styles.scanSubtitle}>AI is conducting comprehensive risk assessment</Text>
// //             </View>

// //             <View style={styles.scanAnimation}>
// //               <View style={styles.scanIconContainer}>
// //                 <Icon name="psychology" size={64} color="#24ad0c" />
// //                 <View style={styles.pulseCircle} />
// //               </View>
// //             </View>

// //             <View style={styles.progressContainer}>
// //               <View style={styles.progressBackground}>
// //                 <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
// //               </View>
// //               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
// //             </View>

// //             <View style={styles.analysisSteps}>
// //               {analysisSteps.map((step, index) => (
// //                 <View key={step.id} style={styles.analysisStep}>
// //                   <Icon 
// //                     name={step.icon} 
// //                     size={20} 
// //                     color={index <= currentAnalysisStep ? "#24ad0c" : "#6B7280"} 
// //                   />
// //                   <Text style={[
// //                     styles.analysisStepText,
// //                     { color: index <= currentAnalysisStep ? "#FFFFFF" : "#6B7280" }
// //                   ]}>
// //                     {step.text}
// //                   </Text>
// //                   {index <= currentAnalysisStep && (
// //                     <Icon name="check-circle" size={16} color="#24ad0c" style={styles.stepCheck} />
// //                   )}
// //                 </View>
// //               ))}
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };



// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#111827' },
// //   scrollView: { flex: 1, padding: 20 },
  
// //   // Header Styles
// //   header: { alignItems: 'center', marginBottom: 32, marginTop: 10 },
// //   headerBadge: { 
// //     flexDirection: 'row', 
// //     alignItems: 'center', 
// //     backgroundColor: 'rgba(36, 173, 12, 0.2)', 
// //     paddingHorizontal: 12, 
// //     paddingVertical: 6, 
// //     borderRadius: 12, 
// //     marginBottom: 12 
// //   },
// //   headerBadgeText: { color: '#24ad0c', fontSize: 12, fontWeight: '600', marginLeft: 4 },
// //   title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
// //   subtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  
// //   // Input Section
// //   inputSection: { marginBottom: 24 },
// //   sectionLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginBottom: 16, letterSpacing: 1 },
// //   inputCard: { backgroundColor: '#1F2937', padding: 20, borderRadius: 16, marginBottom: 16 },
// //   inputHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// //   inputTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginLeft: 8 },
  
// //   // Booking ID Input
// //   bookingIdInputContainer: { backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
// //   bookingIdInput: { color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
  
// //   // Manual Input
// //   matchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
// //   matchInput: { flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
// //   addMatchButton: { backgroundColor: '#24ad0c', padding: 12, margin: 6, borderRadius: 8 },
// //   addedMatchesContainer: { backgroundColor: '#374151', padding: 12, borderRadius: 8, marginTop: 12 },
// //   addedMatchesTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
// //   addedMatchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#4B5563' },
// //   addedMatchText: { color: '#FFFFFF', fontSize: 14, flex: 1 },
  
// //   // Image Upload
// //   uploadCard: { backgroundColor: '#374151', borderWidth: 2, borderColor: '#4B5563', borderStyle: 'dashed', borderRadius: 16, overflow: 'hidden' },
// //   uploadPlaceholder: { alignItems: 'center', padding: 40 },
// //   uploadText: { fontSize: 18, fontWeight: 'bold', color: '#24ad0c', marginTop: 12, marginBottom: 4 },
// //   uploadSubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
// //   imagePreview: { position: 'relative', height: 160 },
// //   previewImage: { width: '100%', height: '100%' },
// //   imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center', justifyContent: 'center' },
// //   uploadSuccess: { color: '#24ad0c', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  
// //   // Analyze Button
// //   analyzeButton: { backgroundColor: '#24ad0c', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
// //   analyzeButtonDisabled: { backgroundColor: '#374151' },
// //   analyzeContent: { flexDirection: 'row', alignItems: 'center' },
// //   analyzeButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  
// //   // Guarantee Card
// //   guaranteeCard: { flexDirection: 'row', backgroundColor: '#1F2937', padding: 20, borderRadius: 16, alignItems: 'center' },
// //   guaranteeContent: { flex: 1, marginLeft: 12 },
// //   guaranteeTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
// //   guaranteeText: { color: '#9CA3AF', fontSize: 14, lineHeight: 18 },
  
// //   // Modal Overlay
// //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  
// //   // Image Options Modal
// //   imageOptionsModal: { backgroundColor: '#1F2937', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
// //   modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
// //   modalSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 24 },
// //   imageOptionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 12 },
// //   optionIconContainer: { backgroundColor: '#24ad0c', padding: 8, borderRadius: 8, marginRight: 12 },
// //   optionTextContainer: { flex: 1 },
// //   optionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// //   optionSubtitle: { color: '#9CA3AF', fontSize: 12 },
// //   cancelButton: { backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
// //   cancelButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  
// //   // Scan Modal
// //   scanModal: { backgroundColor: '#1F2937', borderRadius: 20, padding: 30, width: '100%', maxWidth: 400, alignItems: 'center' },
// //   scanHeader: { alignItems: 'center', marginBottom: 30 },
// //   scanTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
// //   scanSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
// //   scanAnimation: { alignItems: 'center', marginBottom: 30 },
// //   scanIconContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
// //   pulseCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(36, 173, 12, 0.2)', top: -8 },
// //   progressContainer: { width: '100%', marginBottom: 25 },
// //   progressBackground: { height: 8, backgroundColor: '#374151', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
// //   progressFill: { height: '100%', backgroundColor: '#24ad0c', borderRadius: 4 },
// //   progressText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  
// //   // Analysis Steps
// //   analysisSteps: { width: '100%', marginBottom: 20 },
// //   analysisStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 12, backgroundColor: '#374151', borderRadius: 8 },
// //   analysisStepText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '500' },
// //   stepCheck: { marginLeft: 8 },
  
// //   // Results Screen Styles
// //   resultsHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#1F2937', borderBottomWidth: 1, borderBottomColor: '#374151' },
// //   backButton: { padding: 8, marginRight: 12 },
// //   resultsTitleContainer: { flex: 1 },
// //   resultsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
// //   resultsSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
// //   resultsContent: { flex: 1, padding: 20 },
  
// //   // Verdict Card
// //   verdictCard: { backgroundColor: '#374151', padding: 20, borderRadius: 12, marginBottom: 16, borderLeftWidth: 4 },
// //   verdictType: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
// //   verdictMessage: { fontSize: 16, color: '#FFFFFF', marginBottom: 8 },
// //   verdictDescription: { fontSize: 14, color: '#9CA3AF', marginBottom: 12, lineHeight: 18 },
// //   verdictRecommendation: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 12, borderRadius: 8 },
// //   recommendationText: { color: '#FFFFFF', fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 18 },
  
// //   // Confidence Card
// //   confidenceCard: { backgroundColor: '#374151', padding: 20, borderRadius: 12, marginBottom: 20 },
// //   confidenceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// //   confidenceTitle: { fontSize: 16, fontWeight: 'bold', color: '#24ad0c', marginLeft: 8 },
// //   confidenceScoreContainer: { alignItems: 'center', marginBottom: 12 },
// //   confidenceScore: { fontSize: 48, fontWeight: 'bold', color: '#24ad0c', marginBottom: 12 },
// //   confidenceMeter: { width: '100%', height: 12, backgroundColor: '#4B5563', borderRadius: 6, overflow: 'hidden' },
// //   confidenceFill: { height: '100%', backgroundColor: '#24ad0c', borderRadius: 6 },
// //   confidenceDescription: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', lineHeight: 18 },
  
// //   // Matches Section
// //   matchesSection: { marginBottom: 20 },
// //   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
// //   matchCard: { backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4 },
// //   matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
// //   matchTeams: { flex: 1, marginRight: 12 },
// //   homeTeam: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// //   vsText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginVertical: 2 },
// //   awayTeam: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
// //   matchRisk: { alignItems: 'center' },
// //   riskEmoji: { fontSize: 16, marginBottom: 4 },
// //   riskLevel: { fontSize: 12, fontWeight: 'bold' },
// //   matchStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#4B5563' },
// //   statItem: { alignItems: 'center', flex: 1 },
// //   statLabel: { color: '#9CA3AF', fontSize: 10, marginBottom: 4 },
// //   statValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
// //   viewReasonsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(36, 173, 12, 0.1)', padding: 12, borderRadius: 8 },
// //   viewReasonsText: { color: '#24ad0c', fontSize: 14, fontWeight: '600', marginRight: 8 },
  
// //   // Insights Card
// //   insightsCard: { backgroundColor: '#374151', padding: 16, borderRadius: 12, marginBottom: 20 },
// //   insightsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
// //   insightsTitle: { fontSize: 16, fontWeight: 'bold', color: '#24ad0c', marginLeft: 8 },
// //   insightItem: { backgroundColor: '#4B5563', padding: 12, borderRadius: 8, marginBottom: 8 },
// //   insightText: { color: '#FFFFFF', fontSize: 14, lineHeight: 18 },
  
// //   // Action Buttons
// //   actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
// //   newScanButton: { flex: 1, flexDirection: 'row', backgroundColor: '#24ad0c', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// //   newScanButtonText: { color: '#FFFFFF', fontWeight: 'bold', marginLeft: 8 },
// //   shareButton: { flex: 1, flexDirection: 'row', backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// //   shareButtonText: { color: '#24ad0c', fontWeight: 'bold', marginLeft: 8 },
  
// //   // Reasons Modal
// //   reasonsModal: { backgroundColor: '#1F2937', borderRadius: 20, width: '100%', maxWidth: 500, height: '90%' },
// //   reasonsHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
// //   reasonsTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
// //   reasonsSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 },
// //   reasonsContent: { flex: 1, padding: 20 },
  
// //   // Reason Sections
// //   reasonSection: { marginBottom: 24 },
// //   riskOverview: { backgroundColor: '#374151', padding: 16, borderRadius: 12 },
// //   riskBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
// //   riskBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
// //   riskScore: { color: '#EF4444', fontSize: 14, fontWeight: '600', marginBottom: 4 },
// //   confidenceScore: { color: '#24ad0c', fontSize: 14, fontWeight: '600' },
  
// //   // Factor Items
// //   factorItem: { flexDirection: 'row', backgroundColor: '#374151', padding: 12, borderRadius: 8, marginBottom: 8 },
// //   factorIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
// //   factorContent: { flex: 1 },
// //   factorTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
// //   factorDescription: { color: '#9CA3AF', fontSize: 12, marginBottom: 4, lineHeight: 16 },
// //   factorImpact: { color: '#6B7280', fontSize: 11, fontWeight: '500' },
  
// //   // Recommendation Box
// //   recommendationBox: { flexDirection: 'row', backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'flex-start' },
// // });



// // export default AnalysisScreen

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
//   Modal,
//   Alert,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.100:8000/api';

// const AnalysisScreen = ({ navigation }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [bookingId, setBookingId] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [showScanModal, setShowScanModal] = useState(false);
//   const [scanProgress, setScanProgress] = useState(0);
//   const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const [manualMatches, setManualMatches] = useState([]);
//   const [currentMatchInput, setCurrentMatchInput] = useState('');

//   // Analysis steps with descriptions
//   const analysisSteps = [
//     { id: 1, text: "Checking team forms...", icon: "trending-up" },
//     { id: 2, text: "Checking injuries...", icon: "healing" },
//     { id: 3, text: "Checking head-to-head...", icon: "compare-arrows" },
//     { id: 4, text: "Evaluating risk factors...", icon: "warning" },
//     { id: 5, text: "Generating confidence score...", icon: "psychology" }
//   ];

//   // Image Picker Options
//   const imagePickerOptions = {
//     mediaType: 'photo',
//     quality: 0.9,
//     maxWidth: 2048,
//     maxHeight: 2048,
//     includeBase64: true,
//   };

//   const handleImageSelect = () => {
//     launchImageLibrary(imagePickerOptions, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Gallery Error', 'Cannot access photo library');
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         setSelectedImage(response.assets[0].uri);
//       }
//     });
//   };

//   const takePhoto = () => {
//     launchCamera(imagePickerOptions, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Camera Error', 'Please allow camera permissions');
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         setSelectedImage(response.assets[0].uri);
//       }
//     });
//   };

//   const addManualMatch = () => {
//     if (!currentMatchInput.trim()) return;

//     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
//     const match = currentMatchInput.match(matchRegex);

//     if (match) {
//       const homeTeam = match[1].trim();
//       const awayTeam = match[2].trim();
      
//       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
//       setCurrentMatchInput('');
//     } else {
//       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
//     }
//   };

//   const removeManualMatch = (index) => {
//     setManualMatches(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleAnalyze = async () => {
//     const hasImage = !!selectedImage;
//     const hasBookingId = !!bookingId;
//     const hasManualMatches = manualMatches.length > 0;

//     if (!hasImage && !hasBookingId && !hasManualMatches) {
//       Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
//       return;
//     }

//     setIsAnalyzing(true);
//     setShowScanModal(true);
//     setCurrentAnalysisStep(0);
//     startScanAnimation();

//     try {
//       let response;
//       const token = await AsyncStorage.getItem('access_token');

//       // Simulate API call - replace with your actual API
//       setTimeout(async () => {
//         try {
//           if (hasManualMatches) {
//             response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ matches: manualMatches }),
//             });
//           } else if (selectedImage) {
//             const formData = new FormData();
//             const filename = selectedImage.split('/').pop();
//             const match = /\.(\w+)$/.exec(filename);
//             const type = match ? `image/${match[1]}` : `image/jpeg`;

//             formData.append('image', {
//               uri: selectedImage,
//               type: type,
//               name: filename || 'bet_slip.jpg',
//             });
            
//             if (bookingId) formData.append('booking_id', bookingId);

//             response = await fetch(`${API_BASE_URL}/bets/slips/`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data',
//               },
//               body: formData,
//             });
//           } else {
//             response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ booking_id: bookingId }),
//             });
//           }

//           const result = await response.json();
          
//           if (response.ok) {
//             // Navigate to ResultsScreen with the analysis result
//             setShowScanModal(false);
//             navigation.navigate('AiResults', { 
//               analysisResult: result,
//               inputData: {
//                 selectedImage,
//                 bookingId,
//                 manualMatches
//               }
//             });
//           } else {
//             throw new Error(result.error || 'Analysis failed');
//           }
//         } catch (error) {
//           Alert.alert('Analysis Error', error.message || 'Please check your connection and try again');
//           setShowScanModal(false);
//         } finally {
//           setIsAnalyzing(false);
//         }
//       }, 3000); // Simulate API delay

//     } catch (error) {
//       Alert.alert('Analysis Error', 'Please check your connection and try again');
//       setShowScanModal(false);
//       setIsAnalyzing(false);
//     }
//   };

//   const startScanAnimation = () => {
//     setScanProgress(0);
//     progressAnim.setValue(0);
    
//     const duration = 5000;
//     const stepDuration = duration / analysisSteps.length;
//     let currentStep = 0;

//     const progressInterval = setInterval(() => {
//       currentStep++;
//       const progress = (currentStep / analysisSteps.length) * 100;
//       setScanProgress(progress);
      
//       Animated.timing(progressAnim, {
//         toValue: progress,
//         duration: stepDuration,
//         useNativeDriver: false,
//         easing: Easing.out(Easing.ease),
//       }).start();

//       // Update current analysis step
//       if (currentStep <= analysisSteps.length) {
//         setCurrentAnalysisStep(currentStep - 1);
//       }

//       if (currentStep >= analysisSteps.length) {
//         clearInterval(progressInterval);
//       }
//     }, stepDuration);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Professional Header */}
//         <View style={styles.header}>
          
//           <Text style={styles.title}>Professional Bet Analysis</Text>
//           <Text style={styles.subtitle}>
//             Advanced AI-powered risk assessment with professional insights and detailed analysis
//           </Text>
//         </View>

//         {/* Input Methods */}
//         <View style={styles.inputSection}>
//           <Text style={styles.sectionLabel}>ANALYSIS METHODS</Text>
          
//           {/* Booking ID */}
//           {/* <View style={styles.inputCard}>
//             <View style={styles.inputHeader}>
//               <Icon name="receipt" size={20} color="#24ad0c" />
//               <Text style={styles.inputTitle}>Booking ID Analysis</Text>
//             </View>
//             <View style={styles.bookingIdInputContainer}>
//               <TextInput
//                 style={styles.bookingIdInput}
//                 placeholder="Enter Bet9ja booking ID"
//                 placeholderTextColor="#9CA3AF"
//                 value={bookingId}
//                 onChangeText={setBookingId}
//                 editable={!isAnalyzing}
//               />
//             </View>
//           </View> */}

//           {/* Manual Input */}
          

//           {/* Image Upload */}
//           <View style={styles.inputCard}>
//             <View style={styles.inputHeader}>
//               <Icon name="camera-alt" size={20} color="#24ad0c" />
//               <Text style={styles.inputTitle}>AI Vision Analysis</Text>
//             </View>
//             <View style={styles.imageButtonsContainer}>
//               <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
//                 <Icon name="camera-alt" size={24} color="#24ad0c" />
//                 <Text style={styles.imageButtonText}>Take Photo</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.imageButton} onPress={handleImageSelect}>
//                 <Icon name="photo-library" size={24} color="#24ad0c" />
//                 <Text style={styles.imageButtonText}>Choose from Gallery</Text>
//               </TouchableOpacity>
//             </View>
            
//             {selectedImage && (
//               <View style={styles.imagePreview}>
//                 <Image source={{ uri: selectedImage }} style={styles.previewImage} />
//                 <View style={styles.imageOverlay}>
//                   <Icon name="check-circle" size={32} color="#24ad0c" />
//                   <Text style={styles.uploadSuccess}>Ready for AI Analysis</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//           {/* or Manually input bet name =========================*/}
//           <View style={styles.inputCard}>
//             <View style={styles.inputHeader}>
//               <Icon name="edit" size={20} color="#24ad0c" />
//               <Text style={styles.inputTitle}>Manual Match Entry</Text>
//             </View>
//             <View style={styles.matchInputContainer}>
//               <TextInput
//                 style={styles.matchInput}
//                 placeholder="e.g., Arsenal vs Tottenham"
//                 placeholderTextColor="#9CA3AF"
//                 value={currentMatchInput}
//                 onChangeText={setCurrentMatchInput}
//                 onSubmitEditing={addManualMatch}
//                 editable={!isAnalyzing}
//               />
//               <TouchableOpacity 
//                 style={styles.addMatchButton} 
//                 onPress={addManualMatch}
//                 disabled={!currentMatchInput.trim() || isAnalyzing}
//               >
//                 <Icon name="add" size={20} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
            
//             {manualMatches.length > 0 && (
//               <View style={styles.addedMatchesContainer}>
//                 <Text style={styles.addedMatchesTitle}>Matches to Analyze ({manualMatches.length})</Text>
//                 {manualMatches.map((match, index) => (
//                   <View key={index} style={styles.addedMatchItem}>
//                     <Text style={styles.addedMatchText}>{match.homeTeam} vs {match.awayTeam}</Text>
//                     <TouchableOpacity onPress={() => removeManualMatch(index)}>
//                       <Icon name="close" size={16} color="#EF4444" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Analyze Button */}
//         <TouchableOpacity
//           style={[
//             styles.analyzeButton,
//             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
//           ]}
//           onPress={handleAnalyze}
//           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
//         >
//           {isAnalyzing ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <View style={styles.analyzeContent}>
//               <Icon name="auto_awesome" size={24} color="#FFFFFF" />
//               <Text style={styles.analyzeButtonText}>Start Professional Analysis</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* Professional Guarantee */}
//         <View style={styles.guaranteeCard}>
//           <Icon name="verified" size={24} color="#24ad0c" />
//           <View style={styles.guaranteeContent}>
//             <Text style={styles.guaranteeTitle}>Professional Grade Analysis</Text>
//             <Text style={styles.guaranteeText}>
//               Advanced AI risk assessment with detailed reasoning and professional insights
//             </Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Scanning Modal */}
//       <Modal visible={showScanModal} transparent animationType="fade" statusBarTranslucent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.scanModal}>
//             <View style={styles.scanHeader}>
//               <Text style={styles.scanTitle}>Professional Analysis in Progress</Text>
//               <Text style={styles.scanSubtitle}>AI is conducting comprehensive risk assessment</Text>
//             </View>

//             <View style={styles.scanAnimation}>
//               <View style={styles.scanIconContainer}>
//                 <Icon name="psychology" size={64} color="#24ad0c" />
//                 <View style={styles.pulseCircle} />
//               </View>
//             </View>

//             <View style={styles.progressContainer}>
//               <View style={styles.progressBackground}>
//                 <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
//               </View>
//               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
//             </View>

//             <View style={styles.analysisSteps}>
//               {analysisSteps.map((step, index) => (
//                 <View key={step.id} style={styles.analysisStep}>
//                   <Icon 
//                     name={step.icon} 
//                     size={20} 
//                     color={index <= currentAnalysisStep ? "#24ad0c" : "#6B7280"} 
//                   />
//                   <Text style={[
//                     styles.analysisStepText,
//                     { color: index <= currentAnalysisStep ? "#FFFFFF" : "#6B7280" }
//                   ]}>
//                     {step.text}
//                   </Text>
//                   {index <= currentAnalysisStep && (
//                     <Icon name="check-circle" size={16} color="#24ad0c" style={styles.stepCheck} />
//                   )}
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#111827' },
//   scrollView: { flex: 1, padding: 20 },
  
//   // Header Styles
//   header: { alignItems: 'center', marginBottom: 32, marginTop: 10 },
//   headerBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     backgroundColor: 'rgba(36, 173, 12, 0.2)', 
//     paddingHorizontal: 12, 
//     paddingVertical: 6, 
//     borderRadius: 12, 
//     marginBottom: 12 
//   },
//   headerBadgeText: { color: '#24ad0c', fontSize: 12, fontWeight: '600', marginLeft: 4 },
//   title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
//   subtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  
// // //   bookingIdInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#39FF14',
// // //   },
// // //   bookingIdInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },

// // //   // Manual Input Section
// // //   manualInputSection: {
// // //     marginBottom: 25,
// // //   },
// // //   matchInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#111',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#39FF14',
// // //     marginBottom: 10,
// // //   },
// // //   matchInput: {
// // //     flex: 1,
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 15,
// // //   },
// // //   addMatchButton: {
// // //     backgroundColor: '#39FF14',
// // //     padding: 12,
// // //     margin: 8,
// // //     borderRadius: 8,
// // //   },
// // //   inputHint: {
// // //     color: '#666',
// // //     fontSize: 12,
// // //     marginBottom: 10,
// // //     fontStyle: 'italic',
// // //   },


//  backgroundColor: '#111',
// //   //   borderWidth: 2,
// //   //   borderColor: '#333',
// //   //   borderStyle: 'dashed',
// //   //   borderRadius: 16,
// //   //   padding: 40,
// //   //   alignItems: 'center',
// //   //   justifyContent: 'center',
// //   //   marginBottom: 20,
//   // Input Section
//   inputSection: { marginBottom: 24 },
//   sectionLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginBottom: 16, letterSpacing: 1 },
//   inputCard: { backgroundColor: '#000', padding: 20, borderRadius: 16, marginBottom: 16 borderColor:'#333', borderWidth:2,borderStyle:'dashed' },
//   inputHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   inputTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginLeft: 8 },
  
//   // Booking ID Input
//   bookingIdInputContainer: { backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
//   bookingIdInput: { color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
  
//   // Manual Input
//   matchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
//   matchInput: { flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 14, paddingHorizontal: 16 },
//   addMatchButton: { backgroundColor: '#24ad0c', padding: 12, margin: 6, borderRadius: 8 },
//   addedMatchesContainer: { backgroundColor: '#374151', padding: 12, borderRadius: 8, marginTop: 12 },
//   addedMatchesTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
//   addedMatchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#4B5563' },
//   addedMatchText: { color: '#FFFFFF', fontSize: 14, flex: 1 },
  
//   // Image Upload
//   imageButtonsContainer: { flexDirection: 'row', gap: 12, marginBottom: 12 },
//   imageButton: { flex: 1, backgroundColor: '#374151', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4B5563' },
//   imageButtonText: { color: '#24ad0c', fontSize: 14, fontWeight: '600', marginTop: 8 },
//   imagePreview: { position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden' },
//   previewImage: { width: '100%', height: '100%' },
//   imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center', justifyContent: 'center' },
//   uploadSuccess: { color: '#24ad0c', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  
//   // Analyze Button
//   analyzeButton: { backgroundColor: '#24ad0c', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
//   analyzeButtonDisabled: { backgroundColor: '#374151' },
//   analyzeContent: { flexDirection: 'row', alignItems: 'center' },
//   analyzeButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  
//   // Guarantee Card
//   guaranteeCard: { flexDirection: 'row', backgroundColor: '#1F2937', padding: 20, borderRadius: 16, alignItems: 'center' },
//   guaranteeContent: { flex: 1, marginLeft: 12 },
//   guaranteeTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
//   guaranteeText: { color: '#9CA3AF', fontSize: 14, lineHeight: 18 },
  
//   // Modal Overlay
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  
//   // Scan Modal
//   scanModal: { backgroundColor: '#1F2937', borderRadius: 20, padding: 30, width: '100%', maxWidth: 400, alignItems: 'center' },
//   scanHeader: { alignItems: 'center', marginBottom: 30 },
//   scanTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
//   scanSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
//   scanAnimation: { alignItems: 'center', marginBottom: 30 },
//   scanIconContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
//   pulseCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(36, 173, 12, 0.2)', top: -8 },
//   progressContainer: { width: '100%', marginBottom: 25 },
//   progressBackground: { height: 8, backgroundColor: '#374151', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
//   progressFill: { height: '100%', backgroundColor: '#24ad0c', borderRadius: 4 },
//   progressText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  
//   // Analysis Steps
//   analysisSteps: { width: '100%', marginBottom: 20 },
//   analysisStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 12, backgroundColor: '#374151', borderRadius: 8 },
//   analysisStepText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '500' },
//   stepCheck: { marginLeft: 8 },
// });

// export default AnalysisScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
//   Modal,
//   Alert,
//   TextInput,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.101:8000/api';

// const AnalysisScreen = ({ navigation }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [bookingId, setBookingId] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [showScanModal, setShowScanModal] = useState(false);
//   const [scanProgress, setScanProgress] = useState(0);
//   const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const [manualMatches, setManualMatches] = useState([]);
//   const [currentMatchInput, setCurrentMatchInput] = useState('');

//   // Analysis steps with descriptions
//   const analysisSteps = [
//     { id: 1, text: "Checking team forms....", icon: "trending-up" },
//     { id: 2, text: "Checking injuries...", icon: "healing" },
//     { id: 3, text: "Checking head-to-head...", icon: "compare-arrows" },
//     { id: 4, text: "Evaluating risk factors...", icon: "warning" },
//     // { id: 5, text: "Generating confidence score...", icon: "psychology" }
//   ];

//   // Image Picker Options
//   const imagePickerOptions = {
//     mediaType: 'photo',
//     quality: 0.9,
//     maxWidth: 2048,
//     maxHeight: 2048,
//     includeBase64: true,
//   };

//   const handleImageSelect = () => {
//     launchImageLibrary(imagePickerOptions, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Gallery Error', 'Cannot access photo library');
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         setSelectedImage(response.assets[0].uri);
//       }
//     });
//   };

//   const takePhoto = () => {
//     launchCamera(imagePickerOptions, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Camera Error', 'Please allow camera permissions');
//         return;
//       }
//       if (response.assets && response.assets[0]) {
//         setSelectedImage(response.assets[0].uri);
//       }
//     });
//   };

//   const addManualMatch = () => {
//     if (!currentMatchInput.trim()) return;

//     const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
//     const match = currentMatchInput.match(matchRegex);

//     if (match) {
//       const homeTeam = match[1].trim();
//       const awayTeam = match[2].trim();
      
//       setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
//       setCurrentMatchInput('');
//     } else {
//       Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
//     }
//   };

//   const removeManualMatch = (index) => {
//     setManualMatches(prev => prev.filter((_, i) => i !== index));
//   };

//   // const handleAnalyze = async () => {
//   //   const hasImage = !!selectedImage;
//   //   const hasBookingId = !!bookingId;
//   //   const hasManualMatches = manualMatches.length > 0;

//   //   if (!hasImage && !hasBookingId && !hasManualMatches) {
//   //     Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
//   //     return;
//   //   }

//   //   setIsAnalyzing(true);
//   //   setShowScanModal(true);
//   //   setCurrentAnalysisStep(0);
//   //   startScanAnimation();

//   //   try {
//   //     let response;
//   //     const token = await AsyncStorage.getItem('access_token');

//   //     // Simulate API call
//   //     setTimeout(async () => {
//   //       try {
//   //         // Your API call logic here
//   //         const mockResult = {
//   //           analysis: {
//   //             confidence_score: 78,
//   //             analysis_data: {
//   //               match_analyses: manualMatches.map(match => ({
//   //                 home_team: match.homeTeam,
//   //                 away_team: match.awayTeam,
//   //                 risk_level: ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK'][Math.floor(Math.random() * 3)],
//   //                 risk_score: Math.floor(Math.random() * 50) + 30,
//   //                 confidence: Math.floor(Math.random() * 40) + 60,
//   //                 risk_factors: [
//   //                   {
//   //                     factor: "Team Form",
//   //                     description: "Home team has won 4 of last 5 matches",
//   //                     risk_impact: -5
//   //                   }
//   //                 ],
//   //                 risk_insights: ["Strong home advantage", "Good recent form"],
//   //                 recommendation: "Consider this match for your bet slip"
//   //               })),
//   //               emotional_verdict: {
//   //                 type: "Promising Analysis",
//   //                 verdict: "Good potential returns with manageable risk",
//   //                 message: "Most matches show favorable conditions",
//   //                 recommendation: "Proceed with calculated confidence",
//   //                 color: "green"
//   //               },
//   //               gemini_summary: {
//   //                 summary: "Overall positive analysis with good confidence levels",
//   //                 key_insights: ["Strong team forms detected", "Minimal injury concerns"]
//   //               }
//   //             }
//   //           }
//   //         };

//   //         setShowScanModal(false);
//   //         navigation.navigate('AiResults', { 
//   //           analysisResult: mockResult,
//   //           inputData: {
//   //             selectedImage,
//   //             bookingId,
//   //             manualMatches
//   //           }
//   //         });
//   //       } catch (error) {
//   //         Alert.alert('Analysis Error', error.message || 'Please check your connection and try again');
//   //         setShowScanModal(false);
//   //       } finally {
//   //         setIsAnalyzing(false);
//   //       }
//   //     }, 4000);

//   //   } catch (error) {
//   //     Alert.alert('Analysis Error', 'Please check your connection and try again');
//   //     setShowScanModal(false);
//   //     setIsAnalyzing(false);
//   //   }
//   // };
//   const handleAnalyze = async () => {
//     const hasImage = !!selectedImage;
//     const hasBookingId = !!bookingId;
//     const hasManualMatches = manualMatches.length > 0;

//     if (!hasImage && !hasBookingId && !hasManualMatches) {
//       Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
//       return;
//     }

//     setIsAnalyzing(true);
//     setShowScanModal(true);
//     startScanAnimation();

//     try {
//       let response;
//       const token = await AsyncStorage.getItem('access_token');

//       if (hasManualMatches) {
//         response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ matches: manualMatches }),
//         });
//       } else if (selectedImage) {
//         const formData = new FormData();
//         const filename = selectedImage.split('/').pop();
//         const match = /\.(\w+)$/.exec(filename);
//         const type = match ? `image/${match[1]}` : `image/jpeg`;

//         formData.append('image', {
//           uri: selectedImage,
//           type: type,
//           name: filename || 'bet_slip.jpg',
//         });
        
//         if (bookingId) formData.append('booking_id', bookingId);

//         response = await fetch(`${API_BASE_URL}/bets/slips/`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         });
//       } else {
//         response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ booking_id: bookingId }),
//         });
//       }

//       const result = await response.json();
      
//       if (response.ok) {
//         setAnalysisResult(result);
//         setTimeout(() => {
//           setShowScanModal(false);
//           setShowResultsModal(true);
//         }, 800);
//       } else {
//         throw new Error(result.error || 'Analysis failed');
//       }
//     } catch (error) {
//       Alert.alert('Analysis Error', 'Please check your connection and try again');
//       setShowScanModal(false);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const startScanAnimation = () => {
//     setScanProgress(0);
//     progressAnim.setValue(0);
    
//     const duration = 5000;
//     const stepDuration = duration / analysisSteps.length;
//     let currentStep = 0;

//     const progressInterval = setInterval(() => {
//       currentStep++;
//       const progress = (currentStep / analysisSteps.length) * 100;
//       setScanProgress(progress);
      
//       Animated.timing(progressAnim, {
//         toValue: progress,
//         duration: stepDuration,
//         useNativeDriver: false,
//         easing: Easing.out(Easing.ease),
//       }).start();

//       if (currentStep <= analysisSteps.length) {
//         setCurrentAnalysisStep(currentStep - 1);
//       }

//       if (currentStep >= analysisSteps.length) {
//         clearInterval(progressInterval);
//       }
//     }, stepDuration);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Professional Header */}
//         <View style={styles.header}>
          
//           <View style={styles.logoContainer}>
//             <TouchableOpacity onPress={()=>goBack()}>
//             <Icon style={{marginTop:3}} name="arrow-back" size={27} color="#24ad0cff" />
//           </TouchableOpacity>
            
//           </View>
//           <Text style={styles.title}>Smart Bet Analysis</Text>
//           <Text style={styles.subtitle}>Professional risk assessment with advanced AI technology</Text>
//         </View>

//         {/* Input Methods */}
//         <View style={styles.inputSection}>
//           <Text style={styles.sectionLabel}>ANALYSIS METHODS</Text>


//           <View style={[styles.inputCard,{borderWidth:2,borderStyle:'dashed', borderColor:'#333'}]}>
//             <View style={styles.inputHeader}>
//               <Icon name="camera-alt" size={22} color="#24ad0cff" style={styles.inputIcon} />
//               <Text style={styles.inputTitle}>Scan your bet slip</Text>
//             </View>
//             <View style={styles.imageButtonsContainer}>
//               <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
//                 <Icon name="camera-alt" size={24} color="#24ad0cff" />
//                 <Text style={styles.imageButtonText}>Take Photo</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.imageButton} onPress={handleImageSelect}>
//                 <Icon name="photo-library" size={24} color="#24ad0cff" />
//                 <Text style={styles.imageButtonText}>Choose from Gallery</Text>
//               </TouchableOpacity>
//             </View>
            
//             {selectedImage && (
//               <View style={styles.imagePreview}>
//                 <Image source={{ uri: selectedImage }} style={styles.previewImage} />
//                 <View style={styles.imageOverlay}>
//                   <Icon name="check-circle" size={32} color="#24ad0cff" />
//                   <Text style={styles.uploadSuccess}>Ready for AI Analysis</Text>
//                 </View>
//               </View>
//             )}
//           </View>

//                   {/* Divider */}
//         <View style={[styles.divider]}>
//           <View style={styles.dividerLine} />
//           <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
//           <View style={styles.dividerLine} />
//         </View>
          
      
//           {/* Manual Input */}
//           <View style={styles.inputCard}>
//             <View style={styles.inputHeader}>
//               <Icon name="edit" size={22} color="#24ad0cff" style={styles.inputIcon} />
//               <Text style={styles.inputTitle}>Manual Match Entry</Text>
//             </View>
//             <View style={styles.matchInputContainer}>
//               <TextInput
//                 style={styles.matchInput}
//                 placeholder="e.g., Arsenal vs Tottenham"
//                 placeholderTextColor="#666666"
//                 value={currentMatchInput}
//                 onChangeText={setCurrentMatchInput}
//                 onSubmitEditing={addManualMatch}
//                 editable={!isAnalyzing}
//               />
//               <TouchableOpacity 
//                 style={[
//                   styles.addMatchButton,
//                   !currentMatchInput.trim() && styles.addMatchButtonDisabled
//                 ]} 
//                 onPress={addManualMatch}
//                 disabled={!currentMatchInput.trim() || isAnalyzing}
//               >
//                 <Icon name="add" size={20} color="#000000" />
//               </TouchableOpacity>
//             </View>
            
//             {manualMatches.length > 0 && (
//               <View style={styles.addedMatchesContainer}>
//                 <Text style={styles.addedMatchesTitle}>Matches to Analyze ({manualMatches.length})</Text>
//                 {manualMatches.map((match, index) => (
//                   <View key={index} style={styles.addedMatchItem}>
//                     <Text style={styles.addedMatchText}>{match.homeTeam} vs {match.awayTeam}</Text>
//                     <TouchableOpacity 
//                       style={styles.removeMatchButton}
//                       onPress={() => removeManualMatch(index)}
//                     >
//                       <Icon name="close" size={16} color="#ef4444" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

       
          
//         </View>

//         {/* Analyze Button */}
//         <TouchableOpacity
//           style={[
//             styles.analyzeButton,
//             (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
//           ]}
//           onPress={handleAnalyze}
//           disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
//         >
//           {isAnalyzing ? (
//             <ActivityIndicator color="#000000" />
//           ) : (
//             <View style={styles.analyzeContent}>
//               <Text style={styles.analyzeButtonText}>Start AI Analysis</Text>
//               <Icon name="arrow-forward" size={20} color="#000000" />
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* Professional Guarantee */}
//         <View style={[styles.guaranteeCard,{marginBottom:100}]}>
//           <View style={styles.guaranteeIcon}>
//             <Icon name="verified" size={24} color="#24ad0cff" />
//           </View>
//           <View style={styles.guaranteeContent}>
//             <Text style={styles.guaranteeTitle}>Professional Grade Analysis</Text>
//             <Text style={styles.guaranteeText}>
//               Advanced AI risk assessment with detailed reasoning and professional insights
//             </Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Scanning Modal */}
//       <Modal visible={showScanModal} transparent animationType="fade" statusBarTranslucent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.scanModal}>
//             <View style={styles.scanHeader}>
//               {/* <View style={styles.scanLogoContainer}>
//                 <Icon name="analytics" size={48} color="#24ad0cff" />
//               </View> */}
//               <Text style={styles.scanTitle}>AI Analysis in Progress</Text>
//               <Text style={styles.scanSubtitle}>Professional risk assessment underway</Text>
//             </View>

//             <View style={styles.scanAnimation}>
//               <View style={styles.scanIconContainer}>
//                 <Icon name="psychology" size={64} color="#24ad0cff" />
//                 <View style={styles.pulseCircle} />
//               </View>
//             </View>

//             <View style={styles.progressContainer}>
//               <View style={styles.progressBackground}>
//                 <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
//               </View>
//               <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
//             </View>

//             <View style={styles.analysisSteps}>
//               {analysisSteps.map((step, index) => (
//                 <View key={step.id} style={styles.analysisStep}>
//                   <Icon 
//                     name={step.icon} 
//                     size={20} 
//                     color={index <= currentAnalysisStep ? "#24ad0cff" : "#666666"} 
//                   />
//                   <Text style={[
//                     styles.analysisStepText,
//                     { color: index <= currentAnalysisStep ? "#FFFFFF" : "#666666" }
//                   ]}>
//                     {step.text}
//                   </Text>
//                   {index <= currentAnalysisStep && (
//                     <Icon name="check-circle" size={16} color="#24ad0cff" style={styles.stepCheck} />
//                   )}
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },

//     divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#222222',
//   },
//   dividerText: {
//     color: '#666666',
//     paddingHorizontal: 16,
//     fontSize: 12,
//     fontWeight: '600',
//     letterSpacing: 0.5,
//   },
  
//   // Header Styles
//   header: {
//     alignItems: 'flex-start',
//     marginBottom: 40,
//     display:'flex',
//     flexDirection:'row',
//     alignContent:'center',
//     alignItems:'center'
//   },
//   logoContainer: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#111111',
//     borderRadius: 24,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     alignContent:'center',
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#1a1a1a',
//     marginTop:-60
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     textAlign: 'center',
//     letterSpacing: -0.5,
//     marginTop:20
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888888',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
  
//   // Input Section
//   inputSection: {
//     marginBottom: 32,
//   },
//   sectionLabel: {
//     fontSize: 13,
//     color: '#666666',
//     fontWeight: '600',
//     marginBottom: 16,
//     letterSpacing: 1,
//   },
//   inputCard: {
//     backgroundColor: '#111111',
//     padding: 24,
//     borderRadius: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   inputHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   inputTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
  
//   // Booking ID Input
//   bookingIdInputContainer: {
//     backgroundColor: '#000000',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   bookingIdInput: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     fontWeight: '500',
//   },
  
//   // Manual Input
//   matchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#000000',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   matchInput: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     fontWeight: '500',
//   },
//   addMatchButton: {
//     backgroundColor: '#24ad0cff',
//     padding: 12,
//     margin: 8,
//     borderRadius: 12,
//   },
//   addMatchButtonDisabled: {
//     backgroundColor: '#333333',
//   },
//   addedMatchesContainer: {
//     backgroundColor: '#000000',
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   addedMatchesTitle: {
//     color: '#888888',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   addedMatchItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#222222',
//   },
//   addedMatchText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     flex: 1,
//     fontWeight: '500',
//   },
//   removeMatchButton: {
//     padding: 4,
//   },
  
//   // Image Upload
//   imageButtonsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   imageButton: {
//     flex: 1,
//     backgroundColor: '#000000',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#222222',
//     borderStyle: 'dashed',
//   },
//   imageButtonText: {
//     color: '#24ad0cff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 8,
//   },
//   imagePreview: {
//     position: 'relative',
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginTop: 8,
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadSuccess: {
//     color: '#24ad0cff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
  
//   // Analyze Button
//   analyzeButton: {
//     backgroundColor: '#24ad0cff',
//     padding: 20,
//     borderRadius: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//     shadowColor: '#24ad0cff',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   analyzeButtonDisabled: {
//     backgroundColor: '#333333',
//   },
//   analyzeContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   analyzeButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//     marginRight: 8,
//   },
  
//   // Guarantee Card
//   guaranteeCard: {
//     flexDirection: 'row',
//     backgroundColor: '#111111',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   guaranteeIcon: {
//     marginRight: 16,
//   },
//   guaranteeContent: {
//     flex: 1,
//   },
//   guaranteeTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   guaranteeText: {
//     color: '#888888',
//     fontSize: 14,
//     lineHeight: 20,
//   },
  
//   // Modal Overlay
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
  
//   // Scan Modal
//   scanModal: {
//     backgroundColor: '#111111',
//     borderRadius: 24,
//     padding: 32,
//     width: '100%',
//     maxWidth: 400,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   scanHeader: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   scanLogoContainer: {
//     width: 80,
//     height: 80,
//     backgroundColor: '#000000',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#1a1a1a',
//   },
//   scanTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   scanSubtitle: {
//     fontSize: 15,
//     color: '#888888',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   scanAnimation: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   scanIconContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   pulseCircle: {
//     position: 'absolute',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(36, 173, 12, 0.2)',
//     top: -8,
//   },
//   progressContainer: {
//     width: '100%',
//     marginBottom: 32,
//   },
//   progressBackground: {
//     height: 8,
//     backgroundColor: '#000000',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#24ad0cff',
//     borderRadius: 4,
//   },
//   progressText: {
//     color: '#888888',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
  
//   // Analysis Steps
//   analysisSteps: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   analysisStep: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: '#000000',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   analysisStepText: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '500',
//     marginLeft: 12,
//   },
//   stepCheck: {
//     marginLeft: 8,
//   },
// });

// export default AnalysisScreen;



//// working ===============================================



import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.104:8000/api';

const AnalysisScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const [manualMatches, setManualMatches] = useState([]);
  const [currentMatchInput, setCurrentMatchInput] = useState('');

  // Analysis steps with descriptions
  const analysisSteps = [
    { id: 1, text: "Checking team forms...", icon: "trending-up" },
    { id: 2, text: "Checking injuries...", icon: "healing" },
    { id: 3, text: "Checking head-to-head...", icon: "compare-arrows" },
    { id: 4, text: "Evaluating risk factors...", icon: "warning" },
    // { id: 5, text: "Generating confidence score...", icon: "psychology" }
  ];

  // Image Picker Options
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 0.9,
    maxWidth: 2048,
    maxHeight: 2048,
    includeBase64: true,
  };

  const handleImageSelect = () => {
    launchImageLibrary(imagePickerOptions, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Gallery Error', 'Cannot access photo library');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = () => {
    launchCamera(imagePickerOptions, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Camera Error', 'Please allow camera permissions');
        return;
      }
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const addManualMatch = () => {
    if (!currentMatchInput.trim()) return;

    const matchRegex = /(.+?)\s+(?:vs|-)\s+(.+)/i;
    const match = currentMatchInput.match(matchRegex);

    if (match) {
      const homeTeam = match[1].trim();
      const awayTeam = match[2].trim();
      
      setManualMatches(prev => [...prev, { homeTeam, awayTeam }]);
      setCurrentMatchInput('');
    } else {
      Alert.alert('Invalid Format', 'Please use: Home Team vs Away Team');
    }
  };

  const removeManualMatch = (index) => {
    setManualMatches(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    const hasImage = !!selectedImage;
    const hasBookingId = !!bookingId;
    const hasManualMatches = manualMatches.length > 0;

    if (!hasImage && !hasBookingId && !hasManualMatches) {
      Alert.alert('Input Required', 'Please upload bet slip, enter booking ID, or add matches manually');
      return;
    }

    setIsAnalyzing(true);
    setShowScanModal(true);
    setCurrentAnalysisStep(0);
    startScanAnimation();

    try {
      let response;
      const token = await AsyncStorage.getItem('access_token');
      
      console.log('Starting analysis with manual matches:', manualMatches);

      if (hasManualMatches) {
        console.log('Sending manual matches to API:', manualMatches);
        response = await fetch(`${API_BASE_URL}/bets/analyze-matches/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ matches: manualMatches }),
        });
      } else if (selectedImage) {
        const formData = new FormData();
        const filename = selectedImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
          uri: selectedImage,
          type: type,
          name: filename || 'bet_slip.jpg',
        });
        
        if (bookingId) formData.append('booking_id', bookingId);

        response = await fetch(`${API_BASE_URL}/bets/slips/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/bets/analyze-by-id/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ booking_id: bookingId }),
        });
      }

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Success response:', JSON.stringify(result, null, 2));
      
      if (response.ok) {
        // Transform the API response to match our expected format
        const transformedResult = transformApiResponse(result);
        console.log('Transformed result:', transformedResult);
        
        setShowScanModal(false);
        // Navigate to ResultsScreen (not AiResults)
        navigation.navigate('AiResults', { 
          analysisResult: transformedResult,
          inputData: {
            selectedImage,
            bookingId,
            manualMatches
          }
        });
      } else {
        throw new Error(result.error || result.detail || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis Error:', error);
      Alert.alert('Analysis Error', error.message || 'Please check your connection and try again');
      setShowScanModal(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Transform API response to match our app's expected format
  const transformApiResponse = (apiResponse) => {
    console.log('Transforming API response:', apiResponse);
    
    // If the response already has the structure we need, return it as is
    if (apiResponse.analysis) {
      return apiResponse;
    }

    // Transform the match analysis data
    const matchAnalyses = apiResponse.analysis_data?.match_analyses || [apiResponse];
    
    const transformedAnalysis = {
      analysis: {
        confidence_score: apiResponse.confidence_score || apiResponse.ai_confidence || 50,
        analysis_data: {
          match_analyses: matchAnalyses.map(match => ({
            home_team: match.home_team || match.homeTeam,
            away_team: match.away_team || match.awayTeam,
            risk_level: match.risk_level || 'MEDIUM_RISK',
            risk_score: match.risk_score || 67,
            confidence: match.confidence || (100 - (match.risk_score || 67)),
            risk_factors: match.risk_factors || [
              {
                factor: "Team Form",
                description: "Home team has poor recent performance",
                risk_impact: 12
              }
            ],
            risk_insights: match.risk_insights || ["Consider team form and injuries"],
            recommendation: match.recommendation || "Proceed with caution"
          })),
          emotional_verdict: {
            type: "Analysis Complete",
            verdict: "Risk assessment completed successfully",
            message: "Review the detailed analysis below",
            recommendation: "Make informed betting decisions",
            color: "orange"
          },
          gemini_summary: {
            summary: apiResponse.summary || "Professional analysis based on team forms, injuries, and historical data",
            key_insights: apiResponse.key_insights || ["Multiple risk factors detected"]
          }
        }
      }
    };

    return transformedAnalysis;
  };

  const startScanAnimation = () => {
    setScanProgress(0);
    progressAnim.setValue(0);
    
    const duration = 5000;
    const stepDuration = duration / analysisSteps.length;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / analysisSteps.length) * 100;
      setScanProgress(progress);
      
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: stepDuration,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();

      if (currentStep <= analysisSteps.length) {
        setCurrentAnalysisStep(currentStep - 1);
      }

      if (currentStep >= analysisSteps.length) {
        clearInterval(progressInterval);
      }
    }, stepDuration);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon style={{marginTop:3}} name="arrow-back" size={27} color="#24ad0cff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Smart Bet Analysis</Text>
          <Text style={styles.subtitle}>Professional risk assessment with advanced AI technology</Text>
        </View>

        {/* Input Methods */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>ANALYSIS METHODS</Text>

          <View style={[styles.inputCard,{borderWidth:2,borderStyle:'dashed', borderColor:'#333'}]}>
            <View style={styles.inputHeader}>
              <Icon name="camera-alt" size={22} color="#24ad0cff" style={styles.inputIcon} />
              <Text style={styles.inputTitle}>Scan your bet slip</Text>
            </View>
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Icon name="camera-alt" size={24} color="#24ad0cff" />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={handleImageSelect}>
                <Icon name="photo-library" size={24} color="#24ad0cff" />
                <Text style={styles.imageButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
            
            {selectedImage && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Icon name="check-circle" size={32} color="#24ad0cff" />
                  <Text style={styles.uploadSuccess}>Ready for AI Analysis</Text>
                </View>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.divider]}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>
          
          {/* Manual Input */}
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Icon name="edit" size={22} color="#24ad0cff" style={styles.inputIcon} />
              <Text style={styles.inputTitle}>Manual Match Entry</Text>
            </View>
            <View style={styles.matchInputContainer}>
              <TextInput
                style={styles.matchInput}
                placeholder="e.g., Arsenal vs Tottenham"
                placeholderTextColor="#666666"
                value={currentMatchInput}
                onChangeText={setCurrentMatchInput}
                onSubmitEditing={addManualMatch}
                editable={!isAnalyzing}
              />
              <TouchableOpacity 
                style={[
                  styles.addMatchButton,
                  !currentMatchInput.trim() && styles.addMatchButtonDisabled
                ]} 
                onPress={addManualMatch}
                disabled={!currentMatchInput.trim() || isAnalyzing}
              >
                <Icon name="add" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
            
            {manualMatches.length > 0 && (
              <View style={styles.addedMatchesContainer}>
                <Text style={styles.addedMatchesTitle}>Matches to Analyze ({manualMatches.length})</Text>
                {manualMatches.map((match, index) => (
                  <View key={index} style={styles.addedMatchItem}>
                    <Text style={styles.addedMatchText}>{match.homeTeam} vs {match.awayTeam}</Text>
                    <TouchableOpacity 
                      style={styles.removeMatchButton}
                      onPress={() => removeManualMatch(index)}
                    >
                      <Icon name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!selectedImage && !bookingId && manualMatches.length === 0) && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={(!selectedImage && !bookingId && manualMatches.length === 0) || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <View style={styles.analyzeContent}>
              <Text style={styles.analyzeButtonText}>Start AI Analysis</Text>
              <Icon name="arrow-forward" size={20} color="#000000" />
            </View>
          )}
        </TouchableOpacity>

        {/* Professional Guarantee */}
        <View style={[styles.guaranteeCard,{marginBottom:100}]}>
          <View style={styles.guaranteeIcon}>
            <Icon name="verified" size={24} color="#24ad0cff" />
          </View>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Professional Grade Analysis</Text>
            <Text style={styles.guaranteeText}>
              Advanced AI risk assessment with detailed reasoning and professional insights
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Scanning Modal */}
      <Modal visible={showScanModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.scanModal}>
            <View style={styles.scanHeader}>
              <Text style={styles.scanTitle}>AI Analysis in Progress</Text>
              <Text style={styles.scanSubtitle}>Professional risk assessment underway</Text>
            </View>

            <View style={styles.scanAnimation}>
              <View style={styles.scanIconContainer}>
                <Icon name="psychology" size={64} color="#24ad0cff" />
                <View style={styles.pulseCircle} />
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
            </View>

            <View style={styles.analysisSteps}>
              {analysisSteps.map((step, index) => (
                <View key={step.id} style={styles.analysisStep}>
                  <Icon 
                    name={step.icon} 
                    size={20} 
                    color={index <= currentAnalysisStep ? "#24ad0cff" : "#666666"} 
                  />
                  <Text style={[
                    styles.analysisStepText,
                    { color: index <= currentAnalysisStep ? "#FFFFFF" : "#666666" }
                  ]}>
                    {step.text}
                  </Text>
                  {index <= currentAnalysisStep && (
                    <Icon name="check-circle" size={16} color="#24ad0cff" style={styles.stepCheck} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#222222',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 40,
    display:'flex',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center'
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#111111',
    borderRadius: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent:'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginTop:-60
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop:20
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  inputCard: {
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  matchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  matchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  addMatchButton: {
    backgroundColor: '#24ad0cff',
    padding: 12,
    margin: 8,
    borderRadius: 12,
  },
  addMatchButtonDisabled: {
    backgroundColor: '#333333',
  },
  addedMatchesContainer: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  addedMatchesTitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  addedMatchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  addedMatchText: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  removeMatchButton: {
    padding: 4,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
    borderStyle: 'dashed',
  },
  imageButtonText: {
    color: '#24ad0cff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSuccess: {
    color: '#24ad0cff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  analyzeButton: {
    backgroundColor: '#24ad0cff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#24ad0cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#333333',
  },
  analyzeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  guaranteeCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  guaranteeIcon: {
    marginRight: 16,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  guaranteeText: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanModal: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  scanHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 15,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
  scanAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scanIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(36, 173, 12, 0.2)',
    top: -8,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#24ad0cff',
    borderRadius: 4,
  },
  progressText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  analysisSteps: {
    width: '100%',
    marginBottom: 20,
  },
  analysisStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  analysisStepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  stepCheck: {
    marginLeft: 8,
  },
});

export default AnalysisScreen;