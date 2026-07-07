
// import React, { useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Animated,
//   Dimensions,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useTheme } from '../src/context/ThemeContext';

// const { height } = Dimensions.get('window');

// const AccountSwitchBottomSheet = ({ 
//   visible, 
//   onClose, 
//   navigation, 
//   colors, 
//   isDark 
// }) => {
//   const slideAnim = useRef(new Animated.Value(height)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         tension: 65,
//         friction: 11,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   const handleSwitchToVibbz = () => {
//     onClose();
//     navigation.navigate('SocialHome');
//   };

//   const handleSwitchToBroadcast = () => {
//     onClose();
//     navigation.navigate('BroadcastHome');
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <TouchableOpacity 
//         style={styles.overlay} 
//         activeOpacity={1} 
//         onPress={onClose}
//       >
//         <Animated.View 
//           style={[
//             styles.sheet,
//             { 
//               backgroundColor: colors.background,
//               transform: [{ translateY: slideAnim }]
//             }
//           ]}
//         >
//           {/* Handle Bar */}
//           <View style={styles.handleBar} />

//           {/* Close Button */}
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={onClose}
//           >
//             <Icon name="close" size={24} color={colors.text} />
//           </TouchableOpacity>

//           {/* Content */}
//           <View style={styles.content}>
//             <Text style={[styles.title, { color: colors.text }]}>
//               Choose Your Experience
//             </Text>
            
//             <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//               Switch between e-Vibbz and e-Broadcast
//             </Text>

//             <TouchableOpacity
//               style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}
//               onPress={handleSwitchToVibbz}
//             >
//               <View style={[styles.optionIcon, { backgroundColor: '#9704e0' }]}>
//                 <Icon name="play-circle" size={24} color="#fff" />
//               </View>
//               <View style={styles.optionContent}>
//                 <Text style={[styles.optionTitle, { color: colors.text }]}>e-Vibbz</Text>
//                 <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
//                   Short videos & reels
//                 </Text>
//               </View>
//               <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}
//               onPress={handleSwitchToBroadcast}
//             >
//               <View style={[styles.optionIcon, { backgroundColor: '#0d6efd' }]}>
//                 <Icon name="megaphone" size={24} color="#fff" />
//               </View>
//               <View style={styles.optionContent}>
//                 <Text style={[styles.optionTitle, { color: colors.text }]}>e-Broadcast</Text>
//                 <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
//                   Posts & live streaming
//                 </Text>
//               </View>
//               <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>

            
//           </View>
//         </Animated.View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingBottom: 40,
//     maxHeight: height * 0.8,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginTop: 8,
//     marginBottom: 4,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 16,
//     right: 20,
//     zIndex: 10,
//     padding: 4,
//   },
//   content: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//   },
//   optionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   optionContent: {
//     flex: 1,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   optionDesc: {
//     fontSize: 13,
//   },
//   switchAccount: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginTop: 8,
//     gap: 8,
//   },
//   switchAccountText: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
// });

// export default AccountSwitchBottomSheet;
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext';

const { height } = Dimensions.get('window');

const AccountSwitchBottomSheet = ({ 
  visible, 
  onClose, 
  navigation, 
  colors, 
  isDark 
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSwitchToVibbz = () => {
    onClose();
    setTimeout(() => navigation.navigate('SocialHome'), 300);
  };

  const handleSwitchToBroadcast = () => {
    onClose();
    setTimeout(() => navigation.navigate('BroadcastHome'), 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.sheet,
            { 
              backgroundColor: colors.background || '#FFFFFF',
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <View style={[styles.closeButtonCircle, { backgroundColor: colors.border || '#E8E8E8' }]}>
              <Icon name="close" size={20} color={colors.text || '#333'} />
            </View>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text || '#1A1A1A', fontFamily: isDark ? 'Poppins-Bold' : 'Poppins-SemiBold' }]}>
              Switch Experience
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary || '#6B7280', fontFamily: isDark ? 'Poppins-Regular' : 'Poppins-Light' }]}>
              Choose the platform that fits your needs
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option, 
                { 
                  backgroundColor: colors.card || '#F8F9FA',
                  borderColor: colors.border || '#E5E7EB',
                }
              ]}
              onPress={handleSwitchToVibbz}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#9704e0' }]}>
                <Icon name="play-circle" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text || '#1A1A1A' }]}>
                  e-Vibbz
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary || '#6B7280' }]}>
                  Short videos & reels
                </Text>
              </View>
              <View style={[styles.chevronContainer, { backgroundColor: colors.border || '#E5E7EB' }]}>
                <Icon name="chevron-forward" size={18} color={colors.textSecondary || '#6B7280'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option, 
                { 
                  backgroundColor: colors.card || '#F8F9FA',
                  borderColor: colors.border || '#E5E7EB',
                }
              ]}
              onPress={handleSwitchToBroadcast}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#0d6efd' }]}>
                <Icon name="megaphone" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text || '#1A1A1A' }]}>
                  e-Broadcast
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary || '#6B7280' }]}>
                  Posts & live streaming
                </Text>
              </View>
              <View style={[styles.chevronContainer, { backgroundColor: colors.border || '#E5E7EB' }]}>
                <Icon name="chevron-forward" size={18} color={colors.textSecondary || '#6B7280'} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary || '#6B7280' }]}>
              Current session will be switched
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
    maxHeight: height * 0.75,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 20,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: 'center',
    marginBottom:20
  },
  footerText: {
    fontSize: 13,
    letterSpacing: 0.3,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

export default AccountSwitchBottomSheet;