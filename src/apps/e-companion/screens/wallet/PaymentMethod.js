import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../globalshared/constants/colors';

const PaymentMethodScreen = ({navigation}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { 
      id: 1, 
      name: 'Paystack', 
      icon: 'credit-card-outline',
      description: 'Pay with your card or bank account',
      type: 'Card & Bank'
    },
    { 
      id: 2, 
      name: 'PayPal', 
      icon: 'paypal',
      description: 'Secure online payments',
      type: 'Digital Wallet'
    },
    { 
      id: 3, 
      name: 'Google Pay', 
      icon: 'google',
      description: 'Fast and secure payment',
      type: 'Digital Wallet'
    },
    { 
      id: 4, 
      name: 'Apple Pay', 
      icon: 'apple',
      description: 'Pay with your Apple device',
      type: 'Digital Wallet'
    },
  ];

  const handleProceed = () => {
    if (selectedMethod) {
      // Handle payment proceeding
      // console.log('Proceeding with:', selectedMethod);
      navigation.navigate('SuggarHome')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Choose Payment Method</Text>
          <Text style={styles.subtitle}>
            Select your preferred payment method. All transactions are encrypted and secure.
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsSection}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              {/* Left Icon Section */}
              <View style={styles.methodLeft}>
                <View style={[
                  styles.iconContainer,
                  selectedMethod === method.id && styles.iconContainerSelected
                ]}>
                  <Icon 
                    name={method.icon} 
                    size={24} 
                    color={selectedMethod === method.id ? Colors.white : Colors.primary} 
                  />
                </View>
              </View>

              {/* Method Info */}
              <View style={styles.methodInfo}>
                <View style={styles.methodHeader}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodType}>{method.type}</Text>
                </View>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>

              {/* Selection Indicator */}
              <View style={styles.selectionIndicator}>
                <Icon
                  name={
                    selectedMethod === method.id
                      ? 'check-circle'
                      : 'radiobox-blank'
                  }
                  size={24}
                  color={selectedMethod === method.id ? Colors.primary : Colors.textTertiary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Features */}
        <View style={styles.securitySection}>
          <Text style={styles.securityTitle}>Your payment is secure with</Text>
          <View style={styles.securityFeatures}>
            <View style={styles.securityFeature}>
              <Icon name="lock-outline" size={16} color={Colors.primary} />
              <Text style={styles.securityFeatureText}>256-bit Encryption</Text>
            </View>
            <View style={styles.securityFeature}>
              <Icon name="shield-outline" size={16} color={Colors.primary} />
              <Text style={styles.securityFeatureText}>PCI DSS Compliant</Text>
            </View>
            <View style={styles.securityFeature}>
              <Icon name="eye-off-outline" size={16} color={Colors.primary} />
              <Text style={styles.securityFeatureText}>Data Protected</Text>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Icon name="information-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.footerText}>
            Payments are processed securely. No refunds once payment is completed.
          </Text>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            !selectedMethod && styles.proceedButtonDisabled
          ]}
          onPress={handleProceed}
          disabled={!selectedMethod}
        >
          <LinearGradient
            colors={selectedMethod ? Colors.primaryGradient : ['#CCCCCC', '#999999']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.proceedButtonText}>
              Continue 
            </Text>
            <Icon name="lock-outline" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    padding: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop:50
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  securityText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  methodsSection: {
    marginBottom: 32,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 51, 102, 0.02)',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  methodLeft: {
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.2)',
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  methodType: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  selectionIndicator: {
    marginLeft: 8,
  },
  securitySection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityFeature: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  securityFeatureText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(102, 102, 102, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textTertiary,
    marginLeft: 8,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  proceedButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default PaymentMethodScreen;