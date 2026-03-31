// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   ActivityIndicator
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';

// const OnlineStatusBadge = ({ 
//   userId, 
//   showText = true, 
//   showDot = true,
//   textStyle = {},
//   dotSize = 8,
//   showLastSeen = true,
//   showDetailedTime = false,
//   compact = false,
//   onStatusChange = null
// }) => {
//   const [status, setStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const intervalRef = useRef(null);

//   //========= Pulse animation for online status =======================
//   useEffect(() => {
//     if (status?.is_online) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.2,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     } else {
//       pulseAnim.setValue(1);
//     }

//     return () => {
//       pulseAnim.stopAnimation();
//     };
//   }, [status?.is_online]);

//   // Fetch user status
//   const fetchStatus = async () => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(
//         `${API_ROUTE}/user-status/${userId}/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       setStatus(response.data);
//       setError(false);
      
//       if (onStatusChange) {
//         onStatusChange(response.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch user status:', error);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Set up polling for status updates
//   useEffect(() => {
//     fetchStatus();

//     // Poll every 30 seconds for status updates
//     intervalRef.current = setInterval(fetchStatus, 30000);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [userId]);

//   if (loading) {
//     return compact ? null : <ActivityIndicator size="small" color="#999" />;
//   }

//   if (error || !status) {
//     return compact ? null : (
//       <View style={styles.container}>
//         {showDot && <View style={[styles.dot, styles.offline]} />}
//         {showText && <Text style={[styles.text, textStyle]}>Offline</Text>}
//       </View>
//     );
//   }

//   const getLastSeenText = () => {
//     if (!status.last_seen_display) return 'Offline';
    
//     if (showDetailedTime) {
//       // Show detailed time like "Last seen 2 hours ago"
//       return `Last seen ${status.last_seen_display}`;
//     } else {
//       // Just show the time ago
//       return status.last_seen_display;
//     }
//   };

//   // Compact mode for lists
//   if (compact) {
//     return (
//       <View style={styles.compactContainer}>
//         <Animated.View
//           style={[
//             styles.dot,
//             status.is_online ? styles.online : styles.offline,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {showDot && (
//         <Animated.View
//           style={[
//             styles.dot,
//             { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
//             status.is_online ? styles.online : styles.offline,
//             status.is_online && { transform: [{ scale: pulseAnim }] }
//           ]}
//         />
//       )}
      
//       {showText && (
//         <Text style={[styles.text, textStyle]}>
//           {status.is_online ? 'Online' : (showLastSeen ? getLastSeenText() : 'Offline')}
//         </Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   compactContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   online: {
//     backgroundColor: '#4CAF50',
//     shadowColor: '#4CAF50',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   offline: {
//     backgroundColor: '#9E9E9E',
//   },
//   text: {
//     fontSize: 12,
//     color: '#666',
//   },
// });

// export default OnlineStatusBadge;

// components/OnlineStatusBadge.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';

const OnlineStatusBadge = ({ 
  userId, 
  showText = false, 
  showDot = true,
  dotSize = 12,
  showLastSeen = false,
  showDetailedTime = false,
  compact = false,
  onStatusChange = null,
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  avatarSize = 48, // Size of the avatar image
  borderWidth = 2,
  borderColor = '#fff'
}) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  // Pulse animation for online status
  useEffect(() => {
    if (status?.is_online) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [status?.is_online]);

  // Fetch user status
  const fetchStatus = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_ROUTE}/user-status/${userId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setStatus(response.data);
      setError(false);
      
      if (onStatusChange) {
        onStatusChange(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for status updates
  useEffect(() => {
    fetchStatus();

    // Poll every 30 seconds for status updates
    intervalRef.current = setInterval(fetchStatus, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userId]);

  if (!showDot) {
    return null;
  }

  if (loading && !status) {
    return null;
  }

  if (error || !status) {
    return null;
  }

  // Calculate position styles
  const getPositionStyles = () => {
    const dotRadius = dotSize / 2;
    const offset = dotSize / 3;
    
    switch(position) {
      case 'bottom-right':
        return {
          position: 'absolute',
          bottom: -offset,
          right: -offset,
        };
      case 'bottom-left':
        return {
          position: 'absolute',
          bottom: -offset,
          left: -offset,
        };
      case 'top-right':
        return {
          position: 'absolute',
          top: -offset,
          right: -offset,
        };
      case 'top-left':
        return {
          position: 'absolute',
          top: -offset,
          left: -offset,
        };
      default:
        return {
          position: 'absolute',
          bottom: -offset,
          right: -offset,
        };
    }
  };

  // Don't show offline dot for compact mode
  if (compact && !status.is_online) {
    return null;
  }

  return (
    <View style={[getPositionStyles(), styles.badgeContainer]}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            borderWidth: borderWidth,
            borderColor: borderColor,
          },
          status.is_online ? styles.online : styles.offline,
          status.is_online && { transform: [{ scale: pulseAnim }] }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    zIndex: 10,
  },
  dot: {
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    marginRight:12,
    marginTop:-20
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#9E9E9E',
  },
});

export default OnlineStatusBadge;