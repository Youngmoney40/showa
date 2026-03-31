import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OnlineStatusBadge from './OnlineStatusBadge';

const ChatHeader = ({ 
  userId, 
  name, 
  profileImage, 
  onBack, 
  onCall, 
  onVideoCall 
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
            style={styles.avatar}
          />
          <OnlineStatusBadge 
            userId={userId}
            showDot={true}
            dotSize={14}
            position="bottom-right"
            avatarSize={44}
            borderWidth={2}
            borderColor="#fff"
          />
        </View>
        
        <View style={styles.userTextInfo}>
          <Text style={styles.userName} numberOfLines={1}>{name}</Text>
          {/* Status text can be handled by the OnlineStatusBadge component if needed */}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        {onCall && (
          <TouchableOpacity onPress={onCall} style={styles.actionButton}>
            <Icon name="call-outline" size={22} color="#0d64dd" />
          </TouchableOpacity>
        )}
        {onVideoCall && (
          <TouchableOpacity onPress={onVideoCall} style={styles.actionButton}>
            <Icon name="videocam-outline" size={22} color="#0d64dd" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
  },
  userTextInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatHeader;