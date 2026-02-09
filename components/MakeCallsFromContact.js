
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  StatusBar,
  Image,
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactsScreen = ({ navigation }) => {

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('allUsers');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set all users data with contact info
      setAllUsers(response.data.all_users || []);
      setFilteredUsers(response.data.all_users || []);
      
      // Handle synced contacts
      const syncedContacts = response.data.synced_contacts || [];
      const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
      const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
      const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

      setContacts(syncedContacts);
      setFriends(friendsList);
      setAppUsers(appUsersList);
      setNonAppUsers(nonAppUsersList);
      
      // Update counts
      setPendingSent(response.data.pending_sent || 0);
      setPendingReceived(response.data.pending_received || 0);
    } catch (error) {
    
    } finally {
      setLoading(false);
    }
  };

  const renderUserAvatar = (item) => {
    const profilePic = item.profile_picture || item.user_details?.profile_picture;
    if (profilePic) {
      return (
        <Image 
          source={{ uri: profilePic }} 
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <Icon name="person" size={24} color="#fff" />
      </View>
    );
  };

  const renderUserItem = ({ item}) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        {renderUserAvatar(item)}
        <View style={styles.contactTextContainer}>
          <Text style={styles.contactName}>{item.name || item.phone_number}</Text>
          <Text style={styles.contactPhone}>{item.phone_number}</Text>
          {item.is_in_contacts && (
            <View style={styles.contactBadge}>
              <Text style={styles.contactBadgeText}>In your contacts</Text>
              {item.contact_name && item.contact_name !== item.name && (
                <Text style={styles.contactSavedAs}>
                  Saved as: {item.contact_name}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          const profilePic = item.profile_picture || item.user_details?.profile_picture;
          const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

          navigation.navigate('PrivateChat', {
            receiverId: item.id || item.user_details?.id,
            name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
            profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
            chatType: 'single',
          });
        }}
      >
        <Text style={styles.buttonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabButton = (tabName, title, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon 
            name="arrow-back" 
            size={24} 
            color="#000" 
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Contacts</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="#4E8AF4" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {/* {loading && (
          <ActivityIndicator size="small" color="#4E8AF4" style={styles.searchLoading} />
        )} */}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('allUsers', 'All Users', allUsers.length)}
        {renderTabButton('friends', 'Friends', friends.length)}
        {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
        {renderTabButton('pending', 'Requests', pendingReceived)}
      </View>

      {/* Small Loading Indicator */}
      {loading && (
        <View style={styles.smallLoadingContainer}>
          <ActivityIndicator size="small" color="#4E8AF4" />
        </View>
      )}

      {/* User List */}
      <FlatList
        data={
          activeTab === 'allUsers' ? filteredUsers :
          activeTab === 'friends' ? friends :
          activeTab === 'appUsers' ? appUsers :
          []
        }
        renderItem={renderUserItem}
        keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {activeTab === 'friends' ? 'No friends yet' :
                 activeTab === 'appUsers' ? 'No suggestions available' :
                 activeTab === 'pending' ? 'No pending requests' :
                 'No users found'}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    position: 'relative',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  searchLoading: {
    position: 'absolute',
    right: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4E8AF4',
  },
  activeTabText: {
    color: '#4E8AF4',
    fontWeight: '500',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  contactBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
  },
  contactSavedAs: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4E8AF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  smallLoadingContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactsScreen;