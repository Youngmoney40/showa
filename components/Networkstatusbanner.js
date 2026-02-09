import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const NetworkStatusBanner = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const slideAnim = useState(new Animated.Value(-60))[0];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      const type = state.type;
      
      setConnectionType(type);
      
      if (isConnected !== connected) {
        setIsConnected(connected);
        
        if (!connected) {
          // Slide in when offline
          setShowBanner(true);
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }).start();
        } else {
          // Slide out when back online, then hide after delay
          Animated.timing(slideAnim, {
            toValue: -60,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => setShowBanner(false), 3000);
          });
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected && state.isInternetReachable);
  };

  if (!showBanner) return null;

  return (
    <Animated.View style={[
      styles.banner,
      isConnected ? styles.onlineBanner : styles.offlineBanner,
      { transform: [{ translateY: slideAnim }] }
    ]}>
      <View style={styles.bannerContent}>
        <View style={styles.statusInfo}>
         
          
          <Icon 
            name={isConnected ? "wifi-outline" : "wifi-outline"} 
            size={20} 
            color="#fff" 
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerText}>
              {isConnected ? 'Back online' : 'No internet connection'}
            </Text>
            {!isConnected && (
              <Text style={styles.subText}>
                {connectionType === 'cellular' ? 'Mobile data not working' : 'Check your connection'}
              </Text>
            )}
          </View>
        </View>
        
        {!isConnected && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  onlineBanner: {
    backgroundColor: '#10B981', 
  },
  offlineBanner: {
    backgroundColor: '#EF4444', 
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, 
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
  },
  bannerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  subText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default NetworkStatusBanner;