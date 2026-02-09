import React, {useEffect, useState, useRef} from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("discover");
   const scaleAnim = useRef(new Animated.Value(1)).current;

  const userData = {
    name: "Prettybitch",
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    bio: "Sexy, spontaneous, and impossible to resist. Swipe right if you can keep up.",
    occupation: "Lawyer",
    email: "Estherbridge4@gmail.com",
    interests: ["Fitness", "Fashion", "Night Life", "Adventure", "Modelling"],
    relationshipGoal: "Dating",
    location: "New York, NY",
    verified: true,
    distance: "2 miles away"
  };

  const stats = [
    { label: "Matches", value: "127" },
    { label: "Likes", value: "356" },
    { label: "Visits", value: "1.2K" },
  ];

  const handleNavigation = () => {
    navigation.navigate('EditProfile');
  };

  return (

    <View style={styles.container}>
      
      
      {/* Header with Gradient */}
      <LinearGradient 
        colors={['#FF3366', '#FF6F00']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={26} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleNavigation}
          >
            <Icon name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar & Basic Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            {userData.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark" size={14} color="#FFF" />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={[styles.age,{marginBottom:20}]}>Age: {userData.age}</Text>
          
          <View style={styles.locationContainer}>
            <Icon name="location" size={14} color="#FFF" />
            <Text style={styles.location}>{userData.location} • {userData.distance}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* About Me Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="person-circle-outline" size={20} color="#FF3366" />
            <Text style={styles.sectionTitle}>About Me</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="document-text-outline" size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoValue}>{userData.bio}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="briefcase-outline" size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Occupation</Text>
                <Text style={styles.infoValue}>{userData.occupation}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="heart-outline" size={18} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Relationship Goal</Text>
                <Text style={styles.infoValue}>{userData.relationshipGoal}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="sparkles-outline" size={20} color="#FF3366" />
            <Text style={styles.sectionTitle}>Interests</Text>
          </View>
          
          <View style={styles.interestsContainer}>
            {userData.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Icon name="pencil" size={18} color="#FFF" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Icon name="camera" size={18} color="#FF3366" />
            <Text style={styles.secondaryButtonText}>Add Photos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation ================ */}
      <BottomNav 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              scaleAnim={scaleAnim}
              navigation={navigation}
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  header: {
    height: 310,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:-10
  },
  location: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
   
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3366',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  interestChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#FF3366',
  },
  interestText: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF3366',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3366',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#FF3366',
    fontWeight: '600',
  },
});

export default ProfileScreen;


// import React, {useEffect, useState, useRef} from 'react';
// import { 
//   View, 
//   Text, 
//   Image, 
//   StyleSheet, 
//   TouchableOpacity, 
//   ScrollView,
//   StatusBar,
//   Animated,
//   Dimensions,
//   FlatList,
//   ActivityIndicator,
//   Alert
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import BottomNav from '../components/BottomNav';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL } from '../../globalshared/apiRoute/api_config';

// const { width, height } = Dimensions.get('window');

// const ProfileScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const scrollX = useRef(new Animated.Value(0)).current;

//   // Cloudinary base URL - replace with your actual cloud name
//   const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dinmz7eh9';

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true);
//         const token = await AsyncStorage.getItem('access_token');
        
//         console.log('Fetching profile from:', `http://192.168.1.105:8000/api/eprofile/`);
        
//         const response = await axios.get(`http://192.168.1.105:8000/api/eprofile/`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.status === 200) {
//           console.log('Profile data fetched successfully:', response.data);
//           setUserData(response.data);
//           setError(null);
//         } else {
//           throw new Error('Failed to fetch profile');
//         }
//       } catch (error) {
//         console.log('Error fetching profile:', error);
//         setError(error.message);
//         Alert.alert('Error', 'Failed to load profile data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // Calculate age
//   const calculateAge = (dateOfBirth) => {
//     if (!dateOfBirth) return '?';
//     try {
//       const birthDate = new Date(dateOfBirth);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
      
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       return age;
//     } catch (error) {
//       console.log('Error calculating age:', error);
//       return '?';
//     }
//   };

//   // Get profile images with full URLs
//   const getProfileImages = () => {
//     if (!userData) return [];
    
//     if (userData.profile_images_data && userData.profile_images_data.length > 0) {
//       return userData.profile_images_data.map(img => 
//         `${CLOUDINARY_BASE_URL}/${img.image}`
//       );
//     }
//     // Default fallback images based on gender
//     if (userData.gender?.toLowerCase() === 'male') {
//       return ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"];
//     }
//     return ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"];
//   };

//   const handleNavigation = () => {
//     navigation.navigate('EditProfile', { user: userData });
//   };

//   const handleAddPhotos = () => {
//     navigation.navigate('AddPhotos', { user: userData });
//   };

//   const renderImageItem = ({ item, index }) => (
//     <View style={styles.imageContainer}>
//       <Image 
//         source={{ uri: item }} 
//         style={styles.profileImage}
//         onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
//       />
//       <LinearGradient
//         colors={['transparent', 'rgba(0,0,0,0.3)']}
//         style={styles.imageGradient}
//       />
//     </View>
//   );

//   const renderDotIndicator = () => {
//     const profileImages = getProfileImages();
//     if (profileImages.length <= 1) return null;

//     return (
//       <View style={styles.dotContainer}>
//         {profileImages.map((_, index) => {
//           const inputRange = [
//             (index - 1) * width,
//             index * width,
//             (index + 1) * width,
//           ];

//           const dotSize = scrollX.interpolate({
//             inputRange,
//             outputRange: [8, 20, 8],
//             extrapolate: 'clamp',
//           });

//           const opacity = scrollX.interpolate({
//             inputRange,
//             outputRange: [0.3, 1, 0.3],
//             extrapolate: 'clamp',
//           });

//           return (
//             <Animated.View
//               key={index}
//               style={[
//                 styles.dot,
//                 {
//                   width: dotSize,
//                   opacity: opacity,
//                 },
//               ]}
//             />
//           );
//         })}
//       </View>
//     );
//   };

//   const onScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//     {
//       useNativeDriver: false,
//       listener: (event) => {
//         const contentOffsetX = event.nativeEvent.contentOffset.x;
//         const newIndex = Math.round(contentOffsetX / width);
//         if (newIndex !== currentImageIndex) {
//           setCurrentImageIndex(newIndex);
//         }
//       }
//     }
//   );

//   // Loading state
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
//         <ActivityIndicator size="large" color="#FF3366" />
//         <Text style={styles.loadingText}>Loading your profile...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (error || !userData) {
//     return (
//       <View style={styles.errorContainer}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
//         <Icon name="alert-circle-outline" size={60} color="#FF3366" />
//         <Text style={styles.errorText}>Failed to load profile</Text>
//         <Text style={styles.errorSubtext}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.retryButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const profileImages = getProfileImages();
//   const age = calculateAge(userData.date_of_birth);
//   const interests = userData.interests || [];
//   const occupation = userData.occupation || 'Not specified';
//   const bio = userData.bio || 'No bio available';
//   const country = userData.country || 'Unknown';
//   const religion = userData.religion || 'Not specified';
//   const language = userData.language || 'Not specified';
//   const idealMatch = userData.ideal_match || 'Not specified';

//   const stats = [
//     { label: "Matches", value: "127", icon: "heart" },
//     { label: "Likes", value: "356", icon: "flash" },
//     { label: "Visits", value: "1.2K", icon: "eye" },
//   ];

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
//       {/* Image Carousel Section - Takes half screen */}
//       <View style={styles.imageSection}>
//         <Animated.FlatList
//           data={profileImages}
//           renderItem={renderImageItem}
//           keyExtractor={(item, index) => index.toString()}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={onScroll}
//           scrollEventThrottle={16}
//         />
        
//         {/* Back Button */}
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="chevron-back" size={28} color="#FFF" />
//         </TouchableOpacity>

//         {/* Settings Button */}
//         <TouchableOpacity 
//           style={styles.settingsButton}
//           onPress={handleNavigation}
//         >
//           <Icon name="settings-outline" size={24} color="#FFF" />
//         </TouchableOpacity>

//         {/* Dot Indicators */}
//         {renderDotIndicator()}

//         {/* Image Counter */}
//         {profileImages.length > 1 && (
//           <View style={styles.imageCounter}>
//             <Text style={styles.imageCounterText}>
//               {currentImageIndex + 1}/{profileImages.length}
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Content Section */}
//       <ScrollView 
//         style={styles.contentSection}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Basic Info Card */}
//         <View style={styles.basicInfoCard}>
//           <View style={styles.nameContainer}>
//             <Text style={styles.name}>
//               {userData.nick_name || 'User'}, {age}
//             </Text>
//             <View style={styles.verifiedBadge}>
//               <Icon name="checkmark" size={14} color="#FFF" />
//             </View>
//           </View>
          
//           <View style={styles.detailsRow}>
//             <View style={styles.detailItem}>
//               <Icon name="location-outline" size={16} color="#FF3366" />
//               <Text style={styles.detailText}>{country}</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Icon name="briefcase-outline" size={16} color="#FF3366" />
//               <Text style={styles.detailText}>{occupation}</Text>
//             </View>
//           </View>

//           <Text style={styles.bioText}>{bio}</Text>
//         </View>

//         {/* Stats Section */}
//         <View style={styles.statsContainer}>
//           {stats.map((stat, index) => (
//             <View key={stat.label} style={styles.statItem}>
//               <View style={styles.statIconContainer}>
//                 <Icon name={stat.icon} size={20} color="#FF3366" />
//               </View>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Details Grid */}
//         <View style={styles.detailsGrid}>
//           <View style={styles.detailCard}>
//             <Icon name="heart-circle-outline" size={24} color="#FF3366" />
//             <Text style={styles.detailCardLabel}>Relationship Goal</Text>
//             <Text style={styles.detailCardValue}>Dating</Text>
//           </View>
          
//           <View style={styles.detailCard}>
//             <Icon name="language-outline" size={24} color="#FF3366" />
//             <Text style={styles.detailCardLabel}>Language</Text>
//             <Text style={styles.detailCardValue}>{language}</Text>
//           </View>
          
//           <View style={styles.detailCard}>
//             <Icon name="people-outline" size={24} color="#FF3366" />
//             <Text style={styles.detailCardLabel}>Gender</Text>
//             <Text style={styles.detailCardValue}>{userData.gender}</Text>
//           </View>
          
//           <View style={styles.detailCard}>
//             <Icon name="star-outline" size={24} color="#FF3366" />
//             <Text style={styles.detailCardLabel}>Religion</Text>
//             <Text style={styles.detailCardValue}>{religion}</Text>
//           </View>
//         </View>

//         {/* Interests Section */}
//         {interests.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Interests</Text>
//             <View style={styles.interestsContainer}>
//               {interests.map((interest, index) => (
//                 <View key={index} style={styles.interestChip}>
//                   <Text style={styles.interestText}>{interest}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Ideal Match Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Looking For</Text>
//           <View style={styles.idealMatchCard}>
//             <Icon name="search" size={20} color="#FF3366" />
//             <Text style={styles.idealMatchText}>
//               Ideal match: {idealMatch}
//             </Text>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.primaryButton]}
//             onPress={handleNavigation}
//           >
//             <Icon name="pencil" size={20} color="#FFF" />
//             <Text style={styles.primaryButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.secondaryButton]}
//             onPress={handleAddPhotos}
//           >
//             <Icon name="camera" size={20} color="#FF3366" />
//             <Text style={styles.secondaryButtonText}>Add Photos</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <BottomNav 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         scaleAnim={scaleAnim}
//         navigation={navigation}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#FAFAFA' 
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//     paddingHorizontal: 40,
//   },
//   errorText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorSubtext: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   retryButton: {
//     backgroundColor: '#FF3366',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   retryButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   imageSection: {
//     height: height * 0.5,
//     position: 'relative',
//   },
//   imageContainer: {
//     width: width,
//     height: '100%',
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageGradient: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '30%',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   settingsButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   dotContainer: {
//     position: 'absolute',
//     bottom: 20,
//     flexDirection: 'row',
//     alignSelf: 'center',
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FFF',
//     marginHorizontal: 4,
//   },
//   imageCounter: {
//     position: 'absolute',
//     top: 50,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     zIndex: 5,
//   },
//   imageCounterText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   contentSection: {
//     flex: 1,
//     marginTop: -30,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     backgroundColor: '#FAFAFA',
//   },
//   scrollContent: {
//     paddingBottom: 100,
//   },
//   basicInfoCard: {
//     backgroundColor: '#FFF',
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 25,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   name: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#333',
//     marginRight: 8,
//   },
//   verifiedBadge: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   bioText: {
//     fontSize: 16,
//     color: '#444',
//     lineHeight: 22,
//     fontWeight: '400',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FFF0F5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FF3366',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   detailsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: 20,
//     marginTop: 20,
//     gap: 12,
//   },
//   detailCard: {
//     width: (width - 52) / 2,
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   detailCardLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 8,
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   detailCardValue: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '600',
//   },
//   section: {
//     marginTop: 25,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 15,
//   },
//   interestsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -5,
//   },
//   interestChip: {
//     backgroundColor: '#FFF',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     margin: 5,
//     borderWidth: 1.5,
//     borderColor: '#FF3366',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   interestText: {
//     color: '#FF3366',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   idealMatchCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   idealMatchText: {
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 12,
//     fontWeight: '500',
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     marginTop: 25,
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderRadius: 15,
//     gap: 8,
//   },
//   primaryButton: {
//     backgroundColor: '#FF3366',
//     shadowColor: '#FF3366',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   secondaryButton: {
//     backgroundColor: '#FFF',
//     borderWidth: 2,
//     borderColor: '#FF3366',
//   },
//   primaryButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   secondaryButtonText: {
//     color: '#FF3366',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default ProfileScreen;