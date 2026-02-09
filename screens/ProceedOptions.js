import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
  Easing,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function LoginOptionScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openBusinessModal = () => {
    setShowBusinessModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeBusinessModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      })
    ]).start(() => setShowBusinessModal(false));
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleBack = () => navigation.navigate('LinkingScreen');
  const goToUserLogin = () => navigation.navigate('PHome');
  const goToBusinessAccount = () => navigation.navigate('BusinessHome');

  const dynamicStyles = {
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
    appbar: { backgroundColor: 'transparent', elevation: 0, marginTop: 8 },
    brandText: { color: colors.text, fontSize: 28, fontWeight: 'bold', marginTop: 24, marginBottom: 8, letterSpacing: 0.5 },
    brandTagline: { color: colors.textSecondary || colors.text, fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 15, color: colors.textSecondary || colors.text, marginBottom: 20, letterSpacing: 0.5, textTransform: 'uppercase' },
    optionCard: { backgroundColor: colors.surface || '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border || '#e6ebf1', shadowColor: colors.shadow || '#0a2540', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.1 : 0.05, shadowRadius: 8, elevation: 2 },
    optionTitle: { fontSize: 17, color: colors.text, marginBottom: 4 },
    optionDesc: { fontSize: 14, color: colors.textSecondary || colors.text, lineHeight: 20 },
    modalOverlay: { flex: 1, backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: colors.surface || '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 32 },
    modalTitle: { fontSize: 20, color: colors.text },
    modalText: { fontSize: 16, color: colors.textSecondary || colors.text, lineHeight: 24, marginBottom: 24, textAlign: 'center' },
    highlight: { color: colors.primary },
    stepText: { fontSize: 16, color: colors.text, flex: 1 },
    modalButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
    modalButtonText: { color: '#fff', fontSize: 16 },
  };

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <Appbar.Header style={dynamicStyles.appbar}>
        <Appbar.BackAction color={colors.text} />
        <Appbar.Content title="" />
      </Appbar.Header>

      <Animated.View style={[styles.brandContainer, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LottieView
            source={require("../assets/animations/ConversationLottieAnimation.json")}
            autoPlay
            loop={true}
            style={styles.logo}
          />
        </Animated.View>
        <Text style={dynamicStyles.brandText}>Welcome to Showa</Text>
        <Text style={dynamicStyles.brandTagline}>Connect, share, and grow with your community</Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        <Animated.Text style={[dynamicStyles.sectionTitle, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
          Select Account Type
        </Animated.Text>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
          <TouchableOpacity 
            style={dynamicStyles.optionCard} 
            onPress={goToUserLogin}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Icon name="person-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={dynamicStyles.optionTitle}>Personal Account</Text>
                <Text style={dynamicStyles.optionDesc}>Connect with friends, share moments, and explore content</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary || colors.text} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }], marginTop: 12 }}>
          <TouchableOpacity 
            style={[dynamicStyles.optionCard, {backgroundColor: colors.primary}]} 
            onPress={openBusinessModal}
            activeOpacity={0.8}
          >
            <View style={[styles.optionContent]}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.18)' }]}>
                <Icon name="business-outline" size={24} color="#fff" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[dynamicStyles.optionTitle, {color:'#fff'}]}>Business Account</Text>
                <Text style={[dynamicStyles.optionDesc, {color:'#fff'}]}>Grow your brand, engage customers, and analyze performance</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <Modal
        visible={showBusinessModal}
        transparent
        animationType="none"
        onRequestClose={closeBusinessModal}
      >
        <Animated.View style={[dynamicStyles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeBusinessModal}
          />
          
          <Animated.View style={[dynamicStyles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Switch to Business Account</Text>
              <TouchableOpacity onPress={()=>setShowBusinessModal(false)}>
                <Icon name="close" size={24} color={colors.textSecondary || colors.text} />
              </TouchableOpacity>
            </View>
            
            <LottieView
              source={require('../assets/animations/Business.json')}
              autoPlay
              loop
              style={styles.modalAnimation}
            />
            
            <Text style={dynamicStyles.modalText}>
              Your account is currently set to <Text style={dynamicStyles.highlight}>Personal mode</Text>.
              To access business features:
            </Text>
            
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={dynamicStyles.stepText}>Go to Homepage</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={dynamicStyles.stepText}>Tap the 3-dot menu</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={dynamicStyles.stepText}>Select "Switch Account"</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={dynamicStyles.stepText}>Choose Business Account</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={dynamicStyles.modalButton}
              onPress={()=>navigation.replace('PHome')}
            >
              <Text style={dynamicStyles.modalButtonText}>Proceed with personal</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 300,
    height: 200,
    marginTop: -50
  },
  optionsContainer: {
    marginTop: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAnimation: {
    width: '100%',
    height: 190,
    alignSelf: 'center',
    marginVertical: 16,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0750b5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
  },
});