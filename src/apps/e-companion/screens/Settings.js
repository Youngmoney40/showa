import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  Switch, 
  ScrollView,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

const SettingsScreen = ({navigation}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showChevron = true,
    isSwitch = false,
    switchValue,
    onSwitchChange 
  }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#f0f0f0', true: Colors.primary + '80' }}
            thumbColor={switchValue ? Colors.primary : '#f4f3f4'}
          />
        ) : showChevron && (
          <Icon name="chevron-forward" size={20} color={Colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Icon name='arrow-back' size={28} color='#333' />

                </TouchableOpacity>
                
               <Text style={styles.headerTitle}>Settings</Text>

        </View>
        
        <Text style={styles.headerSubtitle}>Manage your account preferences</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            label="Profile Information"
            onPress={() => console.log('Navigate to Profile')}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label="Privacy & Security"
            onPress={() => console.log('Navigate to Privacy')}
          />
          <SettingsItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => console.log('Navigate to Language')}
          />
        </SettingsSection>

        {/* Payment & Earnings Section */}
        <SettingsSection title="Payment & Earnings">
         
          <SettingsItem
            icon="card-outline"
            label="Payment Methods"
            onPress={() => console.log('Navigate to Payment Methods')}
          />
          <SettingsItem
            icon="receipt-outline"
            label="Transaction History"
            onPress={() => console.log('Navigate to History')}
          />
         
        </SettingsSection>

        {/* Availability & Notifications */}
        <SettingsSection title="Availability">
          <SettingsItem
            icon="time-outline"
            label="Online Status"
            isSwitch={true}
            switchValue={isAvailable}
            onSwitchChange={setIsAvailable}
          />
          <SettingsItem
            icon="notifications-outline"
            label="Push Notifications"
            isSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          <SettingsItem
            icon="mail-outline"
            label="Email Notifications"
            onPress={() => console.log('Navigate to Email Settings')}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => console.log('Navigate to Help')}
          />
          <SettingsItem
            icon="chatbubble-ellipses-outline"
            label="Contact Support"
            onPress={() => console.log('Navigate to Contact')}
          />
          <SettingsItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => console.log('Navigate to Terms')}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => console.log('Navigate to Privacy Policy')}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon="information-circle-outline"
            label="About E-Companion"
            onPress={() => console.log('Navigate to About')}
          />
          <SettingsItem
            icon="star-outline"
            label="Rate Our App"
            onPress={() => console.log('Navigate to Rate')}
          />
          <SettingsItem
            icon="share-social-outline"
            label="Share App"
            onPress={() => console.log('Navigate to Share')}
          />
          <SettingsItem
            icon="git-branch-outline"
            label="App Version"
            value="v2.4.1"
            showChevron={false}
          />
        </SettingsSection>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton}>
          <Icon name="log-out-outline" size={20} color={Colors.primary} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>E-Companion © 2024</Text>
          <Text style={styles.footerVersion}>Version 2.4.1 (Build 842)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
   
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginLeft:10
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    opacity: 0.8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginRight: 8,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.2)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: Colors.textTertiary,
    opacity: 0.7,
  },
});

export default SettingsScreen;