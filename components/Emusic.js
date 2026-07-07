import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.3;

const MusicSection = ({ navigation, colors }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
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
        // Take only first 10 tracks for horizontal scroll
        setTracks(response.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching music:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPress = (track) => {
    navigation.navigate('MusicPlayer', { 
      track: track,
      tracks: tracks 
    });
  };

  const renderMusicItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.musicCard, { backgroundColor: colors.card }]}
      onPress={() => handleTrackPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {item.cover_image ? (
          <Image
            source={{ uri: `${API_ROUTE_IMAGE}${item.cover_image}` }}
            style={styles.musicImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.musicImage}
          >
            <Icon name="musical-notes" size={30} color="#fff" />
          </LinearGradient>
        )}
        <View style={styles.playOverlay}>
          <Icon name="play-circle" size={30} color="#fff" />
        </View>
      </View>
      
      <Text style={[styles.musicTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.musicArtist, { color: colors.textSecondary }]} numberOfLines={1}>
        {item.artist || 'Unknown Artist'}
      </Text>
      
      
    </TouchableOpacity>
  );


  if (tracks.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="musical-notes" size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Trending Music
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Music')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={tracks}
        renderItem={renderMusicItem}
        keyExtractor={(item) => `music-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
       
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  musicCard: {

    width: CARD_WIDTH,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    width: CARD_WIDTH - 16,
    height: CARD_WIDTH - 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  // On hover effect would be handled by TouchableOpacity
  musicTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    marginBottom: 2,
  },
  musicArtist: {
    fontSize: 11,
    textAlign: 'center',
    width: '100%',
  },
  durationBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 9,
    color: '#888',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 88,
    fontSize: 12,
  },
});

export default MusicSection;