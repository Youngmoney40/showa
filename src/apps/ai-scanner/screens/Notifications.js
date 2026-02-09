import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState({
    betAnalysis: true,
    winningAlerts: true,
    riskAlerts: true,
    scanResults: true,
    promotional: false,
    weeklyReports: true,
    systemUpdates: false,
    priceDrops: true,
  });

  const toggleSwitch = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notification settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications({
              betAnalysis: false,
              winningAlerts: false,
              riskAlerts: false,
              scanResults: false,
              promotional: false,
              weeklyReports: false,
              systemUpdates: false,
              priceDrops: false,
            });
          }
        },
      ]
    );
  };

  const handleResetDefaults = () => {
    setNotifications({
      betAnalysis: true,
      winningAlerts: true,
      riskAlerts: true,
      scanResults: true,
      promotional: false,
      weeklyReports: true,
      systemUpdates: false,
      priceDrops: true,
    });
  };

  const notificationSettings = [
    {
      key: 'betAnalysis',
      title: 'Bet Analysis Results',
      description: 'Get notified when your bet slip analysis is complete',
      icon: 'analytics',
      color: '#24ad0c'
    },
    {
      key: 'winningAlerts',
      title: 'Winning Alerts',
      description: 'Notifications about successful predictions and wins',
      icon: 'trophy',
      color: '#24ad0c'
    },
    {
      key: 'riskAlerts',
      title: 'Risk Alerts',
      description: 'Get warned about high-risk matches in your bet slips',
      icon: 'warning',
      color: '#FFA500'
    },
    {
      key: 'scanResults',
      title: 'Scan Results',
      description: 'Immediate notifications when scan analysis is ready',
      icon: 'scan',
      color: '#24ad0c'
    },
    {
      key: 'promotional',
      title: 'Promotional Offers',
      description: 'Special deals, discounts, and promotional content',
      icon: 'gift',
      color: '#FF4444'
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Reports',
      description: 'Summary of your betting performance and insights',
      icon: 'document-text',
      color: '#24ad0c'
    },
    {
      key: 'systemUpdates',
      title: 'System Updates',
      description: 'Important app updates and maintenance notifications',
      icon: 'cloud-download',
      color: '#666666'
    },
    {
      key: 'priceDrops',
      title: 'Price Drop Alerts',
      description: 'Get notified when scan package prices drop',
      icon: 'pricetag',
      color: '#24ad0c'
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Choose what notifications you want to receive
          </Text>

          <View style={styles.settingsList}>
            {notificationSettings.map((setting) => (
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
                  value={notifications[setting.key]}
                  onValueChange={() => toggleSwitch(setting.key)}
                  trackColor={{ false: '#333333', true: '#24ad0c' }}
                  thumbColor={notifications[setting.key] ? '#FFFFFF' : '#999999'}
                  ios_backgroundColor="#333333"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleResetDefaults}
          >
            <Icon name="refresh" size={20} color="#24ad0c" />
            <Text style={styles.secondaryButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleClearAll}
          >
            <Icon name="notifications-off" size={20} color="#FF4444" />
            <Text style={styles.dangerButtonText}>Turn All Off</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Tips */}
        <View style={styles.tipsCard}>
          <Icon name="information-circle" size={24} color="#24ad0c" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Notification Tips</Text>
            <Text style={styles.tipsText}>
              • Keep "Risk Alerts" and "Scan Results" enabled for the best betting experience{'\n'}
              • "Winning Alerts" help you track successful predictions{'\n'}
              • Weekly reports provide valuable insights into your betting patterns
            </Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24ad0c',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#24ad0c',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF4444',
    gap: 8,
  },
  dangerButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24ad0c',
    marginBottom: 40,
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
});

export default NotificationsScreen;