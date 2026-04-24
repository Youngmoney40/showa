// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   Platform,
//   ActivityIndicator,
//   Dimensions,
//   StatusBar,
//   FlatList,
//   Animated,
//   KeyboardAvoidingView,
//   ImageBackground,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
// import { useTheme } from '../../src/context/ThemeContext';
// import CatalogComponent from '../../showa_business/OthersUserCatalog';


// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const UserProfile = ({ navigation, route }) => {
//   const { colors, isDark } = useTheme();
//   const userIdFromParams = route.params?.userId;
  
//   const [selectedTab, setSelectedTab] = useState('posts');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [productModalVisible, setProductModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isVideoPlaying, setIsVideoPlaying] = useState({});
//   const [fullScreenImage, setFullScreenImage] = useState({
//     visible: false,
//     src: '',
//     type: 'profile',
//   });
//   const [followersModalVisible, setFollowersModalVisible] = useState(false);
//   const [followingModalVisible, setFollowingModalVisible] = useState(false);
//   const [followersList, setFollowersList] = useState([]);
//   const [followingList, setFollowingList] = useState([]);
//   const [loadingFollowers, setLoadingFollowers] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followId, setFollowId] = useState(null);

//   const [profileData, setProfileData] = useState({
//     user: null,
//     recent_content: {
//       listings: [],
//       posts: [],
//       videos: []
//     },
//     stats: {
//       followers_count: 0,
//       following_count: 0,
//       is_following: false,
//       listings_count: 0,
//       posts_count: 0,
//       videos_count: 0
//     }
//   });

//   const [userProfileImage, setUserProfileImage] = useState('');
//   const [userCoverImage, setUserCoverImage] = useState('');
//   const [businessProfile, setBusinessProfile] = useState(null);
//   const [catalogData, setCatalogData] = useState([]);
//   const [showBusinessInfo, setShowBusinessInfo] = useState(false);
//   const [businessLoading, setBusinessLoading] = useState(false);
//   const [followStats, setFollowStats] = useState({
//     followers_count: 0,
//     following_count: 0
//   });

//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [coverPhotoFile, setCoverPhotoFile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [dateLockMessage, setDateLockMessage] = useState('');
//   const [catalogsCount, setCatalogsCount] = useState(0);

//   const scrollViewRef = useRef(null);
//   const catalogRef = useRef(null);

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const getImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
//       return null;
//     }
    
//     if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
//       let url = imagePath;
//       if (url.includes('api.showapp.ngmedia')) {
//         url = url.replace('api.showapp.ngmedia', 'api.showapp.ng/media');
//       }
//       if (url.startsWith('http://')) {
//         url = url.replace('http://', 'https://');
//       }
//       if (url.includes('api.showapp.ng/') && 
//           !url.includes('api.showapp.ng/media/') &&
//           (url.includes('profile_pics') || url.includes('cover_photos') ||
//            url.includes('catalog_images') || url.includes('marketplace_images') ||
//            url.includes('post_images'))) {
//         url = url.replace('api.showapp.ng/', 'api.showapp.ng/media/');
//       }
//       return url;
//     }
    
//     if (typeof imagePath === 'object') {
//       if (imagePath.image) return getImageUrl(imagePath.image);
//       if (imagePath.url) return getImageUrl(imagePath.url);
//       if (imagePath.media) return getImageUrl(imagePath.media);
//       return null;
//     }
    
//     if (typeof imagePath === 'string') {
//       let cleanPath = imagePath;
//       if (cleanPath.startsWith('/')) {
//         cleanPath = cleanPath.substring(1);
//       }
//       if (!cleanPath.startsWith('media/')) {
//         if (cleanPath.includes('profile_pics') || cleanPath.includes('cover_photos') ||
//             cleanPath.includes('catalog_images') || cleanPath.includes('marketplace_images') ||
//             cleanPath.includes('post_images') || cleanPath.includes('image_') ||
//             cleanPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//           cleanPath = 'media/' + cleanPath;
//         }
//       }
//       let baseUrl = API_ROUTE_IMAGE;
//       if (!baseUrl.endsWith('/')) {
//         baseUrl = baseUrl + '/';
//       }
//       return `${baseUrl}${cleanPath}`;
//     }
//     return null;
//   };

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

//       if (!token) {
//         navigation.navigate('Login');
//         return;
//       }

//       let response;
//       try {
//         response = await axios.get(`${API_ROUTE}/users/${targetUserId}/profile/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         console.log('User profile fetch response:', response.data);
//       } catch (error) {
//         // Fallback to profile profile
//         if (!userIdFromParams) {
//           response = await axios.get(`${API_ROUTE}/profile/`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         }
//       }

//       if (response?.status === 200) {
//         const data = response.data;
//         setProfileData(data);
        
//         // Update follow stats from the data
//         if (data.stats) {
//           setFollowStats({
//             followers_count: data.stats.followers_count || 0,
//             following_count: data.stats.following_count || 0
//           });
//           setIsFollowing(data.stats.is_following || false);
//         }

//         // Set user images
//         if (data.user?.profile_picture) {
//           const profileImageUrl = getImageUrl(data.user.profile_picture);
//           setUserProfileImage(profileImageUrl);
//         }

//         if (data.user?.cover_photo) {
//           const coverImageUrl = getImageUrl(data.user.cover_photo);
//           setUserCoverImage(coverImageUrl);
//         }

//         // Process recent content
//         if (data.recent_content) {
//           // Process marketplace listings
//           if (data.recent_content.listings) {
//             const processedListings = data.recent_content.listings.map(item => ({
//               ...item,
//               images: Array.isArray(item.images)
//                 ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//                 : []
//             }));
//             setMarketplacePosts(processedListings);
//           }

//           // Process posts
//           if (data.recent_content.posts) {
//             const processedPosts = data.recent_content.posts.map(item => ({
//               ...item,
//               image_url: getImageUrl(item.image_url || item.image)
//             }));
//             setTweets(processedPosts);
//           }

//           // Process videos
//           if (data.recent_content.videos) {
//             const processedVideos = data.recent_content.videos.map(item => ({
//               ...item,
//               video_url: getImageUrl(item.video_url || item.video),
//               thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//             }));
//             setUserVideos(processedVideos);
//           }
//         }

//         const lastUpdated = data.last_profile_update ? new Date(data.last_profile_update) : null;
//         if (lastUpdated && !userIdFromParams) {
//           const nextUpdateDate = new Date(lastUpdated);
//           nextUpdateDate.setDate(nextUpdateDate.getDate() + 90);
//           const today = new Date();
//           const daysLeft = Math.ceil((nextUpdateDate - today) / (1000 * 60 * 60 * 24));
//           if (daysLeft > 0) {
//             setDateLockMessage(`Birthday can be changed in ${daysLeft} days`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       setError('Failed to load user data');
//     }
//   };

//   const fetchFollowStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-stats/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         setFollowStats(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching follow stats:', error);
//       // Use stats from profile data if available
//       if (profileData.stats) {
//         setFollowStats({
//           followers_count: profileData.stats.followers_count || 0,
//           following_count: profileData.stats.following_count || 0
//         });
//       }
//     }
//   };

//   const checkFollowStatus = async () => {
//     if (!userIdFromParams) return;
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams;
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-status/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setIsFollowing(response.data.is_following);
//         setFollowId(response.data.follow_id);
//       }
//     } catch (error) {
//       console.error('Error checking follow status:', error);
//       // Use is_following from profile data if available
//       if (profileData.stats) {
//         setIsFollowing(profileData.stats.is_following || false);
//       }
//     }
//   };

//   const fetchFollowersList = async () => {
//     setLoadingFollowers(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/followers/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setFollowersList(response.data.followers || []);
//       }
//     } catch (error) {
//       console.error('Error fetching followers:', error);
//       setFollowersList([]);
//     } finally {
//       setLoadingFollowers(false);
//     }
//   };

//   const fetchFollowingList = async () => {
//     setLoadingFollowers(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/following/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setFollowingList(response.data.following || []);
//       }
//     } catch (error) {
//       console.error('Error fetching following:', error);
//       setFollowingList([]);
//     } finally {
//       setLoadingFollowers(false);
//     }
//   };

//   const handleFollow = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/follow/`, {
//         following_user: userIdFromParams
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 201) {
//         setIsFollowing(true);
//         setFollowId(response.data.follow_id);
//         await fetchFollowStats();
//         // Update profile data stats
//         setProfileData(prev => ({
//           ...prev,
//           stats: {
//             ...prev.stats,
//             followers_count: (prev.stats?.followers_count || 0) + 1,
//             is_following: true
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error following user:', error);
//       Alert.alert('Error', error.response?.data?.error || 'Failed to follow user');
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.post(`${API_ROUTE}/unfollow/`, {
//         following_user: userIdFromParams
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setIsFollowing(false);
//         setFollowId(null);
//         await fetchFollowStats();
//         // Update profile data stats
//         setProfileData(prev => ({
//           ...prev,
//           stats: {
//             ...prev.stats,
//             followers_count: Math.max(0, (prev.stats?.followers_count || 0) - 1),
//             is_following: false
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//       Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
//     }
//   };

//   const fetchUserPosts = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

//       // For other users' profiles, use the user-specific endpoints
//       if (userIdFromParams) {
//         // Fetch posts for other user
//         const tweetsEndpoint = `${API_ROUTE}/user-posts/${targetUserId}/`;
//         console.log('Fetching posts from:', tweetsEndpoint);
//         try {
//           const tweetsRes = await axios.get(tweetsEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let postsData = tweetsRes.data?.data || 
//                          (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
//                          tweetsRes.data?.results || tweetsRes.data || []);
//           const processedTweets = postsData.map(item => ({
//             ...item,
//             image_url: getImageUrl(item.image_url || item.image)
//           }));
//           setTweets(processedTweets);
//         } catch (error) {
//           console.error('Error fetching posts:', error);
//           // Use posts from profile data if available
//           if (profileData.recent_content?.posts) {
//             setTweets(profileData.recent_content.posts);
//           }
//         }

//         // Fetch videos for other user
//         const videosEndpoint = `${API_ROUTE}/user-shorts/${targetUserId}/`;
//         console.log('Fetching videos from:', videosEndpoint);
//         try {
//           const videosRes = await axios.get(videosEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let videosData = videosRes.data?.data || 
//                           (Array.isArray(videosRes.data) ? videosRes.data : 
//                           videosRes.data?.results || videosRes.data || []);
//           const processedVideos = videosData.map(item => ({
//             ...item,
//             video_url: getImageUrl(item.video_url || item.video),
//             thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//           }));
//           setUserVideos(processedVideos);
//         } catch (error) {
//           console.error('Error fetching videos:', error);
//           // Use videos from profile data if available
//           if (profileData.recent_content?.videos) {
//             setUserVideos(profileData.recent_content.videos);
//           }
//         }

//         // Fetch marketplace listings for other user
//         const marketplaceEndpoint = `${API_ROUTE}/user-listings/${targetUserId}/`;
//         console.log('Fetching listings from:', marketplaceEndpoint);
//         try {
//           const marketplaceRes = await axios.get(marketplaceEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let listingsData = marketplaceRes.data?.data || 
//                             (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
//                             marketplaceRes.data?.results || marketplaceRes.data || []);
//           const processedPosts = listingsData.map(item => ({
//             ...item,
//             images: Array.isArray(item.images)
//               ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//               : []
//           }));
//           setMarketplacePosts(processedPosts);
//         } catch (error) {
//           console.error('Error fetching listings:', error);
//           // Use listings from profile data if available
//           if (profileData.recent_content?.listings) {
//             setMarketplacePosts(profileData.recent_content.listings);
//           }
//         }
//       } else {
//         // Fetch own posts
//         const tweetsEndpoint = `${API_ROUTE}/my-posts/`;
//         try {
//           const tweetsRes = await axios.get(tweetsEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let postsData = tweetsRes.data?.data || 
//                          (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
//                          tweetsRes.data?.results || tweetsRes.data || []);
//           const processedTweets = postsData.map(item => ({
//             ...item,
//             image_url: getImageUrl(item.image_url || item.image)
//           }));
//           setTweets(processedTweets);
//         } catch (error) {
//           console.error('Error fetching own posts:', error);
//           setTweets([]);
//         }
//         const videosEndpoint = `${API_ROUTE}/my-shorts/`;
//         try {
//           const videosRes = await axios.get(videosEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let videosData = videosRes.data?.data || 
//                           (Array.isArray(videosRes.data) ? videosRes.data : 
//                           videosRes.data?.results || videosRes.data || []);
//           const processedVideos = videosData.map(item => ({
//             ...item,
//             video_url: getImageUrl(item.video_url || item.video),
//             thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//           }));
//           setUserVideos(processedVideos);
//         } catch (error) {
//           console.error('Error fetching own videos:', error);
//           setUserVideos([]);
//         }

//         // Fetch own marketplace posts
//         const marketplaceEndpoint = `${API_ROUTE}/my-listings/`;
//         try {
//           const marketplaceRes = await axios.get(marketplaceEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let listingsData = marketplaceRes.data?.data || 
//                             (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
//                             marketplaceRes.data?.results || marketplaceRes.data || []);
//           const processedPosts = listingsData.map(item => ({
//             ...item,
//             images: Array.isArray(item.images)
//               ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//               : []
//           }));
//           setMarketplacePosts(processedPosts);
//         } catch (error) {
//           console.error('Error fetching own listings:', error);
//           setMarketplacePosts([]);
//         }
//       }
//     } catch (error) {
//       console.error('Error in fetchUserPosts:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         await fetchUserData();
//         await fetchFollowStats();
//         await fetchUserPosts();
//         if (userIdFromParams) {
//           await checkFollowStatus();
//         }
//       } catch (error) {
//         setError('Failed to load data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (userIdFromParams || true) {
//       fetchData();
//     }
//   }, [userIdFromParams]);

//   const calculateAge = (dateString) => {
//     if (!dateString) return null;
//     const today = new Date();
//     const birthDate = new Date(dateString);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const FollowItem = ({ item, type }) => {
//     const [isFollowingUser, setIsFollowingUser] = useState(item.is_following || false);
//     const [currentUserId, setCurrentUserId] = useState(null);

//     useEffect(() => {
//       const getCurrentUser = async () => {
//         const userId = await AsyncStorage.getItem('userId');
//         setCurrentUserId(userId ? parseInt(userId) : null);
//       };
//       getCurrentUser();
//     }, []);

//     const handleFollowAction = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (isFollowingUser) {
//           await axios.post(`${API_ROUTE}/unfollow/`, {
//             following_user: item.id
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setIsFollowingUser(false);
//         } else {
//           await axios.post(`${API_ROUTE}/follow/`, {
//             following_user: item.id
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setIsFollowingUser(true);
//         }
//         // Refresh the lists
//         if (type === 'followers') await fetchFollowersList();
//         if (type === 'following') await fetchFollowingList();
//       } catch (error) {
//         console.error('Error in follow action:', error);
//       }
//     };

//     const showFollowButton = () => {
//       if (currentUserId && item.id === currentUserId) return false;
//       return true;
//     };



//     return (
//       <View style={[styles.followItem, { borderBottomColor: colors.border }]}>
//         <TouchableOpacity 
//           style={styles.followItemLeft}
//           onPress={() => {
//             if (type === 'followers') setFollowersModalVisible(false);
//             if (type === 'following') setFollowingModalVisible(false);
//             navigation.push('OtherUserProfile', { userId: item.id });
//           }}
//         >
//           <Image
//             source={item.profile_picture ? { uri: getImageUrl(item.profile_picture) } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//             style={styles.followAvatar}
//           />
//           <View style={styles.followInfo}>
//             <Text style={[styles.followName, { color: colors.text }]}>{item.name}</Text>
            
//             {item.username && (
//               <Text style={[styles.followUsername, { color: colors.textSecondary }]}>
//                 {`@${item.username || ''}`}
//               </Text>
//             )}
//             {item.bio && (
//               <Text style={[styles.followBio, { color: colors.textSecondary }]} numberOfLines={1}>
//                 {item.bio}
//               </Text>
//             )}
//           </View>
//         </TouchableOpacity>
        
//         {showFollowButton() && (
//           <TouchableOpacity
//             style={[
//               styles.followActionButton, 
//               isFollowingUser ? styles.followingButton : styles.followButtonn
//             ]}
//             onPress={handleFollowAction}
//           >
//             <Text style={[styles.followActionText, { color: isFollowingUser ? colors.text : '#fff' }]}>
//               {isFollowingUser ? 'Following' : type === 'followers' ? 'Follow Back' : 'Follow'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderVideo = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={[styles.videoCard, { backgroundColor: colors.card }]}
//         onPress={() => {
//           if (item.video_url || item.video) {
//             navigation.navigate('VideoPlayer', { 
//               videoUrl: item.video_url || item.video,
//               videoData: item 
//             });
//           }
//         }}
//         activeOpacity={0.9}
//       >
//         <View style={styles.videoThumbnailContainer}>
//           {item.thumbnail_url || item.thumbnail ? (
//             <Image
//               source={{ uri: item.thumbnail_url || item.thumbnail }}
//               style={styles.videoThumbnail}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={[styles.videoPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//               <Icon name="videocam-outline" size={40} color={colors.textSecondary} />
//             </View>
//           )}
//           <View style={styles.playButtonOverlay}>
//             <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//               <Icon name="play" size={24} color="#fff" />
//             </View>
//           </View>
//           {item.duration && (
//             <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
//               <Text style={styles.durationText}>{item.duration}</Text>
//             </View>
//           )}
//         </View>
//         <View style={styles.videoInfo}>
//           <Text style={[styles.videoCaption, { color: colors.text }]} numberOfLines={2}>
//             {item.caption || 'Untitled Video'}
//           </Text>
//           <View style={styles.videoStats}>
//             <View style={styles.statItem}>
//               <Icon name="heart-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.like_count || 0}
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Icon name="chatbubble-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.comment_count || 0}
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Icon name="eye-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.view_count || 0}
//               </Text>
//             </View>
//           </View>
//           <Text style={[styles.videoDate, { color: colors.textSecondary }]}>
//             {formatDate(item.created_at)}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderMarketplacePost = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.marketplaceCard, { backgroundColor: colors.card }]}
//       onPress={() => {
//         setSelectedProduct(item);
//         setProductModalVisible(true);
//       }}
//       activeOpacity={0.9}
//     >
//       <View style={styles.marketplaceImageContainer}>
//         {item.images?.[0]?.image ? (
//           <Image
//             source={{ uri: item.images[0].image }}
//             style={styles.marketplaceImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={[styles.marketplaceImagePlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//             <Icon name="cube-outline" size={40} color={colors.textSecondary} />
//           </View>
//         )}
//         {item.category_name && (
//           <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
//             <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.marketplaceContent}>
//         <Text style={[styles.marketplaceTitle, { color: colors.text }]} numberOfLines={2}>
//           {item.title || 'No Title'}
//         </Text>
//         <Text style={[styles.marketplacePrice, { color: colors.primary }]}>
//           ₦{parseFloat(item.price || 0).toLocaleString()}
//         </Text>
//         {item.location && (
//           <View style={styles.locationContainer}>
//             <Icon name="location-outline" size={12} color={colors.textSecondary} />
//             <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
//               {item.location}
//             </Text>
//           </View>
//         )}
//         <Text style={[styles.sellerName, { color: colors.textSecondary }]}>
//           {item.seller_name || 'Unknown Seller'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderTweet = ({ item }) => (
//     <View style={[styles.tweetCard, { backgroundColor: colors.card }]}>
//       <View style={styles.tweetHeader}>
//         <Image
//           source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//           style={styles.tweetAvatar}
//         />
//         <View style={styles.tweetHeaderInfo}>
//           <Text style={[styles.tweetUserName, { color: colors.text }]}>
//             {profileData.user?.name || 'User'}
//           </Text>
//           <Text style={[styles.tweetTimestamp, { color: colors.textSecondary }]}>
//             {formatDate(item.created_at)}
//           </Text>
//         </View>
//       </View>
//       <Text style={[styles.tweetContent, { color: colors.text }]}>
//         {item.content || 'No content'}
//       </Text>
//       {item.image_url && (
//         <TouchableOpacity onPress={() => setFullScreenImage({ visible: true, src: item.image_url, type: 'post' })}>
//           <Image
//             source={{ uri: item.image_url }}
//             style={styles.tweetImage}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       )}
//       <View style={styles.tweetActions}>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="heart-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.like_count || 0}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="chatbubble-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.comment_count || 0}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="repeat-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.share_count || 0}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const handleCatalogDataLoaded = (data) => {
//     setCatalogsCount(data.catalogs.length);
//   };

//   const handleViewAllCatalogs = () => {
  
//     setSelectedTab('catalogs');
//     navigation.navigate('AllCatalogs', { userId: userIdFromParams });
//   };

//   const renderProfileHeader = () => (
//     <Animated.View style={[styles.profileHeader, { backgroundColor: colors.card, opacity: fadeAnim }]}>
//       <TouchableOpacity
//         onPress={() => userCoverImage && setFullScreenImage({ visible: true, src: userCoverImage, type: 'cover' })}
//         activeOpacity={0.9}
//       >
//         <ImageBackground
//           source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
//           style={styles.coverImage}
//           resizeMode="cover"
//         >
//           {!userIdFromParams && !userCoverImage && (
//             <TouchableOpacity
//               style={[styles.addCoverButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)' }]}
//               onPress={() => handleImageSelection('cover')}
//             >
//               <Icon name="camera-outline" size={24} color="#fff" />
//               <Text style={styles.addCoverText}>Add Cover</Text>
//             </TouchableOpacity>
//           )}
//         </ImageBackground>
//       </TouchableOpacity>

//       <View style={styles.profileInfoContainer}>
//         <View style={styles.profileImageSection}>
//           <TouchableOpacity
//             onPress={() => userProfileImage && setFullScreenImage({ visible: true, src: userProfileImage, type: 'profile' })}
//             style={styles.profileImageWrapper}
//           >
//             <Image
//               source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//               style={[styles.profileImage, { borderColor: colors.card }]}
//             />
//             {!userIdFromParams && (
//               <TouchableOpacity
//                 style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
//                 onPress={() => handleImageSelection('profile')}
//               >
//                 <Icon name="camera" size={16} color="#fff" />
//               </TouchableOpacity>
//             )}
//           </TouchableOpacity>
          
//           <View style={styles.profileTextInfo}>
//             <View style={styles.nameRow}>
//               <Text style={[styles.profileName, { color: colors.text }]}>
//                 {profileData.user?.name || ''}
//               </Text>
//               {profileData.user?.is_verified && (
//                 <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
//               )}
//             </View>
//             <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
//               @{profileData.user?.username || profileData.user?.name.toLocaleString()}
//             </Text>
//           </View>
//         </View>

//         {profileData.user?.bio && (
//           <Text style={[styles.profileBio, { color: colors.text }]}>
//             {profileData.user.bio}
//           </Text>
//         )}

//         <View style={[styles.statsContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
//           <TouchableOpacity 
//             style={styles.statItem}
//             onPress={() => {
//               fetchFollowingList();
//               setFollowingModalVisible(true);
//             }}
//           >
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(followStats.following_count || profileData.stats?.following_count || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Following
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.statItem}
//             onPress={() => {
//               fetchFollowersList();
//               setFollowersModalVisible(true);
//             }}
//           >
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(followStats.followers_count || profileData.stats?.followers_count || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Followers
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(
//                 (profileData.stats?.posts_count || 0) + 
//                 (profileData.stats?.videos_count || 0) + 
//                 (profileData.stats?.listings_count || 0)
//               )}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Posts
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.actionButtons}>
//           {!userIdFromParams ? (
//             <>
//               <TouchableOpacity
//                 style={[styles.editButton, { backgroundColor: colors.primary }]}
//                 onPress={() => setIsEditing(true)}
//               >
//                 <Icon name="create-outline" size={18} color="#fff" />
//                 <Text style={styles.editButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.settingsButton, { borderColor: colors.border }]}
//                 onPress={() => navigation.navigate('Settings')}
//               >
//                 <Icon name="settings-outline" size={18} color={colors.text} />
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               {profileData.user?.active_mode === 'business' ? (
//                 <TouchableOpacity
//                   style={[styles.messageButton, { backgroundColor: colors.primary }]}
//                   onPress={() => navigation.navigate('BPrivateChat', {
//                     receiverId: userIdFromParams,
//                     name: profileData.user?.name,
//                     profile_image: userProfileImage
//                   })}
//                 >
//                   <Icon name="chatbubble-outline" size={18} color="#fff" />
//                   <Text style={styles.messageButtonText}>Message</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.messageButton, { backgroundColor: colors.primary }]}
//                   onPress={() => navigation.navigate('PrivateChat', {
//                     receiverId: userIdFromParams,
//                     name: profileData.user?.name,
//                     profile_image: userProfileImage
//                   })}
//                 >
//                   <Icon name="chatbubble-outline" size={18} color="#fff" />
//                   <Text style={styles.messageButtonText}>Message</Text>
//                 </TouchableOpacity>
//               )}
              
//               <TouchableOpacity
//                 style={[
//                   styles.followButton, 
//                   isFollowing ? styles.followingButton : { borderColor: colors.primary }
//                 ]}
//                 onPress={isFollowing ? handleUnfollow : handleFollow}
//               >
//                 <Icon 
//                   name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} 
//                   size={18} 
//                   color={isFollowing ? colors.text : colors.primary} 
//                 />
//                 <Text style={[
//                   styles.followButtonText, 
//                   { color: isFollowing ? colors.text : colors.primary }
//                 ]}>
//                   {isFollowing ? 'Unfollow' : 'Follow'}
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         <View style={styles.additionalInfo}>
//           {profileData.user?.country && (
//             <View style={styles.infoItem}>
//               <Icon name="location-outline" size={16} color={colors.textSecondary} />
//               <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//                 {profileData.user.country}
//               </Text>
//             </View>
//           )}
//           {profileData.user?.date_of_birth && (
//             <View style={styles.infoItem}>
//               <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
//               <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//                 Birthday: {formatDate(profileData.user.date_of_birth)}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </Animated.View>
//   );

//   //============== Catalog section display ==================

//   const renderCatalogSection = () => (
//     <View style={[styles.catalogSection, { backgroundColor: colors.card }]}>
//       {profileData.user?.active_mode === 'business' && (
//         <View style={styles.catalogHeader}>
//         <View style={styles.catalogTitleContainer}>
//           <Icon name="folder-outline" size={20} color={colors.primary} />
//           <Text style={[styles.catalogTitle, { color: colors.text }]}>Catalogs</Text>
//         </View>
//         {catalogsCount > 0 && (
//           <TouchableOpacity onPress={handleViewAllCatalogs} style={styles.viewAllButton}>
//             <Text style={[styles.viewAllText, { color: colors.primary }]}>See All Bellow</Text>
//             <Icon name="chevron-down" size={16} color={colors.primary} />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       )}
//       {profileData.user?.active_mode === 'business' && (
//         <CatalogComponent
//             ref={catalogRef}
//             userId={userIdFromParams}
//             businessId={userIdFromParams}
//             horizontal={true}
//             showHeader={false}
//             showBusinessInfo={false}
//             maxItems={5}
//             navigation={navigation}
//             containerStyle={styles.catalogContainer}
//             onDataLoaded={handleCatalogDataLoaded}
//         />

//       )}
       
     
//     </View>
//   );

//   const renderContent = () => {
//     switch (selectedTab) {
//       case 'catalogs':
//         return (
//           <View style={styles.fullCatalogSection}>
//             <CatalogComponent
//               ref={catalogRef}
//               userId={userIdFromParams}
//               businessId={userIdFromParams}
//               horizontal={false}
//               showHeader={false}
//               showBusinessInfo={false}
//               navigation={navigation}
//               containerStyle={styles.fullCatalogContainer}
//             />
//           </View>
//         );
      
//       case 'posts':
//         if (tweets.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="chatbubble-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't posted anything yet." : "You haven't posted anything yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="posts-list"
//             data={tweets}
//             renderItem={renderTweet}
//             keyExtractor={(item) => `posts-${item.id}`}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       case 'videos':
//         if (userVideos.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="videocam-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't uploaded any videos yet." : "You haven't uploaded any videos yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="videos-list"
//             data={userVideos}
//             renderItem={renderVideo}
//             keyExtractor={(item) => `videos-${item.id}`}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       case 'marketplace':
//         if (marketplacePosts.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="cart-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't listed any items yet." : "You haven't listed any items yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="marketplace-grid"
//             data={marketplacePosts}
//             renderItem={renderMarketplacePost}
//             keyExtractor={(item) => `marketplace-${item.id}`}
//             numColumns={2}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

//       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
//           {profileData.user?.name || 'Profile'}
//         </Text>
//         <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
//           <Icon name="close" size={24} color={colors.text} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         {renderProfileHeader()}
        
//         {/* Catalog Section - Displayed prominently at the top */}
//         {renderCatalogSection()}
        
//         {/* Tab Navigation */}
//         <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'posts' && styles.tabActive, selectedTab === 'posts' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('posts')}
//           >
//             <Icon name="chatbubble-outline" size={20} color={selectedTab === 'posts' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'posts' ? colors.primary : colors.textSecondary }]}>
//               Posts ({tweets.length || profileData.stats?.posts_count || 0})
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'videos' && styles.tabActive, selectedTab === 'videos' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('videos')}
//           >
//             <Icon name="videocam-outline" size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'videos' ? colors.primary : colors.textSecondary }]}>
//               Videos ({userVideos.length || profileData.stats?.videos_count || 0})
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'marketplace' && styles.tabActive, selectedTab === 'marketplace' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('marketplace')}
//           >
//             <Icon name="cart-outline" size={20} color={selectedTab === 'marketplace' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'marketplace' ? colors.primary : colors.textSecondary }]}>
//               Listings ({marketplacePosts.length || profileData.stats?.listings_count || 0})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {renderContent()}
//       </ScrollView>

//       <Modal visible={fullScreenImage.visible} transparent animationType="fade" onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
//         <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
//           <TouchableOpacity style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
//             <Icon name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//           <Image source={{ uri: fullScreenImage.src }} style={styles.fullScreenImage} resizeMode="contain" />
//           <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
//             <Text style={styles.fullScreenLabelText}>
//               {fullScreenImage.type === 'profile' ? 'Profile Picture' : 
//                fullScreenImage.type === 'cover' ? 'Cover Photo' : 'Post Image'}
//             </Text>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//         <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} activeOpacity={1} onPress={() => setModalVisible(false)}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//             {!userIdFromParams && (
//               <>
//                 <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); setIsEditing(true); }}>
//                   <Icon name="create-outline" size={22} color={colors.text} />
//                   <Text style={[styles.modalOptionText, { color: colors.text }]}>Edit Profile</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.modalOption} onPress={() => navigation.navigate('Settings')}>
//                   <Icon name="settings-outline" size={22} color={colors.text} />
//                   <Text style={[styles.modalOptionText, { color: colors.text }]}>Settings</Text>
//                 </TouchableOpacity>
//                 <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
//               </>
//             )}
//             <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
//               <Icon name="close" size={22} color={colors.text} />
//               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <Modal visible={followersModalVisible} transparent animationType="slide" onRequestClose={() => setFollowersModalVisible(false)}>
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//           <View style={[styles.followModal, { backgroundColor: colors.card }]}>
//             <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
//               <Text style={[styles.followModalTitle, { color: colors.text }]}>Followers</Text>
//               <TouchableOpacity onPress={() => setFollowersModalVisible(false)}>
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>
//             {loadingFollowers ? (
//               <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
//             ) : (
//               <FlatList
//                 data={followersList}
//                 renderItem={({ item }) => <FollowItem item={item} type="followers" />}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={styles.followList}
//                 ListEmptyComponent={
//                   <View style={styles.emptyFollow}>
//                     <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>No followers yet</Text>
//                   </View>
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={followingModalVisible} transparent animationType="slide" onRequestClose={() => setFollowingModalVisible(false)}>
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//           <View style={[styles.followModal, { backgroundColor: colors.card }]}>
//             <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
//               <Text style={[styles.followModalTitle, { color: colors.text }]}>Following</Text>
//               <TouchableOpacity onPress={() => setFollowingModalVisible(false)}>
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>
//             {loadingFollowers ? (
//               <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
//             ) : (
//               <FlatList
//                 data={followingList}
//                 renderItem={({ item }) => <FollowItem item={item} type="following" />}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={styles.followList}
//                 ListEmptyComponent={
//                   <View style={styles.emptyFollow}>
//                     <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>Not following anyone yet</Text>
//                   </View>
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1 
//   },
  
//   loadingContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   loadingText: { 
//     marginTop: 16, 
//     fontSize: 16, 
//     fontWeight: '500' 
//   },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingHorizontal: 16, 
//     paddingVertical: 12, 
//     borderBottomWidth: 1 
//   },
//   headerButton: { 
//     padding: 8 
//   },
//   headerTitle: { 
//     fontSize: 18, 
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'center'
//   },
//   scrollView: { 
//     flex: 1 
//   },
//   scrollContent: { 
//     flexGrow: 1 
//   },
//   profileHeader: { 
//     marginBottom: 8 
//   },
//   coverImage: { 
//     width: '100%', 
//     height: 180, 
//     justifyContent: 'flex-end', 
//     alignItems: 'center' 
//   },
//   addCoverButton: { 
//     paddingHorizontal: 16, 
//     paddingVertical: 10, 
//     borderRadius: 20, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 16,
//   },
//   addCoverText: { 
//     color: '#fff', 
//     marginLeft: 8, 
//     fontSize: 14, 
//     fontWeight: '500'
//   },
//   profileInfoContainer: { 
//     padding: 20, 
//     marginTop:-40
//   },
//   profileImageSection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 20 
//   },
//   profileImageWrapper: { 
//     position: 'relative', 
//     marginRight: 16 
//   },
//   profileImage: { 
//     width: 100, 
//     height: 100, 
//     borderRadius: 50, 
//     borderWidth: 4, 
//     backgroundColor: '#f0f0f0' 
//   },
//   changePhotoButton: { 
//     position: 'absolute', 
//     bottom: 0, 
//     right: 0, 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     borderWidth: 3, 
//     borderColor: '#fff', 
//     elevation: 3, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.2, 
//     shadowRadius: 4 
//   },
//   profileTextInfo: { 
//     flex: 1 
//   },
//   nameRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap' 
//   },
//   profileName: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     marginRight: 8, 
//   },
//   verifiedBadge: { 
//     marginLeft: 4 
//   },
//   profileUsername: { 
//     fontSize: 16, 
//     marginTop: 4 
//   },
//   modeBadge: { 
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8, 
//     paddingVertical: 4, 
//     borderRadius: 4, 
//     marginTop: 4 
//   },
//   modeText: { 
//     fontSize: 11, 
//     fontWeight: '500' 
//   },
//   profileBio: { 
//     fontSize: 15, 
//     lineHeight: 22, 
//     marginBottom: 20 
//   },
//   statsContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-around', 
//     marginBottom: 24, 
//     paddingVertical: 16, 
//     borderTopWidth: 1, 
//     borderBottomWidth: 1 
//   },
//   statItem: { 
//     alignItems: 'center', 
//     flex: 1 
//   },
//   statNumber: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     marginBottom: 6 
//   },
//   statLabel: { 
//     fontSize: 13 
//   },
//   actionButtons: { 
//     flexDirection: 'row', 
//     gap: 12, 
//     marginBottom: 20 
//   },
//   editButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     gap: 8, 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   editButtonText: { 
//     color: '#fff', 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   settingsButton: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: 26, 
//     borderWidth: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   messageButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     gap: 8, 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   messageButtonText: { 
//     color: '#fff', 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   followButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     borderWidth: 1.5,
//     gap: 8 
//   },
//   followButtonn: {
//     backgroundColor: '#0653f8ff', 
//     borderWidth: 0 
//   },
//   followingButton: { 
//     backgroundColor: '#E1E1E1', 
//     borderWidth: 0 
//   },
//   followButtonText: { 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   additionalInfo: { 
//     gap: 12 
//   },
//   infoItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10 
//   },
//   infoText: { 
//     fontSize: 14, 
//     flex: 1 
//   },
//   ageText: { 
//     fontSize: 13, 
//     opacity: 0.8 
//   },
//   // Catalog Section Styles
//   catalogSection: {
//     marginVertical: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: 'rgba(0,0,0,0.05)',
//   },
//   catalogHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   catalogTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   catalogTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   viewAllText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   catalogContainer: {
//     minHeight: 180,
//   },
//   fullCatalogSection: {
//     flex: 1,
//     minHeight: 400,
//     padding: 8,
//   },
//   fullCatalogContainer: {
//     flex: 1,
//   },
//   tabContainer: { 
//     flexDirection: 'row', 
//     marginTop: 8,
//     paddingHorizontal: 8
//   },
//   tab: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 12, 
//     gap: 6, 
//     borderBottomWidth: 2, 
//     borderBottomColor: 'transparent' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontWeight: '500' 
//   },
//   contentList: { 
//     padding: 8 
//   },
//   marketplaceCard: { 
//     flex: 1, 
//     margin: 6, 
//     borderRadius: 12, 
//     overflow: 'hidden', 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   marketplaceImageContainer: { 
//     height: 140,
//     position: 'relative'
//   },
//   marketplaceImage: { 
//     width: '100%', 
//     height: '100%' 
//   },
//   marketplaceImagePlaceholder: { 
//     width: '100%', 
//     height: '100%', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   categoryBadge: { 
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4 
//   },
//   categoryBadgeText: { 
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600' 
//   },
//   marketplaceContent: { 
//     padding: 12 
//   },
//   marketplaceTitle: { 
//     fontSize: 14, 
//     fontWeight: '600', 
//     marginBottom: 6 
//   },
//   marketplacePrice: { 
//     fontSize: 15, 
//     fontWeight: 'bold' 
//   },
//   locationContainer: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginTop: 4 
//   },
//   locationText: { 
//     fontSize: 11, 
//     marginLeft: 4 
//   },
//   sellerName: { 
//     fontSize: 11, 
//     marginTop: 4 
//   },
//   tweetCard: { 
//     padding: 16, 
//     borderRadius: 12, 
//     margin: 8, 
//     elevation: 1, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 1 }, 
//     shadowOpacity: 0.05, 
//     shadowRadius: 2 
//   },
//   tweetHeader: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 12 
//   },
//   tweetAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20, 
//     marginRight: 12 
//   },
//   tweetHeaderInfo: { 
//     flex: 1 
//   },
//   tweetUserName: { 
//     fontSize: 15, 
//     fontWeight: '600', 
//     marginBottom: 2 
//   },
//   tweetTimestamp: { 
//     fontSize: 12 
//   },
//   tweetContent: { 
//     fontSize: 15, 
//     lineHeight: 22, 
//     marginBottom: 12 
//   },
//   tweetImage: { 
//     width: '100%', 
//     height: 200, 
//     borderRadius: 8 
//   },
//   tweetActions: { 
//     flexDirection: 'row', 
//     marginTop: 12, 
//     paddingTop: 12, 
//     borderTopWidth: 1, 
//     borderTopColor: 'rgba(0,0,0,0.05)' 
//   },
//   tweetAction: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginRight: 24 
//   },
//   tweetActionText: { 
//     fontSize: 13, 
//     marginLeft: 6 
//   },
//   videoCard: {
//     margin: 8,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   videoThumbnailContainer: {
//     position: 'relative',
//     height: 180,
//     backgroundColor: '#f0f0f0',
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   videoPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButtonOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   durationBadge: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   videoInfo: {
//     padding: 12,
//   },
//   videoCaption: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   videoStats: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   statText: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   videoDate: {
//     fontSize: 11,
//   },
//   emptyContainer: { 
//     padding: 40, 
//     alignItems: 'center', 
//     borderRadius: 12, 
//     margin: 16, 
//     elevation: 1, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 1 }, 
//     shadowOpacity: 0.05, 
//     shadowRadius: 2 
//   },
//   emptyText: { 
//     marginTop: 16, 
//     fontSize: 16, 
//     textAlign: 'center', 
//     lineHeight: 24 
//   },
//   fullScreenModal: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   fullScreenClose: { 
//     position: 'absolute', 
//     top: Platform.OS === 'ios' ? 60 : 40, 
//     right: 20, 
//     zIndex: 1, 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   fullScreenImage: { 
//     width: screenWidth, 
//     height: screenHeight * 0.7 
//   },
//   fullScreenLabel: { 
//     position: 'absolute', 
//     bottom: 40, 
//     paddingHorizontal: 20, 
//     paddingVertical: 10, 
//     borderRadius: 20 
//   },
//   fullScreenLabelText: { 
//     color: '#fff', 
//     fontSize: 14, 
//     fontWeight: '500' 
//   },
//   modalOverlay: { 
//     flex: 1, 
//     justifyContent: 'flex-end' 
//   },
//   modalContent: { 
//     borderTopLeftRadius: 20, 
//     borderTopRightRadius: 20, 
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20 
//   },
//   modalOption: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 18, 
//     gap: 16 
//   },
//   modalOptionText: { 
//     fontSize: 16, 
//     fontWeight: '500', 
//     flex: 1 
//   },
//   modalDivider: { 
//     height: 1, 
//     marginHorizontal: 16 
//   },
//   followModal: { 
//     height: '80%', 
//     marginTop: 'auto', 
//     borderTopLeftRadius: 20, 
//     borderTopRightRadius: 20, 
//     overflow: 'hidden' 
//   },
//   followModalHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     padding: 16, 
//     borderBottomWidth: 1 
//   },
//   followModalTitle: { 
//     fontSize: 18, 
//     fontWeight: '600' 
//   },
//   followList: { 
//     padding: 16 
//   },
//   followItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingVertical: 12, 
//     borderBottomWidth: 1 
//   },
//   followItemLeft: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flex: 1 
//   },
//   followAvatar: { 
//     width: 50, 
//     height: 50, 
//     borderRadius: 25, 
//     marginRight: 12 
//   },
//   followInfo: { 
//     flex: 1 
//   },
//   followName: { 
//     fontSize: 16, 
//     fontWeight: '600', 
//     marginBottom: 2 
//   },
//   followUsername: { 
//     fontSize: 13 
//   },
//   followBio: { 
//     fontSize: 12, 
//     marginTop: 2 
//   },
//   followActionButton: { 
//     paddingHorizontal: 16, 
//     paddingVertical: 8, 
//     borderRadius: 20, 
//     minWidth: 100, 
//     alignItems: 'center' 
//   },
//   followActionText: { 
//     fontSize: 14, 
//     fontWeight: '600' 
//   },
//   followLoader: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   emptyFollow: { 
//     padding: 40, 
//     alignItems: 'center' 
//   },
//   emptyFollowText: { 
//     fontSize: 16 
//   }
// });

// export default UserProfile;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   Platform,
//   ActivityIndicator,
//   Dimensions,
//   StatusBar,
//   FlatList,
//   Animated,
//   KeyboardAvoidingView,
//   ImageBackground,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
// import { useTheme } from '../../src/context/ThemeContext';
// import CatalogComponent from '../../showa_business/OthersUserCatalog';


// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const UserProfile = ({ navigation, route }) => {
//   const { colors, isDark } = useTheme();
//   const userIdFromParams = route.params?.userId;
  
//   const [selectedTab, setSelectedTab] = useState('posts');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [productModalVisible, setProductModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isVideoPlaying, setIsVideoPlaying] = useState({});
//   const [fullScreenImage, setFullScreenImage] = useState({
//     visible: false,
//     src: '',
//     type: 'profile',
//   });
//   const [followersModalVisible, setFollowersModalVisible] = useState(false);
//   const [followingModalVisible, setFollowingModalVisible] = useState(false);
//   const [followersList, setFollowersList] = useState([]);
//   const [followingList, setFollowingList] = useState([]);
//   const [loadingFollowers, setLoadingFollowers] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followId, setFollowId] = useState(null);
//   const [optionsModalVisible, setOptionsModalVisible] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [reportModalVisible, setReportModalVisible] = useState(false);
//   const [reportLoading, setReportLoading] = useState(false);
//   const [blockModalVisible, setBlockModalVisible] = useState(false);
//   const [blockLoading, setBlockLoading] = useState(false);
//   const [isBlockedByMe, setIsBlockedByMe] = useState(false);

//   const [profileData, setProfileData] = useState({
//     user: null,
//     recent_content: {
//       listings: [],
//       posts: [],
//       videos: []
//     },
//     stats: {
//       followers_count: 0,
//       following_count: 0,
//       is_following: false,
//       listings_count: 0,
//       posts_count: 0,
//       videos_count: 0
//     }
//   });

//   const [userProfileImage, setUserProfileImage] = useState('');
//   const [userCoverImage, setUserCoverImage] = useState('');
//   const [businessProfile, setBusinessProfile] = useState(null);
//   const [catalogData, setCatalogData] = useState([]);
//   const [showBusinessInfo, setShowBusinessInfo] = useState(false);
//   const [businessLoading, setBusinessLoading] = useState(false);
//   const [followStats, setFollowStats] = useState({
//     followers_count: 0,
//     following_count: 0
//   });

//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [coverPhotoFile, setCoverPhotoFile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [dateLockMessage, setDateLockMessage] = useState('');
//   const [catalogsCount, setCatalogsCount] = useState(0);

//   const scrollViewRef = useRef(null);
//   const catalogRef = useRef(null);


//   const checkIfUserIsBlocked = async () => {
//     if (!userIdFromParams) return;
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(
//         `${API_ROUTE}/check-block/${userIdFromParams}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.status === 200) {
//         setIsBlocked(response.data.is_blocked); 
//       }
//     } catch (error) {
//       console.error('Error checking block status:', error);
//     }
//   };

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const getImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
//       return null;
//     }
    
//     if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
//       let url = imagePath;
//       if (url.includes('api.showapp.ngmedia')) {
//         url = url.replace('api.showapp.ngmedia', 'api.showapp.ng/media');
//       }
//       if (url.startsWith('http://')) {
//         url = url.replace('http://', 'https://');
//       }
//       if (url.includes('api.showapp.ng/') && 
//           !url.includes('api.showapp.ng/media/') &&
//           (url.includes('profile_pics') || url.includes('cover_photos') ||
//            url.includes('catalog_images') || url.includes('marketplace_images') ||
//            url.includes('post_images'))) {
//         url = url.replace('api.showapp.ng/', 'api.showapp.ng/media/');
//       }
//       return url;
//     }
    
//     if (typeof imagePath === 'object') {
//       if (imagePath.image) return getImageUrl(imagePath.image);
//       if (imagePath.url) return getImageUrl(imagePath.url);
//       if (imagePath.media) return getImageUrl(imagePath.media);
//       return null;
//     }
    
//     if (typeof imagePath === 'string') {
//       let cleanPath = imagePath;
//       if (cleanPath.startsWith('/')) {
//         cleanPath = cleanPath.substring(1);
//       }
//       if (!cleanPath.startsWith('media/')) {
//         if (cleanPath.includes('profile_pics') || cleanPath.includes('cover_photos') ||
//             cleanPath.includes('catalog_images') || cleanPath.includes('marketplace_images') ||
//             cleanPath.includes('post_images') || cleanPath.includes('image_') ||
//             cleanPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//           cleanPath = 'media/' + cleanPath;
//         }
//       }
//       let baseUrl = API_ROUTE_IMAGE;
//       if (!baseUrl.endsWith('/')) {
//         baseUrl = baseUrl + '/';
//       }
//       return `${baseUrl}${cleanPath}`;
//     }
//     return null;
//   };

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

//       if (!token) {
//         navigation.navigate('Login');
//         return;
//       }

//       let response;
//       try {
//         response = await axios.get(`${API_ROUTE}/users/${targetUserId}/profile/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         console.log('User profile fetch response:', response.data);
//       } catch (error) {
//         // Fallback to profile profile
//         if (!userIdFromParams) {
//           response = await axios.get(`${API_ROUTE}/profile/`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         }
//       }

//       if (response?.status === 200) {
//         const data = response.data;
//         setProfileData(data);
        
//         // Update follow stats from the data
//         if (data.stats) {
//           setFollowStats({
//             followers_count: data.stats.followers_count || 0,
//             following_count: data.stats.following_count || 0
//           });
//           setIsFollowing(data.stats.is_following || false);
//         }

//         // Set user images
//         if (data.user?.profile_picture) {
//           const profileImageUrl = getImageUrl(data.user.profile_picture);
//           setUserProfileImage(profileImageUrl);
//         }

//         if (data.user?.cover_photo) {
//           const coverImageUrl = getImageUrl(data.user.cover_photo);
//           setUserCoverImage(coverImageUrl);
//         }

//         // Process recent content
//         if (data.recent_content) {
//           // Process marketplace listings
//           if (data.recent_content.listings) {
//             const processedListings = data.recent_content.listings.map(item => ({
//               ...item,
//               images: Array.isArray(item.images)
//                 ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//                 : []
//             }));
//             setMarketplacePosts(processedListings);
//           }

//           // Process posts
//           if (data.recent_content.posts) {
//             const processedPosts = data.recent_content.posts.map(item => ({
//               ...item,
//               image_url: getImageUrl(item.image_url || item.image)
//             }));
//             setTweets(processedPosts);
//           }

//           // Process videos
//           if (data.recent_content.videos) {
//             const processedVideos = data.recent_content.videos.map(item => ({
//               ...item,
//               video_url: getImageUrl(item.video_url || item.video),
//               thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//             }));
//             setUserVideos(processedVideos);
//           }
//         }

//         const lastUpdated = data.last_profile_update ? new Date(data.last_profile_update) : null;
//         if (lastUpdated && !userIdFromParams) {
//           const nextUpdateDate = new Date(lastUpdated);
//           nextUpdateDate.setDate(nextUpdateDate.getDate() + 90);
//           const today = new Date();
//           const daysLeft = Math.ceil((nextUpdateDate - today) / (1000 * 60 * 60 * 24));
//           if (daysLeft > 0) {
//             setDateLockMessage(`Birthday can be changed in ${daysLeft} days`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       setError('Failed to load user data');
//     }
//   };

//   const fetchFollowStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-stats/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         setFollowStats(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching follow stats:', error);
//       // Use stats from profile data if available
//       if (profileData.stats) {
//         setFollowStats({
//           followers_count: profileData.stats.followers_count || 0,
//           following_count: profileData.stats.following_count || 0
//         });
//       }
//     }
//   };

//   const checkFollowStatus = async () => {
//     if (!userIdFromParams) return;
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams;
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-status/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setIsFollowing(response.data.is_following);
//         setFollowId(response.data.follow_id);
//       }
//     } catch (error) {
//       console.error('Error checking follow status:', error);
//       // Use is_following from profile data if available
//       if (profileData.stats) {
//         setIsFollowing(profileData.stats.is_following || false);
//       }
//     }
//   };

//   const fetchFollowersList = async () => {
//     setLoadingFollowers(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/followers/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setFollowersList(response.data.followers || []);
//       }
//     } catch (error) {
//       console.error('Error fetching followers:', error);
//       setFollowersList([]);
//     } finally {
//       setLoadingFollowers(false);
//     }
//   };

//   const fetchFollowingList = async () => {
//     setLoadingFollowers(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
//       const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/following/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setFollowingList(response.data.following || []);
//       }
//     } catch (error) {
//       console.error('Error fetching following:', error);
//       setFollowingList([]);
//     } finally {
//       setLoadingFollowers(false);
//     }
//   };

//   const handleFollow = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/follow/`, {
//         following_user: userIdFromParams
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 201) {
//         setIsFollowing(true);
//         setFollowId(response.data.follow_id);
//         await fetchFollowStats();
//         // Update profile data stats
//         setProfileData(prev => ({
//           ...prev,
//           stats: {
//             ...prev.stats,
//             followers_count: (prev.stats?.followers_count || 0) + 1,
//             is_following: true
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error following user:', error);
//       Alert.alert('Error', error.response?.data?.error || 'Failed to follow user');
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.post(`${API_ROUTE}/unfollow/`, {
//         following_user: userIdFromParams
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.status === 200) {
//         setIsFollowing(false);
//         setFollowId(null);
//         await fetchFollowStats();
//         // Update profile data stats
//         setProfileData(prev => ({
//           ...prev,
//           stats: {
//             ...prev.stats,
//             followers_count: Math.max(0, (prev.stats?.followers_count || 0) - 1),
//             is_following: false
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//       Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
//     }
//   };

//   const fetchUserPosts = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

//       // For other users' profiles, use the user-specific endpoints
//       if (userIdFromParams) {
//         // Fetch posts for other user
//         const tweetsEndpoint = `${API_ROUTE}/user-posts/${targetUserId}/`;
//         console.log('Fetching posts from:', tweetsEndpoint);
//         try {
//           const tweetsRes = await axios.get(tweetsEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let postsData = tweetsRes.data?.data || 
//                          (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
//                          tweetsRes.data?.results || tweetsRes.data || []);
//           const processedTweets = postsData.map(item => ({
//             ...item,
//             image_url: getImageUrl(item.image_url || item.image)
//           }));
//           setTweets(processedTweets);
//         } catch (error) {
//           console.error('Error fetching posts:', error);
//           // Use posts from profile data if available
//           if (profileData.recent_content?.posts) {
//             setTweets(profileData.recent_content.posts);
//           }
//         }

//         // Fetch videos for other user
//         const videosEndpoint = `${API_ROUTE}/user-shorts/${targetUserId}/`;
//         console.log('Fetching videos from:', videosEndpoint);
//         try {
//           const videosRes = await axios.get(videosEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let videosData = videosRes.data?.data || 
//                           (Array.isArray(videosRes.data) ? videosRes.data : 
//                           videosRes.data?.results || videosRes.data || []);
//           const processedVideos = videosData.map(item => ({
//             ...item,
//             video_url: getImageUrl(item.video_url || item.video),
//             thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//           }));
//           setUserVideos(processedVideos);
//         } catch (error) {
//           console.error('Error fetching videos:', error);
//           // Use videos from profile data if available
//           if (profileData.recent_content?.videos) {
//             setUserVideos(profileData.recent_content.videos);
//           }
//         }

//         // Fetch marketplace listings for other user
//         const marketplaceEndpoint = `${API_ROUTE}/user-listings/${targetUserId}/`;
//         console.log('Fetching listings from:', marketplaceEndpoint);
//         try {
//           const marketplaceRes = await axios.get(marketplaceEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let listingsData = marketplaceRes.data?.data || 
//                             (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
//                             marketplaceRes.data?.results || marketplaceRes.data || []);
//           const processedPosts = listingsData.map(item => ({
//             ...item,
//             images: Array.isArray(item.images)
//               ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//               : []
//           }));
//           setMarketplacePosts(processedPosts);
//         } catch (error) {
//           console.error('Error fetching listings:', error);
//           // Use listings from profile data if available
//           if (profileData.recent_content?.listings) {
//             setMarketplacePosts(profileData.recent_content.listings);
//           }
//         }
//       } else {
//         // Fetch own posts
//         const tweetsEndpoint = `${API_ROUTE}/my-posts/`;
//         try {
//           const tweetsRes = await axios.get(tweetsEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let postsData = tweetsRes.data?.data || 
//                          (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
//                          tweetsRes.data?.results || tweetsRes.data || []);
//           const processedTweets = postsData.map(item => ({
//             ...item,
//             image_url: getImageUrl(item.image_url || item.image)
//           }));
//           setTweets(processedTweets);
//         } catch (error) {
//           console.error('Error fetching own posts:', error);
//           setTweets([]);
//         }
//         const videosEndpoint = `${API_ROUTE}/my-shorts/`;
//         try {
//           const videosRes = await axios.get(videosEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let videosData = videosRes.data?.data || 
//                           (Array.isArray(videosRes.data) ? videosRes.data : 
//                           videosRes.data?.results || videosRes.data || []);
//           const processedVideos = videosData.map(item => ({
//             ...item,
//             video_url: getImageUrl(item.video_url || item.video),
//             thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
//           }));
//           setUserVideos(processedVideos);
//         } catch (error) {
//           console.error('Error fetching own videos:', error);
//           setUserVideos([]);
//         }

//         // Fetch own marketplace posts
//         const marketplaceEndpoint = `${API_ROUTE}/my-listings/`;
//         try {
//           const marketplaceRes = await axios.get(marketplaceEndpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           let listingsData = marketplaceRes.data?.data || 
//                             (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
//                             marketplaceRes.data?.results || marketplaceRes.data || []);
//           const processedPosts = listingsData.map(item => ({
//             ...item,
//             images: Array.isArray(item.images)
//               ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
//               : []
//           }));
//           setMarketplacePosts(processedPosts);
//         } catch (error) {
//           console.error('Error fetching own listings:', error);
//           setMarketplacePosts([]);
//         }
//       }
//     } catch (error) {
//       console.error('Error in fetchUserPosts:', error);
//     }
//   };

//   const handleReportUser = async () => {
//   if (!reportReason) {
//     Alert.alert('Reason Required', 'Please select a reason for reporting this user.');
//     return;
//   }

//   setReportLoading(true);
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.post(
//       `${API_ROUTE}/report/${userIdFromParams}/`,
//       {
//         reason: reportReason.trim(), 
        
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (response.status === 200 || response.status === 201) {
//       Alert.alert(
//         'Report Submitted',
//         'Thank you for reporting. We will review this user and take appropriate action.'
//       );
//       setReportModalVisible(false);
//       setReportReason('');
//       // setReportDescription('');
//       // setReportEvidence([]);
//     }
//   } catch (error) {
//     console.error('Error reporting user:', error);

//     if (error.response?.status === 400 && error.response.data?.errors?.reason) {
//       Alert.alert('Invalid Reason', error.response.data.errors.reason);
//     } else if (error.response?.status === 400 && error.response.data?.error) {
//       Alert.alert('Error', error.response.data.error);
//     } else {
//       Alert.alert('Error', 'Failed to submit report. Please try again.');
//     }
//   } finally {
//     setReportLoading(false);
//   }
// };

//   const handleBlockUser = async () => {
//     setBlockLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(
//         `${API_ROUTE}/block/${userIdFromParams}/`,
//         {
//           blocked_user_id: userIdFromParams,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setIsBlocked(true);
//         Alert.alert(
//           'User Blocked',
//           'You have successfully blocked this user. They will no longer be able to interact with you.',
//           [
//             {
//               text: 'OK',
//               onPress: () => navigation.goBack(),
//             },
//           ]
//         );
//         setBlockModalVisible(false);
//       }
//     } catch (error) {
//       console.error('Error blocking user:', error);
//       Alert.alert('Error', 'Failed to block user. Please try again.');
//     } finally {
//       setBlockLoading(false);
//     }
//   };

//   const handleUnblockUser = async () => {
//     setBlockLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(
//         `${API_ROUTE}/unblock-user/${userIdFromParams}/`, 
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.status === 200) {
//         setIsBlocked(false);
//         Alert.alert('User Unblocked', 'You have successfully unblocked this user.');
//         setOptionsModalVisible(false);
//       }
//     } catch (error) {
//       console.error('Error unblocking user:', error);
//       Alert.alert('Error', 'Failed to unblock user. Please try again.');
//     } finally {
//       setBlockLoading(false);
//     }
//   };

//   const refreshAllData = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         fetchUserData(),
//         fetchFollowStats(),
//         fetchUserPosts(),
//         userIdFromParams && checkFollowStatus()
//       ]);
//       // Refresh catalog if available
//       if (catalogRef.current?.refreshCatalogs) {
//         catalogRef.current.refreshCatalogs();
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         await fetchUserData();
//         await fetchFollowStats();
//         await fetchUserPosts();
//         if (userIdFromParams) {
//           await checkFollowStatus();
//           await checkIfUserIsBlocked();
//         }
//       } catch (error) {
//         setError('Failed to load data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (userIdFromParams || true) {
//       fetchData();
//     }
//   }, [userIdFromParams]);

//   const calculateAge = (dateString) => {
//     if (!dateString) return null;
//     const today = new Date();
//     const birthDate = new Date(dateString);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const FollowItem = ({ item, type }) => {
//     const [isFollowingUser, setIsFollowingUser] = useState(item.is_following || false);
//     const [currentUserId, setCurrentUserId] = useState(null);

//     useEffect(() => {
//       const getCurrentUser = async () => {
//         const userId = await AsyncStorage.getItem('userId');
//         setCurrentUserId(userId ? parseInt(userId) : null);
//       };
//       getCurrentUser();
//     }, []);

//     const handleFollowAction = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (isFollowingUser) {
//           await axios.post(`${API_ROUTE}/unfollow/`, {
//             following_user: item.id
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setIsFollowingUser(false);
//         } else {
//           await axios.post(`${API_ROUTE}/follow/`, {
//             following_user: item.id
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setIsFollowingUser(true);
//         }
//         // Refresh the lists
//         if (type === 'followers') await fetchFollowersList();
//         if (type === 'following') await fetchFollowingList();
//       } catch (error) {
//         console.error('Error in follow action:', error);
//       }
//     };

//     const showFollowButton = () => {
//       if (currentUserId && item.id === currentUserId) return false;
//       return true;
//     };

//     return (
//       <View style={[styles.followItem, { borderBottomColor: colors.border }]}>
//         <TouchableOpacity 
//           style={styles.followItemLeft}
//           onPress={() => {
//             if (type === 'followers') setFollowersModalVisible(false);
//             if (type === 'following') setFollowingModalVisible(false);
//             navigation.push('OtherUserProfile', { userId: item.id });
//           }}
//         >
//           <Image
//             source={item.profile_picture ? { uri: getImageUrl(item.profile_picture) } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//             style={styles.followAvatar}
//           />
//           <View style={styles.followInfo}>
//             <Text style={[styles.followName, { color: colors.text }]}>{item.name}</Text>
            
//             {item.username && (
//               <Text style={[styles.followUsername, { color: colors.textSecondary }]}>
//                 {`@${item.username || ''}`}
//               </Text>
//             )}
//             {item.bio && (
//               <Text style={[styles.followBio, { color: colors.textSecondary }]} numberOfLines={1}>
//                 {item.bio}
//               </Text>
//             )}
//           </View>
//         </TouchableOpacity>
        
//         {showFollowButton() && (
//           <TouchableOpacity
//             style={[
//               styles.followActionButton, 
//               isFollowingUser ? styles.followingButton : styles.followButtonn
//             ]}
//             onPress={handleFollowAction}
//           >
//             <Text style={[styles.followActionText, { color: isFollowingUser ? colors.text : '#fff' }]}>
//               {isFollowingUser ? 'Following' : type === 'followers' ? 'Follow Back' : 'Follow'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderVideo = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={[styles.videoCard, { backgroundColor: colors.card }]}
//         onPress={() => {
//           if (item.video_url || item.video) {
//             navigation.navigate('VideoPlayer', { 
//               videoUrl: item.video_url || item.video,
//               videoData: item 
//             });
//           }
//         }}
//         activeOpacity={0.9}
//       >
//         <View style={styles.videoThumbnailContainer}>
//           {item.thumbnail_url || item.thumbnail ? (
//             <Image
//               source={{ uri: item.thumbnail_url || item.thumbnail }}
//               style={styles.videoThumbnail}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={[styles.videoPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//               <Icon name="videocam-outline" size={40} color={colors.textSecondary} />
//             </View>
//           )}
//           <View style={styles.playButtonOverlay}>
//             <View style={[styles.playButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//               <Icon name="play" size={24} color="#fff" />
//             </View>
//           </View>
//           {item.duration && (
//             <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
//               <Text style={styles.durationText}>{item.duration}</Text>
//             </View>
//           )}
//         </View>
//         <View style={styles.videoInfo}>
//           <Text style={[styles.videoCaption, { color: colors.text }]} numberOfLines={2}>
//             {item.caption || 'Untitled Video'}
//           </Text>
//           <View style={styles.videoStats}>
//             <View style={styles.statItem}>
//               <Icon name="heart-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.like_count || 0}
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Icon name="chatbubble-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.comment_count || 0}
//               </Text>
//             </View>
//             <View style={styles.statItem}>
//               <Icon name="eye-outline" size={14} color={colors.textSecondary} />
//               <Text style={[styles.statText, { color: colors.textSecondary }]}>
//                 {item.view_count || 0}
//               </Text>
//             </View>
//           </View>
//           <Text style={[styles.videoDate, { color: colors.textSecondary }]}>
//             {formatDate(item.created_at)}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderMarketplacePost = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.marketplaceCard, { backgroundColor: colors.card }]}
//       onPress={() => {
//         setSelectedProduct(item);
//         setProductModalVisible(true);
//       }}
//       activeOpacity={0.9}
//     >
//       <View style={styles.marketplaceImageContainer}>
//         {item.images?.[0]?.image ? (
//           <Image
//             source={{ uri: item.images[0].image }}
//             style={styles.marketplaceImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={[styles.marketplaceImagePlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
//             <Icon name="cube-outline" size={40} color={colors.textSecondary} />
//           </View>
//         )}
//         {item.category_name && (
//           <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
//             <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.marketplaceContent}>
//         <Text style={[styles.marketplaceTitle, { color: colors.text }]} numberOfLines={2}>
//           {item.title || 'No Title'}
//         </Text>
//         <Text style={[styles.marketplacePrice, { color: colors.primary }]}>
//           ₦{parseFloat(item.price || 0).toLocaleString()}
//         </Text>
//         {item.location && (
//           <View style={styles.locationContainer}>
//             <Icon name="location-outline" size={12} color={colors.textSecondary} />
//             <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
//               {item.location}
//             </Text>
//           </View>
//         )}
//         <Text style={[styles.sellerName, { color: colors.textSecondary }]}>
//           {item.seller_name || 'Unknown Seller'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderTweet = ({ item }) => (
//     <View style={[styles.tweetCard, { backgroundColor: colors.card }]}>
//       <View style={styles.tweetHeader}>
//         <Image
//           source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//           style={styles.tweetAvatar}
//         />
//         <View style={styles.tweetHeaderInfo}>
//           <Text style={[styles.tweetUserName, { color: colors.text }]}>
//             {profileData.user?.name || 'User'}
//           </Text>
//           <Text style={[styles.tweetTimestamp, { color: colors.textSecondary }]}>
//             {formatDate(item.created_at)}
//           </Text>
//         </View>
//       </View>
//       <Text style={[styles.tweetContent, { color: colors.text }]}>
//         {item.content || 'No content'}
//       </Text>
//       {item.image_url && (
//         <TouchableOpacity onPress={() => setFullScreenImage({ visible: true, src: item.image_url, type: 'post' })}>
//           <Image
//             source={{ uri: item.image_url }}
//             style={styles.tweetImage}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       )}
//       <View style={styles.tweetActions}>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="heart-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.like_count || 0}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="chatbubble-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.comment_count || 0}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tweetAction}>
//           <Icon name="repeat-outline" size={20} color={colors.textSecondary} />
//           <Text style={[styles.tweetActionText, { color: colors.textSecondary }]}>{item.share_count || 0}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const handleCatalogDataLoaded = (data) => {
//     setCatalogsCount(data.catalogs.length);
//   };

//   const handleViewAllCatalogs = () => {
//     setSelectedTab('catalogs');
//     navigation.navigate('AllCatalogs', { userId: userIdFromParams });
//   };

//   const renderProfileHeader = () => (
//     <Animated.View style={[styles.profileHeader, { backgroundColor: colors.card, opacity: fadeAnim }]}>
//       <TouchableOpacity
//         onPress={() => userCoverImage && setFullScreenImage({ visible: true, src: userCoverImage, type: 'cover' })}
//         activeOpacity={0.9}
//       >
//         <ImageBackground
//           source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
//           style={styles.coverImage}
//           resizeMode="cover"
//         >
//           {!userIdFromParams && !userCoverImage && (
//             <TouchableOpacity
//               style={[styles.addCoverButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)' }]}
//               onPress={() => handleImageSelection('cover')}
//             >
//               <Icon name="camera-outline" size={24} color="#fff" />
//               <Text style={styles.addCoverText}>Add Cover</Text>
//             </TouchableOpacity>
//           )}
//         </ImageBackground>
//       </TouchableOpacity>

//       <View style={styles.profileInfoContainer}>
//         <View style={styles.profileImageSection}>
//           <TouchableOpacity
//             onPress={() => userProfileImage && setFullScreenImage({ visible: true, src: userProfileImage, type: 'profile' })}
//             style={styles.profileImageWrapper}
//           >
//             <Image
//               source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//               style={[styles.profileImage, { borderColor: colors.card }]}
//             />
//             {!userIdFromParams && (
//               <TouchableOpacity
//                 style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
//                 onPress={() => handleImageSelection('profile')}
//               >
//                 <Icon name="camera" size={16} color="#fff" />
//               </TouchableOpacity>
//             )}
//           </TouchableOpacity>
          
//           <View style={styles.profileTextInfo}>
//             <View style={styles.nameRow}>
//               <Text style={[styles.profileName, { color: colors.text }]}>
//                 {profileData.user?.name || ''}
//               </Text>
//               {profileData.user?.is_verified && (
//                 <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
//               )}
//             </View>
//             <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
//               @{profileData.user?.username || profileData.user?.name.toLocaleString()}
//             </Text>
//           </View>
//         </View>

//         {profileData.user?.bio && (
//           <Text style={[styles.profileBio, { color: colors.text }]}>
//             {profileData.user.bio}
//           </Text>
//         )}

//         <View style={[styles.statsContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
//           <TouchableOpacity 
//             style={styles.statItem}
//             onPress={() => {
//               fetchFollowingList();
//               setFollowingModalVisible(true);
//             }}
//           >
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(followStats.following_count || profileData.stats?.following_count || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Following
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.statItem}
//             onPress={() => {
//               fetchFollowersList();
//               setFollowersModalVisible(true);
//             }}
//           >
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(followStats.followers_count || profileData.stats?.followers_count || 0)}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Followers
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: colors.text }]}>
//               {formatNumber(
//                 (profileData.stats?.posts_count || 0) + 
//                 (profileData.stats?.videos_count || 0) + 
//                 (profileData.stats?.listings_count || 0)
//               )}
//             </Text>
//             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
//               Posts
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.actionButtons}>
//           {!userIdFromParams ? (
//             <>
//               <TouchableOpacity
//                 style={[styles.editButton, { backgroundColor: colors.primary }]}
//                 onPress={() => setIsEditing(true)}
//               >
//                 <Icon name="create-outline" size={18} color="#fff" />
//                 <Text style={styles.editButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.settingsButton, { borderColor: colors.border }]}
//                 onPress={() => navigation.navigate('Settings')}
//               >
//                 <Icon name="settings-outline" size={18} color={colors.text} />
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               {profileData.user?.active_mode === 'business' ? (
//                 <TouchableOpacity
//                   style={[styles.messageButton, { backgroundColor: colors.primary }]}
//                   onPress={() => navigation.navigate('BPrivateChat', {
//                     receiverId: userIdFromParams,
//                     name: profileData.user?.name,
//                     chatType: 'single',
//                     profile_image: userProfileImage
//                   })}


//                   // navigation.navigate('BPrivateChat', {
//                   //   receiverId: data.chatId,
//                   //   name: data.name,
//                   //   chatType: 'single',
//                   //   profile_image: data.avatar,
//                   // });
//                 >
//                   <Icon name="chatbubble-outline" size={18} color="#fff" />
//                   <Text style={styles.messageButtonText}>Message</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.messageButton, { backgroundColor: colors.primary }]}
//                   onPress={() => navigation.navigate('PrivateChat', {
//                     receiverId: userIdFromParams,
//                     name: profileData.user?.name,
//                     chatType: 'single',
//                     profile_image: userProfileImage
//                   })}
//                 >
//                   <Icon name="chatbubble-outline" size={18} color="#fff" />
//                   <Text style={styles.messageButtonText}>Message</Text>
//                 </TouchableOpacity>
//               )}
              
//               <TouchableOpacity
//                 style={[
//                   styles.followButton, 
//                   isFollowing ? styles.followingButton : { borderColor: colors.primary }
//                 ]}
//                 onPress={isFollowing ? handleUnfollow : handleFollow}
//               >
//                 <Icon 
//                   name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} 
//                   size={18} 
//                   color={isFollowing ? colors.text : colors.primary} 
//                 />
//                 <Text style={[
//                   styles.followButtonText, 
//                   { color: isFollowing ? colors.text : colors.primary }
//                 ]}>
//                   {isFollowing ? 'Unfollow' : 'Follow'}
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         <View style={styles.additionalInfo}>
//           {profileData.user?.country && (
//             <View style={styles.infoItem}>
//               <Icon name="location-outline" size={16} color={colors.textSecondary} />
//               <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//                 {profileData.user.country}
//               </Text>
//             </View>
//           )}
//           {profileData.user?.date_of_birth && (
//             <View style={styles.infoItem}>
//               <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
//               <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//                 Birthday: {formatDate(profileData.user.date_of_birth)}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </Animated.View>
//   );

//   const renderCatalogSection = () => (
//     <View style={[styles.catalogSection, { backgroundColor: colors.card }]}>
//       {profileData.user?.active_mode === 'business' && (
//         <View style={styles.catalogHeader}>
//           <View style={styles.catalogTitleContainer}>
//             <Icon name="folder-outline" size={20} color={colors.primary} />
//             <Text style={[styles.catalogTitle, { color: colors.text }]}>Catalogs</Text>
//           </View>
//           {catalogsCount > 0 && (
//             <TouchableOpacity onPress={handleViewAllCatalogs} style={styles.viewAllButton}>
//               <Text style={[styles.viewAllText, { color: colors.primary }]}>See All Bellow</Text>
//               <Icon name="chevron-down" size={16} color={colors.primary} />
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//       {profileData.user?.active_mode === 'business' && (
//         <CatalogComponent
//           ref={catalogRef}
//           userId={userIdFromParams}
//           businessId={userIdFromParams}
//           horizontal={true}
//           showHeader={false}
//           showBusinessInfo={false}
//           maxItems={5}
//           navigation={navigation}
//           containerStyle={styles.catalogContainer}
//           onDataLoaded={handleCatalogDataLoaded}
//         />
//       )}
//     </View>
//   );

//   const renderContent = () => {
//     switch (selectedTab) {
//       case 'catalogs':
//         return (
//           <View style={styles.fullCatalogSection}>
//             <CatalogComponent
//               ref={catalogRef}
//               userId={userIdFromParams}
//               businessId={userIdFromParams}
//               horizontal={false}
//               showHeader={false}
//               showBusinessInfo={false}
//               navigation={navigation}
//               containerStyle={styles.fullCatalogContainer}
//             />
//           </View>
//         );
      
//       case 'posts':
//         if (tweets.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="chatbubble-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't posted anything yet." : "You haven't posted anything yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="posts-list"
//             data={tweets}
//             renderItem={renderTweet}
//             keyExtractor={(item) => `posts-${item.id}`}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       case 'videos':
//         if (userVideos.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="videocam-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't uploaded any videos yet." : "You haven't uploaded any videos yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="videos-list"
//             data={userVideos}
//             renderItem={renderVideo}
//             keyExtractor={(item) => `videos-${item.id}`}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       case 'marketplace':
//         if (marketplacePosts.length === 0) {
//           return (
//             <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
//               <Icon name="cart-outline" size={60} color={colors.textSecondary} />
//               <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
//                 {userIdFromParams ? "This user hasn't listed any items yet." : "You haven't listed any items yet."}
//               </Text>
//             </View>
//           );
//         }
//         return (
//           <FlatList
//             key="marketplace-grid"
//             data={marketplacePosts}
//             renderItem={renderMarketplacePost}
//             keyExtractor={(item) => `marketplace-${item.id}`}
//             numColumns={2}
//             contentContainerStyle={styles.contentList}
//             showsVerticalScrollIndicator={false}
//             initialNumToRender={6}
//             maxToRenderPerBatch={10}
//             windowSize={5}
//           />
//         );
      
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

//       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
//           {profileData.user?.name || 'Profile'}
//         </Text>
//         {userIdFromParams && (
//           <TouchableOpacity 
//             style={styles.headerButton} 
//             onPress={() => setOptionsModalVisible(true)}
//           >
//             <Icon name="ellipsis-vertical" size={24} color={colors.text} />
//           </TouchableOpacity>
//         )}
//         {!userIdFromParams && (
//           <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
//             <View style={{ width: 24 }} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView 
//         ref={scrollViewRef} 
//         showsVerticalScrollIndicator={false} 
//         style={styles.scrollView} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={refreshAllData}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//       >
//         {renderProfileHeader()}
        
//         {/* Catalog Section - Displayed prominently at the top */}
//         {renderCatalogSection()}
        
//         {/* Tab Navigation */}
//         <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'posts' && styles.tabActive, selectedTab === 'posts' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('posts')}
//           >
//             <Icon name="chatbubble-outline" size={20} color={selectedTab === 'posts' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'posts' ? colors.primary : colors.textSecondary }]}>
//               Posts ({tweets.length || profileData.stats?.posts_count || 0})
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'videos' && styles.tabActive, selectedTab === 'videos' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('videos')}
//           >
//             <Icon name="videocam-outline" size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'videos' ? colors.primary : colors.textSecondary }]}>
//               Videos ({userVideos.length || profileData.stats?.videos_count || 0})
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'marketplace' && styles.tabActive, selectedTab === 'marketplace' && { borderBottomColor: colors.primary }]}
//             onPress={() => setSelectedTab('marketplace')}
//           >
//             <Icon name="cart-outline" size={20} color={selectedTab === 'marketplace' ? colors.primary : colors.textSecondary} />
//             <Text style={[styles.tabText, { color: selectedTab === 'marketplace' ? colors.primary : colors.textSecondary }]}>
//               Listings ({marketplacePosts.length || profileData.stats?.listings_count || 0})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {renderContent()}
//       </ScrollView>

//      {/* Options Modal - Report and Block */}
// <Modal
//   visible={optionsModalVisible}
//   transparent={true}
//   animationType="fade"
//   onRequestClose={() => setOptionsModalVisible(false)}
// >
//   <TouchableOpacity
//     style={styles.optionsOverlay}
//     activeOpacity={1}
//     onPress={() => setOptionsModalVisible(false)}
//   >
//     <TouchableOpacity activeOpacity={1}>
//       <View style={[styles.optionsSheet, { backgroundColor: colors.card }]}>
        
//         {/* Drag Handle */}
//         <View style={styles.optionsDragHandle} />

//         {/* Header */}
//         <View style={styles.optionsSheetHeader}>
//           <View style={styles.optionsUserInfo}>
//             <Image
//               source={
//                 userProfileImage
//                   ? { uri: userProfileImage }
//                   : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
//               }
//               style={styles.optionsUserAvatar}
//             />
//             <View>
//               <Text style={[styles.optionsUserName, { color: colors.text }]}>
//                 {profileData.user?.name || 'User'}
//               </Text>
//               <Text style={[styles.optionsUserHandle, { color: colors.textSecondary }]}>
//                 @{profileData.user?.username || ''}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Divider */}
//         <View style={[styles.optionsHeaderDivider, { backgroundColor: colors.border }]} />

//         {/* Report Option */}
//         <TouchableOpacity
//           style={styles.optionsActionRow}
//           onPress={() => {
//             setOptionsModalVisible(false);
//             setReportModalVisible(true);
//           }}
//           activeOpacity={0.7}
//         >
//           <View style={[styles.optionsActionIcon, { backgroundColor: '#ff980015' }]}>
//             <Icon name="flag-outline" size={20} color="#ff9800" />
//           </View>
//           <View style={styles.optionsActionTextGroup}>
//             <Text style={[styles.optionsActionTitle, { color: colors.text }]}>
//               Report User
//             </Text>
//             <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
//               Report inappropriate content or behavior
//             </Text>
//           </View>
//           <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={[styles.optionsRowDivider, { backgroundColor: colors.border }]} />

//         {/* Block/Unblock Option */}
//         <TouchableOpacity
//           style={styles.optionsActionRow}
//           onPress={() => {
//             setOptionsModalVisible(false);
//             if (isBlocked) {
//               Alert.alert(
//                 'Unblock User',
//                 `Are you sure you want to unblock ${profileData.user?.name}?`,
//                 [
//                   { text: 'Cancel', style: 'cancel' },
//                   { text: 'Unblock', style: 'destructive', onPress: handleUnblockUser }
//                 ]
//               );
//             } else {
//               setBlockModalVisible(true);
//             }
//           }}
//           activeOpacity={0.7}
//         >
//           <View style={[styles.optionsActionIcon, { backgroundColor: '#ff5c5c15' }]}>
//             <Icon
//               name={isBlocked ? 'lock-open-outline' : 'ban-outline'}
//               size={20}
//               color="#ff5c5c"
//             />
//           </View>
//           <View style={styles.optionsActionTextGroup}>
//             <View style={styles.optionsActionTitleRow}>
//               <Text style={[styles.optionsActionTitle, { color: '#ff5c5c' }]}>
//                 {isBlocked ? 'Unblock User' : 'Block User'}
//               </Text>
//               {isBlocked && (
//                 <View style={styles.optionsBlockedPill}>
//                   <Text style={styles.optionsBlockedPillText}>Blocked</Text>
//                 </View>
//               )}
//             </View>
//             <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
//               {isBlocked
//                 ? 'Allow this user to interact with you again'
//                 : 'Prevent this user from messaging or viewing you'}
//             </Text>
//           </View>
//           <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
//         </TouchableOpacity>

//         {/* Cancel Button */}
//         <TouchableOpacity
//           style={[styles.optionsCancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}
//           onPress={() => setOptionsModalVisible(false)}
//           activeOpacity={0.7}
//         >
//           <Text style={[styles.optionsCancelText, { color: colors.text }]}>Cancel</Text>
//         </TouchableOpacity>

//       </View>
//     </TouchableOpacity>
//   </TouchableOpacity>
// </Modal>

//       {/* Report Modal */}
    
// <Modal
//   visible={reportModalVisible}
//   transparent={true}
//   animationType="slide"
//   onRequestClose={() => setReportModalVisible(false)}
// >
//   <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }]}>
//     <View style={[styles.reportModalContent, { backgroundColor: colors.card }]}>
      
//       {/* Drag handle */}
//       <View style={styles.sheetHandle} />

//       <View style={styles.reportModalHeader}>
//         <Text style={[styles.reportModalTitle, { color: colors.text }]}>Report User</Text>
//         <TouchableOpacity onPress={() => { setReportModalVisible(false); setReportReason(''); }}>
//           <Icon name="close" size={24} color={colors.text} />
//         </TouchableOpacity>
//       </View>

//       <Text style={[styles.reportModalDescription, { color: colors.textSecondary }]}>
//         Why are you reporting {profileData.user?.name}? Your report is anonymous.
//       </Text>

//       {/* Reason Picker */}
//       <Text style={[styles.reportSectionLabel, { color: colors.text }]}>Select a reason</Text>
//       <View style={styles.reportReasonList}>
//         {[
//           { key: 'spam', label: 'Spam', icon: 'mail-unread-outline' },
//           { key: 'abuse', label: 'Abuse', icon: 'alert-circle-outline' },
//           { key: 'hate_speech', label: 'Hate Speech', icon: 'megaphone-outline' },
//           { key: 'fake_account', label: 'Fake Account', icon: 'person-remove-outline' },
         
//         ].map((reason) => (
//           <TouchableOpacity
//             key={reason.key}
//             style={[
//               styles.reportReasonOption,
//               { borderColor: reportReason === reason.key ? '#ff9800' : colors.border },
//               reportReason === reason.key && styles.reportReasonOptionSelected,
//             ]}
//             onPress={() => setReportReason(reason.key)}
//             activeOpacity={0.7}
//           >
//             <View style={[
//               styles.reportReasonIconWrap,
//               { backgroundColor: reportReason === reason.key ? '#ff980020' : colors.backgroundSecondary }
//             ]}>
//               <Icon
//                 name={reason.icon}
//                 size={20}
//                 color={reportReason === reason.key ? '#ff9800' : colors.textSecondary}
//               />
//             </View>
//             <Text style={[
//               styles.reportReasonLabel,
//               { color: reportReason === reason.key ? '#ff9800' : colors.text }
//             ]}>
//               {reason.label}
//             </Text>
//             {reportReason === reason.key && (
//               <Icon name="checkmark-circle" size={20} color="#ff9800" style={{ marginLeft: 'auto' }} />
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.reportModalButtons}>
//         <TouchableOpacity
//           style={[styles.reportButton, styles.cancelReportButton, { backgroundColor: colors.surfaceVariant }]}
//           onPress={() => { setReportModalVisible(false); setReportReason(''); }}
//         >
//           <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.reportButton,
//             styles.submitReportButton,
//             { backgroundColor: reportReason ? '#ff9800' : '#ffcc80', opacity: reportReason ? 1 : 0.6 }
//           ]}
//           onPress={handleReportUser}
//           disabled={reportLoading || !reportReason}
//         >
//           {reportLoading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Submit Report</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//     </View>
//   </View>
// </Modal>

//       {/* Block Confirmation Modal */}
// <Modal
//   visible={blockModalVisible}
//   transparent={true}
//   animationType="slide"
//   onRequestClose={() => setBlockModalVisible(false)}
// >
//   <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }]}>
//     <View style={[styles.blockModalContent, { backgroundColor: colors.card }]}>

//       {/* Drag Handle */}
//       <View style={styles.sheetHandle} />

//       {/* Icon Badge */}
//       <View style={styles.blockIconBadge}>
//         <Icon name="ban-outline" size={32} color="#ff5c5c" />
//       </View>

//       <Text style={[styles.blockModalTitle, { color: colors.text }]}>
//         Block {profileData.user?.name}?
//       </Text>
//       <Text style={[styles.blockModalDescription, { color: colors.textSecondary }]}>
//         They won't be notified. You can unblock them anytime from their profile.
//       </Text>

//       {/* What happens list */}
//       <View style={[styles.blockConsequencesList, { backgroundColor: colors.backgroundSecondary || (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), borderRadius: 14 }]}>
//         {[
//           { icon: 'chatbubble-ellipses-outline', text: "They won't be able to message you" },
//           { icon: 'eye-off-outline',             text: "They won't see your posts or profile" },
//           { icon: 'person-outline',              text: "You won't see their content either" },
//         ].map((item, index, arr) => (
//           <View
//             key={index}
//             style={[
//               styles.blockConsequenceItem,
//               index < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }
//             ]}
//           >
//             <View style={styles.blockConsequenceIconWrap}>
//               <Icon name={item.icon} size={18} color="#ff5c5c" />
//             </View>
//             <Text style={[styles.blockConsequenceText, { color: colors.textSecondary }]}>
//               {item.text}
//             </Text>
//           </View>
//         ))}
//       </View>

//       {/* Buttons */}
//       <TouchableOpacity
//         style={[styles.blockConfirmBtn, { backgroundColor: '#ff5c5c' }]}
//         onPress={handleBlockUser}
//         disabled={blockLoading}
//         activeOpacity={0.85}
//       >
//         {blockLoading ? (
//           <ActivityIndicator size="small" color="#fff" />
//         ) : (
//           <Text style={styles.blockConfirmBtnText}>Block User</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.blockCancelBtn, { borderColor: colors.border }]}
//         onPress={() => setBlockModalVisible(false)}
//         activeOpacity={0.7}
//       >
//         <Text style={[styles.blockCancelBtnText, { color: colors.text }]}>Cancel</Text>
//       </TouchableOpacity>

//     </View>
//   </View>
// </Modal>

//       {/* Other Modals remain the same */}
//       <Modal visible={fullScreenImage.visible} transparent animationType="fade" onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
//         <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
//           <TouchableOpacity style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
//             <Icon name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//           <Image source={{ uri: fullScreenImage.src }} style={styles.fullScreenImage} resizeMode="contain" />
//           <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
//             <Text style={styles.fullScreenLabelText}>
//               {fullScreenImage.type === 'profile' ? 'Profile Picture' : 
//                fullScreenImage.type === 'cover' ? 'Cover Photo' : 'Post Image'}
//             </Text>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//         <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} activeOpacity={1} onPress={() => setModalVisible(false)}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//             {!userIdFromParams && (
//               <>
//                 <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); setIsEditing(true); }}>
//                   <Icon name="create-outline" size={22} color={colors.text} />
//                   <Text style={[styles.modalOptionText, { color: colors.text }]}>Edit Profile</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.modalOption} onPress={() => navigation.navigate('Settings')}>
//                   <Icon name="settings-outline" size={22} color={colors.text} />
//                   <Text style={[styles.modalOptionText, { color: colors.text }]}>Settings</Text>
//                 </TouchableOpacity>
//                 <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
//               </>
//             )}
//             <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
//               <Icon name="close" size={22} color={colors.text} />
//               <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <Modal visible={followersModalVisible} transparent animationType="slide" onRequestClose={() => setFollowersModalVisible(false)}>
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//           <View style={[styles.followModal, { backgroundColor: colors.card }]}>
//             <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
//               <Text style={[styles.followModalTitle, { color: colors.text }]}>Followers</Text>
//               <TouchableOpacity onPress={() => setFollowersModalVisible(false)}>
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>
//             {loadingFollowers ? (
//               <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
//             ) : (
//               <FlatList
//                 data={followersList}
//                 renderItem={({ item }) => <FollowItem item={item} type="followers" />}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={styles.followList}
//                 ListEmptyComponent={
//                   <View style={styles.emptyFollow}>
//                     <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>No followers yet</Text>
//                   </View>
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={followingModalVisible} transparent animationType="slide" onRequestClose={() => setFollowingModalVisible(false)}>
//         <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
//           <View style={[styles.followModal, { backgroundColor: colors.card }]}>
//             <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
//               <Text style={[styles.followModalTitle, { color: colors.text }]}>Following</Text>
//               <TouchableOpacity onPress={() => setFollowingModalVisible(false)}>
//                 <Icon name="close" size={24} color={colors.text} />
//               </TouchableOpacity>
//             </View>
//             {loadingFollowers ? (
//               <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
//             ) : (
//               <FlatList
//                 data={followingList}
//                 renderItem={({ item }) => <FollowItem item={item} type="following" />}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={styles.followList}
//                 ListEmptyComponent={
//                   <View style={styles.emptyFollow}>
//                     <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>Not following anyone yet</Text>
//                   </View>
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//    container: { 
//     flex: 1 
//   },
  
//   loadingContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   loadingText: { 
//     marginTop: 16, 
//     fontSize: 16, 
//     fontWeight: '500' 
//   },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingHorizontal: 16, 
//     paddingVertical: 12, 
//     borderBottomWidth: 1 
//   },
//   headerButton: { 
//     padding: 8 
//   },
//   headerTitle: { 
//     fontSize: 18, 
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'center'
//   },
//   scrollView: { 
//     flex: 1 
//   },
//   scrollContent: { 
//     flexGrow: 1 
//   },
//   profileHeader: { 
//     marginBottom: 8 
//   },
//   coverImage: { 
//     width: '100%', 
//     height: 180, 
//     justifyContent: 'flex-end', 
//     alignItems: 'center' 
//   },
//   addCoverButton: { 
//     paddingHorizontal: 16, 
//     paddingVertical: 10, 
//     borderRadius: 20, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 16,
//   },
//   addCoverText: { 
//     color: '#fff', 
//     marginLeft: 8, 
//     fontSize: 14, 
//     fontWeight: '500'
//   },
//   profileInfoContainer: { 
//     padding: 20, 
//     marginTop:-40
//   },
//   profileImageSection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 20 
//   },
//   profileImageWrapper: { 
//     position: 'relative', 
//     marginRight: 16 
//   },
//   profileImage: { 
//     width: 100, 
//     height: 100, 
//     borderRadius: 50, 
//     borderWidth: 4, 
//     backgroundColor: '#f0f0f0' 
//   },
//   changePhotoButton: { 
//     position: 'absolute', 
//     bottom: 0, 
//     right: 0, 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     borderWidth: 3, 
//     borderColor: '#fff', 
//     elevation: 3, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.2, 
//     shadowRadius: 4 
//   },

//   sheetHandle: {
//   width: 40,
//   height: 4,
//   borderRadius: 2,
//   backgroundColor: '#ccc',
//   alignSelf: 'center',
//   marginBottom: 16,
// },
// reportSectionLabel: {
//   fontSize: 14,
//   fontWeight: '600',
//   marginBottom: 10,
//   marginTop: 4,
// },
// blockStatusBadge: {
//   width: 44,
//   height: 44,
//   borderRadius: 12,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// optionTextGroup: {
//   flex: 1,
//   gap: 2,
// },
// optionSubText: {
//   fontSize: 12,
// },
// blockedBadge: {
//   backgroundColor: '#ff5c5c20',
//   paddingHorizontal: 8,
//   paddingVertical: 4,
//   borderRadius: 6,
//   borderWidth: 1,
//   borderColor: '#ff5c5c40',
// },
// blockedBadgeText: {
//   fontSize: 11,
//   fontWeight: '600',
//   color: '#ff5c5c',
// },
// reportReasonList: {
//   gap: 10,
//   marginBottom: 24,
// },
// reportReasonOption: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingVertical: 14,
//   paddingHorizontal: 14,
//   borderRadius: 12,
//   borderWidth: 1.5,
//   gap: 12,
// },
// reportReasonOptionSelected: {
//   backgroundColor: '#fff8f0',
// },
// reportReasonIconWrap: {
//   width: 36,
//   height: 36,
//   borderRadius: 10,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// reportReasonLabel: {
//   fontSize: 15,
//   fontWeight: '500',
// },
//   profileTextInfo: { 
//     flex: 1 
//   },
//   nameRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap' 
//   },
//   profileName: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     marginRight: 8, 
//   },
//   verifiedBadge: { 
//     marginLeft: 4 
//   },
//   profileUsername: { 
//     fontSize: 16, 
//     marginTop: 4 
//   },
//   modeBadge: { 
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8, 
//     paddingVertical: 4, 
//     borderRadius: 4, 
//     marginTop: 4 
//   },
//   modeText: { 
//     fontSize: 11, 
//     fontWeight: '500' 
//   },
//   profileBio: { 
//     fontSize: 15, 
//     lineHeight: 22, 
//     marginBottom: 20 
//   },
//   statsContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-around', 
//     marginBottom: 24, 
//     paddingVertical: 16, 
//     borderTopWidth: 1, 
//     borderBottomWidth: 1 
//   },
//   statItem: { 
//     alignItems: 'center', 
//     flex: 1 
//   },
//   statNumber: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     marginBottom: 6 
//   },
//   statLabel: { 
//     fontSize: 13 
//   },
//   actionButtons: { 
//     flexDirection: 'row', 
//     gap: 12, 
//     marginBottom: 20 
//   },
//   editButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     gap: 8, 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   editButtonText: { 
//     color: '#fff', 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   settingsButton: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: 26, 
//     borderWidth: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   messageButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     gap: 8, 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   messageButtonText: { 
//     color: '#fff', 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   followButton: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 14, 
//     borderRadius: 25, 
//     borderWidth: 1.5,
//     gap: 8 
//   },
//   followButtonn: {
//     backgroundColor: '#0653f8ff', 
//     borderWidth: 0 
//   },
//   followingButton: { 
//     backgroundColor: '#E1E1E1', 
//     borderWidth: 0 
//   },
//   followButtonText: { 
//     fontSize: 15, 
//     fontWeight: '600' 
//   },
//   additionalInfo: { 
//     gap: 12 
//   },
//   infoItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10 
//   },
//   infoText: { 
//     fontSize: 14, 
//     flex: 1 
//   },
//   ageText: { 
//     fontSize: 13, 
//     opacity: 0.8 
//   },
//   // Catalog Section Styles
//   catalogSection: {
//     marginVertical: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: 'rgba(0,0,0,0.05)',
//   },
//   catalogHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   catalogTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   catalogTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   viewAllText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   catalogContainer: {
//     minHeight: 180,
//   },
//   fullCatalogSection: {
//     flex: 1,
//     minHeight: 400,
//     padding: 8,
//   },
//   fullCatalogContainer: {
//     flex: 1,
//   },
//   tabContainer: { 
//     flexDirection: 'row', 
//     marginTop: 8,
//     paddingHorizontal: 8
//   },
//   tab: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 12, 
//     gap: 6, 
//     borderBottomWidth: 2, 
//     borderBottomColor: 'transparent' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontWeight: '500' 
//   },
//   contentList: { 
//     padding: 8 
//   },
//   marketplaceCard: { 
//     flex: 1, 
//     margin: 6, 
//     borderRadius: 12, 
//     overflow: 'hidden', 
//     elevation: 2, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4 
//   },
//   marketplaceImageContainer: { 
//     height: 140,
//     position: 'relative'
//   },
//   marketplaceImage: { 
//     width: '100%', 
//     height: '100%' 
//   },
//   marketplaceImagePlaceholder: { 
//     width: '100%', 
//     height: '100%', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   categoryBadge: { 
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4 
//   },
//   categoryBadgeText: { 
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600' 
//   },
//   marketplaceContent: { 
//     padding: 12 
//   },
//   marketplaceTitle: { 
//     fontSize: 14, 
//     fontWeight: '600', 
//     marginBottom: 6 
//   },
//   marketplacePrice: { 
//     fontSize: 15, 
//     fontWeight: 'bold' 
//   },
//   optionsOverlay: {
//   flex: 1,
//   backgroundColor: 'rgba(0,0,0,0.55)',
//   justifyContent: 'flex-end',
// },
// optionsSheet: {
//   borderTopLeftRadius: 28,
//   borderTopRightRadius: 28,
//   paddingTop: 12,
//   paddingHorizontal: 20,
//   paddingBottom: Platform.OS === 'ios' ? 44 : 32,
//   elevation: 20,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: -6 },
//   shadowOpacity: 0.2,
//   shadowRadius: 16,
// },
// optionsDragHandle: {
//   width: 40,
//   height: 4,
//   borderRadius: 2,
//   backgroundColor: '#ccc',
//   alignSelf: 'center',
//   marginBottom: 20,
// },
// optionsSheetHeader: {
//   marginBottom: 16,
// },
// optionsUserInfo: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: 12,
// },
// optionsUserAvatar: {
//   width: 46,
//   height: 46,
//   borderRadius: 23,
//   backgroundColor: '#f0f0f0',
// },
// optionsUserName: {
//   fontSize: 16,
//   fontWeight: '700',
//   marginBottom: 2,
// },
// optionsUserHandle: {
//   fontSize: 13,
// },
// optionsHeaderDivider: {
//   height: 1,
//   marginBottom: 8,
// },
// optionsActionRow: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingVertical: 14,
//   gap: 14,
// },
// optionsActionIcon: {
//   width: 44,
//   height: 44,
//   borderRadius: 12,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// optionsActionTextGroup: {
//   flex: 1,
//   gap: 3,
// },
// optionsActionTitleRow: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: 8,
// },
// optionsActionTitle: {
//   fontSize: 15,
//   fontWeight: '600',
// },
// optionsActionSubtitle: {
//   fontSize: 12,
//   lineHeight: 17,
// },
// optionsBlockedPill: {
//   backgroundColor: '#ff5c5c20',
//   paddingHorizontal: 8,
//   paddingVertical: 3,
//   borderRadius: 20,
//   borderWidth: 1,
//   borderColor: '#ff5c5c40',
// },
// optionsBlockedPillText: {
//   fontSize: 10,
//   fontWeight: '700',
//   color: '#ff5c5c',
//   letterSpacing: 0.3,
// },
// optionsRowDivider: {
//   height: 1,
//   marginLeft: 58,
// },
// optionsCancelBtn: {
//   marginTop: 12,
//   paddingVertical: 15,
//   borderRadius: 14,
//   alignItems: 'center',
// },
// optionsCancelText: {
//   fontSize: 16,
//   fontWeight: '600',
// },
//   locationContainer: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginTop: 4 
//   },
//   locationText: { 
//     fontSize: 11, 
//     marginLeft: 4 
//   },
//   sellerName: { 
//     fontSize: 11, 
//     marginTop: 4 
//   },
//   tweetCard: { 
//     padding: 16, 
//     borderRadius: 12, 
//     margin: 8, 
//     elevation: 1, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 1 }, 
//     shadowOpacity: 0.05, 
//     shadowRadius: 2 
//   },
//   tweetHeader: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 12 
//   },
//   tweetAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20, 
//     marginRight: 12 
//   },
//   tweetHeaderInfo: { 
//     flex: 1 
//   },
//   tweetUserName: { 
//     fontSize: 15, 
//     fontWeight: '600', 
//     marginBottom: 2 
//   },
//   tweetTimestamp: { 
//     fontSize: 12 
//   },
//   tweetContent: { 
//     fontSize: 15, 
//     lineHeight: 22, 
//     marginBottom: 12 
//   },
//   tweetImage: { 
//     width: '100%', 
//     height: 200, 
//     borderRadius: 8 
//   },
//   tweetActions: { 
//     flexDirection: 'row', 
//     marginTop: 12, 
//     paddingTop: 12, 
//     borderTopWidth: 1, 
//     borderTopColor: 'rgba(0,0,0,0.05)' 
//   },
//   tweetAction: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginRight: 24 
//   },
//   tweetActionText: { 
//     fontSize: 13, 
//     marginLeft: 6 
//   },
//   videoCard: {
//     margin: 8,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   videoThumbnailContainer: {
//     position: 'relative',
//     height: 180,
//     backgroundColor: '#f0f0f0',
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   videoPlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButtonOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   durationBadge: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   videoInfo: {
//     padding: 12,
//   },
//   videoCaption: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   videoStats: {
//     flexDirection: 'row',
//     marginBottom: 6,
//   },
//   statText: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   videoDate: {
//     fontSize: 11,
//   },
//   emptyContainer: { 
//     padding: 40, 
//     alignItems: 'center', 
//     borderRadius: 12, 
//     margin: 16, 
//     elevation: 1, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 1 }, 
//     shadowOpacity: 0.05, 
//     shadowRadius: 2 
//   },
//   emptyText: { 
//     marginTop: 16, 
//     fontSize: 16, 
//     textAlign: 'center', 
//     lineHeight: 24 
//   },
//   fullScreenModal: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   fullScreenClose: { 
//     position: 'absolute', 
//     top: Platform.OS === 'ios' ? 60 : 40, 
//     right: 20, 
//     zIndex: 1, 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   fullScreenImage: { 
//     width: screenWidth, 
//     height: screenHeight * 0.7 
//   },
//   fullScreenLabel: { 
//     position: 'absolute', 
//     bottom: 40, 
//     paddingHorizontal: 20, 
//     paddingVertical: 10, 
//     borderRadius: 20 
//   },
//   fullScreenLabelText: { 
//     color: '#fff', 
//     fontSize: 14, 
//     fontWeight: '500' 
//   },
//   modalOverlay: { 
//     flex: 1, 
//     justifyContent: 'flex-end' 
//   },
//   modalContent: { 
//     borderTopLeftRadius: 20, 
//     borderTopRightRadius: 20, 
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20 
//   },
//   modalOption: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 18, 
//     gap: 16 
//   },
//   modalOptionText: { 
//     fontSize: 16, 
//     fontWeight: '500', 
//     flex: 1 
//   },
//   modalDivider: { 
//     height: 1, 
//     marginHorizontal: 16 
//   },
//   followModal: { 
//     height: '80%', 
//     marginTop: 'auto', 
//     borderTopLeftRadius: 20, 
//     borderTopRightRadius: 20, 
//     overflow: 'hidden' 
//   },
//   followModalHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     padding: 16, 
//     borderBottomWidth: 1 
//   },
//   followModalTitle: { 
//     fontSize: 18, 
//     fontWeight: '600' 
//   },
//   followList: { 
//     padding: 16 
//   },
//   followItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingVertical: 12, 
//     borderBottomWidth: 1 
//   },
//   followItemLeft: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flex: 1 
//   },
//   followAvatar: { 
//     width: 50, 
//     height: 50, 
//     borderRadius: 25, 
//     marginRight: 12 
//   },
//   followInfo: { 
//     flex: 1 
//   },
//   followName: { 
//     fontSize: 16, 
//     fontWeight: '600', 
//     marginBottom: 2 
//   },
//   followUsername: { 
//     fontSize: 13 
//   },
//   followBio: { 
//     fontSize: 12, 
//     marginTop: 2 
//   },
//   followActionButton: { 
//     paddingHorizontal: 16, 
//     paddingVertical: 8, 
//     borderRadius: 20, 
//     minWidth: 100, 
//     alignItems: 'center' 
//   },
//   followActionText: { 
//     fontSize: 14, 
//     fontWeight: '600' 
//   },
//   followLoader: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   emptyFollow: { 
//     padding: 40, 
//     alignItems: 'center' 
//   },
//   emptyFollowText: { 
//     fontSize: 16 
//   },
//   optionsModalContent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     gap: 16,
//   },
//   optionText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   optionDivider: {
//     height: 1,
//     marginVertical: 8,
//   },
//   reportModalContent: {
//   width: '100%',
//   borderTopLeftRadius: 24,
//   borderTopRightRadius: 24,
//   borderBottomLeftRadius: 0,
//   borderBottomRightRadius: 0,
//   padding: 24,
//   paddingBottom: Platform.OS === 'ios' ? 40 : 28,
//   elevation: 10,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: -4 },
//   shadowOpacity: 0.15,
//   shadowRadius: 12,
// },
//   reportModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   reportModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   reportModalDescription: {
//     fontSize: 14,
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   reportInput: {
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 14,
//     textAlignVertical: 'top',
//     minHeight: 100,
//     marginBottom: 20,
//   },
//   reportModalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   reportButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelReportButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   submitReportButton: {
//     backgroundColor: '#ff9800',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   blockModalContent: {
//   width: '100%',
//   borderTopLeftRadius: 28,
//   borderTopRightRadius: 28,
//   padding: 24,
//   paddingBottom: Platform.OS === 'ios' ? 44 : 32,
//   elevation: 10,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: -4 },
//   shadowOpacity: 0.15,
//   shadowRadius: 12,
//   alignItems: 'center',
// },
// blockIconBadge: {
//   width: 68,
//   height: 68,
//   borderRadius: 34,
//   backgroundColor: '#ff5c5c18',
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 16,
// },
// blockModalTitle: {
//   fontSize: 20,
//   fontWeight: '700',
//   marginBottom: 8,
//   textAlign: 'center',
// },
// blockModalDescription: {
//   fontSize: 14,
//   textAlign: 'center',
//   lineHeight: 20,
//   marginBottom: 20,
//   paddingHorizontal: 12,
// },
// blockConsequencesList: {
//   width: '100%',
//   marginBottom: 24,
//   overflow: 'hidden',
// },
// blockConsequenceItem: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingVertical: 13,
//   paddingHorizontal: 16,
//   gap: 12,
// },
// blockConsequenceIconWrap: {
//   width: 32,
//   height: 32,
//   borderRadius: 8,
//   backgroundColor: '#ff5c5c15',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// blockConsequenceText: {
//   fontSize: 14,
//   flex: 1,
//   lineHeight: 19,
// },
// blockConfirmBtn: {
//   width: '100%',
//   paddingVertical: 15,
//   borderRadius: 14,
//   alignItems: 'center',
//   marginBottom: 10,
// },
// blockConfirmBtnText: {
//   color: '#fff',
//   fontSize: 16,
//   fontWeight: '700',
//   letterSpacing: 0.2,
// },
// blockCancelBtn: {
//   width: '100%',
//   paddingVertical: 15,
//   borderRadius: 14,
//   alignItems: 'center',
//   borderWidth: 1.5,
// },
// blockCancelBtnText: {
//   fontSize: 16,
//   fontWeight: '600',
// },
// });

// export default UserProfile;



import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  ImageBackground,
  RefreshControl,
  Pressable,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext';
import CatalogComponent from '../../showa_business/OthersUserCatalog';
import Video from 'react-native-video';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PLAYBACK_RATE = 1;

// ==================== HELPER FUNCTIONS ====================
const convertToHttps = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  
  let convertedUrl = url.replace('http://', 'https://');
  
  if (convertedUrl.includes('api.showapp.ngmedia')) {
    convertedUrl = convertedUrl.replace('api.showapp.ngmedia', 'api.showapp.ng/media');
  }
  
  if (convertedUrl.includes('api.showapp.ng/') && 
      !convertedUrl.includes('api.showapp.ng/media/') &&
      (convertedUrl.includes('profile_pics') || convertedUrl.includes('cover_photos') ||
       convertedUrl.includes('catalog_images') || convertedUrl.includes('marketplace_images') ||
       convertedUrl.includes('post_images'))) {
    convertedUrl = convertedUrl.replace('api.showapp.ng/', 'api.showapp.ng/media/');
  }
  
  return convertedUrl;
};

const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
    return null;
  }
  
  if (typeof imagePath === 'object') {
    if (imagePath.image) return getImageUrl(imagePath.image);
    if (imagePath.url) return getImageUrl(imagePath.url);
    return null;
  }
  
  if (typeof imagePath === 'string') {
    if (imagePath.startsWith('http')) {
      return convertToHttps(imagePath);
    }
    
    let cleanPath = imagePath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    let baseUrl = API_ROUTE_IMAGE;
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    const fullUrl = `${baseUrl}${cleanPath}`;
    return convertToHttps(fullUrl);
  }
  
  return null;
};

// ==================== VIDEO PLAYER COMPONENT ====================
const VideoPlayer = memo(({ uri, isPlaying, onPress, style }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const secureUri = uri ? convertToHttps(uri) : null;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [secureUri]);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={[style, styles.videoPlayerContainer]}
    >
      {secureUri ? (
        <Video
          ref={videoRef}
          source={{ uri: secureUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          repeat={false}
          muted={true}
          paused={!isPlaying}
          rate={PLAYBACK_RATE}
          onLoadStart={() => setIsLoading(true)}
          onLoad={(data) => {
            setIsLoading(false);
            setDuration(data.duration);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : null}
      
      {isLoading && (
        <View style={styles.videoLoading}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      
      {hasError && (
        <View style={styles.videoError}>
          <MaterialIcon name="alert-circle" size={24} color="#fff" />
          <Text style={styles.errorText}>Failed to load</Text>
        </View>
      )}
      
      {!isPlaying && !isLoading && !hasError && secureUri && (
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <MaterialIcon name="play-arrow" size={28} color="#fff" />
          </View>
        </View>
      )}
      
      {duration > 0 && !isPlaying && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// ==================== VIDEO GRID ITEM ====================
const VideoGridItem = memo(({ item, onPress, colors, isPlaying }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Pressable 
      onPress={() => onPress(item)}
      style={[
        styles.videoGridItem,
        { backgroundColor: colors.card }
      ]}
    >
      <VideoPlayer
        uri={item.video || item.video_url}
        isPlaying={isPlaying}
        onPress={() => onPress(item)}
        style={styles.videoGridPlayer}
      />
      
      <View style={styles.videoViewsOverlay}>
        <Icon name="eye-outline" size={12} color="#fff" />
        <Text style={styles.videoViewsText}>{formatNumber(item.view_count || 0)}</Text>
      </View>
      
      {item.like_count > 0 && (
        <View style={styles.videoLikeOverlay}>
          <Icon name="heart-outline" size={12} color="#fff" />
          <Text style={styles.videoLikeText}>{formatNumber(item.like_count)}</Text>
        </View>
      )}
      
      {item.comment_count > 0 && (
        <View style={styles.videoCommentOverlay}>
          <Icon name="chatbubble-outline" size={10} color="#fff" />
          <Text style={styles.videoCommentText}>{formatNumber(item.comment_count)}</Text>
        </View>
      )}
    </Pressable>
  );
});

// ==================== POST GRID ITEM ====================
const PostGridItem = memo(({ item, onPress, colors }) => {
  const imageUrl = item.image_url ? getImageUrl(item.image_url) : null;
  
  return (
    <Pressable 
      onPress={() => onPress(item)}
      style={[styles.gridItem, { backgroundColor: colors.card }]}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.gridImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="document-text-outline" size={30} color={colors.textSecondary} />
        </View>
      )}
      
      {item.like_count > 0 && (
        <View style={styles.reactionBadge}>
          <Icon name="heart" size={12} color="#fff" />
          <Text style={styles.reactionBadgeText}>
            {item.like_count > 999 ? `${(item.like_count / 1000).toFixed(1)}K` : item.like_count}
          </Text>
        </View>
      )}
    </Pressable>
  );
});

// ==================== MARKETPLACE GRID ITEM ====================
const MarketplaceGridItem = memo(({ item, onPress, colors }) => {
  const imageUrl = item.images && item.images.length > 0 ? getImageUrl(item.images[0].image) : null;
  
  return (
    <Pressable 
      onPress={() => onPress(item)}
      style={[styles.marketplaceGridItem, { backgroundColor: colors.card }]}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.gridImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.gridPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="cart-outline" size={30} color={colors.textSecondary} />
        </View>
      )}
      
      <View style={styles.marketplacePriceBadge}>
        <Text style={styles.marketplacePriceText}>
          ₦{parseFloat(item.price || 0).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
});

// ==================== POST DETAIL BOTTOM SHEET ====================
const PostDetailBottomSheet = ({ 
  visible, 
  post, 
  onClose, 
  colors,
  type,
  navigation 
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [loading, setLoading] = useState(false);
  const [sellerProfilePic, setSellerProfilePic] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  
  const [userReaction, setUserReaction] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    if (visible && post) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      
      if (type === 'marketplace' && post.seller) {
        fetchSellerInfo(post.seller);
      }
      
      if (type !== 'marketplace') {
        setUserReaction(post.user_reaction || null);
        setLikeCount(post.like_count || 0);
        setCommentCount(post.comment_count || 0);
        setShareCount(post.share_count || 0);
        fetchComments();
      }
      
      fetchCurrentUser();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setReplyToCommentId(null);
      setReplyToUsername('');
      setNewComment('');
      setSellerInfo(null);
      setSellerProfilePic(null);
    }
  }, [visible, post]);

  const fetchSellerInfo = async (sellerId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/users/${sellerId}/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200 && response.data.user) {
        const userData = response.data.user;
        setSellerInfo(userData);
        if (userData.profile_picture) {
          setSellerProfilePic(getImageUrl(userData.profile_picture));
        }
      }
    } catch (error) {
      console.error('Error fetching seller info:', error);
      setSellerProfilePic(null);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchComments = async () => {
    if (!post || type === 'marketplace') return;
    setLoadingComments(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/post/${post.id}/comments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let commentsData = [];
      if (response.data.comments) {
        commentsData = response.data.comments;
      } else if (Array.isArray(response.data)) {
        commentsData = response.data;
      } else if (response.data.results) {
        commentsData = response.data.results;
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleMessageSeller = () => {
    if (!post) return;
    
    const sellerId = post.seller || post.user_id || post.user?.id;
    const sellerName = post.seller_name || post.username || post.user?.name || sellerInfo?.name || 'Seller';
    const sellerImage = sellerProfilePic || post.user?.profile_picture || post.user_profile_picture;
    

    onClose();
    
    setTimeout(() => {
      navigation.navigate('BPrivateChat', {
        receiverId: sellerId,
        name: sellerName,
        chatType: 'single',
        profile_image: sellerImage,
       
      });
    }, 300);
  };

  const handleReaction = async (reactionType) => {
    if (!post || type === 'marketplace') return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isCurrentlyActive = userReaction === reactionType;
    const newReaction = isCurrentlyActive ? null : reactionType;
    const delta = isCurrentlyActive ? -1 : 1;
    
    setUserReaction(newReaction);
    setLikeCount(prev => Math.max(0, prev + delta));

    try {
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: post.id, reaction_type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setLikeCount(response.data.like_count);
        setUserReaction(response.data.reaction?.reaction_type || null);
      }
    } catch (error) {
      setUserReaction(userReaction);
      setLikeCount(prev => isCurrentlyActive ? prev + 1 : prev - 1);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (type === 'marketplace') return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isCurrentlyLiked = likedComments[commentId];
    setLikedComments(prev => ({ ...prev, [commentId]: !isCurrentlyLiked }));

    try {
      await axios.post(
        `${API_ROUTE}/comment/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setLikedComments(prev => ({ ...prev, [commentId]: isCurrentlyLiked }));
    }
  };

  const handleDeleteComment = async (commentId, parentId = null) => {
    if (type === 'marketplace') return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const endpoint = parentId 
                ? `${API_ROUTE}/comment-reply/${commentId}/delete/`
                : `${API_ROUTE}/comment/${commentId}/delete/`;
              
              await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (parentId) {
                setComments(prev => prev.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: comment.replies?.filter(r => r.id !== commentId),
                      reply_count: (comment.reply_count || 0) - 1
                    };
                  }
                  return comment;
                }));
              } else {
                setComments(prev => prev.filter(c => c.id !== commentId));
                setCommentCount(prev => prev - 1);
              }
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          }
        }
      ]
    );
  };

  const handleReply = (commentId, username) => {
    if (type === 'marketplace') return;
    
    setReplyToCommentId(commentId);
    setReplyToUsername(username);
    setNewComment(`@${username} `);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post || type === 'marketplace') return;
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    const isReply = replyToCommentId !== null;
    
    const userData = await AsyncStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const userName = parsedUser?.name || parsedUser?.username || 'You';

    const tempId = `temp_${Date.now()}`;
    const cleanText = isReply ? newComment.replace(`@${replyToUsername} `, '').trim() : newComment.trim();
    
    const optimisticComment = {
      id: tempId,
      text: cleanText,
      created_at: new Date().toISOString(),
      user: {
        id: parsedUser?.id,
        username: userName,
        profile_picture: parsedUser?.profile_picture,
        is_verified: false
      },
      user_details: {
        id: parsedUser?.id,
        username: userName,
        profile_picture: parsedUser?.profile_picture,
        is_verified: false
      },
      like_count: 0,
      is_liked: false,
      replies: []
    };

    if (isReply) {
      setComments(prev => prev.map(comment => {
        if (comment.id === replyToCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), optimisticComment],
            reply_count: (comment.reply_count || 0) + 1
          };
        }
        return comment;
      }));
    } else {
      setComments(prev => [optimisticComment, ...prev]);
      setCommentCount(prev => prev + 1);
    }

    setNewComment('');
    setReplyToCommentId(null);
    setReplyToUsername('');

    try {
      const endpoint = isReply
        ? `${API_ROUTE}/comment/${replyToCommentId}/reply/`
        : `${API_ROUTE}/posts-comment/${post.id}/comments/`;
      
      const payload = isReply
        ? { text: cleanText }
        : { text: cleanText, post: post.id };

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        if (isReply) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyToCommentId) {
              return {
                ...comment,
                replies: comment.replies.map(r => r.id === tempId ? response.data : r)
              };
            }
            return comment;
          }));
        } else {
          setComments(prev => prev.map(c => c.id === tempId ? response.data : c));
          if (response.data.comment_count !== undefined) {
            setCommentCount(response.data.comment_count);
          }
        }

        if (response.data.reward) {
          Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      if (isReply) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(r => r.id !== tempId),
              reply_count: (comment.reply_count || 0) - 1
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => prev.filter(c => c.id !== tempId));
        setCommentCount(prev => prev - 1);
      }
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleShare = async () => {
    if (type === 'marketplace') return;
    
    try {
      await Share.share({
        message: `Check out this post: ${post.content || post.title || 'My post'}`,
        title: 'Share Post'
      });
      
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: post.id, reaction_type: 'share' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setShareCount(response.data.share_count);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  const renderCommentItem = (comment, level = 0) => {
    if (type === 'marketplace') return null;
    
    const getUserData = () => {
      if (comment.user_details) {
        return {
          id: comment.user_details.id,
          username: comment.user_details.username || comment.username,
          name: comment.user_details.name || comment.user_details.username,
          profile_picture: comment.user_details.profile_picture,
          is_verified: comment.user_details.is_verified || false
        };
      }
      if (comment.user && typeof comment.user === 'object') {
        return {
          id: comment.user.id,
          username: comment.user.username || comment.user.name,
          name: comment.user.name || comment.user.username,
          profile_picture: comment.user.profile_picture,
          is_verified: comment.user.is_verified || false
        };
      }
      return {
        id: comment.user_id || comment.user,
        username: comment.username || 'Anonymous',
        name: comment.username || comment.name || 'Anonymous',
        profile_picture: comment.profile_picture || comment.image,
        is_verified: comment.is_verified || false
      };
    };

    const userData = getUserData();
    const isOwnComment = userData.id === currentUserId;
    const isLiked = comment.is_liked || likedComments[comment.id] || false;
    const replies = comment.replies || [];
    const profilePicUrl = userData.profile_picture 
      ? getImageUrl(userData.profile_picture)
      : null;
    
    return (
      <View key={comment.id} style={[styles.commentItem, { marginLeft: level * 20 }]}>
        <View style={styles.commentRow}>
          <Image
            source={
              profilePicUrl
                ? { uri: profilePicUrl }
                : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.commentAvatar}
          />
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUserInfo}>
                <Text style={[styles.commentUsername, { color: colors.text }]}>
                  {userData.name || userData.username}
                </Text>
                {userData.is_verified && (
                  <Icon name="checkmark-circle" size={14} color="#4CAF50" />
                )}
                <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
                  {dayjs(comment.created_at).fromNow()}
                </Text>
              </View>
              
              {isOwnComment && (
                <TouchableOpacity
                  onPress={() => handleDeleteComment(comment.id, comment.parent_comment || comment.parent)}
                  style={styles.commentDeleteButton}
                >
                  <Icon name="trash-outline" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={[styles.commentText, { color: colors.text }]}>
              {comment.text}
            </Text>
            
            <View style={styles.commentActions}>
              <TouchableOpacity 
                style={styles.commentActionButton}
                onPress={() => handleCommentLike(comment.id)}
              >
                <Icon 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={14} 
                  color={isLiked ? colors.primary : colors.textSecondary} 
                />
                {comment.like_count > 0 && (
                  <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                    {comment.like_count}
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.commentActionButton}
                onPress={() => handleReply(comment.id, userData.username)}
              >
                <Icon name="chatbubble-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>

            {replies.length > 0 && (
              <View style={styles.repliesSection}>
                {replies.map(reply => renderCommentItem(reply, level + 1))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!post) return null;

  const imageUrl = type === 'marketplace' && post.images && post.images.length > 0 
    ? getImageUrl(post.images[0].image)
    : post.image_url ? getImageUrl(post.image_url) : null;

  const getAvatarUrl = () => {
    if (type === 'marketplace') {
      if (sellerProfilePic) return sellerProfilePic;
      if (post.seller_profile_picture) return getImageUrl(post.seller_profile_picture);
      if (post.user_profile_picture) return getImageUrl(post.user_profile_picture);
      if (post.user?.profile_picture) return getImageUrl(post.user?.profile_picture);
      return null;
    } else {
      if (post.user_profile_picture) return getImageUrl(post.user_profile_picture);
      if (post.user?.profile_picture) return getImageUrl(post.user?.profile_picture);
      return null;
    }
  };

  const avatarUrl = getAvatarUrl();
  
  const getDisplayName = () => {
    if (type === 'marketplace') {
      return sellerInfo?.name || post.seller_name || post.username || post.user?.name || 'Seller';
    }
    return post.username || post.user?.name || 'User';
  };

  const sellerName = getDisplayName();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.bottomSheetOverlay}>
        <Pressable style={styles.bottomSheetBackdrop} onPress={onClose} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View 
            style={[
              styles.bottomSheetContainer,
              { 
                backgroundColor: colors.card,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.bottomSheetHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
              <TouchableOpacity onPress={onClose} style={styles.bottomSheetCloseButton}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bottomSheetContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.bottomSheetHeader}>
                <View style={styles.userInfo}>
                  <Image
                    source={
                      avatarUrl
                        ? { uri: avatarUrl }
                        : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
                    }
                    style={styles.userAvatar}
                  />
                  <View>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {sellerName}
                    </Text>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                      {formatDate(post.created || post.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              {type === 'marketplace' && (
                <>
                  <Text style={[styles.postTitle, { color: colors.text }]}>
                    {post.title || 'No Title'}
                  </Text>
                  
                  <View style={styles.priceLocationRow}>
                    <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>
                      ₦{parseFloat(post.price || 0).toLocaleString()}
                    </Text>
                    {post.location && (
                      <View style={styles.locationChip}>
                        <Icon name="location-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.locationChipText, { color: colors.textSecondary }]}>
                          {post.location}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {post.category_name && (
                    <View style={styles.categoryChip}>
                      <Icon name="pricetag-outline" size={14} color={colors.primary} />
                      <Text style={[styles.categoryChipText, { color: colors.primary }]}>
                        {post.category_name}
                      </Text>
                    </View>
                  )}
                  
                  {post.description && (
                    <Text style={[styles.postText, { color: colors.text }]}>
                      {post.description}
                    </Text>
                  )}
                </>
              )}

              {type !== 'marketplace' && post.content && (
                <Text style={[styles.postText, { color: colors.text }]}>
                  {post.content}
                </Text>
              )}

              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              )}

              {type !== 'marketplace' && (
                <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                  </Text>
                  <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                    {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                  </Text>
                  <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                    {shareCount} {shareCount === 1 ? 'share' : 'shares'}
                  </Text>
                </View>
              )}

              {type === 'marketplace' ? (
                <View style={styles.marketplaceActionButtons}>
                  <TouchableOpacity 
                    style={[styles.messageSellerButton, { backgroundColor: colors.primary }]}
                    onPress={handleMessageSeller}
                  >
                    <Icon name="chatbubble-outline" size={22} color="#fff" />
                    <Text style={styles.messageSellerButtonText}>Message Seller</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleReaction('like')}
                  >
                    <Icon 
                      name={userReaction === 'like' ? 'heart' : 'heart-outline'} 
                      size={24} 
                      color={userReaction === 'like' ? '#ff6b6b' : colors.textSecondary} 
                    />
                    {likeCount > 0 && (
                      <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                        {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="chatbubble-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                      Comment
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleShare}
                  >
                    <Icon name="share-social-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {type !== 'marketplace' && (
                <View style={styles.commentsSection}>
                  <Text style={[styles.commentsTitle, { color: colors.text }]}>
                    Comments ({commentCount})
                  </Text>
                  
                  {loadingComments ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : comments.length === 0 ? (
                    <Text style={[styles.noComments, { color: colors.textSecondary }]}>
                      No comments yet. Be the first to comment!
                    </Text>
                  ) : (
                    comments.map(comment => renderCommentItem(comment))
                  )}
                </View>
              )}
              
              <View style={{ height: 80 }} />
            </ScrollView>

            {type !== 'marketplace' && (
              <>
                {replyToCommentId && (
                  <View style={[styles.replyingBar, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                      Replying to @{replyToUsername}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      setReplyToCommentId(null);
                      setReplyToUsername('');
                      setNewComment('');
                    }}>
                      <Icon name="close" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={[styles.commentInputWrapper, { borderTopColor: colors.border }]}>
                  <TextInput
                    style={[styles.commentInput, { 
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.text
                    }]}
                    placeholder={replyToCommentId ? "Write a reply..." : "Write a comment..."}
                    placeholderTextColor={colors.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity 
                    style={[styles.postCommentButton, { 
                      backgroundColor: newComment.trim() ? colors.primary : colors.textSecondary + '40'
                    }]}
                    onPress={handleCommentSubmit}
                    disabled={!newComment.trim()}
                  >
                    <Icon name="send" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ==================== FULL VIDEO MODAL ====================
const FullVideoModal = ({ visible, video, onClose, colors, navigation }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible && video) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      
      setLiked(video.is_liked || false);
      setSaved(video.is_saved || false);
      setLikeCount(video.like_count || 0);
      setCommentCount(video.comment_count || 0);
      fetchComments();
      fetchCurrentUser();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setIsPlaying(false);
    }
  }, [visible, video]);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUserId(parsed.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No access token found');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchComments = async () => {
    if (!video) return;
    try {
      const headers = await getAuthHeader();
      const response = await axios.get(
        `${API_ROUTE}/shorts/${video.id}/comments/`,
        { headers }
      );
      
      if (response.status === 200) {
        const commentsData = response.data.results || response.data;
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  };

  const handleLike = async () => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = liked;
      
      setLiked(!isCurrentlyLiked);
      setLikeCount(prev => isCurrentlyLiked ? prev - 1 : prev + 1);
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/unlike/`, {}, { headers });
      }
    } catch (error) {
      setLiked(liked);
      setLikeCount(likeCount);
      console.error('Like error:', error);
    }
  };

  const handleSave = async () => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlySaved = saved;
      
      setSaved(!isCurrentlySaved);
      
      if (!isCurrentlySaved) {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/save/`, {}, { headers });
        Alert.alert('Saved', 'Video saved to your collection');
      } else {
        await axios.post(`${API_ROUTE}/shorts/${video.id}/unsave/`, {}, { headers });
        Alert.alert('Removed', 'Video removed from saved');
      }
    } catch (error) {
      setSaved(saved);
      console.error('Save error:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video: ${video.caption || video.title || 'My video'}`,
        title: 'Share Video'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyLiked = likedComments[commentId];
      
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isCurrentlyLiked,
      }));
      
      if (!isCurrentlyLiked) {
        await axios.post(`${API_ROUTE}/comments/${commentId}/like/`, {}, { headers });
      } else {
        await axios.post(`${API_ROUTE}/comments/${commentId}/unlike/`, {}, { headers });
      }
    } catch (error) {
      setLikedComments(prev => ({
        ...prev,
        [commentId]: likedComments[commentId],
      }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !video) return;
    
    try {
      const headers = await getAuthHeader();
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      const tempId = `temp_${Date.now()}`;
      const optimisticComment = {
        id: tempId,
        text: commentText.trim(),
        created_at: new Date().toISOString(),
        user: {
          id: parsedUser?.id,
          username: parsedUser?.name || parsedUser?.username || 'You',
          profile_picture: parsedUser?.profile_picture
        },
        likes_count: 0,
        is_liked: false
      };
      
      setComments(prev => [optimisticComment, ...prev]);
      setCommentCount(prev => prev + 1);
      setCommentText('');
      
      const response = await axios.post(
        `${API_ROUTE}/shorts/${video.id}/comments/`,
        { text: commentText.trim() },
        { headers }
      );
      
      if (response.status === 201) {
        setComments(prev => prev.map(c => c.id === tempId ? response.data : c));
        if (response.data.reward) {
          Alert.alert('💬 Reward!', `You earned ${response.data.reward.coins} coins!`);
        }
      }
    } catch (error) {
      setComments(prev => prev.filter(c => !c.id.toString().startsWith('temp_')));
      setCommentCount(prev => prev - 1);
      console.error('Post comment error:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const headers = await getAuthHeader();
              await axios.delete(`${API_ROUTE}/comments/${commentId}/`, { headers });
              setComments(prev => prev.filter(c => c.id !== commentId));
              setCommentCount(prev => prev - 1);
            } catch (error) {
              console.error('Delete comment error:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          }
        }
      ]
    );
  };

  const handleUserPress = (userId) => {
    onClose();
    navigation.navigate('OtherUserProfile', { userId });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!video) return null;

  const profilePic = video.user?.profile_picture 
    ? getImageUrl(video.user.profile_picture)
    : null;
  const username = video.user?.username || video.username || 'User';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.fullVideoOverlay}>
        <Pressable style={styles.fullVideoBackdrop} onPress={onClose} />
        
        <Animated.View 
          style={[
            styles.fullVideoContainer,
            { 
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.fullVideoHeader}>
            <TouchableOpacity onPress={onClose} style={styles.fullVideoCloseButton}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullVideoTitle}>Video</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fullVideoContent}
          >
            <View style={styles.fullVideoPlayerWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowControls(!showControls)}
                style={styles.fullVideoPlayerTouchable}
              >
                <Video
                  ref={videoRef}
                  source={{ uri: convertToHttps(video.video) }}
                  style={styles.fullVideoPlayer}
                  resizeMode="contain"
                  repeat={true}
                  muted={isMuted}
                  paused={!isPlaying}
                  rate={PLAYBACK_RATE}
                  onLoadStart={() => setIsLoading(true)}
                  onLoad={(data) => {
                    setIsLoading(false);
                    setDuration(data.duration);
                  }}
                  onProgress={(data) => setProgress(data.currentTime)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                />
                
                {isLoading && (
                  <View style={styles.fullVideoLoading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
                
                {hasError && (
                  <View style={styles.fullVideoError}>
                    <Icon name="alert-circle" size={50} color="#ff6b6b" />
                    <Text style={styles.fullVideoErrorText}>Failed to load video</Text>
                  </View>
                )}
                
                {showControls && !isLoading && !hasError && (
                  <View style={styles.fullVideoControls}>
                    <TouchableOpacity 
                      onPress={() => setIsPlaying(!isPlaying)}
                      style={styles.fullVideoPlayPause}
                    >
                      <Icon 
                        name={isPlaying ? 'pause' : 'play'} 
                        size={50} 
                        color="#fff" 
                      />
                    </TouchableOpacity>
                    
                    <View style={styles.fullVideoProgressContainer}>
                      <View style={styles.fullVideoProgressBar}>
                        <View 
                          style={[
                            styles.fullVideoProgressFill,
                            { width: `${(progress / duration) * 100}%` }
                          ]} 
                        />
                      </View>
                      <View style={styles.fullVideoTimeContainer}>
                        <Text style={styles.fullVideoTimeText}>{formatTime(progress)}</Text>
                        <Text style={styles.fullVideoTimeText}>{formatTime(duration)}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => setIsMuted(!isMuted)}
                      style={styles.fullVideoMute}
                    >
                      <Icon 
                        name={isMuted ? 'volume-mute' : 'volume-high'} 
                        size={24} 
                        color="#fff" 
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.fullVideoInfoSection}>
              <View style={styles.fullVideoUserInfo}>
                <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
                  }
                  style={styles.fullVideoAvatar}
                />
                <View style={styles.fullVideoUserText}>
                  <Text style={[styles.fullVideoUsername, { color: colors.text }]}>
                    {username}
                  </Text>
                  <Text style={[styles.fullVideoStats, { color: colors.textSecondary }]}>
                    {formatNumber(video.view_count || 0)} views • {dayjs(video.created_at).fromNow()}
                  </Text>
                </View>
              </View>
              
              {video.caption && (
                <Text style={[styles.fullVideoCaption, { color: colors.text }]}>
                  {video.caption}
                </Text>
              )}
              
              <View style={styles.fullVideoActions}>
                <TouchableOpacity style={styles.fullVideoActionButton} onPress={handleLike}>
                  <Icon 
                    name={liked ? 'heart' : 'heart-outline'} 
                    size={28} 
                    color={liked ? '#ff6b6b' : colors.textSecondary} 
                  />
                  {likeCount > 0 && (
                    <Text style={[styles.fullVideoActionText, { color: colors.textSecondary }]}>
                      {formatNumber(likeCount)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fullVideoActionButton}>
                  <Icon name="chatbubble-outline" size={28} color={colors.textSecondary} />
                  {commentCount > 0 && (
                    <Text style={[styles.fullVideoActionText, { color: colors.textSecondary }]}>
                      {formatNumber(commentCount)}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fullVideoActionButton} onPress={handleSave}>
                  <Icon 
                    name={saved ? 'bookmark' : 'bookmark-outline'} 
                    size={28} 
                    color={saved ? colors.primary : colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.fullVideoActionButton} onPress={handleShare}>
                  <Icon name="share-social-outline" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.fullVideoCommentsSection}>
                <Text style={[styles.fullVideoCommentsTitle, { color: colors.text }]}>
                  Comments ({commentCount})
                </Text>
                
                {comments.length === 0 ? (
                  <Text style={[styles.fullVideoNoComments, { color: colors.textSecondary }]}>
                    No comments yet. Be the first to comment!
                  </Text>
                ) : (
                  comments.map(comment => {
                    const commentUser = comment.user || {};
                    const isOwnComment = commentUser.id === currentUserId;
                    const isLiked = likedComments[comment.id];
                    const profilePicComment = commentUser.profile_picture 
                      ? getImageUrl(commentUser.profile_picture)
                      : null;
                    
                    return (
                      <View key={comment.id} style={styles.fullVideoCommentItem}>
                        <TouchableOpacity onPress={() => handleUserPress(commentUser.id)}>
                          <Image
                            source={
                              profilePicComment
                                ? { uri: profilePicComment }
                                : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
                            }
                            style={styles.fullVideoCommentAvatar}
                          />
                        </TouchableOpacity>
                        
                        <View style={styles.fullVideoCommentContent}>
                          <View style={styles.fullVideoCommentHeader}>
                            <TouchableOpacity onPress={() => handleUserPress(commentUser.id)}>
                              <Text style={[styles.fullVideoCommentUsername, { color: colors.text }]}>
                                {commentUser.username || commentUser.name || 'User'}
                              </Text>
                            </TouchableOpacity>
                            <Text style={[styles.fullVideoCommentTime, { color: colors.textSecondary }]}>
                              {dayjs(comment.created_at).fromNow()}
                            </Text>
                          </View>
                          
                          <Text style={[styles.fullVideoCommentText, { color: colors.text }]}>
                            {comment.text}
                          </Text>
                          
                          <View style={styles.fullVideoCommentActions}>
                            <TouchableOpacity 
                              onPress={() => handleCommentLike(comment.id)}
                              style={styles.fullVideoCommentAction}
                            >
                              <Icon 
                                name={isLiked ? 'heart' : 'heart-outline'} 
                                size={14} 
                                color={isLiked ? '#ff6b6b' : colors.textSecondary} 
                              />
                              {comment.likes_count > 0 && (
                                <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary }]}>
                                  {comment.likes_count}
                                </Text>
                              )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              onPress={() => {
                                setReplyToCommentId(comment.id);
                                setReplyToUsername(commentUser.username);
                                setCommentText(`@${commentUser.username} `);
                              }}
                              style={styles.fullVideoCommentAction}
                            >
                              <Icon name="chatbubble-outline" size={14} color={colors.textSecondary} />
                              <Text style={[styles.fullVideoCommentActionText, { color: colors.textSecondary }]}>
                                Reply
                              </Text>
                            </TouchableOpacity>
                            
                            {isOwnComment && (
                              <TouchableOpacity 
                                onPress={() => handleDeleteComment(comment.id)}
                                style={styles.fullVideoCommentAction}
                              >
                                <Icon name="trash-outline" size={14} color={colors.textSecondary} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
              
              <View style={{ height: 100 }} />
            </View>
          </ScrollView>
          
          {replyToCommentId && (
            <View style={[styles.fullVideoReplyingBar, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.fullVideoReplyingText, { color: colors.textSecondary }]}>
                Replying to @{replyToUsername}
              </Text>
              <TouchableOpacity onPress={() => {
                setReplyToCommentId(null);
                setReplyToUsername('');
                setCommentText('');
              }}>
                <Icon name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.fullVideoCommentInput, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.fullVideoInput, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text
              }]}
              placeholder={replyToCommentId ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.fullVideoSendButton, { 
                backgroundColor: commentText.trim() ? colors.primary : colors.textSecondary + '40'
              }]}
              onPress={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ==================== MAIN USER PROFILE COMPONENT ====================
const UserProfile = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const userIdFromParams = route.params?.userId;
  
  const [selectedTab, setSelectedTab] = useState('posts');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState({
    visible: false,
    src: '',
    type: 'profile',
  });
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0
  });

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);

  const [profileData, setProfileData] = useState({
    user: null,
    recent_content: {
      listings: [],
      posts: [],
      videos: []
    },
    stats: {
      followers_count: 0,
      following_count: 0,
      is_following: false,
      listings_count: 0,
      posts_count: 0,
      videos_count: 0
    }
  });

  const [userProfileImage, setUserProfileImage] = useState('');
  const [userCoverImage, setUserCoverImage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [catalogsCount, setCatalogsCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const scrollViewRef = useRef(null);
  const catalogRef = useRef(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && selectedTab === 'videos') {
      const visibleItem = viewableItems[0];
      setPlayingVideoId(visibleItem.item.id);
    } else {
      setPlayingVideoId(null);
    }
  }, [selectedTab]);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged }
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

    if (!token) {
      navigation.navigate('Login');
      return;
    }

    let response;
    try {
      response = await axios.get(`${API_ROUTE}/users/${targetUserId}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (!userIdFromParams) {
        response = await axios.get(`${API_ROUTE}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    if (response?.status === 200) {
      const data = response.data;
      setProfileData(data);
      
      // Extract follow stats from profile data
      if (data.stats) {
        setIsFollowing(data.stats.is_following || false);
        setFollowStats({
          followers_count: data.stats.followers_count || 0,
          following_count: data.stats.following_count || 0
        });
        console.log('Profile stats from user data:', {
          followers: data.stats.followers_count,
          following: data.stats.following_count
        });
        setFollowers(data.stats.followers_count)
        setFollowing(data.stats.following_count)
      }

      if (data.user?.profile_picture) {
        const profileImageUrl = getImageUrl(data.user.profile_picture);
        setUserProfileImage(profileImageUrl);
      }

      if (data.user?.cover_photo) {
        const coverImageUrl = getImageUrl(data.user.cover_photo);
        setUserCoverImage(coverImageUrl);
      }

      if (data.recent_content) {
        if (data.recent_content.listings) {
          const processedListings = data.recent_content.listings.map(item => ({
            ...item,
            images: Array.isArray(item.images)
              ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
              : []
          }));
          setMarketplacePosts(processedListings);
        }

        if (data.recent_content.posts) {
          const processedPosts = data.recent_content.posts.map(item => ({
            ...item,
            image_url: getImageUrl(item.image_url || item.image)
          }));
          setTweets(processedPosts);
        }

        if (data.recent_content.videos) {
          const processedVideos = data.recent_content.videos.map(item => ({
            ...item,
            video_url: getImageUrl(item.video_url || item.video),
            video: getImageUrl(item.video_url || item.video),
            thumbnail_url: getImageUrl(item.thumbnail_url || item.thumbnail)
          }));
          setUserVideos(processedVideos);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

  const fetchFollowStats = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
    
    console.log('Fetching follow stats for user:', targetUserId);
    
    const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-stats/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Follow stats response:', response.data);

    if (response.status === 200) {
      const newStats = {
        followers_count: response.data.followers_count || 0,
        following_count: response.data.following_count || 0
      };
      
      setFollowStats(newStats);
      
      // Also update profileData stats
      setProfileData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers_count: response.data.followers_count || 0,
          following_count: response.data.following_count || 0
        }
      }));
      
      return newStats;
    }
  } catch (error) {
    console.error('Error fetching follow stats:', error);
    // Fallback to profile data stats
    if (profileData.stats) {
      setFollowStats({
        followers_count: profileData.stats.followers_count || 0,
        following_count: profileData.stats.following_count || 0
      });
    }
  }
};

  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));

      if (userIdFromParams) {
        try {
          const tweetsRes = await axios.get(`${API_ROUTE}/user-posts/${targetUserId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let postsData = tweetsRes.data?.data || 
                         (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
                         tweetsRes.data?.results || tweetsRes.data || []);
          const processedTweets = postsData.map(item => ({
            ...item,
            image_url: getImageUrl(item.image_url || item.image)
          }));
          setTweets(processedTweets);
        } catch (error) {
          if (profileData.recent_content?.posts) {
            setTweets(profileData.recent_content.posts);
          }
        }

        try {
          const videosRes = await axios.get(`${API_ROUTE}/user-shorts/${targetUserId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let videosData = [];
          if (videosRes.data.data) {
            videosData = videosRes.data.data;
          } else if (Array.isArray(videosRes.data)) {
            videosData = videosRes.data;
          } else if (videosRes.data.results) {
            videosData = videosRes.data.results;
          }
          
          const processedVideos = videosData.map(item => ({
            ...item,
            id: item.id,
            video_url: getImageUrl(item.video),
            video: getImageUrl(item.video),
            thumbnail_url: item.thumbnail_url ? getImageUrl(item.thumbnail_url) : null,
            user: item.user,
            caption: item.caption,
            like_count: item.like_count || 0,
            comment_count: item.comment_count || 0,
            view_count: item.view_count || 0,
            created_at: item.created_at,
            is_liked: item.is_liked || false,
            comments: item.comments || []
          }));
          setUserVideos(processedVideos);
        } catch (error) {
          console.error('Error fetching videos:', error);
          if (profileData.recent_content?.videos) {
            setUserVideos(profileData.recent_content.videos);
          }
        }

        try {
          const marketplaceRes = await axios.get(`${API_ROUTE}/user-listings/${targetUserId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let listingsData = marketplaceRes.data?.data || 
                            (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
                            marketplaceRes.data?.results || marketplaceRes.data || []);
          const processedPosts = listingsData.map(item => ({
            ...item,
            images: Array.isArray(item.images)
              ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
              : []
          }));
          setMarketplacePosts(processedPosts);
        } catch (error) {
          console.error('Error fetching listings:', error);
          if (profileData.recent_content?.listings) {
            setMarketplacePosts(profileData.recent_content.listings);
          }
        }
      } else {
        try {
          const tweetsRes = await axios.get(`${API_ROUTE}/my-posts/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let postsData = tweetsRes.data?.data || 
                         (Array.isArray(tweetsRes.data) ? tweetsRes.data : 
                         tweetsRes.data?.results || tweetsRes.data || []);
          const processedTweets = postsData.map(item => ({
            ...item,
            image_url: getImageUrl(item.image_url || item.image)
          }));
          setTweets(processedTweets);
        } catch (error) {
          setTweets([]);
        }
        
        try {
          const videosRes = await axios.get(`${API_ROUTE}/my-shorts/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let videosData = [];
          if (videosRes.data.data) {
            videosData = videosRes.data.data;
          } else if (Array.isArray(videosRes.data)) {
            videosData = videosRes.data;
          } else if (videosRes.data.results) {
            videosData = videosRes.data.results;
          }
          
          const processedVideos = videosData.map(item => ({
            ...item,
            id: item.id,
            video_url: getImageUrl(item.video),
            video: getImageUrl(item.video),
            thumbnail_url: item.thumbnail_url ? getImageUrl(item.thumbnail_url) : null,
            user: item.user,
            caption: item.caption,
            like_count: item.like_count || 0,
            comment_count: item.comment_count || 0,
            view_count: item.view_count || 0,
            created_at: item.created_at,
            is_liked: item.is_liked || false,
            comments: item.comments || []
          }));
          setUserVideos(processedVideos);
        } catch (error) {
          setUserVideos([]);
        }

        try {
          const marketplaceRes = await axios.get(`${API_ROUTE}/my-listings/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let listingsData = marketplaceRes.data?.data || 
                            (Array.isArray(marketplaceRes.data) ? marketplaceRes.data : 
                            marketplaceRes.data?.results || marketplaceRes.data || []);
          const processedPosts = listingsData.map(item => ({
            ...item,
            images: Array.isArray(item.images)
              ? item.images.map(img => ({ ...img, image: getImageUrl(img.image) }))
              : []
          }));
          setMarketplacePosts(processedPosts);
        } catch (error) {
          setMarketplacePosts([]);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserPosts:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!userIdFromParams) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams;
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/follow-status/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setIsFollowing(response.data.is_following);
        setFollowId(response.data.follow_id);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const checkIfUserIsBlocked = async () => {
    if (!userIdFromParams) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_ROUTE}/check-block/${userIdFromParams}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsBlocked(response.data.is_blocked); 
      }
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };

  const fetchFollowersList = async () => {
    setLoadingFollowers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/followers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setFollowersList(response.data.followers || []);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      setFollowersList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingList = async () => {
    setLoadingFollowers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = userIdFromParams || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/users/${targetUserId}/following/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setFollowingList(response.data.following || []);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      setFollowingList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/follow/`, {
        following_user: userIdFromParams
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setIsFollowing(true);
        setFollowId(response.data.follow_id);
        
        await fetchFollowStats();
        
        setFollowStats(prev => ({
          ...prev,
          followers_count: prev.followers_count + 1
        }));
        
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: (prev.stats?.followers_count || 0) + 1,
            is_following: true
          }
        }));
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.post(`${API_ROUTE}/unfollow/`, {
        following_user: userIdFromParams
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setIsFollowing(false);
        setFollowId(null);
        
        await fetchFollowStats();
        
        setFollowStats(prev => ({
          ...prev,
          followers_count: Math.max(0, prev.followers_count - 1)
        }));
        
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers_count: Math.max(0, (prev.stats?.followers_count || 0) - 1),
            is_following: false
          }
        }));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to unfollow user');
    }
  };

  const handleReportUser = async () => {
    if (!reportReason) {
      Alert.alert('Reason Required', 'Please select a reason for reporting this user.');
      return;
    }

    setReportLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/report/${userIdFromParams}/`,
        { reason: reportReason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Report Submitted',
          'Thank you for reporting. We will review this user and take appropriate action.'
        );
        setReportModalVisible(false);
        setReportReason('');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  const handleBlockUser = async () => {
    setBlockLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/block/${userIdFromParams}/`,
        { blocked_user_id: userIdFromParams },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        setIsBlocked(true);
        Alert.alert(
          'User Blocked',
          'You have successfully blocked this user. They will no longer be able to interact with you.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setBlockModalVisible(false);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      Alert.alert('Error', 'Failed to block user. Please try again.');
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    setBlockLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/unblock-user/${userIdFromParams}/`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsBlocked(false);
        Alert.alert('User Unblocked', 'You have successfully unblocked this user.');
        setOptionsModalVisible(false);
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      Alert.alert('Error', 'Failed to unblock user. Please try again.');
    } finally {
      setBlockLoading(false);
    }
  };

  const refreshAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchFollowStats(),
        fetchUserPosts(),
        userIdFromParams && checkFollowStatus()
      ]);
      if (catalogRef.current?.refreshCatalogs) {
        catalogRef.current.refreshCatalogs();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const openPostDetail = (item, type) => {
    setSelectedPost(item);
    setSelectedPostType(type);
    setBottomSheetVisible(true);
  };

  const closePostDetail = () => {
    setBottomSheetVisible(false);
    setSelectedPost(null);
    setSelectedPostType(null);
  };

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchUserData();
      await fetchFollowStats(); 
      await fetchUserPosts();
      if (userIdFromParams) {
        await checkFollowStatus();
        await checkIfUserIsBlocked();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [userIdFromParams]);
  

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const FollowItem = ({ item, type, onFollowAction }) => {
    const [isFollowingUser, setIsFollowingUser] = useState(item.is_following || false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
      const getCurrentUser = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId ? parseInt(userId) : null);
      };
      getCurrentUser();
    }, []);

    const handleFollowAction = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (isFollowingUser) {
          await axios.post(`${API_ROUTE}/unfollow/`, {
            following_user: item.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFollowingUser(false);
        } else {
          await axios.post(`${API_ROUTE}/follow/`, {
            following_user: item.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFollowingUser(true);
        }
        
        if (type === 'followers') await fetchFollowersList();
        if (type === 'following') await fetchFollowingList();
        
        if (onFollowAction) {
          onFollowAction();
        }
      } catch (error) {
        console.error('Error in follow action:', error);
      }
    };

    const showFollowButton = () => {
      if (currentUserId && item.id === currentUserId) return false;
      return true;
    };

    return (
      <View style={[styles.followItem, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.followItemLeft}
          onPress={() => {
            if (type === 'followers') setFollowersModalVisible(false);
            if (type === 'following') setFollowingModalVisible(false);
            navigation.push('OtherUserProfile', { userId: item.id });
          }}
        >
          <Image
            source={item.profile_picture ? { uri: getImageUrl(item.profile_picture) } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
            style={styles.followAvatar}
          />
          <View style={styles.followInfo}>
            <Text style={[styles.followName, { color: colors.text }]}>{item.name}</Text>
            {item.username && (
              <Text style={[styles.followUsername, { color: colors.textSecondary }]}>
                @{item.username}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {showFollowButton() && (
          <TouchableOpacity
            style={[
              styles.followActionButton, 
              isFollowingUser ? styles.followingButton : styles.followButtonn
            ]}
            onPress={handleFollowAction}
          >
            <Text style={[styles.followActionText, { color: isFollowingUser ? colors.text : '#fff' }]}>
              {isFollowingUser ? 'Following' : type === 'followers' ? 'Follow Back' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleCatalogDataLoaded = (data) => {
    setCatalogsCount(data.catalogs.length);
  };

  const handleViewAllCatalogs = () => {
    navigation.navigate('AllCatalogs', { userId: userIdFromParams });
  };

  const handleImageSelection = (type) => {
    Alert.alert('Coming Soon', 'Image upload functionality will be added soon.');
  };

  const getNumColumns = () => {
    if (selectedTab === 'videos') return 2;
    if (selectedTab === 'marketplace') return 2;
    return 3;
  };

  const getFlatListKey = () => {
    return `${selectedTab}-${getNumColumns()}`;
  };

  const renderGridItem = ({ item }) => {
    if (selectedTab === 'videos') {
      return (
        <VideoGridItem
          item={item}
          onPress={() => openPostDetail(item, selectedTab)}
          colors={colors}
          isPlaying={playingVideoId === item.id}
        />
      );
    } else if (selectedTab === 'marketplace') {
      return (
        <MarketplaceGridItem
          item={item}
          onPress={() => openPostDetail(item, selectedTab)}
          colors={colors}
        />
      );
    } else {
      return (
        <PostGridItem
          item={item}
          onPress={() => openPostDetail(item, selectedTab)}
          colors={colors}
        />
      );
    }
  };

 const renderProfileHeader = () => (
  console.log('followStats after set:', followStats),

  <Animated.View style={[styles.profileHeader, { backgroundColor: colors.card, opacity: fadeAnim }]}>
    {/* Cover Image Section */}
    <TouchableOpacity
      onPress={() => userCoverImage && setFullScreenImage({ visible: true, src: userCoverImage, type: 'cover' })}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={userCoverImage ? { uri: userCoverImage } : require('../../assets/images/_gluster_2024_3_5_241efce82619d6785221985f79b3edf3_original.53958 (1).jpg')}
        style={styles.coverImage}
        resizeMode="cover"
      >
        {!userIdFromParams && !userCoverImage && (
          <TouchableOpacity
            style={[styles.addCoverButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.6)' }]}
            onPress={() => handleImageSelection('cover')}
          >
            <Icon name="camera-outline" size={24} color="#fff" />
            <Text style={styles.addCoverText}>Add Cover</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </TouchableOpacity>

    <View style={styles.profileInfoContainer}>
      <View style={styles.profileImageSection}>
        <TouchableOpacity
          onPress={() => userProfileImage && setFullScreenImage({ visible: true, src: userProfileImage, type: 'profile' })}
          style={styles.profileImageWrapper}
        >
          <Image
            source={userProfileImage ? { uri: userProfileImage } : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')}
            style={[styles.profileImage, { borderColor: colors.card }]}
          />
          {!userIdFromParams && (
            <TouchableOpacity
              style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
              onPress={() => handleImageSelection('profile')}
            >
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        
        <View style={styles.profileTextInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {profileData.user?.name || ''}
            </Text>
            {profileData.user?.is_verified && (
              <Icon name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedBadge} />
            )}
          </View>
          <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
            @{profileData.user?.username || profileData.user?.name?.toLowerCase().replace(/\s/g, '')}
          </Text>
        </View>
      </View>

      {profileData.user?.bio && (
        <Text style={[styles.profileBio, { color: colors.text }]}>
          {profileData.user.bio}
        </Text>
      )}

      {/* Stats Container - Using followStats state */}
      <View style={[styles.statsContainer, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => {
            fetchFollowingList();
            setFollowingModalVisible(true);
          }}
        >
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {formatNumber(following || 0  ) }
           
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Following
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => {
            fetchFollowersList();
            setFollowersModalVisible(true);
          }}
        >
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {followers || 0}
            
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Followers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {formatNumber(
              (profileData.stats?.posts_count || 0) + 
              (profileData.stats?.videos_count || 0) + 
              (profileData.stats?.listings_count || 0)
            )}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {!userIdFromParams ? (
          <>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="create-outline" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.settingsButton, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon name="settings-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.messageButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('PrivateChat', {
                receiverId: userIdFromParams,
                name: profileData.user?.name,
                chatType: 'single',
                profile_image: userProfileImage
              })}
            >
              <Icon name="chatbubble-outline" size={18} color="#fff" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.followButton, 
                isFollowing ? styles.followingButton : { borderColor: colors.primary }
              ]}
              onPress={isFollowing ? handleUnfollow : handleFollow}
            >
              <Icon 
                name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} 
                size={18} 
                color={isFollowing ? colors.text : colors.primary} 
              />
              <Text style={[
                styles.followButtonText, 
                { color: isFollowing ? colors.text : colors.primary }
              ]}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.additionalInfo}>
        {profileData.user?.country && (
          <View style={styles.infoItem}>
            <Icon name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {profileData.user.country}
            </Text>
          </View>
        )}
        {profileData.user?.date_of_birth && (
          <View style={styles.infoItem}>
            <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Birthday: {formatDate(profileData.user.date_of_birth)}
            </Text>
          </View>
        )}
      </View>
    </View>
  </Animated.View>
);


  const renderCatalogSection = () => (
    <View style={[styles.catalogSection, { backgroundColor: colors.card }]}>
      {profileData.user?.active_mode === 'business' && (
        <View style={styles.catalogHeader}>
          <View style={styles.catalogTitleContainer}>
            <Icon name="folder-outline" size={20} color={colors.primary} />
            <Text style={[styles.catalogTitle, { color: colors.text }]}>Catalogs</Text>
          </View>
          {catalogsCount > 0 && (
            <TouchableOpacity onPress={handleViewAllCatalogs} style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>See All Below</Text>
              <Icon name="chevron-down" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {profileData.user?.active_mode === 'business' && (
        <CatalogComponent
          ref={catalogRef}
          userId={userIdFromParams}
          businessId={userIdFromParams}
          horizontal={true}
          showHeader={false}
          showBusinessInfo={false}
          maxItems={5}
          navigation={navigation}
          containerStyle={styles.catalogContainer}
          onDataLoaded={handleCatalogDataLoaded}
        />
      )}
    </View>
  );

  const renderContent = () => {
    const currentData = () => {
      switch(selectedTab) {
        case 'posts': return tweets;
        case 'videos': return userVideos;
        case 'marketplace': return marketplacePosts;
        default: return [];
      }
    };

    const data = currentData();

    if (data.length === 0) {
      const getEmptyMessage = () => {
        if (selectedTab === 'posts') {
          return userIdFromParams ? "This user hasn't posted anything yet." : "You haven't posted anything yet.";
        }
        if (selectedTab === 'videos') {
          return userIdFromParams ? "This user hasn't uploaded any videos yet." : "You haven't uploaded any videos yet.";
        }
        return userIdFromParams ? "This user hasn't listed any items yet." : "You haven't listed any items yet.";
      };

      const getEmptyIcon = () => {
        if (selectedTab === 'posts') return 'chatbubble-outline';
        if (selectedTab === 'videos') return 'videocam-outline';
        return 'cart-outline';
      };

      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
          <Icon name={getEmptyIcon()} size={60} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {getEmptyMessage()}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        key={getFlatListKey()}
        data={data}
        renderItem={renderGridItem}
        keyExtractor={(item) => `${selectedTab}-${item.id}`}
        numColumns={getNumColumns()}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        maxToRenderPerBatch={12}
        windowSize={10}
        columnWrapperStyle={selectedTab === 'videos' || selectedTab === 'marketplace' ? styles.twoColumnRow : styles.threeColumnRow}
        viewabilityConfigCallbackPairs={
          selectedTab === 'videos' ? viewabilityConfigCallbackPairs.current : undefined
        }
        removeClippedSubviews={Platform.OS === 'android'}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {profileData.user?.name || 'Profile'}
        </Text>
        {userIdFromParams && (
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setOptionsModalVisible(true)}
          >
            <Icon name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        {!userIdFromParams && (
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <View style={{ width: 24 }} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef} 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAllData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderProfileHeader()}
        {renderCatalogSection()}
        
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'posts' && styles.tabActive, selectedTab === 'posts' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('posts')}
          >
            <Icon name="grid-outline" size={20} color={selectedTab === 'posts' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'posts' ? colors.primary : colors.textSecondary }]}>
              Posts ({tweets.length || profileData.stats?.posts_count || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'videos' && styles.tabActive, selectedTab === 'videos' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('videos')}
          >
            <Icon name="play-circle-outline" size={20} color={selectedTab === 'videos' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'videos' ? colors.primary : colors.textSecondary }]}>
              Videos ({userVideos.length || profileData.stats?.videos_count || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'marketplace' && styles.tabActive, selectedTab === 'marketplace' && { borderBottomColor: colors.primary }]}
            onPress={() => setSelectedTab('marketplace')}
          >
            <Icon name="cart-outline" size={20} color={selectedTab === 'marketplace' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: selectedTab === 'marketplace' ? colors.primary : colors.textSecondary }]}>
              Listings ({marketplacePosts.length || profileData.stats?.listings_count || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </ScrollView>

      {selectedPost && selectedTab !== 'videos' && (
        <PostDetailBottomSheet
          visible={bottomSheetVisible}
          post={selectedPost}
          onClose={closePostDetail}
          type={selectedPostType}
          colors={colors}
          navigation={navigation}
        />
      )}

      {selectedPost && selectedTab === 'videos' && (
        <FullVideoModal
          visible={bottomSheetVisible}
          video={selectedPost}
          onClose={closePostDetail}
          colors={colors}
          navigation={navigation}
        />
      )}

      {/* Options Modal */}
      <Modal
        visible={optionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.optionsSheet, { backgroundColor: colors.card }]}>
              <View style={styles.optionsDragHandle} />
              <View style={styles.optionsSheetHeader}>
                <View style={styles.optionsUserInfo}>
                  <Image
                    source={
                      userProfileImage
                        ? { uri: userProfileImage }
                        : require('../../assets/images/avatar/blank-profile-picture-973460_1280.png')
                    }
                    style={styles.optionsUserAvatar}
                  />
                  <View>
                    <Text style={[styles.optionsUserName, { color: colors.text }]}>
                      {profileData.user?.name || 'User'}
                    </Text>
                    <Text style={[styles.optionsUserHandle, { color: colors.textSecondary }]}>
                      @{profileData.user?.username || ''}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.optionsHeaderDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.optionsActionRow}
                onPress={() => {
                  setOptionsModalVisible(false);
                  setReportModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.optionsActionIcon, { backgroundColor: '#ff980015' }]}>
                  <Icon name="flag-outline" size={20} color="#ff9800" />
                </View>
                <View style={styles.optionsActionTextGroup}>
                  <Text style={[styles.optionsActionTitle, { color: colors.text }]}>
                    Report User
                  </Text>
                  <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
                    Report inappropriate content or behavior
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.optionsRowDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.optionsActionRow}
                onPress={() => {
                  setOptionsModalVisible(false);
                  if (isBlocked) {
                    Alert.alert(
                      'Unblock User',
                      `Are you sure you want to unblock ${profileData.user?.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Unblock', style: 'destructive', onPress: handleUnblockUser }
                      ]
                    );
                  } else {
                    setBlockModalVisible(true);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.optionsActionIcon, { backgroundColor: '#ff5c5c15' }]}>
                  <Icon
                    name={isBlocked ? 'lock-open-outline' : 'ban-outline'}
                    size={20}
                    color="#ff5c5c"
                  />
                </View>
                <View style={styles.optionsActionTextGroup}>
                  <View style={styles.optionsActionTitleRow}>
                    <Text style={[styles.optionsActionTitle, { color: '#ff5c5c' }]}>
                      {isBlocked ? 'Unblock User' : 'Block User'}
                    </Text>
                    {isBlocked && (
                      <View style={styles.optionsBlockedPill}>
                        <Text style={styles.optionsBlockedPillText}>Blocked</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.optionsActionSubtitle, { color: colors.textSecondary }]}>
                    {isBlocked
                      ? 'Allow this user to interact with you again'
                      : 'Prevent this user from messaging or viewing you'}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionsCancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}
                onPress={() => setOptionsModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionsCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }]}>
          <View style={[styles.reportModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.reportModalHeader}>
              <Text style={[styles.reportModalTitle, { color: colors.text }]}>Report User</Text>
              <TouchableOpacity onPress={() => { setReportModalVisible(false); setReportReason(''); }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.reportModalDescription, { color: colors.textSecondary }]}>
              Why are you reporting {profileData.user?.name}? Your report is anonymous.
            </Text>

            <Text style={[styles.reportSectionLabel, { color: colors.text }]}>Select a reason</Text>
            <View style={styles.reportReasonList}>
              {[
                { key: 'spam', label: 'Spam', icon: 'mail-unread-outline' },
                { key: 'abuse', label: 'Abuse', icon: 'alert-circle-outline' },
                { key: 'hate_speech', label: 'Hate Speech', icon: 'megaphone-outline' },
                { key: 'fake_account', label: 'Fake Account', icon: 'person-remove-outline' },
              ].map((reason) => (
                <TouchableOpacity
                  key={reason.key}
                  style={[
                    styles.reportReasonOption,
                    { borderColor: reportReason === reason.key ? '#ff9800' : colors.border },
                    reportReason === reason.key && styles.reportReasonOptionSelected,
                  ]}
                  onPress={() => setReportReason(reason.key)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.reportReasonIconWrap,
                    { backgroundColor: reportReason === reason.key ? '#ff980020' : colors.backgroundSecondary }
                  ]}>
                    <Icon
                      name={reason.icon}
                      size={20}
                      color={reportReason === reason.key ? '#ff9800' : colors.textSecondary}
                    />
                  </View>
                  <Text style={[
                    styles.reportReasonLabel,
                    { color: reportReason === reason.key ? '#ff9800' : colors.text }
                  ]}>
                    {reason.label}
                  </Text>
                  {reportReason === reason.key && (
                    <Icon name="checkmark-circle" size={20} color="#ff9800" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.reportModalButtons}>
              <TouchableOpacity
                style={[styles.reportButton, styles.cancelReportButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => { setReportModalVisible(false); setReportReason(''); }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  styles.submitReportButton,
                  { backgroundColor: reportReason ? '#ff9800' : '#ffcc80', opacity: reportReason ? 1 : 0.6 }
                ]}
                onPress={handleReportUser}
                disabled={reportLoading || !reportReason}
              >
                {reportLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Block Confirmation Modal */}
      <Modal
        visible={blockModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }]}>
          <View style={[styles.blockModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.blockIconBadge}>
              <Icon name="ban-outline" size={32} color="#ff5c5c" />
            </View>

            <Text style={[styles.blockModalTitle, { color: colors.text }]}>
              Block {profileData.user?.name}?
            </Text>
            <Text style={[styles.blockModalDescription, { color: colors.textSecondary }]}>
              They won't be notified. You can unblock them anytime from their profile.
            </Text>

            <View style={[styles.blockConsequencesList, { backgroundColor: colors.backgroundSecondary || (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), borderRadius: 14 }]}>
              {[
                { icon: 'chatbubble-ellipses-outline', text: "They won't be able to message you" },
                { icon: 'eye-off-outline', text: "They won't see your posts or profile" },
                { icon: 'person-outline', text: "You won't see their content either" },
              ].map((item, index, arr) => (
                <View
                  key={index}
                  style={[
                    styles.blockConsequenceItem,
                    index < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }
                  ]}
                >
                  <View style={styles.blockConsequenceIconWrap}>
                    <Icon name={item.icon} size={18} color="#ff5c5c" />
                  </View>
                  <Text style={[styles.blockConsequenceText, { color: colors.textSecondary }]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.blockConfirmBtn, { backgroundColor: '#ff5c5c' }]}
              onPress={handleBlockUser}
              disabled={blockLoading}
              activeOpacity={0.85}
            >
              {blockLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.blockConfirmBtnText}>Block User</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.blockCancelBtn, { borderColor: colors.border }]}
              onPress={() => setBlockModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.blockCancelBtnText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Full Screen Image Modal */}
      <Modal visible={fullScreenImage.visible} transparent animationType="fade" onRequestClose={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
        <View style={[styles.fullScreenModal, { backgroundColor: '#000' }]}>
          <TouchableOpacity style={[styles.fullScreenClose, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setFullScreenImage({ visible: false, src: '', type: '' })}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: fullScreenImage.src }} style={styles.fullScreenImage} resizeMode="contain" />
          <View style={[styles.fullScreenLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text style={styles.fullScreenLabelText}>
              {fullScreenImage.type === 'profile' ? 'Profile Picture' : 
               fullScreenImage.type === 'cover' ? 'Cover Photo' : 'Post Image'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Followers Modal */}
      <Modal visible={followersModalVisible} transparent animationType="slide" onRequestClose={() => {
        setFollowersModalVisible(false);
        fetchFollowStats();
      }}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Followers</Text>
              <TouchableOpacity onPress={() => {
                setFollowersModalVisible(false);
                fetchFollowStats();
              }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followersList}
                renderItem={({ item }) => <FollowItem item={item} type="followers" onFollowAction={fetchFollowStats} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.followList}
                ListEmptyComponent={
                  <View style={styles.emptyFollow}>
                    <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>No followers yet</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Following Modal */}
      <Modal visible={followingModalVisible} transparent animationType="slide" onRequestClose={() => {
        setFollowingModalVisible(false);
        fetchFollowStats();
      }}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.followModal, { backgroundColor: colors.card }]}>
            <View style={[styles.followModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.followModalTitle, { color: colors.text }]}>Following</Text>
              <TouchableOpacity onPress={() => {
                setFollowingModalVisible(false);
                fetchFollowStats();
              }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingFollowers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.followLoader} />
            ) : (
              <FlatList
                data={followingList}
                renderItem={({ item }) => <FollowItem item={item} type="following" onFollowAction={fetchFollowStats} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.followList}
                ListEmptyComponent={
                  <View style={styles.emptyFollow}>
                    <Text style={[styles.emptyFollowText, { color: colors.textSecondary }]}>Not following anyone yet</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '500' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  profileHeader: { marginBottom: 8 },
  coverImage: { width: '100%', height: 180, justifyContent: 'flex-end', alignItems: 'center' },
  addCoverButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addCoverText: { color: '#fff', marginLeft: 8, fontSize: 14, fontWeight: '500' },
  profileInfoContainer: { padding: 20, marginTop: -40 },
  profileImageSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImageWrapper: { position: 'relative', marginRight: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, backgroundColor: '#f0f0f0' },
  changePhotoButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 3 },
  profileTextInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  profileName: { fontSize: 24, fontWeight: 'bold', marginRight: 8 },
  verifiedBadge: { marginLeft: 4 },
  profileUsername: { fontSize: 16, marginTop: 4 },
  profileBio: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  statLabel: { fontSize: 13 },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8, elevation: 2 },
  editButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  settingsButton: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  messageButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 8 },
  messageButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  followButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, gap: 8 },
  followButtonn: { backgroundColor: '#0653f8ff', borderWidth: 0 },
  followingButton: { backgroundColor: '#E1E1E1', borderWidth: 0 },
  followButtonText: { fontSize: 15, fontWeight: '600' },
  additionalInfo: { gap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, flex: 1 },

  priceLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  locationChipText: {
    fontSize: 13,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  marketplaceActionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  messageSellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageSellerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  catalogSection: { paddingHorizontal: 16, },
  catalogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  catalogTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catalogTitle: { fontSize: 16, fontWeight: '600' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 14, fontWeight: '500' },
  catalogContainer: { minHeight: 180 },
  
  tabContainer: { flexDirection: 'row', marginTop: 8, paddingHorizontal: 8 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: '500' },
  
  gridContainer: { padding: 2 },
  threeColumnRow: { justifyContent: 'space-between' },
  twoColumnRow: { justifyContent: 'space-between', paddingHorizontal: 2 },
  gridItem: { width: (screenWidth - 12) / 3, height: (screenWidth - 12) / 3, margin: 2, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  reactionBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 4 },
  reactionBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  
  videoGridItem: { width: (screenWidth - 12) / 2, height: 250, margin: 2, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  videoGridPlayer: { flex: 1 },
  videoViewsOverlay: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  videoViewsText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoLikeOverlay: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  videoLikeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoCommentOverlay: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  videoCommentText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  
  marketplaceGridItem: { width: (screenWidth - 12) / 2, height: 200, margin: 2, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  marketplacePriceBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  marketplacePriceText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  videoPlayerContainer: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  videoLoading: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  videoError: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#fff', fontSize: 12, marginTop: 8 },
  playOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  playIconContainer: { backgroundColor: 'rgba(0,0,0,0.6)', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  durationText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  
  bottomSheetOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheetBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  keyboardView: { flex: 1, justifyContent: 'flex-end' },
  bottomSheetContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: screenHeight * 0.9 },
  bottomSheetHandle: { alignItems: 'center', paddingVertical: 12, position: 'relative' },
  handleBar: { width: 40, height: 4, borderRadius: 2 },
  bottomSheetCloseButton: { position: 'absolute', right: 16, top: 8, padding: 8 },
  bottomSheetContent: { paddingBottom: 20 },
  bottomSheetHeader: { paddingHorizontal: 20, paddingVertical: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22 },
  userName: { fontSize: 16, fontWeight: '600' },
  postTime: { fontSize: 12, marginTop: 2 },
  postTitle: { fontSize: 20, fontWeight: '700', paddingHorizontal: 20, marginTop: 8 },
  postPrice: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginTop: 4, color: '#27ae60' },
  postText: { fontSize: 15, lineHeight: 22, paddingHorizontal: 20, marginTop: 12 },
  mediaImage: { width: screenWidth, height: 300, marginTop: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5, gap: 20 },
  statsText: { fontSize: 13 },
  actionButtonsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 24 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButtonText: { fontSize: 14 },
  commentsSection: { paddingHorizontal: 20, marginTop: 16 },
  commentsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  commentItem: { marginBottom: 16 },
  commentRow: { flexDirection: 'row', gap: 12 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  commentUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  commentUsername: { fontSize: 14, fontWeight: '600' },
  commentTimestamp: { fontSize: 11 },
  commentDeleteButton: { padding: 4 },
  commentText: { fontSize: 14, marginBottom: 8 },
  commentActions: { flexDirection: 'row', gap: 16 },
  commentActionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12 },
  repliesSection: { marginTop: 8, marginLeft: 20 },
  noComments: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  replyingBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 16, marginBottom: 8, borderRadius: 8 },
  replyingText: { fontSize: 12 },
  commentInputWrapper: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 0.5, alignItems: 'flex-end', gap: 12 },
  commentInput: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 80, fontSize: 14 },
  postCommentButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  
  emptyContainer: { padding: 40, alignItems: 'center', borderRadius: 12, margin: 16 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  
  fullScreenModal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullScreenClose: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 1, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: screenWidth, height: screenHeight * 0.7 },
  fullScreenLabel: { position: 'absolute', bottom: 40, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  fullScreenLabelText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  
  optionsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  optionsSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 44 : 32 },
  optionsDragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 20 },
  optionsSheetHeader: { marginBottom: 16 },
  optionsUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionsUserAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#f0f0f0' },
  optionsUserName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  optionsUserHandle: { fontSize: 13 },
  optionsHeaderDivider: { height: 1, marginBottom: 8 },
  optionsActionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  optionsActionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  optionsActionTextGroup: { flex: 1, gap: 3 },
  optionsActionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionsActionTitle: { fontSize: 15, fontWeight: '600' },
  optionsActionSubtitle: { fontSize: 12, lineHeight: 17 },
  optionsBlockedPill: { backgroundColor: '#ff5c5c20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, borderColor: '#ff5c5c40' },
  optionsBlockedPillText: { fontSize: 10, fontWeight: '700', color: '#ff5c5c' },
  optionsRowDivider: { height: 1, marginLeft: 58 },
  optionsCancelBtn: { marginTop: 12, paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  optionsCancelText: { fontSize: 16, fontWeight: '600' },
  
  reportModalContent: { width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 28 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 16 },
  reportModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reportModalTitle: { fontSize: 20, fontWeight: 'bold' },
  reportModalDescription: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  reportSectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10, marginTop: 4 },
  reportReasonList: { gap: 10, marginBottom: 24 },
  reportReasonOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, gap: 12 },
  reportReasonOptionSelected: { backgroundColor: '#fff8f0' },
  reportReasonIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reportReasonLabel: { fontSize: 15, fontWeight: '500' },
  reportModalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  reportButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelReportButton: { borderWidth: 1, borderColor: '#ddd' },
  submitReportButton: { backgroundColor: '#ff9800' },
  cancelButtonText: { fontSize: 16, fontWeight: '500' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  blockModalContent: { width: '100%', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 32, alignItems: 'center' },
  blockIconBadge: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#ff5c5c18', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  blockModalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  blockModalDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20, paddingHorizontal: 12 },
  blockConsequencesList: { width: '100%', marginBottom: 24, overflow: 'hidden' },
  blockConsequenceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 12 },
  blockConsequenceIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#ff5c5c15', justifyContent: 'center', alignItems: 'center' },
  blockConsequenceText: { fontSize: 14, flex: 1, lineHeight: 19 },
  blockConfirmBtn: { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  blockConfirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  blockCancelBtn: { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', borderWidth: 1.5 },
  blockCancelBtnText: { fontSize: 16, fontWeight: '600' },
  
  followModal: { height: '80%', marginTop: 'auto', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  followModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  followModalTitle: { fontSize: 18, fontWeight: '600' },
  followList: { padding: 16 },
  followItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  followItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  followAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  followInfo: { flex: 1 },
  followName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  followUsername: { fontSize: 13 },
  followActionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 100, alignItems: 'center' },
  followActionText: { fontSize: 14, fontWeight: '600' },
  followLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyFollow: { padding: 40, alignItems: 'center' },
  emptyFollowText: { fontSize: 16 },
  
  fullVideoOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  fullVideoBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  fullVideoContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: screenHeight * 0.95 },
  fullVideoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
  fullVideoCloseButton: { padding: 8 },
  fullVideoTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  fullVideoContent: { paddingBottom: 20 },
  fullVideoPlayerWrapper: { width: screenWidth, height: 400, backgroundColor: '#000' },
  fullVideoPlayerTouchable: { flex: 1, position: 'relative' },
  fullVideoPlayer: { width: '100%', height: '100%' },
  fullVideoLoading: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  fullVideoError: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  fullVideoErrorText: { color: '#fff', marginTop: 10 },
  fullVideoControls: { position: 'absolute', bottom: 20, left: 0, right: 0, paddingHorizontal: 20 },
  fullVideoPlayPause: { alignSelf: 'center', marginBottom: 20 },
  fullVideoProgressContainer: { marginBottom: 10 },
  fullVideoProgressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1.5, overflow: 'hidden' },
  fullVideoProgressFill: { height: '100%', backgroundColor: '#fff' },
  fullVideoTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  fullVideoTimeText: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  fullVideoMute: { position: 'absolute', bottom: 0, right: 0, padding: 10 },
  fullVideoInfoSection: { padding: 16 },
  fullVideoUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  fullVideoAvatar: { width: 44, height: 44, borderRadius: 22 },
  fullVideoUserText: { flex: 1 },
  fullVideoUsername: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  fullVideoStats: { fontSize: 12 },
  fullVideoCaption: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  fullVideoActions: { flexDirection: 'row', gap: 24, marginBottom: 24, paddingVertical: 12, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)', borderBottomColor: 'rgba(255,255,255,0.1)' },
  fullVideoActionButton: { alignItems: 'center', gap: 4 },
  fullVideoActionText: { fontSize: 12 },
  fullVideoCommentsSection: { marginTop: 8 },
  fullVideoCommentsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  fullVideoNoComments: { textAlign: 'center', paddingVertical: 20 },
  fullVideoCommentItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  fullVideoCommentAvatar: { width: 36, height: 36, borderRadius: 18 },
  fullVideoCommentContent: { flex: 1 },
  fullVideoCommentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  fullVideoCommentUsername: { fontSize: 14, fontWeight: '600' },
  fullVideoCommentTime: { fontSize: 11 },
  fullVideoCommentText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  fullVideoCommentActions: { flexDirection: 'row', gap: 16 },
  fullVideoCommentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fullVideoCommentActionText: { fontSize: 12 },
  fullVideoReplyingBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 16, marginBottom: 8, borderRadius: 8 },
  fullVideoReplyingText: { fontSize: 12 },
  fullVideoCommentInput: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 0.5, alignItems: 'flex-end', gap: 12 },
  fullVideoInput: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 80, fontSize: 14 },
  fullVideoSendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});

export default UserProfile;