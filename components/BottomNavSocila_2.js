import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// ─── Welcome Modal Component ──────────────────────────────────────────────
const WelcomeModal = ({ visible, onGetStarted, onClose, isBusiness }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.welcomeOverlay}>
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.welcomeClose}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.welcomeIconContainer}>
            <LottieView
              source={require("../assets/animations/Chat.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
          </View>

          <Text style={styles.welcomeTitle}>
            Welcome to eChat!
          </Text>

          <Text style={styles.welcomeSubtitle}>
            {isBusiness 
              ? 'Connect with customers and grow your business'
              : 'Connect with friends and share your moments'
            }
          </Text>

          <View style={styles.welcomeFeatures}>
            <View style={styles.welcomeFeature}>
              <Icon name="chatbubble-ellipses" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Engage with your audience in real-time'
                  : 'Chat with friends and family'
                }
              </Text>
            </View>
            <View style={styles.welcomeFeature}>
              <Icon name="notifications" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Get instant notifications for leads'
                  : 'Stay updated with notifications'
                }
              </Text>
            </View>
            <View style={styles.welcomeFeature}>
              <Icon name="shield-checkmark" size={20} color="#0d64dd" />
              <Text style={styles.welcomeFeatureText}>
                {isBusiness 
                  ? 'Secure business communications'
                  : 'Secure and private conversations'
                }
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isBusiness ? ['#0d64dd', '#0432ff'] : ['#0432ff', '#0d64dd']}
              style={styles.welcomeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.welcomeButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Main BottomNav Component ────────────────────────────────────────────
const BottomNav = ({ navigation, setShowAccountModal, activeRoute = 'Chats' }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [userProfile, setUserProfile] = useState(null);
  const [accountMode, setAccountMode] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [chatPulseAnim] = useState(new Animated.Value(1));
  
  // FORCE Chat to be the active route
  const [currentActiveRoute, setCurrentActiveRoute] = useState('Chats');

  useEffect(() => {
    initializeApp();
    startChatPulseAnimation();
    
    // Force navigate to Chats on mount
    setTimeout(() => {
      navigateToChats();
    }, 300);
  }, []);

  // ─── Chat Pulse Animation ──────────────────────────────────────────────
  const startChatPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(chatPulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(chatPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // ─── Initialize App - Check Cache First ──────────────────────────────────
  const initializeApp = async () => {
    setIsCheckingProfile(true);
    try {
      const cachedHasBusiness = await AsyncStorage.getItem('hasBusinessProfile');
      const cachedProfile = await AsyncStorage.getItem('businessProfile');
      const cachedAccountMode = await AsyncStorage.getItem('accountMode');

      if (cachedHasBusiness !== null && cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        const hasBusiness = cachedHasBusiness === 'true';
        
        setHasBusinessProfile(hasBusiness);
        setUserProfile(profile);
        setAccountMode(cachedAccountMode || 'personal');
        setIsCheckingProfile(false);
        return;
      }

      await checkBusinessProfile();
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      await checkBusinessProfile();
    } finally {
      setIsCheckingProfile(false);
    }
  };

  // ─── Check Business Profile and Cache ────────────────────────────────────
  const checkBusinessProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setIsCheckingProfile(false);
        return;
      }

      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = response.data;
        const hasProfile = profile && profile.id && profile.name && profile.name.trim() !== '';
        
        await AsyncStorage.setItem('businessProfile', JSON.stringify(profile));
        await AsyncStorage.setItem('hasBusinessProfile', hasProfile ? 'true' : 'false');
        
        setHasBusinessProfile(hasProfile);
        setUserProfile(profile);
      } else {
        await AsyncStorage.setItem('hasBusinessProfile', 'false');
        await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
        setHasBusinessProfile(false);
        setUserProfile(null);
      }
    } catch (err) {
      console.log('❌ Error fetching business profile:', err);
      setHasBusinessProfile(false);
      setUserProfile(null);
      await AsyncStorage.setItem('hasBusinessProfile', 'false');
      await AsyncStorage.setItem('businessProfile', JSON.stringify(null));
    }
  };

  // ─── Check if First Chat Visit ──────────────────────────────────────────
  const checkIfFirstChatVisit = async () => {
    try {
      const hasVisitedChat = await AsyncStorage.getItem('hasVisitedChat');
      if (!hasVisitedChat) {
        setShowWelcomeModal(true);
        await AsyncStorage.setItem('hasVisitedChat', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking chat visit:', error);
      return false;
    }
  };

  // ─── Navigate to Chats ──────────────────────────────────────────────────
  const navigateToChats = () => {
    setCurrentActiveRoute('Chats');
    if (hasBusinessProfile && userProfile && userProfile.id) {
      navigation.navigate('BusinessHome');
    } else {
      navigation.navigate('PHome');
    }
  };

  // ─── Handle Chats Press ──────────────────────────────────────────────────
  const handleChatsPress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const isFirstVisit = await checkIfFirstChatVisit();
      
      if (isFirstVisit) {
        setIsLoading(false);
        return;
      }

      navigateToChats();
      
    } catch (error) {
      console.error('❌ Error navigating to chats:', error);
      navigation.navigate('PHome');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle Get Started from Welcome Modal ─────────────────────────────
  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    setTimeout(() => {
      navigateToChats();
    }, 300);
  };

  // ─── Handle Profile Press ──────────────────────────────────────────────
  const handleProfilePress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const mode = await AsyncStorage.getItem('accountMode');
      
      if (mode === 'personal' || !mode) {
        navigation.navigate('UserPersonalAccountProfile');
      } else {
        if (hasBusinessProfile && userProfile && userProfile.id) {
          navigation.navigate('BusinessProfile');
        } else {
          navigation.navigate('BusinessSetup');
        }
      }
    } catch (error) {
      console.error('Error navigating to profile:', error);
      navigation.navigate('UserPersonalAccountProfile');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render Profile Icon ─────────────────────────────────────────────────
  const renderProfileIcon = (isActive) => {
    const iconColor = isActive ? colors.primary : colors.icon;
    return (
      <Icon 
        name={isActive ? 'person' : 'person-outline'} 
        size={24} 
        color={iconColor} 
      />
    );
  };

  // ─── Get Bottom Padding ─────────────────────────────────────────────────
  const getBottomPadding = () => {
    if (Platform.OS === 'ios') {
      return Math.max(insets.bottom, 8);
    }
    return Math.max(insets.bottom, 0);
  };

  // ─── Check if Chat is Active ──────────────────────────────────────────
  // Force Chat to always be considered active
  const isChatActive = true;

  return (
    <>
      <View 
        style={[
          styles.container,
          { paddingBottom: getBottomPadding() }
        ]}
      >
        <View style={[
          styles.navContainer,
          { 
            backgroundColor: colors.surface || '#FFFFFF',
            borderTopColor: colors.border || 'rgba(0,0,0,0.05)',
          }
        ]}>
          {/* Enhanced Shadow Layer */}
          <View style={styles.shadowLayer} />
          
          {/* Left Items - Home & Explore */}
          <View style={styles.leftItems}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                setCurrentActiveRoute('Home');
                navigation.navigate('BroadcastHome');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name='home-outline' 
                  size={24} 
                  color='#000'
                />
              </View>
              <Text style={[
                styles.navLabel,
                
              ]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                setCurrentActiveRoute('Explore');
                navigation.navigate('ExplorePost');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name={currentActiveRoute === 'Explore' ? 'compass' : 'compass-outline'} 
                  size={24} 
                  color={currentActiveRoute === 'Explore' ? colors.primary : colors.icon} 
                />
              </View>
              <Text style={[
                styles.navLabel,
                { color: currentActiveRoute === 'Explore' ? colors.primary : colors.icon }
              ]}>
                Explore
              </Text>
            </TouchableOpacity>
          </View>

          {/* Center Button */}
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => setShowAccountModal(true)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark || colors.primary]}
              style={styles.centerButtonGradient}
            >
              <MaterialCommunityIcons 
                name="swap-horizontal-circle" 
                size={28} 
                color="#FFF" 
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Right Items - Chats & Profile */}
          <View style={styles.rightItems}>
            <TouchableOpacity
              style={[styles.navItem, styles.chatNavItem]}
              onPress={handleChatsPress}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={styles.chatWraspper}>
                <View style={styles.chatIconaWrapper}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      
                        <Icon 
                          name={'chatbubble-ellipses'} 
                          size={28} 
                          color={colors.primary} 
                        />
                     
                    </>
                  )}
                </View>
              </View>
              <Text style={[
                styles.navLabel,
                styles.chatLabel,
                { 
                  color: colors.primary,
                  fontWeight: '700',
                  fontSize: 11,
                }
              ]}>
                Chats
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {renderProfileIcon(currentActiveRoute === 'Profile')}
              </View>
              <Text style={[
                styles.navLabel,
                { color: currentActiveRoute === 'Profile' ? colors.primary : colors.icon }
              ]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Welcome Modal */}
      <WelcomeModal
        visible={showWelcomeModal}
        onGetStarted={handleGetStarted}
        onClose={() => setShowWelcomeModal(false)}
        isBusiness={hasBusinessProfile}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 0,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: -4 
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    borderTopWidth: 0.5,
  },
  shadowLayer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  leftItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  rightItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  chatNavItem: {
    minWidth: 70,
    position: 'relative',
    paddingHorizontal: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontFamily: 'SourceSansPro-Medium',
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  centerButton: {
    position: 'absolute',
    top: -24,
    left: width / 2 - 30,
    zIndex: 100,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },

  // ── Chat Specific Styles ──────────────────────────────────────────────
  chatWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconConstainer: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 2.5,
  },
  chatIconActive: {
    borderRadius: 16,
    padding: 8,
    borderWidth: 2.5,
  },
  chatGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    opacity: 0.3,
    top: -6,
    left: -6,
  },
  chatLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // ── Welcome Modal Styles ──────────────────────────────────────────────
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  welcomeClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  welcomeIconContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: -30,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  welcomeFeatures: {
    width: '100%',
    marginBottom: 24,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  welcomeFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  welcomeButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  welcomeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  welcomeButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BottomNav;