import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; 

const ContactProfile = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const redirectToHomeChat = () => {
    navigation.goBack();
  };

  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        setNotificationSettings(JSON.parse(settings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving notification settings:', error);
    }
  };

  const toggleSwitch = async (key) => {
    const newValue = !notificationSettings[key];
    const newSettings = {
      ...notificationSettings,
      [key]: newValue,
    };
    
    setNotificationSettings(newSettings);
    await saveNotificationSettings(newSettings);
  };

  const menuItems = [
    {
      key: 'showNotifications',
      label: 'Show Notifications',
      icon: 'notifications-outline',
    },
    {
      key: 'doNotDisturb',
      label: 'Do Not Disturb',
      icon: 'moon-outline',
    },
  ];

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
        backgroundColor="#0d64dd"
        translucent={Platform.OS === 'android'}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={[
            styles.header,
            Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }
          ]}>
            <TouchableOpacity style={styles.iconButton} onPress={redirectToHomeChat}>
              <Icon name="arrow-back" size={24} color="#fff" />
              <Text style={styles.headerTitle}>Notifications</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Message Notifications</Text>
          </View>

          <View style={styles.menu}>
            {menuItems.map(({ key, label, icon }) => (
              <View key={key} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconWrapper}>
                    <Icon 
                      name={icon} 
                      size={20} 
                      color={isDark ? '#60a5fa' : '#0d64dd'} 
                    />
                  </View>
                  <Text style={styles.menuText}>{label}</Text>
                </View>
                <View style={styles.switchWrapper}>
                  <Switch
                    value={notificationSettings[key]}
                    onValueChange={() => toggleSwitch(key)}
                    thumbColor={notificationSettings[key] ? '#0d64dd' : '#ccc'}
                    trackColor={{ 
                      true: isDark ? '#1e3a8a' : '#b3d4fc', 
                      false: isDark ? '#374151' : '#e6e6e6' 
                    }}
                    ios_backgroundColor={isDark ? '#374151' : '#e6e6e6'}
                    style={styles.switch}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 80 : 80 + (StatusBar.currentHeight || 0),
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? -10 : 0,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#60a5fa' : '#0d64dd',
  },
  menu: {
    marginTop: 5,
    backgroundColor: colors.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: isDark ? '#1e3a8a' : '#e0f0ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
  },
  switchWrapper: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  testButton: {
    backgroundColor: '#0d64dd',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactProfile;