
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import Colors from '../../globalshared/constants/colors';
import ChatHeader from "../../edate/components/ChatHeader";
import MessageBubble from "../../edate/components/ChatMessageBubble";
import MessageInput from "../../edate/components/ChatMessageInput";



// Sample messages data
const initialMessages = [
  { id: 1, text: "Hi Sexy 😘", time: "10:11 PM", isUser: false },
  { id: 2, text: "Hi handsome! How are you?", time: "10:11 PM", isUser: true },
  { id: 3, text: "I'm doing great! Just thinking about you 💕", time: "10:12 PM", isUser: false },
  { id: 4, text: "Aww that's sweet! Me too 😊", time: "10:12 PM", isUser: true },
  { id: 5, text: "What are your plans for the weekend?", time: "10:13 PM", isUser: false },
  { id: 6, text: "Nothing special yet. Want to hang out? 🎉", time: "10:13 PM", isUser: true },
  { id: 7, text: "I'd love to! Dinner and maybe a movie? 🍿", time: "10:14 PM", isUser: false },
  { id: 8, text: "Perfect! Sounds like a plan 💫", time: "10:14 PM", isUser: true },
];

const ChatScreen = ({ navigation, route }) => {
  // Get user from route params with proper fallback
  const user = route?.params?.user || {
    name: "Richard Johnson",
    image: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
    lastSeen: "Active now"
  };

  const [messages, setMessages] = useState(initialMessages);
  const scrollViewRef = useRef();

  useEffect(()=>{
   console.log('user', user)
  },[])

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate reply after 1-2 seconds
    if (Math.random() > 0.3) { // 70% chance of reply
      setTimeout(() => {
        const replies = [
          "That's interesting!",
          "Tell me more 😊",
          "I feel the same way!",
          "Really? That's awesome!",
          "I'd love to hear more about that 💕"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMessage = {
          id: messages.length + 2,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        };
        
        setMessages(prev => [...prev, replyMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCall = () => {
    console.log("Voice call initiated");
  };

  const handleVideo = () => {
    console.log("Video call initiated");
  };

  const handleMenu = () => {
    console.log("Menu pressed");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <ChatHeader
        user={user}
        onBack={handleBack}
        onCall={handleCall}
        onVideo={handleVideo}
        onMenu={handleMenu}
      /> */}

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => 
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Date Header */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Today</Text>
        </View>

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            time={message.time}
            showAvatar={!message.isUser && (
              index === 0 || 
              messages[index - 1]?.isUser || 
              message.isUser !== messages[index - 1]?.isUser
            )}
          />
        ))}
      </ScrollView>

      {/* Input Area */}
      <MessageInput onSendMessage={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    color: Colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default ChatScreen;