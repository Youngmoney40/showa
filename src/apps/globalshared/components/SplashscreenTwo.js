import React, { useEffect, useRef, useState } from "react";
import { 
  View, Text, StyleSheet, Image, Animated, Easing, TouchableOpacity, 
  Dimensions, Modal, ScrollView, Pressable 
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Sample user data
const userProfiles = [
  {
    id: 1,
    name: "Amaka Ikweawu",
    age: 26,
    distance: "2km",
    image: "https://images.scrolller.com/yocto/sexy-hot-chlhwur2dy-640x640.jpg",
    tagline: "Looking for boyfriend 💬"
  },
  {
    id: 2,
    name: "Chiamaka",
    age: 24,
    distance: "5km",
    image: "https://dynastyseries.com/wp-content/2020/01/Anise-@compliments2her-Thanks-in-Advance-J.-Alex-Photos-00710.jpg",
    tagline: "Looking for someone special ✨"
  },
  {
    id: 3,
    name: "Ngozi Abrahma",
    age: 27,
    distance: "3km",
    image: "https://img6.arthub.ai/654891d3-f39.webp",
    tagline: "Looking for Sugar dady"
  },
  {
    id: 4,
    name: "Loverth Suneyday",
    age: 24,
    distance: "3km",
    image: "https://www.thesun.co.uk/wp-content/uploads/2024/01/emily-pellegrini-meet-ai-model-869429097.jpg?strip=all&w=933",
    tagline: "Ready to mingle 😊"
  },
  {
    id: 5,
    name: "Micheal Ilarry",
    age: 24,
    distance: "3km",
    image: "https://avatars.mds.yandex.net/i?id=6733a6ada84b0cd258b928f08ba2a57b4f1283b1-15156312-images-thumbs&n=13",
    tagline: "In need of sexy lady"
  }
];

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const badgeScaleAnim = useRef(new Animated.Value(0)).current;
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const currentProfile = userProfiles[currentProfileIndex];

  useEffect(() => {
    // Main animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.spring(badgeScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      })
    ]).start();

    // Pulsing animation for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Auto-change profile every 5 seconds
    const profileInterval = setInterval(() => {
      setCurrentProfileIndex((prevIndex) => 
        (prevIndex + 1) % userProfiles.length
      );
      
      // Animate badge on profile change
      badgeScaleAnim.setValue(0);
      Animated.spring(badgeScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearInterval(profileInterval);
  }, []);

  const handleGetStarted = () => {
    setModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setModalVisible(false);
    // Navigate to the next screen after accepting terms
    setTimeout(() => navigation.navigate('signup'), 500);
  };

  // Interpolate progress width
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF3366", "#FF6F00", "#FF3366"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background decorative elements */}
        <View style={styles.circle1}></View>
        <View style={styles.circle2}></View>
        <View style={styles.circle3}></View>
        
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Image
            source={{ uri: currentProfile.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Glass Profile Badge - Top Left Corner */}
          <Animated.View 
            style={[
              styles.profileBadge,
              {
                transform: [{ scale: badgeScaleAnim }]
              }
            ]}
          >
            <View style={styles.glassBackground}>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeName}>{currentProfile.name}</Text>
                <View style={styles.badgeDetails}>
                  <View style={styles.badgeDetailItem}>
                    <Icon name="cake" size={12} color="#FFF" />
                    <Text style={styles.badgeDetailText}>{currentProfile.age}</Text>
                  </View>
                  <View style={styles.badgeDetailItem}>
                    <Icon name="location-on" size={12} color="#FFF" />
                    <Text style={styles.badgeDetailText}>{currentProfile.distance}</Text>
                  </View>
                </View>
                <Text style={styles.badgeTagline} numberOfLines={1}>{currentProfile.tagline}</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to e-Date</Text>
          <Text style={styles.tagline}>The Zone of Love</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              transform: [
                { scale: pulseAnim },
                { translateY: slideUpAnim }
              ],
              opacity: fadeAnim
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF3366", "#FF6F00"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[
            styles.footerText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.footer}>Join millions finding love today</Text>
        </Animated.View>

        {/* Progress bar with separate animation */}
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]} 
          />
        </View>
      </LinearGradient>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </Pressable>
            </View>
            
            <ScrollView style={styles.termsContainer}>
              <Text style={styles.termsHeading}>Welcome to eDate!</Text>
              <Text style={styles.termsText}>
                By using eDate, you agree to the following terms and conditions:
              </Text>
              
              <Text style={styles.termsList}>
                1. You are at least 18 years old.{'\n'}
                2. You will not post inappropriate content.{'\n'}
                3. You will respect other users and their privacy.{'\n'}
                4. You understand that we use your data to improve your experience.{'\n'}
                5. You will not engage in harassment or abusive behavior.{'\n'}
                6. You are solely responsible for your interactions with other users.{'\n'}
                7. You understand that we may use your photos and information to show to potential matches.{'\n'}
                8. You will not create fake profiles or misrepresent yourself.{'\n'}
                9. You agree to our privacy policy and data usage terms.{'\n'}
                10. You can delete your account and data at any time.
              </Text>
              
              <Text style={styles.termsText}>
                Please read our full Terms of Service and Privacy Policy on our website. By clicking "Accept", you acknowledge that you have read, understood, and agree to be bound by these terms.
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={[styles.acceptButton, acceptedTerms ]}
              onPress={handleAcceptTerms}
            
            >
              <LinearGradient
                colors={["#FF3366", "#FF6F00"]}
                style={styles.acceptButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.acceptButtonText}>
                  Accept & Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -100,
    left: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -50,
    right: -50,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: '30%',
    right: -50,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.5,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  // Glass badge styles
  profileBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  glassBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  badgeContent: {
    maxWidth: 140,
  },
  badgeName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeDetailText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgeTagline: {
    color: '#FFE082',
    fontSize: 12,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 8,
    
  },
  tagline: {
    fontSize: 20,
    color: '#FFE082',
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 30,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerText: {
    marginBottom: 20,
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFE082',
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3366',
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  termsText: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
    color: '#555',
  },
  termsList: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 22,
    color: '#555',
  },
  acceptButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
  },
  acceptButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  acceptButtonDisabled: {
    opacity: 0.7,
  },
});