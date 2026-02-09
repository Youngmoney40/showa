
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BottomNav from "../../components/BottomNav";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../globalshared/apiRoute/api_config";

const AdmirersScreen = ({navigation}) => {
  const [search, setSearch] = useState("");
  const [activeTabs, setActiveTabs] = useState("admirers");
  const [activeTab, setActiveTab] = useState("discover");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dinmz7eh9';

  const tabs = [
    { key: "admirers", label: "Admirers", count: filteredUsers.length },
    { key: "invitations", label: "Invitations", count: 3 },
    { key: "calls", label: "Calls", count: 5 },
  ];

  // Calculate age from date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '?';
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return '?';
    }
  };

  // Get profile image with full URL
  const getProfileImage = (profile) => {
    if (profile.profile_images_data && profile.profile_images_data.length > 0) {
      const imagePath = profile.profile_images_data[0].image;
      return `${CLOUDINARY_BASE_URL}/${imagePath}`;
    }
    // Default images based on gender
    if (profile.gender?.toLowerCase() === 'male') {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    }
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  };

  // Fetch matching users data
  useEffect(() => {
    const fetchMatchingUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const res = await axios.get(`http://192.168.1.105:8000/api/discover/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.status === 200) {
          console.log('Fetch profile completed for admirers', res.data);
          setUsers(res.data);
          setFilteredUsers(res.data);
        } else {
          console.log('Failed to fetch profile for admirers');
        }
      } catch (error) {
        console.log('Error fetching profile for admirers:', error);
      }
    };
    
    fetchMatchingUsers();
  }, []);

  // Filter users based on search
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.nick_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.country?.toLowerCase().includes(search.toLowerCase()) ||
        user.interests?.some(interest => 
          interest.toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const handleTap = (tab) => {
    if (tab.key === 'invitations') {
      navigation.navigate('Invitations');
    } else if (tab.key === 'calls'){
      navigation.navigate('Calls');
    } else {
      navigation.navigate('admirers');
    }
  };

  const handleUserPress = (user) => {
    // Navigate to user profile
    navigation.navigate('Profile', { user });
  };

  const handleSayHi = async (user) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.post(
        `${API_BASE_URL}/api/chat/say-hi/${user.user_id}/`,
        { message: "Hi! I would like to connect with you." },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (res.status === 200) {
        console.log('Icebreaker sent successfully:', res.data);
        // You can show a success message here
        alert(`Icebreaker sent to ${user.nick_name}!`);
      }
    } catch (error) {
      console.log('Error sending icebreaker:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.card,
        index % 2 === 0 ? styles.cardEven : styles.cardOdd
      ]}
      activeOpacity={0.7}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: getProfileImage(item) }} 
          style={styles.avatar} 
        />
        <View style={styles.onlineIndicator} />
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.nick_name || 'User'}</Text>
          <MaterialCommunityIcons
            name="check-decagram"
            size={18}
            color="#FF3366"
            style={styles.verifiedIcon}
          />
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.country || 'Unknown'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{calculateAge(item.date_of_birth)} years</Text>
          </View>
        </View>

        {/* Interests */}
        {item.interests && item.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {item.interests.slice(0, 2).map((interest, idx) => (
              <View key={idx} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {item.interests.length > 2 && (
              <Text style={styles.moreInterests}>+{item.interests.length - 2} more</Text>
            )}
          </View>
        )}

        {/* Bio preview */}
        {item.bio && (
          <Text style={styles.bioText} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.actionButton} 
        activeOpacity={0.6}
        onPress={() => handleSayHi(item)}
      >
        <Text style={{}}>Message</Text>
        {/* <Icon name="chatbubble-ellipses-outline" size={20} color="#FF3366" /> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
    
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="filter-outline" size={22} color="#FF3366" />
        </TouchableOpacity>
      </View>

      {/* Tabs ========================*/}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTabs === tab.key && styles.activeTab
            ]}
            onPress={() => handleTap(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTabs === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search by name, location, or interests..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              {search ? 'Try adjusting your search terms' : 'Check back later for new matches'}
            </Text>
          </View>
        }
      />

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
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    marginTop:-30
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerButton: {
    padding: 8,
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F8FAFC",
  },
  activeTab: {
    backgroundColor: "#FF3366",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  badge: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
  },
  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardEven: {
    backgroundColor: "#FFFFFF",
  },
  cardOdd: {
    backgroundColor: "#FFF0F5",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFE4EC",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: "#10B981",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
    fontWeight: "500",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  interestTag: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  interestText: {
    color: "#666",
    fontSize: 10,
    fontWeight: "500",
  },
  moreInterests: {
    color: '#FF3366',
    fontSize: 10,
    fontWeight: '500',
  },
  bioText: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  actionButton: {
    padding: 12,
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    marginTop:40,
    borderWidth:2,
    borderColor:'#fff',
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default AdmirersScreen;