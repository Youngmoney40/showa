
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
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.52;
const CARD_HEIGHT = CARD_WIDTH * 1.45;


const cardImages = [
  require('../../assets/images/showaa.jpg'), 
  require('../../assets/images/show.jpg'),
  require('../../assets/images/dad.jpg'),
];

const OnboardingScreen = ({navigation}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

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
    navigation.navigate('Signin_two')
    
    
  };

  const handleLogin = () => {
    navigation.navigate('EmailLogin')
  };

  return (
     <ScrollView>
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
     

      

      <View style={styles.container}>
        {/* Image Stack */}
        <View style={styles.imageContainer}>
          {/* Left Card */}
          <Animated.View
            style={[
              styles.card,
              styles.leftCard,
              { opacity: fadeAnim },
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
              { opacity: fadeAnim },
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
              { opacity: fadeAnim },
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
              size={20}
              color="#FF8A00"
            />
            <Text style={styles.emoji}>💜</Text>
          </View>

          <View style={styles.heartCircle}>
            <Ionicons
              name="heart"
              size={28}
              color="#ff375f"
            />
          </View>

          <View style={styles.likeBubble}>
            <MaterialCommunityIcons
              name="heart"
              size={18}
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
        <View style={styles.bottomSection}>
          <Text style={[styles.title, { color: '#073ff8' }]}>
            Join Showa
          </Text>
          <Text style={styles.title}>Discover Amazing Stories</Text>
          <Text style={styles.subtitle}>
            Connect with friends, share your moments,
            watch short videos and explore your world.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            {/* <FontAwesome
              name="arrow-right"
              size={18}
              color="#fff"
              style={{ marginLeft: 10 }}
            /> */}
          </TouchableOpacity>

         
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, { color: '#405DE6' }]}>
              Already have profile? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
    </ScrollView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 450,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 30,
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
    left: 45,
    top: 70,
    zIndex: 1,
  },
  rightCard: {
    transform: [{ rotate: '13deg' }],
    right: 45,
    top: 75,
    zIndex: 2,
  },
  centerCard: {
    width: CARD_WIDTH * 1.05,
    height: CARD_HEIGHT * 1.05,
    borderRadius: 30,
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
    left: 18,
    bottom: 30,
    zIndex: 10,
  },
  chatBubble: {
    position: 'absolute',
    top: 30,
    left: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    elevation: 6,
    zIndex: 10,
  },
  emoji: {
    fontSize: 16,
    marginLeft: 6,
  },
  likeBubble: {
    position: 'absolute',
    top: 105,
    right: 45,
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 25,
    zIndex: 10,
  },
  likeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '700',
  },
  avatarContainer: {
    position: 'absolute',
    right: 70,
    bottom: 70,
    zIndex: 10,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: '#fff',
  },
  ring: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#7B61FF',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: 35,
    backgroundColor: '#405DE6',
    width: width - 70,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#405DE6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#405DE6',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});






