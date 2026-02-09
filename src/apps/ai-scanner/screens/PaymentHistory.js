
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

const WalletScreen = ({ navigation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useState(new Animated.Value(0))[0];

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
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
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out BetScan - AI-powered bet slip analysis that helps you win smarter! Download now: [App Store Link]',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Email: support@betscan.com\nPhone: +234 900 BETSCAN');
  };

 

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
          <Text style={styles.headerTitle}>Recent Activity</Text>
          
        </View>

        

        {/* Quick Actions */}
        

        

        

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="checkmark-done" size={16} color="#24ad0c" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Bet Slip Analysis</Text>
                <Text style={styles.activityTime}>Chelsea vs Arsenal - 72% confidence</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityAmount}>-₦50</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="checkmark-done" size={16} color="#24ad0c" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Bet Slip Analysis</Text>
                <Text style={styles.activityTime}>Man City vs Liverpool - 48% confidence</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
              <Text style={styles.activityAmount}>-₦50</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="add" size={16} color="#24ad0c" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Wallet Top-up</Text>
                <Text style={styles.activityTime}>Bank Transfer</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
              <Text style={[styles.activityAmount, styles.creditAmount]}>+₦2,000</Text>
            </View>
          </View>
        </View>
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
  walletCard: {
    flex: 1,
    padding: 24,
    backgroundColor: '#24ad0c',
    borderRadius: 20,
    shadowColor: '#24ad0c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  backCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#24ad0c',
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
    color: '#000000',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  scanCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  scanCountText: {
    fontSize: 10,
    color: '#000000',
    marginLeft: 4,
    fontWeight: '600',
  },
  balanceMainContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceCurrency: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
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
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#000000',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  flipHint: {
    fontSize: 10,
    color: '#000000',
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
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
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
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
    position: 'relative',
  },
  popularPackage: {
    borderColor: '#24ad0c',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
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
    color: '#FFFFFF',
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
    color: '#24ad0c',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  saveText: {
    fontSize: 11,
    color: '#24ad0c',
    marginBottom: 4,
    fontWeight: '600',
  },
  perScanText: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#24ad0c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
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