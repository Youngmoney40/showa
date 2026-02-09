import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PrivacySecurityScreen = ({ navigation }) => {
  const [securitySettings, setSecuritySettings] = useState({
    biometricLogin: true,
    twoFactorAuth: false,
    appLock: true,
    dataEncryption: true,
    activityLogs: true,
    autoLogout: true,
    shareAnalytics: false,
    marketingEmails: false,
  });

  const toggleSwitch = (key) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your scan history, preferences, and cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been cleared successfully.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared for download. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Export Started', 'Your data export has been started. You will receive an email when it\'s ready.');
          }
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://betscan.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://betscan.com/terms');
  };

  const handleContactDPO = () => {
    Alert.alert(
      'Contact Data Protection Officer',
      'Email: dpo@betscan.com\nPhone: +234 900 333 4444',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Linking.openURL('mailto:dpo@betscan.com') },
      ]
    );
  };

  const securitySections = [
    {
      title: 'Account Security',
      settings: [
        {
          key: 'biometricLogin',
          title: 'Biometric Login',
          description: 'Use Face ID or fingerprint to log in quickly and securely',
          icon: 'finger-print',
          color: '#24ad0c'
        },
        
        {
          key: 'twoFactorAuth',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          icon: 'shield-checkmark',
          color: '#24ad0c'
        },
        {
          key: 'appLock',
          title: 'App Lock',
          description: 'Require PIN when opening the app',
          icon: 'lock-closed',
          color: '#24ad0c'
        },
        
      ]
    },
  ];

  const quickActions = [
    {
      title: 'Privacy Policy',
      description: 'Read our complete privacy policy',
      icon: 'document-text',
      action: handlePrivacyPolicy,
      color: '#24ad0c'
    },
    {
      title: 'Terms of Service',
      description: 'Review our terms and conditions',
      icon: 'business',
      action: handleTermsOfService,
      color: '#24ad0c'
    },
    
  ];

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="shield-checkmark" size={32} color="#24ad0c" />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Security Status: Excellent</Text>
              <Text style={styles.statusSubtitle}>Your account is well protected</Text>
            </View>
          </View>
          <View style={styles.securityScore}>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, { width: '95%' }]} />
            </View>
            <Text style={styles.scoreText}>95% Secure</Text>
          </View>
        </View>

        {/* Security Settings */}
        {securitySections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.settingsList}>
              {section.settings.map((setting) => (
                <View key={setting.key} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: `${setting.color}20` }]}>
                      <Icon name={setting.icon} size={20} color={setting.color} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingDescription}>{setting.description}</Text>
                    </View>
                  </View>
                  <Switch
                    value={securitySettings[setting.key]}
                    onValueChange={() => toggleSwitch(setting.key)}
                    trackColor={{ false: '#333333', true: '#24ad0c' }}
                    thumbColor={securitySettings[setting.key] ? '#FFFFFF' : '#999999'}
                    ios_backgroundColor="#333333"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Resources</Text>
          <View style={styles.actionsList}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.actionItem}
                onPress={action.action}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                    <Icon name={action.icon} size={20} color={action.color} />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <Icon name="shield-checkmark" size={24} color="#24ad0c" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            <Text style={styles.tipsText}>
              • Enable Two-Factor Authentication for maximum security{'\n'}
              • Use a strong, unique password for your account{'\n'}
              • Never share your login credentials with anyone{'\n'}
              • Regularly review your account activity{'\n'}
              • Keep the app updated to the latest version
            </Text>
          </View>
        </View>

        {/* Data Protection Info */}
        <View style={styles.protectionCard}>
          <View style={styles.protectionHeader}>
            <Icon name="lock-closed" size={20} color="#24ad0c" />
            <Text style={styles.protectionTitle}>Your Data is Protected</Text>
          </View>
          <Text style={styles.protectionText}>
            BetScan uses industry-standard encryption to protect your personal information and betting data. 
            We never share your personal data with third parties without your explicit consent, and we comply 
            with all applicable data protection regulations including GDPR and NDPA.
          </Text>
          <View style={styles.protectionFeatures}>
            <View style={styles.feature}>
              <Icon name="checkmark-circle" size={16} color="#24ad0c" />
              <Text style={styles.featureText}>End-to-End Encryption</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="checkmark-circle" size={16} color="#24ad0c" />
              <Text style={styles.featureText}>GDPR Compliant</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="checkmark-circle" size={16} color="#24ad0c" />
              <Text style={styles.featureText}>Regular Security Audits</Text>
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24ad0c',
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#24ad0c',
  },
  securityScore: {
    alignItems: 'center',
  },
  scoreBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#24ad0c',
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 12,
    color: '#24ad0c',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  actionsList: {
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24ad0c',
    marginBottom: 20,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#24ad0c',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 18,
  },
  protectionCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
    marginBottom: 40,
  },
  protectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  protectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  protectionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  protectionFeatures: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginLeft: 8,
  },
});

export default PrivacySecurityScreen;