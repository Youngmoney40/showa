import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ROUTE_IMAGE } from '../api_routing/api';

const CallOngoingScreen = ({ route, navigation }) => {
  const { type, receiverId, profile_image, name } = route.params;

  const fallbackImage = require('../assets/images/avatar/blank-profile-picture-973460_1280.png');

  const [bgImageSource, setBgImageSource] = useState({ uri: `${API_ROUTE_IMAGE}${profile_image}` });
  const [avatarSource, setAvatarSource] = useState({ uri: `${API_ROUTE_IMAGE}${profile_image}` });

  return (
    <ImageBackground
      source={bgImageSource}
      style={styles.background}
      blurRadius={2}
      onError={() => setBgImageSource(fallbackImage)}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Image
          source={avatarSource}
          style={styles.avatar}
          onError={() => setAvatarSource(fallbackImage)}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>
          {type === 'video' ? 'Video Calling...' : 'Audio Calling...'}
        </Text>
        <Text style={styles.receiverId}>ID: {receiverId}</Text>
      </View>

      <View style={styles.controls}>
        {type === 'video' && (
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="videocam-off" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="mic-off" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, styles.endBtn]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CallOngoingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    marginTop: 100,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginTop: 16,
  },
  status: {
    fontSize: 16,
    color: '#eee',
    marginTop: 4,
  },
  receiverId: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 80,
    gap: 30,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endBtn: {
    backgroundColor: 'red',
  },
});
