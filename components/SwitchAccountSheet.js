import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SwitchAccountSheet = ({
  showConfirmSwitch,
  setShowConfirmSwitch,
  pendingSwitchTo = 'business',
  switchAccount,
  isLoading,
  setIsLoading,
}) => {
  const { colors, isDark } = useTheme();

  const accountTypeDetails = {
    business: {
      icon: 'business-outline',
      color: isDark ? '#3b82f6' : '#0750b5',
      gradient: isDark ? ['#1e40af', '#3b82f6'] : ['#0750b5', '#0d64dd'],
      benefits: [
        'Access business tools and analytics',
        'Manage customers and products',
        'Professional profile appearance'
      ],
      displayName: 'Business'
    },
    personal: {
      icon: 'person-outline',
      color: isDark ? '#60a5fa' : '#3498db',
      gradient: isDark ? ['#1e3a8a', '#60a5fa'] : ['#3498db', '#2980b9'],
      benefits: [
        'Connect with friends and family',
        'Share personal moments',
        'Simplified interface'
      ],
      displayName: 'Personal'
    },
    social: {
      icon: 'people-outline',
      color: isDark ? '#ef4444' : '#e74c3c',
      gradient: isDark ? ['#991b1b', '#ef4444'] : ['#e74c3c', '#c0392b'],
      benefits: [
        'Connect with friends and communities',
        'Share your favorite moments',
        'Discover new content'
      ],
      displayName: 'Social'
    }
  };

  const accountType = pendingSwitchTo && accountTypeDetails[pendingSwitchTo] 
    ? pendingSwitchTo 
    : 'business';
  const details = accountTypeDetails[accountType];

  const handleSwitch = async () => {
    setIsLoading(true);
    try {
      await switchAccount(accountType);
    } finally {
      setShowConfirmSwitch(false);
      setIsLoading(false);
    }
  };

  const styles = createStyles(colors, isDark, details);

  return (
    <Modal
      visible={showConfirmSwitch}
      transparent
      animationType="slide"
      onRequestClose={() => !isLoading && setShowConfirmSwitch(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.sheet}>
          {Platform.OS === 'ios' ? (
            <View style={styles.iosHeader}>
              <Text style={styles.iosTitle}>
                Switch to {details.displayName} Account
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={details.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.headerGradient}
            >
              <Icon 
                name={details.icon} 
                size={28} 
                color="#fff" 
                style={styles.accountIcon}
              />
              <Text style={styles.title}>
                Switch to {details.displayName} Account
              </Text>
            </LinearGradient>
          )}

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              You'll gain access to:
            </Text>

            <View style={styles.benefitsContainer}>
              {details.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={18} color={isDark ? '#10b981' : '#2ecc71'} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.noteBox}>
              <Icon name="information-circle-outline" size={18} color={isDark ? '#f59e0b' : '#f39c12'} />
              <Text style={styles.noteText}>
                {accountType === 'business' 
                  ? 'Business features will replace some personal account options'
                  : 'Your existing data will remain accessible'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmSwitch(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: details.color }]}
                onPress={handleSwitch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Icon 
                      name="swap-horizontal" 
                      size={18} 
                      color="#fff" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text style={styles.confirmButtonText}>
                      Switch to {details.displayName}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, isDark, details) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 16,
    elevation: 20,
    maxHeight: '70%',
  },
  headerGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iosHeader: {
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#fff',
    padding: 20,
    paddingTop: 30,
  },
  iosTitle: {
    color: isDark ? '#fff' : '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  accountIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 24,
    backgroundColor: isDark ? '#1f2937' : '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#d1d5db' : '#555',
    marginBottom: 16,
    fontWeight: '600',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: isDark ? '#e5e7eb' : '#333',
    marginLeft: 10,
    flex: 1,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(243, 156, 18, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(243, 156, 18, 0.2)',
  },
  noteText: {
    fontSize: 14,
    color: isDark ? '#f59e0b' : '#f39c12',
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: isDark ? '#374151' : '#f5f5f5',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#e5e5e5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#d1d5db' : '#555',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.4 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SwitchAccountSheet;