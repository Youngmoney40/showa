


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

const OtherUserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const videoRefs = useRef({});

  const [userData, setUserData] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState('');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);

  // Follow state
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0,
    followers: [],
    following: []
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch user data by ID
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_ROUTE}/users/${userId}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
        const baseURL = `${API_ROUTE_IMAGE}`;
        const profilePicture = response.data.profile_picture
          ? `${baseURL}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigation.navigate('Login');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'User not found');
        navigation.goBack();
      }
    }
  };

  // Fetch follow stats for other user
  const fetchFollowStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/users/${userId}/follow-stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setFollowStats(response.data);
        checkIfFollowing();
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error.response?.data || error.message);
    }
  };

  // Check if current user is following this user
  const checkIfFollowing = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');
      
      const response = await axios.get(`${API_ROUTE}/me/follow-stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const isUserFollowing = response.data.following.some(
          follow => follow.following_user.id === parseInt(userId)
        );
        setIsFollowing(isUserFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error.response?.data || error.message);
    }
  };

  // Follow user
  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/follow/`, {
        following_user: userId,
        follow_type: 'user'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setIsFollowing(true);
        fetchFollowStats(); // Refresh follow stats
        Alert.alert('Success', `You are now following ${userData?.name}`);
      }
    } catch (error) {
      console.error('Error following user:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to follow user');
    } finally {
      setFollowLoading(false);
    }
  };

  // Unfollow user
  const handleUnfollow = async () => {
    try {
      setFollowLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      // Find the follow relationship ID
      const myFollowStats = await axios.get(`${API_ROUTE}/me/follow-stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const follow = myFollowStats.data.following.find(
        f => f.following_user.id === parseInt(userId)
      );

      if (follow) {
        await axios.delete(`${API_ROUTE}/follow/${follow.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsFollowing(false);
        fetchFollowStats(); // Refresh follow stats
        Alert.alert('Success', `You have unfollowed ${userData?.name}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to unfollow user');
    } finally {
      setFollowLoading(false);
    }
  };

  // Fetch business profile data for other user
  const fetchBusinessProfile = async () => {
    try {
      setBusinessLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setBusinessProfile(profile);
        
        if (profile?.id) {
          await fetchBusinessHours(profile.id);
          await fetchBusinessCatalog(profile.id);
        }
        
        setShowBusinessInfo(!!(profile?.name || profile?.description));
      } else {
        setBusinessProfile(null);
        setShowBusinessInfo(false);
      }
    } catch (err) {
      console.error('Failed to load business profile', err);
      setBusinessProfile(null);
      setShowBusinessInfo(false);
    } finally {
      setBusinessLoading(false);
    }
  };

  const fetchBusinessHours = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/business-hours/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBusinessHours(data || []);
    } catch (err) {
      console.error('Error fetching business hours:', err);
      setBusinessHours([]);
    }
  };

  const fetchBusinessCatalog = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/catalogs/user/${profileId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setCatalogData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
      setCatalogData([]);
    }
  };

  // Fetch user's posts
  const fetchMarketplace = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/user-listings/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarketplacePosts(res.data || []);
    } catch (error) {
      setMarketplacePosts([]);
      console.error('Error fetching marketplace posts:', error);
    }
  };

  const fetchTweets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/user-posts/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTweets(res.data || []);
    } catch (error) {
      setTweets([]);
      console.error('Error fetching tweets:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/user-shorts/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserVideos(res.data || []);
    } catch (error) {
      setUserVideos([]);
      console.error('Error fetching videos:', error);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await fetchUserData();
        await fetchFollowStats();
        await fetchBusinessProfile();
        await Promise.all([fetchMarketplace(), fetchTweets(), fetchVideos()]);
        setLoading(false);
      };
      
      if (userId) {
        fetchData();
      }
    }, [userId])
  );

  const toggleModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const toggleVideoPlayback = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  // Navigation to followers/following screens
  const navigateToFollowers = () => {
    navigation.navigate('Followers', { 
      userId: userId,
      followers: followStats.followers 
    });
  };

  const navigateToFollowing = () => {
    navigation.navigate('Following', { 
      userId: userId,
      following: followStats.following 
    });
  };

  const handleBusinessAction = (action) => {
    if (action === 'contact') {
      if (businessProfile?.phone) {
        Alert.alert('Contact Business', `Call ${businessProfile.phone}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => console.log('Calling:', businessProfile.phone) }
        ]);
      } else if (businessProfile?.email) {
        Alert.alert('Contact Business', `Email ${businessProfile.email}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Email', onPress: () => console.log('Emailing:', businessProfile.email) }
        ]);
      }
    } else if (action === 'website' && businessProfile?.website) {
      Alert.alert('Visit Website', `Open ${businessProfile.website}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Opening:', businessProfile.website) }
      ]);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="document-text-outline" size={60} color="#d1d5db" />
      <Text style={styles.emptyText}>
        This user hasn't posted anything yet.
      </Text>
    </View>
  );

  const currentData = () => {
    switch(selectedTab) {
      case 'marketplace': return marketplacePosts;
      case 'tweets': return tweets;
      case 'videos': return userVideos;
      default: return [];
    }
  };

  // Render Business Info Section
  const renderBusinessInfo = () => {
    if (!showBusinessInfo || !businessProfile) return null;

    return (
      <View style={styles.businessContainer}>
        <View style={styles.businessHeader}>
          <Text style={styles.businessTitle}>Business Information</Text>
          {businessProfile.logo && (
            <Image 
              source={{ uri: `${API_ROUTE_IMAGE}${businessProfile.logo}` }} 
              style={styles.businessLogo}
            />
          )}
        </View>

        {businessProfile.name && (
          <Text style={styles.businessName}>{businessProfile.name}</Text>
        )}

        {businessProfile.categories?.length > 0 && (
          <View style={styles.businessCategory}>
            <Icon name="business-outline" size={16} color="#666" />
            <Text style={styles.categoryText}>
              {businessProfile.categories.map(cat => cat.name).join(', ')}
            </Text>
          </View>
        )}

        {businessProfile.description && (
          <Text style={styles.businessDescription} numberOfLines={3}>
            {businessProfile.description}
          </Text>
        )}

        {businessHours.length > 0 && (
          <View style={styles.businessHours}>
            <Text style={styles.sectionSubtitle}>Business Hours</Text>
            {businessHours.slice(0, 3).map((hour, idx) => (
              <Text key={idx} style={styles.hourText}>
                {hour.day}: {hour.open_time} - {hour.close_time}
              </Text>
            ))}
            {businessHours.length > 3 && (
              <Text style={styles.moreText}>+{businessHours.length - 3} more days</Text>
            )}
          </View>
        )}

        {catalogData.length > 0 && (
          <View style={styles.productsPreview}>
            <Text style={styles.sectionSubtitle}>Products ({catalogData.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
              {catalogData.slice(0, 5).map((item, index) => (
                <View key={index} style={styles.productItem}>
                  <Image
                    source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    ₦{parseFloat(item.price).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.contactInfo}>
          {businessProfile.address && (
            <View style={styles.contactItem}>
              <Icon name="location-outline" size={16} color="#666" />
              <Text style={styles.contactText}>{businessProfile.address}</Text>
            </View>
          )}
          
          {businessProfile.email && (
            <View style={styles.contactItem}>
              <Icon name="mail-outline" size={16} color="#666" />
              <Text style={styles.contactText}>{businessProfile.email}</Text>
            </View>
          )}
          
          {businessProfile.phone && (
            <View style={styles.contactItem}>
              <Icon name="call-outline" size={16} color="#666" />
              <Text style={styles.contactText}>{businessProfile.phone}</Text>
            </View>
          )}
          
          {businessProfile.website && (
            <View style={styles.contactItem}>
              <Icon name="globe-outline" size={16} color="#666" />
              <Text style={[styles.contactText, styles.websiteText]}>
                {businessProfile.website}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.businessActions}>
          <TouchableOpacity 
            style={styles.businessButton}
            onPress={() => handleBusinessAction('contact')}
          >
            <Icon name="call-outline" size={18} color="#fff" />
            <Text style={styles.businessButtonText}>Contact Business</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.businessButton, styles.secondaryButton]}
            onPress={() => handleBusinessAction('website')}
          >
            <Icon name="navigate-outline" size={18} color="#0d64dd" />
            <Text style={[styles.businessButtonText, styles.secondaryButtonText]}>
              Visit Website
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMarketplacePost = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.images?.[0]?.image }} 
        style={styles.postImage}
      />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>{item.title}</Text>
        </View>
        <Text style={styles.postPrice}>${item.price}</Text>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderTweet = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postText} numberOfLines={3}>{item.content}</Text>
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStat}>{item.likes} likes</Text>
          <Text style={styles.postStat}>{item.comments} comments</Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  const renderVideo = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => toggleVideoPlayback(item.id)}
        style={styles.videoContainer}
      >
        <Video
          ref={(ref) => (videoRefs.current[item.id] = ref)}
          source={{ uri: item.video }}
          style={styles.postImage}
          resizeMode="cover"
          paused={playingVideo !== item.id}
          repeat={true}
          onError={(error) => console.log('Video error:', error)}
        />
        {playingVideo !== item.id && (
          <View style={styles.playButton}>
            <Icon name="play" size={48} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>{item.caption}</Text>
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStat}>{item.like_count} likes</Text>
          <Text style={styles.postStat}>{item.comment_count} comments</Text>
          <Text style={styles.postDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle,{color:'#333'}]}>Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d64dd" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle,{color:'#333'}]}>Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="person-outline" size={60} color="#d1d5db" />
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle,{color:'#333'}]}>Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require('../../assets/images/dad.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.contactName}>{userData.name}</Text>
          <Text style={styles.contactPhone}>{userData.phone}</Text>
          
          {/* Business Badge */}
          {showBusinessInfo && (
            <View style={styles.businessBadge}>
              <Icon name="business" size={16} color="#fff" />
              <Text style={styles.businessBadgeText}>Business Account</Text>
            </View>
          )}
          
          {/* Following/Followers Section */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={navigateToFollowing}>
              <Text style={styles.statNumber}>{followStats.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem} onPress={navigateToFollowers}>
              <Text style={styles.statNumber}>{followStats.followers_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{currentData().length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
          </View>

          {/* Follow Button */}
          <TouchableOpacity 
            style={[
              styles.followButton,
              isFollowing ? styles.unfollowButton : styles.followButtonActive
            ]}
            onPress={isFollowing ? handleUnfollow : handleFollow}
            disabled={followLoading}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color={isFollowing ? "#666" : "#fff"} />
            ) : (
              <Text style={[
                styles.followButtonText,
                isFollowing && styles.unfollowButtonText
              ]}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Business Information Section */}
        {businessLoading ? (
          <View style={styles.businessLoading}>
            <ActivityIndicator size="small" color="#0d64dd" />
            <Text style={styles.loadingText}>Loading business information...</Text>
          </View>
        ) : (
          renderBusinessInfo()
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Icon style={styles.quickActionIcon} name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon style={styles.quickActionIcon} name="call-outline" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon style={styles.quickActionIcon} name="notifications-off-outline" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Mute</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userData.name}'s Posts
          </Text>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => {
              setSelectedTab('marketplace');
              setPlayingVideo(null);
            }} 
            style={[styles.tab, selectedTab === 'marketplace' && styles.activeTab]}
          >
            <Icon 
              name="cart-outline" 
              size={20} 
              color={selectedTab === 'marketplace' ? '#fff' : '#0d64dd'} 
            />
            <Text style={[styles.tabText, selectedTab === 'marketplace' && styles.activeTabText]}>
              Marketplace
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setSelectedTab('tweets');
              setPlayingVideo(null);
            }} 
            style={[styles.tab, selectedTab === 'tweets' && styles.activeTab]}
          >
            <Icon 
              name="chatbubble-outline" 
              size={20} 
              color={selectedTab === 'tweets' ? '#fff' : '#0d64dd'} 
            />
            <Text style={[styles.tabText, selectedTab === 'tweets' && styles.activeTabText]}>
              Broadcast
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setSelectedTab('videos');
            }} 
            style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
          >
            <Icon 
              name="videocam-outline" 
              size={20} 
              color={selectedTab === 'videos' ? '#fff' : '#0d64dd'} 
            />
            <Text style={[styles.tabText, selectedTab === 'videos' && styles.activeTabText]}>
              Videos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Content */}
        {currentData().length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={currentData()}
            renderItem={
              selectedTab === 'marketplace'
                ? renderMarketplacePost
                : selectedTab === 'tweets'
                ? renderTweet
                : renderVideo
            }
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={toggleModal}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Post Options</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close-circle-outline" size={24} color="#3498db" />
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffffff',
    paddingTop: 10,
    marginBottom:20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Lato-Bold',
  },
  headerRight: {
    width: 24,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 60,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    fontFamily: 'Lato-Bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
    fontFamily: 'Lato-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontFamily: 'Lato-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
    fontFamily: 'Lato-Regular',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e9ecef',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    backgroundColor: '#0d64dd',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: 'Lato-SemiBold',
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    fontFamily: 'Lato-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#0d64dd',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    marginLeft: 6,
    color: '#0d64dd',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Lato-SemiBold',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Lato-SemiBold',
  },
  postText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  postPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 4,
    fontFamily: 'Lato-Bold',
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postStat: {
    fontSize: 13,
    color: '#6c757d',
    marginRight: 16,
    fontFamily: 'Lato-Regular',
  },
  postDate: {
    fontSize: 12,
    color: '#adb5bd',
    fontFamily: 'Lato-Regular',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0d64dd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Follow Button Styles
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonActive: {
    backgroundColor: '#0d64dd',
  },
  unfollowButton: {
    backgroundColor: '#e0e0e0',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  unfollowButtonText: {
    color: '#666',
  },

  // Business Profile Styles (same as UserProfile)
  businessContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  businessLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 12,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  businessCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  businessDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  businessHours: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  hourText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#0d64dd',
    fontStyle: 'italic',
  },
  productsPreview: {
    marginBottom: 16,
  },
  productsScroll: {
    marginTop: 8,
  },
  productItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  productName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  websiteText: {
    color: '#0d64dd',
  },
  businessActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  businessButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d64dd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  businessButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0d64dd',
  },
  secondaryButtonText: {
    color: '#0d64dd',
  },
  businessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d64dd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  businessBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  businessLoading: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Lato-SemiBold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
    fontFamily: 'Lato-Regular',
  },
});

export default OtherUserProfile;