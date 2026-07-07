// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useTheme } from '../src/context/ThemeContext';

// const { width } = Dimensions.get('window');

// const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
//   const { colors, theme, isDark } = useTheme(); 
  
//   const navItems = [
//     {
//       name: 'Chats',
//       icon: 'chatbox-ellipses-outline',
//       activeIcon: 'chatbubble',
//       route: 'Home',
//       action: () => navigation.navigate('PHome')
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
//       route: 'StatusBar',
//       action: () => navigation.navigate('PStatusBar')
//     },
//     {
//       name: 'Profile',
//       icon: 'person-outline',
//       activeIcon: 'person',
//       route: 'UserPersonalAccountProfile',
//       action: () => navigation.navigate('UserPersonalAccountProfile')
//     }
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={[
//         styles.navContainer, 
//         { 
//           backgroundColor: colors.surface,
//           borderTopColor: colors.border,
//           shadowColor: colors.shadow
//         }
//       ]}>
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
//                   colors={[colors.primary, colors.primaryDark || colors.primary]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={[
//                     styles.centerButtonGradient,
//                     { borderColor: colors.surface }
//                   ]}
//                 >
//                   <Icon 
//                     name={item.icon} 
//                     size={28} 
//                     color={colors.textInverse} 
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
//               style={[
//                 styles.navItem,
//                 index < 2 ? { marginRight: width * 0.1 } : { marginLeft: width * 0.1 }
//               ]}
//               onPress={item.action}
//               activeOpacity={0.7}
//             >
//               <View style={styles.iconContainer}>
//                 <Icon 
//                   name={iconName} 
//                   size={27} 
//                   color={isActive ? colors.primary : colors.icon} 
//                 />
//                 {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
//               </View>
//               <Text style={[
//                 styles.navLabel,
//                 { color: isActive ? colors.primary : colors.icon },
//                 isActive && styles.activeNavLabel
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

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//   },
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 70,
//     paddingHorizontal: width * 0.03,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 12,
//     borderTopWidth: 0.5,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: width * 0.13,
//     paddingVertical: 8,
//   },
//   iconContainer: {
//     position: 'relative',
//     padding: 4,
//   },
//   navLabel: {
//     fontSize: 12,
//     fontFamily: 'SourceSansPro-Medium',
//     marginTop: 4,
//     letterSpacing: 0.2
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
//   },
//   centerButton: {
//     position: 'absolute',
//     top: -30,
//     left: width / 2 - 30,
//     zIndex: 100,
//   },
//   centerButtonGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     elevation: 8,
//     borderWidth: 1.2,
//   },
// });

// export default BottomNav;

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Responsive utility functions
const responsiveSize = (size) => {
  const baseWidth = 375;
  const scale = width / baseWidth;
  return Math.round(size * Math.min(scale, 1.5));
};

const isTablet = () => {
  return width >= 768 && height >= 1024;
};

const isSmallDevice = () => {
  return width < 360;
};

// Android 15+ specific optimizations
const isAndroid15Plus = () => {
  return Platform.OS === 'android' && Platform.Version >= 35;
};

const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
  const { colors, theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const navItems = [
    {
      name: 'Chats',
      icon: 'chatbox-ellipses-outline',
      activeIcon: 'chatbubble',
      route: 'Home',
      action: () => navigation.navigate('PHome')
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
      route: 'StatusBar',
      action: () => navigation.navigate('PStatusBar')
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      route: 'UserPersonalAccountProfile',
      action: () => navigation.navigate('UserPersonalAccountProfile')
    }
  ];

  const getNavItemWidth = () => {
    if (isTablet()) return width * 0.09;
    if (isSmallDevice()) return width * 0.15;
    return width * 0.13;
  };

  const getNavItemMargin = () => {
    if (isTablet()) return width * 0.08;
    if (isSmallDevice()) return width * 0.12;
    return width * 0.1;
  };

  const getCenterButtonSize = () => {
    if (isTablet()) return 72;
    if (isSmallDevice()) return 50;
    if (isAndroid15Plus()) return 64;
    return 60;
  };

  const getCenterButtonTop = () => {
    if (isTablet()) return -36;
    if (isSmallDevice()) return -25;
    if (isAndroid15Plus()) return -32;
    return -30;
  };

  const getIconSize = () => {
    if (isTablet()) return 32;
    if (isSmallDevice()) return 22;
    if (isAndroid15Plus()) return 29;
    return 27;
  };

  const getNavHeight = () => {
    if (isTablet()) return 85;
    if (isSmallDevice()) return 60;
    if (isAndroid15Plus()) return 75;
    return 70;
  };

  const getFontSize = () => {
    if (isTablet()) return 14;
    if (isSmallDevice()) return 10;
    if (isAndroid15Plus()) return 13;
    return 12;
  };

  const getPaddingHorizontal = () => {
    if (isTablet()) return width * 0.05;
    if (isSmallDevice()) return width * 0.02;
    if (isAndroid15Plus()) return width * 0.04;
    return width * 0.03;
  };

  const getElevation = () => {
    if (isAndroid15Plus()) return 24;
    return 12;
  };

  const getShadowOpacity = () => {
    if (isAndroid15Plus()) return 0.12;
    return 0.08;
  };

  const getRippleColor = () => {
    return colors.primary + '30';
  };

  const centerButtonSize = getCenterButtonSize();
  const iconSize = getIconSize();
  const navHeight = getNavHeight();

  // Calculate bottom padding to account for system navigation bar
  const getBottomPadding = () => {
    if (Platform.OS === 'ios') {
      return insets.bottom || 20;
    }
    // Android 15+ with gesture navigation
    if (isAndroid15Plus()) {
      // Use safe area insets or default to 34 for gesture bar
      return Math.max(insets.bottom, 34);
    }
    // Older Android with 3-button navigation
    return Math.max(insets.bottom, 0);
  };

  const bottomPadding = getBottomPadding();

  return (
    <View 
      style={[
        styles.container,
        {
          bottom: 0,
          // Add padding for system navigation
          paddingBottom: bottomPadding,
          // Android 15+ edge-to-edge
          ...(isAndroid15Plus() && {
            paddingBottom: bottomPadding,
          })
        }
      ]}
    >
      <View style={[
        styles.navContainer, 
        { 
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          shadowColor: colors.shadow,
          height: navHeight,
          paddingHorizontal: getPaddingHorizontal(),
          elevation: getElevation(),
          shadowOpacity: getShadowOpacity(),
          ...(isTablet() && styles.tabletNavContainer),
          ...(isSmallDevice() && styles.smallNavContainer),
          ...(isAndroid15Plus() && {
            borderTopWidth: 0.3,
            borderTopColor: colors.border + '40',
            shadowRadius: 20,
            // Add extra padding at bottom for better touch
            paddingBottom: 4,
          })
        }
      ]}>
        {navItems.map((item, index) => {
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.centerButton,
                  { 
                    top: getCenterButtonTop(),
                    left: width / 2 - centerButtonSize / 2,
                  }
                ]}
                onPress={item.action}
                activeOpacity={0.9}
                android_ripple={{
                  color: getRippleColor(),
                  borderless: true,
                  radius: centerButtonSize / 2,
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark || colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.centerButtonGradient,
                    { 
                      width: centerButtonSize,
                      height: centerButtonSize,
                      borderRadius: centerButtonSize / 2,
                      borderColor: colors.surface,
                      ...(isAndroid15Plus() && {
                        shadowColor: colors.primary,
                        shadowOpacity: 0.35,
                        shadowRadius: 16,
                        elevation: 16,
                        borderWidth: 1.5,
                      }),
                      ...(isTablet() && styles.tabletCenterButton),
                      ...(isSmallDevice() && styles.smallCenterButton)
                    }
                  ]}
                >
                  <Icon 
                    name={item.icon} 
                    size={isTablet() ? 34 : isSmallDevice() ? 24 : isAndroid15Plus() ? 30 : 28} 
                    color={colors.textInverse} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          const isActive = activeRoute === item.route;
          const iconName = isActive ? item.activeIcon : item.icon;
          const navItemWidth = getNavItemWidth();
          const navItemMargin = getNavItemMargin();

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.navItem,
                { 
                  width: navItemWidth,
                  ...(index < 2 ? { marginRight: navItemMargin } : { marginLeft: navItemMargin }),
                  ...(isTablet() && styles.tabletNavItem),
                  ...(isSmallDevice() && styles.smallNavItem)
                }
              ]}
              onPress={item.action}
              activeOpacity={0.7}
              android_ripple={{
                color: getRippleColor(),
                borderless: true,
                radius: navItemWidth / 2,
              }}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name={iconName} 
                  size={iconSize} 
                  color={isActive ? colors.primary : colors.icon} 
                />
                {isActive && (
                  <View style={[
                    styles.activeIndicator, 
                    { 
                      backgroundColor: colors.primary,
                      ...(isTablet() && styles.tabletActiveIndicator),
                      ...(isSmallDevice() && styles.smallActiveIndicator),
                      ...(isAndroid15Plus() && {
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        shadowColor: colors.primary,
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 4,
                      })
                    }
                  ]} />
                )}
              </View>
              <Text style={[
                styles.navLabel,
                { 
                  color: isActive ? colors.primary : colors.icon,
                  fontSize: getFontSize(),
                  ...(isTablet() && styles.tabletNavLabel),
                  ...(isSmallDevice() && styles.smallNavLabel),
                  ...(isAndroid15Plus() && {
                    fontFamily: 'SourceSansPro-SemiBold',
                    letterSpacing: 0.3,
                  })
                },
                isActive && styles.activeNavLabel
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 12,
    borderTopWidth: 0.5,
    // Ensure it's clickable
    pointerEvents: 'auto',
  },
  tabletNavContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowRadius: 16,
    elevation: 16,
  },
  smallNavContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    // Ensure touch targets are large enough
    minHeight: 44,
  },
  tabletNavItem: {
    paddingVertical: 10,
    minHeight: 50,
  },
  smallNavItem: {
    paddingVertical: 6,
    minHeight: 40,
  },
  iconContainer: {
    position: 'relative',
    padding: 4,
  },
  navLabel: {
    fontFamily: 'SourceSansPro-Medium',
    marginTop: 4,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tabletNavLabel: {
    marginTop: 6,
    letterSpacing: 0.3,
  },
  smallNavLabel: {
    marginTop: 3,
    letterSpacing: 0.1,
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
  },
  tabletActiveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  smallActiveIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centerButton: {
    position: 'absolute',
    zIndex: 100,
  },
  centerButtonGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.2,
  },
  tabletCenterButton: {
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1.5,
  },
  smallCenterButton: {
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
});

export default BottomNav;