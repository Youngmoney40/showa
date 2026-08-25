import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import { API_ROUTE } from '../../api_routing/api';


const { width, height } = Dimensions.get('window');
const SKIP_AFTER_SECONDS = 5;
const MAX_AD_DURATION = 15; 

const AdInterstitial = ({ visible, onFinish }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const timerRef = useRef(null);
  const impressionTracked = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  const fetchAd = useCallback(async () => {
    setLoading(true);
    setAd(null);
    setSecondsElapsed(0);
    setCanSkip(false);
    impressionTracked.current = false;

    try {
      const headers = await getAuthHeader();
      const response = await axios.get(`${API_ROUTE}/ads/interstitial/`, { headers });

      if (response.data?.success && response.data.ad) {
        setAd(response.data.ad);
      } else {
        // No ad available — skip straight through
        onFinish?.();
        return;
      }
    } catch (err) {
      console.error('Failed to fetch interstitial ad:', err);
      onFinish?.();
      return;
    } finally {
      setLoading(false);
    }
  }, [onFinish]);

  useEffect(() => {
    if (visible) {
      fetchAd();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!ad || !visible) return;

    // Track the impression once, right when the ad starts showing
    const trackImpression = async () => {
      if (impressionTracked.current) return;
      impressionTracked.current = true;
      try {
        const headers = await getAuthHeader();
        await axios.post(`${API_ROUTE}/ads/${ad.id}/impression/`, {}, { headers });
      } catch (err) {
        console.error('Failed to track ad impression:', err);
      }
    };
    trackImpression();

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        if (next >= SKIP_AFTER_SECONDS) setCanSkip(true);
        if (next >= MAX_AD_DURATION) {
          clearInterval(timerRef.current);
          onFinish?.();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [ad, visible, onFinish]);

  const handleSkip = () => {
    if (!canSkip) return;
    if (timerRef.current) clearInterval(timerRef.current);
    onFinish?.();
  };

  const handleAdTap = async () => {
    if (!ad?.link) return;
    try {
      const headers = await getAuthHeader();
      await axios.post(`${API_ROUTE}/ads/${ad.id}/click/`, {}, { headers });
    } catch (err) {
      console.error('Failed to track ad click:', err);
    }
    Linking.openURL(ad.link).catch(() => {});
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {loading || !ad ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Ads...</Text>
        </View>
      ) : (
        <TouchableOpacity activeOpacity={1} style={styles.adTouchable} onPress={handleAdTap}>
          <Video
            source={{ uri: ad.media_url }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            repeat={true}
            paused={false}
            muted={false}
            volume={1.0}
          />

          <View style={styles.topBar}>
            <View style={styles.sponsoredBadge}>
              <Text style={styles.sponsoredText}>Sponsored</Text>
            </View>

            {canSkip ? (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip Ad</Text>
                <Icon name="chevron-right" size={16} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.skipCountdown}>
                <Text style={styles.skipCountdownText}>
                  Skip in {SKIP_AFTER_SECONDS - secondsElapsed}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.adHeadline} numberOfLines={1}>{ad.headline}</Text>
            {ad.description ? (
              <Text style={styles.adDescription} numberOfLines={2}>{ad.description}</Text>
            ) : null}
            {ad.cta ? (
              <TouchableOpacity style={styles.ctaButton} onPress={handleAdTap}>
                <Text style={styles.ctaText}>{formatCta(ad.cta)}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const formatCta = (cta) => {
  const map = {
    FOLLOW: 'Follow Us',
    VISIT: 'Visit Website',
    SHOP_NOW: 'Shop Now',
    LEARN_MORE: 'Learn More',
    SIGN_UP: 'Sign Up',
    CONTACT: 'Contact Us',
  };
  return map[cta] || 'Learn More';
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#000',
    zIndex: 9999,
    elevation: 9999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
  },
  adTouchable: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: Platform => (Platform.OS === 'ios' ? 50 : 30),
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sponsoredBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sponsoredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  skipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 2,
  },
  skipCountdown: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  skipCountdownText: {
    color: '#fff',
    fontSize: 13,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
  },
  adHeadline: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  adDescription: {
    color: '#eee',
    fontSize: 13,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default AdInterstitial;