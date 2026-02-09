import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../globalshared/constants/colors';

const MessageBubble = ({ message, isUser, time, showAvatar }) => {
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userContainer : styles.otherContainer
    ]}>
      {!isUser && showAvatar && (
        <View style={styles.avatarPlaceholder}>
          {/* Avatar would go here */}
        </View>
      )}
      
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.otherText
        ]}>
          {message}
        </Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      
      {isUser && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>✓✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    maxWidth: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: Colors.userMessage,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.otherMessage,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: Colors.textWhite,
  },
  otherText: {
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 11,
    color: Colors.messageTime,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    marginRight: 8,
  },
  statusIndicator: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});

export default MessageBubble;