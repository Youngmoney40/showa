import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Colors from '../../../globalshared/constants/colors';

const AddFundsScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const quickAmounts = [500, 1000, 1500, 2000, 3000, 5000];

  const handleQuickSelect = (val) => {
    setAmount(val.toString());
  };

  const handleAddCustom = () => {
    setShowCustomModal(true);
  };

  const handleSaveCustomAmount = () => {
    if (customAmount && !isNaN(customAmount)) {
      setAmount(customAmount);
      setCustomAmount('');
      setShowCustomModal(false);
    }
  };

  const handleContinue = () => {
    if (amount) {
      // Navigate to payment method selection
      navigation.navigate('CPaymentMethod', { amount: parseFloat(amount) });
    }
  };

  const CustomAmountModal = () => (
    <Modal
      visible={showCustomModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCustomModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowCustomModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Custom Amount</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCustomModal(false)}
                >
                  <Icon name="close" size={24} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View style={styles.modalInputSection}>
                <Text style={styles.modalInputLabel}>Enter Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>₦</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    autoFocus={true}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
                <Text style={styles.inputHint}>
                  Minimum amount: ₦500
                </Text>
              </View>

              {/* Quick Suggestions */}
              <View style={styles.suggestionsSection}>
                <Text style={styles.suggestionsTitle}>Quick Add</Text>
                <View style={styles.suggestionsRow}>
                  {[1000, 2500, 5000, 10000].map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionButton}
                      onPress={() => setCustomAmount(suggestion.toString())}
                    >
                      <Text style={styles.suggestionText}>₦{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setShowCustomModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modalSaveButton,
                    (!customAmount || isNaN(customAmount) || parseFloat(customAmount) < 500) && 
                    styles.modalSaveButtonDisabled
                  ]}
                  onPress={handleSaveCustomAmount}
                  disabled={!customAmount || isNaN(customAmount) || parseFloat(customAmount) < 500}
                >
                  <LinearGradient
                    colors={Colors.primaryGradient}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.modalSaveText}>Add Amount</Text>
                    <Icon name="checkmark" size={18} color={Colors.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
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
          <Text style={styles.headerTitle}>Add Funds</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Securely add money to your wallet for seamless payments and uninterrupted sessions with listeners.
        </Text>

        {/* Current Balance Card */}
        <LinearGradient
          colors={Colors.primaryGradient}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIcon}>
              <Icon name="wallet-outline" size={20} color={Colors.white} />
            </View>
            <Text style={styles.balanceLabel}>Current Balance</Text>
          </View>
          <View style={styles.balanceAmountRow}>
            <Text style={styles.balanceCurrency}>₦</Text>
            <Text style={styles.balanceAmount}>6,000</Text>
          </View>
          <Text style={styles.balanceSubtext}>Available for sessions</Text>
        </LinearGradient>

        {/* Amount Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Add Funds</Text>
          <Text style={styles.inputLabel}>Enter amount to deposit</Text>
          
          <View style={styles.amountInputWrapper}>
            <Text style={styles.inputCurrency}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        {/* Quick Select Grid */}
        <View style={styles.quickSelectSection}>
          <Text style={styles.sectionTitle}>Quick Select</Text>
          <Text style={styles.sectionSubtitle}>Choose from popular amounts</Text>
          
          <View style={styles.quickSelectGrid}>
            {quickAmounts.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.quickAmountButton,
                  amount === val.toString() && styles.quickAmountButtonSelected,
                ]}
                onPress={() => handleQuickSelect(val)}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === val.toString() && styles.quickAmountTextSelected,
                ]}>
                  ₦{val.toLocaleString()}
                </Text>
                {amount === val.toString() && (
                  <Icon name="checkmark" size={16} color={Colors.white} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount Button */}
        <TouchableOpacity 
          style={styles.customAmountButton}
          onPress={handleAddCustom}
        >
          <View style={styles.customAmountIcon}>
            <Icon name="add" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.customAmountText}>Add Custom Amount</Text>
          <Icon name="chevron-forward" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="shield-checkmark" size={18} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Secure & Instant</Text>
              <Text style={styles.infoText}>
                Your funds are added instantly and secured with bank-level encryption.
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            (!amount || isNaN(amount)) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!amount || isNaN(amount)}
        >
          <LinearGradient
            colors={Colors.primaryGradient}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueText}>Continue to Payment</Text>
            <Icon name="arrow-forward" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Amount Modal ================================= */}
      <CustomAmountModal />
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
    marginBottom: 16,
    marginTop:50,
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
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceCurrency: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
  },
  balanceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputCurrency: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 0,
  },
  quickSelectSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  quickAmountButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickAmountTextSelected: {
    color: Colors.white,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  customAmountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  customAmountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customAmountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  continueText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
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
  modalInputSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 0,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  suggestionsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  modalSaveButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSaveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalSaveText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});

export default AddFundsScreen;