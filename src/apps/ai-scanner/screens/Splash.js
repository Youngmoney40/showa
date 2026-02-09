import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SplashScreen = ({ navigation }) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    // Start the spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate to Signup screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('AiLogin');
    }, 3000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      <Animated.View style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}>
        <Icon name="analytics" size={80} color="#39FF14" />
      </Animated.View>
      
      <Text style={styles.appName}>BETSCAN</Text>
      <Text style={styles.tagline}>Smart Bet Analysis</Text>
      
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.dot, styles.dot1]} />
          <Animated.View style={[styles.dot, styles.dot2]} />
          <Animated.View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFF33',
    marginBottom: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  loadingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#39FF14',
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
});

export default SplashScreen;