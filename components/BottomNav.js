import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

const BottomNav = ({ navigation, setShowAccountModal, activeRoute }) => {
  const { colors, theme, isDark } = useTheme(); 
  
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

  return (
    <View style={styles.container}>
      <View style={[
        styles.navContainer, 
        { 
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          shadowColor: colors.shadow
        }
      ]}>
        {navItems.map((item, index) => {
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.centerButton}
                onPress={item.action}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark || colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.centerButtonGradient,
                    { borderColor: colors.surface }
                  ]}
                >
                  <Icon 
                    name={item.icon} 
                    size={28} 
                    color={colors.textInverse} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          const isActive = activeRoute === item.route;
          const iconName = isActive ? item.activeIcon : item.icon;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.navItem,
                index < 2 ? { marginRight: width * 0.1 } : { marginLeft: width * 0.1 }
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon 
                  name={iconName} 
                  size={27} 
                  color={isActive ? colors.primary : colors.icon} 
                />
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[
                styles.navLabel,
                { color: isActive ? colors.primary : colors.icon },
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: width * 0.03,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    borderTopWidth: 0.5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.13,
    paddingVertical: 8,
  },
  iconContainer: {
    position: 'relative',
    padding: 4,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: 'SourceSansPro-Medium',
    marginTop: 4,
    letterSpacing: 0.2
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
  centerButton: {
    position: 'absolute',
    top: -30,
    left: width / 2 - 30,
    zIndex: 100,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.2,
  },
});

export default BottomNav;