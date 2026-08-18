import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { API_E_REPORT } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const GlobalIssueReport = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const handleReportNow = async () => {
    const url = `${API_E_REPORT}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Could not open the reporting website:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const FeatureCard = ({ icon, title, description }) => (
    <View style={[styles.featureCard, { 
      backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
      shadowColor: isDark ? 'transparent' : '#000'
    }]}>
      <Icon name={icon} size={30} color={isDark ? '#60a5fa' : '#3498db'} style={styles.featureIcon} />
      <Text style={[styles.featureTitle, { color: isDark ? colors.text : '#2c3e50' }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: isDark ? colors.textSecondary : '#7f8c8d' }]}>{description}</Text>
    </View>
  );

  const StepItem = ({ number, title, description }) => (
    <View style={styles.stepItem}>
      <View style={[styles.stepNumber, { backgroundColor: isDark ? colors.primary : '#3498db' }]}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, { color: isDark ? colors.text : '#2c3e50' }]}>{title}</Text>
        <Text style={[styles.stepDescription, { color: isDark ? colors.textSecondary : '#7f8c8d' }]}>{description}</Text>
      </View>
    </View>
  );

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? '#0750b5' : undefined}
      />

      {/* Navbar / Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.heroSection}>
          <Image 
            source={{uri: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80'}} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Report Issues. Drive Change.</Text>
            <Text style={styles.heroSubtext}>
              Together we can create a better world by addressing problems that matter
            </Text>
          </View>
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            About Our Reporting System
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Our global issue reporting platform allows citizens worldwide to report problems 
            they encounter in their communities, while traveling, or any other location. 
            We believe that everyone has the right to voice concerns about issues that affect 
            quality of life, safety, and the environment.
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Whether it's infrastructure problems, environmental concerns, public safety issues, 
            or social injustices, your report can initiate positive change.
          </Text>
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            Why Report Through Our Platform?
          </Text>
          <View style={styles.featuresContainer}>
            <FeatureCard
              icon="security"
              title="Secure & Anonymous"
              description="Choose to report anonymously or with your contact details. Your privacy is protected."
            />
            <FeatureCard
              icon="public"
              title="Global Reach"
              description="Report issues from anywhere in the world. Our network spans across continents."
            />
            <FeatureCard
              icon="track-changes"
              title="Track Progress"
              description="Monitor the status of your reports and see the impact they're making."
            />
            <FeatureCard
              icon="assignment-turned-in"
              title="Official Channels"
              description="Your reports are directed to the appropriate authorities and organizations."
            />
          </View>
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            What Can You Report?
          </Text>
          <View style={styles.typesContainer}>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="report-problem" size={24} color={isDark ? '#f87171' : '#e74c3c'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Public Safety</Text>
            </View>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="eco" size={24} color={isDark ? '#4ade80' : '#2ecc71'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Environmental</Text>
            </View>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="construction" size={24} color={isDark ? '#fbbf24' : '#f39c12'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Infrastructure</Text>
            </View>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="local-hospital" size={24} color={isDark ? '#f87171' : '#e74c3c'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Health & Sanitation</Text>
            </View>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="gavel" size={24} color={isDark ? '#9ca3af' : '#34495e'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Policy and Governance</Text>
            </View>
            <View style={[styles.typeItem, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
              shadowColor: isDark ? 'transparent' : '#000'
            }]}>
              <Icon name="group" size={24} color={isDark ? '#c084fc' : '#9b59b6'} />
              <Text style={[styles.typeText, { color: colors.text }]}>Social Justice</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            How Reporting Works
          </Text>
          <StepItem
            number="1"
            title="Submit Your Report"
            description="Provide details about the issue you've encountered, including location, description, and any supporting evidence."
          />
          <StepItem
            number="2"
            title="Review Process"
            description="Our team reviews each submission to verify information and determine the appropriate channels for resolution."
          />
          <StepItem
            number="3"
            title="Directed to Authorities"
            description="Your report is forwarded to the relevant organizations, government bodies, or NGOs that can address the issue."
          />
          <StepItem
            number="4"
            title="Follow-up & Resolution"
            description="Track the progress of your report and see the impact it creates in your community."
          />
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            The Impact of Reporting
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? colors.primary : '#3498db' }]}>15,000+</Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : '#7f8c8d' }]}>Issues Reported</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? colors.primary : '#3498db' }]}>120+</Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : '#7f8c8d' }]}>Countries Covered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? colors.primary : '#3498db' }]}>65%</Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : '#7f8c8d' }]}>Resolution Rate</Text>
            </View>
          </View>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Your reports have led to fixed infrastructure, policy changes, environmental cleanups, 
            and improved public safety measures worldwide. Every report contributes to making our 
            world a better place.
          </Text>
        </View>

        <View style={[styles.section, { 
          borderBottomColor: isDark ? colors.border : '#e0e0e0',
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? colors.primary : '#2c3e50' }]}>
            Success Stories
          </Text>
          <View style={[styles.testimonialCard, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
            shadowColor: isDark ? 'transparent' : '#000'
          }]}>
            <Icon name="format-quote" size={30} color={isDark ? colors.primary : '#3498db'} style={styles.quoteIcon} />
            <Text style={[styles.testimonialText, { color: colors.text }]}>
              "I reported a dangerous pothole on my street that had been there for months. 
              Within two weeks of submitting my report, it was fixed! This platform really works."
            </Text>
            <Text style={[styles.testimonialAuthor, { color: isDark ? colors.text : '#2c3e50' }]}>
              - Maria L., Lisbon, Portugal
            </Text>
          </View>
          <View style={[styles.testimonialCard, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#ffffff',
            shadowColor: isDark ? 'transparent' : '#000'
          }]}>
            <Icon name="format-quote" size={30} color={isDark ? colors.primary : '#3498db'} style={styles.quoteIcon} />
            <Text style={[styles.testimonialText, { color: colors.text }]}>
              "After reporting illegal dumping in our local river, authorities conducted a cleanup 
              and installed surveillance cameras. Our community is now cleaner and safer."
            </Text>
            <Text style={[styles.testimonialAuthor, { color: isDark ? colors.text : '#2c3e50' }]}>
              - James T., Nairobi, Kenya
            </Text>
          </View>
        </View>

        <View style={[styles.ctaSection, { backgroundColor: colors.primary }]}>
          <Text style={styles.ctaTitle}>Ready to Make a Difference?</Text>
          <Text style={styles.ctaText}>
            Your report could be the catalyst for positive change in your community and beyond.
          </Text>
          <TouchableOpacity 
            style={[styles.reportButton, { backgroundColor: isDark ? '#dc2626' : '#e74c3c' }]} 
            onPress={handleReportNow}
            activeOpacity={0.8}
          >
            <Text style={styles.reportButtonText}>Report Now</Text>
            <FontAwesomeIcon name="arrow-right" size={16} color="white" />
          </TouchableOpacity>
          <Text style={styles.ctaFooter}>
            You will be redirected to our secure reporting portal
          </Text>
        </View>

        <View style={[styles.footer, { backgroundColor: isDark ? '#1e3a8a' : '#063d8aff' }]}>
          <Text style={styles.footerText}>Global Issue Reporting System</Text>
          <Text style={styles.footerNote}>
            A platform for citizens worldwide to report issues and drive positive change
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  heroSection: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  typeText: {
    fontSize: 14,
    marginLeft: 10,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  testimonialCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.2,
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaSection: {
    padding: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  reportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  ctaFooter: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  footerNote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default GlobalIssueReport;