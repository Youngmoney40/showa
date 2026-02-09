import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing,
  Dimensions,
  Alert,
  Modal,
  ScrollView 
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get('window');

export default function IdealMatchScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show welcome modal immediately
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animation for main content (will be hidden behind modal initially)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleCloseModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowWelcomeModal(false);
    });
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleContinue = () => {
    if (!selected) {
      Alert.alert("Selection Required", "Please select your ideal match preference to continue.");
      return;
    }
    

  navigation.navigate('interest', {
  ideaMatch: selected 
});
  };

  if (isSuccess) {
    return (
      <LinearGradient
        colors={["#FF3366", "#FF6F00", "#FF3366"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: successAnim,
              transform: [{
                scale: successAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.successIcon}>
            <Icon name="check" size={50} color="#FFF" />
          </View>
          <Text style={styles.successText}>Preference Saved!</Text>
          <Text style={styles.successSubtext}>Taking you to the next step...</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FF3366", "#FF6F00", "#FF3366"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Welcome Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalAnim,
                transform: [{
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Icon name="favorite" size={30} color="#FF3366" />
              </View>
              <Text style={styles.modalTitle}>Help Us Find Your Perfect Match! 💕</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                We're excited to help you find meaningful connections! To create the best possible matches, we need to understand your preferences.
              </Text>
              
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Personalized matching based on your interests</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Better compatibility with potential partners</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Higher quality connections that last</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Tailored experience just for you</Text>
                </View>
              </View>

              <Text style={styles.modalSubtext}>
                Your information is safe with us and will only be used to improve your matching experience.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF3366", "#FF6F00"]}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonText}>Let's Get Started!</Text>
                <Icon name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Decorative elements */}
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>What is your Ideal Match?</Text>
          <Text style={styles.subtitle}>Select your preference to find better matches</Text>
        </View>

        <View style={styles.optionsContainer}>
          {["Male", "Female", "All gender"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected === item && styles.selectedOption
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.iconContainer,
                  selected === item && styles.selectedIconContainer
                ]}>
                  <Icon 
                    name={
                      item === "Male" ? "male" : 
                      item === "Female" ? "female" : 
                      "group"
                    } 
                    size={24} 
                    color={selected === item ? "#FFF" : "#FF3366"} 
                  />
                </View>
                <Text
                  style={[
                    styles.optionText, 
                    selected === item && styles.selectedText
                  ]}
                >
                  {item}
                </Text>
              </View>
              
              {selected === item && (
                <View style={styles.checkmark}>
                  <Icon name="check-circle" size={24} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.primaryButton, !selected && styles.disabledButton]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!selected}
          >
            <LinearGradient
              colors={selected ? ["#FF3366", "#FF6F00"] : ["#CCC", "#AAA"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryText}>Continue</Text>
              <Icon name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    maxHeight: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF3366',
    textAlign: 'center',
    lineHeight: 28,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    marginTop: 15,
  },
  featureList: {
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  modalButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  // Existing styles remain the same...
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 100,
    left: -50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#FF3366',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#FF3366",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionText: {
    color: '#FF3366',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFF',
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  secondaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  secondaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});