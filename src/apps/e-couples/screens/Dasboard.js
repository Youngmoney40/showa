
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
  Easing,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('matches');
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Mock data for matched users
  const mockMatches = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 28,
      location: 'Nigeria Lagos',
      distance: '2 miles away',
      photos: ['https://i.pinimg.com/736x/7b/ae/2a/7bae2a3d1d8659dc4fbd70dbe0b1a469.jpg'],
      compatibility: 92,
      bio: 'Adventure seeker and coffee lover. Always up for trying new things!',
      lastActive: '2 hours ago',
      verified: true,
      interests: ['Hiking', 'Photography', 'Coffee', 'Travel'],
      online: false,
    },
    {
      id: '2',
      name: 'Henry Money',
      age: 32,
      location: 'Abuja Nigeria',
      distance: '15k miles away',
      photos: ['https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg'],
      compatibility: 87,
      bio: 'Software engineer who loves jazz and weekend adventures.',
      lastActive: '5 hours ago',
      verified: true,
      interests: ['Technology', 'Jazz Music', 'Cooking', 'Running'],
      online: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setMatches(mockMatches);
    
    // Staggered animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleLike = (userId) => {
    // Handle like action with animation
    console.log('Liked user:', userId);
  };

  const handleDislike = (userId) => {
    // Handle dislike action
    console.log('Disliked user:', userId);
  };

  const handleMessage = (user) => {
    // Navigate to chat
    console.log('Message user:', user.name);
  };

  const handleProfilePress = (user) => {
    // Navigate to profile
    console.log('View profile:', user.name);
  };

  const renderMatchCard = (user, index) => {
    const cardStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim,
        },
        {
          scale: scaleAnim,
        },
      ],
    };

    const delay = index * 200;

    return (
      <Animated.View 
        key={user.id} 
        style={[
          styles.matchCard, 
          cardStyle,
          { transform: cardStyle.transform }
        ]}
      >
        {/* User Image with Gradient Overlay */}
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={() => handleProfilePress(user)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: user.photos[0] }} style={styles.userImage} />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />
          
          {/* Top Badges */}
          <View style={styles.topBadges}>
            {/* Compatibility Badge */}
            <LinearGradient
              colors={['#FF6B8B', '#FF3366']}
              style={styles.compatibilityBadge}
            >
              <Icon name="heart" size={12} color="#FFFFFF" />
              <Text style={styles.compatibilityText}>{user.compatibility}%</Text>
            </LinearGradient>

            {/* Online Status */}
            <View style={[
              styles.onlineStatus,
              user.online ? styles.online : styles.offline
            ]}>
              <View style={[
                styles.statusDot,
                user.online ? styles.statusDotOnline : styles.statusDotOffline
              ]} />
              <Text style={styles.onlineText}>
                {user.online ? 'Online' : user.lastActive}
              </Text>
            </View>
          </View>

          {/* Bottom Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.bottomOverlay}
          >
            <View style={styles.overlayContent}>
              <View style={styles.nameVerifiedRow}>
                <Text style={styles.userName}>{user.name}, {user.age}</Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  </View>
                )}
              </View>
              
              <View style={styles.locationRow}>
                <Icon name="location-outline" size={14} color="#FFFFFF" />
                <Text style={styles.userLocation}>{user.location}</Text>
                <Text style={styles.userDistance}>• {user.distance}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.userBio} numberOfLines={2}>
            {user.bio}
          </Text>

          {/* Interests */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.interestsContainer}
          >
            {user.interests.map((interest, idx) => (
              <LinearGradient
                key={idx}
                colors={['#f8f5fc', '#f0ebf5']}
                style={styles.interestTag}
              >
                <Text style={styles.interestText}>{interest}</Text>
              </LinearGradient>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => handleDislike(user.id)}
            >
              <LinearGradient
                colors={['#f5f5f5', '#e0e0e0']}
                style={styles.buttonGradient}
              >
                <Icon name="close" size={24} color="#666" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.messageButton]}
              onPress={() => handleMessage(user)}
            >
              <LinearGradient
                colors={['#6c5ce7', '#5b4cd8']}
                style={styles.buttonGradient}
              >
                <Icon name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleLike(user.id)}
            >
              <LinearGradient
                colors={['#FF6B8B', '#FF3366']}
                style={styles.buttonGradient}
              >
                <Icon name="heart" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Animated.View 
        style={[
          styles.emptyIllustration,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#f8f5fc', '#e5dbee']}
          style={styles.emptyGradient}
        >
          <MaterialIcons name="people-outline" size={80} color="#FF3366" />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.emptyTitle}>No Matches Yet</Text>
      <Text style={styles.emptySubtitle}>
        Complete your profile and start connecting with amazing people around you!
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <LinearGradient
          colors={['#FF6B8B', '#FF3366']}
          style={styles.exploreGradient}
        >
          <Text style={styles.exploreButtonText}>Start Exploring</Text>
          <Icon name="arrow-forward" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF3366" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FF3366', '#FF6B8B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>E-Couples</Text>
            <Text style={styles.headerSubtitle}>
              {matches.length} potential connections
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.iconButtonGradient}
              >
                <Icon name="search" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.iconButtonGradient}
              >
                <Icon name="notifications" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Bar with Glass Effect */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {['matches', 'messages', 'likes'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <LinearGradient
                colors={activeTab === tab ? ['#FF6B8B', '#FF3366'] : ['transparent', 'transparent']}
                style={styles.tabGradient}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                {tab === 'messages' && (
                  <View style={styles.messageBadge}>
                    <Text style={styles.messageBadgeText}>3</Text>
                  </View>
                )}
                {tab === 'likes' && (
                  <View style={styles.likeBadge}>
                    <Text style={styles.likeBadgeText}>12</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF3366']}
            tintColor="#FF3366"
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Find Your Perfect Match</Text>
              <Text style={styles.welcomeSubtitle}>
                Connect with like-minded people and build meaningful relationships
              </Text>
            </View>
          </LinearGradient>
        </View>

        {matches.length > 0 ? (
          <View style={styles.matchesGrid}>
            {matches.map((match, index) => renderMatchCard(match, index))}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

      {/* Bottom Navigation with Floating Effect */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          {[
            { icon: 'home', label: 'Home', active: true },
            { icon: 'compass', label: 'Discover' },
            { icon: 'add', label: 'Add', central: true },
            { icon: 'notifications', label: 'Alerts' },
            { icon: 'person', label: 'Profile' }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.navItem}
              onPress={() => item.central && console.log('Add pressed')}
            >
              {item.central ? (
                <View style={styles.centralNavButton}>
                  <LinearGradient
                    colors={['#FF6B8B', '#FF3366']}
                    style={styles.centralButtonGradient}
                  >
                    <Icon name={item.icon} size={28} color="#FFFFFF" />
                  </LinearGradient>
                </View>
              ) : (
                <>
                  <Icon 
                    name={item.icon} 
                    size={24} 
                    color={item.active ? '#FF3366' : '#666'} 
                  />
                  <Text style={[
                    styles.navText,
                    item.active && styles.navTextActive
                  ]}>
                    {item.label}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7fc',
  },
  header: {
    paddingTop: StatusBar.currentHeight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  iconButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f5fc',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabGradient: {
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  messageBadge: {
    position: 'absolute',
    top: 8,
    right: 20,
    backgroundColor: '#FFFFFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBadgeText: {
    color: '#FF3366',
    fontSize: 10,
    fontWeight: '800',
  },
  likeBadge: {
    position: 'absolute',
    top: 8,
    right: 20,
    backgroundColor: '#FFFFFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBadgeText: {
    color: '#FF3366',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  welcomeBanner: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  matchesGrid: {
    padding: 16,
    gap: 20,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 320,
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  compatibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  compatibilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  online: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOnline: {
    backgroundColor: '#4CAF50',
  },
  statusDotOffline: {
    backgroundColor: '#666',
  },
  onlineText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  overlayContent: {
    flexDirection: 'column',
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  userDistance: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  infoCard: {
    padding: 20,
  },
  userBio: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  interestsContainer: {
    marginHorizontal: -4,
    marginBottom: 16,
  },
  interestTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  interestText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dislikeButton: {
    shadowColor: '#666',
  },
  likeButton: {
    shadowColor: '#FF3366',
  },
  messageButton: {
    flex: 2,
    shadowColor: '#6c5ce7',
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 80,
  },
  emptyIllustration: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c2c2c',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  exploreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomNavContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 4,
  },
  centralNavButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  centralButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#FF3366',
    fontWeight: '700',
  },
});