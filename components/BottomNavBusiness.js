// // import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import React from 'react';
// // import { useTheme } from '../src/context/ThemeContext';

// // const { width } = Dimensions.get('window');

// // const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
// //   const { colors, isDark } = useTheme();
  
// //   const navItems = [
// //     {
// //       name: 'Chats',
// //       icon: 'chatbox-ellipses-outline',
// //       activeIcon: 'chatbubble',
// //       route: 'Home',
// //       action: () => navigation.navigate('BusinessHome')
// //     },
// //     {
// //       name: 'Calls',
// //       icon: 'call-outline',
// //       activeIcon: 'call',
// //       route: 'Calls',
// //       action: () => navigation.navigate('BCalls')
// //     },
// //     {
// //       name: 'New',
// //       icon: 'swap-horizontal-outline',
// //       action: () => setShowAccountModal(true),
// //       isCenter: true
// //     },
// //     {
// //       name: 'Status',
// //       icon: 'albums-outline',
// //       activeIcon: 'albums',
// //       route: 'BStatusBar',
// //       action: () => navigation.navigate('BStatusBar')
// //     },
// //     {
// //       name: 'Explore',
// //       icon: 'briefcase-outline',     
// //       activeIcon: 'person',
// //       route: 'Explore',
// //       action: () => navigation.navigate('Explore')
// //     }
// //   ];

// //   const styles = createStyles(width, colors, isDark);

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.navContainer}>
// //         {navItems.map((item, index) => {
// //           if (item.isCenter) {
// //             return (
// //               <TouchableOpacity
// //                 key={index}
// //                 style={styles.centerButton}
// //                 onPress={item.action}
// //                 activeOpacity={0.9}
// //               >
// //                 <LinearGradient
// //                   colors={['#0d64dd', '#3a7bd5']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.centerButtonGradient}
// //                 >
// //                   <Icon 
// //                     name={item.icon} 
// //                     size={28} 
// //                     color="#fff" 
// //                   />
// //                 </LinearGradient>
// //               </TouchableOpacity>
// //             );
// //           }

// //           const isActive = activeRoute === item.route;
// //           const iconName = isActive ? item.activeIcon : item.icon;

// //           return (
// //             <TouchableOpacity
// //               key={index}
// //               style={[
// //                 styles.navItem,
// //                 index < 2 ? { marginRight: width * 0.1 } : { marginLeft: width * 0.1 }
// //               ]}
// //               onPress={item.action}
// //               activeOpacity={0.7}
// //             >
// //               <View style={styles.iconContainer}>
// //                 <Icon 
// //                   name={iconName} 
// //                   size={27} 
// //                   color={isActive ? colors.iconActive : colors.icon} 
// //                 />
// //                 {isActive && <View style={styles.activeIndicator} />}
// //               </View>
// //               <Text style={[
// //                 styles.navLabel,
// //                 { color: colors.icon },
// //                 isActive && [styles.activeNavLabel, { color: colors.iconActive }]
// //               ]}>
// //                 {item.name}
// //               </Text>
// //             </TouchableOpacity>
// //           );
// //         })}
// //       </View>
// //     </View>
// //   );
// // };

// // const createStyles = (width, colors, isDark) => StyleSheet.create({
// //   container: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'transparent',
// //   },
// //   navContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     height: 70,
// //     paddingHorizontal: width * 0.03,
// //     backgroundColor: colors.tabBackground,
// //     borderTopLeftRadius: 16,
// //     borderTopRightRadius: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: -2 },
// //     shadowOpacity: isDark ? colors.shadow : 0.08,
// //     shadowRadius: 12,
// //     elevation: 12,
// //     borderTopWidth: 1,
// //     borderColor: colors.border
// //   },
// //   navItem: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: width * 0.13,
// //     paddingVertical: 8,
// //   },
// //   iconContainer: {
// //     position: 'relative',
// //     padding: 4,
// //   },
// //   navLabel: {
// //     fontSize: 12,
// //     fontFamily: 'SourceSansPro-Medium',
// //     marginTop: 4,
// //     letterSpacing: 0.2
// //   },
// //   activeNavLabel: {
// //     fontWeight: '600',
// //   },
// //   activeIndicator: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: colors.iconActive,
// //   },
// //   centerButton: {
// //     position: 'absolute',
// //     top: -30,
// //     left: width / 2 - 30,
// //     zIndex: 100,
// //   },
// //   centerButtonGradient: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 12,
// //     elevation: 8,
   
// //   },
// // });

// // export default BottomNav;

// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import React from 'react';
// import { useTheme } from '../src/context/ThemeContext';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');

// const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
//   const { colors, isDark } = useTheme();
//   const insets = useSafeAreaInsets();
  
//   const navItems = [
//     {
//       name: 'Chats',
//       icon: 'chatbox-ellipses-outline',
//       activeIcon: 'chatbubble',
//       route: 'Home',
//       action: () => navigation.navigate('BusinessHome')
//     },
//     {
//       name: 'Calls',
//       icon: 'call-outline',
//       activeIcon: 'call',
//       route: 'Calls',
//       action: () => navigation.navigate('BCalls')
//     },
//     {
//       name: 'New',
//       icon: 'swap-horizontal-outline',
//       action: () => setShowAccountModal(true),
//       isCenter: true
//     },
//     {
//       name: 'Status',
//       icon: 'albums-outline',
//       activeIcon: 'albums',
//       route: 'BStatusBar',
//       action: () => navigation.navigate('BStatusBar')
//     },
//     {
//       name: 'Explore',
//       icon: 'briefcase-outline',     
//       activeIcon: 'person',
//       route: 'Explore',
//       action: () => navigation.navigate('Explore')
//     }
//   ];

//   // Calculate bottom padding based on device
//   const getBottomPadding = () => {
//     if (Platform.OS === 'android') {
//       // For Android 14+ with gesture navigation
//       return Math.max(insets.bottom, 0);
//     }
//     // For iOS
//     return Math.max(insets.bottom, 0);
//   };

//   const styles = createStyles(width, colors, isDark, getBottomPadding());

//   return (
//     <View style={[
//       styles.container,
//       { paddingBottom: getBottomPadding() }
//     ]}>
//       <View style={styles.navContainer}>
//         {navItems.map((item, index) => {
//           if (item.isCenter) {
//             return (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.centerButton}
//                 onPress={item.action}
//                 activeOpacity={0.9}
//               >
//                 <LinearGradient
//                   colors={['#0d64dd', '#3a7bd5']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.centerButtonGradient}
//                 >
//                   <Icon 
//                     name={item.icon} 
//                     size={28} 
//                     color="#fff" 
//                   />
//                 </LinearGradient>
//               </TouchableOpacity>
//             );
//           }

//           const isActive = activeRoute === item.route;
//           const iconName = isActive ? item.activeIcon : item.icon;

//           return (
//             <TouchableOpacity
//               key={index}
//               style={styles.navItem}
//               onPress={item.action}
//               activeOpacity={0.7}
//             >
//               <View style={styles.iconContainer}>
//                 <Icon 
//                   name={iconName} 
//                   size={27} 
//                   color={isActive ? colors.iconActive : colors.icon} 
//                 />
//                 {isActive && <View style={styles.activeIndicator} />}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: colors.icon },
//                 isActive && [styles.activeNavLabel, { color: colors.iconActive }]
//               ]}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const createStyles = (width, colors, isDark, bottomPadding) => StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//   },
  
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: Platform.OS === 'android' ? 65 : 70,
//     paddingHorizontal: width * 0.03,
//     backgroundColor: colors.tabBackground,
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: isDark ? colors.shadow : 0.08,
//     shadowRadius: 12,
//     elevation: 12,
//     pointerEvents: 'auto',
//     borderTopWidth: 1,
//     borderColor: colors.border,
//     paddingBottom: Platform.OS === 'android' ? 0 : 0,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 0,
//   },
//   iconContainer: {
//     position: 'relative',
//     padding: 4,
//   },
//   navLabel: {
//     fontSize: 11,
//     fontFamily: 'SourceSansPro-Medium',
//     marginTop: 4,
//     letterSpacing: 0.2,
//     textAlign: 'center',
//   },
//   activeNavLabel: {
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: colors.iconActive,
//   },
//   centerButton: {
//     position: 'absolute',
//     top: -30,
//     left: width / 2 - 30,
//     zIndex: 100,
//     elevation: 10,
//   },
//   centerButtonGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     elevation: 8,
//   },
// });

// export default BottomNav;
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const navItems = [
    {
      name: 'Chats',
      icon: 'chatbox-ellipses-outline',
      activeIcon: 'chatbubble',
      route: 'Home',
      action: () => navigation.navigate('BusinessHome')
    },
    {
      name: 'Calls',
      icon: 'call-outline',
      activeIcon: 'call',
      route: 'Calls',
      action: () => navigation.navigate('BCalls')
    },
    {
      name: 'New',
      icon: 'swap-horizontal-outline',
      action: () => setShowAccountModal(true),
      isCenter: true
    },
    {
      name: 'Status',
      icon: 'albums-outline',
      activeIcon: 'albums',
      route: 'BStatusBar',
      action: () => navigation.navigate('BStatusBar')
    },
    {
      name: 'Explore',
      icon: 'briefcase-outline',     
      activeIcon: 'person',
      route: 'Explore',
      action: () => navigation.navigate('Explore')
    }
  ];

  // Calculate bottom padding based on device
  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      return Math.max(insets.bottom, 0);
    }
    return Math.max(insets.bottom, 0);
  };

  const styles = createStyles(width, colors, isDark, getBottomPadding());

  return (
    <View style={[
      styles.container,
      { paddingBottom: getBottomPadding() }
    ]}>
      <View style={styles.navContainer}>
        {/* Left side items (Chats & Calls) */}
        <View style={styles.leftItems}>
          {navItems.slice(0, 2).map((item) => {
            const isActive = activeRoute === item.route;
            const iconName = isActive ? item.activeIcon : item.icon;

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Icon 
                    name={iconName} 
                    size={27} 
                    color={isActive ? colors.iconActive : colors.icon} 
                  />
                  {isActive && <View style={styles.activeIndicator} />}
                </View>
                <Text style={[
                  styles.navLabel,
                  { color: colors.icon },
                  isActive && [styles.activeNavLabel, { color: colors.iconActive }]
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center Button */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={navItems[2].action}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#0d64dd', '#3a7bd5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.centerButtonGradient}
          >
            <Icon 
              name={navItems[2].icon} 
              size={28} 
              color="#fff" 
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Right side items (Status & Explore) */}
        <View style={styles.rightItems}>
          {navItems.slice(3, 5).map((item) => {
            const isActive = activeRoute === item.route;
            const iconName = isActive ? item.activeIcon : item.icon;

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Icon 
                    name={iconName} 
                    size={27} 
                    color={isActive ? colors.iconActive : colors.icon} 
                  />
                  {isActive && <View style={styles.activeIndicator} />}
                </View>
                <Text style={[
                  styles.navLabel,
                  { color: colors.icon },
                  isActive && [styles.activeNavLabel, { color: colors.iconActive }]
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const createStyles = (width, colors, isDark, bottomPadding) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'android' ? 65 : 70,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.tabBackground,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: isDark ? colors.shadow : 0.08,
    shadowRadius: 12,
    elevation: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  leftItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 20,
  },
  rightItems: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 70,
  },
  iconContainer: {
    position: 'relative',
    padding: 4,
  },
  navLabel: {
    fontSize: 11,
    fontFamily: 'SourceSansPro-Medium',
    marginTop: 4,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  activeNavLabel: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.iconActive,
  },
  centerButton: {
    position: 'relative',
    top: -25,
    zIndex: 100,
    elevation: 10,
    marginHorizontal: 10,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default BottomNav;