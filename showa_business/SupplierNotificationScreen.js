

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   RefreshControl,
//   Image,
//   StatusBar,
//   Platform
// } from "react-native";
// import axios from "axios";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { API_ROUTE } from "../api_routing/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import moment from "moment";
// import LottieView from 'lottie-react-native';
// import { SafeAreaView } from "react-native-safe-area-context";
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../src/context/ThemeContext';

// export default function SupplierNotificationScreen({ navigation }) {
//   const { colors, isDark, theme } = useTheme();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchNotifications = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/supplier-notifications/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (response.status === 200 || response.status === 201) {
//         setNotifications(response.data);
        
//       }
//     } catch (err) {
//       console.error("Failed to fetch notifications", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchNotifications();
//   };

//   const goBack = () => {
//     navigation.goBack();
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.card,
//         { backgroundColor: colors.surface },
//         !item.is_read && [styles.unreadCard, { borderLeftColor: colors.primary }]
//       ]}
//       onPress={() => navigation.navigate("SupplyRequestDetailScreen", { requestId: item.request })}
//     >
//       <View style={styles.cardHeader}>
//         <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceVariant }]}>
//           <Text style={[styles.category, { color: colors.primary }]}>{item.request_category}</Text>
//         </View>
//         <Text style={[styles.time, { color: colors.textTertiary }]}>
//           {moment(item.request_created_at).fromNow()}
//         </Text>
//       </View>
      
//       <Text style={[styles.title, { color: colors.text }]}>{item.request_title}</Text>
//       <Text style={[styles.note, { color: colors.textSecondary }]}>{item.request_note}</Text>
      
//       <View style={styles.footer}>
//         <View style={styles.location}>
//           <MaterialIcons name="location-on" size={16} color={colors.primary} />
//           <Text style={[styles.address, { color: colors.textTertiary }]}>{item.request_address}</Text>
//         </View>
//         <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        
//         {/* Header with gradient like CallsScreen */}
//         <LinearGradient colors={[colors.primary, colors.primary,]} style={styles.header}>
//           <View style={styles.headerTop}>
//             <View style={styles.headerLeft}>
//               <TouchableOpacity 
//                 style={[styles.backButton, {backgroundColor: 'rgba(255,255,255,0.2)' }, ]}
//                 onPress={goBack}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <MaterialIcons name="arrow-back" size={24} color='#fff' />
//               </TouchableOpacity>
//               <View style={{alignSelf:'center'}}>
//                 <Text style={[styles.heading, { color: '#fff' }]}>Supply Requests</Text>
//                 <Text style={[styles.subHeading, { color: 'rgba(255,255,255,0.8)' }]}>Notifications</Text>
//               </View>
//             </View>
           
//           </View>
//         </LinearGradient>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.primary} />
//           </View>
//         ) : notifications.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <LottieView
//               source={require('../assets/animations/Notification Bell.json')}
//               autoPlay
//               loop
//               style={styles.animation}
//             />
//             <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Requests Yet</Text>
//             <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
//               When you receive supply requests, they'll appear here
//             </Text>
//             <TouchableOpacity 
//               style={[styles.exploreButton, { backgroundColor: colors.primary }]}
//               onPress={onRefresh}
//             >
//               <Text style={[styles.exploreButtonText, { color:  '#fff' }]}>Refresh</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <FlatList
//             data={notifications}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             contentContainerStyle={styles.listContent}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={[colors.primary]}
//                 tintColor={colors.primary}
//               />
//             }
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     paddingBottom: Platform.OS === 'android' ? 16 : 0,
//     paddingTop: Platform.OS === 'android' ? 14 : 0,
  
//     elevation: 6,
//     zIndex: 1000,
//       alignItems: "center",
//   },
//   headerTop: {
//     paddingTop: 0,
//     paddingHorizontal: Platform.OS === 'android' ? 10 : 20,
//     paddingVertical: Platform.OS === 'android' ? 10 : 25,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   backButton: {
//     marginRight: 12,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "700",
//     paddingVertical:20,
//     textAlign:'center',
//     justifyContent:'center',
//     marginLeft:10
//   },
//   subHeading: {
//     fontSize: 14,
//     marginTop: -10,
//      marginLeft:10
//   },
//   refreshButton: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   card: {
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   unreadCard: {
//     borderLeftWidth: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//     alignItems: 'center',
//   },
//   categoryBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   category: {
//     fontSize: 12,
//     fontWeight: "600",
//     textTransform: "uppercase",
//   },
//   time: {
//     fontSize: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   note: {
//     fontSize: 14,
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   location: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   address: {
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   animation: {
//     width: 200,
//     height: 200,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginTop: 20,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 8,
//     lineHeight: 20,
//     maxWidth: 300,
//   },
//   exploreButton: {
//     marginTop: 24,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   exploreButtonText: {
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar,
  Platform,
  Modal,
  Animated
} from "react-native";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { API_ROUTE } from "../api_routing/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import LottieView from 'lottie-react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';

export default function SupplierNotificationScreen({ navigation }) {
  const { colors, isDark, theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/supplier-notifications/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setNotifications(response.data);
        // Count unread notifications
        const unread = response.data.filter(item => !item.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToSupplyRequest = () => {
    navigation.navigate("Supplyrequest");
    //navigation.navigate("SupplyRequestForm");
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/supplier-notifications/${notificationId}/read/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setNotifications(prev =>
        prev.map(item =>
          item.id === notificationId ? { ...item, is_read: true } : item
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        !item.is_read && [styles.unreadCard, { borderLeftColor: colors.primary }]
      ]}
      onPress={() => {
        if (!item.is_read) {
          markAsRead(item.id);
        }
        navigation.navigate("SupplyRequestDetailScreen", { requestId: item.request });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceVariant || colors.backgroundSecondary }]}>
          <Text style={[styles.category, { color: colors.primary }]}>{item.request_category}</Text>
        </View>
        <View style={styles.cardRight}>
          {!item.is_read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
          <Text style={[styles.time, { color: colors.textTertiary }]}>
            {moment(item.request_created_at).fromNow()}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {item.request_title}
      </Text>
      <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.request_note}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.location}>
          <MaterialIcons name="location-on" size={16} color={colors.primary} />
          <Text style={[styles.address, { color: colors.textTertiary }]} numberOfLines={1}>
            {item.request_address}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LottieView
        source={require('../assets/animations/Notification Bell.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Requests Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
        When you receive supply requests, they'll appear here
      </Text>
      <TouchableOpacity 
        style={[styles.exploreButton, { backgroundColor: colors.primary }]}
        onPress={onRefresh}
      >
        <Text style={[styles.exploreButtonText, { color: '#fff' }]}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.primary} 
          translucent={Platform.OS === 'android'}
        />
        
        {/* Header */}
        <LinearGradient 
          colors={[colors.primary, colors.primary,]} 
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={goBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="arrow-back" size={24} color='#fff' />
              </TouchableOpacity>
              <View>
                <Text style={styles.heading}>Supply Requests</Text>
                <Text style={styles.subHeading}>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={goToSupplyRequest}
            >
              <LinearGradient 
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} 
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={28} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Summary */}
        {notifications.length > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {notifications.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {unreadCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unread</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success || '#4CAF50' }]}>
                {notifications.length - unreadCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Read</Text>
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading requests...
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
                progressBackgroundColor={colors.surface}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    elevation: 6,
    zIndex: 1000,
  },
  headerTop: {
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    paddingVertical: Platform.OS === 'android' ? 16 : 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: '#fff',
  },
  subHeading: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: 'center',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  time: {
    fontSize: 11,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  note: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  address: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  animation: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  exploreButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});