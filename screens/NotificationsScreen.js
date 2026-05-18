
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   Alert,
//   Image,
// } from 'react-native';
// import { useNotification } from '../src/context/NotificationContext';
// import { formatDistanceToNow } from 'date-fns';
// import { SafeAreaView } from 'react-native-safe-area-context';

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
//     if (hasMore && !loading) {
//       loadNotifications(page + 1);
//     }
//   };

//   const handleNotificationPress = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     // Navigate based on notification type
//     switch (notification.notification_type) {
//       case 'like':
//       case 'comment':
//         navigation.navigate('PostDetails', { postId: notification.data.post_id });
//         break;
//       case 'follow':
//         navigation.navigate('OtherUserProfile', { userId: notification.data.follower_id });
//         break;
//       case 'message':
//         navigation.navigate('Chat', { userId: notification.data.sender_id });
//         break;
//       case 'friend_request':
//         navigation.navigate('Friends', { tab: 'requests' });
//         break;
//       case 'reward':
//         navigation.navigate('EarningDashboard');
//         break;
//       default:
//         // Just mark as read
//         break;
//     }
//   };

//   const handleLongPress = (notification) => {
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

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'like':
//         return '❤️';
//       case 'comment':
//         return '💬';
//       case 'follow':
//         return '👤';
//       case 'message':
//         return '💬';
//       case 'friend_request':
//         return '👥';
//       case 'friend_accept':
//         return '✅';
//       case 'reward':
//         return '🎉';
//       case 'mention':
//         return '@';
//       default:
//         return '🔔';
//     }
//   };

//   const renderNotification = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.notificationItem,
//         !item.is_read && styles.unreadNotification,
//       ]}
//       onPress={() => handleNotificationPress(item)}
//       onLongPress={() => handleLongPress(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.notificationContent}>
//         <View style={styles.iconContainer}>
//           <Text style={styles.icon}>{getNotificationIcon(item.notification_type)}</Text>
//         </View>
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.body}>{item.body}</Text>
//           <Text style={styles.time}>
//             {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
//           </Text>
//         </View>
//         {!item.is_read && <View style={styles.unreadDot} />}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>
//           Notifications {unreadCount > 0 && `(${unreadCount})`}
//         </Text>
//         {unreadCount > 0 && (
//           <TouchableOpacity onPress={markAllAsRead}>
//             <Text style={styles.markAllText}>Mark all as read</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <FlatList
//         data={notifications}
//         renderItem={renderNotification}
//         keyExtractor={(item) => item.id.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.1}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No notifications yet</Text>
//             <Text style={styles.emptySubtext}>
//               When you get notifications, they'll appear here
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   markAllText: {
//     color: '#007AFF',
//     fontSize: 14,
//   },
//   notificationItem: {
//     backgroundColor: '#fff',
//     marginHorizontal: 12,
//     marginVertical: 6,
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   unreadNotification: {
//     backgroundColor: '#E3F2FD',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   icon: {
//     fontSize: 20,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   body: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   time: {
//     fontSize: 12,
//     color: '#999',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#007AFF',
//     marginLeft: 8,
//     marginTop: 4,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 100,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default NotificationsScreen;

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
// } from 'react-native';
// import { useNotification } from '../src/context/NotificationContext';
// import { formatDistanceToNow } from 'date-fns';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install: npm install react-native-vector-icons

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
//   const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'unread', 'read'

//   // Filters for different notification types
//   const filters = [
//     { id: 'all', label: 'All', icon: 'notifications-outline' },
//     { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
//     { id: 'read', label: 'Read', icon: 'mail-outline' },
//   ];

//   // Notification type configurations
//   const notificationTypes = {
//     like: { icon: 'heart', color: '#FF3B30', label: 'Like' },
//     comment: { icon: 'chatbubble-outline', color: '#34C759', label: 'Comment' },
//     follow: { icon: 'person-add-outline', color: '#007AFF', label: 'Follow' },
//     message: { icon: 'chatbubbles-outline', color: '#5856D6', label: 'Message' },
//     friend_request: { icon: 'people-outline', color: '#FF9500', label: 'Friend Request' },
//     friend_accept: { icon: 'checkmark-circle-outline', color: '#34C759', label: 'Friend Accepted' },
//     reward: { icon: 'trophy-outline', color: '#FFCC00', label: 'Reward' },
//     mention: { icon: 'at-outline', color: '#AF52DE', label: 'Mention' },
//     default: { icon: 'notifications-outline', color: '#8E8E93', label: 'Notification' },
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

//   const handleNotificationPress = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     // Navigate based on notification type
//     switch (notification.notification_type) {
//       case 'like':
//       case 'comment':
//         navigation.navigate('PostDetails', { postId: notification.data.post_id });
//         break;
//       case 'follow':
//         navigation.navigate('OtherUserProfile', { userId: notification.data.follower_id });
//         break;
//       case 'message':
//         navigation.navigate('BPrivateChat', { userId: notification.data.sender_id });
//         break;
//       case 'friend_request':
//         navigation.navigate('GroupConnect');
//         break;
//       case 'reward':
//         navigation.navigate('EarningDashbord');
//         break;
//       default:
//         break;
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
//         {
//           text: 'Mark All',
//           onPress: markAllAsRead,
//         },
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
//               <View style={styles.typeBadge}>
//                 <Text style={styles.typeText}>{config.label}</Text>
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
//     backgroundColor: '#f0f0f0',
//   },
//   typeText: {
//     fontSize: 10,
//     fontWeight: '500',
//     color: '#666',
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


import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import { useNotification } from '../src/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: 'notifications-outline' },
    { id: 'unread', label: 'Unread', icon: 'mail-unread-outline' },
    { id: 'read', label: 'Read', icon: 'mail-outline' },
  ];

  // Complete notification types configuration with navigation handlers
  const notificationTypes = {
    // Post related
    like: { 
      icon: 'heart', 
      color: '#FF3B30', 
      label: 'Like',
      navigateTo: 'PostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    love: { 
      icon: 'heart-circle', 
      color: '#FF3B30', 
      label: 'Love',
      navigateTo: 'PostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    comment: { 
      icon: 'chatbubble-outline', 
      color: '#34C759', 
      label: 'Comment',
      navigateTo: 'PostDetails',
      getParams: (data) => ({ postId: data.post_id, scrollToComment: data.comment_id })
    },
    share: { 
      icon: 'share-outline', 
      color: '#5856D6', 
      label: 'Share',
      navigateTo: 'PostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    mention: { 
      icon: 'at-outline', 
      color: '#AF52DE', 
      label: 'Mention',
      navigateTo: 'PostDetails',
      getParams: (data) => ({ postId: data.post_id })
    },
    
    // User related
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
    
    // Messages
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
    
    // Channel
    channel_post: { 
      icon: 'megaphone-outline', 
      color: '#FF9500', 
      label: 'Channel Post',
      navigateTo: 'ChannelDetails',
      getParams: (data) => ({ channelSlug: data.channel_slug, postId: data.post_id })
    },
    
    // Rewards & Earnings
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
    
    // Ads
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
    
    // Livestream
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
    
    // Status updates
    status_update: { 
      icon: 'create-outline', 
      color: '#5856D6', 
      label: 'Status Update',
      navigateTo: 'OtherUserProfile',
      getParams: (data) => ({ userId: data.user_id, highlight: 'bio' })
    },
    
    // Calls
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
    
    // New content from followed users
    new_post: { 
      icon: 'document-text-outline', 
      color: '#007AFF', 
      label: 'New Post',
      navigateTo: 'PostDetails',
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
    
    // System
    system: { 
      icon: 'settings-outline', 
      color: '#8E8E93', 
      label: 'System',
      navigateTo: 'Settings',
      getParams: () => ({ section: 'notifications' })
    },
    
    // Default
    default: { 
      icon: 'notifications-outline', 
      color: '#8E8E93', 
      label: 'Notification',
      navigateTo: null,
      getParams: () => ({})
    },
  };

  const loadNotifications = async (pageNum = 1, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    
    const result = await fetchNotifications(pageNum);
    if (result) {
      setHasMore(result.pagination?.has_next || false);
      if (isRefresh) {
        setPage(1);
      } else {
        setPage(pageNum);
      }
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications(1, true);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !loading && !refreshing) {
      loadNotifications(page + 1);
    }
  };

  // Main navigation handler
  const handleNotificationPress = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    const config = notificationTypes[notification.notification_type] || notificationTypes.default;
    
    if (!config.navigateTo) {
      console.log('No navigation defined for type:', notification.notification_type);
      return;
    }
    
    // Get navigation params
    const params = config.getParams(notification.data || {});
    
    // Navigate based on type
    try {
      switch (notification.notification_type) {
        // Post related
        case 'like':
        case 'love':
        case 'comment':
        case 'share':
        case 'mention':
        case 'new_post':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // User profile related
        case 'follow':
        case 'friend_accept':
        case 'status_update':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Messages
        case 'message':
          navigation.navigate(config.navigateTo, {
            ...params,
            fromNotification: true,
          });
          break;
          
        case 'group_message':
          navigation.navigate(config.navigateTo, {
            ...params,
            fromNotification: true,
          });
          break;
          
        // Channel
        case 'channel_post':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Friend request
        case 'friend_request':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Rewards
        case 'reward':
          navigation.navigate(config.navigateTo, params);
          break;
          
        case 'withdrawal':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Ads
        case 'ad_approved':
        case 'ad_rejected':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Livestream
        case 'live_start':
        case 'live_reminder':
          navigation.navigate(config.navigateTo, params);
          break;
          
        case 'live_end':
          // Show alert for ended live stream
          Alert.alert(
            'Live Stream Ended',
            'This live stream has ended. Would you like to watch the replay?',
            [
              { text: 'No', style: 'cancel' },
              { text: 'Watch Replay', onPress: () => navigation.navigate(config.navigateTo, params) }
            ]
          );
          break;
          
        // Calls
        case 'call':
        case 'missed_call':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Videos
        case 'new_video':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // Listings
        case 'new_listing':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // System
        case 'system':
          navigation.navigate(config.navigateTo, params);
          break;
          
        // External links (if any)
        case 'external_link':
          if (notification.data?.url) {
            await Linking.openURL(notification.data.url);
          }
          break;
          
        default:
          console.log('Unhandled notification type:', notification.notification_type);
          // Optional: Show alert that this feature is coming soon
          Alert.alert(
            'Coming Soon',
            `Navigation for ${notification.notification_type} notifications will be available soon.`
          );
      }
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
          onPress: () => deleteNotification(notification.id),
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
        { text: 'Mark All', onPress: markAllAsRead },
      ]
    );
  };

  const getFilteredNotifications = () => {
    if (selectedFilter === 'unread') {
      return notifications.filter(n => !n.is_read);
    }
    if (selectedFilter === 'read') {
      return notifications.filter(n => n.is_read);
    }
    return notifications;
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
          onPress={() => navigation.goBack()}
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

  const filteredNotifications = getFilteredNotifications();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.container}>
        {renderHeader()}
        
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filteredNotifications.length === 0 && styles.emptyList}
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
});

export default NotificationsScreen;