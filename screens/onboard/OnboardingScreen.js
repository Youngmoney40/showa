import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const cardImages = [
  require('../../assets/images/showaa.jpg'), 
  require('../../assets/images/show.jpg'),
  require('../../assets/images/dad.jpg'),
];

const OnboardingScreen = ({navigation}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const { width, height } = useWindowDimensions();

  // Responsive card sizing
  const CARD_WIDTH = width * 0.45;
  const CARD_HEIGHT = CARD_WIDTH * 1.35;

  // Auto-changing card images
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentImageIndex((prev) => (prev + 1) % cardImages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleGetStarted = () => {
    navigation.navigate('Signin_two');
  };

  const handleLogin = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Image Stack */}
          <View style={[styles.imageContainer, { height: height * 0.5 }]}>
            {/* Left Card */}
            <Animated.View
              style={[
                styles.card,
                styles.leftCard,
                { 
                  opacity: fadeAnim,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
              ]}
            >
              <Image
                source={cardImages[currentImageIndex]}
                style={styles.image}
                resizeMode="cover"
              />
            </Animated.View>

            {/* Right Card */}
            <Animated.View
              style={[
                styles.card,
                styles.rightCard,
                { 
                  opacity: fadeAnim,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
              ]}
            >
              <Image
                source={cardImages[(currentImageIndex + 1) % cardImages.length]}
                style={styles.image}
                resizeMode="cover"
              />
            </Animated.View>

            {/* Center Card */}
            <Animated.View
              style={[
                styles.centerCard,
                { 
                  opacity: fadeAnim,
                  width: CARD_WIDTH * 1.1,
                  height: CARD_HEIGHT * 1.1,
                },
              ]}
            >
              <Image
                source={cardImages[(currentImageIndex + 2) % cardImages.length]}
                style={styles.image}
                resizeMode="cover"
              />
            </Animated.View>

            {/* Floating Elements */}
            <View style={styles.chatBubble}>
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color="#FF8A00"
              />
              <Text style={styles.emoji}>💜</Text>
            </View>

            <View style={styles.heartCircle}>
              <Ionicons
                name="heart"
                size={24}
                color="#ff375f"
              />
            </View>

            <View style={styles.likeBubble}>
              <MaterialCommunityIcons
                name="heart"
                size={16}
                color="#fff"
              />
              <Text style={styles.likeText}>+</Text>
            </View>

            <View style={styles.avatarContainer}>
              <Image
                source={cardImages[currentImageIndex]}
                style={styles.avatar}
              />
              <View style={styles.ring} />
            </View>
          </View>

          {/* Bottom Section */}
          <View style={[styles.bottomSection, { paddingBottom: height * 0.06, marginTop:-30 }]}>
            <Text style={[styles.title, { color: '#073ff8' }]}>
              Join Showa
            </Text>
            <Text style={styles.title}>Discover Amazing Stories</Text>
            <Text style={styles.subtitle}>
              Connect with friends, share your moments,
              watch short videos and explore your world.
            </Text>

            <TouchableOpacity
              style={[styles.button, { width: width - 50 }]}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton, { width: width - 50 }]}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, { color: '#405DE6' }]}>
                Already on Showa? Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  card: {
    position: 'absolute',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  leftCard: {
    transform: [{ rotate: '-14deg' }],
    left: 25,
    top: 30,
    zIndex: 1,
  },
  rightCard: {
    transform: [{ rotate: '13deg' }],
    right: 25,
    top: 40,
    zIndex: 2,
  },
  centerCard: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 15,
    backgroundColor: '#eee',
    zIndex: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartCircle: {
    position: 'absolute',
    left: 12,
    bottom: 20,
    zIndex: 10,
  },
  chatBubble: {
    position: 'absolute',
    top: 15,
    left: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 10,
  },
  emoji: {
    fontSize: 14,
    marginLeft: 5,
  },
  likeBubble: {
    position: 'absolute',
    top: 75,
    right: 25,
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 22,
    zIndex: 10,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  likeText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '700',
    fontSize: 14,
  },
  avatarContainer: {
    position: 'absolute',
    right: 40,
    bottom: 50,
    zIndex: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
  },
  ring: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#7B61FF',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#405DE6',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#405DE6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#405DE6',
    marginTop: 10,
    shadowColor: 'transparent',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});