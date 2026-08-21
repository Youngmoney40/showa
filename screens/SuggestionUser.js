
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   RefreshControl,
//   StatusBar,
//   Alert,
//   Animated,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

// const { width, height } = Dimensions.get('window');

// const SuggestedUsersScreen = ({ navigation }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [following, setFollowing] = useState({});
//   const [followAnimations, setFollowAnimations] = useState({});
//   const [error, setError] = useState(null);
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [followedCount, setFollowedCount] = useState(0);

//   useEffect(() => {
//     fetchTopUsers();
//   }, []);

//   useEffect(() => {
//     const count = Object.values(following).filter(Boolean).length;
//     setFollowedCount(count);
//   }, [following]);

//   const fetchTopUsers = async () => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await fetch(`https://api.showapp.ng/api/showa/top-users/`, {
//         method: 'GET',
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : '',
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         const usersList = data.users || [];
        
//         if (usersList.length > 0) {
//           const anims = {};
//           const followState = {};
//           usersList.forEach(user => {
//             anims[user.id] = new Animated.Value(0);
//             followState[user.id] = false;
//           });
//           setFollowAnimations(anims);
//           setFollowing(followState);
//           setUsers(usersList);
//         } else {
//           setUsers([]);
//           setError('No users available at the moment.');
//         }
//       } else {
//         setError(data.message || 'Failed to load users');
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//       setError('Network error. Please check your connection.');
//       Alert.alert(
//         'Connection Error',
//         'Failed to load suggested users. Please check your internet connection.',
//         [{ text: 'Retry', onPress: fetchTopUsers }]
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleFollow = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       if (!token) {
//         Alert.alert('Please login', 'You need to be logged in to follow users.');
//         return;
//       }

//       const newFollowingState = { ...following, [userId]: true };
//       setFollowing(newFollowingState);

//       if (followAnimations[userId]) {
//         Animated.spring(followAnimations[userId], {
//           toValue: 1,
//           useNativeDriver: true,
//           friction: 3,
//           tension: 40,
//         }).start();
//       }

//       const response = await fetch(`https://api.showapp.ng/api/showa/follow/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ following_user: userId }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         setFollowing({ ...following, [userId]: false });
//         Alert.alert('Error', result.detail || 'Failed to follow user. Please try again.');
//       } else {
//         if (result.reward) {
//           Alert.alert(
//             '🎉 You earned coins!',
//             `You received ${result.reward.coins} coins for following ${getUserById(userId)?.name || 'this user'}!`,
//             [{ text: 'Awesome!', style: 'default' }]
//           );
//         }
//       }
//     } catch (error) {
//       console.error('Follow error:', error);
//       setFollowing({ ...following, [userId]: false });
//       Alert.alert('Error', 'Network error. Please try again.');
//     }
//   };

//   const getUserById = (id) => {
//     return users.find(user => user.id === id);
//   };

//   const handleSkip = () => {
//     navigation.replace('BroadcastHome');
//   };

//   const handleContinue = () => {
//     navigation.replace('BroadcastHome', { 
//       newlyFollowed: Object.keys(following).filter(id => following[id]),
//       followedCount: followedCount
//     });
//   };

//   const renderFollowButton = (userId) => {
//     const isFollowing = following[userId];
//     const animValue = followAnimations[userId] || new Animated.Value(0);

//     const buttonScale = animValue.interpolate({
//       inputRange: [0, 0.5, 1],
//       outputRange: [1, 1.15, 1],
//     });

//     if (isFollowing) {
//       return (
//         <Animated.View 
//           style={[
//             styles.followButton, 
//             styles.followingButton, 
//             { transform: [{ scale: buttonScale }] }
//           ]}
//         >
//           <Icon name="checkmark-circle" size={18} color="#FFFFFF" />
//           <Text style={styles.followButtonText}>Following</Text>
//         </Animated.View>
//       );
//     }

//     return (
//       <TouchableOpacity
//         style={styles.followButton}
//         onPress={() => handleFollow(userId)}
//         activeOpacity={0.7}
//       >
        
//         <Text style={styles.followButtonText}>Follow</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderUserItem = ({ item, index }) => {
//     const isFollowing = following[item.id];
    
//     return (
//       <Animated.View 
//         style={[
//           styles.userCard,
//           {
//             transform: [{
//               scale: scrollY.interpolate({
//                 inputRange: [
//                   (index - 1) * 120,
//                   index * 120,
//                   (index + 1) * 120,
//                 ],
//                 outputRange: [0.98, 1, 0.98],
//                 extrapolate: 'clamp',
//               }),
//             }],
//           },
//         ]}
//       >
//         <View style={styles.userCardContent}>
//           <TouchableOpacity 
//             style={styles.userInfo}
//             onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
//           >
//             <View style={styles.profileImageContainer}>
//               <Image
//                 source={item.profile_picture ? { uri: item.profile_picture } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//                 style={styles.profileImage}
//               />
//               {item.is_verified && (
//                 <View style={styles.verifiedBadgeContainer}>
//                   <Icon name="checkmark-circle" size={16} color="#FFFFFF" />
//                 </View>
//               )}
//             </View>
            
//             <View style={styles.userDetails}>
//               <View style={styles.nameContainer}>
//                 <Text style={styles.userName} numberOfLines={1}>
//                   {item.name || item.username || 'User'}
//                 </Text>
//                 {item.is_verified && (
//                   <Icon name="checkmark-circle" size={16} color="#0D64DD" style={styles.verifiedIcon} />
//                 )}
//               </View>
              
//               {/* <View style={styles.userStats}>
//                 <View style={styles.statItem}>
//                   <Icon name="people-outline" size={13} color="#7F8C8D" />
//                   <Text style={styles.statText}>{item.follower_count || 0}</Text>
//                 </View>
//                 <View style={styles.statItem}>
//                   <Icon name="heart-outline" size={13} color="#E74C3C" />
//                   <Text style={styles.statText}>{item.total_likes || 0}</Text>
//                 </View>
//               </View> */}
              
//               {item.bio && (
//                 <Text style={styles.userBio} numberOfLines={1}>
//                   {item.bio}
//                 </Text>
//               )}
//             </View>
//           </TouchableOpacity>

//           <View style={styles.actionContainer}>
//             {renderFollowButton(item.id)}
//           </View>
//         </View>

//         {isFollowing && (
//           <View style={styles.followingBadge}>
//             <Icon name="checkmark-circle" size={14} color="#0D64DD" />
//             <Text style={styles.followingBadgeText}>Following</Text>
//           </View>
//         )}
//       </Animated.View>
//     );
//   };

//   const renderHeader = () => {
//     const totalUsers = users.length;
//     const progress = Math.min((followedCount / 5) * 100, 100);
    
//     return (
//       <View style={styles.header}>
//         <LinearGradient
//           colors={['#0D64DD', '#0A4FA8']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.headerGradient}
//         >
//           <View style={styles.headerContent}>
//             <View style={styles.headerTop}>
//               <View>
//                 <Text style={styles.headerTitle}>Suggested for You</Text>
//                 <Text style={styles.headerSubtitle}>
//                   Follow top creators to personalize your feed
//                 </Text>
//               </View>
//               {/* <View style={styles.userCountContainer}>
//                 <Icon name="people" size={14} color="rgba(255,255,255,0.9)" />
//                 <Text style={styles.userCount}>{totalUsers} creators</Text>
//               </View> */}
//             </View>

//             {followedCount > 0 && (
//               <View style={styles.progressContainer}>
//                 <View style={styles.progressBar}>
//                   <View style={[styles.progressFill, { width: `${progress}%` }]} />
//                 </View>
//                 <Text style={styles.progressText}>
//                   {followedCount} / 5 followed
//                 </Text>
//               </View>
//             )}
//           </View>
//         </LinearGradient>
//       </View>
//     );
//   };

//   const renderFooter = () => {
//     const canContinue = followedCount > 0;
    
//     return (
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.continueButton, canContinue && styles.continueButtonActive]}
//           onPress={handleContinue}
//           disabled={!canContinue}
//           activeOpacity={0.8}
//         >
//           <LinearGradient
//             colors={canContinue ? ['#0D64DD', '#0A4FA8'] : ['#BDC3C7', '#95A5A6']}
//             style={styles.gradientButton}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Text style={styles.continueButtonText}>
//               {canContinue ? `Continue with ${followedCount} followed` : 'Follow someone to continue'}
//             </Text>
//             {canContinue && (
//               <Icon name="arrow-forward" size={20} color="#FFFFFF" />
//             )}
//           </LinearGradient>
//         </TouchableOpacity>
        
//         {/* <TouchableOpacity 
//           style={styles.exploreButton} 
//           onPress={handleSkip}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.exploreButtonText}>Skip for now</Text>
//           <Icon name="chevron-forward" size={16} color="#7F8C8D" />
//         </TouchableOpacity> */}
//       </View>
//     );
//   };

//   if (error && users.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Icon name="sad-outline" size={64} color="#BDC3C7" />
//           <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
//           <Text style={styles.errorMessage}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchTopUsers}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0D64DD" />
//           <Text style={styles.loadingTitle}>Finding amazing people</Text>
//           <Text style={styles.loadingSubtitle}>Personalizing your experience...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0D64DD" />
      
//       <FlatList
//         data={users}
//         renderItem={renderUserItem}
//         keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={renderHeader}
//         ListFooterComponent={renderFooter}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => {
//               setRefreshing(true);
//               fetchTopUsers();
//             }}
//             colors={['#0D64DD']}
//             tintColor="#0D64DD"
//           />
//         }
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={10}
//         initialNumToRender={8}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FA',
//   },
  
//   // Loading State
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F7FA',
//     paddingHorizontal: 40,
//   },
//   loadingTitle: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//   },
//   loadingSubtitle: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#7F8C8D',
//   },

//   // Error State
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F7FA',
//     paddingHorizontal: 40,
//   },
//   errorTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginTop: 20,
//   },
//   errorMessage: {
//     fontSize: 14,
//     color: '#7F8C8D',
//     textAlign: 'center',
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   retryButton: {
//     backgroundColor: '#0D64DD',
//     paddingHorizontal: 40,
//     paddingVertical: 14,
//     borderRadius: 25,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#0D64DD',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // List Content
//   listContent: {
//     paddingBottom: 40,
//   },

//   // Header
//   header: {
//     marginBottom: 12,
//   },
//   headerGradient: {
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#0D64DD',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   headerContent: {
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 28,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 16,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     letterSpacing: 0.5,
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.85)',
//     marginTop: 4,
//     lineHeight: 20,
//   },
//   userCountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   userCount: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   progressBar: {
//     flex: 1,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     borderRadius: 2,
//     marginRight: 12,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 2,
//   },
//   progressText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },

//   // User Card
//   userCard: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     marginVertical: 6,
//     padding: 16,
//     borderRadius: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.04)',
//   },
//   userCardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImageContainer: {
//     position: 'relative',
//   },
//   profileImage: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 2,
//     borderColor: '#E8ECF1',
//   },
//   verifiedBadgeContainer: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     backgroundColor: '#0D64DD',
//     borderRadius: 10,
//     padding: 2,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   userDetails: {
//     marginLeft: 14,
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//     maxWidth: '90%',
//   },
//   verifiedIcon: {
//     marginLeft: 4,
//   },
//   userStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   statText: {
//     fontSize: 12,
//     color: '#7F8C8D',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   userBio: {
//     fontSize: 13,
//     color: '#7F8C8D',
//     lineHeight: 18,
//   },
//   actionContainer: {
//     marginLeft: 8,
//   },
  
//   // Follow Button
//   followButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0D64DD',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 25,
//     minWidth: 96,
//     justifyContent: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#0D64DD',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.15,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   followButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginLeft: 6,
//     fontSize: 13,
//     letterSpacing: 0.3,
//   },
//   followingButton: {
//     backgroundColor: '#2ECC71',
//   },
//   followingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.05)',
//   },
//   followingBadgeText: {
//     color: '#0D64DD',
//     fontSize: 13,
//     fontWeight: '500',
//     marginLeft: 6,
//   },

//   // Footer
//   footer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 32,
//   },
//   continueButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 16,
//     opacity: 0.5,
//   },
//   continueButtonActive: {
//     opacity: 1,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#0D64DD',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.25,
//         shadowRadius: 16,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   gradientButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   continueButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//     marginRight: 8,
//     letterSpacing: 0.3,
//   },
//   exploreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//   },
//   exploreButtonText: {
//     fontSize: 15,
//     color: '#7F8C8D',
//     fontWeight: '500',
//     marginRight: 4,
//   },
// });

// export default SuggestedUsersScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const SuggestedUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState({});
  const [followedCount, setFollowedCount] = useState(0);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    userId: null,
    userData: null,
  });
  const snackbarAnim = useRef(new Animated.Value(0)).current;
  const snackbarTimeout = useRef(null);

  // Animation values for removed users
  const [removedAnimations, setRemovedAnimations] = useState({});

  useEffect(() => {
    fetchTopUsers();
  }, []);

  useEffect(() => {
    const count = Object.values(following).filter(Boolean).length;
    setFollowedCount(count);
  }, [following]);

  const fetchTopUsers = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`https://api.showapp.ng/api/showa/top-users/?limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        let usersList = data.users || [];
        
        // Filter out already followed users
        usersList = usersList.filter(user => !following[user.id]);
        
        // Limit to 10
        if (usersList.length > 10) {
          usersList = usersList.slice(0, 10);
        }
        
        if (usersList.length > 0) {
          const followState = {};
          usersList.forEach(user => {
            followState[user.id] = false;
          });
          setFollowing(prev => ({ ...prev, ...followState }));
          setUsers(usersList);
        } else {
          // If no new users, try to fetch more
          if (users.length === 0) {
            setUsers([]);
            setError('No more users available at the moment.');
          }
        }
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection.');
      Alert.alert(
        'Connection Error',
        'Failed to load suggested users. Please check your internet connection.',
        [{ text: 'Retry', onPress: fetchTopUsers }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Show snackbar with UNDO option
  const showSnackbar = (message, userId, userData) => {
    // Clear any existing timeout
    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }

    // Reset animation
    snackbarAnim.setValue(0);
    
    setSnackbar({
      visible: true,
      message,
      userId,
      userData,
    });

    // Animate in
    Animated.spring(snackbarAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Auto-hide after 4 seconds
    snackbarTimeout.current = setTimeout(() => {
      hideSnackbar();
    }, 4000);
  };

  const hideSnackbar = () => {
    Animated.timing(snackbarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSnackbar({ visible: false, message: '', userId: null, userData: null });
    });
  };

  const handleFollow = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Please login', 'You need to be logged in to follow users.');
        return;
      }

      const userToFollow = users.find(user => user.id === userId);
      if (!userToFollow) return;

      // Update following state immediately
      setFollowing(prev => ({ ...prev, [userId]: true }));

      // Create animation for removal
      const anim = new Animated.Value(1);
      setRemovedAnimations(prev => ({ ...prev, [userId]: anim }));

      // Animate out
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(anim, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Remove user from list after animation
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        // Clean up animation reference
        setRemovedAnimations(prev => {
          const newAnims = { ...prev };
          delete newAnims[userId];
          return newAnims;
        });
        
        // Show snackbar with UNDO
        showSnackbar(
          `Followed ${userToFollow.name || userToFollow.username || 'User'}`,
          userId,
          userToFollow
        );

        // If list is getting low, fetch more users
        if (users.length <= 3) {
          fetchMoreUsers();
        }
      });

      // API call
      const response = await fetch(`https://api.showapp.ng/api/showa/follow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ following_user: userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Revert on error
        setFollowing(prev => ({ ...prev, [userId]: false }));
        // Add user back
        setUsers(prev => [...prev, userToFollow]);
        Alert.alert('Error', result.detail || 'Failed to follow user. Please try again.');
        hideSnackbar();
      } else {
        if (result.reward) {
          // Show reward after snackbar hides
          setTimeout(() => {
            Alert.alert(
              '🎉 You earned coins!',
              `You received ${result.reward.coins} coins for following ${userToFollow.name || 'this user'}!`,
              [{ text: 'Awesome!', style: 'default' }]
            );
          }, 500);
        }
      }
    } catch (error) {
      console.error('Follow error:', error);
      // Revert on network error
      const userToRestore = users.find(user => user.id === userId);
      if (userToRestore) {
        setUsers(prev => [...prev, userToRestore]);
      }
      setFollowing(prev => ({ ...prev, [userId]: false }));
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleUndoFollow = () => {
    const { userId, userData } = snackbar;
    if (!userId || !userData) return;

    // Hide snackbar
    hideSnackbar();

    // Re-add user to list
    setUsers(prev => {
      // Check if user already exists in list
      if (prev.some(user => user.id === userId)) {
        return prev;
      }
      // Add to top of list
      return [userData, ...prev];
    });

    // Update following state
    setFollowing(prev => ({ ...prev, [userId]: false }));

    // Show confirmation
    Alert.alert(
      'Unfollowed',
      `You unfollowed ${userData.name || userData.username || 'User'}`,
      [{ text: 'OK' }]
    );
  };

  const fetchMoreUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`https://api.showapp.ng/api/showa/top-users/?limit=5`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        let newUsers = data.users || [];
        // Filter out already followed users and existing users
        newUsers = newUsers.filter(user => 
          !following[user.id] && 
          !users.some(existing => existing.id === user.id)
        );
        
        if (newUsers.length > 0) {
          const followState = {};
          newUsers.forEach(user => {
            followState[user.id] = false;
          });
          setFollowing(prev => ({ ...prev, ...followState }));
          setUsers(prev => [...prev, ...newUsers].slice(0, 10));
        }
      }
    } catch (error) {
      console.error('Error fetching more users:', error);
    }
  };

  const handleSkip = () => {
    navigation.replace('BroadcastHome');
  };

  const handleContinue = () => {
    navigation.replace('BroadcastHome', { 
      newlyFollowed: Object.keys(following).filter(id => following[id]),
      followedCount: followedCount
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderUserItem = ({ item, index }) => {
    const isFollowing = following[item.id];
    const anim = removedAnimations[item.id] || new Animated.Value(1);
    const isRemoving = removedAnimations[item.id] !== undefined;

    return (
      <Animated.View 
        style={[
          styles.userCard,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.userCardContent}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={item.profile_picture ? { uri: item.profile_picture } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
                style={styles.profileImage}
              />
              
            </View>
            
            <View style={styles.userDetails}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName} numberOfLines={1}>
                  {item.name || item.username || 'User'}
                </Text>
                {/* ONLY ONE verification badge - right next to the name */}
                {item.is_verified && (
                  <Icon name="checkmark-circle" size={16} color="#0D64DD" style={styles.verifiedIcon} />
                )}
              </View>
              
              {/* Follower count - now visible */}
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  
                  <Text style={styles.statText}>
                    {formatNumber(item.follower_count || 0)} followers
                  </Text>
                </View>
                
              </View>
              
              {item.bio && (
                <Text style={styles.userBio} numberOfLines={1}>
                  {item.bio}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.actionContainer}>
            {!isFollowing && (
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => handleFollow(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => {
    const totalUsers = users.length;
    const progress = Math.min((followedCount / 5) * 100, 100);
    
    return (
      <View style={styles.header}>
        <LinearGradient
          colors={['#0D64DD', '#0A4FA8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Suggested for You</Text>
                <Text style={styles.headerSubtitle}>
                  Follow creators to personalize your feed
                </Text>
              </View>
              
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {followedCount} / 5 followed
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderFooter = () => {
    const canContinue = followedCount > 0;
    
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, canContinue && styles.continueButtonActive]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canContinue ? ['#0D64DD', '#0A4FA8'] : ['#BDC3C7', '#95A5A6']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>
              {canContinue ? `Continue with ${followedCount} followed` : 'Follow someone to continue'}
            </Text>
            {canContinue && (
              <Icon name="arrow-forward" size={20} color="#FFFFFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  // Snackbar component
  const renderSnackbar = () => {
    if (!snackbar.visible) return null;

    const translateY = snackbarAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    const opacity = snackbarAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1],
    });

    return (
      <Animated.View
        style={[
          styles.snackbarContainer,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <View style={styles.snackbarContent}>
          <Icon name="checkmark-circle" size={20} color="#2ECC71" />
          <Text style={styles.snackbarMessage}>{snackbar.message}</Text>
          {/* <TouchableOpacity 
            style={styles.undoButton}
            onPress={handleUndoFollow}
            activeOpacity={0.7}
          >
            <Text style={styles.undoButtonText}>UNDO</Text>
          </TouchableOpacity> */}
        </View>
      </Animated.View>
    );
  };

  if (error && users.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="sad-outline" size={64} color="#BDC3C7" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTopUsers}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D64DD" />
          <Text style={styles.loadingTitle}>Finding amazing people</Text>
          <Text style={styles.loadingSubtitle}>Personalizing your experience...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D64DD" />
      
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchTopUsers();
            }}
            colors={['#0D64DD']}
            tintColor="#0D64DD"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
      />

      {renderSnackbar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  loadingSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#7F8C8D',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#0D64DD',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#0D64DD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // List Content
  listContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 12,
  },
  headerGradient: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#0D64DD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    lineHeight: 20,
  },
  userCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userCount: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // User Card
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E8ECF1',
  },
  userDetails: {
    marginLeft: 14,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    maxWidth: '90%',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
    fontWeight: '500',
  },
  userBio: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  actionContainer: {
    marginLeft: 8,
  },
  
  // Follow Button
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D64DD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    minWidth: 96,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0D64DD',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    opacity: 0.5,
  },
  continueButtonActive: {
    opacity: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#0D64DD',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 0.3,
  },

  // Snackbar
  snackbarContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  snackbarMessage: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  undoButtonText: {
    color: '#0D64DD',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default SuggestedUsersScreen;