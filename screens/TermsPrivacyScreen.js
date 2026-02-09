// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Linking,
//   Platform,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Checkbox } from 'react-native-paper';

// const TermsAndConditions = ({ navigation }) => {
//   const [acceptedSections, setAcceptedSections] = useState({
//     terms: false,
//     privacy: false,
//     socialMedia: false,
//     dataUsage: false,
//     copyright: false,
//   });

//   const [allAccepted, setAllAccepted] = useState(false);

//   const handleSectionToggle = (section) => {
//     const newAcceptedSections = {
//       ...acceptedSections,
//       [section]: !acceptedSections[section],
//     };
//     setAcceptedSections(newAcceptedSections);
    
//     // Check if all sections are accepted
//     const allSectionsAccepted = Object.values(newAcceptedSections).every(val => val);
//     setAllAccepted(allSectionsAccepted);
//   };

//   const handleAcceptAll = () => {
//     const newState = !allAccepted;
//     setAllAccepted(newState);
//     setAcceptedSections({
//       terms: newState,
//       privacy: newState,
//       socialMedia: newState,
//       dataUsage: newState,
//       copyright: newState,
//     });
//   };

//   const handleContinue = () => {
//     if (allAccepted) {
//       Alert.alert(
//         "Terms Accepted",
//         "Thank you for accepting our terms and conditions.",
//         [{ text: "Continue", onPress: () => navigation.goBack() }]
//       );
//     } else {
//       Alert.alert(
//         "Incomplete Acceptance",
//         "Please accept all terms and conditions to continue."
//       );
//     }
//   };

//   const openExternalLink = (url) => {
//     Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
//   };

//   const sections = [
//     {
//       key: 'terms',
//       title: 'Terms of Service',
//       content: `Welcome to Showa - Your All-in-One Social Connection Platform!

// By using Showa, you agree to these Terms of Service. Showa provides integrated social media features including messaging (WhatsApp-style), short video sharing (TikTok-style), and microblogging (Twitter-style).

// Account Requirements:
// - You must be at least 13 years old to use Showa
// - Provide accurate and complete registration information
// - Maintain the security of your login credentials
// - Notify us immediately of any unauthorized use

// User Conduct:
// - Be respectful and lawful in all interactions
// - Do not harass, threaten, or intimidate other users
// - No spamming, phishing, or malicious activities
// - Content must comply with community guidelines`,
//     },
//     {
//       key: 'privacy',
//       title: 'Privacy Policy',
//       content: `Your privacy is important to us. This Privacy Policy explains how Showa collects, uses, and protects your information.

// Data We Collect:
// - Account information (name, email, phone number)
// - Content you create (messages, posts, videos)
// - Device information and usage analytics
// - Location data (if enabled for features)

// How We Use Your Data:
// - Provide and improve our services
// - Personalize your experience
// - Ensure platform security and safety
// - Communicate important updates

// Third-Party Sharing:
// - We may share data with service providers
// - Legal compliance and protection of rights
// - Business transfers (mergers, acquisitions)
// - With your explicit consent

// Data Retention:
// - We retain data as long as your account is active
// - You can request data deletion at any time
// - Some data may be retained for legal purposes`,
//     },
//     {
//       key: 'socialMedia',
//       title: 'Social Media Integration',
//       content: `Showa integrates multiple social media features:

// WhatsApp-style Messaging:
// - End-to-end encryption for private chats
// - Group messaging capabilities
// - Media sharing (images, videos, documents)
// - Voice and video calling features

// TikTok-style Video Features:
// - Short-form video creation and sharing
// - Duet and reaction video capabilities
// - Hashtag and trend participation
// - Content recommendation algorithms

// Twitter-style Microblogging:
// - Character-limited posts (280 characters)
// - Retweet and quote tweet functionality
// - Hashtag and trending topics
// - Direct messaging system

// Cross-Platform Sharing:
// - Content can be shared across Showa features
// - Optional external platform sharing
// - Unified notification system
// - Integrated social graph`,
//     },
//     {
//       key: 'dataUsage',
//       title: 'Data Usage & Storage',
//       content: `Data Storage and Management:

// Content Storage:
// - Messages are stored on secure servers
// - Media files are optimized for efficient storage
// - Backup and recovery systems in place
// - Content moderation for safety

// Bandwidth Usage:
// - Video streaming adaptive bitrate technology
// - Image compression for faster loading
// - Data saver options available
// - Offline content access capabilities

// Cross-Platform Data:
// - Unified profile across all features
// - Synchronized contacts and connections
// - Integrated messaging history
// - Consistent privacy settings

// Data Export:
// - Download your data anytime
// - Export contacts and messages
// - Backup media files
// - Account migration options`,
//     },
//     {
//       key: 'copyright',
//       title: 'Copyright & Content Policy',
//       content: `Intellectual Property Rights:

// Your Content:
// - You retain ownership of your original content
// - Grant Showa license to display and distribute
// - Responsible for content you post
// - Respect copyright and intellectual property

// Copyright Protection:
// - Do not post infringing content
// - Report copyright violations
// - DMCA compliance procedures
// - Content removal policies

// Platform License:
// - Showa provides license to use platform features
// - No transfer of intellectual property rights
// - Trademark and brand protection
// - Open source components acknowledgment

// User-generated Content:
// - Moderate your own content
// - Respect community guidelines
// - No illegal or harmful content
// - Age-appropriate material only`,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Terms & Conditions</Text>
//         <View style={styles.headerSpacer} />
//       </View>

//       <ScrollView style={styles.scrollView}>
//         {/* App Introduction */}
//         <View style={styles.introSection}>
//           <Icon name="shield-checkmark" size={48} color="#0d64dd" style={styles.introIcon} />
//           <Text style={styles.introTitle}>Welcome to Showa</Text>
//           <Text style={styles.introText}>
//             Your all-in-one social platform combining the best features of WhatsApp, TikTok, and Twitter. 
//             Please review and accept our terms to continue.
//           </Text>
//         </View>

//         {/* Accept All Toggle */}
//         <TouchableOpacity style={styles.acceptAllButton} onPress={handleAcceptAll}>
//           <View style={styles.checkboxContainer}>
//             <Checkbox
//               status={allAccepted ? 'checked' : 'unchecked'}
//               color="#0d64dd"
//             />
//             <Text style={styles.acceptAllText}>Accept All Terms & Conditions</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Terms Sections */}
//         {sections.map((section, index) => (
//           <View key={section.key} style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Checkbox
//                 status={acceptedSections[section.key] ? 'checked' : 'unchecked'}
//                 onPress={() => handleSectionToggle(section.key)}
//                 color="#0d64dd"
//               />
//               <Text style={styles.sectionTitle}>{section.title}</Text>
//             </View>
            
//             <ScrollView style={styles.sectionContent} nestedScrollEnabled={true}>
//               <Text style={styles.sectionText}>{section.content}</Text>
//             </ScrollView>
//           </View>
//         ))}

//         {/* Additional Links */}
//         <View style={styles.linksSection}>
//           <Text style={styles.linksTitle}>Additional Resources</Text>
//           <TouchableOpacity 
//             style={styles.linkButton}
//             onPress={() => openExternalLink('https://showa.app/community-guidelines')}
//           >
//             <Icon name="people" size={20} color="#0d64dd" />
//             <Text style={styles.linkText}>Community Guidelines</Text>
//             <Icon name="open-outline" size={16} color="#666" />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.linkButton}
//             onPress={() => openExternalLink('https://showa.app/safety-center')}
//           >
//             <Icon name="shield" size={20} color="#0d64dd" />
//             <Text style={styles.linkText}>Safety Center</Text>
//             <Icon name="open-outline" size={16} color="#666" />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.linkButton}
//             onPress={() => openExternalLink('https://showa.app/contact')}
//           >
//             <Icon name="mail" size={20} color="#0d64dd" />
//             <Text style={styles.linkText}>Contact Support</Text>
//             <Icon name="open-outline" size={16} color="#666" />
//           </TouchableOpacity>
//         </View>

//         {/* Continue Button */}
//         <TouchableOpacity 
//           style={[styles.continueButton, !allAccepted && styles.continueButtonDisabled]}
//           onPress={handleContinue}
//           disabled={!allAccepted}
//         >
//           <Text style={styles.continueButtonText}>
//             {allAccepted ? 'Continue to Showa' : 'Accept All to Continue'}
//           </Text>
//         </TouchableOpacity>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Showa App v2.1.0 • {new Date().getFullYear()}
//           </Text>
//           <Text style={styles.footerSubText}>
//             Connecting the world through integrated social experiences
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: 80,
//     paddingHorizontal: 20,
//     backgroundColor: '#0d64dd',
//     paddingTop: 20,
//   },
//   backButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   headerSpacer: {
//     width: 24,
//   },
//   scrollView: {
//     flex: 1,
//     padding: 16,
//   },
//   introSection: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   introIcon: {
//     marginBottom: 16,
//   },
//   introTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#0d64dd',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   introText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   acceptAllButton: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   acceptAllText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginLeft: 8,
//   },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginLeft: 8,
//   },
//   sectionContent: {
//     maxHeight: 200,
//     marginLeft: 32,
//   },
//   sectionText: {
//     fontSize: 13,
//     color: '#666',
//     lineHeight: 18,
//   },
//   linksSection: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//   },
//   linksTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 12,
//   },
//   linkButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   linkText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#333',
//     marginLeft: 12,
//     marginRight: 8,
//   },
//   continueButton: {
//     backgroundColor: '#0d64dd',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   continueButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   continueButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 4,
//   },
//   footerSubText: {
//     fontSize: 11,
//     color: '#ccc',
//     textAlign: 'center',
//   },
// });

// export default TermsAndConditions;
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Checkbox } from 'react-native-paper';

const TermsAndConditions = ({ navigation }) => {
  const [acceptedSections, setAcceptedSections] = useState({
    terms: false,
    privacy: false,
  });

  const [allAccepted, setAllAccepted] = useState(false);
  const [userLocation, setUserLocation] = useState('nigeria'); 

  const handleSectionToggle = (section) => {
    const newAcceptedSections = {
      ...acceptedSections,
      [section]: !acceptedSections[section],
    };
    setAcceptedSections(newAcceptedSections);
    
    // Check if all sections are accepted
    const allSectionsAccepted = Object.values(newAcceptedSections).every(val => val);
    setAllAccepted(allSectionsAccepted);
  };

  const handleAcceptAll = () => {
    const newState = !allAccepted;
    setAllAccepted(newState);
    setAcceptedSections({
      terms: newState,
      privacy: newState,
    });
  };

  const handleContinue = () => {
    // Check age eligibility based on location
    const isEligible = userLocation === 'nigeria' 
      ? confirmAgeNigeria() 
      : confirmAgeInternational();
    
    if (allAccepted && isEligible) {
      Alert.alert(
        "Terms Accepted",
        "Thank you for accepting our terms and conditions.",
        [{ text: "Continue", onPress: () => navigation.goBack() }]
      );
    } else if (!allAccepted) {
      Alert.alert(
        "Incomplete Acceptance",
        "Please accept all terms and conditions to continue."
      );
    }
  };

  const confirmAgeNigeria = () => {
    // In a real app, you would verify this through a date picker or other method
    Alert.alert(
      "Age Verification",
      "By continuing, you confirm that you are 18 years or older as required by Nigerian law.",
      [
        { text: "I'm under 18", onPress: () => {}, style: "cancel" },
        { text: "I'm 18 or older", onPress: () => {} }
      ]
    );
    return true; // For demo purposes
  };

  const confirmAgeInternational = () => {
    // In a real app, you would verify this through a date picker or other method
    Alert.alert(
      "Age Verification",
      "By continuing, you confirm that you meet the minimum age of digital consent in your country.",
      [
        { text: "I don't meet age requirements", onPress: () => {}, style: "cancel" },
        { text: "I meet age requirements", onPress: () => {} }
      ]
    );
    return true; // For demo purposes
  };

  const openExternalLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const sections = [
    {
      key: 'terms',
      title: 'Terms of Service',
      content: `Effective Date: 18-09-2025
Company: Showa App, of No. 24 Iyalla Street, Ikeja, Lagos, Nigeria ("we", "our", "us").

1. Acceptance of Terms
By downloading, registering, or using Showa App ("the App"), you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the App.

2. Eligibility
You must be 18 years or older to use the App in Nigeria.
For international users, you must meet the minimum age of digital consent in your country (typically 13+).
By using the App, you confirm that you have the legal capacity to enter into this agreement.

3. User Accounts
You must provide accurate and complete information when creating an account.
You are responsible for maintaining the confidentiality of your login details.
We reserve the right to suspend or terminate accounts that violate these Terms.

4. User Content
You retain ownership of the content you create, but grant Showa App a worldwide, non-exclusive, royalty-free license to host, use, distribute, and display your content for the purpose of operating and improving the App.
You may not post or share content that is illegal, harmful, infringing, defamatory, harassing, or otherwise violates the rights of others.
We reserve the right to remove or restrict any content that violates these rules.

5. Prohibited Conduct
Users agree not to:
- Use the App for unlawful purposes.
- Harass, abuse, or harm others.
- Upload viruses, malware, or malicious code.
- Attempt to hack, reverse-engineer, or disrupt the App.
 
6. Payments & Transactions
If the App offers paid features, in-app purchases, or advertisements:
- Payments are processed by third-party providers.
- We are not responsible for errors, delays, or unauthorized transactions caused by such providers.

7. Data Protection & Privacy
Your use of the App is also governed by our Privacy Policy, which explains how we collect and use your data in compliance with the NDPA (2023), NDPR (2019), and GDPR.

8. Intellectual Property
The App, including its design, code, and trademarks, are owned by Showa App.
Users may not copy, modify, or distribute the App or its content without permission.

9. Disclaimer of Warranties
The App is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted or error-free service.

10. Limitation of Liability
To the maximum extent permitted by law, Showa App shall not be liable for any damages, including loss of data, profits, or goodwill, resulting from the use or inability to use the App.

11. Termination
We may suspend or terminate your account if you violate these Terms or applicable laws.

12. Governing Law & Jurisdiction
These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles. Disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
    },
    {
      key: 'privacy',
      title: 'Privacy Policy',
      content: `Effective Date: [Insert Date]

1. Information We Collect
We may collect the following categories of personal data:
- Account Information: name, email, phone number, profile details.
- Content Data: photos, videos, messages, posts.
- Device & Usage Data: IP address, browser type, app usage patterns.
- Payment Data: where applicable, via secure third-party processors.

2. How We Use Your Data
We use your personal data to:
- Provide, maintain, and improve our services.
- Personalize user experience, including showing relevant ads.
- Ensure safety, security, and prevent fraud.
- Comply with legal and regulatory obligations.

3. Legal Basis for Processing
For Nigerian users, processing is based on NDPA 2023 & NDPR 2019 (consent, contract, legal obligation).
For international users, processing is also based on GDPR legal bases (consent, contract, legitimate interest).

4. Sharing of Information
We may share your information with:
- Service providers (hosting, analytics, payment processors).
- Law enforcement or regulators, when required by law.
- Business partners, only with your consent.
We do not sell your personal data.

5. International Data Transfers
Since our servers are hosted abroad, your data may be transferred outside Nigeria. We ensure adequate protection under NDPA, NDPR, and GDPR safeguards.

6. Data Retention
We retain your information only as long as necessary for the purposes stated, or as required by law.

7. Security Measures
We implement technical and organizational safeguards (encryption, access controls, monitoring) to protect your personal data.

8. Your Rights
Depending on your location, you may have rights to:
- Access, correct, or delete your data.
- Withdraw consent at any time.
- Object to certain processing.
- File a complaint with the Nigeria Data Protection Commission (NDPC) or your local data authority.

9. Children's Privacy
The App is not available to persons under 18 in Nigeria. For other regions, users must meet the minimum digital consent age (typically 13+). We do not knowingly collect data from children.

10. Changes to this Policy
We may update this Privacy Policy from time to time. Updates will be communicated via the App or website.

11. Contact Us
If you have questions about these Terms or Privacy Policy, contact us at:
Showa App
📍 No. 24 Iyalla Street, Ikeja, Lagos, Nigeria
📧 [Insert Company Email]
📞 [Insert Company Phone]`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* App Introduction */}
        <View style={styles.introSection}>
          <Icon name="shield-checkmark" size={48} color="#0d64dd" style={styles.introIcon} />
          <Text style={styles.introTitle}>Welcome to Showa App</Text>
          <Text style={styles.introText}>
            Please review and accept our Terms of Service and Privacy Policy to continue using our application.
          </Text>
          
          {/* Location Selector */}
          <View style={styles.locationSelector}>
            <Text style={styles.locationLabel}>Your Location:</Text>
            <View style={styles.locationButtons}>
              <TouchableOpacity 
                style={[styles.locationButton, userLocation === 'nigeria' && styles.locationButtonActive]}
                onPress={() => setUserLocation('nigeria')}
              >
                <Text style={[styles.locationButtonText, userLocation === 'nigeria' && styles.locationButtonTextActive]}>Nigeria</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.locationButton, userLocation === 'international' && styles.locationButtonActive]}
                onPress={() => setUserLocation('international')}
              >
                <Text style={[styles.locationButtonText, userLocation === 'international' && styles.locationButtonTextActive]}>International</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.locationNote}>
              {userLocation === 'nigeria' 
                ? 'You must be 18 years or older to use Showa App in Nigeria'
                : 'You must meet the minimum age of digital consent in your country (typically 13+)'}
            </Text>
          </View>
        </View>

        {/* Accept All Toggle */}
        <TouchableOpacity style={styles.acceptAllButton} onPress={handleAcceptAll}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={allAccepted ? 'checked' : 'unchecked'}
              color="#0d64dd"
            />
            <Text style={styles.acceptAllText}>Accept All Terms & Policies</Text>
          </View>
        </TouchableOpacity>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Checkbox
                status={acceptedSections[section.key] ? 'checked' : 'unchecked'}
                onPress={() => handleSectionToggle(section.key)}
                color="#0d64dd"
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            <ScrollView style={styles.sectionContent} nestedScrollEnabled={true}>
              <Text style={styles.sectionText}>{section.content}</Text>
            </ScrollView>
          </View>
        ))}

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.continueButton, !allAccepted && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!allAccepted}
        >
          <Text style={styles.continueButtonText}>
            {allAccepted ? 'Continue to Showa' : 'Accept All to Continue'}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showa App • No. 24 Iyalla Street, Ikeja, Lagos, Nigeria
          </Text>
          <Text style={styles.footerSubText}>
            © {new Date().getFullYear()} Showa App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: '#0d64dd',
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  introSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introIcon: {
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0d64dd',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  locationSelector: {
    width: '100%',
    marginTop: 10,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  locationButtonActive: {
    backgroundColor: '#0d64dd',
  },
  locationButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  locationButtonTextActive: {
    color: '#fff',
  },
  locationNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  acceptAllButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    maxHeight: 200,
    marginLeft: 32,
  },
  sectionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: '#0d64dd',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'center',
  },
});

export default TermsAndConditions;