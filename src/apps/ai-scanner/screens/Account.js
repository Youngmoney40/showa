
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletScreen = ({ navigation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAmountVisible, setIsAmountVisible] = useState(true);
  const flipAnimation = useState(new Animated.Value(0))[0];

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const toggleAmountVisibility = () => {
    setIsAmountVisible(!isAmountVisible);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Sample user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+234 812 345 6789',
    membership: 'Premium User',
    joinDate: 'Jan 15, 2024',
    totalScans: 47,
    scansThisMonth: 12,
  };

  const scanPacks = [
    { id: 1, scans: 5, price: 200, originalPrice: 250, popular: true },
    { id: 2, scans: 10, price: 350, originalPrice: 500, popular: false },
    { id: 3, scans: 20, price: 600, originalPrice: 1000, popular: false },
    { id: 4, scans: 50, price: 1200, originalPrice: 2500, popular: false },
  ];

  const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          // Remove token after user confirms
          await AsyncStorage.removeItem("access_token");
          navigation.reset({
            index: 0,
            routes: [{ name: 'AiLogin' }],
          });
        }
      },
    ]
  );
};


  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out LordBetAI - AI-powered bet slip analysis that helps you win smarter! Download now: [App Store Link]',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Email: support@lordai.com\nPhone: +234 900 LORDAI');
  };

  const AccountSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text style={[styles.sectionTitle,{marginBottom:10}]}>Account & Settings</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('AiProfileInfo', { userData })}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(36, 173, 12, 0.1)' }]}>
              <Icon name="person-outline" size={20} color="#24ad0c" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Profile Information</Text>
              <Text style={styles.settingSubtitle}>View and edit your personal details</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={()=>navigation.navigate('AiNotifications')}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(36, 173, 12, 0.1)' }]}>
              <Icon name="notifications-outline" size={20} color="#24ad0c" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Manage your alert preferences</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={()=>navigation.navigate('AiPrivacy')}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(36, 173, 12, 0.1)' }]}>
              <Icon name="shield-checkmark-outline" size={20} color="#24ad0c" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
              <Text style={styles.settingSubtitle}>Control your data and security</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleShareApp}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(36, 173, 12, 0.1)' }]}>
              <Icon name="share-social-outline" size={20} color="#24ad0c" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Share BetScan</Text>
              <Text style={styles.settingSubtitle}>Invite friends and earn rewards</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleContactSupport}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(36, 173, 12, 0.1)' }]}>
              <Icon name="help-circle-outline" size={20} color="#24ad0c" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get help with the app</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
              <Icon name="log-out-outline" size={20} color="#FF4444" />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: '#FF4444' }]}>Logout</Text>
              <Text style={styles.settingSubtitle}>Sign out of your account</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name='arrow-back' size={28} color='#FFFFFF' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet & Account</Text>
         
        </View>

        {/* Enhanced Wallet Balance Card */}
        <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
          <View style={styles.cardContainer}>
            {/* Front Side of Card - Wallet Balance */}
            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
              <LinearGradient
                // colors={['#24ad0cff', '#269313ff', '#24ad0cff']}
                style={styles.gradientCard}
                // start={{ x: 0, y: 0 }}
                // end={{ x: 1, y: 1 }}

                colors={['#24ad0cff', '#01b461ff', '#24ad0cff']}
             
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              >
                <View style={styles.walletCard}>
                  {/* Card Header */}
                  <View style={[styles.cardHeader,{marginTop:-6}]}>
                    <View style={[styles.walletIconContainer,{backgroundColor:'#ffffff',padding:6,borderRadius:8}]}>
                      <Icon name="wallet-outline" size={24} color="#000" />
                      <Text style={styles.walletText}>L-WALLET</Text>
                    </View>
                    <View style={styles.scanCount}>
                      <Icon name="analytics" size={16} color="#FFFFFF" />
                      <Text style={styles.scanCountText}>{userData.scansThisMonth} scans this month</Text>
                    </View>
                  </View>

                  {/* Balance Display */}
                  <View style={[styles.balanceMainContainer,{marginTop:-15}]}>
                    <Text style={[styles.balanceLabel,{marginTop:0}]}>Available Balance</Text>
                    <View style={styles.balanceRow}>
                      <Text style={styles.balanceCurrency}>₦</Text>
                      {isAmountVisible ? (
                        <Text style={[styles.balanceAmount,{fontWeight:'bold'}]}>32,450</Text>
                      ) : (
                        <View style={styles.hiddenAmount}>
                          <Text style={styles.hiddenAmountText}>•••••</Text>
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleAmountVisibility();
                        }}
                      >
                        <Icon 
                          name={isAmountVisible ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color="#000000" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Quick Stats */}
                  <View style={[styles.statsContainer,{marginTop:-30}]}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>₦50</Text>
                      <Text style={styles.statLabel}>Per Scan</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userData.totalScans}</Text>
                      <Text style={styles.statLabel}>Total Scans</Text>
                    </View>
                  </View>

                  <Text style={styles.flipHint}>Tap card to flip →</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Back Side of Card - Gradient Black */}
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <LinearGradient
                colors={['#000000', '#1a1a1a', '#000000']}
                style={styles.gradientCardBack}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.backCard}>
                  <Icon name="card" size={50} color="#24ad0c" />
                  <Text style={styles.backCardText}>LORDBETAI CARD</Text>
                  <Text style={styles.backCardSubtext}>Premium Member</Text>
                  <Text style={styles.flipHintBack}>← Tap to return</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AiTopUpWallet')}
          >
            <LinearGradient
              colors={['#24ad0c', '#1a8a08']}
              style={styles.actionIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="add" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AiPaymentHistory')}
          >
            <LinearGradient
              colors={['#24ad0c', '#1a8a08']}
              style={styles.actionIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="time" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Analysis')}
          >
            <LinearGradient
              colors={['#24ad0c', '#1a8a08']}
              style={styles.actionIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="scan" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionText}>Scan Now</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <AccountSettingsSection />
        
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -40
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginLeft: 16,
    
  },
  profileButton: {
    padding: 8,
  },
  // Enhanced Card Styles
  cardContainer: {
    height: 240,
    marginBottom: 24,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 20,
  },
  gradientCardBack: {
    flex: 1,
    borderRadius: 20,
  },
  walletCard: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
  },
  backCard: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backCardText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24ad0c',
    marginTop: 10,
    marginBottom: 5,
  },
  backCardSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  // Front Card Styles
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  scanCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  scanCountText: {
    fontSize: 10,
    color: '#000',
    marginLeft: 4,
    fontWeight: '600',
  },
  balanceMainContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
    fontWeight: '500',

  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceCurrency: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  hiddenAmount: {
    marginRight: 8,
  },
  hiddenAmountText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 4,
  },
  eyeButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 8, 8, 0.12)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#000',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  flipHint: {
    fontSize: 10,
    color: '#000',
    opacity: 0.7,
    textAlign: 'center',
  },
  flipHintBack: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Settings Section
  settingsSection: {
    marginBottom: 32,
  },
  settingsList: {
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  // Packages Section
  packagesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  packagesGrid: {
    gap: 12,
  },
  packageCard: {
    padding: 16,
    borderRadius: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#222222',
    
  },
  popularPackage: {
    borderColor: '#24ad0c',
    borderRadius: 12,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#24ad0c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },
  packageScans: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#CCCCCC',
    textDecorationLine: 'line-through',
  },
  saveText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginBottom: 4,
    fontWeight: '600',
  },
  perScanText: {
    fontSize: 11,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#24ad0c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  // Activity Section
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    backgroundColor: '#111111',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666666',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF4444',
  },
  creditAmount: {
    color: '#24ad0c',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24ad0c',
  },
});

export default WalletScreen;