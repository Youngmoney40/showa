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

const PrivacyPolicyScreen = ({ navigation }) => {
  const lastUpdated = "January 15, 2026";

  const dataCategories = [
    {
      title: "Personal Information",
      icon: "person-outline",
      items: ["Name", "Email address", "Phone number", "Profile information"]
    },
    {
      title: "Content Data",
      icon: "folder-outline",
      items: ["Messages", "Photos & Videos", "Posts & Updates", "Business listings"]
    },
    {
      title: "Usage Data",
      icon: "eye-outline",
      items: ["App interactions", "Feature usage", "Device information", "Location data"]
    },
    {
      title: "Business Data",
      icon: "briefcase-outline",
      items: ["Business information", "Customer interactions", "Transaction data", "Product details"]
    }
  ];

  const privacyRights = [
    {
      title: "Access Your Data",
      icon: "eye-outline",
      description: "Request a copy of your personal information"
    },
    {
      title: "Data Correction",
      icon: "settings-outline",
      description: "Update or correct inaccurate information"
    },
    {
      title: "Data Deletion",
      icon: "trash-outline",
      description: "Request deletion of your personal data"
    },
    {
      title: "Opt-Out",
      icon: "notifications-off-outline",
      description: "Opt-out of marketing communications"
    }
  ];

  const sections = [
    {
      title: "Information We Collect",
      icon: "folder-open-outline",
      content: `We collect information you provide directly, including when you create an account, use our features, or contact us. This includes:
• Account information (name, email, phone)
• Profile information and preferences
• Content you create or share
• Messages and communications
• Business information (for business accounts)
`
    },
    {
      title: "How We Use Your Information",
      icon: "settings-outline",
      content: `We use your information to:
• Provide and improve our services
• Personalize your experience
• Enable communication features
• Support business tools and features
• Send important updates and notifications
• Ensure security and prevent fraud
• Comply with legal obligations`
    },
    {
      title: "Information Sharing",
      icon: "share-outline",
      content: `We do not sell your personal information. We may share information:
• With your consent
• With service providers who assist our operations
• For legal compliance or protection
• During business transfers or mergers
• To enforce our Terms of Service
• In aggregated, non-personal form for analytics`
    },
    {
      title: "Data Security",
      icon: "lock-closed-outline",
      content: `We implement industry-standard security measures:
• End-to-end encryption for messages
• Secure data storage and transmission
• Regular security assessments
• Access controls and authentication
• Employee training on data protection
• Incident response procedures`
    },
    {
      title: "Data Retention",
      icon: "download-outline",
      content: `We retain your information as long as necessary:
• While your account is active
• To provide services you request
• To comply with legal obligations
• To resolve disputes
• For legitimate business purposes
You can request account deletion at any time.`
    },
    {
      title: "Cookies & Tracking",
      icon: "globe-outline",
      content: `We use cookies and similar technologies:
• To remember your preferences
• For security and authentication
• To analyze service usage
• To personalize content
• For advertising (with your consent)
You can control cookie settings in your browser.`
    },
    {
      title: "Children's Privacy",
      icon: "people-outline",
      content: `Showa is not intended for children under 18. We do not knowingly collect information from children under 18. If we learn we have collected information from a child under 18, we will delete it promptly.`
    },
    {
      title: "International Transfers",
      icon: "globe-outline",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.`
    }
  ];

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@showapp.ng');
  };

  const handleSecurityEmailPress = () => {
    Linking.openURL('mailto:info@showapp.ng');
  };

  const navigateToTerms = () => {
    navigation.navigate('TermsScreen');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981', '#34D399']}
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
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.headerSubtitle}>Last updated: {lastUpdated}</Text>
          </View>
          <TouchableOpacity
            onPress={navigateToTerms}
            style={styles.termsButton}
          >
            <Text style={styles.termsButtonText}>Terms</Text>
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
            <Icon name="shield" size={28} color="#059669" />
          </View>
          <View style={styles.introTextContainer}>
            <Text style={styles.introTitle}>Your Privacy Matters</Text>
            <Text style={styles.introText}>
              At Showa, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your information when you use our platform. We are committed to 
              transparency and giving you control over your personal data.
            </Text>
          </View>
        </View>

        {/* Data Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionHeaderTitle}>What Information We Handle</Text>
          <View style={styles.categoriesGrid}>
            {dataCategories.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>
                  <Icon name={category.icon} size={20} color="#059669" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                {category.items.map((item, idx) => (
                  <View key={idx} style={styles.categoryItem}>
                    <Icon name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.categoryItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Icon name={section.icon} size={22} color="#059669" />
                </View>
                <Text style={styles.sectionTitle}>
                  {index + 1}. {section.title}
                </Text>
              </View>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Privacy Rights */}
        <View style={styles.rightsCard}>
          <Text style={styles.rightsTitle}>Your Privacy Rights</Text>
          <View style={styles.rightsGrid}>
            {privacyRights.map((right, index) => (
              <View key={index} style={styles.rightItem}>
                <View style={styles.rightIconContainer}>
                  <Icon name={right.icon} size={24} color="#059669" />
                </View>
                <Text style={styles.rightItemTitle}>{right.title}</Text>
                <Text style={styles.rightItemDescription}>{right.description}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleEmailPress}
            style={styles.rightsButton}
          >
            <Icon name="mail-outline" size={18} color="#FFF" />
            <Text style={styles.rightsButtonText}>Exercise Your Rights</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <View style={styles.contactIconContainer}>
            <Icon name="heart" size={28} color="#059669" />
          </View>
          <Text style={styles.contactTitle}>Contact Our Privacy Team</Text>
          <Text style={styles.contactText}>
            For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer.
          </Text>
          <View style={styles.contactInfo}>
            <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
              <Icon name="mail-outline" size={20} color="#059669" />
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>info@showapp.ng</Text>
              </View>
            </TouchableOpacity>
            
          </View>
          {/* <View style={styles.securityAlert}>
            <Icon name="alert-circle" size={20} color="#F59E0B" />
            <Text style={styles.securityAlertText}>
              For urgent security concerns, please contact our security team immediately at 
              <Text style={styles.securityLink} onPress={handleSecurityEmailPress}> info@showapp.ng</Text>
            </Text>
          </View> */}
        </View>

        {/* Policy Updates */}
        <View style={styles.updateCard}>
          <Icon name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.updateText}>
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes through the app or via email. The "Last updated" date indicates when this policy was last revised.
          </Text>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  termsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  termsButtonText: {
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
    borderColor: '#D1FAE5',
  },
  introIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ECFDF5',
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
  categoriesSection: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryItemText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 6,
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
    backgroundColor: '#ECFDF5',
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
  rightsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  rightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  rightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rightItem: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  rightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  rightItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  rightItemDescription: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  rightsButton: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rightsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: '#059669',
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactInfo: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  securityAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  securityAlertText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  securityLink: {
    color: '#059669',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  updateCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    gap: 12,
  },
  updateText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default PrivacyPolicyScreen;