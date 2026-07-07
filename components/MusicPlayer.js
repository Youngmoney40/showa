import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import { API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const MusicPlayerScreen = ({ route, navigation }) => {
  const { track, tracks } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
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

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: `${API_ROUTE_IMAGE}${track.audio_file}` }}
        paused={!isPlaying}
        audioOnly={true}
        playInBackground={true}
        playWhenInactive={true}
        ignoreSilentSwitch="ignore"
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        style={styles.hiddenVideo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.artworkContainer}>
        {track.cover_image ? (
          <Image
            source={{ uri: `${API_ROUTE_IMAGE}${track.cover_image}` }}
            style={styles.artworkImage}
          />
        ) : (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.artworkImage}
          >
            <Icon name="musical-notes" size={60} color="#fff" />
          </LinearGradient>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}>{track.artist || 'Unknown Artist'}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={() => videoRef.current?.seek(Math.max(0, currentTime - 10))}>
            <Icon name="play-skip-back" size={30} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => videoRef.current?.seek(Math.min(currentTime + 10, duration))}>
            <Icon name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  hiddenVideo: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  artworkContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  artworkImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 0.4,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0768F0',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0768F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicPlayerScreen;