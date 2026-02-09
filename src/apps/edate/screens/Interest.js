import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  Keyboard
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get('window');

const allInterests = [
  "Introvert", "Music", "Bookworm", "Photography",
  "Nightlife", "Dancing", "Fitness", "Travel",
  "Adventure", "Theatre", "Social media", "Plant lover",
  "Cooking", "Movies", "Gaming", "Art", 
  "Sports", "Yoga", "Foodie", "Shopping"
];

export default function InterestsScreen({ navigation, route}) {
  
  const {ideaMatch} = route.params || {} 
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('ideal_match',ideaMatch)
    // Animation on component mount
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

    // Animate progress bar based on selection count
    Animated.timing(progressWidth, {
      toValue: selected.length / 6,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const toggleInterest = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else if (selected.length < 6) {
      setSelected([...selected, item]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      Alert.alert("Selection Required", "Please select at least one interest to continue.");
      return;
    }
    

    navigation.navigate('profileSetup',{
      interests: selected,
      ideaMatch: ideaMatch

    });
  };

  const getIconForInterest = (interest) => {
    const iconMap = {
      "Introvert": "person",
      "Music": "music-note",
      "Bookworm": "menu-book",
      "Photography": "camera-alt",
      "Nightlife": "nightlight",
      "Dancing": "music-video",
      "Fitness": "fitness-center",
      "Travel": "flight",
      "Adventure": "terrain",
      "Theatre": "theaters",
      "Social media": "thumb-up",
      "Plant lover": "spa",
      "Cooking": "restaurant",
      "Movies": "movie",
      "Gaming": "sports-esports",
      "Art": "palette",
      "Sports": "sports-basketball",
      "Yoga": "self-improvement",
      "Foodie": "local-dining",
      "Shopping": "shopping-cart"
    };
    
    return iconMap[interest] || "favorite";
  };

  const filteredInterests = allInterests.filter(interest => 
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#FF3366", "#FF6F00", "#FF3366"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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
          <Text style={styles.title}>Show off your Interests</Text>
          <Text style={styles.subtitle}>
            Pick up to 6 things you love. It will help us match you with people with similar interests
          </Text>
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {selected.length} / 6 selected
              </Text>
              {selected.length > 0 && (
                <TouchableOpacity onPress={() => setSelected([])}>
                  <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Search bar */}
        {/* <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search interests..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View> */}

        {/* Interests grid */}
        <FlatList
          data={filteredInterests}
          numColumns={2}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.interest,
                selected.includes(item) && styles.selectedInterest,
                selected.length >= 6 && !selected.includes(item) && styles.disabledInterest
              ]}
              onPress={() => toggleInterest(item)}
              activeOpacity={0.7}
              disabled={selected.length >= 6 && !selected.includes(item)}
            >
              <View style={styles.interestContent}>
                <View style={[
                  styles.iconContainer,
                  selected.includes(item) && styles.selectedIconContainer
                ]}>
                  <Icon 
                    name={getIconForInterest(item)} 
                    size={20} 
                    color={selected.includes(item) ? "#FFF" : "#FF3366"} 
                  />
                </View>
                <Text
                  style={[
                    styles.interestText,
                    selected.includes(item) && styles.selectedText,
                  ]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </View>
              
              {selected.includes(item) && (
                <View style={styles.checkmark}>
                  <Icon name="check" size={16} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.interestsContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={selected.length === 0}
        >
          <LinearGradient
            colors={selected.length > 0 ? ["#FF3366", "#FF6F00"] : ["#CCC", "#AAA"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Icon name="arrow-forward" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: '#FFF',
    fontWeight: '600',
  },
  clearText: {
    color: '#FFE082',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFE082',
    borderRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  interestsContainer: {
    paddingBottom: 20,
  },
  interest: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    margin: 6,
    minHeight: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedInterest: {
    backgroundColor: '#FF3366',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#FF3366",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledInterest: {
    opacity: 0.5,
  },
  interestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestText: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  selectedText: {
    color: '#FFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});