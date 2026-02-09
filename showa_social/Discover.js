// import React, { useEffect, useState, useRef } from "react";
// import { 
//   View, 
//   FlatList, 
//   Text, 
//   StyleSheet, 
//   ActivityIndicator, 
//   TouchableOpacity, 
//   Dimensions,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   TextInput,
// } from "react-native";
// import Video from "react-native-video";
// import axios from "axios";
// import { API_ROUTE } from "../api_routing/api";
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useTheme } from '@react-navigation/native';
// import colors from "../theme/colors";
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = (width - 30) / 2;

// const ExploreScreen = ({navigation}) => {
//   const { colors } = useTheme();
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState("likes");
//   const [fullscreenVideo, setFullscreenVideo] = useState(null);
//   const [paused, setPaused] = useState(true);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     fetchVideos();
//   }, [sortBy]);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_ROUTE}/discover-shorts/?sort=${sortBy}`);
//       setVideos(response.data);
//     } catch (error) {
//       //console.error("Failed to fetch videos", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const openFullscreen = (item) => {
//     // setFullscreenVideo(item);
//     // setPaused(false);
//     navigation.navigate('SocialHome', { 
//       screen: 'SocialHome',
//       params: { 
//         initialVideo: item,
//         initialIndex: 0 
//       }
//     });
//   };

//   const closeFullscreen = () => {
//     setPaused(true);
//     setFullscreenVideo(null);
//   };

//   const togglePlayPause = () => {
//     setPaused(!paused);
//   };

//   const renderVideo = ({ item, index }) => (
//     <TouchableOpacity 
//       style={[
//         styles.card,
//         { marginLeft: index % 2 === 0 ? 0 : 10 }
//       ]}
//       activeOpacity={0.9}
//       onPress={() => openFullscreen(item)}
//     >
//       <View style={styles.videoContainer}>
//         <Video
//           source={{ uri: item.video }}
//           style={styles.thumbnail}
//           resizeMode="cover"
//           paused={true}
//           repeat={false}
//         />
//         <View style={styles.playButton}>
//           <Icon name="play-circle-filled" size={30} color="rgba(255,255,255,0.9)" />
//         </View>
//       </View>
      
//       <View style={styles.infoContainer}>
//         <Text style={[styles.caption, { color: colors.text }]} numberOfLines={2}>
//           {item.caption}
//         </Text>
//         <View style={styles.metaContainer}>
//           <View style={styles.metaItem}>
//             <Icon name="favorite" size={14} color="#ff4757" />
//             <Text style={[styles.metaText, { color: colors.text }]}>
//               {item.like_count.toLocaleString()}
//             </Text>
//           </View>
//           <View style={styles.metaItem}>
//             <Icon name="comment" size={14} color="#3498db" />
//             <Text style={[styles.metaText, { color: colors.text }]}>
//               {item.comment_count.toLocaleString()}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle={colors.text === '#000' ? 'dark-content' : 'light-content'} />
      
//       <View style={styles.header}>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Trending Shorts</Text>
//         <View style={styles.toggleContainer}>
          
//           <TouchableOpacity 
//             style={[styles.toggleButton, sortBy === "likes" && styles.activeToggle]}
//             onPress={() => setSortBy("likes")}
//           >
//             <Text style={[styles.toggleText, sortBy === "likes" && styles.activeToggleText]}>
//               Most Liked
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.toggleButton, sortBy === "comments" && styles.activeToggle]}
//             onPress={() => setSortBy("comments")}
//           >
//             <Text style={[styles.toggleText, sortBy === "comments" && styles.activeToggleText]}>
//               Most Comments
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//       ) : (
//         <FlatList
//           data={videos}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderVideo}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           onEndReachedThreshold={0.5}
//         />
//       )}

//       {/* Fullscreen Video Modal */}
//       <Modal
//         visible={!!fullscreenVideo}
//         supportedOrientations={['portrait', 'landscape']}
//         animationType="fade"
//       >
//         {fullscreenVideo && (
//           <View style={styles.fullscreenContainer}>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={closeFullscreen}
//             >
//               <Icon name="close" size={30} color="#fff" />
//             </TouchableOpacity>
            
//             <Video
//               ref={videoRef}
//               source={{ uri: fullscreenVideo.video }}
//               style={styles.fullscreenVideo}
//               resizeMode="contain"
//               paused={paused}
//               fullscreen={true}
//               controls={false}
//               repeat={true}
//             />
            
//             <TouchableOpacity 
//               style={styles.playPauseButton}
//               onPress={togglePlayPause}
//             >
//               <Icon 
//                 name={paused ? "play-circle-filled" : "pause-circle-filled"} 
//                 size={70} 
//                 color="rgba(255,255,255,0.7)" 
//               />
//             </TouchableOpacity>
            
//             <View style={styles.fullscreenInfo}>
//               <Text style={styles.fullscreenCaption}>{fullscreenVideo.caption}</Text>
//               <View style={styles.fullscreenMeta}>
//                 <View style={styles.fullscreenMetaItem}>
//                   <Icon name="favorite" size={20} color="#ff4757" />
//                   <Text style={styles.fullscreenMetaText}>
//                     {fullscreenVideo.like_count.toLocaleString()}
//                   </Text>
//                 </View>
//                 <View style={styles.fullscreenMetaItem}>
//                   <Icon name="comment" size={20} color="#3498db" />
//                   <Text style={styles.fullscreenMetaText}>
//                     {fullscreenVideo.comment_count.toLocaleString()}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 15,
//     paddingBottom: 10,
//   },
//   headerTitle: {
//     fontSize: 24,
    
//     marginBottom: 15,
//     marginTop:10,
//     fontFamily:'Lato-Black'
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },
//   toggleButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 15,
//     borderRadius: 15,
//     marginRight: 10,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//   },
//   activeToggle: {
//     backgroundColor: colors.primary,
//   },
//   toggleText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//   },
//   activeToggleText: {
//     color: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 10,
//     paddingBottom: 20,
//   },
//   card: {
//     width: CARD_WIDTH,
//     marginBottom: 10,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: 'rgba(0,0,0,0.05)',
//   },
//   videoContainer: {
//     position: 'relative',
//     aspectRatio: 9/16,
//   },
//   thumbnail: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#f0f0f0',
//   },
//   playButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -15 }, { translateY: -15 }],
//   },
//   infoContainer: {
//     padding: 10,
//   },
//   caption: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   metaText: {
//     marginLeft: 4,
//     fontSize: 12,
//     color: '#666',
//   },
//   fullscreenContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//   },
//   fullscreenVideo: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 5,
//   },
//   playPauseButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -35 }, { translateY: -35 }],
//     zIndex: 10,
//   },
//   fullscreenInfo: {
//     position: 'absolute',
//     bottom: 40,
//     left: 20,
//     right: 20,
//     zIndex: 10,
//   },
//   fullscreenCaption: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '500',
//     marginBottom: 15,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   fullscreenMeta: {   
//     flexDirection: 'row',
//   },
//   fullscreenMetaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   fullscreenMetaText: {
//     color: '#fff',
//     marginLeft: 5,
//     fontSize: 16,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
// });

// export default ExploreScreen;


import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal
} from "react-native";
import Video from "react-native-video";
import axios from "axios";
import { API_ROUTE } from "../api_routing/api";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import colors from "../theme/colors";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

const ExploreScreen = ({navigation}) => {
  const { colors } = useTheme();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("likes");
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [paused, setPaused] = useState(true);
  const videoRef = useRef(null);

  const skeletonData = Array.from({ length: 10 }).map((_, i) => ({ id: `skeleton-${i}` }));

  useEffect(() => {
    loadVideos(sortBy);
  }, [sortBy]);

  const loadVideos = async (currentSortBy) => {
    const cacheKey = `videos_${currentSortBy}`;
    setLoading(true);
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setVideos(JSON.parse(cached));
        setLoading(false);
        // Fetch fresh data in background
        fetchFresh(currentSortBy);
      } else {
        // First time: fetch and cache
        const response = await axios.get(`${API_ROUTE}/discover-shorts/?sort=${currentSortBy}`);
        const data = response.data;
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
        setVideos(data);
        setLoading(false);
      }
    } catch (error) {
      // If no cache and fetch fails, videos remains empty
      console.error("Failed to load videos", error);
      setLoading(false);
    }
  };

  const fetchFresh = async (currentSortBy) => {
    try {
      const response = await axios.get(`${API_ROUTE}/discover-shorts/?sort=${currentSortBy}`);
      const data = response.data;
      await AsyncStorage.setItem(`videos_${currentSortBy}`, JSON.stringify(data));
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch fresh videos", error);
    }
  };

  const renderSkeleton = ({ item, index }) => (
    <View 
      style={[
        styles.card,
        { marginLeft: index % 2 === 0 ? 0 : 10 }
      ]}
    >
      <View style={styles.skeletonVideoContainer} />
      <View style={styles.skeletonInfoContainer}>
        <View style={styles.skeletonCaption} />
        <View style={styles.skeletonMetaContainer}>
          <View style={styles.skeletonMetaItem} />
          <View style={styles.skeletonMetaItem} />
        </View>
      </View>
    </View>
  );

  const openFullscreen = (item) => {
    // setFullscreenVideo(item);
    // setPaused(false);
    navigation.navigate('SocialHome', { 
      screen: 'SocialHome',
      params: { 
        initialVideo: item,
        initialIndex: 0 
      }
    });
  };

  const closeFullscreen = () => {
    setPaused(true);
    setFullscreenVideo(null);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const renderVideo = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.card,
        { marginLeft: index % 2 === 0 ? 0 : 10 }
      ]}
      activeOpacity={0.9}
      onPress={() => openFullscreen(item)}
    >
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.video }}
          style={styles.thumbnail}
          resizeMode="cover"
          paused={true}
          repeat={false}
        />
        <View style={styles.playButton}>
          <Icon name="play-circle-filled" size={30} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.caption, { color: colors.text }]} numberOfLines={2}>
          {item.caption}
        </Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="favorite" size={14} color="#ff4757" />
            <Text style={[styles.metaText, { color: colors.text }]}>
              {item.like_count.toLocaleString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="comment" size={14} color="#3498db" />
            <Text style={[styles.metaText, { color: colors.text }]}>
              {item.comment_count.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#000' ? 'dark-content' : 'light-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Trending Shorts</Text>
        <View style={styles.toggleContainer}>
          
          <TouchableOpacity 
            style={[styles.toggleButton, sortBy === "likes" && styles.activeToggle]}
            onPress={() => setSortBy("likes")}
          >
            <Text style={[styles.toggleText, sortBy === "likes" && styles.activeToggleText]}>
              Most Liked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, sortBy === "comments" && styles.activeToggle]}
            onPress={() => setSortBy("comments")}
          >
            <Text style={[styles.toggleText, sortBy === "comments" && styles.activeToggleText]}>
              Most Comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={loading ? skeletonData : videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={loading ? renderSkeleton : renderVideo}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        onEndReachedThreshold={0.5}
      />

      {/* Fullscreen Video Modal */}
      <Modal
        visible={!!fullscreenVideo}
        supportedOrientations={['portrait', 'landscape']}
        animationType="fade"
      >
        {fullscreenVideo && (
          <View style={styles.fullscreenContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeFullscreen}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            
            <Video
              ref={videoRef}
              source={{ uri: fullscreenVideo.video }}
              style={styles.fullscreenVideo}
              resizeMode="contain"
              paused={paused}
              fullscreen={true}
              controls={false}
              repeat={true}
            />
            
            <TouchableOpacity 
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Icon 
                name={paused ? "play-circle-filled" : "pause-circle-filled"} 
                size={70} 
                color="rgba(255,255,255,0.7)" 
              />
            </TouchableOpacity>
            
            <View style={styles.fullscreenInfo}>
              <Text style={styles.fullscreenCaption}>{fullscreenVideo.caption}</Text>
              <View style={styles.fullscreenMeta}>
                <View style={styles.fullscreenMetaItem}>
                  <Icon name="favorite" size={20} color="#ff4757" />
                  <Text style={styles.fullscreenMetaText}>
                    {fullscreenVideo.like_count.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.fullscreenMetaItem}>
                  <Icon name="comment" size={20} color="#3498db" />
                  <Text style={styles.fullscreenMetaText}>
                    {fullscreenVideo.comment_count.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    
    marginBottom: 15,
    marginTop:10,
    fontFamily:'Lato-Black'
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeToggleText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  skeletonVideoContainer: {
    position: 'relative',
    aspectRatio: 9/16,
    backgroundColor: '#e0e0e0',
  },
  skeletonInfoContainer: {
    padding: 10,
  },
  skeletonCaption: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    height: 14,
    width: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  videoContainer: {
    position: 'relative',
    aspectRatio: 9/16,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  infoContainer: {
    padding: 10,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    zIndex: 10,
  },
  fullscreenInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  fullscreenCaption: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fullscreenMeta: {
    flexDirection: 'row',
  },
  fullscreenMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  fullscreenMetaText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default ExploreScreen;

