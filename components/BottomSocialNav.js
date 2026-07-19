import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Text,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BottomNav = ({ navigation, activeRoute }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Pulse animation for upload button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, []);

  // Get safe area insets for bottom padding
  const getBottomPadding = () => {
    // For Android 14+ (API 34+), we need to account for the system navigation bar
    const bottomInset = insets.bottom || 0;
    
    // On Android, the safe area insets might not always include the navigation bar
    // So we add extra padding for Android devices
    if (Platform.OS === 'android') {
      // Minimum padding to ensure visibility on Android 14+
      return Math.max(bottomInset, 8);
    }
    return Math.max(bottomInset, 0);
  };

  // Get status bar height for Android
  const getStatusBarHeight = () => {
    if (Platform.OS === 'android') {
      return StatusBar.currentHeight || 0;
    }
    return 0;
  };

  const styles = createStyles(colors, isDark, getBottomPadding());

  const NavItem = ({ icon, label, route, onPress, IconComponent = Icon }) => {
    const isActive = activeRoute === route;
    
    return (
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.iconContainer}>
          <IconComponent 
            name={icon} 
            size={22} 
            color={isActive ? colors.primary : (isDark ? '#8E8E93' : '#8E8E93')} 
          />
          <Text style={[
            styles.navLabel,
            { 
              color: isActive ? colors.primary : (isDark ? '#8E8E93' : '#8E8E93'),
              fontWeight: isActive ? '600' : '400'
            }
          ]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: '#000000',
        borderTopColor: 'rgba(255,255,255,0.08)',
        paddingBottom: getBottomPadding(),
      }
    ]}>
      <View style={[styles.navInner, { 
        paddingBottom: Platform.OS === 'android' ? 4 : 4,
      }]}>
        {/* Home */}
        <NavItem 
          icon="home" 
          label="Home" 
          route="SocialHome" 
          onPress={() => navigation.navigate('BroadcastHome')}
        />
        
        {/* Discover */}
        <NavItem 
          icon="search" 
          label="Explore" 
          route="Discover" 
          //onPress={() => navigation.navigate('Discover')}
          onPress={() => navigation.navigate('ExplorePost')}
        />
        
        {/* Upload Button */}
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => navigation.navigate('UploadshortVideo')}
          activeOpacity={0.7}
        >
          <View style={styles.uploadIconContainer}>
            <Animated.View 
              style={[
                styles.uploadPulseEffect,
                { 
                  backgroundColor: `${colors.primary}30`,
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <View style={[styles.uploadIconBackground, { backgroundColor: colors.primary }]}>
              <Icon name="plus" size={24} color="#fff" style={styles.plusIcon} />
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Broadcast */}
        <NavItem 
          icon="broadcast" 
          label="Broadcast" 
          route="BroadcastHome" 
          onPress={() => navigation.navigate('BroadcastHome')}
          IconComponent={MaterialCommunityIcons}
        />
        
        {/* Profile */}
        <NavItem 
          icon="person-outline" 
          label="Me" 
          route="UserProfile" 
          onPress={() => navigation.navigate('UserPersonalAccountProfile')}
          IconComponent={Ionicons}
        />
      </View>
    </View>
  );
};

const createStyles = (colors, isDark, bottomPadding) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  navInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'android' ? 6 : 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#000000',
    height: Platform.OS === 'android' ? 56 : 60,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  uploadButton: {
    position: 'relative',
    bottom: 6,
    marginHorizontal: 4,
  },
  uploadIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  plusIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadPulseEffect: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 16,
    zIndex: 1,
  },
});

export default BottomNav;