import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ListenerProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FDFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#00796B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dashboardLink}>
          <Text style={styles.linkText}>Go to Dashboard</Text>
          <Icon name="open-outline" size={16} color="#00796B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Find Your Perfect Listener</Text>
          <Text style={styles.subtitle}>
            Compare and choose the right listener who matches your needs
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Mrs. Mary Mark</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFB800" />
                <Text style={styles.rating}>4.9</Text>
                <Text style={styles.reviews}>(128 reviews)</Text>
              </View>
              <View style={styles.badge}>
                <Icon name="shield-checkmark" size={12} color="#fff" />
                <Text style={styles.badgeText}>Verified Listener</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2y</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="person-outline" size={18} color="#00796B" />
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>30</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="briefcase-outline" size={18} color="#00796B" />
                <Text style={styles.infoLabel}>Occupation:</Text>
                <Text style={styles.infoValue}>Registered Nurse</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="language-outline" size={18} color="#00796B" />
              <Text style={styles.infoLabel}>Languages:</Text>
              <Text style={styles.infoValue}>English, French</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="time-outline" size={18} color="#00796B" />
              <Text style={styles.infoLabel}>Availability:</Text>
              <View style={styles.availability}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online - Ready to listen</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon name="chatbubbles-outline" size={18} color="#00796B" />
              <Text style={styles.infoLabel}>Communication:</Text>
              <Text style={styles.infoValue}>Call, Text, Video</Text>
            </View>

            <View style={styles.interestSection}>
              <Text style={styles.interestTitle}>Areas of Expertise</Text>
              <View style={styles.interestTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Relationship</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Fitness</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Finance</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Career</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Grief</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Anxiety</Text>
                </View>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About Mary</Text>
              <Text style={styles.aboutText}>
                With over 2 years of experience as a certified listener and background in nursing, 
                I provide compassionate, non-judgmental support. I specialize in helping people 
                navigate life's challenges with empathy and practical advice.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
              <Icon name="chatbubble-ellipses" size={20} color="#00796B" />
              <Text style={[styles.actionButtonText, styles.chatButtonText]}>Chat Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.voiceButton]}>
              <LinearGradient
                colors={['#00796B', '#004D40']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="call" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, styles.voiceButtonText]}>Voice Call</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.videoButton]}>
              <LinearGradient
                colors={['#009688', '#00796B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="videocam" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, styles.videoButtonText]}>Video Call</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoCard}>
            <Icon name="time" size={24} color="#00796B" />
            <Text style={styles.infoCardTitle}>Response Time</Text>
            <Text style={styles.infoCardValue}>Usually responds in 5 minutes</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Icon name="heart" size={24} color="#00796B" />
            <Text style={styles.infoCardTitle}>Specialization</Text>
            <Text style={styles.infoCardValue}>Crisis Support & Life Coaching</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  dashboardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  linkText: {
    color: '#00796B',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E0F2F1',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5FDFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00796B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0F2F1',
    marginHorizontal: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  interestSection: {
    marginTop: 16,
  },
  interestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004D40',
    marginBottom: 12,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#00796B',
    fontWeight: '500',
  },
  aboutSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004D40',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatButton: {
    backgroundColor: '#E0F2F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  voiceButton: {
    shadowColor: '#00796B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  videoButton: {
    shadowColor: '#009688',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  chatButtonText: {
    color: '#00796B',
  },
  voiceButtonText: {
    color: '#fff',
  },
  videoButtonText: {
    color: '#fff',
  },
  additionalInfo: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004D40',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ListenerProfileScreen;