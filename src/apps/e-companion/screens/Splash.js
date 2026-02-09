

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const featureSlideAnim = useRef(new Animated.Value(30)).current;
  const featureOpacityAnim = useRef(new Animated.Value(0)).current;

  const handleNavigation = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('CompanionHome');
    });
  };

  useEffect(() => {
    // Start all animations when component mounts
    Animated.parallel([
      // Title animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      
      // Scale animation for subtitle
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),

      // Features list animation
      Animated.timing(featureSlideAnim, {
        toValue: 0,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(featureOpacityAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  // Individual feature item animations with delays
  const renderFeatureItem = (iconName, text, index) => {
    const itemSlideAnim = useRef(new Animated.Value(40)).current;
    const itemOpacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(itemSlideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(itemOpacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]).start();
      }, index * 200); // Stagger delay

      return () => clearTimeout(timer);
    }, []);

    return (
      <Animated.View
        style={[
          styles.featureItem,
          {
            opacity: itemOpacityAnim,
            transform: [{ translateY: itemSlideAnim }],
          },
        ]}
      >
        <View style={styles.featureIcon}>
          <Icon name={iconName} size={20} color="#FF3366" />
        </View>
        <Text style={styles.featureText}>{text}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
        }}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  { translateY: slideUpAnim },
                ],
              }}
            >
              <Text style={styles.welcomeTitle}>
                Welcome to{'\n'}E-Companion
              </Text>
            </Animated.View>
            
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text style={styles.welcomeSubtitle}>
                Where meaningful connections begin. Find someone to talk to, be a listener, 
                or join exciting events - your journey to authentic relationships starts here.
              </Text>
            </Animated.View>

            {/* Features List */}
            <Animated.View 
              style={[
                styles.featuresList,
                {
                  opacity: featureOpacityAnim,
                  transform: [{ translateY: featureSlideAnim }],
                }
              ]}
            >
              {renderFeatureItem("chatbubble-ellipses", "Connect with verified companions", 0)}
              {renderFeatureItem("ear-outline", "Earn as a professional listener", 1)}
              {renderFeatureItem("calendar", "Join exclusive social events", 2)}
            </Animated.View>
          </View>

          {/* Footer with Button */}
          <View style={styles.footer}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleNavigation}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FF3366', '#FF6F00']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Icon name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    gap: 20,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 10,
  },
  secondaryButton: {
    paddingVertical: 15,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },
});