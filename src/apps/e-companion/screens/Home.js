import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaViewBase, SafeAreaView, StatusBar, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

export default function ECompanionScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle='dark-content' />
  
      <View style={styles.descriptionContainer}>
        <View style={styles.titleRow}>
          
          <Text style={styles.headerTitle}>E-Companion</Text>
        </View>
        <Text style={styles.headerDesc}>
          Whether you need someone to talk to, want to be a listener, or host/attend events,
          E-Companion connects you with the right people!
        </Text>


         <View style={styles.cardsContainer}>
        {/* Talker Card===== */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, styles.talkerIcon]}>
              <Icon name="chatbubble-ellipses-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Find someone to talk to</Text>
              <Text style={styles.cardSubtitle}>Share your thoughts</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Need a listening ear? Connect with a companion who understands and provides meaningful conversations.
          </Text>
          <TouchableOpacity 
            style={[styles.cardButton, styles.talkerButton]}
            onPress={() => navigation.navigate('CSetupProfile',{status:'talker'})}
          >
            
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.cardButtonText}>Continue as talker</Text>
              <Icon name="arrow-forward" size={16} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Listener Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, styles.listenerIcon]}>
              <Icon name="people-outline" size={24} color={Colors.primaryLight} />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Be a listener</Text>
              <Text style={styles.cardSubtitle}>Support others</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Offer support and earn money by listening to someone who wants to talk. Make a difference in people's lives.
          </Text>
          <TouchableOpacity 
            style={[styles.cardButton, styles.listenerButton]}
            onPress={() => navigation.navigate('CSetupProfile',{status:'listener'})}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.cardButtonText}>Continue as listener</Text>
              <Icon name="arrow-forward" size={16} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

        
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>How it works</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="shield-checkmark" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.featureText}>Safe & Secure</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="time" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.featureText}>24/7 Available</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name="star" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.featureText}>Verified Companions</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 0,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  descriptionContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginTop:50,
    padding: 24,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#333',
    fontWeight: '700',
    fontSize: 28,
    marginLeft: 8,
  },
  headerDesc: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  cardsContainer: {
    marginBottom: 24,
    marginTop:50,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  talkerIcon: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  listenerIcon: {
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 2,
    fontFamily:'Lato-Bold'
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  cardButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  featuresSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Image, Animated } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import Colors from '../../globalshared/constants/colors';

// // Sample background images - replace these with your actual image URLs or local images
// const BACKGROUND_IMAGES = [
//   require('../assets/images/imag.png'), // Replace with your images
//   require('../../assets/images/imag.png'),
//   require('../../assets/images/imag.png'),
// ];

// // Fallback colors in case images don't load
// const FALLBACK_COLORS = [
//   ['#667eea', '#764ba2'],
//   ['#f093fb', '#f5576c'],
//   ['#4facfe', '#00f2fe'],
// ];

// export default function ECompanionScreen({ navigation }) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const fadeAnim = new Animated.Value(1);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Fade out current image
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }).start(() => {
//         // Change image index
//         setCurrentImageIndex((prevIndex) => 
//           (prevIndex + 1) % BACKGROUND_IMAGES.length
//         );
//         // Fade in new image
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       });
//     }, 4000); // Change image every 4 seconds

//     return () => clearInterval(interval);
//   }, [fadeAnim]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <StatusBar barStyle='light-content' />
      
//       {/* Animated Background Image Section */}
//       <View style={styles.heroSection}>
//         <Animated.Image
//           source={BACKGROUND_IMAGES[currentImageIndex]}
//           style={[
//             styles.backgroundImage,
//             {
//               opacity: fadeAnim,
//             }
//           ]}
//           resizeMode="cover"
//         />
        
//         {/* Overlay Gradient */}
//         <LinearGradient
//           colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
//           style={styles.imageOverlay}
//         >
//           {/* Header Content */}
//           <View style={styles.heroContent}>
//             <View style={styles.titleContainer}>
//               <Icon name="heart-circle-outline" size={32} color={Colors.white} />
//               <Text style={styles.heroTitle}>E-Companion</Text>
//             </View>
//             <Text style={styles.heroSubtitle}>
//               Your companion for meaningful connections
//             </Text>
//           </View>

//           {/* Image Indicators */}
//           <View style={styles.imageIndicators}>
//             {BACKGROUND_IMAGES.map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.indicator,
//                   index === currentImageIndex && styles.activeIndicator
//                 ]}
//               />
//             ))}
//           </View>
//         </LinearGradient>
//       </View>

//       <View style={styles.descriptionContainer}>
//         <Text style={styles.headerDesc}>
//           Whether you need someone to talk to, want to be a listener, or host/attend events,
//           E-Companion connects you with the right people!
//         </Text>

//         <View style={styles.cardsContainer}>
//           {/* Talker Card */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <View style={[styles.iconContainer, styles.talkerIcon]}>
//                 <Icon name="chatbubble-ellipses-outline" size={24} color={Colors.primary} />
//               </View>
//               <View style={styles.cardTitleContainer}>
//                 <Text style={styles.cardTitle}>Find someone to talk to</Text>
//                 <Text style={styles.cardSubtitle}>Share your thoughts</Text>
//               </View>
//             </View>
//             <Text style={styles.cardDesc}>
//               Need a listening ear? Connect with a companion who understands and provides meaningful conversations.
//             </Text>
//             <TouchableOpacity 
//               style={[styles.cardButton, styles.talkerButton]}
//               onPress={() => navigation.navigate('CSetupProfile')}
//             >
//               <LinearGradient
//                 colors={Colors.primaryGradient}
//                 style={styles.buttonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Text style={styles.cardButtonText}>Continue as talker</Text>
//                 <Icon name="arrow-forward" size={16} color={Colors.white} />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           {/* Listener Card */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <View style={[styles.iconContainer, styles.listenerIcon]}>
//                 <Icon name="people-outline" size={24} color={Colors.primaryLight} />
//               </View>
//               <View style={styles.cardTitleContainer}>
//                 <Text style={styles.cardTitle}>Be a listener</Text>
//                 <Text style={styles.cardSubtitle}>Support others</Text>
//               </View>
//             </View>
//             <Text style={styles.cardDesc}>
//               Offer support and earn money by listening to someone who wants to talk. Make a difference in people's lives.
//             </Text>
//             <TouchableOpacity 
//               style={[styles.cardButton, styles.listenerButton]}
//               onPress={() => navigation.navigate('Listener')}
//             >
//               <LinearGradient
//                 colors={[Colors.primaryLight, Colors.primary]}
//                 style={styles.buttonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Text style={styles.cardButtonText}>Continue as listener</Text>
//                 <Icon name="arrow-forward" size={16} color={Colors.white} />
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Features Section */}
//       <View style={styles.featuresSection}>
//         <Text style={styles.featuresTitle}>How it works</Text>
//         <View style={styles.featuresGrid}>
//           <View style={styles.featureItem}>
//             <View style={styles.featureIcon}>
//               <Icon name="shield-checkmark" size={20} color={Colors.primary} />
//             </View>
//             <Text style={styles.featureText}>Safe & Secure</Text>
//           </View>
//           <View style={styles.featureItem}>
//             <View style={styles.featureIcon}>
//               <Icon name="time" size={20} color={Colors.primary} />
//             </View>
//             <Text style={styles.featureText}>24/7 Available</Text>
//           </View>
//           <View style={styles.featureItem}>
//             <View style={styles.featureIcon}>
//               <Icon name="star" size={20} color={Colors.primary} />
//             </View>
//             <Text style={styles.featureText}>Verified Companions</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: Colors.background,
//     padding: 0,
//   },
//   heroSection: {
//     height: 280,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   backgroundImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   imageOverlay: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingTop: StatusBar.currentHeight + 20,
//     paddingBottom: 30,
//     paddingHorizontal: 24,
//   },
//   heroContent: {
//     alignItems: 'center',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   heroTitle: {
//     color: Colors.white,
//     fontWeight: '700',
//     fontSize: 32,
//     marginLeft: 12,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   heroSubtitle: {
//     color: Colors.white,
//     fontSize: 16,
//     textAlign: 'center',
//     opacity: 0.9,
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   imageIndicators: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: Colors.white,
//     width: 20,
//   },
//   descriptionContainer: {
//     backgroundColor: Colors.card,
//     borderRadius: 20,
//     marginTop: -20,
//     padding: 24,
//     marginHorizontal: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   headerDesc: {
//     color: Colors.textSecondary,
//     fontSize: 16,
//     lineHeight: 22,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   cardsContainer: {
//     marginTop: 24,
//   },
//   card: {
//     backgroundColor: Colors.background,
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   talkerIcon: {
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//   },
//   listenerIcon: {
//     backgroundColor: 'rgba(255, 111, 0, 0.1)',
//   },
//   cardTitleContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontWeight: '700',
//     fontSize: 18,
//     color: Colors.textPrimary,
//     marginBottom: 2,
//     fontFamily: 'Lato-Bold'
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: Colors.textTertiary,
//     fontWeight: '500',
//   },
//   cardDesc: {
//     color: Colors.textSecondary,
//     fontSize: 14,
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   cardButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   buttonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//   },
//   cardButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     fontSize: 16,
//     marginRight: 8,
//   },
//   featuresSection: {
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     padding: 20,
//     margin: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   featuresTitle: {
//     fontWeight: '700',
//     fontSize: 18,
//     color: Colors.textPrimary,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   featuresGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   featureItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   featureIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.inputBackground,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   featureText: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });
