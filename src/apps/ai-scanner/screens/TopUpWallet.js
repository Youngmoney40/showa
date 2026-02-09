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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';

const COLORS = {
  primary: '#24ad0c',
  primaryDark: '#1a8c0a',
  bg: '#000000',
  cardBg: '#111111',
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#666666',
  border: '#222222',
  success: '#24ad0c',
  error: '#FF4444',
};

const AddFundsScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [500, 1000, 2000, 3000, 5000, 10000];

  const handleQuickSelect = (val) => {
    setAmount(val.toString());
  };

  const handleAddCustom = () => {
    setShowCustomModal(true);
  };

  const handleSaveCustomAmount = () => {
    if (customAmount && !isNaN(customAmount) && parseFloat(customAmount) >= 500) {
      setAmount(customAmount);
      setCustomAmount('');
      setShowCustomModal(false);
    }
  };

  // Simulate Google In-App Purchase
  const handleGoogleInAppPurchase = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) < 500) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount (minimum ₦500)');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Google Play In-App Purchase flow
      // In real implementation, you would integrate with react-native-iap
      const purchaseData = {
        amount: parseFloat(amount),
        currency: 'NGN',
        productId: `lordbetai.topup.${amount}`,
        purchaseToken: 'simulated_purchase_token_' + Date.now(),
      };

      // Send purchase verification to your backend
      const response = await fetch('http://192.168.43.73:8000/api/wallet/topup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          'Top-up Successful!',
          `₦${amount} has been added to your wallet successfully.`,
          [
            {
              text: 'Great!',
              onPress: () => navigation.navigate('WalletScreen'),
            },
          ]
        );
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        'Unable to process payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
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
                <Text style={styles.modalTitle}>Custom Amount</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCustomModal(false)}
                >
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
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
                    placeholderTextColor={COLORS.textTertiary}
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
                      <Text style={styles.suggestionText}>₦{suggestion.toLocaleString()}</Text>
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
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.modalSaveText}>Add Amount</Text>
                    <Icon name="checkmark" size={18} color={COLORS.white} />
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
            <Icon name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Funds</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(36, 173, 12, 0.1)', 'rgba(36, 173, 12, 0.05)']}
            style={styles.heroCard}
          >
            <View style={styles.heroIcon}>
              <Icon name="wallet-outline" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>Top Up Your Wallet</Text>
            <Text style={styles.heroSubtitle}>
              Add funds securely via Google Play Store and enjoy seamless betting analysis
            </Text>
          </LinearGradient>
        </View>

        {/* Current Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.balanceCurrency}>₦</Text>
            <Text style={styles.balanceAmount}>32,450</Text>
          </View>
        </View>

        {/* Amount Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Select Amount</Text>
          
          <View style={styles.amountInputWrapper}>
            <Text style={styles.inputCurrency}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
        </View>

        {/* Quick Select Grid */}
        <View style={styles.quickSelectSection}>
          <Text style={styles.sectionSubtitle}>Popular Amounts</Text>
          
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
                  <Icon name="checkmark" size={16} color={COLORS.white} style={styles.checkIcon} />
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
            <Icon name="add" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.customAmountText}>Custom Amount</Text>
          <Icon name="chevron-forward" size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>

        {/* Google Play Info */}
        <View style={styles.googleInfoSection}>
          <View style={styles.googleInfoCard}>
            <Icon name="logo-google" size={24} color={COLORS.primary} />
            <View style={styles.googleInfoContent}>
              <Text style={styles.googleInfoTitle}>Google Play Billing</Text>
              <Text style={styles.googleInfoText}>
                Secure payment through Google Play Store. Your payment is protected by Google's security systems.
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
          onPress={handleGoogleInAppPurchase}
          disabled={!amount || isNaN(amount) || isProcessing}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isProcessing ? (
              <Text style={styles.continueText}>Processing...</Text>
            ) : (
              <>
                <Icon name="logo-google" size={20} color={COLORS.white} />
                <Text style={styles.continueText}>Pay with Google Play</Text>
                <Text style={styles.amountText}>₦{parseFloat(amount || 0).toLocaleString()}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Security Badge */}
        <View style={styles.securitySection}>
          <View style={styles.securityRow}>
            <Icon name="shield-checkmark" size={16} color={COLORS.primary} />
            <Text style={styles.securityText}>256-bit SSL Encryption</Text>
          </View>
          <View style={styles.securityRow}>
            <Icon name="lock-closed" size={16} color={COLORS.primary} />
            <Text style={styles.securityText}>Google Protected</Text>
          </View>
        </View>
      </ScrollView>

      <CustomAmountModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  // Hero Section
  heroSection: {
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.2)',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Balance Section
  balanceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceCurrency: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  // Input Section
  inputSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(36, 173, 12, 0.3)',
  },
  inputCurrency: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    padding: 0,
  },
  // Quick Select
  quickSelectSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: 'relative',
  },
  quickAmountButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  quickAmountTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // Custom Amount Button
  customAmountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  customAmountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customAmountText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  // Google Info Section
  googleInfoSection: {
    marginBottom: 24,
  },
  googleInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  googleInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  googleInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  googleInfoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  // Continue Button
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: COLORS.primary,
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
    gap: 12,
  },
  continueText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  amountText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 'auto',
  },
  // Security Section
  securitySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
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
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalInputSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    padding: 0,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  suggestionsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
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
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});

export default AddFundsScreen;