// import React, { useEffect, useRef } from 'react';
// import { 
//   View, 
//   Image, 
//   StyleSheet, 
//   Dimensions, 
//   Animated, 
//   StatusBar,
//   SafeAreaView,Text
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import LinearGradient from 'react-native-linear-gradient';

// const { width, height } = Dimensions.get('window');

// export default function SplashScreen() {
//   const navigation = useNavigation();
//   const logoScale = useRef(new Animated.Value(0.8)).current;
//   const logoOpacity = useRef(new Animated.Value(0)).current;
//   const dot1 = useRef(new Animated.Value(1)).current;
//   const dot2 = useRef(new Animated.Value(1)).current;
//   const dot3 = useRef(new Animated.Value(1)).current;

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (response.status === 200) {
//         return response.data;
//       }
//       return null;
//     } catch (err) {
//      // console.error('fetchProfile error:', err);
//       return null;
//     }
//   };

//   const switchAccount = async () => {
//     try {
//       const profile = await fetchProfile();
//       if (profile?.name?.trim()) {
//         navigation.navigate('BusinessHome');
//       } else {
//         navigation.navigate('ProceedOptions');
//       }
//     } catch (error) {
//       navigation.navigate('Signin');
//     }
//   };

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(logoScale, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(logoOpacity, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const checkAuth = async () => {
//       try {
//         const [token, refreshToken, biometricEnabled] = await Promise.all([
//           AsyncStorage.getItem('userToken'),
//           AsyncStorage.getItem('refreshToken'),
//           AsyncStorage.getItem('biometric_enabled')
//         ]);

//         if (token) {
//           if (biometricEnabled === 'true') {
//             navigation.navigate('Biometric');
//           } else {
//             await switchAccount();
//           }
//           return;
//         }

//         if (refreshToken) {
//           try {
//             const response = await axios.post(`${API_ROUTE}/auth/token/refresh/`, {
//               refresh: refreshToken
//             });

//             if (response.data?.access) {
//               await AsyncStorage.setItem('userToken', response.data.access);
//               const bioEnabled = await AsyncStorage.getItem('biometric_enabled');
//               if (bioEnabled === 'true') {
//                 navigation.navigate('Biometric');
//               } else {
//                 await switchAccount();
//               }
//               return;
//             }
//           } catch (refreshError) {
           
//             await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
//           }
//         }

//         navigation.navigate('Signin');
//       } catch (error) {
       
//         navigation.navigate('Signin');
//       }
//     };

//     const timer = setTimeout(checkAuth, 1000);
//     return () => clearTimeout(timer);
//   }, [navigation]);

//   useEffect(() => {
//     const animateDot = (dot, delay) => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, {
//             toValue: 1.5,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//           Animated.timing(dot, {
//             toValue: 1,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     };

//     animateDot(dot1, 0);
//     animateDot(dot2, 200);
//     animateDot(dot3, 400);
//   }, []);

//   return (
//     <LinearGradient
//       colors={['#0d64dd', '#0750b5']}
//       style={styles.container}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 1}}
//     >
//       <StatusBar backgroundColor="#0750b5" barStyle="light-content" />
//       <SafeAreaView style={styles.safeArea}>
        
       
//         <View style={styles.logoContainer}>
//           <Animated.Image
//             source={require('../assets/images/elogo.png')}
//             style={[
//               styles.logo,
//               {
//                 transform: [{ scale: logoScale }],
//                 opacity: logoOpacity,
//               }
//             ]}
//             resizeMode="contain"
//           />
          
//         </View>
        
//         <View style={styles.bottomContainer}>
//           <View style={styles.dotsContainer}>
//             <Animated.View style={[styles.dot, { transform: [{ scale: dot1 }] }]} />
//             <Animated.View style={[styles.dot, { transform: [{ scale: dot2 }] }]} />
//             <Animated.View style={[styles.dot, { transform: [{ scale: dot3 }] }]} />
//           </View>
//         </View>
        
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   logoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: width * 0.4,  
//     height: width * 0.4, 
//     tintColor: '#fff',
//   },
//   bottomContainer: {
//     paddingBottom: 40,
//     alignItems: 'center',
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 6,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     marginHorizontal: 8,
//   },
// });

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(1)).current;
  const dot2 = useRef(new Animated.Value(1)).current;
  const dot3 = useRef(new Animated.Value(1)).current;

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
     // console.error('fetchProfile error:', err);
      return null;
    }
  };

  const switchAccount = async () => {
    try {
      const profile = await fetchProfile();
      if (profile?.name?.trim()) {
        return 'BusinessHome';
      } else {
        return 'ProceedOptions';
        //return 'Signin';
      }
    } catch (error) {
      return 'Signin';
    }
  };

  const checkAuth = async () => {
    try {
      const [token, refreshToken, biometricEnabled] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('refreshToken'),
        AsyncStorage.getItem('biometric_enabled')
      ]);

      if (token) {
        if (biometricEnabled === 'true') {
          return 'Biometric';
        } else {
          return await switchAccount();
        }
      }

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_ROUTE}/auth/token/refresh/`, {
            refresh: refreshToken
          });

          if (response.data?.access) {
            await AsyncStorage.setItem('userToken', response.data.access);
            const bioEnabled = await AsyncStorage.getItem('biometric_enabled');
            if (bioEnabled === 'true') {
              return 'Biometric';
            } else {
              return await switchAccount();
            }
          }
        } catch (refreshError) {
         
          await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        }
      }

      return 'Signin';
    } catch (error) {
     
      return 'Signin';
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const startTime = Date.now();
    checkAuth().then((target) => {
      const elapsed = Date.now() - startTime;
      const remaining = 2000 - elapsed;
      if (remaining > 0) {
        setTimeout(() => navigation.navigate(target), remaining);
      } else {
        navigation.navigate(target);
      }
    });

  }, [navigation]);

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  return (
    <LinearGradient
      colors={['#0d64dd', '#0750b5']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <StatusBar backgroundColor="#0750b5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
       
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../assets/images/elogo.png')}
            style={[
              styles.logo,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              }
            ]}
            resizeMode="contain"
          />
          
        </View>
        
        <View style={styles.bottomContainer}>
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { transform: [{ scale: dot1 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dot2 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dot3 }] }]} />
          </View>
        </View>
        
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,  
    height: width * 0.4, 
    tintColor: '#fff',
  },
  bottomContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginHorizontal: 8,
  },
});