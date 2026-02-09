import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  StatusBar,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactsScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appUsers');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
     
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      const { contacts, friend_count, pending_sent, pending_received } = response.data

      // Categorize of user phone contacts
      const friendsList = contacts.filter(c => c.user_details?.is_friend);
      const appUsersList = contacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
      const nonAppUsersList = contacts.filter(c => !c.is_app_user);

      setContacts(contacts);
      setFriends(friendsList);
      setAppUsers(appUsersList);
      setNonAppUsers(nonAppUsersList);
      setPendingSent(pending_sent);
      setPendingReceived(pending_received);
    } catch (error) {
      //console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`${API_ROUTE}/friend-request/`, { to_user: userId });
      fetchContacts(); 
    } catch (error) {
      //console.error('Error sending friend request:', error);
    }
  };

  const handleFriendRequest = async (requestId, action) => {
    try {
      await axios.post(`${API_ROUTE}/friend-request/${requestId}/${action}/`);
      fetchContacts(); 
    } catch (error) {
      //console.error('Error handling friend request:', error);
    }
  };

  const renderContactAvatar = (item) => {
    if (item.user_details?.profile_picture) {
      return (
        <Image 
          source={{ uri: item.user_details.profile_picture }} 
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

  const renderItem = ({ item }) => {
    if (activeTab === 'friends') {
      return (
        <View style={styles.contactItem}>
          <View style={styles.contactInfo}>
            {renderContactAvatar(item)}
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone_number}</Text>
            </View>
          </View>
          <View style={styles.friendBadge}>
            <Icon name="check" size={16} color="#fff" />
          </View>
        </View>
      );
    } else if (activeTab === 'appUsers') {
      return (
        <View style={styles.contactItem}>
          <View style={styles.contactInfo}>
            {renderContactAvatar(item)}
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone_number}</Text>
            </View>
          </View>
          {item.user_details ? (
            <TouchableOpacity 
              style={styles.addButton}
             onPress={()=>{

                 navigation.navigate('BPrivateChat', {
                      receiverId: item.user_details.id,
                      name: item.name,
                      profile_image: item.user_details.profile_picture,
                      chatType: 'single',
                    });
             }}
            >
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else if (activeTab === 'nonAppUsers') {
      return (
        <View style={styles.contactItem}>
          <View style={styles.contactInfo}>
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={24} color="#fff" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone_number}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteButton}>
            <Icon name="send" size={18} color="#4E8AF4" />
            <Text style={styles.inviteText}>Invite</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === 'pending') {
      return (
        <View style={styles.contactItem}>
          <View style={styles.contactInfo}>
            {renderContactAvatar(item)}
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{item.from_user.username}</Text>
              <Text style={styles.contactStatus}>Pending request</Text>
            </View>
          </View>
          <View style={styles.requestActions}>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => handleFriendRequest(item.id, 'accept')}
            >
              <Icon name="check" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={() => handleFriendRequest(item.id, 'reject')}
            >
              <Icon name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const renderTabButton = (tabName, title, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{title}</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8AF4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
    
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="#4E8AF4" />
        </TouchableOpacity>
      </View>

   
      <View style={styles.tabContainer}>
        {renderTabButton('appUsers', 'Suggestions', 0)}
        {renderTabButton('friends', 'Friends', friends.length)}
        {renderTabButton('pending', 'Requests', pendingReceived)}
        {renderTabButton('nonAppUsers', 'Others', nonAppUsers.length)}
      </View>

   
      <FlatList
        data={
          activeTab === 'friends' ? friends :
          activeTab === 'appUsers' ? appUsers :
          activeTab === 'nonAppUsers' ? nonAppUsers :
          [] 
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.phone_number}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>
              {activeTab === 'friends' ? 'No friends yet' :
               activeTab === 'appUsers' ? 'No suggestions available' :
               activeTab === 'pending' ? 'No pending requests' :
               'No other contacts'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  searchButton: {
    padding: 5,
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
  contactStatus: {
    fontSize: 13,
    color: '#6B7280',
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
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inviteText: {
    color: '#4E8AF4',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  friendBadge: {
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ContactsScreen;