import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COUNTRIES } from '../onboard/CountryPicker';



const COLORS = {
  primary: '#0d64dd',
  primaryLight: '#4a90e2',
  primaryDark: '#0a50b0',
  border: '#e1e5eb',
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  placeholder: '#adb5bd',
  white: '#ffffff',
  grayLight: '#f8f9fa',
  grayMedium: '#e9ecef',
  success: '#28a745',
  error: '#dc3545',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PhoneNumberScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const phoneInputRef = useRef(null);

  
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 300);

    return () => clearTimeout(focusTimer);
  }, []);

 
  useEffect(() => {
    if (showDropdown) {
      phoneInputRef.current?.blur();
    } else {
     
      const focusTimer = setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(focusTimer);
    }
  }, [showDropdown]);

  const validatePhoneNumber = () => {
    const trimmedNumber = phoneNumber.trim();
    
    if (!trimmedNumber) {
      Alert.alert('Phone Number Required', 'Please enter your phone number to continue.');
      return false;
    }
    
    if (!/^\d+$/.test(trimmedNumber)) {
      Alert.alert('Invalid Format', 'Phone number should contain only digits.');
      return false;
    }
    
    if (selectedCountry.code === 'NG' && trimmedNumber.length < 10) {
      Alert.alert('Invalid Length', 'Nigerian phone numbers must be at least 10 digits.');
      return false;
    }
    
    if (trimmedNumber.length < 7) {
      Alert.alert('Invalid Number', 'Phone number is too short.');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (!validatePhoneNumber()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Signin_two', {
        phoneNumberID: `${selectedCountry.dial}${phoneNumber}`,
        countryCode: selectedCountry.code,
      });
    }, 800);
  };

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial.includes(searchQuery)
  );

  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    setPhoneNumber(digits);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />

     
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
         

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Phone Verification</Text>
            <Text style={styles.headerSubtitle}><Text style={styles.headerSubtitle}>Provide your details to continue</Text>
</Text>
          </View>

          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
         
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(13,100,221,0.1)', 'rgba(74,144,226,0.05)']}
              style={styles.heroIconContainer}
            >
              <Icon name="phone-portrait-outline" size={42} color={COLORS.primary} />
            </LinearGradient>
            
            <Text style={styles.heroTitle}>Enter Your Phone Number</Text>
            <Text style={styles.heroSubtitle}>
              We'll send a verification code to this number
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            {/* Country Selector */}
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={() => setShowDropdown(true)}
              activeOpacity={0.7}
            >
              <View style={styles.countryFlagContainer}>
                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
              </View>
              <Text style={styles.countryName}>
                {selectedCountry.name} {selectedCountry.dial}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* Phone Input Container */}
            <View style={styles.phoneInputWrapper}>
              <View style={styles.dialCodeContainer}>
                <Text style={styles.dialCodeText}>{selectedCountry.dial}</Text>
              </View>
              
              <TextInput
                ref={phoneInputRef}
                placeholder="Enter phone number"
                style={styles.phoneInput}
                keyboardType="number-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                placeholderTextColor={COLORS.placeholder}
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
                maxLength={15}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                blurOnSubmit={false}
                editable={!loading}
                autoFocus={true}
              />
              
              {phoneNumber.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setPhoneNumber('')}
                  activeOpacity={0.6}
                >
                  <Icon name="close-circle" size={20} color={COLORS.placeholder} />
                </TouchableOpacity>
              )}
            </View>

            {/* Helper Text */}
            <Text style={styles.helperText}>
              Standard messaging rates may apply
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.continueButton,
              (phoneNumber.length === 0 || loading) && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={phoneNumber.length === 0 || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Selection Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.6}
              >
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Icon name="search-outline" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
              <TextInput
                placeholder="Search country or code..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor={COLORS.placeholder}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {/* Countries List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountry.code === item.code && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.countryItemLeft}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <View style={styles.countryInfo}>
                      <Text style={styles.countryItemName}>{item.name}</Text>
                      <Text style={styles.countryItemDial}>{item.dial}</Text>
                    </View>
                  </View>
                  {selectedCountry.code === item.code && (
                    <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    height: 60,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    marginTop: SPACING.xs,
  },
  headerPlaceholder: {
    width: 40,
  },

  /* Content Styles */
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  /* Hero Section */
  heroContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },

  /* Input Section */
  inputSection: {
    marginBottom: SPACING.xl,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 56,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.grayLight,
  },
  countryFlagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  flagText: {
    fontSize: 24,
    marginRight: SPACING.xs,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    backgroundColor: 'rgba(13, 100, 221, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    height: 56,
    marginBottom: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dialCodeContainer: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
  },
  dialCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    fontWeight: '500',
  },
  clearButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  /* Button Styles */
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: SPACING.sm,
  },

  /* Privacy Text */
  privacyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.md,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingTop: SPACING.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMedium,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.grayLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.grayLight,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  countryItemSelected: {
    backgroundColor: 'rgba(13, 100, 221, 0.05)',
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  countryInfo: {
    flex: 1,
  },
  countryItemName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  countryItemDial: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grayMedium,
    marginHorizontal: SPACING.lg,
  },
});
