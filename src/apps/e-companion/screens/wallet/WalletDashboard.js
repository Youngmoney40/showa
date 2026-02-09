import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Colors from '../../../globalshared/constants/colors';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerContent}>
              <Icon name='arrow-back' size={28} color='#333' />
              <Text style={styles.headerTitle}>My Wallet</Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance Card with Flip Animation */}
        <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
          <View style={styles.cardContainer}>
            {/* Front Side of Card - Wallet Balance */}
            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
              <LinearGradient
                colors={Colors.primaryGradient}
                style={styles.walletCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.walletIconContainer}>
                    <Icon name="wallet-outline" size={24} color={Colors.white} />
                    <Text style={styles.walletText}>WALLET</Text>
                  </View>
                  <TouchableOpacity style={styles.historyButton}>
                    <Text style={styles.historyText}>VISA</Text>
                    <Icon name="chevron-forward" size={16} color={Colors.black} />
                    <Icon style={{marginLeft:-10}} name="chevron-forward" size={16} color={Colors.black} />
                    <Icon style={{marginLeft:-10}} name="chevron-forward" size={16} color={Colors.black} />
                  </TouchableOpacity>
                </View>

                {/* Balance Display - Main Focus */}
                <View style={styles.balanceMainContainer}>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceCurrency}>₦</Text>
                    <Text style={styles.balanceAmount}>50,000,000</Text>
                  </View>
                  
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>₦2,500</Text>
                    <Text style={styles.statLabel}>  This Month</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>  Sessions</Text>
                  </View>
                </View>

                <Text style={styles.flipHint}>Tap card for details →</Text>
              </LinearGradient>
            </Animated.View>

            {/* Back Side of Card - Wallet Details */}
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <LinearGradient
                colors={Colors.primaryGradient}
                style={styles.walletCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Back Header */}
                <View style={styles.backHeader}>
                  <Text style={styles.backTitle}>Wallet Details</Text>
                  <View style={styles.securityBadge}>
                    <Icon name="shield-checkmark" size={16} color={Colors.white} />
                  </View>
                </View>

                {/* Account Information */}
                <View style={styles.accountInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Account Number</Text>
                    <Text style={styles.infoValue}>WL •••• 7890</Text>
                  </View>
                 
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <View style={styles.statusActive}>
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>
                </View>

                {/* Usage Statistics */}
                <View style={styles.usageSection}>
                  <Text style={styles.usageTitle}>This Month</Text>
                  <View style={styles.usageStats}>
                    <View style={styles.usageItem}>
                      <Text style={styles.usageAmount}>₦1,200</Text>
                      <Text style={styles.usageLabel}>Spent</Text>
                    </View>
                    <View style={styles.usageDivider} />
                    <View style={styles.usageItem}>
                      <Text style={styles.usageAmount}>₦3,000</Text>
                      <Text style={styles.usageLabel}>Added</Text>
                    </View>
                    <View style={styles.usageDivider} />
                    <View style={styles.usageItem}>
                      <Text style={styles.usageAmount}>8</Text>
                      <Text style={styles.usageLabel}>Sessions</Text>
                    </View>
                  </View>
                </View>

                {/* Security Features */}
                <View style={styles.securityFeatures}>
                  <View style={styles.securityItem}>
                    <Icon name="lock-closed" size={12} color={Colors.white} />
                    <Text style={styles.securityText}>Secure Payments</Text>
                  </View>
                  <View style={styles.securityItem}>
                    <Icon name="refresh" size={12} color={Colors.white} />
                    <Text style={styles.securityText}>Instant Top-up</Text>
                  </View>
                </View>

                <Text style={styles.flipHintBack}>← Tap to return</Text>
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Addfund')}
          >
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.actionIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="add" size={24} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, styles.transferIcon]}>
              <Icon name="arrow-redo" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, styles.historyIcon]}>
              <Icon name="time" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <View style={styles.supportHeader}>
            <Icon name="heart" size={20} color={Colors.primary} />
            <Text style={styles.supportTitle}>Need Someone to Talk To?</Text>
          </View>
          <Text style={styles.supportText}>
            Feeling overwhelmed? Connect with compassionate listeners who are here to support you through meaningful conversations.
          </Text>
          <TouchableOpacity style={styles.findListenersButton}
          onPress={()=>navigation.navigate('CSearchTalkerAndListener')}
          >
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.findListenersGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.findListenersText}>Find Listeners</Text>
              <Icon name="search" size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ongoing Session */}
        <View style={styles.sessionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ongoing Session</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.sessionCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }}
              style={styles.listenerImage}
            />
            
            <View style={styles.sessionInfo}>
              <Text style={styles.listenerName}>Sarah Johnson</Text>
              <Text style={styles.listenerSpecialty}>Relationship Counselor</Text>
              
              <View style={styles.sessionStats}>
                <View style={styles.statItem}>
                  <Icon name="time-outline" size={14} color={Colors.textTertiary} />
                  <Text style={styles.statText}>25 mins</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="chatbubble-outline" size={14} color={Colors.textTertiary} />
                  <Text style={styles.statText}>Active</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.joinButton}>
              <Icon name="play" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Icon name="arrow-down" size={16} color={Colors.success} />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Wallet Top-up</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityAmount}>₦3,000</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(255, 51, 102, 0.1)' }]}>
                <Icon name="chatbubble" size={16} color={Colors.primary} />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Chat Session</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
              <Text style={[styles.activityAmount, styles.debitAmount]}>-₦600</Text>
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
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 27,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: 'bold',
    marginLeft: 20
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  // Card Flip Styles
  cardContainer: {
    height: 240,
    marginBottom: 20,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // Front Card Styles - Wallet Balance Focus
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
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginLeft: 8,
    letterSpacing: 1,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  historyText: {
    fontFamily:'CollegiateInsideFLF',
    fontWeight:'bold',
    fontSize: 19,
    color: '#000',
   
    marginRight: 4,
  },
  balanceMainContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceCurrency: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
  },
  balanceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    marginTop:-20
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  flipHint: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Back Card Styles - Wallet Details
  backHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  securityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  statusActive: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  statusText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
  },
  usageSection: {
    marginBottom: 20,
    marginTop:-20
  },
  usageTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  usageItem: {
    alignItems: 'center',
    flex: 1,
  },
  usageAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  usageLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  usageDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
  },
  flipHintBack: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Rest of your existing styles...
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  transferIcon: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  historyIcon: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  supportSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  findListenersButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  findListenersGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  findListenersText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  sessionSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  listenerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  listenerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  listenerSpecialty: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  sessionStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  joinButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activitySection: {
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  activityList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.primary,
  },
});

export default WalletScreen;