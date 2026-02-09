// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   Image,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   SafeAreaView,
// //   ActivityIndicator,
// // } from "react-native";
// // import Icon from "react-native-vector-icons/Ionicons";
// // import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";
// // import Signaling from "./signaling"; 
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const { width } = Dimensions.get("window");

// // export default function LivePage({ navigation }) {
// //   const [liveStreams, setLiveStreams] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const signaling = useRef(null);

// //   // Fetch live streams from API
// //   const fetchLiveStreams = async () => {
// //     try {
// //     const token = await AsyncStorage.getItem("userToken"); 
// //       const res = await fetch(`${API_ROUTE}/live-streams/`, {
// //      method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "Authorization": `Bearer ${token}`, 
// //       },
// //       });
      
// //       const data = await res.json();
// //       console.log("Fetching live streams from API...",data);
// //       setLiveStreams(data);
// //       setLoading(false);
// //     } catch (err) {
// //       console.warn("Error fetching live streams:", err);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLiveStreams();

// //     // Initialize signaling for real-time updates
// //     signaling.current = new Signaling("live-page", onSignalingMessage);
// //     signaling.current.connect();

// //     return () => {
// //       signaling.current?.close();
// //     };
// //   }, []);

// //   // Handle real-time signaling messages
// //   const onSignalingMessage = (msg) => {
// //     if (!msg || !msg.type) return;

// //     // Viewer count or likes update
// //     if (msg.type === "live-stream-update") {
// //       setLiveStreams((prev) =>
// //         prev.map((stream) =>
// //           stream.stream_id === msg.streamId
// //             ? { ...stream, viewer_count: msg.viewer_count, likes: msg.likes }
// //             : stream
// //         )
// //       );
// //     }
// //   };

// //   const renderItem = ({ item }) => (
// //     <TouchableOpacity
// //       style={styles.streamCard}
// //       onPress={() =>
// //         navigation.navigate("Viewer", {
// //         roomName: `user-${item.broadcaster_name}`,
// //         streamId: `stream-${item.broadcaster_name}`,
// //         viewerId: 'viewer-1',
// //         })
// //       }
// //     >
// //       {item.broadcaster_image ? (
// //         <Image
// //           source={{ uri: `${item.broadcaster_image}` }}
// //           style={styles.broadcasterImage}
// //         />
// //       ) : (
// //         <View style={styles.broadcasterImagePlaceholder}>
// //           <Text style={styles.broadcasterInitial}>
// //             {item.broadcaster_name.charAt(0).toUpperCase()}
// //           </Text>
// //         </View>
// //       )}
// //       <View style={styles.streamInfo}>
// //         <Text style={styles.broadcasterName}>{item.broadcaster_name}</Text>
// //         <View style={styles.liveBadge}>
// //           <View style={styles.liveDot} />
// //           <Text style={styles.liveText}>LIVE</Text>
// //         </View>
// //         <Text style={styles.statsText}>
// //           {item.viewer_count} viewers • {item.likes} likes
// //         </Text>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#ff375f" />
// //       </View>
// //     );
// //   }

// //   if (!liveStreams.length) {
// //     return (
// //       <View style={styles.emptyContainer}>
// //         <Text style={styles.emptyText}>No broadcasters live right now.</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <FlatList
// //         data={liveStreams}
// //         keyExtractor={(item) => item.stream_id}
// //         renderItem={renderItem}
// //         contentContainerStyle={styles.listContent}
// //         showsVerticalScrollIndicator={false}
// //       />
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#000",
// //   },
// //   listContent: {
// //     paddingVertical: 15,
// //     paddingHorizontal: 10,
// //   },
// //   streamCard: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(255,255,255,0.05)",
// //     borderRadius: 15,
// //     marginBottom: 12,
// //     padding: 10,
// //   },
// //   broadcasterImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: 12,
// //   },
// //   broadcasterImagePlaceholder: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: "#555",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 12,
// //   },
// //   broadcasterInitial: {
// //     color: "#fff",
// //     fontSize: 24,
// //     fontWeight: "bold",
// //   },
// //   streamInfo: {
// //     flex: 1,
// //   },
// //   broadcasterName: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     marginBottom: 4,
// //   },
// //   liveBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(255,0,0,0.8)",
// //     paddingHorizontal: 10,
// //     paddingVertical: 2,
// //     borderRadius: 12,
// //     alignSelf: "flex-start",
// //     marginBottom: 4,
// //   },
// //   liveDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: "#fff",
// //     marginRight: 6,
// //   },
// //   liveText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     fontWeight: "bold",
// //   },
// //   statsText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     opacity: 0.8,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#000",
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#000",
// //   },
// //   emptyText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     opacity: 0.7,
// //   },
// // });

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Animated,
//   RefreshControl,
//   Platform,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import LinearGradient from 'react-native-linear-gradient';
// import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";
// import Signaling from "./signaling"; 
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";

// const { width, height } = Dimensions.get("window");

// export default function LivePage({ navigation }) {
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const signaling = useRef(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [userName, setUserName] = useState('');


//   useEffect(()=>{
  
//         const fetchUserData =async () =>{
  
//           try {
  
//           const userDataString = await AsyncStorage.getItem('userData');
//                         const userData = userDataString ? JSON.parse(userDataString) : null;
//                         //console.log('User Dataaaaaa:', userData);
//                         const userId = userData?.id || 'unknown';
//                         const username = userData?.name || 'unknown';
//                         setUserName(username)
//                         //console.log('usernamennnn', username)
          
//         } catch (error) {
          
          
//         }
  
//         }
  
//         fetchUserData()
        
//       },[])

//   // Fetch live streams from API
//   const fetchLiveStreams = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken"); 
//       const res = await fetch(`${API_ROUTE}/live-streams/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//       });
      
//       const data = await res.json();
//       //console.log("Fetching live streams from API...", data);
//       setLiveStreams(data);
      
//       // Animate content in
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }).start();
      
//       setLoading(false);
//       setRefreshing(false);
//     } catch (err) {
//       //console.warn("Error fetching live streams:", err);
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };




//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchLiveStreams();
//   };

//   useEffect(() => {
//     fetchLiveStreams();

//     // Initialize signaling for real-time updates
//     signaling.current = new Signaling("live-page", onSignalingMessage);
//     signaling.current.connect();

//     return () => {
//       signaling.current?.close();
//     };
//   }, []);

//   // Handle real-time signaling messages
//   const onSignalingMessage = (msg) => {
//     if (!msg || !msg.type) return;

//     if (msg.type === "live-stream-update") {
//       setLiveStreams((prev) =>
//         prev.map((stream) =>
//           stream.stream_id === msg.streamId
//             ? { 
//                 ...stream, 
//                 viewer_count: msg.viewer_count, 
//                 likes: msg.likes,
//                 // Add pulse animation for updates
//                 updated: true 
//               }
//             : stream
//         )
//       );
//     }
//   };

//   const StreamCard = ({ item, index }) => {
//     const scaleAnim = useRef(new Animated.Value(1)).current;
//     const glowAnim = useRef(new Animated.Value(0)).current;

//     const handlePressIn = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 0.95,
//         useNativeDriver: true,
//       }).start();
//     };

//     const handlePressOut = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       }).start();
//     };

//     const startGlowAnimation = () => {
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     };

//     React.useEffect(() => {
//       if (item.updated) {
//         startGlowAnimation();
//         // Reset updated flag after animation
//         setTimeout(() => {
//           setLiveStreams(prev => 
//             prev.map(stream => 
//               stream.stream_id === item.stream_id 
//                 ? { ...stream, updated: false } 
//                 : stream
//             )
//           );
//         }, 1000);
//       }
//     }, [item.updated]);

//     return (
//       <Animated.View
//         style={[
//           styles.streamCard,
//           {
//             transform: [{ scale: scaleAnim }],
//             opacity: fadeAnim,
//           },
//         ]}
//       >
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           onPress={() =>
//             navigation.navigate("Viewer", {
//               roomName: `user-${item.broadcaster_name}`,
//               streamId: `stream-${item.broadcaster_name}`,
//               viewerId: 'viewer-1',
//             })
//           }
//         >
//           {/* Live Indicator Glow */}
//           <Animated.View
//             style={[
//               styles.liveGlow,
//               {
//                 opacity: glowAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [0.3, 0.8],
//                 }),
//               },
//             ]}
//           />
          
//           <LinearGradient
//             colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
//             style={styles.cardGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             {/* Header with broadcaster info */}
//             <View style={styles.cardHeader}>
//               <View style={styles.broadcasterInfo}>
//                 {item.broadcaster_image ? (
//                   <Image
//                     source={{ uri: `${item.broadcaster_image}` }}
//                     style={styles.broadcasterImage}
//                   />
//                 ) : (
//                   <LinearGradient
//                     colors={['#667eea', '#764ba2']}
//                     style={styles.broadcasterImagePlaceholder}
//                   >
//                     <Text style={styles.broadcasterInitial}>
//                       {item.broadcaster_name.charAt(0).toUpperCase()}
//                     </Text>
//                   </LinearGradient>
//                 )}
//                 <View style={styles.broadcasterDetails}>
//                   <Text style={styles.broadcasterName} numberOfLines={1}>
//                     {item.broadcaster_name}
//                   </Text>
//                   <Text style={styles.streamCategory}>Just Chatting</Text>
//                 </View>
//               </View>
              
//               {/* Live Badge */}
//               <LinearGradient
//                 colors={['#FF416C', '#FF4B2B']}
//                 style={styles.liveBadge}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <View style={styles.livePulse} />
//                 <Text style={styles.liveText}>LIVE</Text>
//               </LinearGradient>
//             </View>

//             {/* Stream Preview Area */}
//             <View style={styles.streamPreview}>
//               <LinearGradient
//                 colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
//                 style={styles.previewPlaceholder}
//               >
//                 <Icon name="videocam" size={40} color="rgba(255,255,255,0.7)" />
//                 <Text style={styles.previewText}>Live Stream Preview</Text>
//               </LinearGradient>
              
//               {/* Viewer Count Overlay */}
//               <View style={styles.viewerOverlay}>
//                 <LinearGradient
//                   colors={['rgba(0,0,0,0.7)', 'transparent']}
//                   style={styles.viewerGradient}
//                 >
//                   <View style={styles.viewerCount}>
//                     <Icon name="people" size={14} color="#fff" />
//                     <Text style={styles.viewerCountText}>
//                       {item.viewer_count} watching
//                     </Text>
//                   </View>
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Stream Stats */}
//             {/* <View style={styles.streamStats}>
//               <View style={styles.statItem}>
//                 <Icon name="heart" size={16} color="#FF416C" />
//                 <Text style={styles.statText}>{item.likes}</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Icon name="chatbubble" size={16} color="#4FC3F7" />
//                 <Text style={styles.statText}>{item.comments || 0}</Text>
//               </View>
             
//             </View> */}

//             {/* Join Stream Button */}
//             <TouchableOpacity
//               style={styles.joinButton}
//               onPress={() =>
//                 navigation.navigate("Viewer", {
//                   roomName: `user-${item.broadcaster_name}`,
//                   streamId: `stream-${item.broadcaster_name}`,
//                   viewerId: 'viewer-1',
//                 })
//               }
//             >
//               <LinearGradient
//                 colors={['#05309eff', '#0814bbff']}
//                 style={styles.joinButtonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Icon name="play" style={{marginBottom:20}} size={20} color="#fff" />
//                 <Text style={styles.joinButtonText}>Watch Stream</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   const LoadingSkeleton = () => (
//     <View style={styles.skeletonContainer}>
//       {[1, 2, 3].map((item) => (
//         <View key={item} style={styles.skeletonCard}>
//           <View style={styles.skeletonHeader}>
//             <View style={styles.skeletonAvatar} />
//             <View style={styles.skeletonText}>
//               <View style={styles.skeletonLine} />
//               <View style={[styles.skeletonLine, { width: '60%' }]} />
//             </View>
//           </View>
//           <View style={styles.skeletonPreview} />
//           <View style={styles.skeletonStats} />
//           <View style={styles.skeletonButton} />
//         </View>
//       ))}
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
           
//           <Text style={styles.headerTitle}>Live Streams</Text>
//           <Text style={styles.headerSubtitle}>Discover amazing content</Text>
//         </View>
//         <LoadingSkeleton />
//       </SafeAreaView>
//     );
//   }

//   if (!liveStreams.length) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <View style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
//             <TouchableOpacity onPress={()=>navigation.goBack()}>
//                <Icon name="arrow-back" size={40} color="rgba(87, 83, 83, 1)" />
//             </TouchableOpacity>
             
//             <Text style={[styles.headerTitle,{marginLeft:15}]}>Live Streams</Text>
//           </View>
          
//           <Text style={[styles.headerSubtitle,{marginLeft:50}]}>Discover amazing content</Text>
//         </View>
//         <View style={styles.emptyContainer}>
//           <LinearGradient
//             colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
//             style={styles.emptyGradient}
//           >
//             <Icon name="radio" size={80} color="rgba(255,255,255,0.3)" />
//             <Text style={styles.emptyTitle}>No Live Streams</Text>
//             <Text style={styles.emptyText}>
//               There are no broadcasters live right now. 
//               Check back later or be the first to go live!
//             </Text>
//             <TouchableOpacity 
//               style={styles.goLiveButton}
//               onPress={async () => {
                     
                
//                       navigation.navigate('Broadcaster', {
//                         roomName: `user-${userName}`,
//                         streamId: `stream-${userName}`,
//                         // userName: userData?.name || 'User',
//                         // userId: userId
//                       });
//                     }}
//             >
//               <LinearGradient
//                 colors={['#FF416C', '#FF4B2B']}
//                 style={styles.goLiveGradient}
//               >
                
//                 <Text style={styles.goLiveText}>Go Live</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Live Streams</Text>
//         <Text style={styles.headerSubtitle}>
//           {liveStreams.length} stream{liveStreams.length !== 1 ? 's' : ''} live now
//         </Text>
//       </View>

//       {/* Live Streams List */}
//       <FlatList
//         data={liveStreams}
//         keyExtractor={(item) => item.stream_id}
//         renderItem={({ item, index }) => (
//           <StreamCard item={item} index={index} />
//         )}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#667eea', '#764ba2']}
//             tintColor="#667eea"
//           />
//         }
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//       />

//       {/* Floating Action Button */}
//       <TouchableOpacity 
//         style={styles.fab}
//         onPress={async () => {
                     
                
//                       navigation.navigate('Broadcaster', {
//                         roomName: `user-${userName}`,
//                         streamId: `stream-${userName}`,
//                         // userName: userData?.name || 'User',
//                         // userId: userId
//                       });
//                     }}
//       >
//         <LinearGradient
//           colors={['#FF416C', '#FF4B2B']}
//           style={styles.fabGradient}
//         >
//           <Icon name="add" size={24} color="#fff" />
//         </LinearGradient>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0A0A0A",
//   },
//   header: {
//     padding: 20,
//     paddingBottom: 10,
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     fontFamily: "System",
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: "rgba(255,255,255,0.6)",
//     fontFamily: "System",
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   streamCard: {
//     borderRadius: 20,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   liveGlow: {
//     position: 'absolute',
//     top: -5,
//     left: -5,
//     right: -5,
//     bottom: -5,
//     backgroundColor: '#130aadff',
//     borderRadius: 25,
//     zIndex: -1,
//   },
//   cardGradient: {
//     borderRadius: 20,
//     padding: 16,
//     overflow: 'hidden',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 16,

//   },
//   broadcasterInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   broadcasterImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   broadcasterImagePlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   broadcasterInitial: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   broadcasterDetails: {
//     flex: 1,
//   },
//   broadcasterName: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 4,
//   },
//   streamCategory: {
//     color: "rgba(255,255,255,0.6)",
//     fontSize: 14,
//   },
//   liveBadge: {
//     paddingLeft:30,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Platform.OS === 'android' ? 10 : 0,
//     paddingVertical: 0,
//     borderRadius: 20,
//     marginLeft: 8,
//   },
//   livePsulse: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   backgroundColor: "#fff",
//     marginRight: 10,
//   },
//   liveText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "800",
//     padding:10,
//     marginRight: 15,
//   },
//   streamPreview: {
//     height: 180,
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     backgroundColor: 'rgba(255,255,255,0.05)',
//   },
//   previewPlaceholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   previewText: {
//     color: 'rgba(255,255,255,0.5)',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   viewerOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   viewerGradient: {
//     padding: 1,
//   },
//   viewerCount: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   viewerCountText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//     padding:10,
//   },
//   streamStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statText: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   joinButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   joinButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 1,
//     paddingHorizontal: 0,
//   },
//   joinButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     marginLeft: 8,
//     padding:20,
//     marginBottom:20,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     marginVertical: 8,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 30,
//     right: 20,
//     shadowColor: '#FF416C',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   fabGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Loading Skeleton Styles
//   skeletonContainer: {
//     padding: 16,
//   },
//   skeletonCard: {
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderRadius: 20,
//     padding: 16,
//     marginBottom: 16,
//   },
//   skeletonHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   skeletonAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     marginRight: 12,
//   },
//   skeletonText: {
//     flex: 1,
//   },
//   skeletonLine: {
//     height: 12,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 6,
//     marginBottom: 8,
//     width: '80%',
//   },
//   skeletonPreview: {
//     height: 180,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   skeletonStats: {
//     height: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   skeletonButton: {
//     height: 50,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 12,
//   },
//   // Empty State Styles
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 0,
//   },
//   emptyGradient: {
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 20,
//     width: '100%',
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//     marginTop: 20,
//     marginBottom: 12,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.6)',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 30,
//   },
//   goLiveButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     padding:10

//   },
//   goLiveGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     paddingBottom:20,
//   },
//   goLiveText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     marginLeft: 8,
//     padding:10,
//     width:120,
//     paddingBottom:30
//   },
// });
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  RefreshControl,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ROUTE } from '../api_routing/api';
import Signaling from './signaling';

const { width, height } = Dimensions.get('window');

// Brand Colors
const BRAND_COLORS = {
  primary: '#0066FF',
  primaryLight: '#0066FF',
  primaryDark: '#0047CC',
  secondary: '#0066FF',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const LivePage = ({ navigation }) => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  
  const signaling = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'gaming', label: 'Gaming', icon: 'game-controller' },
    { id: 'music', label: 'Music', icon: 'musical-notes' },
    { id: 'talk', label: 'Talk', icon: 'chatbubbles' },
    { id: 'creative', label: 'Creative', icon: 'color-palette' },
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = userDataString ? JSON.parse(userDataString) : null;
        setUserName(userData?.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch live streams
  const fetchLiveStreams = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_ROUTE}/live-streams/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setLiveStreams(data);
      setFilteredStreams(data);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching live streams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fadeAnim]);

  // Filter streams based on search and category
  useEffect(() => {
    let results = liveStreams;
    
    if (searchQuery.trim()) {
      results = results.filter(stream =>
        stream.broadcaster_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(stream => 
        stream.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredStreams(results);
  }, [searchQuery, selectedCategory, liveStreams]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLiveStreams();
  }, [fetchLiveStreams]);

  // Initialize component
  useEffect(() => {
    fetchLiveStreams();
    signaling.current = new Signaling('live-page', onSignalingMessage);
    signaling.current.connect();

    return () => signaling.current?.close();
  }, [fetchLiveStreams]);

  const onSignalingMessage = useCallback((msg) => {
    if (msg?.type === 'live-stream-update') {
      setLiveStreams(prev => prev.map(stream =>
        stream.stream_id === msg.streamId
          ? { ...stream, viewer_count: msg.viewer_count, updated: true }
          : stream
      ));
    }
  }, []);

  const handleGoLive = useCallback(() => {
    if (!userName) {
      alert('Please set up your profile first');
      return;
    }
    navigation.navigate('Broadcaster', {
      roomName: `user-${userName}`,
      streamId: `stream-${userName}`,
    });
  }, [navigation, userName]);

  const navigateToViewer = useCallback((broadcasterName) => {
    navigation.navigate('Viewer', {
      roomName: `user-${broadcasterName}`,
      streamId: `stream-${broadcasterName}`,
      viewerId: 'viewer-1',
    });
  }, [navigation]);

  const toggleSearch = useCallback(() => {
    Animated.spring(searchAnim, {
      toValue: showSearch ? 0 : 1,
      useNativeDriver: false,
    }).start();
    setShowSearch(!showSearch);
    if (showSearch) setSearchQuery('');
  }, [showSearch]);


  const headerHeight = 200;

  // Stream Card Component
  const StreamCard = React.memo(({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    const startGlow = useCallback(() => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [glowAnim]);

    useEffect(() => {
      if (item.updated) {
        startGlow();
        setTimeout(() => {
          setLiveStreams(prev => prev.map(stream =>
            stream.stream_id === item.stream_id ? { ...stream, updated: false } : stream
          ));
        }, 800);
      }
    }, [item.updated, item.stream_id]);

    const broadcasterInitial = item.broadcaster_name?.charAt(0).toUpperCase() || 'U';

    return (
      <Animated.View
        style={[
          styles.streamCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            marginLeft: index % 2 === 0 ? 0 : 8,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigateToViewer(item.broadcaster_name)}>
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim,
              },
            ]}
          />

          <View style={styles.cardContainer}>
            {/* Stream Preview */}
            <View style={styles.previewContainer}>
              <LinearGradient
                colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight]}
                style={styles.previewGradient}>
                <Icon name="videocam" size={32} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
              
              {/* Live Badge */}
              <LinearGradient
                colors={[BRAND_COLORS.danger, '#f62a2aff']}
                style={styles.liveBadge}>
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>LIVE</Text>
              </LinearGradient>

              {/* Viewer Count */}
              <View style={styles.viewerBadge}>
                <Icon name="people" size={12} color="#FFFFFF" />
                <Text style={styles.viewerCount}>
                  {item.viewer_count ? formatNumber(item.viewer_count) : '0'}
                </Text>
              </View>
            </View>

            {/* Stream Info */}
            <View style={styles.streamInfo}>
              <View style={styles.broadcasterRow}>
                {item.broadcaster_image ? (
                  <Image
                    source={{ uri: item.broadcaster_image }}
                    style={styles.broadcasterAvatar}
                  />
                ) : (
                  <LinearGradient
                    colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
                    style={styles.broadcasterAvatar}>
                    <Text style={styles.avatarText}>{broadcasterInitial}</Text>
                  </LinearGradient>
                )}
                <View style={styles.broadcasterInfo}>
                  <Text style={styles.broadcasterName} numberOfLines={1}>
                    {item.broadcaster_name}
                  </Text>
                  <Text style={styles.streamTitle} numberOfLines={1}>
                    {item.title || 'Just Chatting'}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon name="heart" size={14} color={BRAND_COLORS.danger} />
                  <Text style={styles.statText}>
                    {item.likes ? formatNumber(item.likes) : '0'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="chatbubble" size={14} color={BRAND_COLORS.secondary} />
                  <Text style={styles.statText}>
                    {item.comments ? formatNumber(item.comments) : '0'}
                  </Text>
                </View>
                <View style={[styles.statItem, styles.categoryBadge]}>
                  <Text style={styles.categoryText}>
                    {item.category || 'General'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonHeaderTop}>
          <View style={styles.skeletonBackButton} />
          <View style={styles.skeletonTitleContainer}>
            <View style={styles.skeletonTitle} />
            <View style={[styles.skeletonTitle, { width: '60%', height: 14 }]} />
          </View>
          <View style={styles.skeletonSearchButton} />
        </View>
      </View>
      <View style={styles.skeletonCategories} />
      <View style={styles.skeletonGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.skeletonCard}>
            <View style={styles.skeletonPreview} />
            <View style={styles.skeletonInfo}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonText}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '70%' }]} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Empty State
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[BRAND_COLORS.surface, BRAND_COLORS.background]}
        style={styles.emptyCard}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
            style={styles.emptyIconGradient}>
            <Icon name="radio-outline" size={64} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.emptyTitle}>No Live Streams</Text>
        <Text style={styles.emptyText}>
          Be the first to go live and start streaming to your audience!
        </Text>
        <TouchableOpacity
          style={styles.goLiveButton}
          onPress={handleGoLive}>
          <LinearGradient
            colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight]}
            style={styles.goLiveGradient}>
            <Icon name="videocam" size={20} color="#FFFFFF" />
            <Text style={styles.goLiveText}>Go Live Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Search bar height interpolation (fixed version)
  const searchBarHeight = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  const searchBarOpacity = searchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const searchBarMarginTop = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLORS.background} />
      
    
      <View style={styles.header}>
        <LinearGradient
          colors={[BRAND_COLORS.background, BRAND_COLORS.background]}
          style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={28} color={BRAND_COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Live Streams</Text>
                <Text style={styles.headerSubtitle}>
                  Watch and connect in real-time
                </Text>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={toggleSearch}>
                <Icon name={showSearch ? 'close' : 'search'} size={24} color={BRAND_COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <Animated.View style={[
              styles.searchContainer,
              {
                height: searchBarHeight,
                opacity: searchBarOpacity,
                marginTop: searchBarMarginTop,
              },
            ]}>
              <View style={styles.searchBar}>
                <Icon name="search" size={20} color={BRAND_COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search streams..."
                  placeholderTextColor={BRAND_COLORS.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="close-circle" size={20} color={BRAND_COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}>
              <Icon
                name={category.icon}
                size={18}
                color={selectedCategory === category.id ? BRAND_COLORS.primary : BRAND_COLORS.textSecondary}
              />
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <FlatList
        data={filteredStreams}
        keyExtractor={(item) => item.stream_id}
        renderItem={({ item, index }) => <StreamCard item={item} index={index} />}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          filteredStreams.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
            tintColor={BRAND_COLORS.primary}
            progressBackgroundColor={BRAND_COLORS.surface}
          />
        }
        ListEmptyComponent={
          loading ? <LoadingSkeleton /> : <EmptyState />
        }
        ListHeaderComponent={
          filteredStreams.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.streamCount}>
                {filteredStreams.length} {filteredStreams.length === 1 ? 'Stream' : 'Streams'} Live
              </Text>
            </View>
          ) : null
        }
      />

      {/* Go Live FAB */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleGoLive}
        activeOpacity={0.9}>
        <LinearGradient
          colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Icon name="videocam" size={24} color="#FFFFFF" />
          <Text style={styles.fabText}>Go Live</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerBackground: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop:15,
    fontSize: 30,
    fontWeight: '800',
    color: BRAND_COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
    marginTop: 2,
    marginBottom:20
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: BRAND_COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  categoriesContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  categoryButtonActive: {
    backgroundColor: BRAND_COLORS.primary + '20',
    borderColor: BRAND_COLORS.primary,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.textSecondary,
  },
  categoryLabelActive: {
    color: BRAND_COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  streamCount: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  streamCard: {
    flex: 1,
    marginBottom: 16,
    marginRight: 8,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 20,
    zIndex: -1,
  },
  cardContainer: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND_COLORS.surfaceLight,
  },
  previewContainer: {
    height: 160,
    backgroundColor: BRAND_COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: BRAND_COLORS.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 3,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    padding:10
  },
  viewerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  streamInfo: {
    padding: 16,
  },
  broadcasterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  broadcasterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  broadcasterInfo: {
    flex: 1,
  },
  broadcasterName: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 2,
  },
  streamTitle: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: BRAND_COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: BRAND_COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: BRAND_COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    ...Platform.select({
      ios: {
        shadowColor: BRAND_COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:Platform.OS === 'android'? 24 : 10,
    paddingVertical:Platform.OS === 'android' ? 16 : 0,
    borderRadius: 28,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    padding:20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  // Loading Skeleton Styles
  skeletonContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  skeletonHeader: {
    marginBottom: 20,
  },
  skeletonHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
  },
  skeletonTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 8,
    marginBottom: 6,
    width: '40%',
  },
  skeletonSearchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.surface,
  },
  skeletonCategories: {
    height: 44,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 22,
    marginBottom: 20,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '48%',
    marginBottom: 16,
  },
  skeletonPreview: {
    height: 160,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 20,
    marginBottom: 12,
  },
  skeletonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.surface,
    marginRight: 12,
  },
  skeletonText: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: 6,
    marginBottom: 8,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  goLiveButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  goLiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  goLiveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});

export default LivePage;
