

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import BottomNav from "../components/BottomNav";

const newPairs = [
  { id: "1", name: "Anita", image: "https://i.pravatar.cc/150?img=1", isOnline: true, lastSeen: "2 min ago" },
  { id: "2", name: "Reshma", image: "https://i.pravatar.cc/150?img=2", isOnline: true, lastSeen: "5 min ago" },
  { id: "3", name: "Roma", image: "https://i.pravatar.cc/150?img=3", isOnline: false, lastSeen: "1 hour ago" },
  { id: "4", name: "Yami", image: "https://i.pravatar.cc/150?img=4", isOnline: true, lastSeen: "Just now" },
  { id: "5", name: "Priti", image: "https://i.pravatar.cc/150?img=5", isOnline: false, lastSeen: "30 min ago" },
  { id: "6", name: "Sneha", image: "https://i.pravatar.cc/150?img=6", isOnline: true, lastSeen: "10 min ago" },
];

const messages = [
  { 
    id: "1", 
    name: "Anika Sharma", 
    text: "Hey! How was your weekend? 😊", 
    image: "https://i.pravatar.cc/150?img=7",
    time: "2:30 PM",
    unread: 2,
    isOnline: true
  },
  { 
    id: "2", 
    name: "Priya Patel", 
    text: "Let's catch up this Friday! 🎉", 
    image: "https://i.pravatar.cc/150?img=8",
    time: "1:15 PM",
    unread: 0,
    isOnline: false
  },
  { 
    id: "3", 
    name: "Neha Gupta", 
    text: "Thanks for the great time yesterday! 💕", 
    image: "https://i.pravatar.cc/150?img=9",
    time: "12:45 PM",
    unread: 3,
    isOnline: true
  },
  { 
    id: "4", 
    name: "Maya Singh", 
    text: "Are you free for coffee tomorrow?", 
    image: "https://i.pravatar.cc/150?img=10",
    time: "11:20 AM",
    unread: 0,
    isOnline: true
  },
  { 
    id: "5", 
    name: "Tanya Mehta", 
    text: "That restaurant was amazing! We should go again", 
    image: "https://i.pravatar.cc/150?img=11",
    time: "Yesterday",
    unread: 1,
    isOnline: false
  },
  { 
    id: "6", 
    name: "Riya Kapoor", 
    text: "Looking forward to our date tonight! 🌟", 
    image: "https://i.pravatar.cc/150?img=12",
    time: "Yesterday",
    unread: 0,
    isOnline: true
  },
];

const MessagesList = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize scaleAnim properly to avoid undefined error
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderNewPair = ({ item }) => (
    <TouchableOpacity style={styles.avatarContainer}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={[styles.statusDot, { backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E' }]} />
      </View>
      <Text style={styles.avatarName}>{item.name}</Text>
      <Text style={styles.lastSeen}>{item.lastSeen}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => navigation.navigate('Chat', { user: item })}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.image }} style={styles.messageAvatar} />
        <View style={[styles.statusDot, { 
          backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E',
          borderColor: '#fff'
        }]} />
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.text}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor='#fff'/>
      
      {/* Header */}
      <LinearGradient
        colors={['#FF3366', '#FF6F00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-vertical" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={22} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* New Matches Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <View style={styles.matchCount}>
              <Text style={styles.countText}>{newPairs.length}</Text>
            </View>
          </View>
          <FlatList
            horizontal
            data={newPairs}
            showsHorizontalScrollIndicator={false}
            renderItem={renderNewPair}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.newPairsList}
          />
        </View>

        {/* Messages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Conversations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredMessages.length > 0 ? (
            <FlatList
              data={filteredMessages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.messagesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="chatbubble-ellipses-outline" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No messages found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search' : 'Start a conversation with your matches!'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scaleAnim={scaleAnim}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  matchCount: {
    backgroundColor: "#FF3366",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  seeAllText: {
    color: "#FF3366",
    fontSize: 14,
    fontWeight: "600",
  },
  newPairsList: {
    paddingHorizontal: 15,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FF3366",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  lastSeen: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: 15,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  messageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  messageContent: {
    flex: 1,
    marginLeft: 15,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: "#FF3366",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default MessagesList;