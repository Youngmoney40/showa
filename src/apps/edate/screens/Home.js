import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
  FlatList,
  StatusBar
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BlurView } from "@react-native-community/blur";
import BottomNav from '../components/BottomNav';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../globalshared/apiRoute/api_config";

const { width, height } = Dimensions.get('window');

// Quick action boxes
const quickActions = [
  { id: 1, icon: "favorite", title: "Matches", color: "#FF3366" },
  { id: 2, icon: "search", title: "Discover", color: "#4A90E2" },
  { id: 3, icon: "chat", title: "Messages", color: "#FF3366" },
  { id: 4, icon: "notifications", title: "Alerts", color: "#4A90E2" },
  { id: 5, icon: "person", title: "Profile", color: "#FF3366" }
];

// Ads data
const ads = [
  {
    id: 1,
    title: "Premium Membership",
    description: "Get seen by more people!",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0aW5nJTIwYXBwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80",
    cta: "Upgrade Now"
  },
  {
    id: 2,
    title: "Valentine's Special",
    description: "50% off on premium features",
    image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbGVudGluZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
    cta: "Get Offer"
  },
  {
    id: 3,
    title: "Icebreaker Pack",
    description: "100+ conversation starters",
    image: "https://images.unsplash.com/photo-1579208575657-c5a2b5c6f57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYXR0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80",
    cta: "Learn More"
  }
];

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("discover");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [usermatchData, setMatchData] = useState([]);
  const [dailyMatches, setDailyMatches] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const adAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // animations for online status
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Calculate age from date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '?';
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return '?';
    }
  };

  //////// NEW 
  const getProfileImage = (profile) => {
  if (profile.profile_images_data && profile.profile_images_data.length > 0) {
    const imagePath = profile.profile_images_data[0].image;
    return `https://res.cloudinary.com/dinmz7eh9/${imagePath}`;
  }
  // Default images based on gender
  if (profile.gender?.toLowerCase() === 'male') {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  }
  return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
};

// Get all profile images or defaults with full URLs
const getProfileImages = (profile) => {
  if (profile.profile_images_data && profile.profile_images_data.length > 0) {
    return profile.profile_images_data.map(img => 
      `https://res.cloudinary.com/dinmz7eh9/${img.image}`
    );
  }
  // Return array of default images
  return [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  ];
};

  // Get first profile image or default
  // const getProfileImage = (profile) => {if (profile.profile_images && profile.profile_images.length > 0) {
  //     return profile.profile_images
  // [0].image;
  //   }
  //   // Default images based on gender
  //   if (profile.gender?.toLowerCase() === 'male') {
  //     return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  //   }
  //   return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  // };

  // Get all profile images or defaults
  // const getProfileImages = (profile) => {
  //   console.log('Profile_image',profile.profile_images_data)



  //   if (profile.profile_images && profile.profile_images.length > 0) {
  //     return profile.profile_images.map(img => img.image);
  //   }
  //   // Return array of default images
  //   return [
  //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  //     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  //   ];
  // };

  // Fetch matching users data
  useEffect(() => {
    const fetchMatchingUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const res = await axios.get(`http://192.168.1.105:8000/api/discover/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.status === 200) {
          console.log('Fetch profile completedddddddddddddd', res.data);
          const profiles = res.data;
          
          // Set all matched users
          setMatchData(profiles);
          
          // Set daily matches (first 4 profiles)
          setDailyMatches(profiles.slice(0, 4));
          
          // Set nearby users (all profiles for now)
          setNearbyUsers(profiles);
          
        } else {
          console.log('Failed to fetch profile');
        }
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    };
    
    fetchMatchingUsers();
  }, []);

  // Auto-change featured profile image every 50-60 seconds
  useEffect(() => {
    if (usermatchData.length > 0) {
      const interval = setInterval(() => {
        changeImage();
      }, 50000 + Math.random() * 10000);

      return () => clearInterval(interval);
    }
  }, [currentProfileIndex, currentImageIndex, usermatchData]);

  // Other useEffect hooks remain the same...
  useEffect(() => {
    const adInterval = setInterval(() => {
      Animated.timing(adAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      }).start(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        Animated.timing(adAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true
        }).start();
      });
    }, 5000);

    return () => clearInterval(adInterval);
  }, []);

  // Continuous rotation animation for premium badge
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  // Online now animation effects
  useEffect(() => {
    // Pulse animation for online status
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    ).start();

    // Bounce animation for the entire status container
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const pulseInterpolate = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 1.2]
  });

  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5]
  });

  const glowInterpolate = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const changeImage = () => {
    if (usermatchData.length === 0) return;
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      const currentProfile = usermatchData[currentProfileIndex];
      const images = getProfileImages(currentProfile);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    });
  };

  const changeProfile = () => {
    if (usermatchData.length === 0) return;
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % usermatchData.length);
      setCurrentImageIndex(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();
  };

  // Get current featured user
  const featuredUser = usermatchData.length > 0 ? usermatchData[currentProfileIndex] : null;
  const featuredUserImages = featuredUser ? getProfileImages(featuredUser) : [];
  const currentImage = featuredUser ? featuredUserImages[currentImageIndex] : '';

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  const adScale = adAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });

  const adOpacity = adAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const renderUserCard = ({ item }) => {
    const age = calculateAge(item.date_of_birth);
    const profileImage = getProfileImage(item);
    const interests = item.interests || [];
    
    return (
      <TouchableOpacity 
        style={styles.userCard}
        activeOpacity={0.8}
        onPress={() => {
          animateButton();
          navigation.navigate('Profile', { user: item });
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: profileImage }} style={styles.userImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Status badge - simplified for now */}
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, {backgroundColor: '#4CAF50'}]} />
            <Text style={styles.statusText}>Online</Text>
          </View>
          
          {/* Location badge */}
          {item.country && (
            <View style={styles.distanceBadge}>
              <Icon name="location-on" size={12} color="#FFF" />
              <Text style={styles.distanceText}>{item.country}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.nick_name || 'User'}, {age}</Text>
          
          <View style={styles.interestsContainer}>
            {interests.slice(0, 2).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {interests.length > 2 && (
              <Text style={styles.moreInterests}>+{interests.length - 2} more</Text>
            )}
            
          </View>

          
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { user: item })}
          >
            <LinearGradient
              colors={["#FF3366", "#FF6F00"]}
              style={styles.chatButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="chat" size={16} color="#FFF" />
              <Text style={styles.chatButtonText}>Say Hi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDailyMatch = ({ item }) => {
    const age = calculateAge(item.date_of_birth);
    const profileImage = getProfileImage(item);
    
    return (
      <TouchableOpacity style={styles.dailyMatchCard}>
        <Image source={{ uri: profileImage }} style={styles.dailyMatchImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.dailyMatchOverlay}
        />
        <View style={styles.dailyMatchContent}>
          <Text style={styles.dailyMatchName}>{item.nick_name || 'User'}</Text>
          <Text style={styles.dailyMatchAge}>{age}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.quickAction}>
      <View style={[styles.quickActionCircle, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderAd = () => {
    const currentAd = ads[currentAdIndex];
    
    return (
      <Animated.View style={[styles.adContainer, {
        opacity: adOpacity,
        transform: [{ scale: adScale }]
      }]}>
        <Image source={{ uri: currentAd.image }} style={styles.adImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.adOverlay}
        />
        <View style={styles.adContent}>
          <Text style={styles.adTitle}>{currentAd.title}</Text>
          <Text style={styles.adDescription}>{currentAd.description}</Text>
          <TouchableOpacity style={styles.adButton}>
            <Text style={styles.adButtonText}>{currentAd.cta}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Premium badge with rotation animation */}
        <Animated.View style={[styles.premiumBadge, {
          transform: [{ rotate: rotateInterpolate }]
        }]}>
          <Icon name="star" size={16} color="#FFD700" />
        </Animated.View>
      </Animated.View>
    );
  };

  // Show loading state if no data
  if (usermatchData.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' backgroundColor='#000' />
        <LinearGradient
          colors={["#FF3366", "#FF6F00"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>e-Date</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="notifications" size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="message" size={27} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Finding matches for you...</Text>
        </View>
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          scaleAnim={scaleAnim}
          navigation={navigation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#000' />
      {/* Header */}
      <LinearGradient
        colors={["#FF3366", "#FF6F00"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>e-Date</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications" size={28} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="message" size={27} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Daily Matches */}
      <View style={[styles.section,{marginTop:10}]}>
        <FlatList
          data={dailyMatches}
          renderItem={renderDailyMatch}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dailyMatchesContent}
        />
      </View>

      <ScrollView style={[styles.scrollView,{marginTop:-25}]} showsVerticalScrollIndicator={false}>
        {/* Featured Profile */}
        {featuredUser && (
          <View style={[styles.featuredSection]}>
            <Animated.View style={[styles.featuredContainer, { 
              opacity: fadeAnim,
              transform: [{ translateX }]
            }]}>
              <Image source={{ uri: currentImage }} style={styles.featuredImage} />
              
              {/* Top Right Status Container */}
              <Animated.View style={[styles.topRightStatusContainer, {
                transform: [
                  { translateY: bounceInterpolate }
                ]
              }]}>
                {/* Online Now with Multiple Animations */}
                <Animated.View style={[styles.onlineNowContainer, {
                  transform: [{ scale: pulseInterpolate }]
                }]}>
                  <LinearGradient
                    colors={['#4CAF50', '#45a049', '#4CAF50']}
                    style={styles.onlineNowGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Animated.View style={[styles.pulseDot, {
                      transform: [{ scale: pulseInterpolate }]
                    }]}>
                      <View style={styles.onlineDot} />
                    </Animated.View>
                    <Text style={styles.onlineNowText}>ONLINE NOW</Text>
                    <Animated.View style={[styles.glowEffect, {
                      opacity: glowInterpolate
                    }]} />
                  </LinearGradient>
                </Animated.View>
                
                {/* Location Badge */}
                {featuredUser.country && (
                  <View style={styles.topRightDistanceBadge}>
                    <Icon name="location-on" size={14} color="#FF3366" />
                    <Text style={styles.topRightDistanceText}>{featuredUser.country}</Text>
                  </View>
                )}
              </Animated.View>
              
              <View style={styles.featuredContent}>
                <Text style={styles.featuredName}>
                  {featuredUser.nick_name || 'User'}, {calculateAge(featuredUser.date_of_birth)}
                </Text>
                
                <View style={styles.featuredInterests}>
                  {(featuredUser.interests || []).slice(0, 3).map((interest, index) => (
                    <View key={index} style={styles.featuredInterestTag}>
                      <Text style={styles.featuredInterestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.featuredActions}>
                  <TouchableOpacity 
                    style={styles.passButton}
                    onPress={changeProfile}
                  >
                    <View style={[styles.passButtonContent,{display:'flex',flexDirection:'row'}]}>
                      <Icon name="close" size={24} color="#FFF" />
                      <Text style={[styles.passText,{color:'#fff'}]}>Next</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.featuredChatButton}
                    onPress={() => navigation.navigate('Chat', { user: featuredUser })}
                  >
                    <LinearGradient
                      colors={["#FF3366", "#FF6F00"]}
                      style={styles.featuredChatGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Icon name="favorite" size={18} color="#FFF" />
                      <Text style={styles.featuredChatText}>Connect</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {/* People Nearby */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People Nearby</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={nearbyUsers}
            renderItem={renderUserCard}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/*Bottom Navigation Bar ======================*/}
     <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        scaleAnim={scaleAnim}
        navigation={navigation}
      />
    </View>
  );
}

// Add loading styles
const styles = StyleSheet.create({
  // ... (keep all your existing styles)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  // ... (rest of your existing styles remain the same)
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:-10
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
    marginTop:-10
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  // Featured Profile Styles
  featuredSection: {
    padding: 15,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  featuredContainer: {
    width: width * 0.9, 
    height: 400,
    borderRadius: 25,
    marginRight:200,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  // Top Right Status Styles
  topRightStatusContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  onlineNowContainer: {
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  onlineNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    position: 'relative',
  },
  pulseDot: {
    marginRight: 8,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  onlineNowText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  topRightDistanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  topRightDistanceText: {
    color: '#FF3366',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  featuredName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 10,
  },
  featuredInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  featuredInterestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuredInterestText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passButton: {
    width: 80,
    height: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredChatButton: {
    borderRadius: 25,
    overflow: 'hidden',
    flex: 1,
    marginLeft: 15,
  },
  featuredChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  featuredChatText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Section Styles
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '600',
  },
  // Daily Matches Styles
  dailyMatchesContent: {
    paddingHorizontal: 10,
  },
  dailyMatchCard: {
    width: 80,
    height: 80,
    borderColor:'#b4b1b2ff',
    borderWidth:2,
    borderStyle:'dotted',
    borderRadius:50,
    overflow: 'hidden',
    marginHorizontal: 5,
    position: 'relative',
  },
  dailyMatchImage: {
    width: '100%',
    height: '100%',
  },
  dailyMatchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  dailyMatchContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  dailyMatchName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign:'center'
  },
  dailyMatchAge: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  // People Nearby Styles
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  userCard: {
    width: (width - 40) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: '#FFF',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: '600',
  },
  userInfo: {
    padding: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  interestTag: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  interestText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '500',
  },
  moreInterests: {
    color: '#FF3366',
    fontSize: 10,
    fontWeight: '500',
  },
  chatButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});