


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
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE } from '../api_routing/api';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');
const CHAT_STORAGE_KEY = '@showa_ai_chat_history';
const MAX_CHAT_HISTORY = 50;

const API_ENDPOINTS = {
  GEMINI_CHAT: `${API_ROUTE}/gemini/chat/`,
  GEMINI_HEALTH: `${API_ROUTE}/gemini/health/`,
};

// Premium AI suggestions with categories
const QUERY_SUGGESTIONS = [
  // Business Related Suggestions
  { 
    title: "Social Media Strategy", 
    subtitle: "Grow your business presence",
    icon: "trending-up", 
    gradient: ['#3B82F6', '#8B5CF6'],
    prompt: "Help me create a social media strategy to grow my business on WhatsApp, Facebook, and Twitter. My business is: [describe your business]",
    category: "business"
  },
  { 
    title: "Content Calendar", 
    subtitle: "Plan your posts",
    icon: "calendar", 
    gradient: ['#10B981', '#059669'],
    prompt: "Create a 30-day content calendar for my business across WhatsApp, Facebook, and Twitter. My business niche is: [describe your niche]",
    category: "business"
  },
  { 
    title: "Engagement Tips", 
    subtitle: "Boost audience interaction",
    icon: "heart", 
    gradient: ['#F59E0B', '#D97706'],
    prompt: "Share tips to increase engagement on my WhatsApp groups, Facebook page, and Twitter profile. My audience is: [describe your audience]",
    category: "business"
  },
  { 
    title: "Ad Copy Writing", 
    subtitle: "Convert customers",
    icon: "megaphone", 
    gradient: ['#EF4444', '#DC2626'],
    prompt: "Write compelling ad copy for my products/services to run on Facebook and Twitter. My target audience is: [describe target audience]",
    category: "business"
  },
  { 
    title: "Competitor Analysis", 
    subtitle: "Stay ahead",
    icon: "stats-chart", 
    gradient: ['#8B5CF6', '#7C3AED'],
    prompt: "Analyze my competitors on social media and suggest ways to outperform them. My main competitors are: [list competitors]",
    category: "business"
  },
  { 
    title: "Customer Support", 
    subtitle: "Handle queries professionally",
    icon: "chatbubbles", 
    gradient: ['#EC4899', '#DB2777'],
    prompt: "Provide templates for handling customer inquiries and complaints professionally on WhatsApp Business and Facebook Messenger",
    category: "business"
  },
  { 
    title: "Influencer Outreach", 
    subtitle: "Collaborate effectively",
    icon: "people", 
    gradient: ['#14B8A6', '#0D9488'],
    prompt: "Draft outreach messages to influencers on Twitter and Instagram for collaboration opportunities. My brand is: [describe your brand]",
    category: "business"
  },
  { 
    title: "Analytics Guide", 
    subtitle: "Track your growth",
    icon: "analytics", 
    gradient: ['#F97316', '#EA580C'],
    prompt: "Explain how to track and analyze social media metrics on Facebook Insights, Twitter Analytics, and WhatsApp Business stats",
    category: "business"
  },

  // Personal Related Suggestions
  { 
    title: "Profile Optimization", 
    subtitle: "Make your profile stand out",
    icon: "person-circle", 
    gradient: ['#3B82F6', '#8B5CF6'],
    prompt: "Help me optimize my personal profiles on Facebook and Twitter to attract more followers and connections",
    category: "personal"
  },
  { 
    title: "Status Ideas", 
    subtitle: "Creative WhatsApp updates",
    icon: "chatbubble-ellipses", 
    gradient: ['#10B981', '#059669'],
    prompt: "Generate creative and engaging WhatsApp status ideas for [occasion/mood: birthday, travel, motivation, etc.]",
    category: "personal"
  },
  { 
    title: "Tweet Ideas", 
    subtitle: "Viral Twitter content",
    icon: "logo-twitter", 
    gradient: ['#1DA1F2', '#0D8ECF'],
    prompt: "Give me tweet ideas about [topic: life, career, relationships, humor] that can go viral",
    category: "personal"
  },
  { 
    title: "Facebook Posts", 
    subtitle: "Engage your friends",
    icon: "logo-facebook", 
    gradient: ['#4267B2', '#365899'],
    prompt: "Create engaging Facebook post ideas about [topic: weekend plans, achievements, thoughts, memories]",
    category: "personal"
  },
  { 
    title: "Group Management", 
    subtitle: "Handle WhatsApp groups",
    icon: "people-circle", 
    gradient: ['#25D366', '#128C7E'],
    prompt: "Tips for managing WhatsApp groups effectively - handling spam, keeping conversations active, and setting group rules",
    category: "personal"
  },
  { 
    title: "Caption Generator", 
    subtitle: "Perfect photo captions",
    icon: "images", 
    gradient: ['#F59E0B', '#D97706'],
    prompt: "Generate captions for my photos on [topic: travel, food, fashion, family, fitness] for Facebook and Twitter",
    category: "personal"
  },
  { 
    title: "Privacy Guide", 
    subtitle: "Stay safe online",
    icon: "lock-closed", 
    gradient: ['#EF4444', '#DC2626'],
    prompt: "Give me a checklist to secure my privacy on WhatsApp, Facebook, and Twitter. Include settings to change and things to avoid",
    category: "personal"
  },
  { 
    title: "Response Templates", 
    subtitle: "Reply to messages",
    icon: "mail", 
    gradient: ['#8B5CF6', '#7C3AED'],
    prompt: "Create polite templates for responding to messages on WhatsApp and DMs on Twitter/Facebook in different situations",
    category: "personal"
  },
  { 
    title: "Hashtag Strategy", 
    subtitle: "Reach more people",
    icon: "pound", 
    gradient: ['#EC4899', '#DB2777'],
    prompt: "Suggest the best hashtags for my posts about [topic] on Twitter and Facebook to increase visibility",
    category: "personal"
  },
  { 
    title: "Bio Generator", 
    subtitle: "Creative bios",
    icon: "document-text", 
    gradient: ['#14B8A6', '#0D9488'],
    prompt: "Help me write a creative and catchy bio for my Facebook and Twitter profiles. My interests are: [list your interests]",
    category: "personal"
  },
  { 
    title: "Story Ideas", 
    subtitle: "Engaging stories",
    icon: "book", 
    gradient: ['#F97316', '#EA580C'],
    prompt: "Give me ideas for sharing personal stories on Facebook and Twitter about [topic: life lessons, achievements, funny moments]",
    category: "personal"
  },
  { 
    title: "Networking Tips", 
    subtitle: "Connect professionally",
    icon: "hand-left", 
    gradient: ['#3B82F6', '#8B5CF6'],
    prompt: "How to network professionally on Twitter and Facebook without being too salesy or annoying",
    category: "personal"
  }
];

const MessageBubble = ({ msg }) => {
  return (
    <View 
      style={[
        styles.messageWrapper,
        msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper
      ]}
    >
      {!msg.isUser && (
        <View style={styles.messageAvatar}>
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            style={styles.avatarGradient}
          >
            <Icon name="sparkles" size={16} color="#FFFFFF" />
          </LinearGradient>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        msg.isUser ? styles.userBubble : styles.aiBubble,
        msg.isError && styles.errorBubble,
      ]}>
        <View style={styles.messageHeader}>
          <Text style={[
            styles.senderName,
            msg.isUser ? styles.userName : styles.aiName
          ]}>
            {msg.isUser ? 'You' : 'Showa AI'}
          </Text>
          <Text style={styles.timestamp}>{msg.timestamp}</Text>
        </View>
        
        <Text style={[
          styles.messageText,
          msg.isUser ? styles.userText : styles.aiText
        ]}>
          {msg.text}
        </Text>

        
      </View>
    </View>
  );
};

const AIChatScreen = ({ route, navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [modelInfo, setModelInfo] = useState({
    model: 'Showa AI Pro',
    latency: '45ms',
    status: 'operational'
  });
  
  const scrollViewRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    loadUserProfile();
    loadChatHistory();
    checkBackendHealth();
  }, []);

  useEffect(() => {
    if (!isLoadingHistory && messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GEMINI_HEALTH, { timeout: 3000 });
      if (response.data.status === 'healthy') {
        setModelInfo(prev => ({
          ...prev,
          latency: response.data.latency || '42ms',
          status: 'operational'
        }));
      }
    } catch (error) {
      setModelInfo(prev => ({ ...prev, status: 'degraded' }));
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('fetchProfile error:', err);
      return null;
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await fetchProfile();
      if (profile) {
        setUserProfile(profile);
        setUserName(profile.full_name || profile.name || profile.email?.split('@')[0] || 'User');
      } else {
        setUserName('User');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserName('User');
    }
  };

  const loadChatHistory = async () => {
    try {
      const storedChat = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChat) {
        const parsedMessages = JSON.parse(storedChat);
        setMessages(parsedMessages);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveChatHistory = async () => {
    try {
      const messagesToStore = messages.slice(-MAX_CHAT_HISTORY);
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setLoading(true);
    setShowSuggestions(false);
    
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
        API_ENDPOINTS.GEMINI_CHAT,
        {
          message: userMessage,
          history: messages.slice(-5).map(msg => ({
            text: msg.text,
            isUser: msg.isUser
          })),
          temperature: 0.7,
          max_tokens: 2048
        },
        { timeout: 30000 }
      );

      if (response.data.status === 'success') {
        setMessages(prev => [...prev, { 
          text: response.data.response, 
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: (Date.now() + 1).toString()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        id: (Date.now() + 1).toString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (prompt) => {
    setMessage(prompt);
    // Automatically send the message when suggestion is pressed
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'This will delete all messages. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: async () => {
            await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
            setMessages([]);
            setShowSuggestions(true);
            setMessage('');
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  const handleClearInput = () => {
    setMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionCard}
      onPress={() => handleSuggestionPress(item.prompt)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.suggestionIcon}
      >
        <Icon name={item.icon} size={24} color="#FFFFFF" />
      </LinearGradient>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>{item.title}</Text>
        <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
      </View>
      <Icon name="arrow-forward" size={20} color="#4B5563" />
    </TouchableOpacity>
  );

  const filteredSuggestions = selectedCategory === 'all' 
    ? QUERY_SUGGESTIONS 
    : QUERY_SUGGESTIONS.filter(s => s.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'business', label: 'Business', icon: 'business' },
    { id: 'personal', label: 'Personal', icon: 'person' },
    { id: 'development', label: 'Dev', icon: 'code' },
    { id: 'security', label: 'Security', icon: 'shield' },
  ];

  // if (isLoadingHistory) {
  //   return (
  //     <View style={[styles.container, styles.loadingContainer]}>
  //       <LinearGradient
  //         colors={['#0A0A0C', '#0F0F11']}
  //         style={StyleSheet.absoluteFill}
  //       />
  //       <ActivityIndicator size="large" color="#3B82F6" />
  //       <Text style={styles.loadingText}>Initializing AI environment...</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0C" />
      
      <LinearGradient
        colors={['#0A0A0C', '#121214']}
        style={StyleSheet.absoluteFill}
      />

      {/* Premium Header with Blur */}
      <BlurView
        style={styles.header}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="#0A0A0C"
      >
        <TouchableOpacity 
          style={[styles.headerIcon,{marginLeft:20}]}
          onPress={() => navigation.goBack()}
        >
          <Icon  name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          
          <View>
            <Text style={[styles.headerTitle,{alignItems:'center'}]}>Showa AI</Text>
            <Text style={styles.headerSubtitle}>Powered AI by Essential</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.headerIcon,{marginRight:20}]} onPress={clearChat}>
          <Icon name="refresh" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </BlurView>

      {showSuggestions && messages.length === 0 ? (
        <KeyboardAvoidingView 
          style={styles.homeContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.homeContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Premium Welcome Section */}
            <View style={styles.welcomeSection}>
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                style={styles.premiumLogo}
              >
                <Icon name="sparkles" size={40} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={styles.greetingText}>
                Hello, <Text style={styles.userNameHighlight}>{userName}</Text>
              </Text>
              <Text style={styles.subGreeting}>
                How can I assist you today?
              </Text>
            </View>

            {/* Premium Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchWrapper}>
                <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Ask anything..."
                  placeholderTextColor="#6B7280"
                  editable={!loading}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  enablesReturnKeyAutomatically
                />
                
                {message.length > 0 && (
                  <TouchableOpacity onPress={handleClearInput}>
                    <Icon name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.categoryWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
                keyboardShouldPersistTaps="handled"
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat.id && styles.categoryChipActive
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Icon 
                      name={cat.icon} 
                      size={16} 
                      color={selectedCategory === cat.id ? '#FFFFFF' : '#9CA3AF'} 
                      style={styles.categoryIcon}
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === cat.id && styles.categoryChipTextActive
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Suggestions Grid */}
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredSuggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={(item) => item.title}
                scrollEnabled={false}
                contentContainerStyle={styles.suggestionsGrid}
                keyboardShouldPersistTaps="handled"
              />
            </View>

            {/* Model Status */}
            <View style={styles.statusWrapper}>
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: modelInfo.status === 'operational' ? '#10B981' : '#F59E0B' }]} />
                  <Text style={styles.statusText}>{modelInfo.model}</Text>
                </View>
                <View style={styles.statusDivider} />
                <View style={styles.statusItem}>
                  <Icon name="time" size={14} color="#6B7280" />
                  <Text style={styles.statusText}>{modelInfo.latency}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView 
          style={styles.chatKeyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <MessageBubble 
                key={msg.id || index} 
                msg={msg} 
              />
            ))}

            {loading && (
              <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
                <View style={styles.messageAvatar}>
                  <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    style={styles.avatarGradient}
                  >
                    <Icon name="sparkles" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text style={styles.typingText}>AI is thinking...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Premium Chat Input */}
          <BlurView
            style={styles.chatInputContainer}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="#0A0A0C"
          >
            <View style={styles.chatInputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.chatInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor="#6B7280"
                multiline
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                enablesReturnKeyAutomatically
              />
              
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!message.trim() || loading) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!message.trim() || loading}
              >
                <LinearGradient
                  colors={message.trim() && !loading ? ['#3B82F6', '#8B5CF6'] : ['#2D2D32', '#1F1F23']}
                  style={styles.sendGradient}
                >
                  <Icon 
                    name="send" 
                    size={18} 
                    color={message.trim() && !loading ? '#FFFFFF' : '#4B5563'} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '500',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(10, 10, 12, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    padding:15
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: -10,
    marginBottom:20
  },
  // Home Container
  homeContainer: {
    flex: 1,
    
  },
  homeContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  premiumLogo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  userNameHighlight: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Premium Search
  searchContainer: {
    marginBottom: 28,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F23',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2D2D32',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
    height: 40,
  },
  // Categories
  categoryWrapper: {
    marginBottom: 24,
  },
  categoryContainer: {
    paddingHorizontal: 4,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: '#1F1F23',
    borderWidth: 1,
    borderColor: '#2D2D32',
    gap: 8,
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA',
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  // Suggestions
  suggestionsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  suggestionsGrid: {
    gap: 12,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F23',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D32',
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Status
  statusWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F23',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#2D2D32',
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#2D2D32',
  },
  // Chat Interface
  chatKeyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginHorizontal: 8,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: width * 0.7,
    borderRadius: 20,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#1F1F23',
    borderWidth: 1,
    borderColor: '#2D2D32',
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#2D1A1A',
    borderColor: '#991B1B',
  },
  loadingBubble: {
    padding: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
  },
  userName: {
    color: '#FFFFFF',
  },
  aiName: {
    color: '#3B82F6',
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
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
    color: '#E5E7EB',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  messageAction: {
    padding: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Chat Input
  chatInputContainer: {
    paddingHorizontal:0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: 0,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F23',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2D2D32',
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 8,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIChatScreen;