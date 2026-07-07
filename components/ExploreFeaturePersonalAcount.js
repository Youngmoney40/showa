

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Alert,
  Switch,
  Share,
  Platform,
  FlatList,
  LogBox,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// Cache keys
const CACHE_KEYS = {
  BUSINESS_PROFILE: '@business_profile_cache',
  USER_DATA: '@user_data_cache',
  LAST_FETCH: '@last_fetch_time',
};

const AccountDashboard = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Load cached data immediately
    loadCachedData();

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if we need to refresh data in background
    checkAndRefreshData();

    // Set up focus listener for background updates
    const unsubscribe = navigation.addListener('focus', () => {
      checkAndRefreshData();
    });

    return unsubscribe;
  }, []);

  // Load cached data instantly
  const loadCachedData = async () => {
    try {
      // Load user data from cache
      const cachedUserData = await AsyncStorage.getItem(CACHE_KEYS.USER_DATA);
      if (cachedUserData) {
        const data = JSON.parse(cachedUserData);
        setUserData(data);
        setUserName(data.name || data.username || 'User');
        setUserEmail(data.email || '');
        setUserAvatar(data.profile_picture || data.image || null);
        setUserId(data.id || '');
      }

      // Load business profile status from cache
      const cachedBusinessProfile = await AsyncStorage.getItem(CACHE_KEYS.BUSINESS_PROFILE);
      if (cachedBusinessProfile !== null) {
        setHasBusinessProfile(JSON.parse(cachedBusinessProfile));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cached data:', error);
      setIsLoading(false);
    }
  };

  // Check and refresh data in background
  const checkAndRefreshData = async () => {
    try {
      const lastFetch = await AsyncStorage.getItem(CACHE_KEYS.LAST_FETCH);
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      // Only refresh if cache is older than 5 minutes
      if (!lastFetch || now - parseInt(lastFetch) > CACHE_DURATION) {
        await refreshData(false); // Silent refresh
      }
    } catch (error) {
      console.error('Error checking refresh:', error);
    }
  };

  // Refresh data (with or without loading indicator)
  const refreshData = async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    
    try {
      // Fetch user data
      const token = await AsyncStorage.getItem('userToken');
      
      // Fetch user data
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setUserName(data.name || data.username || 'User');
        setUserEmail(data.email || '');
        setUserAvatar(data.profile_picture || data.image || null);
        setUserId(data.id || '');
        // Cache user data
        await AsyncStorage.setItem(CACHE_KEYS.USER_DATA, JSON.stringify(data));
      }

      // Fetch business profile
      if (token) {
        try {
          const response = await axios.get(`${API_ROUTE}/profiles/`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // 5 second timeout
          });

          if (response.status === 200 || response.status === 201) {
            const profile = response.data;
            const hasProfile = profile && profile.name && profile.name.trim() !== '';
            setHasBusinessProfile(hasProfile);
            // Cache business profile status
            await AsyncStorage.setItem(CACHE_KEYS.BUSINESS_PROFILE, JSON.stringify(hasProfile));
          }
        } catch (err) {
          // If API fails, keep cached value
          console.log('Business profile fetch failed, using cached value');
        }
      }

      // Update last fetch time
      await AsyncStorage.setItem(CACHE_KEYS.LAST_FETCH, Date.now().toString());
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      if (showLoading) setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Manual refresh on pull
  const onRefresh = () => {
    refreshData(true);
  };

  const handleGoLive = async () => {
    const safeUserName = (userName || "user")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase();

    navigation.navigate('Broadcaster', {
      roomName: `user-${safeUserName}`,
      streamId: `stream-${safeUserName}`,
      userName: userData?.name || 'User',
      userId: userId
    });
  };

  const handleSwitchAccount = () => {
    Alert.alert(
      'Switch Account',
      'Are you sure you want to switch to a different account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch', 
          style: 'destructive',
          onPress: () => {
            console.log('Switching account...');
          }
        }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out Showa - The ultimate social experience! Download now: https://showapp.com/download',
        title: 'Share Showa',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  const handlePress = (item) => {
    if (item.title === 'Monetize') return setActiveModal('monetize');
    if (item.title === 'Quick Connect') return setActiveModal('quickConnect');
    if (item.title === 'Premium Features') return setActiveModal('premium');
    if (item.screen) navigation.navigate(item.screen);
  };

  const handelNavigation = () => {
    navigation.navigate('MonetizationRequestForm');
    setActiveModal(null);
  };

  // Personal Account Grid Items (Always Shown)
  const personalItems = [
    {
      icon: 'person-outline',
      label: 'Profile',
      subtitle: 'Edit personal details',
      onPress: () => navigateTo('Settings'),
      color: '#45B7D1',
      bgColor: '#45B7D115',
    },
    {
      icon: 'settings-outline',
      label: 'Preferences',
      subtitle: 'Customize app',
      onPress: () => navigateTo('Settings'),
      color: '#96CEB4',
      bgColor: '#96CEB415',
    },
    {
      icon: 'swap-horizontal-outline',
      label: 'Switch Account',
      subtitle: 'Change profile',
      onPress: handleSwitchAccount,
      color: '#FF9F43',
      bgColor: '#FF9F4315',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacy',
      subtitle: 'Security settings',
      onPress: () => navigateTo('PrivacySettings'),
      color: '#A29BFE',
      bgColor: '#A29BFE15',
    },
    {
      icon: 'share-social-outline',
      label: 'Share App',
      subtitle: 'Invite friends',
      onPress: handleShareApp,
      color: '#FF6B6B',
      bgColor: '#FF6B6B15',
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      subtitle: 'Manage alerts',
      onPress: () => navigateTo('NotificationSetting'),
      color: '#4ECDC4',
      bgColor: '#4ECDC415',
    },
  ];

  // Business Account Features
  const businessItems = [
    {
      id: '1',
      title: 'Business Tool',
      description: 'Comprehensive tools to manage and grow your business',
      screen: 'ToolsScreen',
      icon: 'tools',
      category: 'Business',
      color: '#066bdeff',
    },
    {
      id: '2',
      title: 'Official Broadcast',
      description: 'Send official updates to your audience',
      screen: 'BroadcastHome',
      icon: 'bullhorn',
      category: 'Business',
      color: '#ff9e03ff',
    },
    {
      id: '3',
      title: 'Showa Premium',
      description: 'Send official updates to your audience',
      screen: 'ShowaPremium',
      icon: 'bullhorn',
      category: 'Business',
      color: '#ff9e03ff',
    },
    {
      id: '4',
      title: 'Official Search',
      description: 'Find verified content and businesses',
      screen: 'OfficialSearch',
      icon: 'shield-search',
      category: 'Business',
      color: '#50e3c2',
    },
    {
      id: '5',
      title: 'Quick Connect',
      description: 'Instant deals & offers with real-time matching',
      screen: 'Supplyrequest',
      icon: 'connection',
      category: 'Connect',
      color: '#246BFD',
    },
    {
      id: '6',
      title: 'Market Place',
      description: 'Browse thousands of products and services',
      screen: 'MarketPlace',
      icon: 'store-search',
      category: 'Business',
      color: '#8a2be2',
    },
    {
      id: '7',
      title: 'Manage Posts',
      description: 'Manage your account and content in one place',
      screen: 'ManagePost',
      icon: 'post',
      category: 'Content',
      color: '#ff8c00',
    },
    {
      id: '8',
      title: 'Channels',
      description: 'Create and manage your communication channels',
      screen: 'BJoinChannel',
      icon: 'message-text',
      category: 'Content',
      color: '#d321beff',
    },
    {
      id: '9',
      title: 'e-Music',
      description: 'Stream and monetize your music content',
      screen: 'Music',
      icon: 'music-note',
      category: 'Content',
      color: '#c52f2fff',
    },
    {
      id: '10',
      title: 'Monetize',
      description: 'Multiple ways to earn from your activities',
      screen: 'Monetize',
      icon: 'currency-usd',
      category: 'Monetization',
      color: '#ff6f61',
    },
    {
      id: '11',
      title: 'Go Live / Watch Live',
      description: 'Discover live broadcasts from creators',
      screen: 'LiveStreaming',
      icon: 'play-box-multiple',
      category: 'Content',
      color: '#e94e77',
    },
    {
      id: '12',
      title: 'Fast Earning',
      description: 'Make up to 1-million naira in a short period',
      screen: 'EarningDashbord',
      icon: 'rocket',
      category: 'Business',
      color: '#2ecc71',
    },
    {
      id: '13',
      title: 'E-Report',
      description: 'Report any illegal activities in your area',
      screen: 'GlobalIssueReport',
      icon: 'alert-box',
      category: 'Business',
      color: '#e74c3c',
    },
    {
      id: '14',
      title: 'Support',
      description: '24/7 assistance for all your needs',
      screen: 'ContactUs',
      icon: 'lifebuoy',
      category: 'Business',
      color: '#3498db',
    },
    {
      id: '15',
      title: 'E-News',
      description: 'Stay updated with the latest news',
      screen: 'NewsList',
      icon: 'newspaper-variant',
      category: 'Connect',
      color: '#9b59b6',
    },
    {
      id: '16',
      title: 'Essential Brands',
      description: 'Discover verified brands and partners',
      screen: 'EssentialPlatforms',
      icon: 'apps',
      category: 'Connect',
      color: '#45B7D1',
    },
  ];

  const categories = ['All', 'Business', 'Content', 'Monetization', 'Connect'];

  const getFilteredBusinessItems = () => {
    if (activeCategory === 'All') return businessItems;
    return businessItems.filter(item => item.category === activeCategory);
  };

  const renderGridItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.gridItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
      }]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.gridIconWrapper, { backgroundColor: item.bgColor || item.color + '15' }]}>
        <Icon name={item.icon} size={24} color={item.color || colors.primary} />
      </View>
      <Text style={[styles.gridLabel, { color: colors.text }]}>
        {item.label}
      </Text>
      <Text style={[styles.gridSubtitle, { color: colors.textSecondary }]}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );

  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.businessCard,
        {
          backgroundColor: colors.card || colors.surface,
          borderLeftColor: colors.primary,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.4 : 0.08,
        }
      ]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isDark ? ['rgba(50, 50, 50, 1)', 'rgba(60, 60, 60, 1)'] : ['rgba(240, 239, 239, 1)', 'rgba(243, 243, 243, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardIconBackground}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={item.color || colors.primary}
        />
      </LinearGradient>
      <Text style={[styles.businessCardTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.businessCardDescription, { color: colors.textSecondary }]}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(item)}
      style={[
        styles.categoryItem,
        { backgroundColor: activeCategory === item ? colors.primary : colors.surfaceVariant },
        activeCategory === item && { elevation: 2 },
      ]}
    >
      <Text style={[
        styles.categoryText,
        { color: activeCategory === item ? '#fff' : colors.textSecondary },
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Show loading state only on first load
  // if (isLoading) {
  //   return (
  //     <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
  //       <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <StatusBar 
        backgroundColor={colors.backgroundSecondary} 
        barStyle={isDark ? "light-content" : "dark-content"} 
      />

      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Icon name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {hasBusinessProfile ? 'Dashboard' : 'Settings'}
        </Text>
        <TouchableOpacity 
          onPress={handleShareApp}
          style={styles.headerButton}
        >
          <Icon name="share-social-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View 
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Profile Section - Full Width */}
          <TouchableOpacity
            style={[styles.profileSection, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}
            onPress={() => navigateTo('Settings')}
            activeOpacity={0.8}
          >
            <View style={styles.profileLeft}>
              {userAvatar ? (
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {userName}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {userEmail || 'View Profile'}
                </Text>
                {hasBusinessProfile && (
                  <View style={styles.businessBadge}>
                    <MaterialCommunityIcons name="briefcase-check" size={14} color="#4CAF50" />
                    <Text style={styles.businessBadgeText}>Business Account</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.profileRight}>
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Personal Account Items - Always Shown */}
          <View style={styles.gridSection}>
            <View style={styles.sectionHeader}>
              <Icon name="person-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Personal Settings
              </Text>
            </View>
            <View style={styles.gridContainer}>
              {personalItems.map((item, index) => renderGridItem(item, index))}
            </View>
          </View>

          {/* Business Features - Only shown if user has business profile */}
          {hasBusinessProfile && (
            <>
              {/* Business Categories */}
              <View style={[styles.categoriesContainer, { backgroundColor: colors.card || colors.surface }]}>
                <FlatList
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={item => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>

              {/* Business Features Grid */}
              <View style={styles.gridSection}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="briefcase-outline" size={20} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Business Features
                  </Text>
                </View>
                <FlatList
                  data={getFilteredBusinessItems()}
                  renderItem={renderBusinessCard}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  contentContainerStyle={styles.businessListContent}
                  columnWrapperStyle={styles.businessColumnWrapper}
                  scrollEnabled={false}
                />
              </View>
            </>
          )}

          {/* Quick Settings */}
          <View style={[styles.settingsContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}>
            <View style={styles.sectionHeader}>
              <Icon name="settings-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Quick Settings
              </Text>
            </View>
            
            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Icon name="notifications-outline" size={22} color={colors.text} />
                <Text style={[styles.toggleLabel, { color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.toggleDivider, { backgroundColor: colors.border }]} />

            <View style={styles.toggleItem}>
              <View style={styles.toggleInfo}>
                <Icon name="moon-outline" size={22} color={colors.text} />
                <Text style={[styles.toggleLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            style={[styles.signOutButton, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Sign Out', 
                    style: 'destructive',
                    onPress: async () => {
                      // Clear all cache on sign out
                      await AsyncStorage.multiRemove([
                        CACHE_KEYS.BUSINESS_PROFILE,
                        CACHE_KEYS.USER_DATA,
                        CACHE_KEYS.LAST_FETCH,
                        'userToken',
                        'userData',
                      ]);
                      navigation.replace('Signin');
                    }
                  }
                ]
              );
            }}
          >
            <Icon name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.version, { color: colors.textSecondary }]}>
            Version 2.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Modals (same as before) */}
      {/* ... */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
  },
  profileRight: {
    alignItems: 'flex-end',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
  },
  businessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  businessBadgeText: {
    fontSize: 11,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
  },
  // Grid Section
  gridSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: (width - 42) / 2,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  gridIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  // Business Card
  businessListContent: {
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  businessColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  businessCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  cardIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  businessCardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Categories
  categoriesContainer: {
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 16,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Quick Settings
  settingsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  toggleDivider: {
    marginVertical: 8,
    height: 1,
  },
  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});

export default AccountDashboard;