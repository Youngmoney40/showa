
import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';

const FloatingThemeToggle = () => {
  const { toggleTheme, isDark, isAuto, colors } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const getIconName = () => {
    if (isAuto) return 'contrast';
    return isDark ? 'sunny' : 'moon';
  };

  const getThemeLabel = () => {
    if (isAuto) return 'Auto';
    return isDark ? 'Light' : 'Dark';
  };

  const handlePress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
    showTooltipBriefly();
  };

  const showTooltipBriefly = () => {
    setShowTooltip(true);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowTooltip(false));
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Tooltip */}
      <Animated.View 
        style={[
          styles.tooltip,
          { 
            opacity: opacityAnim,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}
      >
        <Text style={[styles.tooltipText, { color: colors.text }]}>
          Switched to {getThemeLabel()} mode
        </Text>
      </Animated.View>

      {/* Floating Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={[
            styles.floatingButton,
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            }
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Icon 
            name={getIconName()} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltip: {
    position: 'absolute',
    bottom: 70,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FloatingThemeToggle;