import React,{useState,useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';
import BottomNav from '../../e-companion/components/BottomNav';

const HomeScreen = ({navigation}) => {
const [activeTab, setActiveTab] = useState("discover");
   const scaleAnim = useRef(new Animated.Value(1)).current;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
              style={styles.avatarImage}
            />
          </View>
          <View>
            <Text style={styles.greeting}>Good day</Text>
            <Text style={styles.userName}>Godwin Awai </Text>
          </View>
        </View>

        
        <TouchableOpacity style={[styles.notificationButton,{marginLeft:70}]} onPress={()=>navigation.navigate('EventDashboard')}>
          <Icon name="calendar-outline" size={24} color={Colors.textPrimary} />
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color={Colors.textPrimary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Impact Banner */}
        <LinearGradient
          colors={['#FF3366', '#FF6F00']}
          style={styles.impactBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Making Lives Better</Text>
              <Text style={styles.bannerSubtitle}>
                Your listening creates safe spaces for healing and growth
              </Text>
            </View>
            <View style={styles.bannerIcon}>
              <Icon name="people-circle" size={32} color={Colors.white} />
            </View>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('CompanionHome')}>
            <View style={styles.searchbanner}>
              
            <Text style={{fontSize:15,color:'#fff', marginLeft:8}}>Find Connection</Text>
            <Icon name='chevron-forward'size={20} color='#fff' />
            <Icon style={{marginLeft:-13}} name='chevron-forward'size={20} color='#fff' />

          </View>
            </TouchableOpacity>
          
          
          
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 200, 81, 0.1)' }]}>
              <Icon name="trending-up" size={20} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>₦12,400</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 51, 102, 0.1)' }]}>
              <Icon name="people" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionUser}>
                <View style={styles.userAvatar}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
                    style={styles.userAvatarImage}
                  />
                  <View style={styles.onlineStatus} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>James Wilson</Text>
                  <Text style={styles.sessionType}>Voice Call • 25m</Text>
                </View>
              </View>
              <View style={styles.sessionEarnings}>
                <Text style={styles.earningAmount}>₦1,250</Text>
                <Text style={styles.earningLabel}>Earnings</Text>
              </View>
            </View>
            
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.joinButton}>
                <LinearGradient
                  colors={Colors.primaryGradient}
                  style={styles.joinButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon name="play" size={16} color={Colors.white} />
                  <Text style={styles.joinButtonText}>Join Session</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.messageButton}>
                <Icon name="chatbubble" size={16} color={Colors.primary} />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Pending Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <View style={styles.requestsBadge}>
              <Text style={styles.requestsCount}>3</Text>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.requestsScroll}>
            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={[styles.requestIcon, { backgroundColor: 'rgba(51, 181, 229, 0.1)' }]}>
                  <Icon name="chatbubble" size={20} color={Colors.info} />
                </View>
                <Text style={styles.requestTime}>5 min ago</Text>
              </View>
              <Text style={styles.requestTitle}>Chat Session</Text>
              <Text style={styles.requestDescription}>
                30-minute text conversation about career guidance
              </Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={[styles.requestIcon, { backgroundColor: 'rgba(0, 200, 81, 0.1)' }]}>
                  <Icon name="call" size={20} color={Colors.success} />
                </View>
                <Text style={styles.requestTime}>12 min ago</Text>
              </View>
              <Text style={styles.requestTitle}>Voice Call</Text>
              <Text style={styles.requestDescription}>
                45-minute call for relationship advice
              </Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>


        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <View style={styles.timeSlot}>
                <Text style={styles.timeText}>14:00</Text>
                <Text style={styles.duration}>45min</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Video Session</Text>
                <Text style={styles.scheduleDescription}>Career counseling with Sarah</Text>
                <View style={styles.scheduleStatus}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.scheduleDivider} />
            
            <View style={styles.scheduleItem}>
              <View style={styles.timeSlot}>
                <Text style={styles.timeText}>16:30</Text>
                <Text style={styles.duration}>30min</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Chat Session</Text>
                <Text style={styles.scheduleDescription}>Anonymous user</Text>
                <View style={styles.scheduleStatus}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}

      {/* Bottom Navigation ================ */}
      <BottomNav 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              scaleAnim={scaleAnim}
              navigation={navigation}
            />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  impactBanner: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop:-10
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  searchbanner: {
    marginTop:10,
    width: 160,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems:'flex-start',
    padding:2,
    display:'flex',
    flexDirection:'row',
  
    
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sessionEarnings: {
    alignItems: 'flex-end',
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  joinButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  messageButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  requestsBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  requestsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  requestCard: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestTime: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeSlot: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;