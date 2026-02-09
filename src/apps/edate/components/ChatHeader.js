import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../globalshared/constants/colors';

const MessageBubble = ({ message, isUser, time, showAvatar, user }) => {
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userContainer : styles.otherContainer
    ]}>
      
      {/* Avatar for other user */}
      {!isUser && showAvatar && (
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user?.image || "https://i.pravatar.cc/150?img=1" }} 
            style={styles.avatar}
          />
          <View style={[styles.onlineDot, { 
            backgroundColor: user?.isOnline ? Colors.online : Colors.offline 
          }]} />
        </View>
      )}
      
      {/* Message Bubble */}
      <View style={[
        styles.bubbleWrapper,
        isUser ? styles.userBubbleWrapper : styles.otherBubbleWrapper
      ]}>
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.otherBubble,
          !showAvatar && !isUser && styles.noAvatarMargin
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.otherText
          ]}>
            {message}
          </Text>
          
          {/* Message time and status */}
          <View style={styles.footer}>
            <Text style={[
              styles.timeText,
              isUser ? styles.userTimeText : styles.otherTimeText
            ]}>
              {time}
            </Text>
            
            {isUser && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>✓✓</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Speech bubble tip */}
        {!isUser && showAvatar && (
          <View style={[styles.tip, styles.otherTip]} />
        )}
        {isUser && (
          <View style={[styles.tip, styles.userTip]} />
        )}
      </View>
      
      {/* User status indicator */}
      {isUser && (
        <View style={styles.userStatus}>
          <Text style={styles.statusText}>✓✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    maxWidth: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  bubbleWrapper: {
    maxWidth: '80%',
    position: 'relative',
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  otherBubbleWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noAvatarMargin: {
    marginLeft: 44, // Space for invisible avatar to align messages
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  userText: {
    color: Colors.white,
    fontWeight: '500',
  },
  otherText: {
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    marginRight: 4,
  },
  userTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimeText: {
    color: Colors.textTertiary,
  },
  statusContainer: {
    marginLeft: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  userStatus: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  // Speech bubble tip
  tip: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
  },
  userTip: {
    right: -6,
    bottom: 12,
    borderLeftWidth: 8,
    borderLeftColor: Colors.primary,
    borderRightWidth: 0,
  },
  otherTip: {
    left: -6,
    bottom: 12,
    borderRightWidth: 8,
    borderRightColor: Colors.white,
    borderLeftWidth: 0,
  },
});

export default MessageBubble;