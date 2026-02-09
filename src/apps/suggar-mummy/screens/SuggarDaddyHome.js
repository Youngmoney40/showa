
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
//   FlatList,
//   StatusBar
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { BlurView } from "@react-native-community/blur";
// import BottomNav from "../../edate/components/BottomNav";

// const { width, height } = Dimensions.get('window');

// // Sample user data
// const users = [

//     {
//     id: 1,
//     name: "Jame Mathew",
//     age: 55,
//     distance: "4km",
//     image: "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
//     images: [
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/d47753da-95e3-4018-b7c3-2f6f42ed6f74.jpeg",
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/Cuidados-basicos-que-todo-homem-deve-ter-2.jpeg",
//       "https://cdn.shopify.com/s/files/1/0987/9106/files/how-to-wear-a-pork-pie-hat.jpg"
//     ],
//     online: false,
//     interests: ["Suggar Daddy", "Luxury Life", "Travel"],
//     status: "Online now"
//   },
//   {
//     id: 2,
//     name: "Amaka",
//     age: 46,
//     distance: "2km",
//     image: "https://i.pinimg.com/736x/7b/ae/2a/7bae2a3d1d8659dc4fbd70dbe0b1a469.jpg",
//     images: [
//       "https://www.ofuxico.com.br/wp-content/uploads/2023/09/jojo-todynho-vestido-branco.jpg",
//       "https://pbs.twimg.com/media/FCpDFH8XIAYmZdh.jpg",
//       "https://i0.wp.com/pbs.twimg.com/media/Dy_eT0kX0AAC7IA.jpg?ssl=1",
//       "https://i0.wp.com/www.curvescurlsandclothes.com/wp-content/uploads/2016/09/XY5A9263.jpg"
//     ],
//     online: false,
//     interests: ["Sexy Mama", "Travel", "Dancing"],
//     status: "Online now"
//   },
  
// ];


// // Ads data
// const ads = [
//   {
//     id: 1,
//     title: "Premium Membership",
//     description: "Get seen by more people!",
//     image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0aW5nJTIwYXBwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80",
//     cta: "Upgrade Now"
//   },
//   {
//     id: 2,
//     title: "Valentine's Special",
//     description: "50% off on premium features",
//     image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbGVudGluZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
//     cta: "Get Offer"
//   },
//   {
//     id: 3,
//     title: "Icebreaker Pack",
//     description: "100+ conversation starters",
//     image: "https://images.unsplash.com/photo-1579208575657-c2f5b3156f56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYXR0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80",
//     cta: "Learn More"
//   }
// ];

// export default function HomeScreen({ navigation }) {
//   const [activeTab, setActiveTab] = useState("discover");
//   const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const adAnim = useRef(new Animated.Value(0)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
  
//   // New animations for online status
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const glowAnim = useRef(new Animated.Value(0)).current;

//   // Auto-change featured profile image every 50-60 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       changeImage();
//     }, 50000 + Math.random() * 10000); 

//     return () => clearInterval(interval);
//   }, [currentProfileIndex, currentImageIndex]);


//   useEffect(() => {
//     const adInterval = setInterval(() => {
//       Animated.timing(adAnim, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }).start(() => {
//         setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
//         Animated.timing(adAnim, {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }).start();
//       });
//     }, 5000);

//     return () => clearInterval(adInterval);
//   }, []);

//   // Continuous rotation animation for premium badge
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 3000,
//         easing: Easing.linear,
//         useNativeDriver: true
//       })
//     ).start();
//   }, []);

//   // Online now animation effects
//   useEffect(() => {
//     // Pulse animation for online status
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();

//     // Bounce animation for the entire status container
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();

//     // Glow animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 1500,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();
//   }, []);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const pulseInterpolate = pulseAnim.interpolate({
//     inputRange: [1, 1.2],
//     outputRange: [1, 1.2]
//   });

//   const bounceInterpolate = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -5]
//   });

//   const glowInterpolate = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1]
//   });

//   const changeImage = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true
//     }).start(() => {
//       setCurrentImageIndex((prevIndex) => 
//         (prevIndex + 1) % users[currentProfileIndex].images.length
//       );
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }).start();
//     });
//   };

//   const changeProfile = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true
//     }).start(() => {
//       setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % users.length);
//       setCurrentImageIndex(0);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }).start();
//     });
//   };

//   const animateButton = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true
//       })
//     ]).start();
//   };

//   const featuredUser = users[currentProfileIndex];
//   const currentImage = featuredUser.images[currentImageIndex];
//   const translateX = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [100, 0]
//   });

//   const adScale = adAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.9, 1]
//   });

//   const adOpacity = adAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1]
//   });

//   const renderUserCard = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.userCard}
//       activeOpacity={0.8}
//       onPress={() => {
//         animateButton();
//         navigation.navigate('Profile', { user: item });
//       }}
//     >
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: item.image }} style={styles.userImage} />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.7)']}
//           style={styles.imageOverlay}
//         />
        
//         {/* Status badge */}
//         <View style={styles.statusBadge}>
//           <View style={[styles.statusDot, {backgroundColor: item.online ? '#4CAF50' : '#9E9E9E'}]} />
//           <Text style={styles.statusText}>{item.status}</Text>
//         </View>
        
//         {/* Distance badge */}
//         <View style={styles.distanceBadge}>
//           <Icon name="location-on" size={12} color="#FFF" />
//           <Text style={styles.distanceText}>{item.distance} away</Text>
//         </View>
//       </View>
      
//       <View style={styles.userInfo}>
//         <Text style={styles.userName}>{item.name}, {item.age}</Text>
        
//         <View style={styles.interestsContainer}>
//           {item.interests.slice(0, 2).map((interest, index) => (
//             <View key={index} style={styles.interestTag}>
//               <Text style={styles.interestText}>{interest}</Text>
//             </View>
//           ))}
//           {item.interests.length > 2 && (
//             <Text style={styles.moreInterests}>+{item.interests.length - 2} more</Text>
//           )}
//         </View>
        
//         <TouchableOpacity 
//           style={styles.chatButton}
//           onPress={() => navigation.navigate('Chat', { user: item })}
//         >
//           <LinearGradient
//             colors={["#FF3366", "#FF6F00"]}
//             style={styles.chatButtonGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Icon name="chat" size={16} color="#FFF" />
//             <Text style={styles.chatButtonText}>Say Hi</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );



//   const renderAd = () => {
//     const currentAd = ads[currentAdIndex];
    
//     return (
//       <Animated.View style={[styles.adContainer, {
//         opacity: adOpacity,
//         transform: [{ scale: adScale }]
//       }]}>
//         <Image source={{ uri: currentAd.image }} style={styles.adImage} />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.7)']}
//           style={styles.adOverlay}
//         />
//         <View style={styles.adContent}>
//           <Text style={styles.adTitle}>{currentAd.title}</Text>
//           <Text style={styles.adDescription}>{currentAd.description}</Text>
//           <TouchableOpacity style={styles.adButton}>
//             <Text style={styles.adButtonText}>{currentAd.cta}</Text>
//           </TouchableOpacity>
//         </View>
        
//         {/* Premium badge with rotation animation */}
//         <Animated.View style={[styles.premiumBadge, {
//           transform: [{ rotate: rotateInterpolate }]
//         }]}>
//           <Icon name="star" size={16} color="#FFD700" />
//         </Animated.View>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle='light-content' backgroundColor='#000' />
//       {/* Header */}
//       <LinearGradient
//         colors={["#FF3366", "#FF6F00"]}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Ellite Suggar</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Icon name="notifications" size={28} color="#FFF" />
//               {/* <View style={styles.notificationBadge}>
//                 <Text style={styles.notificationBadgeText}>5</Text>
//               </View> */}
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <Icon name="message" size={27} color="#FFF" />
//               {/* <View style={styles.messageBadge}>
//                 <Text style={styles.messageBadgeText}>3</Text>
//               </View> */}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Daily Matches */}
//       <View style={[styles.section,{marginTop:5}]}>
       
//       </View>

//       <ScrollView style={[styles.scrollView,{marginTop:-25}]} showsVerticalScrollIndicator={false}>
//         {/* Featured Profile */}
//         <View style={[styles.featuredSection]}>
//           <Animated.View style={[styles.featuredContainer, { 
//             opacity: fadeAnim,
//             transform: [{ translateX }]
//           }]}>
//             <Image source={{ uri: currentImage }} style={styles.featuredImage} />
            
//             {/* Top Right Status Container */}
//             <Animated.View style={[styles.topRightStatusContainer, {
//               transform: [
//                 { translateY: bounceInterpolate }
//               ]
//             }]}>
//               {/* Online Now with Multiple Animations */}
//               {featuredUser.online && (
//                 <Animated.View style={[styles.onlineNowContainer, {
//                   transform: [{ scale: pulseInterpolate }]
//                 }]}>
//                   <LinearGradient
//                     colors={['#4CAF50', '#45a049', '#4CAF50']}
//                     style={styles.onlineNowGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                   >
//                     <Animated.View style={[styles.pulseDot, {
//                       transform: [{ scale: pulseInterpolate }]
//                     }]}>
//                       <View style={styles.onlineDot} />
//                     </Animated.View>
//                     <Text style={styles.onlineNowText}>ONLINE NOW</Text>
//                     <Animated.View style={[styles.glowEffect, {
//                       opacity: glowInterpolate
//                     }]} />
//                   </LinearGradient>
//                 </Animated.View>
//               )}
              
//               {/* Distance Badge */}
//               <View style={styles.topRightDistanceBadge}>
//                 <Icon name="location-on" size={14} color="#FF3366" />
//                 <Text style={styles.topRightDistanceText}>{featuredUser.distance} nearby</Text>
//               </View>
//             </Animated.View>
            
//             <View style={styles.featuredContent}>
//               <Text style={styles.featuredName}>{featuredUser.name}, {featuredUser.age}</Text>
              
//               <View style={styles.featuredInterests}>
//                 {featuredUser.interests.slice(0, 3).map((interest, index) => (
//                   <View key={index} style={styles.featuredInterestTag}>
//                     <Text style={styles.featuredInterestText}>{interest}</Text>
//                   </View>
//                 ))}
//               </View>
              
//               <View style={styles.featuredActions}>
//                 <TouchableOpacity 
//                   style={styles.passButton}
//                   onPress={changeProfile}
//                 >
//                   <View style={[styles.passButtonContent,{}]}>
//                       <Icon name="close" size={24} color="#FFF" />
                 
//                   </View>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={styles.featuredChatButton}
//                   onPress={() => navigation.navigate('Chat', { user: featuredUser })}
//                 >
//                   <LinearGradient
//                     colors={["#FF3366", "#FF6F00"]}
//                     style={styles.featuredChatGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                   >
//                     <Icon name="favorite" size={18} color="#FFF" />
//                     <Text style={styles.featuredChatText}>Message</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Animated.View>
//         </View>
        
//       </ScrollView>

//       {/*Bottom Navigation Bar ======================*/}
//      <BottomNav 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         scaleAnim={scaleAnim}
//         navigation={navigation}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({

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
import BottomNav from "../../edate/components/BottomNav";

const { width, height } = Dimensions.get('window');

// Sample user data
const users = [
  {
    id: 1,
    name: "Jame Mathew",
    age: 55,
    distance: "4km",
    image: "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
    images: [
      "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
      "https://www.bugremoda.com.br/wp-content/uploads/2024/08/d47753da-95e3-4018-b7c3-2f6f42ed6f74.jpeg",
      "https://www.bugremoda.com.br/wp-content/uploads/2024/08/Cuidados-basicos-que-todo-homem-deve-ter-2.jpeg",
      "https://cdn.shopify.com/s/files/1/0987/9106/files/how-to-wear-a-pork-pie-hat.jpg"
    ],
    online: false,
    interests: ["Suggar Daddy", "Luxury Life", "Travel"],
    status: "Online now"
  },
  {
    id: 2,
    name: "Amaka",
    age: 46,
    distance: "2km",
    image: "https://i.pinimg.com/736x/7b/ae/2a/7bae2a3d1d8659dc4fbd70dbe0b1a469.jpg",
    images: [
      "https://www.ofuxico.com.br/wp-content/uploads/2023/09/jojo-todynho-vestido-branco.jpg",
      "https://pbs.twimg.com/media/FCpDFH8XIAYmZdh.jpg",
      "https://i0.wp.com/pbs.twimg.com/media/Dy_eT0kX0AAC7IA.jpg?ssl=1",
      "https://i0.wp.com/www.curvescurlsandclothes.com/wp-content/uploads/2016/09/XY5A9263.jpg"
    ],
    online: false,
    interests: ["Sexy Mama", "Travel", "Dancing"],
    status: "Online now"
  },
];

// Ads data
const ads = [
  {
    id: 1,
    title: "Premium Membership",
    description: "Get seen by more people and unlock exclusive features!",
    image: "https://www.ofuxico.com.br/wp-content/uploads/2023/09/jojo-todynho-vestido-branco.jpg",
    cta: "Upgrade Now",
    sponsor: "Elite Sugar"
  },
  {
    id: 2,
    title: "Valentine's Special",
    description: "50% off on premium features for limited time",
    image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbGVudGluZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
    cta: "Get Offer",
    sponsor: "Elite Sugar"
  },
  {
    id: 3,
    title: "Icebreaker Pack",
    description: "100+ conversation starters to break the ice",
    image: "https://i0.wp.com/www.curvescurlsandclothes.com/wp-content/uploads/2016/09/XY5A9263.jpg",
    cta: "Learn More",
    sponsor: "Elite Sugar"
  }
];

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("discover");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(3);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const adAnim = useRef(new Animated.Value(0)).current;
  const adSlideAnim = useRef(new Animated.Value(-100)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // New animations for online status
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Auto-change featured profile image every 50-60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 50000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, [currentProfileIndex, currentImageIndex]);

  // YouTube-style ad system
  useEffect(() => {
    let adTimeout;
    let countdownInterval;

    const showAdWithDelay = () => {
      adTimeout = setTimeout(() => {
        // Show ad with slide animation
        setShowAd(true);
        setAdTimer(3);
        
        Animated.sequence([
          Animated.timing(adSlideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.timing(adAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true
          })
        ]).start();

        // Start countdown
        countdownInterval = setInterval(() => {
          setAdTimer(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              hideAd();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      }, 500); // Show ad after 2 seconds
    };

    const hideAd = () => {
      Animated.sequence([
        Animated.timing(adAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(adSlideAnim, {
          toValue: -100,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true
        })
      ]).start(() => {
        setShowAd(false);
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
        
        // Schedule next ad after some time
        setTimeout(showAdWithDelay, 2000); 
      });
    };

    // Initial ad show
    showAdWithDelay();

    return () => {
      clearTimeout(adTimeout);
      clearInterval(countdownInterval);
    };
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
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % users[currentProfileIndex].images.length
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    });
  };

  const changeProfile = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % users.length);
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

  const skipAd = () => {
    setAdTimer(0);
  };

  const featuredUser = users[currentProfileIndex];
  const currentImage = featuredUser.images[currentImageIndex];
  const currentAd = ads[currentAdIndex];
  
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  const adScale = adAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const adOpacity = adAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const renderYouTubeAd = () => {
    if (!showAd) return null;

    return (
      <Animated.View style={[styles.youtubeAdContainer, {
        transform: [
          { translateY: adSlideAnim },
          { scale: adScale }
        ],
        opacity: adOpacity
      }]}>
        {/* Ad Header */}
        {/* <View style={styles.adHeader}>
          <View style={styles.adSponsor}>
            <Text style={styles.adSponsorText}>Sponsored • {currentAd.sponsor}</Text>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={skipAd}>
            <Text style={styles.skipButtonText}>Skip in {adTimer}s</Text>
          </TouchableOpacity>
        </View> */}

        {/* Ad Content */}
        <View style={styles.adContentWrapper}>
          <Image source={{ uri: currentAd.image }} style={styles.youtubeAdImage} />
          
          <View style={styles.youtubeAdInfo}>
            <Text style={styles.youtubeAdTitle}>{currentAd.title}</Text>
            <Text style={styles.youtubeAdDescription}>{currentAd.description}</Text>
            
            <TouchableOpacity style={styles.youtubeAdButton}>
              <LinearGradient
                colors={["#FF3366", "#FF6F00"]}
                style={styles.youtubeAdButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.youtubeAdButtonText}>{currentAd.cta}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, {
            width: `${(3 - adTimer) * 33.33}%`
          }]} />
        </View>
      </Animated.View>
    );
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard}
      activeOpacity={0.8}
      onPress={() => {
        animateButton();
        navigation.navigate('Profile', { user: item });
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.userImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        
        {/* Status badge */}
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, {backgroundColor: item.online ? '#4CAF50' : '#9E9E9E'}]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        
        {/* Distance badge */}
        <View style={styles.distanceBadge}>
          <Icon name="location-on" size={12} color="#FFF" />
          <Text style={styles.distanceText}>{item.distance} away</Text>
        </View>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}, {item.age}</Text>
        
        <View style={styles.interestsContainer}>
          {item.interests.slice(0, 2).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {item.interests.length > 2 && (
            <Text style={styles.moreInterests}>+{item.interests.length - 2} more</Text>
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
          <Text style={[styles.headerTitle]}>Elite Sugar</Text>
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

      <ScrollView style={[styles.scrollView,{marginTop:-25}]} showsVerticalScrollIndicator={false}>
        {/* Featured Profile */}
        <View style={[styles.featuredSection]}>
          <Animated.View style={[styles.featuredContainer, { 
            opacity: fadeAnim,
            transform: [{ translateX }]
          }]}>
            <Image source={{ uri: currentImage }} style={styles.featuredImage} />
            
            {/* YouTube-style Ad Overlay */}
            {renderYouTubeAd()}
            
            {/* Top Right Status Container */}
            <Animated.View style={[styles.topRightStatusContainer, {
              transform: [
                { translateY: bounceInterpolate }
              ]
            }]}>
              {/* Online Now with Multiple Animations */}
              {featuredUser.online && (
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
              )}
              
              {/* Distance Badge */}
              <View style={styles.topRightDistanceBadge}>
                <Icon name="location-on" size={14} color="#FF3366" />
                <Text style={styles.topRightDistanceText}>{featuredUser.distance} nearby</Text>
              </View>
            </Animated.View>
            
            <View style={styles.featuredContent}>
              <Text style={styles.featuredName}>{featuredUser.name}, {featuredUser.age}</Text>
              
              <View style={styles.featuredInterests}>
                {featuredUser.interests.slice(0, 3).map((interest, index) => (
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
                  <View style={[styles.passButtonContent,{}]}>
                      <Icon name="close" size={24} color="#FFF" />
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
                    <Text style={styles.featuredChatText}>Message</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
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

const styles = StyleSheet.create({
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
   
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
    marginTop:-40
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
    height: 500,
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
    position: 'relative',
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
  // YouTube-style Ad Styles
  youtubeAdContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  adSponsor: {
    flex: 1,
  },
  adSponsorText: {
    color: '#FF3366',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  adContentWrapper: {
    flexDirection: 'row',
    padding: 15,
  },
  youtubeAdImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  youtubeAdInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  youtubeAdTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  youtubeAdDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  youtubeAdButton: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  youtubeAdButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  youtubeAdButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3366',
  },
  // ... (rest of your existing styles remain the same)
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
    marginTop:50
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
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Featured Profile Styles
  featuredSection: {
    padding: 15,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  featuredContainer: {
    width: width * 0.9, 
    height: 500,
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
  // ... (rest of the styles remain the same as your original code)
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



// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
//   FlatList,
//   StatusBar
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Video, ResizeMode } from 'react-native-video';
// import BottomNav from "../../edate/components/BottomNav";

// const { width, height } = Dimensions.get('window');

// // Sample user data
// const users = [
//   {
//     id: 1,
//     name: "Jame Mathew",
//     age: 55,
//     distance: "4km",
//     image: "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
//     images: [
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg",
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/d47753da-95e3-4018-b7c3-2f6f42ed6f74.jpeg",
//       "https://www.bugremoda.com.br/wp-content/uploads/2024/08/Cuidados-basicos-que-todo-homem-deve-ter-2.jpeg",
//       "https://cdn.shopify.com/s/files/1/0987/9106/files/how-to-wear-a-pork-pie-hat.jpg"
//     ],
//     online: false,
//     interests: ["Suggar Daddy", "Luxury Life", "Travel"],
//     status: "Online now"
//   },
//   {
//     id: 2,
//     name: "Amaka",
//     age: 46,
//     distance: "2km",
//     image: "https://i.pinimg.com/736x/7b/ae/2a/7bae2a3d1d8659dc4fbd70dbe0b1a469.jpg",
//     images: [
//       "https://www.ofuxico.com.br/wp-content/uploads/2023/09/jojo-todynho-vestido-branco.jpg",
//       "https://pbs.twimg.com/media/FCpDFH8XIAYmZdh.jpg",
//       "https://i0.wp.com/pbs.twimg.com/media/Dy_eT0kX0AAC7IA.jpg?ssl=1",
//       "https://i0.wp.com/www.curvescurlsandclothes.com/wp-content/uploads/2016/09/XY5A9263.jpg"
//     ],
//     online: false,
//     interests: ["Sexy Mama", "Travel", "Dancing"],
//     status: "Online now"
//   },
// ];

// // Video Ads data
// const videoAds = [
//   {
//     id: 1,
//     title: "Premium Membership",
//     description: "Unlock exclusive features and get more matches!",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
//     thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
//     cta: "Upgrade Now",
//     sponsor: "Elite Sugar",
//     duration: 15
//   },
//   {
//     id: 2,
//     title: "Valentine's Special",
//     description: "50% off on premium features for limited time",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//     thumbnail: "https://i.pinimg.com/736x/7b/ae/2a/7bae2a3d1d8659dc4fbd70dbe0b1a469.jpg",
//     cta: "Get Offer",
//     sponsor: "Elite Sugar",
//     duration: 12
//   },
//   {
//     id: 3,
//     title: "Icebreaker Pack",
//     description: "100+ conversation starters to break the ice",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//     thumbnail: "https://images.unsplash.com/photo-1579208575657-c2f5b3156f56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
//     cta: "Learn More",
//     sponsor: "Elite Sugar",
//     duration: 10
//   }
// ];

// export default function HomeScreen({ navigation }) {
//   const [activeTab, setActiveTab] = useState("discover");
//   const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const [showVideoAd, setShowVideoAd] = useState(false);
//   const [adTimer, setAdTimer] = useState(0);
//   const [isVideoPaused, setIsVideoPaused] = useState(false);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const videoAdAnim = useRef(new Animated.Value(0)).current;
//   const videoSlideAnim = useRef(new Animated.Value(-100)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const videoPlayerAnim = useRef(new Animated.Value(0)).current;
  
//   const videoRef = useRef(null);
  
//   // New animations for online status
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const glowAnim = useRef(new Animated.Value(0)).current;

//   // Auto-change featured profile image every 50-60 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       changeImage();
//     }, 50000 + Math.random() * 10000);

//     return () => clearInterval(interval);
//   }, [currentProfileIndex, currentImageIndex]);

//   // YouTube-style video ad system
//   useEffect(() => {
//     let adTimeout;
//     let countdownInterval;

//     const showVideoAdWithDelay = () => {
//       adTimeout = setTimeout(() => {
//         // Show video ad with slide animation
//         setShowVideoAd(true);
//         setAdTimer(videoAds[currentAdIndex].duration);
//         setIsVideoPaused(false);
//         setVideoProgress(0);
//         setIsVideoLoaded(false);
        
//         Animated.sequence([
//           Animated.timing(videoSlideAnim, {
//             toValue: 0,
//             duration: 500,
//             easing: Easing.out(Easing.cubic),
//             useNativeDriver: true
//           }),
//           Animated.timing(videoAdAnim, {
//             toValue: 1,
//             duration: 300,
//             easing: Easing.ease,
//             useNativeDriver: true
//           })
//         ]).start();

//         // Start countdown
//         countdownInterval = setInterval(() => {
//           setAdTimer(prev => {
//             if (prev <= 1) {
//               clearInterval(countdownInterval);
//               hideVideoAd();
//               return 0;
//             }
//             return prev - 1;
//           });
//         }, 1000);

//       }, 2000); // Show ad after 2 seconds
//     };

//     const hideVideoAd = () => {
//       setIsVideoPaused(true);
//       Animated.sequence([
//         Animated.timing(videoAdAnim, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(videoSlideAnim, {
//           toValue: -100,
//           duration: 500,
//           easing: Easing.in(Easing.cubic),
//           useNativeDriver: true
//         })
//       ]).start(() => {
//         setShowVideoAd(false);
//         setCurrentAdIndex(prev => (prev + 1) % videoAds.length);
        
//         // Schedule next ad after some time
//         setTimeout(showVideoAdWithDelay, 45000); // Show next ad after 45 seconds
//       });
//     };

//     // Initial ad show
//     showVideoAdWithDelay();

//     return () => {
//       clearTimeout(adTimeout);
//       clearInterval(countdownInterval);
//     };
//   }, [currentAdIndex]);

//   // Video progress tracking
//   useEffect(() => {
//     if (showVideoAd && !isVideoPaused) {
//       const progressInterval = setInterval(() => {
//         setVideoProgress(prev => {
//           const newProgress = prev + (100 / (videoAds[currentAdIndex].duration * 10));
//           if (newProgress >= 100) {
//             clearInterval(progressInterval);
//             return 100;
//           }
//           return newProgress;
//         });
//       }, 100);

//       return () => clearInterval(progressInterval);
//     }
//   }, [showVideoAd, isVideoPaused, currentAdIndex]);

//   // Continuous rotation animation for premium badge
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 3000,
//         easing: Easing.linear,
//         useNativeDriver: true
//       })
//     ).start();
//   }, []);

//   // Online now animation effects
//   useEffect(() => {
//     // Pulse animation for online status
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();

//     // Bounce animation for the entire status container
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();

//     // Glow animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.ease,
//           useNativeDriver: true
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 1500,
//           easing: Easing.ease,
//           useNativeDriver: true
//         })
//       ])
//     ).start();
//   }, []);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const pulseInterpolate = pulseAnim.interpolate({
//     inputRange: [1, 1.2],
//     outputRange: [1, 1.2]
//   });

//   const bounceInterpolate = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -5]
//   });

//   const glowInterpolate = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1]
//   });

//   const videoScale = videoAdAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.8, 1]
//   });

//   const videoOpacity = videoAdAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1]
//   });

//   const changeImage = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true
//     }).start(() => {
//       setCurrentImageIndex((prevIndex) => 
//         (prevIndex + 1) % users[currentProfileIndex].images.length
//       );
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }).start();
//     });
//   };

//   const changeProfile = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true
//     }).start(() => {
//       setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % users.length);
//       setCurrentImageIndex(0);
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }).start();
//     });
//   };

//   const animateButton = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         easing: Easing.ease,
//         useNativeDriver: true
//       })
//     ]).start();
//   };

//   const skipVideoAd = () => {
//     setAdTimer(0);
//     hideVideoAd();
//   };

//   const toggleVideoPause = () => {
//     setIsVideoPaused(!isVideoPaused);
//     // Add bounce animation when toggling play/pause
//     Animated.sequence([
//       Animated.timing(videoPlayerAnim, {
//         toValue: 1,
//         duration: 200,
//         easing: Easing.ease,
//         useNativeDriver: true
//       }),
//       Animated.timing(videoPlayerAnim, {
//         toValue: 0,
//         duration: 200,
//         easing: Easing.ease,
//         useNativeDriver: true
//       })
//     ]).start();
//   };

//   const onVideoLoad = () => {
//     setIsVideoLoaded(true);
//   };

//   const onVideoError = (error) => {
//     console.log('Video error:', error);
//     // Fallback to next ad if video fails to load
//     setTimeout(() => {
//       hideVideoAd();
//     }, 2000);
//   };

//   const featuredUser = users[currentProfileIndex];
//   const currentImage = featuredUser.images[currentImageIndex];
//   const currentVideoAd = videoAds[currentAdIndex];
  
//   const translateX = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [100, 0]
//   });

//   const playerScale = videoPlayerAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.2]
//   });

//   const renderVideoAd = () => {
//     if (!showVideoAd) return null;

//     return (
//       <Animated.View style={[styles.videoAdContainer, {
//         transform: [
//           { translateY: videoSlideAnim },
//           { scale: videoScale }
//         ],
//         opacity: videoOpacity
//       }]}>
//         {/* Video Ad Header */}
//         <View style={styles.videoAdHeader}>
//           <View style={styles.videoAdSponsor}>
//             <Text style={styles.videoAdSponsorText}>Sponsored • {currentVideoAd.sponsor}</Text>
//           </View>
//           <TouchableOpacity style={styles.skipButton} onPress={skipVideoAd}>
//             <Text style={styles.skipButtonText}>Skip in {adTimer}s</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Video Player */}
//         <View style={styles.videoPlayerContainer}>
//           {!isVideoLoaded && (
//             <Image 
//               source={{ uri: currentVideoAd.thumbnail }} 
//               style={styles.videoThumbnail}
//               resizeMode="cover"
//             />
//           )}
          
//           <Video
//             ref={videoRef}
//             source={{ uri: currentVideoAd.videoUrl }}
//             style={styles.videoPlayer}
//             resizeMode={ResizeMode.COVER}
//             paused={isVideoPaused}
//             onLoad={onVideoLoad}
//             onError={onVideoError}
//             repeat={false}
//             playWhenActive={true}
//             ignoreSilentSwitch={"obey"}
//           />

//           {/* Video Overlay Controls */}
//           <TouchableOpacity 
//             style={styles.videoOverlay}
//             onPress={toggleVideoPause}
//             activeOpacity={0.8}
//           >
//             <Animated.View style={[styles.playPauseButton, {
//               transform: [{ scale: playerScale }]
//             }]}>
//               <Icon 
//                 name={isVideoPaused ? "play-arrow" : "pause"} 
//                 size={40} 
//                 color="rgba(255, 255, 255, 0.9)" 
//               />
//             </Animated.View>
//           </TouchableOpacity>

//           {/* Video Progress Bar */}
//           <View style={styles.videoProgressContainer}>
//             <View style={styles.videoProgressBar}>
//               <View style={[styles.videoProgressFill, { width: `${videoProgress}%` }]} />
//             </View>
//           </View>
//         </View>

//         {/* Video Ad Info */}
//         <View style={styles.videoAdInfo}>
//           <Text style={styles.videoAdTitle}>{currentVideoAd.title}</Text>
//           <Text style={styles.videoAdDescription}>{currentVideoAd.description}</Text>
          
//           <TouchableOpacity style={styles.videoAdButton}>
//             <LinearGradient
//               colors={["#FF3366", "#FF6F00"]}
//               style={styles.videoAdButtonGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.videoAdButtonText}>{currentVideoAd.cta}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Mute/Unmute Button */}
//         <TouchableOpacity style={styles.muteButton}>
//           <Icon name="volume-up" size={16} color="#FFF" />
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   const renderUserCard = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.userCard}
//       activeOpacity={0.8}
//       onPress={() => {
//         animateButton();
//         navigation.navigate('Profile', { user: item });
//       }}
//     >
//       <View style={styles.imageContainer}>
//         <Image source={{ uri: item.image }} style={styles.userImage} />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.7)']}
//           style={styles.imageOverlay}
//         />
        
//         {/* Status badge */}
//         <View style={styles.statusBadge}>
//           <View style={[styles.statusDot, {backgroundColor: item.online ? '#4CAF50' : '#9E9E9E'}]} />
//           <Text style={styles.statusText}>{item.status}</Text>
//         </View>
        
//         {/* Distance badge */}
//         <View style={styles.distanceBadge}>
//           <Icon name="location-on" size={12} color="#FFF" />
//           <Text style={styles.distanceText}>{item.distance} away</Text>
//         </View>
//       </View>
      
//       <View style={styles.userInfo}>
//         <Text style={styles.userName}>{item.name}, {item.age}</Text>
        
//         <View style={styles.interestsContainer}>
//           {item.interests.slice(0, 2).map((interest, index) => (
//             <View key={index} style={styles.interestTag}>
//               <Text style={styles.interestText}>{interest}</Text>
//             </View>
//           ))}
//           {item.interests.length > 2 && (
//             <Text style={styles.moreInterests}>+{item.interests.length - 2} more</Text>
//           )}
//         </View>
        
//         <TouchableOpacity 
//           style={styles.chatButton}
//           onPress={() => navigation.navigate('Chat', { user: item })}
//         >
//           <LinearGradient
//             colors={["#FF3366", "#FF6F00"]}
//             style={styles.chatButtonGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Icon name="chat" size={16} color="#FFF" />
//             <Text style={styles.chatButtonText}>Say Hi</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle='light-content' backgroundColor='#000' />
      
//       {/* Header */}
//       <LinearGradient
//         colors={["#FF3366", "#FF6F00"]}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <View style={styles.headerContent}>
//           <Text style={[styles.headerTitle]}>Elite Sugar</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Icon name="notifications" size={28} color="#FFF" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <Icon name="message" size={27} color="#FFF" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView style={[styles.scrollView,{marginTop:-25}]} showsVerticalScrollIndicator={false}>
//         {/* Featured Profile */}
//         <View style={[styles.featuredSection]}>
//           <Animated.View style={[styles.featuredContainer, { 
//             opacity: fadeAnim,
//             transform: [{ translateX }]
//           }]}>
//             <Image source={{ uri: currentImage }} style={styles.featuredImage} />
            
//             {/* YouTube-style Video Ad Overlay */}
//             {renderVideoAd()}
            
//             {/* Top Right Status Container */}
//             <Animated.View style={[styles.topRightStatusContainer, {
//               transform: [
//                 { translateY: bounceInterpolate }
//               ]
//             }]}>
//               {/* Online Now with Multiple Animations */}
//               {featuredUser.online && (
//                 <Animated.View style={[styles.onlineNowContainer, {
//                   transform: [{ scale: pulseInterpolate }]
//                 }]}>
//                   <LinearGradient
//                     colors={['#4CAF50', '#45a049', '#4CAF50']}
//                     style={styles.onlineNowGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                   >
//                     <Animated.View style={[styles.pulseDot, {
//                       transform: [{ scale: pulseInterpolate }]
//                     }]}>
//                       <View style={styles.onlineDot} />
//                     </Animated.View>
//                     <Text style={styles.onlineNowText}>ONLINE NOW</Text>
//                     <Animated.View style={[styles.glowEffect, {
//                       opacity: glowInterpolate
//                     }]} />
//                   </LinearGradient>
//                 </Animated.View>
//               )}
              
//               {/* Distance Badge */}
//               <View style={styles.topRightDistanceBadge}>
//                 <Icon name="location-on" size={14} color="#FF3366" />
//                 <Text style={styles.topRightDistanceText}>{featuredUser.distance} nearby</Text>
//               </View>
//             </Animated.View>
            
//             <View style={styles.featuredContent}>
//               <Text style={styles.featuredName}>{featuredUser.name}, {featuredUser.age}</Text>
              
//               <View style={styles.featuredInterests}>
//                 {featuredUser.interests.slice(0, 3).map((interest, index) => (
//                   <View key={index} style={styles.featuredInterestTag}>
//                     <Text style={styles.featuredInterestText}>{interest}</Text>
//                   </View>
//                 ))}
//               </View>
              
//               <View style={styles.featuredActions}>
//                 <TouchableOpacity 
//                   style={styles.passButton}
//                   onPress={changeProfile}
//                 >
//                   <View style={[styles.passButtonContent,{}]}>
//                       <Icon name="close" size={24} color="#FFF" />
//                   </View>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={styles.featuredChatButton}
//                   onPress={() => navigation.navigate('Chat', { user: featuredUser })}
//                 >
//                   <LinearGradient
//                     colors={["#FF3366", "#FF6F00"]}
//                     style={styles.featuredChatGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                   >
//                     <Icon name="favorite" size={18} color="#FFF" />
//                     <Text style={styles.featuredChatText}>Message</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Animated.View>
//         </View>
        
//       </ScrollView>

//       {/*Bottom Navigation Bar ======================*/}
//      <BottomNav 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         scaleAnim={scaleAnim}
//         navigation={navigation}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FAFAFA",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop:50
//   },
//   headerTitle: {
//     fontSize: 34,
//     fontWeight: '800',
//     color: '#FFF',
//     letterSpacing: 1,
//     marginTop:-10
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   iconButton: {
//     marginLeft: 15,
//     position: 'relative',
//   },
//   // Featured Profile Styles
//   featuredSection: {
//     padding: 15,
//     alignItems: 'center', 
//     justifyContent: 'center', 
//   },
//   featuredContainer: {
//     width: width * 0.9, 
//     height: 500,
//     borderRadius: 25,
//     marginRight:200,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 10,
//     marginTop: 10,
//     alignSelf: 'center',
//     position: 'relative',
//   },
//   featuredImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   featuredContent: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   // YouTube-style Video Ad Styles
//   videoAdContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.95)',
//     margin: 10,
//     borderRadius: 15,
//     overflow: 'hidden',
//     zIndex: 100,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   videoAdHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   videoAdSponsor: {
//     flex: 1,
//   },
//   videoAdSponsorText: {
//     color: '#FF3366',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   skipButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   skipButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   videoPlayerContainer: {
//     height: 200,
//     position: 'relative',
//     backgroundColor: '#000',
//   },
//   videoThumbnail: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     zIndex: 1,
//   },
//   videoPlayer: {
//     width: '100%',
//     height: '100%',
//     zIndex: 2,
//   },
//   videoOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 3,
//   },
//   playPauseButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   videoProgressContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     zIndex: 4,
//     paddingHorizontal: 10,
//     paddingBottom: 5,
//   },
//   videoProgressBar: {
//     height: 3,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   videoProgressFill: {
//     height: '100%',
//     backgroundColor: '#FF3366',
//     borderRadius: 2,
//   },
//   videoAdInfo: {
//     padding: 15,
//   },
//   videoAdTitle: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   videoAdDescription: {
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontSize: 12,
//     marginBottom: 10,
//     lineHeight: 16,
//   },
//   videoAdButton: {
//     alignSelf: 'flex-start',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   videoAdButtonGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   videoAdButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   muteButton: {
//     position: 'absolute',
//     bottom: 70,
//     right: 15,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 5,
//   },
//   // ... (rest of your existing styles remain the same)
//   topRightStatusContainer: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     alignItems: 'flex-end',
//     zIndex: 20,
//   },
//   onlineNowContainer: {
//     marginBottom: 10,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: "#4CAF50",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   onlineNowGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     position: 'relative',
//   },
//   pulseDot: {
//     marginRight: 8,
//   },
//   onlineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#FFF',
//     shadowColor: "#FFF",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   onlineNowText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   glowEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 20,
//   },
//   topRightDistanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   topRightDistanceText: {
//     color: '#FF3366',
//     fontSize: 12,
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   featuredName: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#FFF',
//     marginBottom: 10,
//   },
//   featuredInterests: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   featuredInterestTag: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   featuredInterestText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   featuredActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   passButton: {
//     width: 80,
//     height: 50,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   featuredChatButton: {
//     borderRadius: 25,
//     overflow: 'hidden',
//     flex: 1,
//     marginLeft: 15,
//   },
//   featuredChatGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   featuredChatText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
 
//   container: {
//     flex: 1,
//     backgroundColor: "#FAFAFA",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop:50
//   },
//   headerTitle: {
//     fontSize: 34,
//     fontWeight: '800',
//     color: '#FFF',
//     letterSpacing: 1,
//     marginTop:-10
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   iconButton: {
//     marginLeft: 15,
//     position: 'relative',
//   },
//   // Featured Profile Styles
//   featuredSection: {
//     padding: 15,
//     alignItems: 'center', 
//     justifyContent: 'center', 
//   },
//   featuredContainer: {
//     width: width * 0.9, 
//     height: 500,
//     borderRadius: 25,
//     marginRight:200,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 10,
//     marginTop: 10,
//     alignSelf: 'center',
//     position: 'relative',
//   },
//   featuredImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   featuredContent: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   // YouTube-style Ad Styles
//   youtubeAdContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.95)',
//     margin: 10,
//     borderRadius: 15,
//     overflow: 'hidden',
//     zIndex: 100,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   adHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   adSponsor: {
//     flex: 1,
//   },
//   adSponsorText: {
//     color: '#FF3366',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   skipButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   skipButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   adContentWrapper: {
//     flexDirection: 'row',
//     padding: 15,
//   },
//   youtubeAdImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   youtubeAdInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   youtubeAdTitle: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   youtubeAdDescription: {
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontSize: 12,
//     marginBottom: 10,
//     lineHeight: 16,
//   },
//   youtubeAdButton: {
//     alignSelf: 'flex-start',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   youtubeAdButtonGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   youtubeAdButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   progressBarContainer: {
//     height: 3,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#FF3366',
//   },
//   // ... (rest of your existing styles remain the same)
//   topRightStatusContainer: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     alignItems: 'flex-end',
//     zIndex: 20,
//   },
//   onlineNowContainer: {
//     marginBottom: 10,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: "#4CAF50",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   onlineNowGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     position: 'relative',
//   },
//   pulseDot: {
//     marginRight: 8,
//   },
//   onlineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#FFF',
//     shadowColor: "#FFF",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   onlineNowText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   glowEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 20,
//   },
//   topRightDistanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   topRightDistanceText: {
//     color: '#FF3366',
//     fontSize: 12,
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   featuredName: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#FFF',
//     marginBottom: 10,
//   },
//   featuredInterests: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   featuredInterestTag: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   featuredInterestText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   featuredActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   passButton: {
//     width: 80,
//     height: 50,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   featuredChatButton: {
//     borderRadius: 25,
//     overflow: 'hidden',
//     flex: 1,
//     marginLeft: 15,
//   },
//   featuredChatGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   featuredChatText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },

//   container: {
//     flex: 1,
//     backgroundColor: "#FAFAFA",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop:50
//   },
//   headerTitle: {
//     fontSize: 34,
//     fontWeight: '800',
//     color: '#FFF',
//     letterSpacing: 1,
//     marginTop:-10
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   iconButton: {
//     marginLeft: 15,
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: '#FFE082',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationBadgeText: {
//     color: '#000',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   messageBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   messageBadgeText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   // Featured Profile Styles
//   featuredSection: {
//     padding: 15,
//     alignItems: 'center', 
//     justifyContent: 'center', 
//   },
//   featuredContainer: {
//     width: width * 0.9, 
//     height: 500,
//     borderRadius: 25,
//     marginRight:200,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//     elevation: 10,
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   featuredImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   featuredContent: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   // Top Right Status Styles
//   topRightStatusContainer: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     alignItems: 'flex-end',
//     zIndex: 20,
//   },
//   onlineNowContainer: {
//     marginBottom: 10,
//     borderRadius: 20,
//     overflow: 'hidden',
//     shadowColor: "#4CAF50",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   onlineNowGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     position: 'relative',
//   },
//   pulseDot: {
//     marginRight: 8,
//   },
//   onlineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#FFF',
//     shadowColor: "#FFF",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   onlineNowText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   glowEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 20,
//   },
//   topRightDistanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   topRightDistanceText: {
//     color: '#FF3366',
//     fontSize: 12,
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   featuredName: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#FFF',
//     marginBottom: 10,
//   },
//   featuredInterests: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   featuredInterestTag: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   featuredInterestText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   featuredActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   passButton: {
//     width: 80,
//     height: 50,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   featuredChatButton: {
//     borderRadius: 25,
//     overflow: 'hidden',
//     flex: 1,
//     marginLeft: 15,
//   },
//   featuredChatGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   featuredChatText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   // ... (rest of the styles remain the same as your original code)
//   // Section Styles
//   section: {
//     marginBottom: 25,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   seeAllText: {
//     color: '#FF3366',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // Daily Matches Styles
//   dailyMatchesContent: {
//     paddingHorizontal: 10,
//   },
//   dailyMatchCard: {
//     width: 80,
//     height: 80,
//     borderColor:'#b4b1b2ff',
//     borderWidth:2,
//     borderStyle:'dotted',
//     borderRadius:50,
//     overflow: 'hidden',
//     marginHorizontal: 5,
//     position: 'relative',
//   },
//   dailyMatchImage: {
//     width: '100%',
//     height: '100%',
//   },
//   dailyMatchOverlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '50%',
//   },
//   dailyMatchContent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 10,
//   },
//   dailyMatchName: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     textAlign:'center'
//   },
//   // People Nearby Styles
//   columnWrapper: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   userCard: {
//     width: (width - 40) / 2,
//     backgroundColor: '#FFF',
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   imageContainer: {
//     height: 180,
//     position: 'relative',
//   },
//   userImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '40%',
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginRight: 5,
//   },
//   statusText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   distanceBadge: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   distanceText: {
//     color: '#FFF',
//     fontSize: 10,
//     marginLeft: 3,
//     fontWeight: '600',
//   },
//   userInfo: {
//     padding: 12,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   interestsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   interestTag: {
//     backgroundColor: '#F1F1F1',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     marginRight: 5,
//     marginBottom: 5,
//   },
//   interestText: {
//     color: '#666',
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   moreInterests: {
//     color: '#FF3366',
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   chatButton: {
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   chatButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//   },
//   chatButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
// });