import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const TermsScreen = ({ navigation }) => {
  const lastUpdated = "January 15, 2026";

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: "checkmark-circle-outline",
      content: `By accessing or using the Showa platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, you may not access the Service.`
    },
    {
      title: "Description of Service",
      icon: "globe-outline",
      content: `Showa is a social networking and messaging platform that provides personal chat, business communication, short videos, real-time updates, and business tools. The Service may change over time as we add new features or improve existing ones.`
    },
    {
      title: "User Accounts",
      icon: "person-outline",
      content: `You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      title: "User Responsibilities",
      icon: "people-outline",
      content: `You agree not to:\n• Share illegal, harmful, or offensive content\n• Impersonate others or provide false information\n• Violate intellectual property rights\n• Interfere with or disrupt the Service\n• Use the Service for unauthorized commercial purposes\n• Harass, abuse, or harm other users`
    },
    {
      title: "Content Ownership",
      icon: "document-text-outline",
      content: `You retain ownership of the content you create and share on Showa. By posting content, you grant Showa a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content as part of the Service.`
    },
    {
      title: "Business Features",
      icon: "briefcase-outline",
      content: `Business accounts have access to additional features including customer management, product showcases, and promotional tools. Business users must comply with all applicable laws and regulations regarding commerce and advertising.`
    },
    {
      title: "Privacy",
      icon: "lock-closed-outline",
      content: `Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.`
    },
    {
      title: "Termination",
      icon: "close-circle-outline",
      content: `We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.`
    },
    {
      title: "Limitation of Liability",
      icon: "alert-circle-outline",
      content: `Showa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.`
    },
    {
      title: "Changes to Terms",
      icon: "shield-outline",
      content: `We reserve the right to modify these Terms at any time. We will notify users of significant changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.`
    }
  ];

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@showapp.ng');
  };

  const navigateToPrivacy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A56C4', '#0D64DD', '#1E40AF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={[styles.headerTextContsainer,{padding:0, paddingBottom:70}]}>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <Text style={styles.headerSubtitle}>Last updated: {lastUpdated}</Text>
          </View>
          <TouchableOpacity
            onPress={navigateToPrivacy}
            style={styles.privacyButton}
          >
            <Text style={styles.privacyButtonText}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introCard}>
          <View style={styles.introIconContainer}>
            <Icon name="shield" size={28} color="#0D64DD" />
          </View>
          <View style={styles.introTextContainer}>
            <Text style={styles.introTitle}>Welcome to Showa</Text>
            <Text style={styles.introText}>
              These Terms and Conditions govern your use of the Showa platform. Please read them carefully. 
              By using Showa, you agree to these terms. If you have any questions, please contact us at 
              <Text style={styles.linkText} onPress={handleEmailPress}> info@showapp.ng</Text>
            </Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Icon name={section.icon} size={22} color="#0D64DD" />
                </View>
                <Text style={styles.sectionTitle}>
                  {index + 1}. {section.title}
                </Text>
              </View>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Important Notes */}
        <View style={styles.importantCard}>
          <View style={styles.importantHeader}>
            <Icon name="alert-circle" size={24} color="#F59E0B" />
            <Text style={styles.importantTitle}>Important Information</Text>
          </View>
          <View style={styles.importantList}>
            <Text style={styles.importantItem}>• You must be at least 18+ years old to use Showa</Text>
            <Text style={styles.importantItem}>• Some features may require additional verification</Text>
            <Text style={styles.importantItem}>• Business accounts must provide accurate business information</Text>
            <Text style={styles.importantItem}>• We reserve the right to remove content that violates our policies</Text>
            <Text style={styles.importantItem}>• Premium features may have additional terms</Text>
          </View>
        </View>

        {/* Safe Community */}
        <View style={styles.communityCard}>
          <View style={styles.communityIconContainer}>
            <Icon name="heart" size={28} color="#0D64DD" />
          </View>
          <Text style={styles.communityTitle}>Creating a Safe Community</Text>
          <Text style={styles.communityText}>
            Showa is committed to creating a safe and positive environment for all users. 
            We encourage respectful communication and collaboration.
          </Text>
          <View style={styles.communityFeatures}>
            <View style={styles.featureItem}>
              <Icon name="chatbubble-outline" size={16} color="#10B981" />
              <Text style={styles.featureText}>Respectful Messaging</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="videocam-outline" size={16} color="#8B5CF6" />
              <Text style={styles.featureText}>Positive Content</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="people-outline" size={16} color="#3B82F6" />
              <Text style={styles.featureText}>Community Guidelines</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom:0
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop:50
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop:90
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 3,
  },
  privacyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginTop:50
  },
  privacyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  introCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  introIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  introTextContainer: {
    flex: 1,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    paddingLeft: 44,
  },
  importantCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 10,
  },
  importantList: {
    paddingLeft: 10,
  },
  importantItem: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 22,
  },
  communityCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  communityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  communityText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  communityFeatures: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  linkText: {
    color: '#0D64DD',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default TermsScreen;