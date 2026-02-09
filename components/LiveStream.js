import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { API_ROUTE, YOUTUBE_API_KEY } from '../api_routing/api';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';


const { width } = Dimensions.get('window');
const brandColor = '#0d64dd';

const HappeningNowLive = () => {
  const [videos, setVideos] = useState([]);
  const [ORGANIZER_CHANNELS, setChannelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigation = useNavigation();

useEffect(() => {
  if (selectedVideo) {
    Orientation.lockToLandscape();
  } else {
    Orientation.lockToPortrait();
  }

  return () => Orientation.lockToPortrait(); 
}, [selectedVideo]);


  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        const response = await axios.get(`${API_ROUTE}/all_channels/`);
        if (response.status === 200 && Array.isArray(response.data.channels)) {
          const channels = response.data.channels.map((channel) => channel.channel_id);
          setChannelsData(channels);
        }
      } catch (error) {
       
      }
    };

    fetchAllChannels();
  }, []);

  // Fetch live streams
  useEffect(() => {
    if (ORGANIZER_CHANNELS.length === 0) return;

    const fetchAllLiveStreams = async () => {
      try {
        setLoading(true);
        let allVideos = [];

        for (const channelId of ORGANIZER_CHANNELS) {
          const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&maxResults=3&key=${YOUTUBE_API_KEY}`
          );
          
          if (response.data.items) {
            allVideos = [...allVideos, ...response.data.items];
          }
        }

        setVideos(allVideos);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchAllLiveStreams();
  }, [ORGANIZER_CHANNELS]);

  const LiveBadge = () => (
    <View style={styles.liveBadge}>
      <View style={styles.pulsingDot} />
      <Text style={styles.liveBadgeText}>LIVE NOW</Text>
    </View>
  );

  const renderVideoPlayer = () => (
  <Modal
    visible={selectedVideo !== null}
    transparent={false}
    animationType="slide"
    onRequestClose={() => setSelectedVideo(null)}
  >
    <View style={styles.fullscreenContainer}>
      <WebView
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <body style="margin:0;background:black;">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/${selectedVideo?.id.videoId}?autoplay=1&controls=1&modestbranding=1&rel=0" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                  allowfullscreen>
                </iframe>
              </body>
            </html>
          `,
        }}
        style={{ flex: 1 }}
      />

      <TouchableOpacity 
        style={styles.closeButtonFull}
        onPress={() => setSelectedVideo(null)}
      >
        <Icon name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </Modal>
);


  return (
    <LinearGradient 
      colors={['#f8f9fa', '#e6f0fa']} 
      style={styles.container}
    >
      {renderVideoPlayer()}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerText,{color:'#333'}]}>Happening</Text>
          <View style={styles.headerHighlight}>
            <Text style={[styles.headerText, { color: brandColor }]}> Now</Text>
            <Icon name="sensors" size={28} color={brandColor} style={styles.headerIcon} />
          </View>
        </View>
        <Text style={styles.subHeader}>Watch live streams in real-time</Text>

        {loading ? (
          <ActivityIndicator size="large" color={brandColor} style={styles.loader} />
        ) : videos.length > 0 ? (
          <View style={styles.videosContainer}>
            {videos.map((video) => (
              <TouchableOpacity 
                key={video.id.videoId} 
                style={styles.videoCard}
                onPress={() => setSelectedVideo(video)}
                activeOpacity={0.8}
              >
                <View style={styles.videoThumbnail}>
                  <Image
                    source={{ uri: video.snippet.thumbnails.high.url }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.thumbnailOverlay}
                  />
                  <LiveBadge />
                  <View style={styles.playButton}>
                    <Icon name="play-circle-filled" size={50} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>
                
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.snippet.title}
                  </Text>
                  <View style={styles.channelInfo}>
                    <Icon name="account-circle" size={20} color="#666" />
                    <Text style={styles.channelName} numberOfLines={1}>
                      {video.snippet.channelTitle}
                    </Text>
                  </View>
                  <View style={styles.viewerCount}>
                    <Icon name="people" size={16} color="#666" />
                    <Text style={styles.viewerCountText}>
                      {Math.floor(Math.random() * 5000) + 1000} watching
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="live-tv" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No live streams currently</Text>
            <Text style={styles.emptySubtext}>Check back later for live events</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  videosContainer: {
    paddingHorizontal: 16,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: width * 0.56, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  playButton: {
    position: 'absolute',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  channelName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCountText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  liveBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoPlayer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loader: {
    marginTop: 40,
  },
  modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},

centeredVideoWrapper: {
  width: width * 0.9,
  aspectRatio: 16 / 9,
  position: 'relative',
},

embeddedVideo: {
  width: '100%',
  height: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'black',
},
fullscreenContainer: {
  flex: 1,
  backgroundColor: 'black',
},

closeButtonFull: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
},


});

export default HappeningNowLive;