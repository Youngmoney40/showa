import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const FeaturesExploreScreen = ({ navigation }) => {
  const [selectedGoal, setSelectedGoal] = useState('Dangerous');
  const [selectedFeature, setSelectedFeature] = useState(null);

  const goals = [
    { id: 'dangerous', title: 'Dangerous', icon: 'flash', color: '#FF3366' },
    { id: 'sexual', title: 'Sexual Rewards', icon: 'heart', color: '#FF6B35' },
    { id: 'social', title: 'Social Payments', icon: 'cash', color: '#4CD964' },
    { id: 'rewarded', title: 'Most Rewarded', icon: 'trophy', color: '#FFD700' },
  ];

  const features = {
    dangerous: [
      
      {
        id: 2,
        title: 'E-Companion ',
        description: 'Reveal your crush anonymously',
        icon: 'lock-closed',
        color: '#FF6B35',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
        premium: true,
        screen:'CompanionHome'
      },
      
      {
        id: 3,
        title: 'Suggar Mummy & Daddy',
        description: 'High-stakes dating with exciting consequences',
        icon: 'warning',
        color: '#FF4757',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        premium: true,
        screen:'CompanionHome'
      },
      {
        id: 4,
        title: 'Couple',
        description: 'High-stakes dating with exciting consequences',
        icon: 'warning',
        color: '#FF4757',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        premium: true,
        screen:'Setupsprofiles'
      },
      {
        id: 1,
        title: 'Anonymous Chat',
        description: 'Connect without revealing your identity',
        icon: 'chatbubble-ellipses',
        color: '#FF3366',
        image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400',
        premium: false,
        screen:'CompanionHome'
      },
    ],
    sexual: [
      {
        id: 1,
        title: 'Intimate Moments',
        description: 'Share private moments with trusted matches',
        icon: 'sparkles',
        color: '#FF6B35',
        image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=400',
        premium: false,
        screen:'CompanionHome'
      },
      {
        id: 2,
        title: 'Desire Exchange',
        description: 'Trade fantasies and desires safely',
        icon: 'swap-horizontal',
        color: '#FF8C42',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        premium: false,
        screen:'CompanionHome'
      },
      {
        id: 3,
        title: 'Pleasure Points',
        description: 'Earn rewards for intimate connections',
        icon: 'gift',
        color: '#FFA726',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        premium: true,
        screen:'CompanionHome'
      },
    ],
    social: [
      {
        id: 1,
        title: 'Social Credits',
        description: 'Earn credits for social interactions',
        icon: 'card',
        color: '#4CD964',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        premium: false,
        screen:'CompanionHome'
      },
      {
        id: 2,
        title: 'Gift Exchange',
        description: 'Send and receive virtual gifts',
        icon: 'gift',
        color: '#34C759',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
        premium: true,
        screen:'CompanionHome'
      },
      {
        id: 3,
        title: 'Premium Tokens',
        description: 'Access exclusive features with tokens',
        icon: 'diamond',
        color: '#32D74B',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
        premium: true,
        screen:'CompanionHome'
      },
    ],
    rewarded: [
      {
        id: 1,
        title: 'Elite Matching',
        description: 'Get priority matching with top profiles',
        icon: 'star',
        color: '#FFD700',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
        premium: true,
        screen:'CompanionHome'
      },
      {
        id: 2,
        title: 'VIP Access',
        description: 'Exclusive access to premium events',
        icon: 'ribbon',
        color: '#FFC107',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        premium: true,
        screen:'CompanionHome'
      },
      {
        id: 3,
        title: 'Reward Multiplier',
        description: 'Earn 2x points on all interactions',
        icon: 'trending-up',
        color: '#FFB300',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        premium: true,
        screen:'CompanionHome'
      },
    ],
  };

  const currentFeatures = features[selectedGoal.toLowerCase()] || [];

  const handlePress = (feature) => {
    if (feature.title === 'E-Companion ') {
        navigation.navigate('CSplash');
    }else if (feature.title === 'Suggar Mummy & Daddy'){
      navigation.navigate('SplashScreenSuggar')

    }else if (feature.title === 'Couple'){
      navigation.navigate('Welcome')

    }else{
      // navigation.naviagte()
    }
  }  


  return (
    <View style={styles.container}>
      
      
      {/* Header */}
      <LinearGradient
        colors={['#FF3366', '#FF6F00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Features</Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Icon name="diamond" size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Goals Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Goal</Text>
          <Text style={styles.sectionSubtitle}>Choose your dating adventure</Text>
          
          <View style={styles.goalsContainer}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  selectedGoal === goal.title && styles.goalCardSelected
                ]}
                onPress={() => setSelectedGoal(goal.title)}
              >
                <LinearGradient
                  colors={selectedGoal === goal.title ? 
                    [goal.color, `${goal.color}CC`] : 
                    ['#FFF', '#FFF']
                  }
                  style={styles.goalGradient}
                >
                  <Icon 
                    name={goal.icon} 
                    size={24} 
                    color={selectedGoal === goal.title ? '#FFF' : goal.color} 
                  />
                  <Text style={[
                    styles.goalText,
                    selectedGoal === goal.title && styles.goalTextSelected
                  ]}>
                    {goal.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.featuresTitle}>{selectedGoal} Features</Text>
            <Text style={styles.featuresCount}>{currentFeatures.length} features</Text>
          </View>

          <View style={styles.featuresGrid}>
            {currentFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                onPress={() => handlePress(feature)}
              >
                <Image 
                  source={{ uri: feature.image }} 
                  style={styles.featureImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featureOverlay}
                />
                
                <View style={styles.featureContent}>
                  <View style={styles.featureHeader}>
                    <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                      <Icon name={feature.icon} size={20} color="#FFF" />
                    </View>
                    {feature.premium && (
                      <View style={styles.premiumBadge}>
                        <Icon name="diamond" size={12} color="#FFD700" />
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  <View style={styles.featureFooter}>
                    <TouchableOpacity style={styles.exploreButton}>
                      <Text style={styles.exploreButtonText}>
                        {feature.premium ? 'Unlock Premium' : 'Explore'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumBanner}>
          <LinearGradient
            colors={['#FFD700', '#FFA726']}
            style={styles.premiumGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.premiumContent}>
              <Icon name="diamond" size={32} color="#FFF" />
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Go Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock all features and rewards</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  goalCardSelected: {
    shadowColor: '#FF3366',
    shadowOpacity: 0.3,
    elevation: 8,
  },
  goalGradient: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  goalTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  featuresCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    height: 200,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  featureImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featureOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  featureContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  featureFooter: {
    marginTop: 12,
  },
  exploreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  premiumBanner: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumGradient: {
    padding: 25,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumText: {
    flex: 1,
    marginLeft: 15,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  upgradeButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeText: {
    color: '#FFA726',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FeaturesExploreScreen;