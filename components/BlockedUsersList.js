import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Iconn from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const BlockedUsersList = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);

  // Get auth token
  const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
  };

  
  const getBlockedUsers = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_ROUTE}/blocked-users/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  };

  // API: Unblock a user
  const unblockUser = async (userId) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${API_ROUTE}/unblock-user/${userId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  };

  // Fetch blocked users
  const fetchBlockedUsers = useCallback(async () => {
    try {
      const response = await getBlockedUsers();
      if (response.success) {
        setBlockedUsers(response.blocked_users || []);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      Alert.alert('Error', 'Failed to load blocked users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  // Handle unblock
  const handleUnblock = async (userId, userName) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: async () => {
            try {
              setUnblockingId(userId);
              const response = await unblockUser(userId);
              
              if (response.success) {
                // Remove from list
                setBlockedUsers(prev => prev.filter(user => user.id !== userId));
                Alert.alert('Success', `${userName} has been unblocked`);
              } else {
                Alert.alert('Error', response.error || 'Failed to unblock user');
              }
            } catch (error) {
              console.error('Error unblocking user:', error);
              Alert.alert('Error', 'Failed to unblock user');
            } finally {
              setUnblockingId(null);
            }
          }
        }
      ]
    );
  };

  // Render each blocked user item
  const renderBlockedUser = ({ item }) => (
    <View style={styles.userItem}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => {
         
          if (navigation) {
            navigation.navigate('OtherUserProfile', { userId: item.id });
          }
        }}
      >
        <Image
          source={
            item.profile_picture
              ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username || item.name}</Text>
          <Text style={styles.blockedDate}>
            Blocked: {new Date(item.blocked_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item.id, item.name)}
        disabled={unblockingId === item.id}
      >
        {unblockingId === item.id ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            
            <Text style={styles.unblockButtonText}>Unblock</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="users" size={64} color="#4B5563" />
      <Text style={styles.emptyTitle}>No Blocked Users</Text>
      <Text style={styles.emptyText}>
        You haven't blocked anyone yet. Blocked users will appear here.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e10b9" />
        <Text style={styles.loadingText}>Loading blocked users...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Iconn  name='arrow-back' size={25} color='#000'/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <Text style={styles.headerCount}>
          {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBlockedUser}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchBlockedUsers();
            }}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Unblock all button (if more than 1 blocked user) */}
      {blockedUsers.length > 1 && (
        <TouchableOpacity
          style={styles.unblockAllButton}
          onPress={() => {
            Alert.alert(
              'Unblock All',
              `Are you sure you want to unblock all ${blockedUsers.length} users?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Unblock All',
                  style: 'destructive',
                  onPress: async () => {
                    // Unblock all users one by one
                    let successCount = 0;
                    let failedUsers = [];
                    for (const user of blockedUsers) {
                      try {
                        const response = await unblockUser(user.id);
                        if (response.success) {
                          successCount++;
                        } else {
                          failedUsers.push(user.name);
                        }
                      } catch (error) {
                        console.error(`Failed to unblock ${user.name}:`, error);
                        failedUsers.push(user.name);
                      }
                    }
                    // Refresh the list
                    fetchBlockedUsers();
                    if (failedUsers.length === 0) {
                      Alert.alert('Success', `All ${successCount} users have been unblocked`);
                    } else {
                      Alert.alert(
                        'Partial Success',
                        `Unblocked ${successCount} users. Failed to unblock: ${failedUsers.join(', ')}`
                      );
                    }
                  }
                }
              ]
            );
          }}
        >
          <Text style={styles.unblockAllText}>Unblock All</Text>
        </TouchableOpacity>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    color: '#77787a',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#b1b1b1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerCount: {
    fontSize: 14,
    color: '#5c5f63',
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#121213',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userUsername: {
    fontSize: 14,
    color: '#5c5f63',
    marginTop: 2,
  },
  blockedDate: {
    fontSize: 12,
    color: '#5c5f63',
    marginTop: 2,
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  unblockButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  unblockAllButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  unblockAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BlockedUsersList;