// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   ImageBackground,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import TrackPlayer, { State, usePlaybackState, Capability } from 'react-native-track-player';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');

// const Music = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [tracks, setTracks] = useState([]);
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const playbackState = usePlaybackState();

//   // Initialize TrackPlayer=======
//   useEffect(() => {
//     const setupPlayer = async () => {
//       try {
//         await TrackPlayer.setupPlayer();
//         //console.log('Track Player initialized');
//         await TrackPlayer.updateOptions({
//           stopWithApp: false,
//           capabilities: [
//             Capability.Play,
//             Capability.Pause,
//             Capability.Stop,
//           ],
//           compactCapabilities: [
//             Capability.Play,
//             Capability.Pause,
//           ],
//         });
//       } catch (error) {
//        // console.log('Setup error:', error);
//       }
//     };

//     setupPlayer();

//     return () => {
//       TrackPlayer.reset();
//     };
//   }, []);

//   useEffect(() => {
//     fetchMusic();
//   }, []);

//   const fetchMusic = async (query = '') => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/music-list/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setTracks(response.data);
//       }
//     } catch (error) {
//      // console.error('Error fetching tracks:', error);
//       Alert.alert('Error', 'Failed to load music');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTrackPress = async (track) => {
//     if (currentTrack?.id === track.id) {
//       // If the same track is clicked, toggle play/pause
//       const state = await TrackPlayer.getState();
//       if (state === State.Playing) {
//         await TrackPlayer.pause();
//       } else {
//         await TrackPlayer.play();
//       }
//     } else {
//       // If a different track is clicked, play it
//       await playTrack(track);
//     }
//   };

//   const playTrack = async (track) => {
//     try {
//       const audioUrl = `${API_ROUTE_IMAGE}${track.audio_file}`;
//       await TrackPlayer.reset();
//       await TrackPlayer.add({
//         id: String(track.id),
//         url: audioUrl,
//         title: track.title,
//         artist: track.artist || 'Unknown',
//         artwork: track.cover_image
//           ? `${API_ROUTE_IMAGE}${track.cover_image}`
//           : 'https://via.placeholder.com/300',
//       });
//       await TrackPlayer.play();
//       setCurrentTrack(track);
//     } catch (error) {
//       //console.error('Error playing track:', error);
//       Alert.alert(
//         'Playback Error',
//         'Could not play the selected track.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   const renderTrackItem = ({ item }) => {
//     const isCurrentTrack = currentTrack?.id === item.id;
//     const isPlaying = isCurrentTrack && playbackState === State.Playing;
    
//     return (
//       <TouchableOpacity
//         style={styles.trackItem}
//         activeOpacity={0.8}
//         onPress={() => handleTrackPress(item)}
//       >
//         <Image
//           source={{
//             uri: item.cover_image
//               ? `${API_ROUTE_IMAGE}${item.cover_image}`
//               : 'https://via.placeholder.com/300',
//           }}
//           style={styles.trackImage}
//         />
//         <View style={styles.trackInfo}>
//           <Text 
//             style={[
//               styles.trackTitle,
//               isCurrentTrack && { color: '#0768F0' }
//             ]} 
//             numberOfLines={1}
//           >
//             {item.title}
//           </Text>
//           <Text style={styles.trackArtist} numberOfLines={1}>
//             {item.artist} ~ {item.duration}m
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => handleTrackPress(item)}>
//           <Icon
//             name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
//             size={38}
//             color={isCurrentTrack ? '#0768F0' : '#888'}
//           />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   const renderFooter = () => (
//     <ImageBackground
//       source={{ uri: 'https://i.ytimg.com/vi/2MygGSZVyw8/maxresdefault.jpg' }}
//       style={styles.exploreContainer}
//       imageStyle={styles.exploreImage}
//     >
//       <View style={styles.exploreOverlay}>
//         <Text style={styles.exploreText}>Explore More</Text>
//         <TouchableOpacity style={styles.exploreButton}>
//           <Text style={styles.exploreButtonText}>Discover New Music</Text>
//           <Icon name="arrow-forward" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
//         <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search songs, artists..."
//           placeholderTextColor="#aaa"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           onSubmitEditing={() => fetchMusic(searchQuery)}
//           onFocus={() => setIsSearchFocused(true)}
//           onBlur={() => setIsSearchFocused(false)}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Icon name="close" size={20} color="#888" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Track List */}
//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0768F0" />
//         </View>
//       ) : (
//         <FlatList
//           data={tracks}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Icon name="music-off" size={60} color="#ccc" />
//               <Text style={styles.emptyText}>No music found</Text>
//             </View>
//           }
//           ListFooterComponent={renderFooter}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderTrackItem}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#101010',
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1c1c1c',
//     borderRadius: 30,
//     paddingHorizontal: 16,
//     height: 50,
//     marginBottom: 20,
//   },
//   searchContainerFocused: {
//     borderWidth: 1,
//     borderColor: '#0768F0',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   trackItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#181818',
//     borderRadius: 14,
//     padding: 12,
//     marginBottom: 12,
//   },
//   trackImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 14,
//   },
//   trackInfo: {
//     flex: 1,
//   },
//   trackTitle: {
//     fontWeight: '700',
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 4,
//   },
//   trackArtist: {
//     fontSize: 14,
//     color: '#aaa',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 80,
//   },
//   emptyText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#aaa',
//   },
//   exploreContainer: {
//     marginTop: 30,
//     borderRadius: 12,
//     overflow: 'hidden',
//     height: 180,
//     marginBottom: 40,
//   },
//   exploreImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 12,
//   },
//   exploreOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)', 
//   },
//   exploreText: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textShadowColor: 'rgba(0,0,0,0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//     fontFamily:'Montserrat-VariableFont_wght'
//   },
//   exploreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0768F0',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//   },
//   exploreButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 10,
//   },
// });

// export default Music;
// Music.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Video from 'react-native-video';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Music = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoRef = useRef(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async (query = '') => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/music-list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setTracks(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPress = async (track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for current track
      togglePlayback();
    } else {
      // Play new track
      await playTrack(track);
    }
  };

  const playTrack = async (track) => {
    try {
      const audioUrl = `${API_ROUTE_IMAGE}${track.audio_file}`;
      
      // Stop current playback if any
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
      
      setCurrentTrack(track);
      setIsPlaying(true);
      
    
    } catch (error) {
      Alert.alert(
        'Playback Error',
        'Could not play the selected track.',
        [{ text: 'OK' }]
      );
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const stopTrack = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  const onError = (error) => {
    console.error('Video playback error:', error);
    Alert.alert('Playback Error', 'Could not play the audio file.');
    setIsPlaying(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const seekTo = (position) => {
    if (videoRef.current) {
      videoRef.current.seek(position);
      setCurrentTime(position);
    }
  };

  const renderTrackItem = ({ item }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const showPause = isCurrentTrack && isPlaying;
    
    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrentTrack && styles.currentTrackItem]}
        activeOpacity={0.8}
        onPress={() => handleTrackPress(item)}
      >
        <Image
          source={{
            uri: item.cover_image
              ? `${API_ROUTE_IMAGE}${item.cover_image}`
              : 'https://via.placeholder.com/300',
          }}
          style={styles.trackImage}
        />
        <View style={styles.trackInfo}>
          <Text 
            style={[
              styles.trackTitle,
              isCurrentTrack && { color: '#0768F0' }
            ]} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist || 'Unknown Artist'} • {item.duration || '0:00'}
          </Text>
          
          {/* Progress bar for current track */}
          {isCurrentTrack && duration > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(currentTime / duration) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => handleTrackPress(item)}
          style={styles.playButton}
        >
          <Icon
            name={showPause ? 'pause-circle-filled' : 'play-circle-filled'}
            size={38}
            color={isCurrentTrack ? '#0768F0' : '#888'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <ImageBackground
      source={{ uri: 'https://i.ytimg.com/vi/2MygGSZVyw8/maxresdefault.jpg' }}
      style={styles.exploreContainer}
      imageStyle={styles.exploreImage}
    >
      <View style={styles.exploreOverlay}>
        <Text style={styles.exploreText}>Explore More</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Discover New Music</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
        
          {currentTrack && (
            <Video
              ref={videoRef}
              source={{ 
                uri: `${API_ROUTE_IMAGE}${currentTrack.audio_file}` 
              }}
              paused={!isPlaying}
              audioOnly={true}
              playInBackground={true}
              playWhenInactive={true}
              ignoreSilentSwitch="ignore"
              onLoad={onLoad}
              onProgress={onProgress}
              onEnd={onEnd}
              onError={onError}
              style={styles.hiddenVideo}
              resizeMode="contain"
            />
          )}
          
          {/* Search Bar */}
          <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
            <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search songs, artists..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => fetchMusic(searchQuery)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Track List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0768F0" />
            </View>
          ) : (
            <FlatList
              data={tracks}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="music-off" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>No music found</Text>
                </View>
              }
              ListFooterComponent={renderFooter}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTrackItem}
              showsVerticalScrollIndicator={false}
            />
          )}
          
          {/* Bottom Player Controls */}
          {currentTrack && (
            <View style={styles.bottomPlayer}>
              <Image
                source={{
                  uri: currentTrack.cover_image
                    ? `${API_ROUTE_IMAGE}${currentTrack.cover_image}`
                    : 'https://via.placeholder.com/300',
                }}
                style={styles.bottomPlayerImage}
              />
              <View style={styles.bottomPlayerInfo}>
                <Text style={styles.bottomPlayerTitle} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.bottomPlayerArtist} numberOfLines={1}>
                  {currentTrack.artist || 'Unknown Artist'}
                </Text>
              </View>
              <View style={styles.bottomPlayerControls}>
                <TouchableOpacity 
                  onPress={stopTrack}
                  style={styles.controlButton}
                >
                  <Icon name="stop" size={24} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={togglePlayback}
                  style={styles.controlButton}
                >
                  <Icon
                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                    size={40}
                    color="#0768F0"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    // Skip forward 10 seconds
                    seekTo(Math.min(currentTime + 10, duration));
                  }}
                  style={styles.controlButton}
                >
                  <Icon name="forward-10" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  hiddenVideo: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    margin: 16,
    marginBottom: 20,
  },
  searchContainerFocused: {
    borderWidth: 1,
    borderColor: '#0768F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  currentTrackItem: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#0768F0',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 14,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0768F0',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#888',
  },
  playButton: {
    padding: 8,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#aaa',
  },
  exploreContainer: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    marginBottom: 40,
  },
  exploreImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  exploreOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  exploreText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0768F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  // Bottom Player
  bottomPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bottomPlayerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  bottomPlayerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bottomPlayerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPlayerArtist: {
    color: '#aaa',
    fontSize: 12,
  },
  bottomPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 4,
  },
});

export default Music;