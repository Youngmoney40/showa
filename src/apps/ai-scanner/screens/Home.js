
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import BottomNav from '../../ai-scanner/screens/components/BottomNav';
import Iconn from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const winTextAnim = useRef(new Animated.Value(0)).current;
  const statsSlideAnim = useRef(new Animated.Value(30)).current;
  const ctaBounceAnim = useRef(new Animated.Value(1)).current;
  const matchCardsAnim = useRef(new Animated.Value(0)).current;
  const carouselAnim = useRef(new Animated.Value(0)).current;

  // Carousel ads data
  const carouselAds = [
    {
      id: 1,
      image: 'https://img.freepik.com/premium-photo/excited-man-celebrating-winning-bet-with-money-coins-flying-out-smartphone-sports-betting-concept_1138059-4431.jpg',
      title: 'Special Offer',
      description: 'Get 50% off on your first analysis'
    },
    {
      id: 2,
      image: 'https://www.yasamdersleri.com/wp-content/uploads/2024/04/EFT-Bahis-Siteleri.jpg',
      title: 'Win Big',
      description: 'Join 10K+ winners today'
    },
    {
      id: 3,
      image: 'https://i.ytimg.com/vi/DGRk2Fwn_Og/maxresdefault.jpg',
      title: 'New Features',
      description: 'Enhanced AI analysis available'
    },
    {
      id: 4,
      image: 'https://alwe7daclub.com/wp-content/uploads/2024/02/mostbet-para-kazanma.jpg',
      title: 'Go Premium',
      description: 'Unlock advanced predictions'
    },
    {
      id: 5,
      image: 'https://t4.ftcdn.net/jpg/06/17/18/71/360_F_617187188_x0mC6z4VfOV1tzCZzXTWY3LWTL7typdz.jpg',
      title: 'Go Premium',
      description: 'Make money quickly with AI'
    }
  ];

  // Start animations on component mount
  useEffect(() => {
    startEntranceAnimations();
    startCarousel();
    
    // Simulate occasional win animation for demonstration
    const winTimer = setTimeout(() => {
      triggerWinAnimation();
    }, 3000);
    
    return () => {
      clearTimeout(winTimer);
      clearInterval(carouselInterval);
    };
  }, []);

  let carouselInterval;

  const startCarousel = () => {
    carouselInterval = setInterval(() => {
      Animated.timing(carouselAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentAdIndex((prevIndex) => 
          prevIndex === carouselAds.length - 1 ? 0 : prevIndex + 1
        );
        carouselAnim.setValue(0);
      });
    }, 4000); // Change ad every 4 seconds
  };

  const startEntranceAnimations = () => {
    // Header animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Stats cards animation with stagger
    Animated.stagger(100, [
      Animated.timing(statsSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // CTA card animation
    Animated.sequence([
      Animated.delay(400),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Match cards animation
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(matchCardsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    // Continuous pulse animation for CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // CTA bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaBounceAnim, {
          toValue: 1.02,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ctaBounceAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const triggerWinAnimation = () => {
    setShowWinAnimation(true);
    
    Animated.sequence([
      // Confetti explosion
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Win text animation
      Animated.timing(winTextAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(() => {
      // Reset animations
      Animated.parallel([
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(winTextAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowWinAnimation(false);
      });
    });
  };

//   const featuredMatches = [
//     { id: 1, teams: 'Chelsea vs Arsenal', confidence: 78, time: '17:30' },
//     { id: 2, teams: 'Man City vs Liverpool', confidence: 65, time: '20:00' },
//     { id: 3, teams: 'Barcelona vs Real Madrid', confidence: 72, time: '21:00' },
//   ];
const featuredMatches = [
  {
    id: 1,
    league: 'Premier League',
    teams: 'Chelsea vs Arsenal',
    aiPrediction: 'Chelsea Win',
    confidence: 78,
    odds: 2.15,
    time: '17:30',
    date: '2025-11-07',
    highlight: 'Safe Pick',
  },
  {
    id: 2,
    league: 'Premier League',
    teams: 'Man City vs Liverpool',
    aiPrediction: 'Over 2.5 Goals',
    confidence: 65,
    odds: 1.90,
    time: '20:00',
    date: '2025-11-07',
    highlight: 'Medium Risk',
  },
  {
    id: 3,
    league: 'La Liga',
    teams: 'Barcelona vs Real Madrid',
    aiPrediction: 'Draw',
    confidence: 72,
    odds: 3.40,
    time: '21:00',
    date: '2025-11-07',
    highlight: 'High Value Pick',
  },
];


  // Confetti particles
  const renderConfetti = () => {
    const confetti = [];
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * width;
      const animation = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height],
      });
      
      const rotate = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
      });

      const scale = confettiAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
      });

      const colors = ['#39FF14', '#FFFF33', '#FF3366', '#00FF88', '#FFAA00'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.push(
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left,
              backgroundColor: color,
              transform: [
                { translateY: animation },
                { rotate },
                { scale },
              ],
            },
          ]}
        />
      );
    }
    return confetti;
  };

  const matchCardAnimations = featuredMatches.map((_, index) => 
    matchCardsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [100 * (index + 1), 0],
    })
  );

  const carouselTranslateX = carouselAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  const carouselOpacity = carouselAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Win Animation Overlay */}
      {showWinAnimation && (
        <View style={styles.winOverlay}>
          {renderConfetti()}
          <Animated.View 
            style={[
              styles.winTextContainer,
              {
                opacity: winTextAnim,
                transform: [{ scale: winTextAnim }]
              }
            ]}
          >
            <Text style={styles.winText}>🎉 WINNER! 🎉</Text>
            <Text style={styles.winSubtext}>Another user just won ₦50,000 using BetScan!</Text>
          </Animated.View>
        </View>
      )}

      <Animated.ScrollView 
        style={[
          styles.scrollView, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Carousel Ads Section */}
        <View style={styles.carouselContainer}>
          <Animated.View 
            style={[
              styles.carouselContent,
              {
                transform: [{ translateX: carouselTranslateX }],
                opacity: carouselOpacity,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.carouselAd}
              activeOpacity={0.8}
              onPress={() => {
                // Handle ad click
                console.log('Ad clicked:', carouselAds[currentAdIndex].title);
              }}
            >
              <Image 
                source={{ uri: carouselAds[currentAdIndex].image }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.carouselGradient}
              >
                <View style={styles.carouselText}>
                  <Text style={styles.carouselTitle}>
                    {carouselAds[currentAdIndex].title}
                  </Text>
                  <Text style={styles.carouselDescription}>
                    {carouselAds[currentAdIndex].description}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {carouselAds.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentAdIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Header with Gradient */}
        <LinearGradient
          colors={['#000000', '#020202ff', '#000000']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Animated.View
                style={{
                  transform: [{ rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })}]
                }}
              >
                {/* <Icon name="analytics" size={32} color="#24ad0cff" /> */}
              </Animated.View>
              <Text style={styles.logo}>Welcome to Lord-Ai</Text>
            </View>
            <Text style={[styles.welcome,{marginTop:-7}]}>The Smarter Way to Analyze Your Bet Slip — Scan & Win. 🎯</Text>
          </Animated.View>
        </LinearGradient>

        {/* Quick Stats */}
        <Animated.View 
          style={[
            styles.quickStats,
            { transform: [{ translateY: statsSlideAnim }] }
          ]}
        >
          <Animated.View style={styles.statCard}>
            <Icon name="trending-up" size={24} color="#24ad0cff" />
            <Text style={styles.statNumber}>15K+</Text>
            <Text style={styles.statLabel}>Analyses</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.statCard,
              { transform: [{ translateY: statsSlideAnim }] }
            ]}
          >
            <Icon name="verified" size={24} color="#24ad0cff" />
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.statCard,
              { transform: [{ translateY: statsSlideAnim }] }
            ]}
          >
            <Icon name="savings" size={24} color="#24ad0cff" />
            <Text style={styles.statNumber}>₦16M+</Text>
            <Text style={styles.statLabel}>Winners</Text>
          </Animated.View>
        </Animated.View>

        {/* Main CTA Card */}
        <Animated.View 
          style={[
            styles.mainCTACard,
            { 
              transform: [
                { scale: scaleAnim },
                { scale: ctaBounceAnim }
              ] 
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => navigation.navigate('Analysis')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#24ad0cff', '#01b461ff', '#24ad0cff']}
              style={styles.mainCTAGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Animated.View 
                style={[
                  styles.ctaContent,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <View style={styles.ctaIcon}>
                  <Iconn name="qr-code-outline" size={40} color="#d2d0d0ff" />
                  {/* <Iconn name="document-text-outline" size={40} color="#d2d0d0ff" /> */}
                </View>
                <View style={styles.ctaText}>
                  <Text style={styles.ctaTitle}>Scan Bet & Win</Text>
                  <Text style={styles.ctaSubtitle}>Instant AI Analysis — Only ₦50</Text>
                  <Text style={styles.ctaDescription}>
                    Stop getting cut by 1 or 2 Identify risky games instantly
                  </Text>
                </View>
                <Animated.View
                  style={{
                    transform: [{
                      translateX: pulseAnim.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: [0, 5]
                      })
                    }]
                  }}
                >
                  <Icon name="arrow-forward" size={24} color="#000000" />
                </Animated.View>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Featured Matches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Today's Top Picks</Text>
          <View style={styles.matchesList}>
            {featuredMatches.map((match, index) => (
              <Animated.View
                key={match.id}
                style={{
                  transform: [{ translateY: matchCardAnimations[index] }],
                  opacity: matchCardsAnim
                }}
              >
                <TouchableOpacity 
                  style={styles.matchCard}
                  onPress={() => triggerWinAnimation()} 
                >
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchTeams}>{match.teams}</Text>
                    <Animated.View 
                      style={[
                        styles.confidenceBadge,
                        {
                          transform: [{
                            scale: pulseAnim.interpolate({
                              inputRange: [1, 1.05],
                              outputRange: [1, 1.1]
                            })
                          }]
                        }
                      ]}
                    >
                      <Text style={styles.confidenceText}>{match.confidence}%</Text>
                    </Animated.View>
                  </View>
                  <View style={styles.matchFooter}>
                    <Text style={styles.matchTime}>⏰ {match.time}</Text>
                    <TouchableOpacity style={styles.quickScanBtn}>
                      <Text style={styles.quickScanText}>Quick Scan</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> How It Works</Text>
          <View style={styles.stepsContainer}>
            {[1, 2, 3].map((step, index) => (
              <Animated.View
                key={step}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20 * (index + 1), 0]
                    })
                  }]
                }}
              >
                <View style={styles.step}>
                  <Animated.View 
                    style={[
                      styles.stepIcon,
                      {
                        transform: [{
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.05],
                            outputRange: [1, 1.1]
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.stepNumber}>{step}</Text>
                  </Animated.View>
                  <Text style={styles.stepTitle}>
                    {step === 1 ? 'Upload Slip' : step === 2 ? 'AI Analysis' : 'Win Smart'}
                  </Text>
                  <Text style={styles.stepDescription}>
  {step === 1
    ? 'Take photo of \nyour bet slipfrom \nany bookmaker'
    : step === 2
    ? 'Get confidence \nscoresand risk \nanalysis'
    : 'Remove risky \ngames and \nincrease chances'}
</Text>

                </View>
                {index < 2 && <View style={styles.stepConnector} />}
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Supported Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Supported Bookmakers</Text>
          <View style={styles.platformsGrid}>
            {['Bet9ja', 'SportyBet', 'Nairabet', '1xBet', 'BetKing', 'MerryBet'].map((platform, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.platformCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1]
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.platformText}>{platform}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Bottom Spacer for Navigation */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Fixed Bottom Navigation */}
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
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Carousel Styles ===================
  carouselContainer: {
    height: 160,
    marginLeft:15,
    marginRight:15,
    marginTop:15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  carouselContent: {
    flex: 1,
  },
  carouselAd: {
    flex: 1,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  carouselText: {
    paddingBottom: 10,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#24ad0cff',
    width: 20,
  },
  header: {
   //paddingVertical: 40,
   paddingTop: 18,
   paddingBottom:30,

    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  welcome: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    alignContent:'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -30,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#656464ff',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#24ad0cff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  mainCTACard: {
    //margin: 20,
    marginLeft: 20,
    marginRight: 20,


    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#24ad0cff",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  mainCTAGradient: {
    padding: 25,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaIcon: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 20,
  },
  ctaText: {
    flex: 1,
    marginLeft: 15,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 5,
  },
  ctaDescription: {
    fontSize: 12,
    color: '#000000',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#24ad0cff',
    marginBottom: 15,
  },
  matchesList: {
    gap: 12,
  },
  matchCard: {
    backgroundColor: '#111111',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#222222',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchTime: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  quickScanBtn: {
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickScanText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#24ad0cff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 16,
  },
  stepConnector: {
    width: 20,
    height: 2,
    backgroundColor: '#24ad0cff',
    marginTop: 25,
    opacity: 0.5,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  platformCard: {
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 12,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  platformText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 30,
  },
  // Win Animation Styles
  winOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  winTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#24ad0cff',
    alignItems: 'center',
  },
  winText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#24ad0cff',
    marginBottom: 10,
  },
  winSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default HomeScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import BottomNav from '../../ai-scanner/screens/components/BottomNav';
// import Iconn from 'react-native-vector-icons/Ionicons';

// const { width, height } = Dimensions.get('window');

// const HomeScreen = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState("home");
//   const [showWinAnimation, setShowWinAnimation] = useState(false);
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const [expandedMatch, setExpandedMatch] = useState(null);
  
//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideUpAnim = useRef(new Animated.Value(50)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const confettiAnim = useRef(new Animated.Value(0)).current;
//   const winTextAnim = useRef(new Animated.Value(0)).current;
//   const statsSlideAnim = useRef(new Animated.Value(30)).current;
//   const ctaBounceAnim = useRef(new Animated.Value(1)).current;
//   const matchCardsAnim = useRef(new Animated.Value(0)).current;
//   const carouselAnim = useRef(new Animated.Value(0)).current;
//   const expandAnim = useRef(new Animated.Value(0)).current;

//   // Carousel ads data
//   const carouselAds = [
//     {
//       id: 1,
//       image: 'https://img.freepik.com/premium-photo/excited-man-celebrating-winning-bet-with-money-coins-flying-out-smartphone-sports-betting-concept_1138059-4431.jpg',
//       title: 'Special Offer',
//       description: 'Get 50% off on your first analysis'
//     },
//     {
//       id: 2,
//       image: 'https://www.yasamdersleri.com/wp-content/uploads/2024/04/EFT-Bahis-Siteleri.jpg',
//       title: 'Win Big',
//       description: 'Join 10K+ winners today'
//     },
//     {
//       id: 3,
//       image: 'https://i.ytimg.com/vi/DGRk2Fwn_Og/maxresdefault.jpg',
//       title: 'New Features',
//       description: 'Enhanced AI analysis available'
//     },
//     {
//       id: 4,
//       image: 'https://alwe7daclub.com/wp-content/uploads/2024/02/mostbet-para-kazanma.jpg',
//       title: 'Go Premium',
//       description: 'Unlock advanced predictions'
//     },
//     {
//       id: 5,
//       image: 'https://t4.ftcdn.net/jpg/06/17/18/71/360_F_617187188_x0mC6z4VfOV1tzCZzXTWY3LWTL7typdz.jpg',
//       title: 'Go Premium',
//       description: 'Make money quickly with AI'
//     }
//   ];

//   // Enhanced featured matches data
//   const featuredMatches = [
//     {
//       id: 1,
//       league: 'Premier League',
//       teams: 'Chelsea vs Arsenal',
//       teamLogos: {
//         home: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
//         away: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png'
//       },
//       aiPrediction: 'Chelsea Win',
//       confidence: 78,
//       odds: 2.15,
//       time: '17:30',
//       date: '2025-11-07',
//       highlight: 'Safe Pick',
//       riskLevel: 'Low',
//       analysis: {
//         summary: 'Strong home advantage with recent form favoring Chelsea',
//         keyFactors: [
//           'Chelsea unbeaten in last 5 home matches',
//           'Arsenal missing key defender due to injury',
//           'Head-to-head favors Chelsea at home'
//         ],
//         recommendedBets: ['1X', 'Over 1.5 Goals', 'Chelsea to Score First'],
//         avoidBets: ['Arsenal Win', 'Under 1.5 Goals']
//       },
//       stats: {
//         homeForm: 'WWLWW',
//         awayForm: 'LWWDL',
//         h2h: '3-2-0 (Last 5)'
//       }
//     },
//     {
//       id: 2,
//       league: 'Premier League',
//       teams: 'Man City vs Liverpool',
//       teamLogos: {
//         home: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
//         away: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png'
//       },
//       aiPrediction: 'Over 2.5 Goals',
//       confidence: 65,
//       odds: 1.90,
//       time: '20:00',
//       date: '2025-11-07',
//       highlight: 'Medium Risk',
//       riskLevel: 'Medium',
//       analysis: {
//         summary: 'Both teams strong in attack, expect goals from both sides',
//         keyFactors: [
//           'Both teams scored in last 4 H2H matches',
//           'Strong attacking lineups on both sides',
//           'High average goals in recent fixtures'
//         ],
//         recommendedBets: ['Over 2.5 Goals', 'BTTS Yes', 'Both Teams to Score'],
//         avoidBets: ['Under 1.5 Goals', 'Clean Sheet Any Team']
//       },
//       stats: {
//         homeForm: 'WDWWW',
//         awayForm: 'WWLDW',
//         h2h: '2-2-1 (Last 5)'
//       }
//     },
//     {
//       id: 3,
//       league: 'La Liga',
//       teams: 'Barcelona vs Real Madrid',
//       teamLogos: {
//         home: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
//         away: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png'
//       },
//       aiPrediction: 'Draw',
//       confidence: 72,
//       odds: 3.40,
//       time: '21:00',
//       date: '2025-11-07',
//       highlight: 'High Value Pick',
//       riskLevel: 'High',
//       analysis: {
//         summary: 'Evenly matched rivals, recent draws suggest close encounter',
//         keyFactors: [
//           '3 draws in last 5 El Clásico matches',
//           'Both teams conserving energy for Champions League',
//           'Key players returning from injury on both sides'
//         ],
//         recommendedBets: ['Draw', 'Double Chance 1X', 'BTTS Yes'],
//         avoidBets: ['Big Margin Win', 'Clean Sheet Any Team']
//       },
//       stats: {
//         homeForm: 'WWDDW',
//         awayForm: 'DWWWW',
//         h2h: '1-3-1 (Last 5)'
//       }
//     }
//   ];

//   // Start animations on component mount
//   useEffect(() => {
//     startEntranceAnimations();
//     startCarousel();
    
//     // Simulate occasional win animation for demonstration
//     const winTimer = setTimeout(() => {
//       triggerWinAnimation();
//     }, 3000);
    
//     return () => {
//       clearTimeout(winTimer);
//       clearInterval(carouselInterval);
//     };
//   }, []);

//   let carouselInterval;

//   const startCarousel = () => {
//     carouselInterval = setInterval(() => {
//       Animated.timing(carouselAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start(() => {
//         setCurrentAdIndex((prevIndex) => 
//           prevIndex === carouselAds.length - 1 ? 0 : prevIndex + 1
//         );
//         carouselAnim.setValue(0);
//       });
//     }, 4000); // Change ad every 4 seconds
//   };

//   const startEntranceAnimations = () => {
//     // Header animations
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideUpAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Stats cards animation with stagger
//     Animated.stagger(100, [
//       Animated.timing(statsSlideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // CTA card animation
//     Animated.sequence([
//       Animated.delay(400),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Match cards animation
//     Animated.sequence([
//       Animated.delay(600),
//       Animated.timing(matchCardsAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Continuous pulse animation for CTA
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // CTA bounce animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(ctaBounceAnim, {
//           toValue: 1.02,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(ctaBounceAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const triggerWinAnimation = () => {
//     setShowWinAnimation(true);
    
//     Animated.sequence([
//       // Confetti explosion
//       Animated.timing(confettiAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       // Win text animation
//       Animated.timing(winTextAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//       Animated.delay(2000),
//     ]).start(() => {
//       // Reset animations
//       Animated.parallel([
//         Animated.timing(confettiAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(winTextAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         setShowWinAnimation(false);
//       });
//     });
//   };

//   const toggleMatchExpansion = (matchId) => {
//     if (expandedMatch === matchId) {
//       setExpandedMatch(null);
//     } else {
//       setExpandedMatch(matchId);
//     }
//   };

//   const getRiskColor = (riskLevel) => {
//     switch (riskLevel) {
//       case 'Low': return '#24ad0cff';
//       case 'Medium': return '#FFA500';
//       case 'High': return '#FF4444';
//       default: return '#24ad0cff';
//     }
//   };

//   const getHighlightColor = (highlight) => {
//     switch (highlight) {
//       case 'Safe Pick': return '#24ad0cff';
//       case 'Medium Risk': return '#FFA500';
//       case 'High Value Pick': return '#FFD700';
//       default: return '#24ad0cff';
//     }
//   };

//   // Confetti particles
//   const renderConfetti = () => {
//     const confetti = [];
//     for (let i = 0; i < 50; i++) {
//       const left = Math.random() * width;
//       const animation = confettiAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, -height],
//       });
      
//       const rotate = confettiAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '720deg'],
//       });

//       const scale = confettiAnim.interpolate({
//         inputRange: [0, 0.5, 1],
//         outputRange: [0, 1, 0],
//       });

//       const colors = ['#39FF14', '#FFFF33', '#FF3366', '#00FF88', '#FFAA00'];
//       const color = colors[Math.floor(Math.random() * colors.length)];

//       confetti.push(
//         <Animated.View
//           key={i}
//           style={[
//             styles.confettiPiece,
//             {
//               left,
//               backgroundColor: color,
//               transform: [
//                 { translateY: animation },
//                 { rotate },
//                 { scale },
//               ],
//             },
//           ]}
//         />
//       );
//     }
//     return confetti;
//   };

//   const matchCardAnimations = featuredMatches.map((_, index) => 
//     matchCardsAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [100 * (index + 1), 0],
//     })
//   );

//   const carouselTranslateX = carouselAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -width],
//   });

//   const carouselOpacity = carouselAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1, 0.5, 0],
//   });

//   const renderMatchDetails = (match) => {
//     if (expandedMatch !== match.id) return null;

//     return (
//       <Animated.View style={styles.matchDetails}>
//         {/* Analysis Summary */}
//         <View style={styles.detailSection}>
//           <Text style={styles.detailTitle}>📊 AI Analysis</Text>
//           <Text style={styles.detailText}>{match.analysis.summary}</Text>
//         </View>

//         {/* Key Factors */}
//         <View style={styles.detailSection}>
//           <Text style={styles.detailTitle}>🔑 Key Factors</Text>
//           {match.analysis.keyFactors.map((factor, index) => (
//             <View key={index} style={styles.factorItem}>
//               <Text style={styles.bullet}>•</Text>
//               <Text style={styles.factorText}>{factor}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Stats */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>Home Form</Text>
//             <Text style={styles.statValue}>{match.stats.homeForm}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>Away Form</Text>
//             <Text style={styles.statValue}>{match.stats.awayForm}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>H2H</Text>
//             <Text style={styles.statValue}>{match.stats.h2h}</Text>
//           </View>
//         </View>

//         {/* Betting Recommendations */}
//         <View style={styles.recommendationsContainer}>
//           <View style={styles.recommendationColumn}>
//             <Text style={styles.recommendationTitle}>✅ Recommended</Text>
//             {match.analysis.recommendedBets.map((bet, index) => (
//               <Text key={index} style={styles.recommendedBet}>{bet}</Text>
//             ))}
//           </View>
//           <View style={styles.recommendationColumn}>
//             <Text style={styles.recommendationTitle}>❌ Avoid</Text>
//             {match.analysis.avoidBets.map((bet, index) => (
//               <Text key={index} style={styles.avoidBet}>{bet}</Text>
//             ))}
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <TouchableOpacity style={styles.actionButton}>
//             <Iconn name="scan-outline" size={16} color="#000000" />
//             <Text style={styles.actionText}>Quick Scan</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Iconn name="stats-chart-outline" size={16} color="#000000" />
//             <Text style={styles.actionText}>Full Analysis</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Iconn name="share-social-outline" size={16} color="#000000" />
//             <Text style={styles.actionText}>Share</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
//       {/* Win Animation Overlay */}
//       {showWinAnimation && (
//         <View style={styles.winOverlay}>
//           {renderConfetti()}
//           <Animated.View 
//             style={[
//               styles.winTextContainer,
//               {
//                 opacity: winTextAnim,
//                 transform: [{ scale: winTextAnim }]
//               }
//             ]}
//           >
//             <Text style={styles.winText}>🎉 WINNER! 🎉</Text>
//             <Text style={styles.winSubtext}>Another user just won ₦50,000 using BetScan!</Text>
//           </Animated.View>
//         </View>
//       )}

//       <Animated.ScrollView 
//         style={[
//           styles.scrollView, 
//           { 
//             opacity: fadeAnim,
//             transform: [{ translateY: slideUpAnim }]
//           }
//         ]}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Carousel Ads Section */}
//         <View style={styles.carouselContainer}>
//           <Animated.View 
//             style={[
//               styles.carouselContent,
//               {
//                 transform: [{ translateX: carouselTranslateX }],
//                 opacity: carouselOpacity,
//               }
//             ]}
//           >
//             <TouchableOpacity 
//               style={styles.carouselAd}
//               activeOpacity={0.8}
//               onPress={() => {
//                 // Handle ad click
//                 console.log('Ad clicked:', carouselAds[currentAdIndex].title);
//               }}
//             >
//               <Image 
//                 source={{ uri: carouselAds[currentAdIndex].image }}
//                 style={styles.carouselImage}
//                 resizeMode="cover"
//               />
//               <LinearGradient
//                 colors={['transparent', 'rgba(0,0,0,0.8)']}
//                 style={styles.carouselGradient}
//               >
//                 <View style={styles.carouselText}>
//                   <Text style={styles.carouselTitle}>
//                     {carouselAds[currentAdIndex].title}
//                   </Text>
//                   <Text style={styles.carouselDescription}>
//                     {carouselAds[currentAdIndex].description}
//                   </Text>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Carousel Indicators */}
//           <View style={styles.carouselIndicators}>
//             {carouselAds.map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.indicator,
//                   index === currentAdIndex && styles.activeIndicator,
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         {/* Header with Gradient */}
//         <LinearGradient
//           colors={['#000000', '#020202ff', '#000000']}
//           style={styles.header}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <Animated.View 
//             style={[
//               styles.headerContent,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideUpAnim }]
//               }
//             ]}
//           >
//             <View style={styles.logoContainer}>
//               <Animated.View
//                 style={{
//                   transform: [{ rotate: fadeAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0deg', '360deg']
//                   })}]
//                 }}
//               >
//                 {/* <Icon name="analytics" size={32} color="#24ad0cff" /> */}
//               </Animated.View>
//               <Text style={styles.logo}>Welcome to sb-Ai</Text>
//             </View>
//             <Text style={[styles.welcome,{marginTop:-7}]}>The Smarter Way to Analyze Your Bet Slip — Scan & Win. 🎯</Text>
//           </Animated.View>
//         </LinearGradient>

//         {/* Quick Stats */}
//         <Animated.View 
//           style={[
//             styles.quickStats,
//             { transform: [{ translateY: statsSlideAnim }] }
//           ]}
//         >
//           <Animated.View style={styles.statCard}>
//             <Icon name="trending-up" size={24} color="#24ad0cff" />
//             <Text style={styles.statNumber}>15K+</Text>
//             <Text style={styles.statLabel}>Analyses</Text>
//           </Animated.View>
          
//           <Animated.View 
//             style={[
//               styles.statCard,
//               { transform: [{ translateY: statsSlideAnim }] }
//             ]}
//           >
//             <Icon name="verified" size={24} color="#24ad0cff" />
//             <Text style={styles.statNumber}>92%</Text>
//             <Text style={styles.statLabel}>Accuracy</Text>
//           </Animated.View>
          
//           <Animated.View 
//             style={[
//               styles.statCard,
//               { transform: [{ translateY: statsSlideAnim }] }
//             ]}
//           >
//             <Icon name="savings" size={24} color="#24ad0cff" />
//             <Text style={styles.statNumber}>₦16M+</Text>
//             <Text style={styles.statLabel}>Winners</Text>
//           </Animated.View>
//         </Animated.View>

//         {/* Main CTA Card */}
//         <Animated.View 
//           style={[
//             styles.mainCTACard,
//             { 
//               transform: [
//                 { scale: scaleAnim },
//                 { scale: ctaBounceAnim }
//               ] 
//             }
//           ]}
//         >
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('Analysis')}
//             activeOpacity={0.9}
//           >
//             <LinearGradient
//               colors={['#24ad0cff', '#01b461ff', '#24ad0cff']}
//               style={styles.mainCTAGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Animated.View 
//                 style={[
//                   styles.ctaContent,
//                   { transform: [{ scale: pulseAnim }] }
//                 ]}
//               >
//                 <View style={styles.ctaIcon}>
//                   <Iconn name="qr-code-outline" size={40} color="#d2d0d0ff" />
//                 </View>
//                 <View style={styles.ctaText}>
//                   <Text style={styles.ctaTitle}>Scan Bet & Win</Text>
//                   <Text style={styles.ctaSubtitle}>Instant AI Analysis — Only ₦50</Text>
//                   <Text style={styles.ctaDescription}>
//                     Stop getting cut by 1 or 2 Identify risky games instantly
//                   </Text>
//                 </View>
//                 <Animated.View
//                   style={{
//                     transform: [{
//                       translateX: pulseAnim.interpolate({
//                         inputRange: [1, 1.05],
//                         outputRange: [0, 5]
//                       })
//                     }]
//                   }}
//                 >
//                   <Icon name="arrow-forward" size={24} color="#000000" />
//                 </Animated.View>
//               </Animated.View>
//             </LinearGradient>
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Enhanced Featured Matches */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🔥 Today's Top Picks</Text>
//           <View style={styles.matchesList}>
//             {featuredMatches.map((match, index) => (
//               <Animated.View
//                 key={match.id}
//                 style={{
//                   transform: [{ translateY: matchCardAnimations[index] }],
//                   opacity: matchCardsAnim
//                 }}
//               >
//                 <TouchableOpacity 
//                   style={styles.matchCard}
//                   onPress={() => toggleMatchExpansion(match.id)}
//                   activeOpacity={0.8}
//                 >
//                   {/* League Header */}
//                   <View style={styles.leagueHeader}>
//                     <Text style={styles.leagueText}>{match.league}</Text>
//                     <View style={[styles.highlightBadge, { backgroundColor: getHighlightColor(match.highlight) }]}>
//                       <Text style={styles.highlightText}>{match.highlight}</Text>
//                     </View>
//                   </View>

//                   {/* Teams Section */}
//                   <View style={styles.teamsContainer}>
//                     <View style={styles.team}>
//                       <Image 
//                         source={{ uri: match.teamLogos.home }} 
//                         style={styles.teamLogo}
//                         defaultSource={{ uri: 'https://via.placeholder.com/40/333333/FFFFFF?text=TEAM' }}
//                       />
//                       <Text style={styles.teamName}>{match.teams.split(' vs ')[0]}</Text>
//                     </View>
                    
//                     <View style={styles.vsContainer}>
//                       <Text style={styles.vsText}>VS</Text>
//                     </View>
                    
//                     <View style={styles.team}>
//                       <Text style={styles.teamName}>{match.teams.split(' vs ')[1]}</Text>
//                       <Image 
//                         source={{ uri: match.teamLogos.away }} 
//                         style={styles.teamLogo}
//                         defaultSource={{ uri: 'https://via.placeholder.com/40/333333/FFFFFF?text=TEAM' }}
//                       />
//                     </View>
//                   </View>

//                   {/* Prediction & Stats */}
//                   <View style={styles.predictionContainer}>
//                     <View style={styles.predictionMain}>
//                       <Text style={styles.predictionLabel}>AI Prediction</Text>
//                       <Text style={styles.predictionValue}>{match.aiPrediction}</Text>
//                     </View>
                    
//                     <View style={styles.statsRow}>
//                       <View style={styles.statPill}>
//                         <Text style={styles.statPillLabel}>Confidence</Text>
//                         <View style={styles.confidenceBadge}>
//                           <Text style={styles.confidenceText}>{match.confidence}%</Text>
//                         </View>
//                       </View>
                      
//                       <View style={styles.statPill}>
//                         <Text style={styles.statPillLabel}>Odds</Text>
//                         <Text style={styles.oddsText}>{match.odds}</Text>
//                       </View>
                      
//                       <View style={styles.statPill}>
//                         <Text style={styles.statPillLabel}>Risk</Text>
//                         <View style={[styles.riskBadge, { backgroundColor: getRiskColor(match.riskLevel) }]}>
//                           <Text style={styles.riskText}>{match.riskLevel}</Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Time & Actions */}
//                   <View style={styles.matchFooter}>
//                     <View style={styles.timeContainer}>
//                       <Iconn name="time-outline" size={14} color="#CCCCCC" />
//                       <Text style={styles.matchTime}>{match.time}</Text>
//                       <Text style={styles.matchDate}>{match.date}</Text>
//                     </View>
                    
//                     <TouchableOpacity 
//                       style={styles.quickScanBtn}
//                       onPress={(e) => {
//                         e.stopPropagation();
//                         triggerWinAnimation();
//                       }}
//                     >
//                       <Iconn name="scan-outline" size={14} color="#000000" />
//                       <Text style={styles.quickScanText}>Quick Scan</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Expandable Details */}
//                   {renderMatchDetails(match)}
                  
//                   {/* Expand/Collapse Indicator */}
//                   <View style={styles.expandIndicator}>
//                     <Iconn 
//                       name={expandedMatch === match.id ? "chevron-up" : "chevron-down"} 
//                       size={20} 
//                       color="#24ad0cff" 
//                     />
//                   </View>
//                 </TouchableOpacity>
//               </Animated.View>
//             ))}
//           </View>
//         </View>

//         {/* How It Works */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}> How It Works</Text>
//           <View style={styles.stepsContainer}>
//             {[1, 2, 3].map((step, index) => (
//               <Animated.View
//                 key={step}
//                 style={{
//                   opacity: fadeAnim,
//                   transform: [{
//                     translateY: fadeAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [20 * (index + 1), 0]
//                     })
//                   }]
//                 }}
//               >
//                 <View style={styles.step}>
//                   <Animated.View 
//                     style={[
//                       styles.stepIcon,
//                       {
//                         transform: [{
//                           scale: pulseAnim.interpolate({
//                             inputRange: [1, 1.05],
//                             outputRange: [1, 1.1]
//                           })
//                         }]
//                       }
//                     ]}
//                   >
//                     <Text style={styles.stepNumber}>{step}</Text>
//                   </Animated.View>
//                   <Text style={styles.stepTitle}>
//                     {step === 1 ? 'Upload Slip' : step === 2 ? 'AI Analysis' : 'Win Smart'}
//                   </Text>
//                   <Text style={styles.stepDescription}>
//                     {step === 1
//                       ? 'Take photo of \nyour bet slipfrom \nany bookmaker'
//                       : step === 2
//                       ? 'Get confidence \nscoresand risk \nanalysis'
//                       : 'Remove risky \ngames and \nincrease chances'}
//                   </Text>
//                 </View>
//                 {index < 2 && <View style={styles.stepConnector} />}
//               </Animated.View>
//             ))}
//           </View>
//         </View>

//         {/* Supported Platforms */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🏆 Supported Bookmakers</Text>
//           <View style={styles.platformsGrid}>
//             {['Bet9ja', 'SportyBet', 'Nairabet', '1xBet', 'BetKing', 'MerryBet'].map((platform, index) => (
//               <Animated.View
//                 key={index}
//                 style={[
//                   styles.platformCard,
//                   {
//                     opacity: fadeAnim,
//                     transform: [{
//                       scale: fadeAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [0.5, 1]
//                       })
//                     }]
//                   }
//                 ]}
//               >
//                 <Text style={styles.platformText}>{platform}</Text>
//               </Animated.View>
//             ))}
//           </View>
//         </View>

//         {/* Bottom Spacer for Navigation */}
//         <View style={styles.bottomSpacer} />
//       </Animated.ScrollView>

//       {/* Fixed Bottom Navigation */}
//       <BottomNav 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         scaleAnim={scaleAnim}
//         navigation={navigation}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 100,
//   },
//   // Carousel Styles
//   carouselContainer: {
//     height: 160,
//     marginLeft:15,
//     marginRight:15,
//     marginTop:15,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#111111',
//   },
//   carouselContent: {
//     flex: 1,
//   },
//   carouselAd: {
//     flex: 1,
//     position: 'relative',
//   },
//   carouselImage: {
//     width: '100%',
//     height: '100%',
//   },
//   carouselGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//     justifyContent: 'flex-end',
//     padding: 15,
//   },
//   carouselText: {
//     paddingBottom: 10,
//   },
//   carouselTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 5,
//   },
//   carouselDescription: {
//     fontSize: 14,
//     color: '#CCCCCC',
//   },
//   carouselIndicators: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 10,
//     left: 0,
//     right: 0,
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.4)',
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#24ad0cff',
//     width: 20,
//   },
//   header: {
//     paddingTop: 18,
//     paddingBottom:30,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 30,
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   logo: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginLeft: 10,
//   },
//   welcome: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginTop: 10,
//     textAlign: 'center',
//     alignContent:'center',
//   },
//   quickStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     marginTop: -30,
//   },
//   statCard: {
//     alignItems: 'center',
//     backgroundColor: '#111111',
//     padding: 15,
//     borderRadius: 15,
//     flex: 1,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: '#656464ff',
//   },
//   statNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#24ad0cff',
//     marginTop: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     marginTop: 2,
//   },
//   mainCTACard: {
//     marginLeft: 20,
//     marginRight: 20,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: "#24ad0cff",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 15,
//   },
//   mainCTAGradient: {
//     padding: 25,
//   },
//   ctaContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   ctaIcon: {
//     backgroundColor: '#000000',
//     padding: 15,
//     borderRadius: 20,
//   },
//   ctaText: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   ctaTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 2,
//   },
//   ctaSubtitle: {
//     fontSize: 16,
//     color: '#000000',
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   ctaDescription: {
//     fontSize: 12,
//     color: '#000000',
//     opacity: 0.9,
//   },
//   section: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#24ad0cff',
//     marginBottom: 15,
//   },
//   matchesList: {
//     gap: 12,
//   },
//   // Enhanced Match Card Styles
//   matchCard: {
//     backgroundColor: '#111111',
//     padding: 18,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#222222',
//   },
//   leagueHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   leagueText: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     fontWeight: '600',
//   },
//   highlightBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   highlightText: {
//     fontSize: 10,
//     color: '#000000',
//     fontWeight: 'bold',
//   },
//   teamsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   team: {
//     flex: 1,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   teamLogo: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//   },
//   teamName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginHorizontal: 8,
//     textAlign: 'center',
//   },
//   vsContainer: {
//     paddingHorizontal: 10,
//   },
//   vsText: {
//     fontSize: 12,
//     color: '#24ad0cff',
//     fontWeight: 'bold',
//   },
//   predictionContainer: {
//     marginBottom: 15,
//   },
//   predictionMain: {
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   predictionLabel: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     marginBottom: 4,
//   },
//   predictionValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#24ad0cff',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statPill: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statPillLabel: {
//     fontSize: 10,
//     color: '#CCCCCC',
//     marginBottom: 4,
//   },
//   confidenceBadge: {
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   confidenceText: {
//     fontSize: 10,
//     color: '#000000',
//     fontWeight: 'bold',
//   },
//   oddsText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   riskBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   riskText: {
//     fontSize: 10,
//     color: '#000000',
//     fontWeight: 'bold',
//   },
//   matchFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   matchTime: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     marginLeft: 4,
//     marginRight: 8,
//   },
//   matchDate: {
//     fontSize: 10,
//     color: '#666666',
//   },
//   quickScanBtn: {
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quickScanText: {
//     color: '#000000',
//     fontWeight: 'bold',
//     fontSize: 10,
//     marginLeft: 4,
//   },
//   expandIndicator: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   // Match Details Styles
//   matchDetails: {
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#222222',
//   },
//   detailSection: {
//     marginBottom: 15,
//   },
//   detailTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#24ad0cff',
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     lineHeight: 16,
//   },
//   factorItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 6,
//   },
//   bullet: {
//     color: '#24ad0cff',
//     marginRight: 8,
//     fontSize: 14,
//   },
//   factorText: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     flex: 1,
//     lineHeight: 16,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#1A1A1A',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: '#CCCCCC',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   recommendationsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   recommendationColumn: {
//     flex: 1,
//     paddingHorizontal: 8,
//   },
//   recommendationTitle: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   recommendedBet: {
//     fontSize: 10,
//     color: '#24ad0cff',
//     marginBottom: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     backgroundColor: 'rgba(36, 173, 12, 0.1)',
//     borderRadius: 4,
//   },
//   avoidBet: {
//     fontSize: 10,
//     color: '#FF4444',
//     marginBottom: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     backgroundColor: 'rgba(255, 68, 68, 0.1)',
//     borderRadius: 4,
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#24ad0cff',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   actionText: {
//     color: '#000000',
//     fontWeight: 'bold',
//     fontSize: 10,
//     marginLeft: 4,
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   step: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   stepIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#24ad0cff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   stepNumber: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   stepTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   stepDescription: {
//     fontSize: 12,
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   stepConnector: {
//     width: 20,
//     height: 2,
//     backgroundColor: '#24ad0cff',
//     marginTop: 25,
//     opacity: 0.5,
//   },
//   platformsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   platformCard: {
//     backgroundColor: '#111111',
//     padding: 15,
//     borderRadius: 12,
//     minWidth: '30%',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#333333',
//   },
//   platformText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 12,
//   },
//   bottomSpacer: {
//     height: 30,
//   },
//   // Win Animation Styles
//   winOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1000,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   confettiPiece: {
//     position: 'absolute',
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   winTextContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     padding: 30,
//     borderRadius: 20,
//     borderWidth: 3,
//     borderColor: '#24ad0cff',
//     alignItems: 'center',
//   },
//   winText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#24ad0cff',
//     marginBottom: 10,
//   },
//   winSubtext: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;