import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, RefreshControl, ActivityIndicator,
   Animated, Dimensions, Modal,
   Alert, Linking,
   Platform, StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../../api_routing/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const createApiService = () => {
  const baseURL = `${API_ROUTE}`;
  
  const api = {
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    defaults: {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  api.request = async (config) => {
    try {
      const mergedConfig = {
        ...api.defaults,
        ...config,
        headers: {
          ...api.defaults.headers,
          ...config.headers,
        },
      };

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        mergedConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);
      
      const response = await fetch(
        `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
        {
          method: mergedConfig.method || 'GET',
          headers: mergedConfig.headers,
          body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
  api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

  return api;
};

const api = createApiService();

const EarnTasksScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeFadeAnim] = useState(new Animated.Value(0));
  const [welcomeScaleAnim] = useState(new Animated.Value(0.8));
  
  const { colors, theme, isDark } = useTheme();

  useEffect(() => {
    checkFirstVisit();
    fetchEarnData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (welcomeVisible) {
      Animated.parallel([
        Animated.timing(welcomeFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(welcomeScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [welcomeVisible]);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedEarnScreen');
      if (!hasVisited) {
        setWelcomeVisible(true);
        await AsyncStorage.setItem('hasVisitedEarnScreen', 'true');
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
    }
  };

  const fetchEarnData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/earn/enhanced/');
      setTasks(response.data.tasks);
      setStats(response.data.stats);
      
      if (response.data.stats) {
        setDailyProgress((response.data.stats.coins_today / response.data.stats.daily_cap) * 100);
        setWeeklyProgress((response.data.stats.coins_this_week / response.data.stats.weekly_cap) * 100);
      }
    } catch (error) {
      console.error('Error fetching earn data:', error);
      Alert.alert('Error', 'Failed to load earn tasks. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEarnData();
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const navigateToSection = (section) => {
    switch(section) {
      case 'videos':
        navigation.navigate('ShortVideos');
        break;
      case 'posts':
        navigation.navigate('CreatePost');
        break;
      case 'messages':
        navigation.navigate('Chat');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'business':
        navigation.navigate('BusinessProfile');
        break;
      default:
        break;
    }
  };

  const getTaskIcon = (taskType) => {
    switch(taskType) {
      case 'daily': return 'calendar-today';
      case 'engagement': return 'trending-up';
      case 'content': return 'create';
      case 'profile': return 'person';
      case 'verification': return 'verified-user';
      case 'business': return 'business';
      default: return 'monetization-on';
    }
  };

  const getTaskColor = (taskType) => {
    switch(taskType) {
      case 'daily': return '#4CAF50';
      case 'engagement': return '#FF9800';
      case 'content': return '#9C27B0';
      case 'profile': return '#00BCD4';
      case 'verification': return '#3F51B5';
      case 'business': return '#607D8B';
      default: return colors.primary;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const CustomProgressBar = ({ progress, color, style }) => {
    return (
      <View style={[styles.customProgressBarContainer, style]}>
        <View style={[
          styles.customProgressBarFill, 
          { 
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            backgroundColor: color || colors.primary
          }
        ]} />
      </View>
    );
  };

  const WelcomePopup = () => (
    <Modal
      transparent={true}
      visible={welcomeVisible}
      animationType="none"
      onRequestClose={() => setWelcomeVisible(false)}
    >
      <View style={[styles.welcomeOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: welcomeFadeAnim,
              transform: [{ scale: welcomeScaleAnim }],
              backgroundColor: colors.surface
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark || colors.primary]}
            style={styles.welcomeHeader}
          >
            <View style={[styles.welcomeIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Icon name="monetization-on" size={50} color="#FFD700" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to Earn!</Text>
            <Text style={styles.welcomeSubtitle}>Start Making Money with Showa</Text>
          </LinearGradient>

          <ScrollView style={styles.welcomeContent} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? '#4CAF5030' : '#4CAF5020' }]}>
                <Icon name="auto-awesome" size={24} color="#4CAF50" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Auto-Earn System</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Earn coins automatically while using Showa normally. No extra steps needed!
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? '#2196F330' : '#2196F320' }]}>
                <Icon name="trending-up" size={24} color="#2196F3" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Multiple Earning Ways</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Watch videos, create posts, chat, and more - everything earns you money!
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? '#FF980030' : '#FF980020' }]}>
                <Icon name="attach-money" size={24} color="#FF9800" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Real Cash Withdrawals</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Convert coins to real money via PayPal, bank transfer, or mobile money.
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
                <Icon name="security" size={24} color="#9C27B0" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Secure & Reliable</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Your earnings are safe and withdrawals are processed quickly.
                </Text>
              </View>
            </View>

            <View style={[styles.earningsPreview, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.earningsTitle, { color: colors.text }]}>Quick Earnings Preview</Text>
              <View style={styles.earningsGrid}>
                <View style={[styles.earningItem, { backgroundColor: colors.surface }]}>
                  <Icon name="play-arrow" size={20} color="#2196F3" />
                  <Text style={[styles.earningText, { color: colors.text }]}>Watch Video</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
                <View style={[styles.earningItem, { backgroundColor: colors.surface }]}>
                  <Icon name="favorite" size={20} color="#E91E63" />
                  <Text style={[styles.earningText, { color: colors.text }]}>Like Post</Text>
                  <Text style={styles.earningReward}>+0.5 coins</Text>
                </View>
                <View style={[styles.earningItem, { backgroundColor: colors.surface }]}>
                  <Icon name="create" size={20} color="#9C27B0" />
                  <Text style={[styles.earningText, { color: colors.text }]}>Create Post</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
                <View style={[styles.earningItem, { backgroundColor: colors.surface }]}>
                  <Icon name="message" size={20} color="#00BCD4" />
                  <Text style={[styles.earningText, { color: colors.text }]}>Send Message</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
              </View>
            </View>

            <View style={[styles.dailyLimitCard, { backgroundColor: isDark ? '#2E7D3220' : '#E8F5E9' }]}>
              <View style={styles.limitHeader}>
                <Icon name="today" size={22} color="#4CAF50" />
                <View style={styles.limitTexts}>
                  <Text style={[styles.limitTitle, { color: isDark ? '#A5D6A7' : '#2E7D32' }]}>Daily Earnings Limit</Text>
                  <Text style={[styles.limitAmount, { color: '#4CAF50' }]}>Up to {stats?.daily_cap || 50} coins/day</Text>
                </View>
              </View>
              <Text style={[styles.limitNote, { color: colors.textSecondary }]}>
                That's ≈ {formatCurrency((stats?.daily_cap || 50) * (stats?.exchange_rate || 0.01))} per day!
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.welcomeFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => setWelcomeVisible(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark || colors.primary]}
                style={styles.gradientButton}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Icon name="arrow-forward" size={22} color="#fff" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => setWelcomeVisible(false)}
            >
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Maybe Later</Text>
            </TouchableOpacity>
            <Text style={[styles.welcomeFooterNote, { color: colors.textTertiary }]}>
              💡 Pro Tip: Check back daily for streak bonuses!
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : (Platform.OS === 'android' ? 'light-content' : 'light-content')}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />
      <WelcomePopup />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark || colors.primary]}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Earn On Showa</Text>
            
          </View>
          <TouchableOpacity 
            style={styles.walletButton}
            onPress={() => navigation.navigate('EarningWallet')}
          >
            <Icon name="account-balance-wallet" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Banner */}
        <Animated.View 
          style={[
            styles.statsBanner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            <Text style={[{alignContent:'center', textAlign:'center', fontSize:17, fontWeight:'400', marginBottom:10}, { color: colors.text }]}>
              Track, manage, and grow your income
            </Text>
            <Text style={[styles.statsTitle, { color: colors.text }]}>Your Earnings Dashboard</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Icon name="monetization-on" size={24} color="#FFD700" />
                <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.coins_total || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Coins</Text>
              </View>
              
              <View style={[styles.statBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Icon name="attach-money" size={24} color="#4CAF50" />
                <Text style={[styles.statNumber, { color: colors.text }]}>{formatCurrency(stats?.usd_total)}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Value</Text>
              </View>
              
              <View style={[styles.statBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Icon name="whatshot" size={24} color="#FF5722" />
                <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.streak || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
              </View>
              
              <View style={[styles.statBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Icon name="trending-up" size={24} color="#2196F3" />
                <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.coins_today || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Coins</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* How It Works Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <View style={styles.infoHeader}>
            <Icon2 name="lightbulb" size={22} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.text }]}>How Earning Works</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.text }]}>
            💡 <Text style={[styles.infoBold, { color: colors.primary }]}>Earn automatically</Text> while using Showa! Coins are awarded in the background when you:
          </Text>
          
          <View style={styles.infoPoints}>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.pointText, { color: colors.text }]}>Watch videos (10+ seconds)</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.pointText, { color: colors.text }]}>Like & comment on posts</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.pointText, { color: colors.text }]}>Send and reply to messages</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.pointText, { color: colors.text }]}>Create posts and content</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.pointText, { color: colors.text }]}>Follow other users</Text>
            </View>
          </View>
        </View>

        {/* Daily & Weekly Progress */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
            <View style={styles.progressHeader}>
              <Icon name="today" size={22} color="#4CAF50" />
              <View style={styles.progressTitleContainer}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>Daily Progress</Text>
                <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                  {stats?.coins_today || 0}/{stats?.daily_cap || 50} coins
                </Text>
              </View>
            </View>
            <CustomProgressBar 
              progress={dailyProgress / 100} 
              color="#4CAF50"
            />
            <Text style={[styles.progressTip, { color: colors.textSecondary }]}>
              Complete daily tasks to earn up to {stats?.daily_cap || 50} coins per day
            </Text>
          </View>
          
          <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
            <View style={styles.progressHeader}>
              <Icon name="date-range" size={22} color="#2196F3" />
              <View style={styles.progressTitleContainer}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>Weekly Progress</Text>
                <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                  {stats?.coins_this_week || 0}/{stats?.weekly_cap || 250} coins
                </Text>
              </View>
            </View>
            <CustomProgressBar 
              progress={weeklyProgress / 100} 
              color="#2196F3"
            />
            <Text style={[styles.progressTip, { color: colors.textSecondary }]}>
              Weekly limit: {stats?.weekly_cap || 250} coins ({formatCurrency((stats?.weekly_cap || 250) * (stats?.exchange_rate || 0.01))})
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Earn Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('VideoAds')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#2196F330' : '#2196F320' }]}>
                <Icon name="ondemand-video" size={28} color="#2196F3" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Watch Videos</Text>
              <Text style={styles.actionReward}>+1 coin per video</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>15 videos/day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('CreateBroadcastPost')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
                <Icon name="create" size={28} color="#9C27B0" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Create Posts</Text>
              <Text style={styles.actionReward}>+1 coin per post</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>5 posts/day</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('NinRegisterEarning')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
                <Icon name="create" size={28} color="#9C27B0" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Verify identity</Text>
              <Text style={styles.actionReward}>+700 coin per verification</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>0ne time</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('PurchaseData')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
                <Icon name="create" size={28} color="#9C27B0" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Purchase Data</Text>
              <Text style={styles.actionReward}>+70 coin per verification</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>constact reward</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              // onPress={() => navigateToSection('messages')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#FF980030' : '#FF980020' }]}>
                <Icon name="message" size={28} color="#FF9800" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Send Messages</Text>
              <Text style={styles.actionReward}>+1 coin per reply</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>10 replies/day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              // onPress={() => navigateToSection('profile')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? '#00BCD430' : '#00BCD420' }]}>
                <Icon name="person" size={28} color="#00BCD4" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Complete Profile</Text>
              <Text style={styles.actionReward}>+5 coins</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>One-time reward</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* All Earning Opportunities */}
        <View style={styles.opportunitiesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Earning Opportunities</Text>
          
          {/* Daily Tasks */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#4CAF5030' : '#4CAF5020' }]}>
                <Icon name="calendar-today" size={20} color="#4CAF50" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Daily Rewards</Text>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#4CAF5020' : '#E3F2FD' }]}>
                <Text style={[styles.categoryBadgeText, { color: '#2196F3' }]}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="brightness-5" size={18} color="#4CAF50" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Daily Login</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+3 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.03)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="trending-up" size={18} color="#FF9800" />
                  <Text style={[styles.taskName, { color: colors.text }]}>7-Day Streak</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Video Watching */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#2196F330' : '#2196F320' }]}>
                <Icon name="ondemand-video" size={20} color="#2196F3" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Watch & Earn</Text>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#2196F330' : '#E3F2FD' }]}>
                <Text style={[styles.categoryBadgeText, { color: '#2196F3' }]}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="play-arrow" size={18} color="#2196F3" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Watch Video (10+ seconds)</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="check-circle" size={18} color="#4CAF50" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Watch Full Video</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.categoryNote, { color: colors.textSecondary }]}>Earn automatically while watching Short Videos</Text>
          </View>

          {/* Social Engagement */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#FF980030' : '#FF980020' }]}>
                <Icon name="thumb-up" size={20} color="#FF9800" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Social Engagement</Text>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#FF980030' : '#E3F2FD' }]}>
                <Text style={[styles.categoryBadgeText, { color: '#2196F3' }]}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="favorite" size={18} color="#E91E63" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Like Posts</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+0.5 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.005)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="comment" size={18} color="#2196F3" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Comment on Posts</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="person-add" size={18} color="#4CAF50" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Follow Users</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.categoryNote, { color: colors.textSecondary }]}>Earn automatically when you engage with content</Text>
          </View>

          {/* Content Creation */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#9C27B030' : '#9C27B020' }]}>
                <Icon name="create" size={20} color="#9C27B0" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Content Creation</Text>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#9C27B030' : '#E3F2FD' }]}>
                <Text style={[styles.categoryBadgeText, { color: '#2196F3' }]}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="post-add" size={18} color="#9C27B0" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Create Post</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="videocam" size={18} color="#2196F3" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Create Short Video</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+2 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.02)}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.categoryNote, { color: colors.textSecondary }]}>Earn automatically when you create content</Text>
          </View>

          {/* Messaging */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#00BCD430' : '#00BCD420' }]}>
                <Icon name="message" size={20} color="#00BCD4" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Messaging</Text>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#00BCD430' : '#E3F2FD' }]}>
                <Text style={[styles.categoryBadgeText, { color: '#2196F3' }]}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="send" size={18} color="#00BCD4" />
                  <Text style={[styles.taskName, { color: colors.text }]}>First Message to New Contact</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="reply" size={18} color="#FF9800" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Reply in Conversation</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="business" size={18} color="#607D8B" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Business Reply (Business Mode)</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+2 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.02)}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.categoryNote, { color: colors.textSecondary }]}>Earn automatically when you chat with others</Text>
          </View>

          {/* Account & Verification */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#3F51B530' : '#3F51B520' }]}>
                <Icon name="verified-user" size={20} color="#3F51B5" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Account & Verification</Text>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.taskInfo}
                  onPress={() => navigateToSection('profile')}
                >
                  <Icon name="person" size={18} color="#00BCD4" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Complete Profile</Text>
                </TouchableOpacity>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+5 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.05)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="email" size={18} color="#FF9800" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Verify Email</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+5 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.05)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="phone" size={18} color="#4CAF50" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Verify Phone</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Business Features */}
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#607D8B30' : '#607D8B20' }]}>
                <Icon name="business" size={20} color="#607D8B" />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>Business Features</Text>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.taskInfo}
                  onPress={() => navigateToSection('business')}
                >
                  <Icon name="store" size={18} color="#607D8B" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Create Business Catalog</Text>
                </TouchableOpacity>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="verified" size={18} color="#4CAF50" />
                  <Text style={[styles.taskName, { color: colors.text }]}>Business Account Verified</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+20 coins</Text>
                  <Text style={[styles.taskValue, { color: colors.textSecondary }]}>≈ {formatCurrency(0.20)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        
       {/* Withdrawal Info */}
      <View style={styles.withdrawalSection}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark || colors.primary]}
          style={styles.withdrawalCard}
        >
          <Icon name="account-balance" size={40} color="#fff" style={styles.withdrawalIcon} />
          <Text style={styles.withdrawalTitle}>Ready to Cash Out?</Text>
          <Text style={styles.withdrawalAmount}>
            {formatCurrency(stats?.usd_available || 0)} available
          </Text>
          
          <View style={[styles.withdrawalInfo, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            <View style={styles.infoRow}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Minimum: {formatCurrency((stats?.withdrawal?.minimum_usd || 1))}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Exchange Rate: 1 coin = {formatCurrency(stats?.exchange_rate || 0.01)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Withdrawal Fee: {stats?.withdrawal?.fee_percent || 5}%</Text>
            </View>
          </View>
          
          {/* Updated Withdraw Button */}
          <TouchableOpacity 
            style={[
              styles.withdrawButton, 
              { 
                backgroundColor: (stats?.usd_available || 0) <= 0 ? '#cccccc' : '#fff',
                opacity: (stats?.usd_available || 0) <= 0 ? 0.6 : 1
              }
            ]}
            onPress={() => {
              if ((stats?.usd_available || 0) > 0) {
                navigation.navigate('WithdrawEarning');
              } else {
                Alert.alert(
                  'No Funds Available',
                  'You need to earn more coins before you can withdraw. Complete tasks to earn coins!',
                  [{ text: 'OK' }]
                );
              }
            }}
            disabled={(stats?.usd_available || 0) <= 0}
          >
            <Text style={[
              styles.withdrawButtonText, 
              { color: (stats?.usd_available || 0) <= 0 ? '#666666' : colors.primary }
            ]}>
              {(stats?.usd_available || 0) <= 0 ? 'No Funds Available' : 'Withdraw Now'}
            </Text>
            {(stats?.usd_available || 0) > 0 && (
              <Icon name="arrow-forward" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          {/* Optional: Add a message when funds are zero */}
          {(stats?.usd_available || 0) <= 0 && (
            <View style={[styles.zeroFundsMessage, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Icon name="info" size={16} color="#FFD700" />
              <Text style={[styles.zeroFundsText, { color: '#fff', fontSize: 12, marginLeft: 5 }]}>
                Complete tasks above to earn coins
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>
          
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>How do I earn coins?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Coins are awarded automatically when you use Showa! Watch videos, like posts, send messages, create content - all these activities earn you coins in the background.
            </Text>
          </View>
          
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>What can I do with my coins?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Convert coins to real money! 100 coins = ${stats?.exchange_rate * 100 || 1.00}. Withdraw via PayPal, bank transfer, or mobile money.
            </Text>
          </View>
          
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>Are there limits?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Yes: {stats?.daily_cap || 50} coins daily, {stats?.weekly_cap || 250} coins weekly. Some tasks also have per-day limits.
            </Text>
          </View>
          
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>What are streaks?</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              Log in daily to maintain your streak! 7-day streak = +10 coins, 30-day streak = +30 coins bonus rewards.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.footerTitle, { color: colors.text }]}>Start Earning Today!</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Use Showa normally and watch your earnings grow automatically. The more you engage, the more you earn!
          </Text>
          <View style={styles.footerStats}>
            <View style={styles.footerStat}>
              <Icon name="timer" size={16} color={colors.textSecondary} />
              <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>Tasks refresh daily</Text>
            </View>
            <View style={styles.footerStat}>
              <Icon name="autorenew" size={16} color={colors.textSecondary} />
              <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>Auto-earn enabled</Text>
            </View>
            <View style={styles.footerStat}>
              <Icon name="security" size={16} color={colors.textSecondary} />
              <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>Secure withdrawals</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {selectedTask && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <View style={[
                    styles.modalIcon,
                    { backgroundColor: getTaskColor(selectedTask.type) + (isDark ? '30' : '20') }
                  ]}>
                    <Icon 
                      name={getTaskIcon(selectedTask.type)} 
                      size={30} 
                      color={getTaskColor(selectedTask.type)} 
                    />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedTask.title}</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>{selectedTask.description}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icon name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <View style={[styles.rewardCard, { backgroundColor: isDark ? '#FFF9C430' : '#FFF9C4' }]}>
                    <Icon name="monetization-on" size={28} color="#FFD700" />
                    <Text style={[styles.rewardAmount, { color: colors.text }]}>+{selectedTask.coins} coins</Text>
                    <Text style={[styles.rewardValue, { color: colors.textSecondary }]}>
                      ≈ {formatCurrency(selectedTask.usd_value || (selectedTask.coins * (stats?.exchange_rate || 0.01)))}
                    </Text>
                  </View>
                  
                  {selectedTask.max_per_day && (
                    <View style={[styles.limitCard, { backgroundColor: isDark ? '#2196F330' : '#E3F2FD' }]}>
                      <Icon name="info" size={20} color="#2196F3" />
                      <View style={styles.limitInfo}>
                        <Text style={[styles.limitTitle, { color: '#2196F3' }]}>Daily Limit</Text>
                        <Text style={[styles.limitText, { color: '#2196F3' }]}>
                          {selectedTask.max_per_day} times per day
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  <View style={[styles.instructionsCard, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.instructionsTitle, { color: colors.text }]}>How to Earn:</Text>
                    <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
                      This reward is awarded automatically when you perform this action in the app. No manual claiming needed!
                    </Text>
                    
                    {selectedTask.type === 'video' && (
                      <>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>1</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Go to Short Videos section</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>2</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Watch any video for 10+ seconds</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>3</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Coins awarded automatically</Text>
                        </View>
                      </>
                    )}
                    
                    {selectedTask.type === 'engagement' && (
                      <>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>1</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Browse posts in your feed</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>2</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Like, comment, or share posts</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>3</Text>
                          <Text style={[styles.stepText, { color: colors.text }]}>Coins awarded automatically</Text>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>
                
                <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                  <TouchableOpacity 
                    style={[styles.goButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setModalVisible(false);
                      if (selectedTask.type === 'video') navigateToSection('videos');
                      else if (selectedTask.type === 'content') navigateToSection('posts');
                      else if (selectedTask.type === 'messages') navigateToSection('messages');
                    }}
                  >
                    <Text style={styles.goButtonText}>Start Earning</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Welcome Popup Styles
  welcomeOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  welcomeHeader: {
    paddingVertical: Platform.OS === 'android'? 30 : 0,
    paddingHorizontal: Platform.OS === 'android'? 20 :20,
    alignItems: 'center',
  },
  welcomeIconCircle: {
    width: 80,
    marginTop:20,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom:20
  },
  welcomeContent: {
    maxHeight: height * 0.45,
    padding: 20,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  earningsPreview: {
    marginTop: 15,
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningItem: {
    width: '48%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  earningText: {
    fontSize: 12,
    marginVertical: 5,
    textAlign: 'center',
  },
  earningReward: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0d64dd',
  },
  dailyLimitCard: {
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitTexts: {
    marginLeft: 10,
    flex: 1,
  },
  limitTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  limitAmount: {
    fontSize: 13,
  },
  limitNote: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  welcomeFooter: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 15,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    padding:20,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 14,
  },
  welcomeFooterNote: {
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  withdrawButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 15,
  marginBottom: 20,
  borderRadius: 25,
  width: '90%',
},
withdrawButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 10,
},
zeroFundsMessage: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
  width: '90%',
},
zeroFundsText: {
  fontSize: 12,
  fontStyle: 'italic',
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  backButton: {
    padding: 5,
     marginHorizontal:20,
     marginTop:60
  },
  headerTitle: {
    fontSize: 27,
    paddingVertical:40,
    fontWeight: 'bold',
    color: '#fff',
    marginTop:50
  },
  walletButton: {
    marginHorizontal:20,
    marginTop:60
  },
  statsBanner: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    marginTop:10
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  infoPoints: {
    marginTop: 10,
  },
  infoPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  progressCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  progressTip: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  quickActions: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  actionReward: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  actionSub: {
    fontSize: 11,
  },
  opportunitiesSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  categoryCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskList: {
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  taskRewardInfo: {
    alignItems: 'flex-end',
  },
  taskCoins: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d64dd',
  },
  taskValue: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
  withdrawalSection: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  withdrawalCard: {
    borderRadius: 20,
    padding: Platform.OS === 'android' ? 24 : 0,
    alignItems: 'center',
  },
  withdrawalIcon: {
    marginBottom: 15,
    marginTop:20
  },
  withdrawalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  withdrawalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  withdrawalInfo: {
    borderRadius: 12,
    padding: 15,
    width: '90%',
    marginHorizontal:20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom:20,
    borderRadius: 25,
    width: '90%',
    
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  faqSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  faqItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  footerStats: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerStatText: {
    fontSize: 12,
    marginLeft: 5,
    padding:5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  rewardCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  rewardValue: {
    fontSize: 16,
  },
  limitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  limitInfo: {
    marginLeft: 12,
    flex: 1,
  },
  limitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  limitText: {
    fontSize: 13,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 15,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0d64dd',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    fontSize: 14,
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  goButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customProgressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  customProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default EarnTasksScreen;