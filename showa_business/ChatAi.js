import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

// Storage keys
const CHAT_STORAGE_KEY = '@showa_ai_chat_history';
const MAX_CHAT_HISTORY = 50; // Limit stored messages to prevent storage issues

const AnimatedMessageBubble = ({ msg, pulseAnim }) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.messageBubble,
        msg.isUser ? styles.userBubble : styles.aiBubble,
        msg.isError && styles.errorBubble,
        {
          transform: [{ translateY }],
          opacity
        }
      ]}
    >
      <View style={styles.messageHeader}>
        <View style={styles.senderInfo}>
          {msg.isUser ? (
            <Icon name="person" size={14} color="#E0E7FF" />
          ) : (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Icon name="sparkles" size={14} color="#0d64dd" />
            </Animated.View>
          )}
          <Text style={[
            styles.senderName,
            msg.isUser ? styles.userName : styles.aiNameText
          ]}>
            {msg.isUser ? 'You' : 'SHOWA Ai'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{msg.timestamp}</Text>
      </View>
      <Text style={[
        styles.messageText,
        msg.isUser ? styles.userText : styles.aiText
      ]}>
        {msg.text}
      </Text>
      {msg.isError && (
        <View style={styles.errorIndicator}>
          <Icon name="warning" size={14} color="#EF4444" />
          <Text style={styles.errorText}>Temporarily Unavailable</Text>
        </View>
      )}
    </Animated.View>
  );
};

const BusinessSuggestion = ({ title, icon, onPress, color, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }, delay);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <TouchableOpacity 
        style={[styles.suggestionCard, { borderLeftColor: color }]}
        onPress={onPress}
      >
        <Icon name={icon} size={18} color={color} />
        <Text style={styles.suggestionText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AIChatScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const tok = "t";

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (!isLoadingHistory && messages.length > 0) {
      saveChatHistory();
    }
  }, [messages, isLoadingHistory]);

  // Load chat history from AsyncStorage
  const loadChatHistory = async () => {
    try {
      const storedChat = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChat) {
        const parsedMessages = JSON.parse(storedChat);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Save chat history to AsyncStorage
  const saveChatHistory = async () => {
    try {
      // Limit the number of stored messages to prevent storage issues
      const messagesToStore = messages.slice(-MAX_CHAT_HISTORY);
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Clear chat history from storage
  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  useEffect(() => {
    if (route?.params?.initialMessage) {
      setTimeout(() => {
        handleAutoSend(route.params.initialMessage);
      }, 500);
    }
  }, [route?.params?.initialMessage]);

  // Auto-send function for messages from other screens
  const handleAutoSend = async (autoMessage) => {
    if (!autoMessage?.trim()) return;

    setLoading(true);
    
    const newUserMessage = { 
      text: autoMessage, 
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful business assistant specializing in business strategy, marketing, operations, finance, and growth. Provide concise, actionable advice for business owners. Be professional yet approachable."
            },
            {
              role: "user",
              content: autoMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${tok}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const aiResponse = response.data?.choices?.[0]?.message?.content || 
                        "I received your message and I'm processing your business inquiry.";

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: aiResponse, 
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: (Date.now() + 1).toString()
        }]);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error('API Error:', error);
      
      let errorMessage = "I'm experiencing high demand. Please try again in a moment.";
      
      if (error.response?.status === 401) {
        errorMessage = "Service configuration issue. Please contact support.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `I apologize, but I'm currently unable to process your request. ${errorMessage}`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          id: (Date.now() + 1).toString()
        }]);
        setLoading(false);
      }, 800);
    }
  };

  // Regular send function for manual input
  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Hello!', 'I\'m your AI Business Assistant. Ask me anything about strategy, marketing, operations, or business growth!');
      return;
    }

    const userMessage = message.trim();
    setLoading(true);
    
    const newUserMessage = { 
      text: userMessage, 
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful business assistant specializing in business strategy, marketing, operations, finance, and growth. Provide concise, actionable advice for business owners. Be professional yet approachable."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${tok}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const aiResponse = response.data?.choices?.[0]?.message?.content || 
                        "I received your message and I'm processing your business inquiry.";

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: aiResponse, 
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: (Date.now() + 1).toString()
        }]);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error('API Error:', error);
      
      let errorMessage = "I'm experiencing high demand. Please try again in a moment.";
      
      if (error.response?.status === 401) {
        errorMessage = "Service configuration issue. Please contact support.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `I apologize, but I'm currently unable to process your request. ${errorMessage}`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          id: (Date.now() + 1).toString()
        }]);
        setLoading(false);
      }, 800);
    }
  };

  // Other animations and effects
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Pulsing animation for AI indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation for suggestions
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const clearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'Start a new business conversation? This will delete your current chat history.',
      [
        { text: 'Continue Chat', style: 'cancel' },
        { 
          text: 'New Conversation', 
          onPress: clearChatHistory, 
          style: 'destructive' 
        }
      ]
    );
  };

  const quickSuggestions = [
    { 
      title: "Marketing", 
      icon: "megaphone", 
      prompt: "Create a marketing strategy for my small business",
      color: "#0d64dd" 
    },
    { 
      title: "Finance", 
      icon: "trending-up", 
      prompt: "Help me with financial planning and budgeting",
      color: "#10B981" 
    },
    { 
      title: "Growth", 
      icon: "people", 
      prompt: "How can I attract more customers?",
      color: "#3B82F6" 
    },
    { 
      title: "Operations", 
      icon: "settings", 
      prompt: "Improve my business operations and efficiency",
      color: "#F59E0B" 
    },
  ];

  const handleSuggestionPress = (prompt) => {
    setMessage(prompt);
  };


  if (isLoadingHistory) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0d64dd" />
        <Text style={styles.loadingText}>Loading your conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
     
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <View style={styles.headerMain}>
            
            <View style={styles.headerText}>
              <Text style={styles.aiName}>Showa Ai </Text>
              <Text style={styles.subtitle}>Your Strategic Partner</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearChat}
          >
            <Icon name="refresh-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !route?.params?.initialMessage && (
          <Animated.View 
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.welcomeIcon,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Icon name="rocket" size={52} color="#0d64dd" />
            </Animated.View>
            <Text style={styles.welcomeTitle}>Welcome to Showa AI </Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to transform your business? I provide expert guidance on strategy, 
              marketing, and growth. Let's achieve your goals together!
            </Text>
            
            <Animated.View 
              style={[
                styles.suggestionsContainer,
                { opacity: glowAnim }
              ]}
            >
              <Text style={styles.suggestionsTitle}>Quick Start Suggestions</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsRow}
                contentContainerStyle={styles.suggestionsRowContent}
              >
                {quickSuggestions.map((suggestion, index) => (
                  <BusinessSuggestion
                    key={index}
                    title={suggestion.title}
                    icon={suggestion.icon}
                    color={suggestion.color}
                    delay={index * 200}
                    onPress={() => handleSuggestionPress(suggestion.prompt)}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        )}

        {messages.map((msg, index) => (
          <AnimatedMessageBubble 
            key={msg.id} 
            msg={msg} 
            pulseAnim={pulseAnim}
          />
        ))}

        {loading && (
          <Animated.View 
            style={[
              styles.messageBubble, 
              styles.aiBubble,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim
              }
            ]}
          >
            <View style={styles.messageHeader}>
              <View style={styles.senderInfo}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Icon name="sparkles" size={14} color="#0d64dd" />
                </Animated.View>
                <Text style={[styles.senderName, styles.aiNameText]}>Showa AI</Text>
              </View>
              <Text style={styles.timestamp}>analyzing...</Text>
            </View>
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color="#0d64dd" />
              <Text style={styles.typingText}>Crafting strategic insights...</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask me anything..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={300}
            editable={!loading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || loading) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Icon name="paper-plane" size={18} color="#FFFFFF" />
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 16,
  },

  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0d64dd',
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  headerText: {
    marginHorizontal:20,
    marginTop:20,
    flexDirection: 'column',
  },
  aiName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
   
  },
  subtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
    marginTop: 2,
  },
  clearButton: {
    padding: 6,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 24,
    borderRadius: 40,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '500',
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionsRow: {
    flexGrow: 0,
  },
  suggestionsRowContent: {
    paddingHorizontal: 8,
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9',
    marginLeft: 8,
  },
  messageBubble: {
    marginBottom: 16,
    maxWidth: '85%',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0d64dd',
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorBubble: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  userName: {
    color: '#E0E7FF',
  },
  aiNameText: {
    color: '#818CF8',
  },
  timestamp: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#E2E8F0',
  },
  errorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    fontSize: 12,
    color: '#F87171',
    marginLeft: 4,
    fontWeight: '600',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: '#F1F5F9',
    textAlignVertical: 'center',
    lineHeight: 20,
    padding: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0d64dd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default AIChatScreen;