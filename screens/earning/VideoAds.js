
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Share,
//   RefreshControl,
//   Modal,
//   Dimensions,
//   BackHandler,
//   Platform,
//   ScrollView,
//   Animated
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useFocusEffect } from '@react-navigation/native';
// import Video from 'react-native-video';
// import LinearGradient from 'react-native-linear-gradient';
// import * as Animatable from 'react-native-animatable';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// const VideoAdsScreen = ({ navigation }) => {
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [stats, setStats] = useState({
//     available_ads: 0,
//     total_earnable: 0,
//     daily_earned: 0
//   });
  
//   // Video player states
//   const [selectedAd, setSelectedAd] = useState(null);
//   const [showVideoPlayer, setShowVideoPlayer] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isLoadingVideo, setIsLoadingVideo] = useState(false);
//   const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
//   const [isRewardClaimed, setIsRewardClaimed] = useState(false);
//   const [showControls, setShowControls] = useState(true);
  
//   const videoRef = useRef(null);
//   const watchTimerRef = useRef(null);
//   const totalWatchTimeRef = useRef(0);
//   const controlsTimerRef = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(1)).current;

//   // Animations
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const slideUpAnim = useRef(new Animated.Value(50)).current;

//   // Load data on screen focus
//   useFocusEffect(
//     React.useCallback(() => {
//       loadData();
//       startPulseAnimation();
//       return () => {
//         if (watchTimerRef.current) clearInterval(watchTimerRef.current);
//         if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
//       };
//     }, [])
//   );

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         if (showVideoPlayer) {
//           closeVideoPlayer();
//           return true;
//         }
//         return false;
//       }
//     );

//     return () => backHandler.remove();
//   }, [showVideoPlayer]);

//   const startPulseAnimation = () => {
//     Animated.loop(
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
//     ).start();
//   };

//   const loadData = async () => {
//     try {
//       await Promise.all([loadAds(), loadWalletBalance()]);
//     } catch (error) {
//       console.error('Failed to load data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const loadWalletBalance = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await fetch(`https://showa.essential.com.ng/api/showa/wallet/`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await response.json();
//       setWalletBalance(data.coins_available || 0);
//     } catch (error) {
//       console.error('Failed to load wallet:', error);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const loadAds = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

//       const data = await response.json();
//       setAds(data.ads || []);
//       setStats(data.stats || {
//         available_ads: 0,
//         total_earnable: 0,
//         daily_earned: 0
//       });
      
//       // Animate slide up
//       Animated.spring(slideUpAnim, {
//         toValue: 0,
//         tension: 20,
//         friction: 8,
//         useNativeDriver: true,
//       }).start();
//     } catch (error) {
//       console.error('Failed to load ads:', error);
//     }
//   };

//   const openVideoPlayer = (ad) => {
//     if (!ad.can_watch) {
//       Alert.alert('Already Watched', 'You have already watched this ad the maximum number of times.');
//       return;
//     }

//     setSelectedAd(ad);
//     setShowVideoPlayer(true);
//     setIsPlaying(true);
//     setCurrentTime(0);
//     setDuration(0);
//     setHasWatchedEnough(false);
//     setIsRewardClaimed(false);
//     setShowControls(true);
//     totalWatchTimeRef.current = 0;
    
//     // Auto-hide controls after 3 seconds
//     hideControlsAfterDelay();
    
//     // Start tracking watch time
//     if (watchTimerRef.current) clearInterval(watchTimerRef.current);
//     watchTimerRef.current = setInterval(() => {
//       totalWatchTimeRef.current += 1;
//       if (totalWatchTimeRef.current >= 10 && !hasWatchedEnough) {
//         setHasWatchedEnough(true);
//       }
//       if (duration > 0 && currentTime >= duration * 0.9 && !isRewardClaimed && hasWatchedEnough) {
//         autoClaimReward();
//       }
//     }, 1000);
//   };

//   const hideControlsAfterDelay = () => {
//     if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
//     controlsTimerRef.current = setTimeout(() => {
//       if (isPlaying) {
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => setShowControls(false));
//       }
//     }, 3000);
//   };

//   const showControlsWithAnimation = () => {
//     setShowControls(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//     hideControlsAfterDelay();
//   };

//   const closeVideoPlayer = () => {
//     if (watchTimerRef.current) {
//       clearInterval(watchTimerRef.current);
//       watchTimerRef.current = null;
//     }
//     if (controlsTimerRef.current) {
//       clearTimeout(controlsTimerRef.current);
//       controlsTimerRef.current = null;
//     }
    
//     if (hasWatchedEnough && !isRewardClaimed && totalWatchTimeRef.current >= 10) {
//       Alert.alert(
//         'Claim Reward?',
//         `You watched ${totalWatchTimeRef.current} seconds. Would you like to claim your reward?`,
//         [
//           { text: 'No Thanks', style: 'cancel' },
//           { 
//             text: 'Claim Reward', 
//             onPress: () => claimReward(totalWatchTimeRef.current)
//           }
//         ]
//       );
//     }
    
//     setShowVideoPlayer(false);
//     setIsPlaying(false);
//     setSelectedAd(null);
//   };

//   const autoClaimReward = () => {
//     if (isRewardClaimed) return;
//     claimReward(totalWatchTimeRef.current);
//     setIsRewardClaimed(true);
//   };

//   const claimReward = async (watchedSeconds) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       setIsLoadingVideo(true);
      
//       const watchResponse = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/${selectedAd.id}/watch/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           watched_duration: watchedSeconds,
//           video_duration: duration || 30
//         }),
//       });

//       const watchData = await watchResponse.json();
//       setIsLoadingVideo(false);
      
//       if (watchData.success) {
//         // Animate reward claim
//         loadWalletBalance(); // Refresh balance
//         Alert.alert(
//           '🎉 Reward Earned!',
//           `You earned ${watchData.coins_earned || 0} coins!`,
//           [{ 
//             text: 'Awesome', 
//             onPress: () => {
//               closeVideoPlayer();
//               loadData();
//             }
//           }]
//         );
//       } else {
//         Alert.alert('Error', watchData.error || 'Failed to claim reward');
//       }
//     } catch (watchError) {
//       console.error('Claim reward error:', watchError);
//       setIsLoadingVideo(false);
//       Alert.alert('Error', 'Failed to claim reward');
//     }
//   };

//   const shareAd = async (ad) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const shareResponse = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/${ad.id}/share/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ platform: 'external' }),
//       });

//       const shareData = await shareResponse.json();
      
//       if (shareData.success) {
//         const shareResult = await Share.share({
//           title: ad.title || 'Watch this ad',
//           message: `${ad.title}\n\n${ad.description || 'Earn coins by watching this ad!'}\n\nWatch and earn coins on Showa!`,
//           url: `https://showa.app/ads/${ad.id}`
//         });

//         if (shareResult.action === Share.sharedAction) {
//           Alert.alert(
//             '✅ Shared Successfully!',
//             `You earned ${shareData.coins_earned || 0} coins for sharing!`,
//             [{ 
//               text: 'Great!',
//               onPress: () => loadAds()
//             }]
//           );
//         }
//       } else {
//         Alert.alert('Error', shareData.error || 'Failed to record share');
//       }
//     } catch (error) {
//       console.error('Share failed:', error);
//       Alert.alert('Error', 'Failed to share ad. Please try again.');
//     }
//   };

//   const togglePlayPause = () => {
//     setIsPlaying(!isPlaying);
//     showControlsWithAnimation();
//   };

//   const skipForward = () => {
//     if (videoRef.current && duration > 0) {
//       const newTime = Math.min(currentTime + 10, duration);
//       videoRef.current.seek(newTime);
//       setCurrentTime(newTime);
//       showControlsWithAnimation();
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

  

//   const renderAdItem = ({ item, index }) => {
//     const canWatch = item.can_watch || false;
//     const coinsPerView = parseFloat(item.coins_per_view || 0).toFixed(0);
//     const coinsPerShare = parseFloat(item.coins_per_share || 0).toFixed(1);
//     const progress = ((item.total_views || 0) / item.views_purchased) * 100;
//     const categoryColors = {
//       entertainment: '#FF6B6B',
//       education: '#4ECDC4',
//       gaming: '#45B7D1',
//       shopping: '#96CEB4',
//       finance: '#FECA57',
//       health: '#FF9FF3',
//       other: '#8395A7'
//     };

//     return (
//       <Animatable.View 
//         animation="fadeInUp"
//         delay={index * 100}
//         style={styles.adCard}
//       >
//         <View style={styles.adHeader}>
//           <View style={styles.adBadgeContainer}>
//             <View style={[
//               styles.categoryBadge,
//               { backgroundColor: categoryColors[item.category] || '#8395A7' }
//             ]}>
//               <Text style={styles.categoryText}>
//                 {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Other'}
//               </Text>
//             </View>
//             {!canWatch && (
//               <View style={styles.watchedBadge}>
//                 <Icon name="checkmark-circle" size={12} color="white" />
//                 <Text style={styles.watchedText}>Watched</Text>
//               </View>
//             )}
//           </View>
          
//           <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//             <LinearGradient
//               colors={canWatch ? ['#4CAF50', '#45a049'] : ['#9E9E9E', '#757575']}
//               style={styles.coinsBadge}
//             >
//               <Icon name="cash" size={16} color="white" />
//               <Text style={styles.coinsText}>+{coinsPerView}</Text>
//             </LinearGradient>
//           </Animated.View>
//         </View>
        
//         <TouchableOpacity 
//           onPress={() => openVideoPlayer(item)} 
//           activeOpacity={0.9}
//           disabled={!canWatch}
//         >
//           <View style={styles.thumbnailWrapper}>
//             {item.thumbnail ? (
//               <Image 
//                 source={{ uri: item.thumbnail }} 
//                 style={styles.adThumbnail} 
//                 resizeMode="cover"
//               />
//             ) : (
//               <LinearGradient
//                 colors={['#0d64dd', '#0d64dd']}
//                 style={[styles.adThumbnail, styles.placeholderThumbnail]}
//               >
//                 <Icon name="videocam" size={40} color="white" />
//                 <Text style={styles.placeholderText}>Watch & Earn</Text>
//               </LinearGradient>
//             )}
            
//             <LinearGradient
//               colors={['transparent', 'rgba(0,0,0,0.7)']}
//               style={styles.thumbnailOverlay}
//             >
//               <View style={styles.playButtonContainer}>
//                 <View style={styles.playButton}>
//                   <Icon name="play" size={24} color="white" />
//                 </View>
//               </View>
//             </LinearGradient>
            
//             {!canWatch && (
//               <View style={styles.overlayLock}>
//                 <Icon name="lock-closed" size={30} color="white" />
//               </View>
//             )}
//           </View>
//         </TouchableOpacity>
        
//         <View style={styles.adContent}>
//           <Text style={styles.adTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
          
//           <Text style={styles.adDescription} numberOfLines={2}>
//             {item.description || 'No description available'}
//           </Text>
          
//           <View style={styles.progressContainer}>
//             <View style={styles.progressBackground}>
//               <View 
//                 style={[
//                   styles.progressFill,
//                   { width: `${Math.min(progress, 100)}%` }
//                 ]} 
//               />
//             </View>
//             <Text style={styles.progressText}>
//               {item.total_views || 0}/{item.views_purchased || 0} views
//             </Text>
//           </View>
          
//           <View style={styles.adFooter}>
//             <TouchableOpacity 
//               style={[
//                 styles.watchButton,
//                 !canWatch && styles.watchButtonDisabled
//               ]}
//               onPress={() => openVideoPlayer(item)}
//               disabled={!canWatch}
//             >
//               <Icon 
//                 name={canWatch ? "play-circle" : "checkmark-circle"} 
//                 size={20} 
//                 color={canWatch ? "white" : "#AAA"} 
//               />
//               <Text style={[
//                 styles.watchButtonText,
//                 !canWatch && styles.watchButtonTextDisabled
//               ]}>
//                 {canWatch ? 'Watch Now' : 'Already Watched'}
//               </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.shareButton}
//               onPress={() => shareAd(item)}
//             >
//               <LinearGradient
//                 colors={['#0d64dd', '#0d64dd']}
//                 style={styles.shareButtonGradient}
//               >
//                 <Icon name="share-outline" size={18} color="white" />
//                 <Text style={styles.shareButtonText}>
//                   Share (+{coinsPerShare})
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Animatable.View>
//     );
//   };

//   const renderVideoPlayer = () => {
//     if (!selectedAd) return null;

//     const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
//     const coinsPerView = parseFloat(selectedAd.coins_per_view || 0).toFixed(0);

//     return (
//       <Modal
//         visible={showVideoPlayer}
//         animationType="slide"
//         onRequestClose={closeVideoPlayer}
//         statusBarTranslucent={true}
//       >
//         <SafeAreaView style={styles.videoPlayerContainer}>
//           {/* Video Header */}
//           <Animated.View 
//             style={[
//               styles.videoHeader,
//               { opacity: fadeAnim }
//             ]}
//           >
//             <TouchableOpacity 
//               onPress={closeVideoPlayer} 
//               style={styles.closeButton}
//             >
//               <Icon name="chevron-down" size={28} color="white" />
//             </TouchableOpacity>
            
//             <View style={styles.videoTitleContainer}>
//               <Text style={styles.videoTitle} numberOfLines={1}>
//                 {selectedAd.title}
//               </Text>
//               <Text style={styles.videoSubtitle}>
//                 Watch to earn {coinsPerView} coins
//               </Text>
//             </View>
            
//             <View style={styles.placeholderRight} />
//           </Animated.View>

//           {/* Video Player */}
//           <TouchableOpacity 
//             style={styles.videoWrapper}
//             activeOpacity={1}
//             onPress={showControlsWithAnimation}
//           >
//             <Video
//               ref={videoRef}
//               source={{ uri: selectedAd.video_url }}
//               style={styles.video}
//               paused={!isPlaying}
//               resizeMode="contain"
//               onLoad={data => {
//                 setDuration(data.duration);
//                 setIsLoadingVideo(false);
//               }}
//               onProgress={data => setCurrentTime(data.currentTime)}
//               onEnd={() => {
//                 if (!isRewardClaimed && hasWatchedEnough) autoClaimReward();
//               }}
//               onError={error => {
//                 console.error('Video error:', error);
//                 Alert.alert('Error', 'Failed to load video. Please try another ad.');
//                 setIsLoadingVideo(false);
//               }}
//               controls={false}
//             />
            
//             {/* {isLoadingVideo && (
//               <View style={styles.videoLoadingOverlay}>
//                 <ActivityIndicator size="large" color="#667eea" />
//                 <Text style={styles.loadingText}>Loading video...</Text>
//               </View>
//             )} */}

             

//             {/* Video Controls Overlay */}
//             {showControls && (
//               <Animated.View 
//                 style={[
//                   styles.videoControlsOverlay,
//                   { opacity: fadeAnim }
//                 ]}
//               >
//                 {!isPlaying && (
//                   <TouchableOpacity 
//                     style={styles.bigPlayButton}
//                     onPress={togglePlayPause}
//                   >
//                     <Icon name="play-circle" size={70} color="white" />
//                   </TouchableOpacity>
//                 )}
                
//                 <View style={styles.bottomControls}>
//                   <View style={styles.timeContainer}>
//                     <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
//                     <View style={styles.progressBarContainer}>
//                       <View style={styles.progressBarBackground}>
//                         <View 
//                           style={[
//                             styles.progressBarFill,
//                             { width: `${progress}%` }
//                           ]} 
//                         />
//                       </View>
//                     </View>
//                     <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                   </View>
                  
//                   <View style={styles.controlButtons}>
//                     <TouchableOpacity 
//                       style={styles.controlButton}
//                       onPress={togglePlayPause}
//                     >
//                       <Icon 
//                         name={isPlaying ? "pause" : "play"} 
//                         size={30} 
//                         color="white" 
//                       />
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                       style={styles.controlButton}
//                       onPress={skipForward}
//                     >
//                       <Icon name="play-forward" size={30} color="white" />
//                       <Text style={styles.skipText}>10s</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </Animated.View>
//             )}
//           </TouchableOpacity>

//           {/* Reward Panel */}
//           <Animated.View 
//             style={[
//               styles.rewardPanel,
//               { opacity: fadeAnim }
//             ]}
//           >
//             <LinearGradient
//               colors={['#1a1a1a', '#2d2d2d']}
//               style={styles.rewardContainer}
//             >
//               <View style={styles.rewardHeader}>
//                 <View style={styles.rewardIconContainer}>
//                   <Icon name="trophy" size={24} color="#FFD700" />
//                   <Text style={styles.rewardTitle}>Earn Rewards</Text>
//                 </View>
                
//                 <View style={styles.watchProgress}>
//                   <Text style={styles.progressPercentage}>
//                     {Math.round(progress)}% watched
//                   </Text>
//                   <View style={styles.progressMiniBar}>
//                     <View 
//                       style={[
//                         styles.progressMiniFill,
//                         { width: `${progress}%` }
//                       ]} 
//                     />
//                   </View>
//                 </View>
//               </View>
              
//               <View style={styles.rewardDetails}>
//                 <View style={styles.rewardItem}>
//                   <Icon 
//                     name={hasWatchedEnough ? "checkmark-circle" : "time"} 
//                     size={20} 
//                     color={hasWatchedEnough ? "#4CAF50" : "#FFA000"} 
//                   />
//                   <Text style={styles.rewardItemText}>
//                     {hasWatchedEnough 
//                       ? "✓ Minimum time reached" 
//                       : "Watch 10+ seconds"}
//                   </Text>
//                 </View>
                
//                 <View style={styles.rewardItem}>
//                   <Icon 
//                     name={progress >= 90 ? "checkmark-circle" : "flag"} 
//                     size={20} 
//                     color={progress >= 90 ? "#4CAF50" : "#FFA000"} 
//                   />
//                   <Text style={styles.rewardItemText}>
//                     {progress >= 90 
//                       ? "✓ 90% watched for full reward" 
//                       : "Watch 90% for full reward"}
//                   </Text>
//                 </View>
//               </View>
              
//               {hasWatchedEnough && !isRewardClaimed && (
//                 <TouchableOpacity 
//                   style={[
//                     styles.claimButton,
//                     progress >= 90 && styles.claimButtonFull
//                   ]}
//                   onPress={() => claimReward(totalWatchTimeRef.current)}
//                   disabled={isLoadingVideo}
//                 >
//                   <LinearGradient
//                     colors={progress >= 90 
//                       ? ['#FFD700', '#FFA000'] 
//                       : ['#667eea', '#764ba2']
//                     }
//                     style={styles.claimButtonGradient}
//                   >
//                     {isLoadingVideo ? (
//                       <ActivityIndicator color="white" size="small" />
//                     ) : (
//                       <>
//                         <Icon 
//                           name={progress >= 90 ? "trophy" : "cash"} 
//                           size={22} 
//                           color="white" 
//                         />
//                         <Text style={styles.claimButtonText}>
//                           {progress >= 90 
//                             ? `Claim ${coinsPerView} Coins!` 
//                             : 'Claim Partial Reward'}
//                         </Text>
//                       </>
//                     )}
//                   </LinearGradient>
//                 </TouchableOpacity>
//               )}
              
//               {isRewardClaimed && (
//                 <View style={styles.rewardClaimed}>
//                   <Icon name="checkmark-done-circle" size={28} color="#4CAF50" />
//                   <Text style={styles.rewardClaimedText}>
//                     Reward claimed successfully!
//                   </Text>
//                 </View>
//               )}
//             </LinearGradient>
//           </Animated.View>
//         </SafeAreaView>
//       </Modal>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Animatable.View 
//         animation="pulse"
//         iterationCount="infinite"
//         style={styles.emptyIconContainer}
//       >
//         <Icon name="tv-outline" size={80} color="#667eea" />
//       </Animatable.View>
//       <Text style={styles.emptyTitle}>No Ads Available</Text>
//       <Text style={styles.emptyText}>
//         Check back later for new video ads to watch and earn coins!
//       </Text>
//       <TouchableOpacity 
//         style={styles.refreshButton}
//         onPress={loadData}
//       >
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd']}
//           style={styles.refreshButtonGradient}
//         >
//           {/* <Icon name="refresh" size={20} color="white" /> */}
//           <Text style={styles.refreshText}>Refresh Ads</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <LinearGradient
//           colors={['#fff', '#fff']}
//           style={styles.loadingBackground}
//         >
//           <ActivityIndicator size="large" color="#0d64dd" />
//           <Text style={[styles.loadingText,{color:'#000'}]}>Loading video ads...</Text>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#f8f9fa', '#e9ecef']}
//         style={styles.background}
//       >
//         {/* Header */}
//         <LinearGradient
//           colors={['#0d64dd', '#0d64dd']}
//           style={styles.header}
//         >
//           <View style={styles.headerContent}>
//             <TouchableOpacity 
//               onPress={() => navigation.goBack()}
//               style={styles.backButton}
//             >
//               <Icon name="chevron-back" size={28} color="white" />
//             </TouchableOpacity>
            
//             <View style={styles.headerTitleContainer}>
//               <Text style={styles.headerTitle}>Watch & Earn</Text>
//               <Text style={styles.headerSubtitle}>Earn coins by watching ads</Text>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.walletButton}
//               onPress={() => navigation.navigate('EarningWallet')}
//             >
//               <LinearGradient
//                 colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
//                 style={styles.walletButtonInner}
//               >
                
//                 <Icon name="wallet" size={20} color="white" />
                
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>


//         {isLoadingVideo && (
//                     <View style={styles.topLoadingContainer}>
//                       <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#0750b5'} />
//                       <Text style={styles.topLoadingText}>Loading video...</Text>
//                     </View>
//                   )}

//         <ScrollView 
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#667eea']}
//               tintColor="#0d64dd"
//               title="Pull to refresh"
//               titleColor="#0d64dd"
//             />
//           }
//         >
//           {/* Stats Card */}
//           <Animatable.View 
//             animation="fadeIn"
//             delay={200}
//           >
          
//           </Animatable.View>

//           {/* Ads List */}
//           <View style={[styles.adsContainer,{marginTop: 40}]}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Available Video Ads</Text>
//               <Text style={styles.sectionCount}>{ads.length} ads</Text>
//             </View>
            
//             <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
//               {ads.length > 0 ? (
//                 <FlatList
//                   data={ads}
//                   renderItem={renderAdItem}
//                   keyExtractor={(item, index) => `${item?.id}-${index}`}
//                   scrollEnabled={false}
//                   contentContainerStyle={styles.adsList}
//                   showsVerticalScrollIndicator={false}
//                 />
//               ) : (
//                 renderEmptyState()
//               )}
//             </Animated.View>
//           </View>
          
//           {/* Tips Section */}
//           {ads.length > 0 && (
//             <View style={styles.tipsContainer}>
//               <Text style={styles.tipsTitle}>Tips for Earning More</Text>
//               <View style={styles.tipsGrid}>
//                 <View style={styles.tipCard}>
//                   <Icon name="checkmark-circle" size={24} color="#4CAF50" />
//                   <Text style={styles.tipText}>Watch 90% of video for full reward</Text>
//                 </View>
//                 <View style={styles.tipCard}>
//                   <Icon name="share-social" size={24} color="#0d64dd" />
//                   <Text style={styles.tipText}>Share ads to earn bonus coins</Text>
//                 </View>
//                 <View style={styles.tipCard}>
//                   <Icon name="time" size={24} color="#FFA000" />
//                   <Text style={styles.tipText}>Check daily for new ads</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </LinearGradient>
      
//       {/* Video Player Modal */}
//       {renderVideoPlayer()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0d64dd',
//   },
//   background: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//   },
//   loadingBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     fontFamily: 'System',
//   },
//   header: {
//     paddingBottom: 20,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical:30
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: 'white',
//     fontFamily: 'System',
//     letterSpacing: 0.5,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 4,
//     fontFamily: 'System',
//   },
//   walletButton: {
//     borderRadius: 0,
//     overflow: 'hidden',
//      paddingHorizontal: 15,
//     paddingVertical: 8,
  
//   },
//   walletButtonInner: {
//     flexDirection: 'row',
//     alignItems: 'center',
   
//   },
//   walletAmount: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//     marginLeft: 6,
//     fontFamily: 'System',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   statsCard: {
//     margin: 20,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.1,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   statsTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '700',
//     marginLeft: 10,
//     fontFamily: 'System',
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statNumber: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: '800',
//     fontFamily: 'System',
//   },
//   statLabel: {
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 12,
//     marginTop: 5,
//     fontFamily: 'System',
//   },
//   statDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   walletInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.3)',
//   },
//   walletBalance: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//     fontFamily: 'System',
//   },
//   adsContainer: {
//     marginHorizontal: 20,
//     marginBottom: 30,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     fontFamily: 'System',
//   },
//   sectionCount: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#667eea',
//     backgroundColor: 'rgba(102, 126, 234, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     fontFamily: 'System',
//   },
//   topLoadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     backgroundColor: '#f8f9fa',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 8,
//   },
//   topLoadingText: {
//     marginLeft: 8,
//     color: 'black',
//     fontSize: 14,
//   },
//   adsList: {
//     paddingBottom: 10,
//   },
//   adCard: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     marginBottom: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   adHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingTop: 15,
//     paddingBottom: 10,
//   },
//   adBadgeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   categoryBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   categoryText: {
//     color: 'white',
//     fontSize: 11,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   watchedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#9E9E9E',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     gap: 4,
//   },
//   watchedText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   coinsBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     gap: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   coinsText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '700',
//     fontFamily: 'System',
//   },
//   thumbnailWrapper: {
//     position: 'relative',
//     height: 180,
//   },
//   adThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   placeholderThumbnail: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 10,
//     fontFamily: 'System',
//   },
//   opLoadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 8,
//   },
//   topLoadingText: {
//     marginLeft: 8,
//     color: 'white',
//     fontSize: 14,
//   },
//   thumbnailOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButtonContainer: {
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     backgroundColor: '#667eea',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlayLock: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   adContent: {
//     padding: 15,
//   },
//   adTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 8,
//     fontFamily: 'System',
//   },
//   adDescription: {
//     fontSize: 13,
//     color: '#666',
//     lineHeight: 18,
//     marginBottom: 12,
//     fontFamily: 'System',
//   },
//   progressContainer: {
//     marginBottom: 15,
//   },
//   progressBackground: {
//     height: 6,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 5,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#667eea',
//     borderRadius: 3,
//   },
//   progressText: {
//     fontSize: 11,
//     color: '#888',
//     textAlign: 'right',
//     fontFamily: 'System',
//   },
//   adFooter: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   watchButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   watchButtonDisabled: {
//     backgroundColor: '#f0f0f0',
//   },
//   watchButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   watchButtonTextDisabled: {
//     color: '#888',
//   },
//   shareButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   shareButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     gap: 8,
//   },
//   shareButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyIconContainer: {
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 10,
//     fontFamily: 'System',
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 30,
//     fontFamily: 'System',
//   },
//   refreshButton: {
//     borderRadius: 25,
//     overflow: 'hidden',
//   },
//   refreshButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
   
//     paddingVertical: 1,
//     gap: 8,
//     borderRadius: 25,
//   },
//   refreshText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     fontFamily: 'System',
//      paddingVertical: 12,
//       paddingHorizontal: 20,
//   },
//   tipsContainer: {
//     marginHorizontal: 20,
//     marginBottom: 40,
//   },
//   tipsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 15,
//     fontFamily: 'System',
//   },
//   tipsGrid: {
//     gap: 12,
//   },
//   tipCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 15,
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   tipText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#555',
//     fontFamily: 'System',
//   },
//   // Video Player Styles
//   videoPlayerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   videoTitleContainer: {
//     flex: 1,
//     marginHorizontal: 15,
//   },
//   videoTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//     fontFamily: 'System',
//   },
//   videoSubtitle: {
//     color: 'rgba(255,255,255,0.7)',
//     fontSize: 12,
//     marginTop: 2,
//     fontFamily: 'System',
//   },
//   placeholderRight: {
//     width: 40,
//   },
//   videoWrapper: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   videoLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   videoControlsOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'space-between',
//   },
//   bigPlayButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottomControls: {
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   timeText: {
//     color: 'white',
//     fontSize: 12,
//     width: 45,
//     fontFamily: 'System',
//   },
//   progressBarContainer: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   progressBarBackground: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#667eea',
//     borderRadius: 2,
//   },
//   controlButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 40,
//   },
//   controlButton: {
//     alignItems: 'center',
//   },
//   skipText: {
//     color: 'white',
//     fontSize: 10,
//     marginTop: 2,
//     fontFamily: 'System',
//   },
//   rewardPanel: {
//     backgroundColor: '#000',
//   },
//   rewardContainer: {
//     padding: 20,
//   },
//   rewardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   rewardIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   rewardTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
//   watchProgress: {
//     alignItems: 'flex-end',
//   },
//   progressPercentage: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 4,
//     fontFamily: 'System',
//   },
//   progressMiniBar: {
//     width: 100,
//     height: 3,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 1.5,
//     overflow: 'hidden',
//   },
//   progressMiniFill: {
//     height: '100%',
//     backgroundColor: '#667eea',
//   },
//   rewardDetails: {
//     gap: 10,
//     marginBottom: 20,
//   },
//   rewardItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   rewardItemText: {
//     color: 'white',
//     fontSize: 14,
//     flex: 1,
//     fontFamily: 'System',
//   },
//   claimButton: {
//     borderRadius: 15,
//     overflow: 'hidden',
//   },
//   claimButtonFull: {
//     borderRadius: 15,
//   },
//   claimButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 10,
//   },
//   claimButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//     fontFamily: 'System',
//   },
//   rewardClaimed: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     gap: 10,
//   },
//   rewardClaimedText: {
//     color: '#4CAF50',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'System',
//   },
// });

// export default VideoAdsScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
  RefreshControl,
  Modal,
  Dimensions,
  BackHandler,
  Platform,
  ScrollView,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../src/context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoAdsScreen = ({ navigation }) => {
  const { colors, isDark, theme } = useTheme();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [stats, setStats] = useState({
    available_ads: 0,
    total_earnable: 0,
    daily_earned: 0
  });
  
  // Video player states
  const [selectedAd, setSelectedAd] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef(null);
  const watchTimerRef = useRef(null);
  const totalWatchTimeRef = useRef(0);
  const controlsTimerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  // Load data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      startPulseAnimation();
      return () => {
        if (watchTimerRef.current) clearInterval(watchTimerRef.current);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      };
    }, [])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showVideoPlayer) {
          closeVideoPlayer();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [showVideoPlayer]);

  const startPulseAnimation = () => {
    Animated.loop(
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
    ).start();
  };

  const loadData = async () => {
    try {
      await Promise.all([loadAds(), loadWalletBalance()]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://showa.essential.com.ng/api/showa/wallet/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setWalletBalance(data.coins_available || 0);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const loadAds = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setAds(data.ads || []);
      setStats(data.stats || {
        available_ads: 0,
        total_earnable: 0,
        daily_earned: 0
      });
      
      // Animate slide up
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 20,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Failed to load ads:', error);
    }
  };

  const openVideoPlayer = (ad) => {
    if (!ad.can_watch) {
      Alert.alert('Already Watched', 'You have already watched this ad the maximum number of times.');
      return;
    }

    setSelectedAd(ad);
    setShowVideoPlayer(true);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setHasWatchedEnough(false);
    setIsRewardClaimed(false);
    setShowControls(true);
    totalWatchTimeRef.current = 0;
    
    // Auto-hide controls after 3 seconds
    hideControlsAfterDelay();
    
    // Start tracking  time
    if (watchTimerRef.current) clearInterval(watchTimerRef.current);
    watchTimerRef.current = setInterval(() => {
      totalWatchTimeRef.current += 1;
      if (totalWatchTimeRef.current >= 10 && !hasWatchedEnough) {
        setHasWatchedEnough(true);
      }
      if (duration > 0 && currentTime >= duration * 0.9 && !isRewardClaimed && hasWatchedEnough) {
        autoClaimReward();
      }
    }, 1000);
  };

  const hideControlsAfterDelay = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }
    }, 3000);
  };

  const showControlsWithAnimation = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    hideControlsAfterDelay();
  };

  const closeVideoPlayer = () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
      watchTimerRef.current = null;
    }
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
    
    if (hasWatchedEnough && !isRewardClaimed && totalWatchTimeRef.current >= 10) {
      Alert.alert(
        'Claim Reward?',
        `You watched ${totalWatchTimeRef.current} seconds. Would you like to claim your reward?`,
        [
          { text: 'No Thanks', style: 'cancel' },
          { 
            text: 'Claim Reward', 
            onPress: () => claimReward(totalWatchTimeRef.current)
          }
        ]
      );
    }
    
    setShowVideoPlayer(false);
    setIsPlaying(false);
    setSelectedAd(null);
  };

  const autoClaimReward = () => {
    if (isRewardClaimed) return;
    claimReward(totalWatchTimeRef.current);
    setIsRewardClaimed(true);
  };

  const claimReward = async (watchedSeconds) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoadingVideo(true);
      
      const watchResponse = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/${selectedAd.id}/watch/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          watched_duration: watchedSeconds,
          video_duration: duration || 30
        }),
      });

      const watchData = await watchResponse.json();
      setIsLoadingVideo(false);
      
      if (watchData.success) {
        // Animate reward claim
        loadWalletBalance(); // Refresh balance
        Alert.alert(
          '🎉 Reward Earned!',
          `You earned ${watchData.coins_earned || 0} coins!`,
          [{ 
            text: 'Awesome', 
            onPress: () => {
              closeVideoPlayer();
              loadData();
            }
          }]
        );
      } else {
        Alert.alert('Error', watchData.error || 'Failed to claim reward');
      }
    } catch (watchError) {
      console.error('Claim reward error:', watchError);
      setIsLoadingVideo(false);
      Alert.alert('Error', 'Failed to claim reward');
    }
  };

  const shareAd = async (ad) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const shareResponse = await fetch(`https://showa.essential.com.ng/api/showa/video-ads/${ad.id}/share/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ platform: 'external' }),
      });

      const shareData = await shareResponse.json();
      
      if (shareData.success) {
        const shareResult = await Share.share({
          title: ad.title || 'Watch this ad',
          message: `${ad.title}\n\n${ad.description || 'Earn coins by watching this ad!'}\n\nWatch and earn coins on Showa!`,
          url: `https://showa.app/ads/${ad.id}`
        });

        if (shareResult.action === Share.sharedAction) {
          Alert.alert(
            '✅ Shared Successfully!',
            `You earned ${shareData.coins_earned || 0} coins for sharing!`,
            [{ 
              text: 'Great!',
              onPress: () => loadAds()
            }]
          );
        }
      } else {
        Alert.alert('Error', shareData.error || 'Failed to record share');
      }
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to share ad. Please try again.');
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    showControlsWithAnimation();
  };

  const skipForward = () => {
    if (videoRef.current && duration > 0) {
      const newTime = Math.min(currentTime + 10, duration);
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
      showControlsWithAnimation();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderAdItem = ({ item, index }) => {
    const canWatch = item.can_watch || false;
    const coinsPerView = parseFloat(item.coins_per_view || 0).toFixed(0);
    const coinsPerShare = parseFloat(item.coins_per_share || 0).toFixed(1);
    const progress = ((item.total_views || 0) / item.views_purchased) * 100;
    
    // Use theme colors for categories
    const categoryColors = {
      entertainment: colors.error || '#FF6B6B',
      education: colors.success || '#4ECDC4',
      gaming: colors.info || '#45B7D1',
      shopping: colors.warning || '#96CEB4',
      finance: colors.secondary || '#FECA57',
      health: colors.primaryLight || '#FF9FF3',
      other: colors.textTertiary || '#8395A7'
    };

    return (
      <Animatable.View 
        animation="fadeInUp"
        delay={index * 100}
        style={[styles.adCard, { backgroundColor: colors.surface }]}
      >
        <View style={styles.adHeader}>
          <View style={styles.adBadgeContainer}>
            <View style={[
              styles.categoryBadge,
              { backgroundColor: categoryColors[item.category] || colors.textTertiary }
            ]}>
              <Text style={[styles.categoryText, { color: colors.textInverse }]}>
                {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Other'}
              </Text>
            </View>
            {!canWatch && (
              <View style={[styles.watchedBadge, { backgroundColor: colors.textTertiary }]}>
                <Icon name="checkmark-circle" size={12} color={colors.textInverse} />
                <Text style={[styles.watchedText, { color: colors.textInverse }]}>Watched</Text>
              </View>
            )}
          </View>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={canWatch ? [colors.success, colors.successDark || colors.success] : [colors.textTertiary, colors.textTertiary]}
              style={styles.coinsBadge}
            >
              <Icon name="cash" size={16} color={colors.textInverse} />
              <Text style={[styles.coinsText, { color: colors.textInverse }]}>+{coinsPerView}</Text>
            </LinearGradient>
          </Animated.View>
        </View>
        
        <TouchableOpacity 
          onPress={() => openVideoPlayer(item)} 
          activeOpacity={0.9}
          disabled={!canWatch}
        >
          <View style={styles.thumbnailWrapper}>
            {item.thumbnail ? (
              <Image 
                source={{ uri: item.thumbnail }} 
                style={styles.adThumbnail} 
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark || colors.primary]}
                style={[styles.adThumbnail, styles.placeholderThumbnail]}
              >
                <Icon name="videocam" size={40} color='#fff' />
                <Text style={[styles.placeholderText, { color:'#fff' }]}>Watch & Earn</Text>
              </LinearGradient>
            )}
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.thumbnailOverlay}
            >
              <View style={styles.playButtonContainer}>
                <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
                  <Icon name="play" size={24} color={colors.textInverse} />
                </View>
              </View>
            </LinearGradient>
            
            {!canWatch && (
              <View style={styles.overlayLock}>
                <Icon name="lock-closed" size={30} color={colors.textInverse} />
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.adContent}>
          <Text style={[styles.adTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          
          <Text style={[styles.adDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBackground, { backgroundColor: colors.surfaceVariant }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textTertiary }]}>
              {item.total_views || 0}/{item.views_purchased || 0} views
            </Text>
          </View>
          
          <View style={styles.adFooter}>
            <TouchableOpacity 
              style={[
                styles.watchButton,
                { backgroundColor: colors.success },
                !canWatch && [styles.watchButtonDisabled, { backgroundColor: colors.surfaceVariant }]
              ]}
              onPress={() => openVideoPlayer(item)}
              disabled={!canWatch}
            >
              <Icon 
                name={canWatch ? "play-circle" : "checkmark-circle"} 
                size={20} 
                color={canWatch ? colors.textInverse : colors.textTertiary} 
              />
              <Text style={[
                styles.watchButtonText,
                { color: colors.textInverse },
                !canWatch && [styles.watchButtonTextDisabled, { color: colors.textTertiary }]
              ]}>
                {canWatch ? 'Watch Now' : 'Already Watched'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => shareAd(item)}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark || colors.primary]}
                style={styles.shareButtonGradient}
              >
                <Icon name="share-outline" size={18} color={colors.textInverse} />
                <Text style={[styles.shareButtonText, { color: colors.textInverse }]}>
                  Share (+{coinsPerShare})
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderVideoPlayer = () => {
    if (!selectedAd) return null;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const coinsPerView = parseFloat(selectedAd.coins_per_view || 0).toFixed(0);

    return (
      <Modal
        visible={showVideoPlayer}
        animationType="slide"
        onRequestClose={closeVideoPlayer}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={[styles.videoPlayerContainer, { backgroundColor: colors.background }]}>
          {/* Video Header */}
          <Animated.View 
            style={[
              styles.videoHeader,
              { 
                opacity: fadeAnim,
                backgroundColor: colors.overlay || 'rgba(0,0,0,0.8)' 
              }
            ]}
          >
            <TouchableOpacity 
              onPress={closeVideoPlayer} 
              style={styles.closeButton}
            >
              <Icon name="chevron-down" size={28} color={colors.textInverse} />
            </TouchableOpacity>
            
            <View style={styles.videoTitleContainer}>
              <Text style={[styles.videoTitle, { color: colors.textInverse }]} numberOfLines={1}>
                {selectedAd.title}
              </Text>
              <Text style={[styles.videoSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>
                Watch to earn {coinsPerView} coins
              </Text>
            </View>
            
            <View style={styles.placeholderRight} />
          </Animated.View>

          {/* Video Player */}
          <TouchableOpacity 
            style={styles.videoWrapper}
            activeOpacity={1}
            onPress={showControlsWithAnimation}
          >
            <Video
              ref={videoRef}
              source={{ uri: selectedAd.video_url }}
              style={styles.video}
              paused={!isPlaying}
              resizeMode="contain"
              onLoad={data => {
                setDuration(data.duration);
                setIsLoadingVideo(false);
              }}
              onProgress={data => setCurrentTime(data.currentTime)}
              onEnd={() => {
                if (!isRewardClaimed && hasWatchedEnough) autoClaimReward();
              }}
              onError={error => {
                console.error('Video error:', error);
                Alert.alert('Error', 'Failed to load video. Please try another ad.');
                setIsLoadingVideo(false);
              }}
              controls={false}
            />
            
            {/* Video Controls Overlay */}
            {showControls && (
              <Animated.View 
                style={[
                  styles.videoControlsOverlay,
                  { opacity: fadeAnim }
                ]}
              >
                {!isPlaying && (
                  <TouchableOpacity 
                    style={styles.bigPlayButton}
                    onPress={togglePlayPause}
                  >
                    <Icon name="play-circle" size={70} color={colors.textInverse} />
                  </TouchableOpacity>
                )}
                
                <View style={[styles.bottomControls, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, { color: colors.textInverse }]}>{formatTime(currentTime)}</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBarBackground, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                        <View 
                          style={[
                            styles.progressBarFill,
                            { 
                              width: `${progress}%`,
                              backgroundColor: colors.primary 
                            }
                          ]} 
                        />
                      </View>
                    </View>
                    <Text style={[styles.timeText, { color: colors.textInverse }]}>{formatTime(duration)}</Text>
                  </View>
                  
                  <View style={styles.controlButtons}>
                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={togglePlayPause}
                    >
                      <Icon 
                        name={isPlaying ? "pause" : "play"} 
                        size={30} 
                        color={colors.textInverse} 
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={skipForward}
                    >
                      <Icon name="play-forward" size={30} color={colors.textInverse} />
                      <Text style={[styles.skipText, { color: colors.textInverse }]}>10s</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
          </TouchableOpacity>

          {/* Reward Panel */}
          <Animated.View 
            style={[
              styles.rewardPanel,
              { opacity: fadeAnim }
            ]}
          >
            <LinearGradient
              colors={[colors.surfaceVariant, colors.surfaceVariant]}
              style={styles.rewardContainer}
            >
              <View style={styles.rewardHeader}>
                <View style={styles.rewardIconContainer}>
                  <Icon name="trophy" size={24} color={colors.warning} />
                  <Text style={[styles.rewardTitle, { color: colors.text }]}>Earn Rewards</Text>
                </View>
                
                <View style={styles.watchProgress}>
                  <Text style={[styles.progressPercentage, { color: colors.text }]}>
                    {Math.round(progress)}% watched
                  </Text>
                  <View style={[styles.progressMiniBar, { backgroundColor: colors.surface }]}>
                    <View 
                      style={[
                        styles.progressMiniFill,
                        { 
                          width: `${progress}%`,
                          backgroundColor: colors.primary 
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.rewardDetails}>
                <View style={styles.rewardItem}>
                  <Icon 
                    name={hasWatchedEnough ? "checkmark-circle" : "time"} 
                    size={20} 
                    color={hasWatchedEnough ? colors.success : colors.warning} 
                  />
                  <Text style={[styles.rewardItemText, { color: colors.text }]}>
                    {hasWatchedEnough 
                      ? "✓ Minimum time reached" 
                      : "Watch 10+ seconds"}
                  </Text>
                </View>
                
                <View style={styles.rewardItem}>
                  <Icon 
                    name={progress >= 90 ? "checkmark-circle" : "flag"} 
                    size={20} 
                    color={progress >= 90 ? colors.success : colors.warning} 
                  />
                  <Text style={[styles.rewardItemText, { color: colors.text }]}>
                    {progress >= 90 
                      ? "✓ 90% watched for full reward" 
                      : "Watch 90% for full reward"}
                  </Text>
                </View>
              </View>
              
              {hasWatchedEnough && !isRewardClaimed && (
                <TouchableOpacity 
                  style={[
                    styles.claimButton,
                    progress >= 90 && styles.claimButtonFull
                  ]}
                  onPress={() => claimReward(totalWatchTimeRef.current)}
                  disabled={isLoadingVideo}
                >
                  <LinearGradient
                    colors={progress >= 90 
                      ? [colors.warning, colors.warningDark || colors.warning] 
                      : [colors.primary, colors.primaryDark || colors.primary]
                    }
                    style={styles.claimButtonGradient}
                  >
                    {isLoadingVideo ? (
                      <ActivityIndicator color={colors.textInverse} size="small" />
                    ) : (
                      <>
                        <Icon 
                          name={progress >= 90 ? "trophy" : "cash"} 
                          size={22} 
                          color={colors.textInverse} 
                        />
                        <Text style={[styles.claimButtonText, { color: colors.textInverse }]}>
                          {progress >= 90 
                            ? `Claim ${coinsPerView} Coins!` 
                            : 'Claim Partial Reward'}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
              
              {isRewardClaimed && (
                <View style={styles.rewardClaimed}>
                  <Icon name="checkmark-done-circle" size={28} color={colors.success} />
                  <Text style={[styles.rewardClaimedText, { color: colors.success }]}>
                    Reward claimed successfully!
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Animatable.View 
        animation="pulse"
        iterationCount="infinite"
        style={styles.emptyIconContainer}
      >
        <Icon name="tv-outline" size={80} color={colors.primary} />
      </Animatable.View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Ads Available</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Check back later for new video ads to watch and earn coins!
      </Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadData}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark || colors.primary]}
          style={styles.refreshButtonGradient}
        >
          <Text style={[styles.refreshText, { color: '#fff' }]}>Refresh Ads</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <LinearGradient
            colors={[colors.primary, colors.primary]}
            style={styles.loadingBackground}
          >
            <ActivityIndicator size="large" color={colors.textInverse} />
            <Text style={[styles.loadingText, { color: colors.textInverse }]}>Loading video ads...</Text>
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="chevron-back" size={28} color='#fff' />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitle, { color: '#fff' }]}>Watch & Earn</Text>
              <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>Earn coins by watching ads</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.walletButton,{color:'#fff'}]}
              onPress={() => navigation.navigate('EarningWallet')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.walletButtonInner}
              >
                <Icon name="wallet" size={20} color='#fff' />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* {isLoadingVideo && (
          <View style={[styles.topLoadingContainer, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.topLoadingText, { color: colors.text }]}>Loading video...</Text>
          </View>
        )} */}

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              title="Pull to refresh"
              titleColor={colors.primary}
            />
          }
        >
          {/* Stats Card */}
          {/* <Animatable.View animation="fadeIn" delay={200}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark || colors.primary]}
              style={[styles.statsCard, { marginTop: 20, marginHorizontal: 16 }]}
            >
              <View style={styles.statsHeader}>
                <Icon name="stats-chart" size={24} color={colors.textInverse} />
                <Text style={[styles.statsTitle, { color: colors.textInverse }]}>Earning Stats</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.textInverse }]}>
                    {stats.available_ads || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
                    Available Ads
                  </Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.textInverse }]}>
                    {stats.total_earnable || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
                    Total Earnable
                  </Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.textInverse }]}>
                    {stats.daily_earned || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>
                    Today's Earnings
                  </Text>
                </View>
              </View>
              
              <View style={[styles.walletInfo, { borderTopColor: 'rgba(255,255,255,0.3)' }]}>
                <Icon name="wallet" size={20} color={colors.textInverse} />
                <Text style={[styles.walletBalance, { color: colors.textInverse }]}>
                  Balance: {walletBalance} coins
                </Text>
              </View>
            </LinearGradient>
          </Animatable.View> */}

          {/* Ads List */}
          <View style={[styles.adsContainer, { marginTop: 20 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Video Ads</Text>
              <Text style={[styles.sectionCount, { 
                color: colors.primary,
                backgroundColor: colors.surfaceVariant 
              }]}>
                {ads.length} ads
              </Text>
            </View>
            
            <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
              {ads.length > 0 ? (
                <FlatList
                  data={ads}
                  renderItem={renderAdItem}
                  keyExtractor={(item, index) => `${item?.id}-${index}`}
                  scrollEnabled={false}
                  contentContainerStyle={styles.adsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                renderEmptyState()
              )}
            </Animated.View>
          </View>
          
          {/* Tips Section */}
          {ads.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips for Earning More</Text>
              <View style={styles.tipsGrid}>
                <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
                  <Icon name="checkmark-circle" size={24} color={colors.success} />
                  <Text style={[styles.tipText, { color: colors.text }]}>Watch 90% of video for full reward</Text>
                </View>
                <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
                  <Icon name="share-social" size={24} color={colors.primary} />
                  <Text style={[styles.tipText, { color: colors.text }]}>Share ads to earn bonus coins</Text>
                </View>
                <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
                  <Icon name="time" size={24} color={colors.warning} />
                  <Text style={[styles.tipText, { color: colors.text }]}>Check daily for new ads</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Video Player Modal */}
      {renderVideoPlayer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'System',
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
    borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
    elevation: 6,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 70,
    paddingBottom: 25,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'System',
  },
  walletButton: {
    borderRadius: 0,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  walletButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    fontFamily: 'System',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'System',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
  },
  walletBalance: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  adsContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: 'System',
  },
  topLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  topLoadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  adsList: {
    paddingBottom: 10,
  },
  adCard: {
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  adBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'System',
  },
  watchedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  watchedText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'System',
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'System',
  },
  thumbnailWrapper: {
    position: 'relative',
    height: 180,
  },
  adThumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    fontFamily: 'System',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContent: {
    padding: 15,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  adDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: 'System',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'right',
    fontFamily: 'System',
  },
  adFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  watchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  watchButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  watchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  watchButtonTextDisabled: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    fontFamily: 'System',
  },
  refreshButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
    gap: 8,
    borderRadius: 25,
  },
  refreshText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'System',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tipsContainer: {
    marginHorizontal: 16,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    fontFamily: 'System',
  },
  tipsGrid: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'System',
  },
  // Video Player Styles
  videoPlayerContainer: {
    flex: 1,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  closeButton: {
    padding: 5,
  },
  videoTitleContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  videoSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'System',
  },
  placeholderRight: {
    width: 40,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  bigPlayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 12,
    width: 45,
    fontFamily: 'System',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  skipText: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'System',
  },
  rewardPanel: {
    backgroundColor: '#000',
  },
  rewardContainer: {
    padding: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  watchProgress: {
    alignItems: 'flex-end',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  progressMiniBar: {
    width: 100,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressMiniFill: {
    height: '100%',
  },
  rewardDetails: {
    gap: 10,
    marginBottom: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardItemText: {
    fontSize: 14,
    flex: 1,
    fontFamily: 'System',
  },
  claimButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  claimButtonFull: {
    borderRadius: 15,
  },
  claimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  rewardClaimed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  rewardClaimedText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default VideoAdsScreen;