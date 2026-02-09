import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

const PaymentSetupScreen = ({ navigation }) => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);

  const banks = [
    'Access Bank',
    'First Bank',
    'Guaranty Trust Bank',
    'Zenith Bank',
    'United Bank for Africa',
    'Ecobank Nigeria',
    'Fidelity Bank',
    'First City Monument Bank',
    'Stanbic IBTC Bank',
    'Union Bank of Nigeria',
    'Wema Bank',
    'Sterling Bank',
  ];

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setShowBankModal(false);
  };

  const handleSubmit = () => {
    if (selectedBank && accountNumber.length === 10) {
      // Handle payment setup submission
      console.log('Payment setup submitted');
      navigation.navigate('CDashboard');
    }
  };

  const BankSelectionModal = () => (
    <Modal
      visible={showBankModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowBankModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowBankModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Your Bank</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowBankModal(false)}
                >
                  <Icon name="close" size={24} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.banksList}>
                {banks.map((bank, index) => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.bankItem,
                      selectedBank === bank && styles.bankItemSelected,
                    ]}
                    onPress={() => handleBankSelect(bank)}
                  >
                    <Text style={[
                      styles.bankName,
                      selectedBank === bank && styles.bankNameSelected,
                    ]}>
                      {bank}
                    </Text>
                    {selectedBank === bank && (
                      <Icon name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Setup</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <LinearGradient
            colors={Colors.primaryGradient}
            style={styles.securityGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="shield-checkmark" size={20} color={Colors.white} />
            <Text style={styles.securityText}>Secure Payment Setup</Text>
          </LinearGradient>
        </View>

        {/* Description Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIcon}>
              <Icon name="business" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.infoTitle}>Company Payments</Text>
          </View>
          <Text style={styles.infoDescription}>
            The company will be responsible for paying you, not the listener. All payments are processed securely and transferred directly to your bank account.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Bank Account Details</Text>
          
          {/* Bank Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bank Name</Text>
            <TouchableOpacity 
              style={styles.selectField}
              onPress={() => setShowBankModal(true)}
            >
              <Text style={[
                styles.selectText,
                selectedBank && styles.selectTextFilled
              ]}>
                {selectedBank || 'Select your bank'}
              </Text>
              <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Account Number */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Account Number</Text>
              <Text style={styles.characterCount}>
                {accountNumber.length}/10
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                accountNumber.length === 10 && styles.inputValid,
                accountNumber.length > 0 && accountNumber.length !== 10 && styles.inputError
              ]}
              placeholder="Enter 10-digit account number"
              placeholderTextColor={Colors.textTertiary}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              maxLength={10}
            />
            {accountNumber.length > 0 && accountNumber.length !== 10 && (
              <Text style={styles.errorText}>Account number must be 10 digits</Text>
            )}
          </View>

          {/* Account Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Account Name</Text>
            <View style={styles.accountNameContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value="Mrs. Mary Mark"
                editable={false}
              />
              <Icon name="checkmark-circle" size={20} color={Colors.success} style={styles.verifiedIcon} />
            </View>
            <Text style={styles.helperText}>
              This name will be displayed on your public profile
            </Text>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <View style={styles.securityNoteHeader}>
            <Icon name="lock-closed" size={18} color={Colors.primary} />
            <Text style={styles.securityNoteTitle}>Security Guarantee</Text>
          </View>
          <Text style={styles.securityNoteText}>
            Your bank details are encrypted and stored securely. We never share your financial information with listeners.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              (!selectedBank || accountNumber.length !== 10) && styles.primaryButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedBank || accountNumber.length !== 10}
          >
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Complete Setup</Text>
              <Icon name="checkmark" size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bank Selection Modal */}
      <BankSelectionModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop:50
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  securityBadge: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  securityGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  securityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  selectField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectText: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
  selectTextFilled: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputValid: {
    borderColor: Colors.success,
  },
  inputError: {
    borderColor: Colors.primary,
  },
  disabledInput: {
    backgroundColor: Colors.inputBackground,
    color: Colors.textSecondary,
  },
  accountNameContainer: {
    position: 'relative',
  },
  verifiedIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  securityNote: {
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: 32,
  },
  securityNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  securityNoteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  banksList: {
    maxHeight: 400,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bankItemSelected: {
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
  },
  bankName: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  bankNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default PaymentSetupScreen;