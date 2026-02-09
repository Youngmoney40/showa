import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  SectionList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../globalshared/constants/colors';

const EventDashboardScreen = ({navigation}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleCreateEvent = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    navigation.navigate('CreateEvent');
  };

  const statsData = [
    {
      id: 1,
      title: 'Total Events',
      count: '156',
      subtitle: 'All platform events',
      icon: 'calendar-outline',
      color: Colors.primary,
      gradient: Colors.primaryGradient,
    },
    {
      id: 2,
      title: 'My Events',
      count: '25',
      subtitle: 'Events you created',
      icon: 'person-outline',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#45a049'],
    },
    {
      id: 3,
      title: 'Attending',
      count: '18',
      subtitle: 'Events you joined',
      icon: 'people-outline',
      color: '#2196F3',
      gradient: ['#2196F3', '#1976D2'],
    },
    {
      id: 4,
      title: 'Trending',
      count: '42',
      subtitle: 'Most popular events',
      icon: 'trending-up-outline',
      color: '#FF9800',
      gradient: ['#FF9800', '#F57C00'],
    },
  ];

  // Sample events data
  const allEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: 'Dec 15 • 9:00 AM',
      attendees: 240,
      type: 'Technology',
      host: 'Tech Community',
      price: 'Free',
      isMyEvent: false,
      category: 'upcoming',
    },
    {
      id: 2,
      title: 'Mindfulness Workshop',
      date: 'Dec 15 • 6:00 PM',
      attendees: 24,
      type: 'Wellness',
      host: 'DJ Spinall',
      price: '$20',
      isMyEvent: true,
      category: 'upcoming',
    },
    {
      id: 3,
      title: 'Career Growth Talk',
      date: 'Dec 18 • 7:30 PM',
      attendees: 18,
      type: 'Career',
      host: 'DJ Spinall',
      price: 'Free',
      isMyEvent: true,
      category: 'upcoming',
    },
    {
      id: 4,
      title: 'Music Festival',
      date: 'Dec 20 • 4:00 PM',
      attendees: 1500,
      type: 'Music',
      host: 'Music Group',
      price: '$50',
      isMyEvent: false,
      category: 'upcoming',
    },
    {
      id: 5,
      title: 'Startup Pitch Competition',
      date: 'Dec 22 • 2:00 PM',
      attendees: 89,
      type: 'Business',
      host: 'Startup Inc',
      price: '$25',
      isMyEvent: false,
      category: 'upcoming',
    },
    {
      id: 6,
      title: 'Yoga & Meditation',
      date: 'Ongoing',
      attendees: 45,
      type: 'Wellness',
      host: 'DJ Spinall',
      price: '$15',
      isMyEvent: true,
      category: 'live',
    },
    {
      id: 7,
      title: 'Art Exhibition Opening',
      date: 'Dec 25 • 6:00 PM',
      attendees: 120,
      type: 'Art',
      host: 'Art Gallery',
      price: 'Free',
      isMyEvent: false,
      category: 'upcoming',
    },
  ];

  const filteredEvents = allEvents.filter(event => {
    if (activeTab === 'my') return event.isMyEvent;
    if (activeTab === 'upcoming') return event.category === 'upcoming';
    return true;
  });

  const quickActions = [
    { id: 1, title: 'Create Event', icon: 'add-circle', color: Colors.primary, action: handleCreateEvent },
    { id: 2, title: 'My Events', icon: 'list', color: '#4CAF50', action: () => setActiveTab('my') },
    { id: 3, title: 'Search', icon: 'search', color: '#2196F3', action: () => {} },
    { id: 4, title: 'Categories', icon: 'grid', color: '#FF9800', action: () => {} },
    { id: 5, title: 'Calendar', icon: 'calendar', color: '#9C27B0', action: () => {} },
    { id: 6, title: 'Notifications', icon: 'notifications', color: '#FF5252', action: () => {} },
  ];

  const categories = [
    { id: 1, name: 'Music', icon: 'musical-notes', color: '#FF6B6B' },
    { id: 2, name: 'Tech', icon: 'laptop', color: '#4ECDC4' },
    { id: 3, name: 'Business', icon: 'business', color: '#45B7D1' },
    { id: 4, name: 'Art', icon: 'color-palette', color: '#96CEB4' },
    { id: 5, name: 'Sports', icon: 'basketball', color: '#FFEAA7' },
    { id: 6, name: 'Food', icon: 'restaurant', color: '#DDA0DD' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name='arrow-back' size={22} />
          <Text style={[styles.headerTitle ]}>Events</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleCreateEvent}>
            <Icon name="add" size={20} color={Colors.white} />
            <Text style={{color:'#fff',fontWeight:'bold'}}>Create Event</Text>
          </TouchableOpacity>
         
          
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={Colors.textTertiary} />
            <TextInput
              placeholder="Search events..."
              style={styles.searchInput}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="options" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          {statsData.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <LinearGradient
                colors={stat.gradient}
                style={styles.statIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name={stat.icon} size={20} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Events Tabs */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                All Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'my' && styles.activeTab]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
                My Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>

          {/* Events List ========*/}
          <View style={styles.eventsList}>
            {filteredEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={styles.eventImageContainer}>
                  <Image
                    source={{ uri: `https://avatars.mds.yandex.net/i?id=0f69187bed6871fec500ce92f006506572d8de33-3849670-images-thumbs&n=13` }}
                    style={styles.eventImage}
                  />
                  <View style={styles.eventBadges}>
                    <View style={[styles.eventTypeBadge, 
                      event.category === 'live' ? styles.liveBadge : styles.upcomingBadge
                    ]}>
                      <Text style={styles.eventTypeText}>
                        {event.category === 'live' ? 'LIVE' : 'UPCOMING'}
                      </Text>
                    </View>
                    {event.isMyEvent && (
                      <View style={styles.myEventBadge}>
                        <Text style={styles.myEventText}>MY EVENT</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.eventPrice}>
                    <Text style={styles.eventPriceText}>{event.price}</Text>
                  </View>
                </View>
                
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMeta}>
                    <View style={styles.eventMetaItem}>
                      <Icon name="calendar" size={14} color={Colors.textTertiary} />
                      <Text style={styles.eventMetaText}>{event.date}</Text>
                    </View>
                    <View style={styles.eventMetaItem}>
                      <Icon name="person" size={14} color={Colors.textTertiary} />
                      <Text style={styles.eventMetaText}>{event.host}</Text>
                    </View>
                  </View>
                  <View style={styles.eventFooter}>
                    <View style={styles.attendeeCount}>
                      <Icon name="people" size={14} color={Colors.textTertiary} />
                      <Text style={styles.attendeeText}>{event.attendees} attending</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>
                        {event.isMyEvent ? 'Manage' : 'Book Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Create Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleCreateEvent}
      >
        <LinearGradient
          colors={Colors.primaryGradient}
          style={styles.floatingButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Icon name="add" size={24} color={Colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Event</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Icon name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentInfo}>
              <View style={styles.paymentIcon}>
                <Icon name="card" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.paymentTitle}>Event Creation Fee</Text>
              <Text style={styles.paymentAmount}>₦10,000</Text>
              <Text style={styles.paymentDescription}>
                This one-time fee allows you to create and manage unlimited events on our platform.
              </Text>
            </View>

            <View style={styles.paymentFeatures}>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Unlimited event creation</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Advanced analytics</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Priority support</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.payButton}
                onPress={handlePaymentConfirm}
              >
                <LinearGradient
                  colors={Colors.primaryGradient}
                  style={styles.payButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.payButtonText}>Proceed</Text>
                  <Icon style={{marginLeft:20}} name="chevron-forward" size={16} color={Colors.white} />
                  
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    marginTop:40
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginLeft:10
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
    display:'flex',
    flexDirection:'row',
    backgroundColor:Colors.primaryGradient,
    padding:8,
    borderRadius:20,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.card,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  walletText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 6,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
  },
  statsScroll: {
    marginBottom: 8,
  },
  statsContent: {
    paddingHorizontal: 16,
  },
  statCard: {
    width: 160,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
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
    color: Colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '30%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  categoriesContent: {
    paddingBottom: 8,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  eventsList: {
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  eventImageContainer: {
    position: 'relative',
    height: 160,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  liveBadge: {
    backgroundColor: '#FF5252',
  },
  upcomingBadge: {
    backgroundColor: Colors.primary,
  },
  eventTypeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  myEventBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  myEventText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  eventPrice: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  eventMetaText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  paymentDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentFeatures: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.textTertiary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  payButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EventDashboardScreen;