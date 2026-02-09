import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Platform,
  Linking,
  StatusBar
} from 'react-native';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; 

export default function AdvertisementScreen({navigation}) {
  const { colors, isDark } = useTheme();
  const [profileData, setProfileData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfileData(profile);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      //console.error('Failed to load profile', err);
    }
  };

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleContinue = () => {
    setShowModal(false);
    navigation.navigate('CreateAdForm');
  };

  const openLearnMore = () => {
    Linking.openURL('https://showapp.ng/');
  };
  const styles = createStyles(colors, isDark);

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        backgroundColor="#1976D2"
        translucent={Platform.OS === 'android'}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[
            styles.header,
            Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }
          ]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Advertise on Showa</Text>
            <Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </View>
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.body}>
              <Text style={styles.title}>Create your first ad</Text>
              <Text style={styles.subtitle}>
                Start reaching new customers in just a couple of minutes with our step-by-step ad creator.
              </Text>
              
              <View style={styles.adCard}>
                {profileData && profileData.id && (
                  <>
                    <View style={styles.userInfo}>
                      <Image
                        source={
                          profileData?.image
                            ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                            : require('../assets/images/dad.jpg')
                        }
                        style={styles.avatar}
                      />
                      <View>
                        <Text style={styles.username}>{profileData.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.sponsored}>Sponsored · </Text>
                          <Icon name="earth" size={14} color={isDark ? '#9ca3af' : '#999'} />
                        </View>
                      </View>
                    </View>

                    <Image
                      source={
                        profileData?.image
                          ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                          : require('../assets/images/dad.jpg')
                      }
                      style={styles.adImage}
                    />

                    <View style={styles.adFooter}>
                      <Text style={styles.adTitle}>
                        {profileData.website || profileData.about?.slice(0,20)}
                      </Text>
                      <View style={styles.radioGroup}>
                        <Icon name="radiobox-marked" size={16} color={isDark ? '#60a5fa' : '#000'} />
                        <Text style={styles.radioText}>Showa</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unlock Your Business Potential</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Icon name="close" size={24} color={isDark ? colors.text : '#666'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.benefitItem}>
                <Icon name="rocket-launch" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Reach More Customers</Text>
                  <Text style={styles.benefitDescription}>
                    Get your business in front of thousands of potential customers actively searching for what you offer.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="chart-line" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Boost Your Sales</Text>
                  <Text style={styles.benefitDescription}>
                    Our advertisers see an average 3x increase in sales within the first month of running ads.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="bullseye" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Target Precisely</Text>
                  <Text style={styles.benefitDescription}>
                    Reach the right audience based on location, interests, and behavior to maximize your ROI.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="cash" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Full Control</Text>
                  <Text style={styles.benefitDescription}>
                    Set your own budget and only pay when people engage with your ad. Start with as little as $5/day.
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.learnMoreButton}
                onPress={openLearnMore}
              >
                <Text style={styles.learnMoreText}>Learn more about advertising</Text>
                <Icon name="open-in-new" size={16} color="#1976D2" />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue to Ad Creator</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: Platform.OS === 'ios' ? 15 : 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: -30, 
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  adCard: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 2,
    elevation: isDark ? 4 : 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.text,
  },
  sponsored: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#777',
  },
  adImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adTitle: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: '#1976D2',
    margin: 20,
    marginTop: 'auto',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  benefitIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: isDark ? '#1e3a8a' : '#f0f7ff',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  learnMoreText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    backgroundColor: '#0d64dd',
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});