


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   Alert,
//   Image,
//   StatusBar,
//   Platform,
//   Linking,
// } from 'react-native';
// import { useNotification } from '../src/context/NotificationContext';
// import { formatDistanceToNow } from 'date-fns';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';

// const NotificationsScreen = ({ navigation }) => {
//   const {
//     notifications,
//     unreadCount,
//     fetchNotifications,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//   } = useNotification();

//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState('all');

//   const filters = [
//     { id: 'all', label: 'All', icon: 'notifications-outline' },
//     { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
//     { id: 'read', label: 'Read', icon: 'mail-outline' },
//   ];

//   // Complete notification types configuration with navigation handlers
//   const notificationTypes = {
//     // Post related
//     like: { 
//       icon: 'heart', 
//       color: '#FF3B30', 
//       label: 'Like',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     love: { 
//       icon: 'heart-circle', 
//       color: '#FF3B30', 
//       label: 'Love',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     comment: { 
//       icon: 'chatbubble-outline', 
//       color: '#34C759', 
//       label: 'Comment',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id, scrollToComment: data.comment_id })
//     },
//     share: { 
//       icon: 'share-outline', 
//       color: '#5856D6', 
//       label: 'Share',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     mention: { 
//       icon: 'at-outline', 
//       color: '#AF52DE', 
//       label: 'Mention',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
    
//     // User related
//     follow: { 
//       icon: 'person-add-outline', 
//       color: '#007AFF', 
//       label: 'Follow',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.follower_id })
//     },
//     friend_request: { 
//       icon: 'people-outline', 
//       color: '#FF9500', 
//       label: 'Friend Request',
//       navigateTo: 'GroupConnect',
//       getParams: () => ({ tab: 'requests' })
//     },
//     friend_accept: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Friend Accepted',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.friend_id })
//     },
    
//     // Messages
//     message: { 
//       icon: 'chatbubbles-outline', 
//       color: '#5856D6', 
//       label: 'Message',
//       navigateTo: 'BPrivateChat',
//       getParams: (data) => ({ userId: data.sender_id, userName: data.sender_name })
//     },
//     group_message: { 
//       icon: 'people-circle-outline', 
//       color: '#5856D6', 
//       label: 'Group Message',
//       navigateTo: 'GroupChat',
//       getParams: (data) => ({ groupSlug: data.group_slug, groupName: data.group_name })
//     },
    
//     // Channel
//     channel_post: { 
//       icon: 'megaphone-outline', 
//       color: '#FF9500', 
//       label: 'Channel Post',
//       navigateTo: 'ChannelDetails',
//       getParams: (data) => ({ channelSlug: data.channel_slug, postId: data.post_id })
//     },
    
//     // Rewards & Earnings
//     reward: { 
//       icon: 'trophy-outline', 
//       color: '#FFCC00', 
//       label: 'Reward',
//       navigateTo: 'EarningDashbord',
//       getParams: () => ({ tab: 'rewards' })
//     },
//     withdrawal: { 
//       icon: 'wallet-outline', 
//       color: '#34C759', 
//       label: 'Withdrawal',
//       navigateTo: 'EarningWallet',
//       getParams: () => ({ tab: 'transactions' })
//     },
    
//     // Ads
//     ad_approved: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Ad Approved',
//       navigateTo: 'MyAds',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
//     ad_rejected: { 
//       icon: 'close-circle-outline', 
//       color: '#FF3B30', 
//       label: 'Ad Rejected',
//       navigateTo: 'Advertise',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
    
//     // Livestream
//     live_start: { 
//       icon: 'radio-outline', 
//       color: '#FF3B30', 
//       label: 'Live Started',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id, streamerId: data.user_id })
//     },
//     live_end: { 
//       icon: 'radio-button-off-outline', 
//       color: '#8E8E93', 
//       label: 'Live Ended',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
//     live_reminder: { 
//       icon: 'alarm-outline', 
//       color: '#FF9500', 
//       label: 'Live Reminder',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
    
//     // Status updates
//     status_update: { 
//       icon: 'create-outline', 
//       color: '#5856D6', 
//       label: 'Status Update',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.user_id, highlight: 'bio' })
//     },
    
//     // Calls
//     call: { 
//       icon: 'call-outline', 
//       color: '#34C759', 
//       label: 'Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
//     missed_call: { 
//       icon: 'call-outline', 
//       color: '#FF3B30', 
//       label: 'Missed Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
    
//     // New content from followed users
//     new_post: { 
//       icon: 'document-text-outline', 
//       color: '#007AFF', 
//       label: 'New Post',
//       navigateTo: 'PostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     new_video: { 
//       icon: 'videocam-outline', 
//       color: '#FF9500', 
//       label: 'New Video',
//       navigateTo: 'SocialHome',
//       getParams: (data) => ({ videoId: data.video_id })
//     },
//     new_listing: { 
//       icon: 'cart-outline', 
//       color: '#34C759', 
//       label: 'New Listing',
//       navigateTo: 'ListingDetails',
//       getParams: (data) => ({ listingId: data.listing_id })
//     },
    
//     // System
//     system: { 
//       icon: 'settings-outline', 
//       color: '#8E8E93', 
//       label: 'System',
//       navigateTo: 'Settings',
//       getParams: () => ({ section: 'notifications' })
//     },
    
//     // Default
//     default: { 
//       icon: 'notifications-outline', 
//       color: '#8E8E93', 
//       label: 'Notification',
//       navigateTo: null,
//       getParams: () => ({})
//     },
//   };

//   const loadNotifications = async (pageNum = 1, isRefresh = false) => {
//     if (loading) return;
//     setLoading(true);
    
//     const result = await fetchNotifications(pageNum);
//     if (result) {
//       setHasMore(result.pagination?.has_next || false);
//       if (isRefresh) {
//         setPage(1);
//       } else {
//         setPage(pageNum);
//       }
//     }
//     setLoading(false);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications(1, true);
//     setRefreshing(false);
//   };

//   const loadMore = () => {
//     if (hasMore && !loading && !refreshing) {
//       loadNotifications(page + 1);
//     }
//   };

//   // Main navigation handler
//   const handleNotificationPress = async (notification) => {
//     // Mark as read
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     const config = notificationTypes[notification.notification_type] || notificationTypes.default;
    
//     if (!config.navigateTo) {
//       console.log('No navigation defined for type:', notification.notification_type);
//       return;
//     }
    
//     // Get navigation params
//     const params = config.getParams(notification.data || {});
    
//     // Navigate based on type
//     try {
//       switch (notification.notification_type) {
//         // Post related
//         case 'like':
//         case 'love':
//         case 'comment':
//         case 'share':
//         case 'mention':
//         case 'new_post':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // User profile related
//         case 'follow':
//         case 'friend_accept':
//         case 'status_update':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Messages
//         case 'message':
//           navigation.navigate(config.navigateTo, {
//             ...params,
//             fromNotification: true,
//           });
//           break;
          
//         case 'group_message':
//           navigation.navigate(config.navigateTo, {
//             ...params,
//             fromNotification: true,
//           });
//           break;
          
//         // Channel
//         case 'channel_post':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Friend request
//         case 'friend_request':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Rewards
//         case 'reward':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         case 'withdrawal':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Ads
//         case 'ad_approved':
//         case 'ad_rejected':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Livestream
//         case 'live_start':
//         case 'live_reminder':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         case 'live_end':
//           // Show alert for ended live stream
//           Alert.alert(
//             'Live Stream Ended',
//             'This live stream has ended. Would you like to watch the replay?',
//             [
//               { text: 'No', style: 'cancel' },
//               { text: 'Watch Replay', onPress: () => navigation.navigate(config.navigateTo, params) }
//             ]
//           );
//           break;
          
//         // Calls
//         case 'call':
//         case 'missed_call':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Videos
//         case 'new_video':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // Listings
//         case 'new_listing':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // System
//         case 'system':
//           navigation.navigate(config.navigateTo, params);
//           break;
          
//         // External links (if any)
//         case 'external_link':
//           if (notification.data?.url) {
//             await Linking.openURL(notification.data.url);
//           }
//           break;
          
//         default:
//           console.log('Unhandled notification type:', notification.notification_type);
//           // Optional: Show alert that this feature is coming soon
//           Alert.alert(
//             'Coming Soon',
//             `Navigation for ${notification.notification_type} notifications will be available soon.`
//           );
//       }
//     } catch (error) {
//       console.error('Navigation error:', error);
//       Alert.alert('Error', 'Unable to open this notification');
//     }
//   };

//   const handleDeleteNotification = (notification) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => deleteNotification(notification.id),
//         },
//       ]
//     );
//   };

//   const handleMarkAllAsRead = () => {
//     if (unreadCount === 0) return;
    
//     Alert.alert(
//       'Mark All as Read',
//       `Mark all ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} as read?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Mark All', onPress: markAllAsRead },
//       ]
//     );
//   };

//   const getFilteredNotifications = () => {
//     if (selectedFilter === 'unread') {
//       return notifications.filter(n => !n.is_read);
//     }
//     if (selectedFilter === 'read') {
//       return notifications.filter(n => n.is_read);
//     }
//     return notifications;
//   };

//   const getNotificationConfig = (type) => {
//     return notificationTypes[type] || notificationTypes.default;
//   };

//   const formatTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffInHours = (now - date) / (1000 * 60 * 60);
      
//       if (diffInHours < 24) {
//         return formatDistanceToNow(date, { addSuffix: true });
//       } else if (diffInHours < 48) {
//         return 'Yesterday';
//       } else {
//         return date.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric' 
//         });
//       }
//     } catch (error) {
//       return 'Recently';
//     }
//   };

//   const renderFilterBar = () => (
//     <View style={styles.filterContainer}>
//       {filters.map((filter) => (
//         <TouchableOpacity
//           key={filter.id}
//           style={[
//             styles.filterButton,
//             selectedFilter === filter.id && styles.filterButtonActive,
//           ]}
//           onPress={() => setSelectedFilter(filter.id)}
//         >
//           <Icon 
//             name={filter.icon} 
//             size={18} 
//             color={selectedFilter === filter.id ? '#fff' : '#666'} 
//           />
//           <Text
//             style={[
//               styles.filterText,
//               selectedFilter === filter.id && styles.filterTextActive,
//             ]}
//           >
//             {filter.label}
//           </Text>
//           {filter.id === 'unread' && unreadCount > 0 && (
//             <View style={styles.filterBadge}>
//               <Text style={styles.filterBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderNotificationItem = ({ item }) => {
//     const config = getNotificationConfig(item.notification_type);
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.notificationItem,
//           !item.is_read && styles.unreadNotification,
//         ]}
//         onPress={() => handleNotificationPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.notificationContent}>
//           <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
//             <Icon name={config.icon} size={24} color={config.color} />
//           </View>
          
//           <View style={styles.textContainer}>
//             <View style={styles.titleRow}>
//               <Text style={styles.title} numberOfLines={1}>
//                 {item.title}
//               </Text>
//               {!item.is_read && <View style={styles.unreadDot} />}
//             </View>
            
//             <Text style={styles.body} numberOfLines={2}>
//               {item.body}
//             </Text>
            
//             <View style={styles.footerRow}>
//               <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
//                 <Text style={[styles.typeText, { color: config.color }]}>
//                   {config.label}
//                 </Text>
//               </View>
//               <Text style={styles.time}>{formatTime(item.created_at)}</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity
//             style={styles.menuButton}
//             onPress={() => handleDeleteNotification(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Icon name="ellipsis-vertical" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIconContainer}>
//         <Icon name="notifications-off-outline" size={64} color="#ccc" />
//       </View>
//       <Text style={styles.emptyText}>No notifications yet</Text>
//       <Text style={styles.emptySubtext}>
//         When you receive notifications, they'll appear here
//       </Text>
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
        
//         <Text style={styles.headerTitle}>Notifications</Text>
        
//         {unreadCount > 0 && (
//           <TouchableOpacity 
//             style={styles.markAllButton}
//             onPress={handleMarkAllAsRead}
//           >
//             <Icon name="checkmark-done-outline" size={20} color="#007AFF" />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {renderFilterBar()}
//     </View>
//   );

//   const filteredNotifications = getFilteredNotifications();

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.container}>
//         {renderHeader()}
        
//         <FlatList
//           data={filteredNotifications}
//           renderItem={renderNotificationItem}
//           keyExtractor={(item) => item.id.toString()}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh}
//               tintColor="#007AFF"
//               colors={['#007AFF']}
//             />
//           }
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.1}
//           ListEmptyComponent={renderEmptyState}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={filteredNotifications.length === 0 && styles.emptyList}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   markAllButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     gap: 12,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     gap: 6,
//   },
//   filterButtonActive: {
//     backgroundColor: '#007AFF',
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//   },
//   filterTextActive: {
//     color: '#fff',
//   },
//   filterBadge: {
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   filterBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   notificationItem: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   unreadNotification: {
//     backgroundColor: '#F0F7FF',
//     borderColor: '#BBDEFB',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//     gap: 8,
//   },
//   title: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   body: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   footerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   typeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   typeText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   time: {
//     fontSize: 11,
//     color: '#999',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#007AFF',
//   },
//   menuButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyList: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
// });

// export default NotificationsScreen;

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   Alert,
//   Image,
//   StatusBar,
//   Platform,
//   Linking,
//   AppState,
// } from 'react-native';
// import { useNotification } from '../src/context/NotificationContext';
// import { formatDistanceToNow } from 'date-fns';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Cache keys
// const CACHE_KEY = '@notifications_cache';
// const CACHE_TIMESTAMP_KEY = '@notifications_cache_timestamp';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// const NotificationsScreen = ({ navigation }) => {
//   const {
//     notifications,
//     unreadCount,
//     fetchNotifications,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//   } = useNotification();

//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [cachedData, setCachedData] = useState(null);
//   const [isCacheLoaded, setIsCacheLoaded] = useState(false);
//   const isInitialMount = useRef(true);
//   const loadMoreTimeout = useRef(null);

//   const filters = [
//     { id: 'all', label: 'All', icon: 'notifications-outline' },
//     { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
//     { id: 'read', label: 'Read', icon: 'mail-outline' },
//   ];

//   // Notification types config (same as before)
//   const notificationTypes = {
//     like: { 
//       icon: 'heart', 
//       color: '#FF3B30', 
//       label: 'Like',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     love: { 
//       icon: 'heart-circle', 
//       color: '#FF3B30', 
//       label: 'Love',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     comment: { 
//       icon: 'chatbubble-outline', 
//       color: '#34C759', 
//       label: 'Comment',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id, scrollToComment: data.comment_id })
//     },
//     share: { 
//       icon: 'share-outline', 
//       color: '#5856D6', 
//       label: 'Share',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     mention: { 
//       icon: 'at-outline', 
//       color: '#AF52DE', 
//       label: 'Mention',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     follow: { 
//       icon: 'person-add-outline', 
//       color: '#007AFF', 
//       label: 'Follow',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.follower_id })
//     },
//     friend_request: { 
//       icon: 'people-outline', 
//       color: '#FF9500', 
//       label: 'Friend Request',
//       navigateTo: 'GroupConnect',
//       getParams: () => ({ tab: 'requests' })
//     },
//     friend_accept: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Friend Accepted',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.friend_id })
//     },
//     message: { 
//       icon: 'chatbubbles-outline', 
//       color: '#5856D6', 
//       label: 'Message',
//       navigateTo: 'BPrivateChat',
//       getParams: (data) => ({ userId: data.sender_id, userName: data.sender_name })
//     },
//     group_message: { 
//       icon: 'people-circle-outline', 
//       color: '#5856D6', 
//       label: 'Group Message',
//       navigateTo: 'GroupChat',
//       getParams: (data) => ({ groupSlug: data.group_slug, groupName: data.group_name })
//     },
//     channel_post: { 
//       icon: 'megaphone-outline', 
//       color: '#FF9500', 
//       label: 'Channel Post',
//       navigateTo: 'ChannelDetails',
//       getParams: (data) => ({ channelSlug: data.channel_slug, postId: data.post_id })
//     },
//     reward: { 
//       icon: 'trophy-outline', 
//       color: '#FFCC00', 
//       label: 'Reward',
//       navigateTo: 'EarningDashbord',
//       getParams: () => ({ tab: 'rewards' })
//     },
//     withdrawal: { 
//       icon: 'wallet-outline', 
//       color: '#34C759', 
//       label: 'Withdrawal',
//       navigateTo: 'EarningWallet',
//       getParams: () => ({ tab: 'transactions' })
//     },
//     ad_approved: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Ad Approved',
//       navigateTo: 'MyAds',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
//     ad_rejected: { 
//       icon: 'close-circle-outline', 
//       color: '#FF3B30', 
//       label: 'Ad Rejected',
//       navigateTo: 'Advertise',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
//     live_start: { 
//       icon: 'radio-outline', 
//       color: '#FF3B30', 
//       label: 'Live Started',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id, streamerId: data.user_id })
//     },
//     live_end: { 
//       icon: 'radio-button-off-outline', 
//       color: '#8E8E93', 
//       label: 'Live Ended',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
//     live_reminder: { 
//       icon: 'alarm-outline', 
//       color: '#FF9500', 
//       label: 'Live Reminder',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
//     status_update: { 
//       icon: 'create-outline', 
//       color: '#5856D6', 
//       label: 'Status Update',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.user_id, highlight: 'bio' })
//     },
//     call: { 
//       icon: 'call-outline', 
//       color: '#34C759', 
//       label: 'Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
//     missed_call: { 
//       icon: 'call-outline', 
//       color: '#FF3B30', 
//       label: 'Missed Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
//     new_post: { 
//       icon: 'document-text-outline', 
//       color: '#007AFF', 
//       label: 'New Post',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     new_video: { 
//       icon: 'videocam-outline', 
//       color: '#FF9500', 
//       label: 'New Video',
//       navigateTo: 'SocialHome',
//       getParams: (data) => ({ videoId: data.video_id })
//     },
//     new_listing: { 
//       icon: 'cart-outline', 
//       color: '#34C759', 
//       label: 'New Listing',
//       navigateTo: 'ListingDetails',
//       getParams: (data) => ({ listingId: data.listing_id })
//     },
//     system: { 
//       icon: 'settings-outline', 
//       color: '#8E8E93', 
//       label: 'System',
//       navigateTo: 'Settings',
//       getParams: () => ({ section: 'notifications' })
//     },
//     default: { 
//       icon: 'notifications-outline', 
//       color: '#8E8E93', 
//       label: 'Notification',
//       navigateTo: null,
//       getParams: () => ({})
//     },
//   };

//   // Load cached notifications
//   const loadCachedNotifications = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(CACHE_KEY);
//       const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
//       if (cached && timestamp) {
//         const cacheAge = Date.now() - parseInt(timestamp);
//         if (cacheAge < CACHE_DURATION) {
//           const data = JSON.parse(cached);
//           setCachedData(data);
//           setIsCacheLoaded(true);
//           return true;
//         }
//       }
//       return false;
//     } catch (error) {
//       console.error('Error loading cache:', error);
//       return false;
//     }
//   }, []);

//   // Save to cache
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
//       await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
//     } catch (error) {
//       console.error('Error saving cache:', error);
//     }
//   }, []);

//   // Load notifications with cache strategy
//   const loadNotifications = useCallback(async (pageNum = 1, isRefresh = false) => {
//     if (loading && !isRefresh) return;
    
//     setLoading(true);
    
//     try {
//       // Try cache first for initial load
//       if (isInitialMount.current && pageNum === 1) {
//         const hasCache = await loadCachedNotifications();
//         if (hasCache) {
//           // Use cache while fetching new data
//           // Don't wait for API response
//         }
//         isInitialMount.current = false;
//       }

//       const result = await fetchNotifications(pageNum);
      
//       if (result) {
//         const notificationsData = result.notifications || [];
//         const pagination = result.pagination || {};
        
//         setHasMore(pagination.has_next || false);
        
//         if (isRefresh || pageNum === 1) {
//           // Save to cache
//           await saveToCache({
//             notifications: notificationsData,
//             unreadCount: result.unread_count || 0,
//             timestamp: Date.now(),
//           });
//         }
        
//         setPage(pageNum);
//       }
//     } catch (error) {
//       console.error('Error loading notifications:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [loading, fetchNotifications, loadCachedNotifications, saveToCache]);

//   // Initial load
//   useEffect(() => {
//     loadNotifications(1, true);
//   }, []);

//   // Refresh on app focus
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         // Refresh notifications silently when app comes to foreground
//         loadNotifications(1, true);
//       }
//     });

//     return () => subscription.remove();
//   }, [loadNotifications]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications(1, true);
//   };

//   const loadMore = useCallback(() => {
//     if (hasMore && !loading && !refreshing) {
//       if (loadMoreTimeout.current) {
//         clearTimeout(loadMoreTimeout.current);
//       }
//       loadMoreTimeout.current = setTimeout(() => {
//         loadNotifications(page + 1);
//       }, 300); // Debounce load more
//     }
//   }, [hasMore, loading, refreshing, page, loadNotifications]);

//   // Cleanup timeout
//   useEffect(() => {
//     return () => {
//       if (loadMoreTimeout.current) {
//         clearTimeout(loadMoreTimeout.current);
//       }
//     };
//   }, []);

//   // Rest of your handlers (handleNotificationPress, handleDeleteNotification, etc.)
//   // ... keep your existing handlers ...

//   const handleNotificationPress = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     const config = notificationTypes[notification.notification_type] || notificationTypes.default;
    
//     if (!config.navigateTo) {
//       console.log('No navigation defined for type:', notification.notification_type);
//       return;
//     }
    
//     const params = config.getParams(notification.data || {});
    
//     try {
//       navigation.navigate(config.navigateTo, params);
//     } catch (error) {
//       console.error('Navigation error:', error);
//       Alert.alert('Error', 'Unable to open this notification');
//     }
//   };

//   const handleDeleteNotification = (notification) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => deleteNotification(notification.id),
//         },
//       ]
//     );
//   };

//   const handleMarkAllAsRead = () => {
//     if (unreadCount === 0) return;
    
//     Alert.alert(
//       'Mark All as Read',
//       `Mark all ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} as read?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Mark All', onPress: markAllAsRead },
//       ]
//     );
//   };

//   const getFilteredNotifications = () => {
//     const data = notifications.length > 0 ? notifications : (cachedData?.notifications || []);
    
//     if (selectedFilter === 'unread') {
//       return data.filter(n => !n.is_read);
//     }
//     if (selectedFilter === 'read') {
//       return data.filter(n => n.is_read);
//     }
//     return data;
//   };

//   const getNotificationConfig = (type) => {
//     return notificationTypes[type] || notificationTypes.default;
//   };

//   const formatTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffInHours = (now - date) / (1000 * 60 * 60);
      
//       if (diffInHours < 24) {
//         return formatDistanceToNow(date, { addSuffix: true });
//       } else if (diffInHours < 48) {
//         return 'Yesterday';
//       } else {
//         return date.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric' 
//         });
//       }
//     } catch (error) {
//       return 'Recently';
//     }
//   };

//   const renderFilterBar = () => (
//     <View style={styles.filterContainer}>
//       {filters.map((filter) => (
//         <TouchableOpacity
//           key={filter.id}
//           style={[
//             styles.filterButton,
//             selectedFilter === filter.id && styles.filterButtonActive,
//           ]}
//           onPress={() => setSelectedFilter(filter.id)}
//         >
//           <Icon 
//             name={filter.icon} 
//             size={18} 
//             color={selectedFilter === filter.id ? '#fff' : '#666'} 
//           />
//           <Text
//             style={[
//               styles.filterText,
//               selectedFilter === filter.id && styles.filterTextActive,
//             ]}
//           >
//             {filter.label}
//           </Text>
//           {filter.id === 'unread' && unreadCount > 0 && (
//             <View style={styles.filterBadge}>
//               <Text style={styles.filterBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderNotificationItem = ({ item }) => {
//     const config = getNotificationConfig(item.notification_type);
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.notificationItem,
//           !item.is_read && styles.unreadNotification,
//         ]}
//         onPress={() => handleNotificationPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.notificationContent}>
//           <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
//             <Icon name={config.icon} size={24} color={config.color} />
//           </View>
          
//           <View style={styles.textContainer}>
//             <View style={styles.titleRow}>
//               <Text style={styles.title} numberOfLines={1}>
//                 {item.title}
//               </Text>
//               {!item.is_read && <View style={styles.unreadDot} />}
//             </View>
            
//             <Text style={styles.body} numberOfLines={2}>
//               {item.body}
//             </Text>
            
//             <View style={styles.footerRow}>
//               <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
//                 <Text style={[styles.typeText, { color: config.color }]}>
//                   {config.label}
//                 </Text>
//               </View>
//               <Text style={styles.time}>{formatTime(item.created_at)}</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity
//             style={styles.menuButton}
//             onPress={() => handleDeleteNotification(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Icon name="ellipsis-vertical" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIconContainer}>
//         <Icon name="notifications-off-outline" size={64} color="#ccc" />
//       </View>
//       <Text style={styles.emptyText}>No notifications yet</Text>
//       <Text style={styles.emptySubtext}>
//         When you receive notifications, they'll appear here
//       </Text>
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
        
//         <Text style={styles.headerTitle}>Notifications</Text>
        
//         {unreadCount > 0 && (
//           <TouchableOpacity 
//             style={styles.markAllButton}
//             onPress={handleMarkAllAsRead}
//           >
//             <Icon name="checkmark-done-outline" size={20} color="#007AFF" />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {renderFilterBar()}
//     </View>
//   );

//   const filteredNotifications = getFilteredNotifications();
//   const displayData = filteredNotifications.length > 0 ? filteredNotifications : (cachedData?.notifications || []);

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.container}>
//         {renderHeader()}
        
//         <FlatList
//           data={displayData}
//           renderItem={renderNotificationItem}
//           keyExtractor={(item) => item.id.toString()}
//           initialNumToRender={10}
//           maxToRenderPerBatch={15}
//           windowSize={10}
//           removeClippedSubviews={true}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh}
//               tintColor="#007AFF"
//               colors={['#007AFF']}
//             />
//           }
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.3}
//           ListEmptyComponent={renderEmptyState}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={displayData.length === 0 && styles.emptyList}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   markAllButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     gap: 12,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     gap: 6,
//   },
//   filterButtonActive: {
//     backgroundColor: '#007AFF',
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//   },
//   filterTextActive: {
//     color: '#fff',
//   },
//   filterBadge: {
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   filterBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   notificationItem: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   unreadNotification: {
//     backgroundColor: '#F0F7FF',
//     borderColor: '#BBDEFB',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//     gap: 8,
//   },
//   title: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   body: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   footerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   typeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   typeText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   time: {
//     fontSize: 11,
//     color: '#999',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#007AFF',
//   },
//   menuButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyList: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
// });

// export default NotificationsScreen;

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   Alert,
//   Image,
//   StatusBar,
//   Platform,
//   Linking,
//   AppState,
//   ActivityIndicator,
// } from 'react-native';
// import { useNotification } from '../src/context/NotificationContext';
// import { formatDistanceToNow } from 'date-fns';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Cache keys
// const CACHE_KEY = '@notifications_cache';
// const CACHE_TIMESTAMP_KEY = '@notifications_cache_timestamp';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// const NotificationsScreen = ({ navigation }) => {
//   const {
//     notifications,
//     unreadCount,
//     fetchNotifications,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//   } = useNotification();

//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [cachedData, setCachedData] = useState(null);
//   const [isCacheLoaded, setIsCacheLoaded] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const isInitialMount = useRef(true);
//   const loadMoreTimeout = useRef(null);

//   const filters = [
//     { id: 'all', label: 'All', icon: 'notifications-outline' },
//     { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
//     { id: 'read', label: 'Read', icon: 'mail-outline' },
//   ];

//   // Notification types configuration
//   const notificationTypes = {
//     like: { 
//       icon: 'heart', 
//       color: '#FF3B30', 
//       label: 'Like',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     love: { 
//       icon: 'heart-circle', 
//       color: '#FF3B30', 
//       label: 'Love',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     comment: { 
//       icon: 'chatbubble-outline', 
//       color: '#34C759', 
//       label: 'Comment',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id, scrollToComment: data.comment_id })
//     },
//     share: { 
//       icon: 'share-outline', 
//       color: '#5856D6', 
//       label: 'Share',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     mention: { 
//       icon: 'at-outline', 
//       color: '#AF52DE', 
//       label: 'Mention',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     follow: { 
//       icon: 'person-add-outline', 
//       color: '#007AFF', 
//       label: 'Follow',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.follower_id })
//     },
//     friend_request: { 
//       icon: 'people-outline', 
//       color: '#FF9500', 
//       label: 'Friend Request',
//       navigateTo: 'GroupConnect',
//       getParams: () => ({ tab: 'requests' })
//     },
//     friend_accept: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Friend Accepted',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.friend_id })
//     },
//     message: { 
//       icon: 'chatbubbles-outline', 
//       color: '#5856D6', 
//       label: 'Message',
//       navigateTo: 'BPrivateChat',
//       getParams: (data) => ({ userId: data.sender_id, userName: data.sender_name })
//     },
//     group_message: { 
//       icon: 'people-circle-outline', 
//       color: '#5856D6', 
//       label: 'Group Message',
//       navigateTo: 'GroupChat',
//       getParams: (data) => ({ groupSlug: data.group_slug, groupName: data.group_name })
//     },
//     channel_post: { 
//       icon: 'megaphone-outline', 
//       color: '#FF9500', 
//       label: 'Channel Post',
//       navigateTo: 'ChannelDetails',
//       getParams: (data) => ({ channelSlug: data.channel_slug, postId: data.post_id })
//     },
//     reward: { 
//       icon: 'trophy-outline', 
//       color: '#FFCC00', 
//       label: 'Reward',
//       navigateTo: 'EarningDashbord',
//       getParams: () => ({ tab: 'rewards' })
//     },
//     withdrawal: { 
//       icon: 'wallet-outline', 
//       color: '#34C759', 
//       label: 'Withdrawal',
//       navigateTo: 'EarningWallet',
//       getParams: () => ({ tab: 'transactions' })
//     },
//     ad_approved: { 
//       icon: 'checkmark-circle-outline', 
//       color: '#34C759', 
//       label: 'Ad Approved',
//       navigateTo: 'MyAds',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
//     ad_rejected: { 
//       icon: 'close-circle-outline', 
//       color: '#FF3B30', 
//       label: 'Ad Rejected',
//       navigateTo: 'Advertise',
//       getParams: (data) => ({ adId: data.ad_id })
//     },
//     live_start: { 
//       icon: 'radio-outline', 
//       color: '#FF3B30', 
//       label: 'Live Started',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id, streamerId: data.user_id })
//     },
//     live_end: { 
//       icon: 'radio-button-off-outline', 
//       color: '#8E8E93', 
//       label: 'Live Ended',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
//     live_reminder: { 
//       icon: 'alarm-outline', 
//       color: '#FF9500', 
//       label: 'Live Reminder',
//       navigateTo: 'LiveStreaming',
//       getParams: (data) => ({ streamId: data.stream_id })
//     },
//     status_update: { 
//       icon: 'create-outline', 
//       color: '#5856D6', 
//       label: 'Status Update',
//       navigateTo: 'OtherUserProfile',
//       getParams: (data) => ({ userId: data.user_id, highlight: 'bio' })
//     },
//     call: { 
//       icon: 'call-outline', 
//       color: '#34C759', 
//       label: 'Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
//     missed_call: { 
//       icon: 'call-outline', 
//       color: '#FF3B30', 
//       label: 'Missed Call',
//       navigateTo: 'BCalls',
//       getParams: () => ({ tab: 'missed' })
//     },
//     new_post: { 
//       icon: 'document-text-outline', 
//       color: '#007AFF', 
//       label: 'New Post',
//       navigateTo: 'ExplorePostDetails',
//       getParams: (data) => ({ postId: data.post_id })
//     },
//     new_video: { 
//       icon: 'videocam-outline', 
//       color: '#FF9500', 
//       label: 'New Video',
//       navigateTo: 'SocialHome',
//       getParams: (data) => ({ videoId: data.video_id })
//     },
//     new_listing: { 
//       icon: 'cart-outline', 
//       color: '#34C759', 
//       label: 'New Listing',
//       navigateTo: 'ListingDetails',
//       getParams: (data) => ({ listingId: data.listing_id })
//     },
//     system: { 
//       icon: 'settings-outline', 
//       color: '#8E8E93', 
//       label: 'System',
//       navigateTo: 'Settings',
//       getParams: () => ({ section: 'notifications' })
//     },
//     default: { 
//       icon: 'notifications-outline', 
//       color: '#8E8E93', 
//       label: 'Notification',
//       navigateTo: null,
//       getParams: () => ({})
//     },
//   };

//   // Load cached notifications
//   const loadCachedNotifications = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(CACHE_KEY);
//       const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
//       if (cached && timestamp) {
//         const cacheAge = Date.now() - parseInt(timestamp);
//         if (cacheAge < CACHE_DURATION) {
//           const data = JSON.parse(cached);
//           setCachedData(data);
//           setIsCacheLoaded(true);
//           return true;
//         }
//       }
//       return false;
//     } catch (error) {
//       console.error('Error loading cache:', error);
//       return false;
//     }
//   }, []);

//   // Save to cache
//   const saveToCache = useCallback(async (data) => {
//     try {
//       await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
//       await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
//     } catch (error) {
//       console.error('Error saving cache:', error);
//     }
//   }, []);

//   // Load notifications with cache strategy
//   const loadNotifications = useCallback(async (pageNum = 1, isRefresh = false) => {
//     if (loading && !isRefresh) return;
    
//     setLoading(true);
    
//     try {
//       // Try cache first for initial load
//       if (isInitialMount.current && pageNum === 1) {
//         const hasCache = await loadCachedNotifications();
//         if (hasCache) {
//           setIsInitialLoad(false);
//         }
//         isInitialMount.current = false;
//       }

//       const result = await fetchNotifications(pageNum);
      
//       if (result) {
//         const notificationsData = result.notifications || [];
//         const pagination = result.pagination || {};
        
//         setHasMore(pagination.has_next || false);
        
//         if (isRefresh || pageNum === 1) {
//           // Save to cache
//           await saveToCache({
//             notifications: notificationsData,
//             unreadCount: result.unread_count || 0,
//             timestamp: Date.now(),
//           });
//           setCachedData(null);
//         }
        
//         setPage(pageNum);
//         setIsInitialLoad(false);
//       }
//     } catch (error) {
//       console.error('Error loading notifications:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [loading, fetchNotifications, loadCachedNotifications, saveToCache]);

//   // Initial load
//   useEffect(() => {
//     loadNotifications(1, true);
//   }, []);

//   // Refresh on app focus
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         loadNotifications(1, true);
//       }
//     });

//     return () => subscription.remove();
//   }, [loadNotifications]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications(1, true);
//   };

//   const loadMore = useCallback(() => {
//     if (hasMore && !loading && !refreshing) {
//       if (loadMoreTimeout.current) {
//         clearTimeout(loadMoreTimeout.current);
//       }
//       loadMoreTimeout.current = setTimeout(() => {
//         loadNotifications(page + 1);
//       }, 300);
//     }
//   }, [hasMore, loading, refreshing, page, loadNotifications]);

//   // Cleanup timeout
//   useEffect(() => {
//     return () => {
//       if (loadMoreTimeout.current) {
//         clearTimeout(loadMoreTimeout.current);
//       }
//     };
//   }, []);

//   const handleNotificationPress = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     const config = notificationTypes[notification.notification_type] || notificationTypes.default;
    
//     if (!config.navigateTo) {
//       console.log('No navigation defined for type:', notification.notification_type);
//       return;
//     }
    
//     const params = config.getParams(notification.data || {});
    
//     try {
//       navigation.navigate(config.navigateTo, params);
//     } catch (error) {
//       console.error('Navigation error:', error);
//       Alert.alert('Error', 'Unable to open this notification');
//     }
//   };

//   const handleDeleteNotification = (notification) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteNotification(notification.id);
//               // Refresh the list after deletion
//               await loadNotifications(1, true);
//             } catch (error) {
//               Alert.alert('Error', 'Failed to delete notification');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleMarkAllAsRead = () => {
//     if (unreadCount === 0) return;
    
//     Alert.alert(
//       'Mark All as Read',
//       `Mark all ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} as read?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Mark All', 
//           onPress: async () => {
//             try {
//               await markAllAsRead();
//               await loadNotifications(1, true);
//             } catch (error) {
//               Alert.alert('Error', 'Failed to mark all as read');
//             }
//           }
//         },
//       ]
//     );
//   };

//   const getFilteredNotifications = () => {
//     let data = notifications.length > 0 ? notifications : (cachedData?.notifications || []);
    
//     if (selectedFilter === 'unread') {
//       return data.filter(n => !n.is_read);
//     }
//     if (selectedFilter === 'read') {
//       return data.filter(n => n.is_read);
//     }
//     return data;
//   };

//   const getNotificationConfig = (type) => {
//     return notificationTypes[type] || notificationTypes.default;
//   };

//   const formatTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffInHours = (now - date) / (1000 * 60 * 60);
      
//       if (diffInHours < 24) {
//         return formatDistanceToNow(date, { addSuffix: true });
//       } else if (diffInHours < 48) {
//         return 'Yesterday';
//       } else {
//         return date.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric' 
//         });
//       }
//     } catch (error) {
//       return 'Recently';
//     }
//   };

//   const renderFilterBar = () => (
//     <View style={styles.filterContainer}>
//       {filters.map((filter) => (
//         <TouchableOpacity
//           key={filter.id}
//           style={[
//             styles.filterButton,
//             selectedFilter === filter.id && styles.filterButtonActive,
//           ]}
//           onPress={() => setSelectedFilter(filter.id)}
//         >
//           <Icon 
//             name={filter.icon} 
//             size={18} 
//             color={selectedFilter === filter.id ? '#fff' : '#666'} 
//           />
//           <Text
//             style={[
//               styles.filterText,
//               selectedFilter === filter.id && styles.filterTextActive,
//             ]}
//           >
//             {filter.label}
//           </Text>
//           {filter.id === 'unread' && unreadCount > 0 && (
//             <View style={styles.filterBadge}>
//               <Text style={styles.filterBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderNotificationItem = ({ item }) => {
//     const config = getNotificationConfig(item.notification_type);
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.notificationItem,
//           !item.is_read && styles.unreadNotification,
//         ]}
//         onPress={() => handleNotificationPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.notificationContent}>
//           <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
//             <Icon name={config.icon} size={24} color={config.color} />
//           </View>
          
//           <View style={styles.textContainer}>
//             <View style={styles.titleRow}>
//               <Text style={styles.title} numberOfLines={1}>
//                 {item.title}
//               </Text>
//               {!item.is_read && <View style={styles.unreadDot} />}
//             </View>
            
//             <Text style={styles.body} numberOfLines={2}>
//               {item.body}
//             </Text>
            
//             <View style={styles.footerRow}>
//               <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
//                 <Text style={[styles.typeText, { color: config.color }]}>
//                   {config.label}
//                 </Text>
//               </View>
//               <Text style={styles.time}>{formatTime(item.created_at)}</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity
//             style={styles.menuButton}
//             onPress={() => handleDeleteNotification(item)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Icon name="ellipsis-vertical" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIconContainer}>
//         <Icon name="notifications-off-outline" size={64} color="#ccc" />
//       </View>
//       <Text style={styles.emptyText}>No notifications yet</Text>
//       <Text style={styles.emptySubtext}>
//         When you receive notifications, they'll appear here
//       </Text>
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
        
//         <Text style={styles.headerTitle}>Notifications</Text>
        
//         {unreadCount > 0 && (
//           <TouchableOpacity 
//             style={styles.markAllButton}
//             onPress={handleMarkAllAsRead}
//           >
//             <Icon name="checkmark-done-outline" size={20} color="#007AFF" />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {renderFilterBar()}
//     </View>
//   );

//   const renderLoadingSpinner = () => (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#007AFF" />
//       <Text style={styles.loadingText}>Loading notifications...</Text>
//     </View>
//   );

//   const filteredNotifications = getFilteredNotifications();
//   const displayData = filteredNotifications.length > 0 ? filteredNotifications : (cachedData?.notifications || []);

//   // Show loading spinner on initial load
//   if (loading && isInitialLoad) {
//     return (
//       <SafeAreaView style={styles.safeArea} edges={['top']}>
//         <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//         <View style={styles.container}>
//           {renderHeader()}
//           {renderLoadingSpinner()}
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.container}>
//         {renderHeader()}
        
//         <FlatList
//           data={displayData}
//           renderItem={renderNotificationItem}
//           keyExtractor={(item) => item.id.toString()}
//           initialNumToRender={10}
//           maxToRenderPerBatch={15}
//           windowSize={10}
//           removeClippedSubviews={true}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh}
//               tintColor="#007AFF"
//               colors={['#007AFF']}
//             />
//           }
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.3}
//           ListEmptyComponent={!loading ? renderEmptyState : null}
//           ListFooterComponent={
//             loading && !isInitialLoad ? (
//               <View style={styles.footerLoader}>
//                 <ActivityIndicator size="small" color="#007AFF" />
//               </View>
//             ) : null
//           }
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={displayData.length === 0 && !loading && styles.emptyList}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   markAllButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     gap: 12,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     gap: 6,
//   },
//   filterButtonActive: {
//     backgroundColor: '#007AFF',
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//   },
//   filterTextActive: {
//     color: '#fff',
//   },
//   filterBadge: {
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   filterBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   notificationItem: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   unreadNotification: {
//     backgroundColor: '#F0F7FF',
//     borderColor: '#BBDEFB',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//     gap: 8,
//   },
//   title: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   body: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   footerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   typeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   typeText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   time: {
//     fontSize: 11,
//     color: '#999',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#007AFF',
//   },
//   menuButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyList: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   footerLoader: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
// });

// export default NotificationsScreen;


import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Image,
  StatusBar,
  Platform,
  Linking,
  AppState,
  ActivityIndicator,
} from 'react-native';
import { useNotification } from '../src/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';

// Initialize MMKV storage
const storage = createMMKV({
  id: 'notifications-storage',
});

// Cache keys
const CACHE_KEY = '@notifications_cache';
const CACHE_TIMESTAMP_KEY = '@notifications_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const NotificationsScreen = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [cachedData, setCachedData] = useState(null);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isInitialMount = useRef(true);
  const loadMoreTimeout = useRef(null);

  const filters = [
    { id: 'all', label: 'All', icon: 'notifications-outline' },
    { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
    { id: 'read', label: 'Read', icon: 'mail-outline' },
  ];

  // Notification types configuration
  const notificationTypes = {
    like: { 
      icon: 'heart', 
      color: '#FF3B30', 
      label: 'Like',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    love: { 
      icon: 'heart-circle', 
      color: '#FF3B30', 
      label: 'Love',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    comment: { 
      icon: 'chatbubble-outline', 
      color: '#34C759', 
      label: 'Comment',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id, scrollToComment: data.comment_id })
    },
    share: { 
      icon: 'share-outline', 
      color: '#5856D6', 
      label: 'Share',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    mention: { 
      icon: 'at-outline', 
      color: '#AF52DE', 
      label: 'Mention',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    follow: { 
      icon: 'person-add-outline', 
      color: '#007AFF', 
      label: 'Follow',
      navigateTo: 'OtherUserProfile',
      getParams: (data) => ({ userId: data.follower_id })
    },
    friend_request: { 
      icon: 'people-outline', 
      color: '#FF9500', 
      label: 'Friend Request',
      navigateTo: 'GroupConnect',
      getParams: () => ({ tab: 'requests' })
    },
    friend_accept: { 
      icon: 'checkmark-circle-outline', 
      color: '#34C759', 
      label: 'Friend Accepted',
      navigateTo: 'OtherUserProfile',
      getParams: (data) => ({ userId: data.friend_id })
    },
    message: { 
      icon: 'chatbubbles-outline', 
      color: '#5856D6', 
      label: 'Message',
      navigateTo: 'BPrivateChat',
      getParams: (data) => ({ userId: data.sender_id, userName: data.sender_name })
    },
    group_message: { 
      icon: 'people-circle-outline', 
      color: '#5856D6', 
      label: 'Group Message',
      navigateTo: 'GroupChat',
      getParams: (data) => ({ groupSlug: data.group_slug, groupName: data.group_name })
    },
    channel_post: { 
      icon: 'megaphone-outline', 
      color: '#FF9500', 
      label: 'Channel Post',
      navigateTo: 'ChannelDetails',
      getParams: (data) => ({ channelSlug: data.channel_slug, postId: data.post_id })
    },
    reward: { 
      icon: 'trophy-outline', 
      color: '#FFCC00', 
      label: 'Reward',
      navigateTo: 'EarningDashbord',
      getParams: () => ({ tab: 'rewards' })
    },
    withdrawal: { 
      icon: 'wallet-outline', 
      color: '#34C759', 
      label: 'Withdrawal',
      navigateTo: 'EarningWallet',
      getParams: () => ({ tab: 'transactions' })
    },
    ad_approved: { 
      icon: 'checkmark-circle-outline', 
      color: '#34C759', 
      label: 'Ad Approved',
      navigateTo: 'MyAds',
      getParams: (data) => ({ adId: data.ad_id })
    },
    ad_rejected: { 
      icon: 'close-circle-outline', 
      color: '#FF3B30', 
      label: 'Ad Rejected',
      navigateTo: 'Advertise',
      getParams: (data) => ({ adId: data.ad_id })
    },
    live_start: { 
      icon: 'radio-outline', 
      color: '#FF3B30', 
      label: 'Live Started',
      navigateTo: 'LiveStreaming',
      getParams: (data) => ({ streamId: data.stream_id, streamerId: data.user_id })
    },
    live_end: { 
      icon: 'radio-button-off-outline', 
      color: '#8E8E93', 
      label: 'Live Ended',
      navigateTo: 'LiveStreaming',
      getParams: (data) => ({ streamId: data.stream_id })
    },
    live_reminder: { 
      icon: 'alarm-outline', 
      color: '#FF9500', 
      label: 'Live Reminder',
      navigateTo: 'LiveStreaming',
      getParams: (data) => ({ streamId: data.stream_id })
    },
    status_update: { 
      icon: 'create-outline', 
      color: '#5856D6', 
      label: 'Status Update',
      navigateTo: 'OtherUserProfile',
      getParams: (data) => ({ userId: data.user_id, highlight: 'bio' })
    },
    call: { 
      icon: 'call-outline', 
      color: '#34C759', 
      label: 'Call',
      navigateTo: 'BCalls',
      getParams: () => ({ tab: 'missed' })
    },
    missed_call: { 
      icon: 'call-outline', 
      color: '#FF3B30', 
      label: 'Missed Call',
      navigateTo: 'BCalls',
      getParams: () => ({ tab: 'missed' })
    },
    new_post: { 
      icon: 'document-text-outline', 
      color: '#007AFF', 
      label: 'New Post',
      navigateTo: 'ExplorePostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    new_video: { 
      icon: 'videocam-outline', 
      color: '#FF9500', 
      label: 'New Video',
      navigateTo: 'SocialHome',
      getParams: (data) => ({ videoId: data.video_id })
    },
    new_listing: { 
      icon: 'cart-outline', 
      color: '#34C759', 
      label: 'New Listing',
      navigateTo: 'ListingDetails',
      getParams: (data) => ({ listingId: data.listing_id })
    },
    system: { 
      icon: 'settings-outline', 
      color: '#8E8E93', 
      label: 'System',
      navigateTo: 'Settings',
      getParams: () => ({ section: 'notifications' })
    },
    default: { 
      icon: 'notifications-outline', 
      color: '#8E8E93', 
      label: 'Notification',
      navigateTo: null,
      getParams: () => ({})
    },
  };

  // ==================== MMKV CACHE FUNCTIONS ====================

  const saveToMMKV = (key, data) => {
    try {
      console.log(`💾 Saving ${key} to MMKV cache...`);
      storage.set(key, JSON.stringify(data));
      console.log(`✅ ${key} saved to MMKV cache`);
    } catch (error) {
      console.error(`❌ Error saving ${key} to MMKV:`, error);
    }
  };

  const getFromMMKV = (key) => {
    try {
      const data = storage.getString(key);
      if (data) {
        console.log(`✅ ${key} loaded from MMKV cache`);
        return JSON.parse(data);
      }
      console.log(`📭 ${key} not found in MMKV cache`);
      return null;
    } catch (error) {
      console.error(`❌ Error getting ${key} from MMKV:`, error);
      return null;
    }
  };

  const deleteFromMMKV = (key) => {
    try {
      console.log(`🗑️ Deleting ${key} from MMKV cache...`);
      storage.delete(key);
      console.log(`✅ ${key} deleted from MMKV cache`);
    } catch (error) {
      console.error(`❌ Error deleting ${key} from MMKV:`, error);
    }
  };

  // ==================== CACHE FUNCTIONS ====================

  // Load cached notifications from MMKV
  const loadCachedNotifications = useCallback(() => {
    try {
      const cached = getFromMMKV(CACHE_KEY);
      const timestamp = getFromMMKV(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp);
        if (cacheAge < CACHE_DURATION) {
          setCachedData(cached);
          setIsCacheLoaded(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Error loading cache:', error);
      return false;
    }
  }, []);

  // Save to MMKV cache
  const saveToCache = useCallback((data) => {
    try {
      saveToMMKV(CACHE_KEY, data);
      saveToMMKV(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('❌ Error saving cache:', error);
    }
  }, []);

  // Clear MMKV cache
  const clearCache = useCallback(() => {
    try {
      deleteFromMMKV(CACHE_KEY);
      deleteFromMMKV(CACHE_TIMESTAMP_KEY);
      console.log('✅ Notifications cache cleared from MMKV');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }, []);

  // ==================== LOAD NOTIFICATIONS ====================

  const loadNotifications = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    
    try {
      // Try cache first for initial load
      if (isInitialMount.current && pageNum === 1) {
        const hasCache = loadCachedNotifications();
        if (hasCache) {
          setIsInitialLoad(false);
        }
        isInitialMount.current = false;
      }

      const result = await fetchNotifications(pageNum);
      
      if (result) {
        const notificationsData = result.notifications || [];
        const pagination = result.pagination || {};
        
        setHasMore(pagination.has_next || false);
        
        if (isRefresh || pageNum === 1) {
          // Save to MMKV cache
          saveToCache({
            notifications: notificationsData,
            unreadCount: result.unread_count || 0,
            timestamp: Date.now(),
          });
          setCachedData(null);
        }
        
        setPage(pageNum);
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, fetchNotifications, loadCachedNotifications, saveToCache]);

  // Initial load
  useEffect(() => {
    loadNotifications(1, true);
  }, []);

  // Refresh on app focus
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadNotifications(1, true);
      }
    });

    return () => subscription.remove();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Clear MMKV cache on refresh
    clearCache();
    await loadNotifications(1, true);
  };

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !refreshing) {
      if (loadMoreTimeout.current) {
        clearTimeout(loadMoreTimeout.current);
      }
      loadMoreTimeout.current = setTimeout(() => {
        loadNotifications(page + 1);
      }, 300);
    }
  }, [hasMore, loading, refreshing, page, loadNotifications]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (loadMoreTimeout.current) {
        clearTimeout(loadMoreTimeout.current);
      }
    };
  }, []);

  const handleNotificationPress = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    const config = notificationTypes[notification.notification_type] || notificationTypes.default;
    
    if (!config.navigateTo) {
      console.log('No navigation defined for type:', notification.notification_type);
      return;
    }
    
    const params = config.getParams(notification.data || {});
    
    try {
      navigation.navigate(config.navigateTo, params);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to open this notification');
    }
  };

  const handleDeleteNotification = (notification) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotification(notification.id);
              // Refresh the list after deletion
              await loadNotifications(1, true);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    
    Alert.alert(
      'Mark All as Read',
      `Mark all ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} as read?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark All', 
          onPress: async () => {
            try {
              await markAllAsRead();
              await loadNotifications(1, true);
            } catch (error) {
              Alert.alert('Error', 'Failed to mark all as read');
            }
          }
        },
      ]
    );
  };

  const getFilteredNotifications = () => {
    let data = notifications.length > 0 ? notifications : (cachedData?.notifications || []);
    
    if (selectedFilter === 'unread') {
      return data.filter(n => !n.is_read);
    }
    if (selectedFilter === 'read') {
      return data.filter(n => n.is_read);
    }
    return data;
  };

  const getNotificationConfig = (type) => {
    return notificationTypes[type] || notificationTypes.default;
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const renderFilterBar = () => (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            selectedFilter === filter.id && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter(filter.id)}
        >
          <Icon 
            name={filter.icon} 
            size={18} 
            color={selectedFilter === filter.id ? '#fff' : '#666'} 
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive,
            ]}
          >
            {filter.label}
          </Text>
          {filter.id === 'unread' && unreadCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNotificationItem = ({ item }) => {
    const config = getNotificationConfig(item.notification_type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.is_read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
            <Icon name={config.icon} size={24} color={config.color} />
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              {!item.is_read && <View style={styles.unreadDot} />}
            </View>
            
            <Text style={styles.body} numberOfLines={2}>
              {item.body}
            </Text>
            
            <View style={styles.footerRow}>
              <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
                <Text style={[styles.typeText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
              <Text style={styles.time}>{formatTime(item.created_at)}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleDeleteNotification(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="ellipsis-vertical" size={18} color="#999" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="notifications-off-outline" size={64} color="#ccc" />
      </View>
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>
        When you receive notifications, they'll appear here
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('BroadcastHome')}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notifications</Text>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Icon name="checkmark-done-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      
      {renderFilterBar()}
    </View>
  );

  const renderLoadingSpinner = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading notifications...</Text>
    </View>
  );

  const filteredNotifications = getFilteredNotifications();
  const displayData = filteredNotifications.length > 0 ? filteredNotifications : (cachedData?.notifications || []);

  // Show loading spinner on initial load
  if (loading && isInitialLoad) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          {renderHeader()}
          {renderLoadingSpinner()}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.container}>
        {renderHeader()}
        
        <FlatList
          data={displayData}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          ListFooterComponent={
            loading && !isInitialLoad ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={displayData.length === 0 && !loading && styles.emptyList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  markAllButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  notificationItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  unreadNotification: {
    backgroundColor: '#F0F7FF',
    borderColor: '#BBDEFB',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  body: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  menuButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default NotificationsScreen;