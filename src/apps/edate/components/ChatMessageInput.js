import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../globalshared/constants/colors';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const quickReactions = ['😊', '❤️', '😂', '😮', '😢', '👍'];

  return (
    <View style={styles.container}>
      {/* Quick Reactions */}
      <View style={styles.quickReactions}>
        {quickReactions.map((reaction, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.reactionButton}
            onPress={() => onSendMessage(reaction)}
          >
            <Text style={styles.reactionText}>{reaction}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Icon name="add-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emojiButton}>
              <Icon name="happy-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={message.trim() ? Colors.white : Colors.textTertiary} 
          />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>GIF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>STICKER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>PHOTO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  quickReactions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  reactionButton: {
    padding: 4,
  },
  reactionText: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 4,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentButton: {
    padding: 4,
    marginLeft: 8,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quickAction: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
});

export default MessageInput;