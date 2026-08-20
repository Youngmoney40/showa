import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const BANNER_IMAGE = require('../assets/images/dad.jpg');

const H_PADDING = 20;
const CARD_GAP = 12;
const CARD_WIDTH = (width - H_PADDING * 2 - CARD_GAP) / 2;

const ALL_BRANDS = [
  { name: 'e-Direct', icon: 'book-open-outline', color: '#2563EB', url: 'https://edirect.ng', description: "Nigeria's largest business directory in Africa" },
  { name: 'e-Jobs', icon: 'briefcase-outline', color: '#84CC16', url: 'https://ejobs.com', description: 'Recruitment and job-matching platform' },
  { name: 'e-Store', icon: 'store-outline', color: '#64748B', url: 'https://estore.com', description: 'Online marketplace for everyday shopping' },
  { name: 'e-Deal', icon: 'tag-outline', color: '#F59E0B', url: 'https://edeal.com', description: 'Daily deals and discount platform' },
  { name: 'e-Ride', icon: 'car-outline', color: '#06B6D4', url: 'https://eride.com', description: 'On-demand transportation service' },
  { name: 'e-Plan', icon: 'calendar-month-outline', color: '#EC4899', url: 'https://eplan.com', description: 'Event planning and booking tool' },
  { name: 'e-Farm', icon: 'sprout-outline', color: '#10B981', url: 'https://efarm.com', description: 'Agricultural marketplace and trading' },
  { name: 'eHangout', icon: 'account-group-outline', color: '#8B5CF6', url: 'https://ehangout.com', description: 'Social networking platform' },
  { name: 'e-Wallet', icon: 'wallet-outline', color: '#F97316', url: 'https://ewallet.com', description: 'Secure digital payment solution' },
  { name: 'Showa', icon: 'video-outline', color: '#EF4444', url: 'https://showapp.ng', description: 'Live streaming and video platform' },
  { name: 'EBNB Hotel', icon: 'bed-outline', color: '#7C3AED', url: 'https://showa.com', description: 'Hotel management software' },
  { name: 'Essential News', icon: 'newspaper-variant-outline', color: '#0EA5E9', url: 'https://showa.com', description: 'News, blogging and publishing platform' },
  { name: 'E-Hotels', icon: 'office-building-outline', color: '#DC2626', url: 'https://showa.com', description: 'Hotel systems and booking management' },
  { name: 'E-apartment', icon: 'home-outline', color: '#059669', url: 'https://showa.com', description: 'Apartment booking and rentals' },
  { name: 'HRMS', icon: 'account-tie-outline', color: '#4F46E5', url: 'https://showa.com', description: 'Human resource management system' },
  { name: 'E-Medicals', icon: 'hospital-box-outline', color: '#DB2777', url: 'https://showa.com', description: 'Hospital management system' },
  { name: 'E-Shortstay', icon: 'clock-time-three-outline', color: '#EA580C', url: 'https://showa.com', description: 'Hourly and short-stay bookings' },
  { name: 'Oosh-Mail', icon: 'email-outline', color: '#0891B2', url: 'https://ooshmail.com', description: 'Business email platform' },
];

const BrandApp = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isBackHandlerActive = useRef(true);
  const hasNavigatedBack = useRef(false);

  const { colors, isDark } = useTheme();

  // Handle back button to prevent the app from closing when there's nowhere to go back to
  const handleBackPress = useCallback(() => {
    if (!isBackHandlerActive.current) return false;

    if (hasNavigatedBack.current) {
      return true;
    }

    if (navigation.canGoBack()) {
      hasNavigatedBack.current = true;
      navigation.goBack();
      setTimeout(() => {
        hasNavigatedBack.current = false;
      }, 500);
      return true;
    }

    try {
      hasNavigatedBack.current = true;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'BusinessHome' }],
        })
      );
      setTimeout(() => {
        hasNavigatedBack.current = false;
      }, 500);
      return true;
    } catch (error) {
      console.log('Navigation error:', error);
      hasNavigatedBack.current = false;
      return false;
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      isBackHandlerActive.current = true;
      hasNavigatedBack.current = false;

      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (hasNavigatedBack.current) {
          e.preventDefault();
          return;
        }

        if (navigation.canGoBack()) {
          e.preventDefault();
          hasNavigatedBack.current = true;
          navigation.goBack();
          setTimeout(() => {
            hasNavigatedBack.current = false;
          }, 500);
        } else {
          e.preventDefault();
          hasNavigatedBack.current = true;
          try {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'BusinessHome' }],
              })
            );
          } catch (error) {
            console.log('Navigation error during swipe:', error);
          }
          setTimeout(() => {
            hasNavigatedBack.current = false;
          }, 500);
        }
      });

      return () => {
        isBackHandlerActive.current = false;
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation, handleBackPress])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleGoBack = useCallback(() => {
    handleBackPress();
  }, [handleBackPress]);

  const BrandCard = ({ brand }) => (
    <TouchableOpacity
      style={[
        styles.brandCard,
        {
          width: CARD_WIDTH,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: brand.color,
        },
      ]}
      onPress={() => Linking.openURL(brand.url)}
      activeOpacity={0.85}
    >
      <Icon name="open-in-new" size={14} color={colors.textTertiary} style={styles.brandLinkIcon} />
      <View style={[styles.brandIconContainer, { backgroundColor: `${brand.color}1F` }]}>
        <Icon name={brand.icon} size={24} color={brand.color} />
      </View>
      <Text style={[styles.brandName, { color: colors.text }]} numberOfLines={1}>{brand.name}</Text>
      <Text style={[styles.brandDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {brand.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.background }]}>
          <StatusBar
            backgroundColor={isDark ? colors.background : '#F8FAFC'}
            barStyle={isDark ? 'light-content' : 'dark-content'}
          />

          {/* Header */}
          <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Brand Ecosystem</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContent} contentContainerStyle={styles.mainContentContainer}>
            {/* Hero */}
            <View style={styles.heroContainer}>
              <Image source={BANNER_IMAGE} style={styles.heroImage} resizeMode="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)']}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.heroContent}>
                <View style={styles.eyebrowChip}>
                  <Text style={styles.eyebrowText}>Showa Business</Text>
                </View>
                <Text style={styles.heroTitle}>Digital Ecosystem</Text>
                <Text style={styles.heroSubtitle}>
                  {ALL_BRANDS.length} integrated platforms, one unified account
                </Text>

                <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary || colors.primaryDark || colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaButton}
                  >
                    <Text style={styles.ctaButtonText}>Explore Ecosystem</Text>
                    <Icon name="arrow-right" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Floating stats strip */}
            <View style={[styles.statsStrip, {
              backgroundColor: colors.surface,
              shadowColor: '#000',
              borderColor: colors.border,
            }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{ALL_BRANDS.length}+</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Platforms</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>1</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unified Account</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>24/7</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Support</Text>
              </View>
            </View>

            {/* Brands Grid */}
            <View style={styles.brandsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Brands</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Comprehensive solutions for your needs
              </Text>

              <View style={styles.brandsGrid}>
                {ALL_BRANDS.map((brand) => (
                  <BrandCard key={brand.name} brand={brand} />
                ))}
              </View>
            </View>

            {/* Value Proposition */}
            <View style={styles.valueSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Our Platform?</Text>

              <View style={[styles.valueItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.valueIconContainer, { backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` }]}>
                  <Icon name="sync" size={22} color={colors.primary} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Seamless Integration</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    All services work together for a unified experience
                  </Text>
                </View>
              </View>

              <View style={[styles.valueItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.valueIconContainer, { backgroundColor: isDark ? `${colors.accent}30` : `${colors.accent}15` }]}>
                  <Icon name="shield-check" size={22} color={colors.accent} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Enterprise Security</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    Your data is protected with industry-standard security
                  </Text>
                </View>
              </View>

              <View style={[styles.valueItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.valueIconContainer, { backgroundColor: isDark ? `${colors.warning}30` : `${colors.warning}15` }]}>
                  <Icon name="star-circle" size={22} color={colors.warning} />
                </View>
                <View style={styles.valueTextContainer}>
                  <Text style={[styles.valueTitle, { color: colors.text }]}>Premium Experience</Text>
                  <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                    Consistent quality and design across all services
                  </Text>
                </View>
              </View>
            </View>

            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              © {new Date().getFullYear()} Showa Group. All rights reserved.
            </Text>
          </ScrollView>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon name="close" size={22} color={colors.text} />
                </TouchableOpacity>

                <ScrollView style={styles.ecosystemScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.modalIconContainer, { backgroundColor: isDark ? `${colors.primary}30` : `${colors.primary}15` }]}>
                      <Icon name="atom" size={30} color={colors.primary} />
                    </View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Our Digital Ecosystem</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                      Integrated services designed to work seamlessly together
                    </Text>
                  </View>

                  <View style={styles.ecosystemSection}>
                    <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>Key Advantages</Text>

                    {[
                      'Unified account across all platforms',
                      'Integrated payment and wallet system',
                      'Centralized notification management',
                      'Cross-service rewards program',
                    ].map((benefit) => (
                      <View key={benefit} style={styles.benefitItem}>
                        <Icon name="check-circle" size={18} color={colors.primary} />
                        <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.ecosystemSection}>
                    <Text style={[styles.ecosystemSectionTitle, { color: colors.text }]}>All Platforms</Text>
                    <View style={styles.chipsWrap}>
                      {ALL_BRANDS.map((brand) => (
                        <View
                          key={brand.name}
                          style={[styles.platformChip, { backgroundColor: colors.background, borderColor: colors.border }]}
                        >
                          <Icon name={brand.icon} size={13} color={brand.color} />
                          <Text style={[styles.platformChipText, { color: colors.text }]}>{brand.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[styles.modalPrimaryButton, { backgroundColor: colors.primary }]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalPrimaryButtonText}>Got it, thanks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    paddingBottom: 32,
  },
  heroContainer: {
    height: 360,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  eyebrowChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 14,
  },
  eyebrowText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: '85%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: H_PADDING,
    marginTop: -28,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    marginVertical: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  },
  brandsSection: {
    paddingHorizontal: H_PADDING,
    marginTop: 36,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: CARD_GAP,
    borderWidth: 1,
    borderLeftWidth: 3,
    position: 'relative',
  },
  brandLinkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  brandIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  brandDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  valueSection: {
    paddingHorizontal: H_PADDING,
    marginTop: 32,
    marginBottom: 8,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  valueIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  valueTextContainer: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  ecosystemScroll: {
    width: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    marginTop: 10,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  ecosystemSection: {
    marginBottom: 22,
  },
  ecosystemSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 6,
  },
  platformChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalPrimaryButton: {
    marginTop: 8,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default BrandApp;
