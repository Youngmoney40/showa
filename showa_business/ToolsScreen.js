
import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import axios from 'axios';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const isSmallScreen = width < 375;

const Metric = ({ icon, count, label, colors, isDark }) => (
  <View style={[styles.metricBox, { 
    backgroundColor: colors.card,
    shadowColor: isDark ? '#000' : colors.primary,
  }]}>
    <View style={[styles.metricIconContainer, { backgroundColor: colors.primary }]}>
      <Icon name={icon} size={20} color="#fff" />
    </View>
    <Text style={[styles.metricCount, { color: colors.text }]}>{count}</Text>
    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const Section = ({ title, children, colors }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>{children}</View>
  </View>
);

const NavItem = ({ icon, label, subtitle, screen, isLast, colors, isDark }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={[styles.option, isLast && styles.optionLast, { 
        borderBottomColor: colors.border 
      }]} 
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.optionSub, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function ToolsScreen() {
  const { colors, isDark } = useTheme();
  const [profileData, setProfileData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [logo, setLogo] = useState(null);
  const navigation = useNavigation();

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
        console.log('user_profile', profile);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      //console.error('Failed to load profile', err);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primary }]} edges={['top']}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'light-content'} 
        backgroundColor={colors.primary} 
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        overScrollMode="never"
      >
        <LinearGradient
          colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : [colors.primary, colors.primaryDark || colors.primary]}
          style={[styles.headerGradient, { 
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.4 : 0.2,
          }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                activeOpacity={0.7}
              >
                <Icon 
                  name="arrow-left" 
                  size={28} 
                  color="#fff" 
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Tools</Text>
                <Text style={styles.subtitle}>Performance over the last 7 days</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Metrics Section */}
          

          <Text style={[styles.sectionHeader, { color: colors.text, marginTop:40 }]}>For you</Text>
          
          <View style={[styles.draftCard, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.3 : 0.08,
          }]}>
            <View style={styles.cardHeader}>
              <Image
                source={
                  profileData && profileData.image
                    ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                    : require('../assets/images/dad.jpg')
                }
                style={styles.avatar}
              />
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Draft Ad</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  We've saved your ad progress so you can finish creating it.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.cardButton, { 
                backgroundColor: colors.primary,
                shadowColor: isDark ? colors.primary : colors.primary,
                shadowOpacity: isDark ? 0.4 : 0.3,
              }]}
              onPress={() => navigation.navigate('Advertise')}
              activeOpacity={0.8}
            >
              <Text style={styles.cardButtonText}>Continue creating ad</Text>
              <Icon name="arrow-right" size={18} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>

          <Section title="Grow your business" colors={colors}>
            <NavItem 
              icon="shopping-outline" 
              label="Catalog" 
              subtitle="Show products and services" 
              screen="CreateCatalog" 
              colors={colors}
              isDark={isDark}
            />
            <NavItem 
              icon="bullhorn-outline" 
              label="Advertise" 
              subtitle="Create ads to promote your items" 
              screen="Advertise" 
              isLast={true}
              colors={colors}
              isDark={isDark}
            />
          </Section>

          <Section title="Organize your chats" colors={colors}>
            <NavItem 
              icon="message-alert-outline" 
              label="Greeting message" 
              subtitle="Welcome new customers" 
              screen="GreetingMessage" 
              colors={colors}
              isDark={isDark}
            />
            {/* <NavItem 
              icon="clock-outline" 
              label="Away message" 
              subtitle="Auto reply when unavailable" 
              screen="AwayMessage" 
              isLast={true}
              colors={colors}
              isDark={isDark}
            /> */}
          </Section>

          <Section title="Manage your account" colors={colors}>
            <NavItem 
              icon="account-outline" 
              label="Profile" 
              subtitle="Address, hours and more" 
              screen="ManageProfile" 
              colors={colors}
              isDark={isDark}
            />
            <NavItem 
              icon="cellphone-message" 
              label="Essential platforms" 
              subtitle="Link messaging platforms" 
              screen="EssentialPlatforms" 
              colors={colors}
              isDark={isDark}
            />
            <NavItem 
              icon="help-circle-outline" 
              label="Help center" 
              subtitle="Support and assistance" 
              screen="HelpCenter" 
              isLast={true}
              colors={colors}
              isDark={isDark}
            />
          </Section>
          
          {/* Bottom padding for iOS safe area */}
          {isIOS && <View style={styles.bottomPadding} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: isIOS ? 34 : 20,
  },
  headerGradient: {
    borderBottomLeftRadius: isIOS ? 24 : 0,
    borderBottomRightRadius: isIOS ? 24 : 0,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    paddingTop: isIOS ? 60 : 30,
    paddingBottom: isIOS ? 30 : 20,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 20,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 32 : 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  contentContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginTop: -10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  metricBox: {
    width: '30%',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricCount: {
    fontWeight: '700',
    fontSize: 20,
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  draftCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  closeButton: {
    padding: 4,
  },
  cardButton: {
    paddingVertical: isIOS ? 16 : 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSub: {
    fontSize: 14,
    fontWeight: '400',
  },
  bottomPadding: {
    height: 20,
  },
});
