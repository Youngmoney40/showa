import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import colors from '../theme/colors';

export default function SuggestedFollowersScreen() {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation();

  const fetchSuggestedFriends = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        setSuggestedFriends(response.data);
      } else {
        console.log('No suggested friends found');
      }
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSuggestedFriends();
    setRefreshing(false);
  };

  const handleFollow = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found, cannot follow user.');
        return;
      }

      const response = await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuggestedFriends(prev => prev.filter(friend => friend.id !== userId));
        setSnackbarMessage('Followed successfully!');
        setSnackbarVisible(true);
      } else {
        console.log('Failed to follow:', response.data);
        setSnackbarMessage('Failed to follow user');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.log('Failed to follow:', error.response?.data || error.message);
      setSnackbarMessage('Failed to follow user. Please try again.');
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    fetchSuggestedFriends();
  }, []);

  const renderSuggestedFriend = ({ item }) => (
    <View style={styles.suggestedFriendItem}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('BroadcastUserProfile', { user_ID: item.id })}
        style={styles.friendInfoContainer}
      >
        <View style={styles.suggestedFriendImageContainer}>
            <Image
            source={
              item.profile_picture
                ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.suggestedFriendImage}
          />

        </View>
        <View style={styles.friendTextContainer}>
          <Text style={styles.suggestedFriendName} numberOfLines={1}>
            {item.username}
          </Text>
          {item.id && (
                  <Text style={styles.suggestedFriendClub} numberOfLines={1}>
                    {item.id} Followers
                  </Text>
            )}
          {/* {item.followers_count && (
            <Text style={styles.suggestedFriendFollowers} numberOfLines={1}>
              {item.followers_count} Followers
            </Text>
          )} */}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.suggestedFriendFollowButton}
        onPress={() => handleFollow(item.id)}
      >
        <Text style={styles.suggestedFriendFollowButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggested Followers</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Suggested Friends List */}
      <FlatList
        data={suggestedFriends}
        renderItem={renderSuggestedFriend}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No suggested followers found</Text>
          </View>
        }
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  suggestedFriendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  friendInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestedFriendImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  suggestedFriendImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  friendTextContainer: {
    flex: 1,
  },
  suggestedFriendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestedFriendFollowers: {
    fontSize: 13,
    color: '#8E8E8E',
  },
  suggestedFriendFollowButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  suggestedFriendFollowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});