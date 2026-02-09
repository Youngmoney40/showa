import React, { useRef, useEffect, useState } from 'react';
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
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleDaddy = useRef(new Animated.Value(1)).current;
  const buttonScaleBoy = useRef(new Animated.Value(1)).current;
  const featureSlideAnim = useRef(new Animated.Value(30)).current;
  const featureOpacityAnim = useRef(new Animated.Value(0)).current;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setModalVisible(true);
  };

  const handleNavigationDaddy = () => {
    Animated.sequence([
      Animated.timing(buttonScaleDaddy, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleDaddy, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleRoleSelection('daddy');
    });
  };

  const handleNavigationBoy = () => {
    Animated.sequence([
      Animated.timing(buttonScaleBoy, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleBoy, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleRoleSelection('boy');
    });
  };

  const handlePaymentConfirm = () => {
    setModalVisible(false);
    navigation.navigate('ExploreSugar')
   
  };

  useEffect(() => {
    // Start all animations when component mounts
    Animated.parallel([
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
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
      }, index * 200);

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
          uri: 'https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg'
        }}
        style={styles.backgroundImage}
        blurRadius={1}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }}
            >
              <Text style={styles.welcomeTitle}>
                Elite Sugar {'\n'}Connections
              </Text>
            </Animated.View>
            
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text style={styles.welcomeSubtitle}>
                Discover exclusive mutually beneficial relationships with verified, sophisticated partners. 
                
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
              
              
              {renderFeatureItem("trending-up", "Mutually beneficial arrangements", 0)}
              {renderFeatureItem("sparkles", "Luxurious lifestyle experiences", 1)}
            </Animated.View>
          </View>

          {/* Footer with Buttons */}
          <View style={styles.footer}>
          
            
           

            {/* Sugar Boy Button */}
            <Animated.View style={{ transform: [{ scale: buttonScaleBoy }] }}>
              <TouchableOpacity 
                style={[styles.roleButton, styles.boyButton]}
                onPress={handleNavigationBoy}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FF6F00', '#FF6F00']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' }}
                    style={styles.buttonImage}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <LinearGradient
                      colors={['rgba(255, 111, 0, 1)', 'rgba(255, 111, 0, 1)']}
                      style={styles.buttonImageOverlay}
                    >
                      <Icon name="person" size={24} color="#FFF" style={styles.buttonIcon} />
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.roleButtonText}>GET STARTED</Text>
                        <Text style={styles.roleButtonSubtext}>Receive support & guidance</Text>
                      </View>
                      <Icon style={{backgroundColor:'#fff', borderRadius:50,padding:10}} name="arrow-forward" size={20} color="#000" />
                    </LinearGradient>
                  </ImageBackground>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#FF3366', '#FF6F00']}
              style={styles.modalHeader}
            >
              
              <Text style={styles.modalTitle}>Premium Access </Text>
            </LinearGradient>

            <ScrollView style={styles.modalBody}>
              <View style={styles.paymentInfo}>
                <Icon name="star" size={50} color="#FF3366" style={styles.paymentIcon} />
                <Text style={styles.paymentAmount}>₦50,000</Text>
                <Text style={styles.paymentDescription}>
                  One-time premium access fee
                </Text>
              </View>

              <View style={styles.benefitsList}>
                <Text style={styles.benefitsTitle}>What you get:</Text>
                
                <View style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#FF3366" />
                  <Text style={styles.benefitText}>Full access to verified profiles</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#FF3366" />
                  <Text style={styles.benefitText}>Premium matching algorithm</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#FF3366" />
                  <Text style={styles.benefitText}>Exclusive event invitations</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#FF3366" />
                  <Text style={styles.benefitText}>Priority customer support</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#FF3366" />
                  <Text style={styles.benefitText}>Discreet and secure platform</Text>
                </View>
              </View>

              <Text style={styles.noteText}>
                This one-time payment ensures our community remains exclusive and verified.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePaymentConfirm}
              >
                <LinearGradient
                  colors={['#FF3366', '#FF6F00']}
                  style={styles.confirmButtonGradient}
                >
                  <Icon name="card" size={20} color="#FFF" />
                  <Text style={styles.confirmButtonText}>Pay ₦50,000</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -100,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 50,
    marginTop:50,
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40, 
    fontWeight: '500',
  },
  featuresList: {
    gap: 15,
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.3)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 51, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    gap: 15,
  },
  chooseText: {
    fontSize: 18,
    color: '#FF3366',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  roleButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonImage: {
    width: '100%',
    height: 89,
  },
  buttonImageOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  roleButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    gap: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  modalBody: {
    padding: 25,
  },
  paymentInfo: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    borderRadius: 15,
  },
  paymentIcon: {
    marginBottom: 10,
  },
  paymentAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF3366',
    marginBottom: 5,
  },
  paymentDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  benefitText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  modalButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 8,
  },
  confirmButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});