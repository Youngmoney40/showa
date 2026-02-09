import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const SuccessStoriesScreen = ({navigation}) => {
  const scrollY = new Animated.Value(0);
  const [inspireCounts, setInspireCounts] = useState({});
  const [likedStories, setLikedStories] = useState({});

  const successStories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      company: 'TechStart Inc.',
      quote: "This platform changed my life. After sharing my startup journey, I connected with investors and mentors who helped me grow my business beyond what I imagined possible.",
      image: require('../assets/images/gdgdg.jpg'), 
      stats: 'Reached 50,000+ people',
      impact: 'Raised $2M in funding',
      duration: 'Today',
      category: 'Business Growth'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Community Leader',
      company: 'Urban Renewal Project',
      quote: "When I shared our community project here, we received overwhelming support. Volunteers came forward, and we secured funding to expand our programs to three new neighborhoods.",
      image: require('../assets/images/dssdd.jpg'), 
      stats: 'Inspired 200+ volunteers',
      impact: '3 new community centers',
      duration: 'A Month Ago',
      category: 'Community Impact'
    },
    {
      id: 3,
      name: 'Emillia Amina Diallo',
      role: 'Health Advocate',
      company: 'Wellness Initiative',
      quote: "Posting about my health journey led to incredible connections. I've been able to help others going through similar challenges and found a supportive community that keeps me motivated.",
      image: require('../assets/images/cta_girl_new.jpeg'), 
      stats: 'Helped 1,500+ people',
      impact: '100+ support groups formed',
      duration: '8 months',
      category: 'Personal Journey'
    },
    {
      id: 4,
      name: 'Chioma Rodriguez',
      role: 'Educator',
      company: 'Global Education Network',
      quote: "Sharing my teaching methods here opened doors to speaking engagements and collaborations. My ideas reached educators worldwide, creating impact I never expected.",
      image: require('../assets/images/dad.jpg'),
      stats: 'Featured in 10+ publications',
      impact: 'International recognition',
      duration: '2 months',
      category: 'Education Innovation'
    },
  ];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [330, 120],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const handleInspire = (storyId) => {
    setInspireCounts(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1
    }));
    setLikedStories(prev => ({
      ...prev,
      [storyId]: true
    }));
  };

  const handleShare = async (story) => {
    try {
      const result = await Share.share({
        message: `🌟 ${story.name}'s Inspiring Story: "${story.quote}"\n\nRead more success stories and share your own journey at https://feedback.edirect.ng/ \n\n#SuccessStories #Inspiration`,
        title: `${story.name}'s Success Story`
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Story shared successfully');
      }
    } catch (error) {
      console.log('Error sharing story:', error.message);
    }
  };

  const handleShareProject = () => {
    Linking.openURL('https://feedback.edirect.ng/feedback?project_id=10');
  };

  

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
        <Animated.View style={[styles.heroContainer, { height: headerHeight }]}>
          <LinearGradient
            colors={['#667eea', '#0b25b7ff']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Ionicons style={{ paddingHorizontal:20, paddingTop:20, paddingBottom:0}} name="arrow-back" size={24} color="#fff" />

          </TouchableOpacity>
        
          <Animated.View style={[styles.heroContent, { opacity: headerOpacity }]}>
            
            <Text style={styles.heroTitle}>Real Stories, Real Impact</Text>
            <Text style={styles.heroSubtitle}>
              Discover how sharing experiences creates meaningful connections and transforms lives
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>500+</Text>
                <Text style={styles.statLabel}>Stories Shared</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1M+</Text>
                <Text style={styles.statLabel}>Lives Touched</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>95%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.storiesContainer}>
            {successStories.map((story, index) => {
              const inspireCount = inspireCounts[story.id] || 0;
              const isLiked = likedStories[story.id] || false;

              return (
                <View key={story.id} style={[
                  styles.storyCard,
                  index === 0 && { marginTop: 20 }
                ]}>
            
                  
                  <View style={styles.userInfo}>
                    <Image source={story.image} style={styles.userImage} />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{story.name}</Text>
                      <Text style={styles.userRole}>{story.role}</Text>
                      <Text style={styles.userCompany}>{story.company}</Text>
                    </View>
                    <Icon name="quote-left" size={20} color="#e0e0e0" style={styles.quoteIcon} />
                  </View>

                  <Text style={styles.storyQuote}>"{story.quote}"</Text>

                  <View style={styles.storyStats}>
                    <View style={styles.statRow}>
                      <MaterialIcons name="visibility" size={16} color="#3498db" />
                      <Text style={styles.statsText}>{story.stats}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <MaterialIcons name="trending-up" size={16} color="#27ae60" />
                      <Text style={styles.statsText}>{story.impact}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <MaterialIcons name="access-time" size={16} color="#f39c12" />
                      <Text style={styles.statsText}>{story.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[
                        styles.likeButton,
                        isLiked && styles.likeButtonActive
                      ]}
                      onPress={() => handleInspire(story.id)}
                    >
                      <Icon 
                        name={isLiked ? "heart" : "heart-o"} 
                        size={16} 
                        color={isLiked ? "#e74c3c" : "#e74c3c"} 
                      />
                      <Text style={[
                        styles.buttonText,
                        isLiked && styles.buttonTextActive
                      ]}>
                        Inspire {inspireCount > 0 && `(${inspireCount})`}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.shareButton}
                      onPress={() => handleShare(story)}
                    >
                      <Icon name="share" size={16} color="#3498db" />
                      <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <LinearGradient
              colors={['#ffecd2', '#fcb69f']}
              style={styles.footerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="lightbulb-o" size={36} color="#e67e22" style={styles.footerIcon} />
              <Text style={styles.footerTitle}>Ready to Share Your Story?</Text>
              <Text style={styles.footerText}>
                Your experiences could inspire someone today. Join our community of storytellers and make a difference.
              </Text>
              <TouchableOpacity onPress={handleShareProject} style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Visit Site to Share</Text>
                <Icon name="arrow-right" size={16} color="white" style={styles.ctaIcon} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroContainer: {
    overflow: 'hidden',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Lato-Black',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Lato-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,

  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Lato-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: 'Lato-Regular',
  },
  scrollView: {
    flex: 1,
    marginTop: -40,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryTag: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
  },
  categoryText: {
    padding:12,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Lato-Bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#f8f9fa',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontFamily: 'Lato-Bold',
  },
  userRole: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 2,
    fontFamily: 'Lato-Regular',
  },
  userCompany: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
    fontFamily: 'Lato-Italic',
  },
  quoteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  storyQuote: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
    fontFamily: 'Lato-Italic',
  },
  storyStats: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
    fontFamily: 'Lato-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffeaea',
    borderRadius: 25,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  likeButtonActive: {
    backgroundColor: '#ffd1d1',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eaf2f8',
    borderRadius: 25,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'Lato-Medium',
    color: '#2c3e50',
  },
  buttonTextActive: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  footer: {
    marginHorizontal: 16,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  footerGradient: {
    padding: 0,
    alignItems: 'center',
  },
  footerIcon: {
    marginTop:16,
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  footerText: {
    fontSize: 15,
    padding:10,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'Lato-Regular',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e67e22',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom:20
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Lato-Bold',
  },
  ctaIcon: {
    marginLeft: 4,
  },
});

export default SuccessStoriesScreen;