import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Text,
  Platform,
  Dimensions
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
    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      return Math.max(insets.bottom, 0);
    }
    return Math.max(insets.bottom, 0);
  };

  const styles = createStyles(colors, isDark, getBottomPadding());

  const NavItem = ({ icon, label, route, onPress, IconComponent = Icon }) => {
    const isActive = activeRoute === route;
    
    return (
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <IconComponent 
              name={icon} 
              size={24} 
              color={isActive ? colors.primary : (isDark ? '#fff' : '#666')} 
            />
            {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
          </View>
          <Text style={[
            styles.navLabel,
            { 
              color: isActive ? colors.primary : (isDark ? '#fff' : '#666'),
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
        backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)',
        borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }
    ]}>
      <View style={[styles.navInner, { paddingBottom: getBottomPadding() }]}>
        {/* Home */}
        <NavItem 
          icon="home" 
          label="Home" 
          route="SocialHome" 
          onPress={() => navigation.navigate('SocialHome')}
        />
        
        {/* Discover */}
        <NavItem 
          icon="search" 
          label="Discover" 
          route="Discover" 
          onPress={() => navigation.navigate('Discover')}
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
                  backgroundColor: `${colors.primary}40`,
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <View style={[styles.uploadIconBackground, { backgroundColor: colors.primary }]}>
              <Icon name="plus" size={28} color="#fff" style={styles.plusIcon} />
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
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  navInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 8 : 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
    minHeight: Platform.OS === 'android' ? 60 : 70,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  uploadButton: {
    position: 'relative',
    bottom: 10,
    marginHorizontal: 5,
  },
  uploadIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconBackground: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadPulseEffect: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 18,
    zIndex: 1,
  },
});

export default BottomNav;