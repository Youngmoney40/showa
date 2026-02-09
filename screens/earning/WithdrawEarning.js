import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, Modal, Switch,
  Linking, Platform, Animated, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ROUTE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext'; 

const BRAND_COLOR = '#0d64dd';

// API Service
const createApiService = () => {
  const baseURL = `${API_ROUTE}`;
  
  const api = {
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    defaults: {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  api.request = async (config) => {
    try {
      const mergedConfig = {
        ...api.defaults,
        ...config,
        headers: {
          ...api.defaults.headers,
          ...config.headers,
        },
      };

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        mergedConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);
      
      const response = await fetch(
        `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
        {
          method: mergedConfig.method || 'GET',
          headers: mergedConfig.headers,
          body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
  api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

  return api;
};

const api = createApiService();

// Exchange rate (would ideally come from API)
const EXCHANGE_RATE = 1500; // 1 USD = 1500 NGN

const WithdrawScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme(); // Get theme colors
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [limits, setLimits] = useState(null);
  const [methods, setMethods] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Withdrawal form state
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [showNairaConversion, setShowNairaConversion] = useState(false);
  
  // Method details
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cryptoWallet, setCryptoWallet] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT');
  
  // Terms and conditions
  const [allTermsAccepted, setAllTermsAccepted] = useState({
    terms: false,
    privacy: false,
    tax: false,
    verification: false,
    agreement: false
  });
  
  // Modals
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMethodDetails, setShowMethodDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${API_ROUTE}/wallet/enhanced/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Wallet data fetched:', data);
        setWallet(data);
        setBalance(data.usd_available || 0);
      } else {
        setWallet(null);
      }
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalData = async () => {
    try {
      setLoading(true);
      const [limitsRes, methodsRes, historyRes] = await Promise.all([
        api.get('/withdraw/limits'),
        api.get('/withdraw/methods'),
        api.get('/withdraw/history')
      ]);
      
      setLimits(limitsRes.data);
      setMethods(methodsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching withdrawal data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchWithdrawalData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Format currency with dynamic color
  const formatCurrency = (amount, isNaira = false) => {
    if (amount === undefined || amount === null) return isNaira ? '₦0.00' : '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Convert USD to Naira
  const convertToNaira = (usdAmount) => {
    const amountNum = parseFloat(usdAmount) || 0;
    return amountNum * EXCHANGE_RATE;
  };

  // Format Naira amount
  const formatNaira = (amount) => {
    if (amount === undefined || amount === null) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateFee = () => {
    const amountNum = parseFloat(amount) || 0;
    const feePercent = limits?.fee_percent || 5.0;
    const feeMin = limits?.fee_minimum_usd || 1.00;
    let fee = (amountNum * feePercent) / 100;
    if (fee < feeMin) fee = feeMin;
    return fee;
  };

  const calculateTax = () => {
    const amountNum = parseFloat(amount) || 0;
    // Assuming 10% tax rate (you can adjust this)
    const taxPercent = 10.0;
    return (amountNum * taxPercent) / 100;
  };

  const calculateNetAmount = () => {
    const amountNum = parseFloat(amount) || 0;
    const fee = calculateFee();
    const tax = calculateTax();
    return amountNum - fee - tax;
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowMethodDetails(true);
    
    // Set default currency based on method
    if (method === 'paypal') setCurrency('USD');
    if (method === 'bank_transfer') setCurrency('USD');
    if (method === 'mobile_money') setCurrency('USD');
    if (method === 'crypto') setCurrency('USDT');
  };

  const validateWithdrawal = () => {
    const amountNum = parseFloat(amount) || 0;
    
    if (amountNum < (limits?.minimum_usd || 10)) {
      Alert.alert('Minimum Amount', `Minimum withdrawal amount is ${formatCurrency(limits?.minimum_usd || 10)}`);
      return false;
    }
    
    if (amountNum > balance) {
      Alert.alert('Insufficient Balance', `You only have ${formatCurrency(balance)} available`);
      return false;
    }
    
    if (!selectedMethod) {
      Alert.alert('Select Method', 'Please select a withdrawal method');
      return false;
    }
    
    // Validate method-specific details
    if (selectedMethod === 'paypal' && !paypalEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid PayPal email');
      return false;
    }
    
    if (selectedMethod === 'bank_transfer' && (!bankAccount || !bankName)) {
      Alert.alert('Bank Details Required', 'Please enter your bank account details');
      return false;
    }
    
    if (selectedMethod === 'mobile_money' && !mobileNumber) {
      Alert.alert('Mobile Number Required', 'Please enter your mobile money number');
      return false;
    }
    
    if (selectedMethod === 'crypto' && !cryptoWallet) {
      Alert.alert('Wallet Required', 'Please enter your crypto wallet address');
      return false;
    }
    
    if (!allTermsAccepted.terms || !allTermsAccepted.privacy || 
        !allTermsAccepted.tax || !allTermsAccepted.verification || 
        !allTermsAccepted.agreement) {
      Alert.alert('Terms Required', 'You must accept all terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleWithdrawalSubmit = async () => {
    if (!validateWithdrawal()) return;
    
    try {
      setSubmitting(true);
      
      const withdrawalData = {
        amount: parseFloat(amount),
        method: selectedMethod,
        currency,
        terms_accepted: 'true'
      };
      
      // Add method-specific details
      if (selectedMethod === 'paypal') {
        withdrawalData.paypal_email = paypalEmail;
      } else if (selectedMethod === 'bank_transfer') {
        withdrawalData.bank_account_number = bankAccount;
        withdrawalData.bank_name = bankName;
        withdrawalData.routing_number = routingNumber;
      } else if (selectedMethod === 'mobile_money') {
        withdrawalData.mobile_money_number = mobileNumber;
      } else if (selectedMethod === 'crypto') {
        withdrawalData.crypto_wallet = cryptoWallet;
        withdrawalData.crypto_network = cryptoNetwork;
      }
      
      const response = await api.post('/withdraw/request', withdrawalData);
      
      if (response.data.success) {
        setShowSuccessModal(true);
        // Reset form
        setAmount('');
        setPaypalEmail('');
        setBankAccount('');
        setBankName('');
        setRoutingNumber('');
        setMobileNumber('');
        setCryptoWallet('');
        setAllTermsAccepted({
          terms: false,
          privacy: false,
          tax: false,
          verification: false,
          agreement: false
        });
        // Refresh data
        fetchWalletData();
        fetchWithdrawalData();
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to process withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMethodIcon = (method) => {
    switch(method) {
      case 'paypal': return <Icon2 name="paypal" size={24} color="#003087" />;
      case 'bank_transfer': return <Icon name="account-balance" size={24} color="#4CAF50" />;
      case 'mobile_money': return <Icon name="smartphone" size={24} color="#2196F3" />;
      case 'crypto': return <Icon2 name="bitcoin" size={24} color="#FF9800" />;
      default: return <Icon name="payment" size={24} color="#666" />;
    }
  };

  const renderMethodDetails = () => {
    if (!selectedMethod) return null;
    
    const methodInfo = methods[selectedMethod];
    
    return (
      <View style={[styles.methodDetailsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.methodDetailsTitle, { color: colors.text }]}>
          {selectedMethod === 'paypal' ? 'PayPal Details' :
           selectedMethod === 'bank_transfer' ? 'Bank Transfer Details' :
           selectedMethod === 'mobile_money' ? 'Mobile Money Details' :
           'Crypto Wallet Details'}
        </Text>
        
        {selectedMethod === 'paypal' && (
          <>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PayPal Email Address</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textSecondary}
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={[styles.methodNote, { color: colors.textSecondary }]}>
              ⚠️ Ensure your PayPal email is correct. Withdrawals cannot be reversed.
            </Text>
          </>
        )}
        
        {selectedMethod === 'bank_transfer' && (
          <>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bank Account Number</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="1234567890"
              placeholderTextColor={colors.textSecondary}
              value={bankAccount}
              onChangeText={setBankAccount}
              keyboardType="number-pad"
            />
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bank Name</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="e.g., Chase Bank, Bank of America"
              placeholderTextColor={colors.textSecondary}
              value={bankName}
              onChangeText={setBankName}
            />
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Routing Number (USA only)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="021000021"
              placeholderTextColor={colors.textSecondary}
              value={routingNumber}
              onChangeText={setRoutingNumber}
              keyboardType="number-pad"
            />
            
            <Text style={[styles.methodNote, { color: colors.textSecondary }]}>
              ⏱️ Bank transfers take 3-7 business days. Double-check your account details.
            </Text>
          </>
        )}
        
        {selectedMethod === 'mobile_money' && (
          <>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="e.g., +2348123456789"
              placeholderTextColor={colors.textSecondary}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Network Provider</Text>
            <View style={styles.networkSelector}>
              {['M-Pesa', 'MTN', 'Airtel', 'Orange', 'Vodafone'].map(network => (
                <TouchableOpacity
                  key={network}
                  style={[
                    styles.networkOption,
                    { backgroundColor: colors.backgroundSecondary },
                    mobileNumber.includes('+234') && network === 'MTN' && styles.networkSelected
                  ]}
                >
                  <Text style={[styles.networkText, { color: colors.text }]}>{network}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.methodNote, { color: colors.textSecondary }]}>
              📱 Ensure your mobile number is registered with the mobile money service.
            </Text>
          </>
        )}
        
        {selectedMethod === 'crypto' && (
          <>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Crypto Wallet Address</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="0x742d35Cc6634C0532925a3b844B..."
              placeholderTextColor={colors.textSecondary}
              value={cryptoWallet}
              onChangeText={setCryptoWallet}
              autoCapitalize="none"
            />
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Select Network & Currency</Text>
            <View style={styles.cryptoSelector}>
              {[
                { symbol: 'USDT', name: 'Tether (ERC20)', color: '#26A17B' },
                { symbol: 'USDC', name: 'USD Coin (ERC20)', color: '#2775CA' },
                { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
                { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' }
              ].map(token => (
                <TouchableOpacity
                  key={token.symbol}
                  style={[
                    styles.cryptoOption,
                    { backgroundColor: colors.backgroundSecondary },
                    cryptoNetwork === token.symbol && styles.cryptoSelected
                  ]}
                  onPress={() => setCryptoNetwork(token.symbol)}
                >
                  <View style={[styles.cryptoIcon, { backgroundColor: token.color }]}>
                    <Text style={styles.cryptoIconText}>{token.symbol.charAt(0)}</Text>
                  </View>
                  <View style={styles.cryptoInfo}>
                    <Text style={[styles.cryptoSymbol, { color: colors.text }]}>{token.symbol}</Text>
                    <Text style={[styles.cryptoName, { color: colors.textSecondary }]}>{token.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.methodNote, { color: colors.textSecondary }]}>
              ⚠️ Send only {cryptoNetwork} to this address. Sending other assets may result in permanent loss.
            </Text>
          </>
        )}
        
        <TouchableOpacity
          style={[styles.closeDetailsButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowMethodDetails(false)}
        >
          <Text style={styles.closeDetailsText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHistoryItem = (item) => (
    <View key={item._id} style={[styles.historyItem, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={styles.historyHeader}>
        <View style={styles.historyMethod}>
          {renderMethodIcon(item.method)}
          <Text style={[styles.historyMethodText, { color: colors.text }]}>
            {item.method === 'paypal' ? 'PayPal' :
             item.method === 'bank_transfer' ? 'Bank Transfer' :
             item.method === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: 
            item.status === 'completed' ? '#4CAF50' :
            item.status === 'pending' ? '#FF9800' :
            item.status === 'processing' ? '#2196F3' :
            item.status === 'rejected' ? '#F44336' : '#9E9E99'
          }
        ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.historyDetails}>
        <View>
          <Text style={[styles.historyAmount, { color: colors.text }]}>{formatCurrency(item.amount_usd)}</Text>
          <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.historyNet}>
          <Text style={[styles.historyNetText, { color: '#4CAF50' }]}>Net: {formatCurrency(item.net_amount_usd)}</Text>
          <Text style={[styles.historyFeeText, { color: colors.textSecondary }]}>Fee: {formatCurrency(item.fee_usd)}</Text>
        </View>
      </View>
      
      {item.status === 'rejected' && item.rejection_reason && (
        <View style={[styles.rejectionReason, { backgroundColor: isDark ? '#331a1a' : '#FFEBEE' }]}>
          <Icon name="warning" size={16} color="#F44336" />
          <Text style={[styles.rejectionText, { color: isDark ? '#ff6b6b' : '#D32F2F' }]}>
            Reason: {item.rejection_reason}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading withdrawal details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          translucent={Platform.OS === 'android'}
          backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
        />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={[colors.primary, isDark ? '#0a3a7a' : '#0a53b9']}
            style={styles.header}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Withdraw Funds</Text>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => setShowHistoryModal(true)}
            >
              <Icon name="history" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Available Balance Card */}
          <Animated.View 
            style={[
              styles.balanceCard,
              { 
                backgroundColor: colors.card,
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
              Available for Withdrawal
            </Text>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>
              {formatCurrency(balance)}
            </Text>
            
            {/* Naira Conversion Toggle */}
            <TouchableOpacity 
              style={styles.nairaToggle}
              onPress={() => setShowNairaConversion(!showNairaConversion)}
            >
              <Text style={[styles.nairaToggleText, { color: colors.primary }]}>
                {showNairaConversion ? 'Hide Naira Conversion' : 'Show in Naira (₦)'}
              </Text>
              <Icon 
                name={showNairaConversion ? "expand-less" : "expand-more"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
            
            {showNairaConversion && (
              <View style={styles.nairaConversion}>
                <Text style={[styles.nairaAmount, { color: colors.text }]}>
                  {formatNaira(convertToNaira(balance))}
                </Text>
                <Text style={[styles.exchangeRate, { color: colors.textSecondary }]}>
                  Exchange rate: 1 USD = ₦{EXCHANGE_RATE.toLocaleString()}
                </Text>
              </View>
            )}
            
            <View style={styles.balanceInfo}>
              <View style={styles.infoItem}>
                <Icon name="error-outline" size={16} color="#FF9800" />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Min: {formatCurrency(limits?.minimum_usd || 10)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="attach-money" size={16} color="#4CAF50" />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Fee: {limits?.fee_percent || 5}% (min {formatCurrency(limits?.fee_minimum_usd || 1)})
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Amount Input */}
          <View style={[styles.amountCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Withdrawal Amount</Text>
            <View style={[styles.amountInputContainer, { borderColor: colors.primary }]}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.currencyText, { color: colors.textSecondary }]}>USD</Text>
            </View>
            
            {/* Naira equivalent display */}
            {amount && !isNaN(parseFloat(amount)) && (
              <View style={[styles.nairaEquivalent, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.nairaEquivalentText, { color: colors.text }]}>
                  ≈ {formatNaira(convertToNaira(parseFloat(amount) || 0))}
                </Text>
              </View>
            )}
            
            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {[10, 25, 50, 100, 250].map(quickAmount => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    { backgroundColor: colors.backgroundSecondary },
                    amount === quickAmount.toString() && styles.quickAmountSelected
                  ]}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={[
                    styles.quickAmountText,
                    { color: colors.text },
                    amount === quickAmount.toString() && styles.quickAmountTextSelected
                  ]}>
                    ${quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.quickAmountButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setAmount(balance.toString())}
              >
                <Text style={[styles.quickAmountText, { color: colors.text }]}>Max</Text>
              </TouchableOpacity>
            </View>
            
            {/* Fee, Tax & Net Amount Preview */}
            {amount && (
              <View style={[styles.previewCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Amount:</Text>
                  <Text style={[styles.previewValue, { color: colors.text }]}>
                    {formatCurrency(parseFloat(amount) || 0)}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                    Processing Fee ({limits?.fee_percent || 5}%):
                  </Text>
                  <Text style={[styles.previewValue, { color: '#F44336' }]}>
                    -{formatCurrency(calculateFee())}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                    Government Tax (10%):
                  </Text>
                  <Text style={[styles.previewValue, { color: '#F44336' }]}>
                    -{formatCurrency(calculateTax())}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.previewRow}>
                  <Text style={[styles.netAmountLabel, { color: colors.text }]}>You Receive:</Text>
                  <Text style={styles.netAmountValue}>
                    {formatCurrency(calculateNetAmount())}
                  </Text>
                </View>
                {/* Naira equivalent of net amount */}
                {amount && !isNaN(parseFloat(amount)) && (
                  <View style={styles.nairaNetRow}>
                    <Text style={[styles.nairaNetLabel, { color: colors.textSecondary }]}>
                      You'll get in Naira:
                    </Text>
                    <Text style={[styles.nairaNetValue, { color: colors.text }]}>
                      {formatNaira(convertToNaira(calculateNetAmount()))}
                    </Text>
                  </View>
                )}
                <Text style={[styles.previewNote, { color: '#FF9800' }]}>
                  *Note: 10% tax is automatically deducted and paid to the government
                </Text>
                <Text style={[styles.previewNote, { color: colors.textSecondary }]}>
                  Estimated processing: 3-7 business days
                </Text>
              </View>
            )}
          </View>

          {/* Withdrawal Methods */}
          <View style={[styles.methodsCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Withdrawal Method</Text>
            
            <View style={styles.methodsGrid}>
              {Object.entries(methods).map(([method, info]) => (
                info.available && (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodButton,
                      { 
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: 'transparent'
                      },
                      selectedMethod === method && styles.methodSelected
                    ]}
                    onPress={() => handleMethodSelect(method)}
                  >
                    <View style={[styles.methodIconContainer, { backgroundColor: colors.card }]}>
                      {renderMethodIcon(method)}
                    </View>
                    <Text style={[styles.methodName, { color: colors.text }]}>
                      {method === 'paypal' ? 'PayPal' :
                       method === 'bank_transfer' ? 'Bank Transfer' :
                       method === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
                    </Text>
                    <Text style={[styles.methodTime, { color: colors.textSecondary }]}>
                      {info.processing_time}
                    </Text>
                    <Text style={[styles.methodFee, { color: colors.primary }]}>{info.fee}</Text>
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>

          {/* Tax Information Card */}
          <View style={[styles.taxCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.taxTitle, { color: colors.text }]}>
              ⚖️ Tax Information
            </Text>
            <Text style={[styles.taxDescription, { color: colors.textSecondary }]}>
              We automatically deduct 10% tax from your withdrawal amount and pay it directly to the government. This ensures compliance with local tax regulations.
            </Text>
            <View style={[styles.taxInfoBox, { backgroundColor: colors.backgroundSecondary }]}>
              <Icon name="account-balance" size={24} color={colors.primary} />
              <Text style={[styles.taxInfoText, { color: colors.text }]}>
                Tax Responsibility: Showa handles all tax payments to the government on your behalf
              </Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={[styles.termsCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Terms & Conditions</Text>
            
            <TouchableOpacity 
              style={[styles.viewTermsButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setShowTermsModal(true)}
            >
              <Icon name="description" size={20} color={colors.primary} />
              <Text style={[styles.viewTermsText, { color: colors.text }]}>
                View Complete Terms & Conditions
              </Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Required Consents */}
            <View style={styles.consentsContainer}>
              <View style={styles.consentItem}>
                <Switch
                  value={allTermsAccepted.terms}
                  onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, terms: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#fff' : undefined}
                />
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I agree to the <Text style={[styles.consentLink, { color: colors.primary }]}>Terms of Service</Text>
                </Text>
              </View>
              
              <View style={styles.consentItem}>
                <Switch
                  value={allTermsAccepted.privacy}
                  onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, privacy: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#fff' : undefined}
                />
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I agree to the <Text style={[styles.consentLink, { color: colors.primary }]}>Privacy Policy</Text>
                </Text>
              </View>
              
              <View style={styles.consentItem}>
                <Switch
                  value={allTermsAccepted.tax}
                  onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, tax: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#fff' : undefined}
                />
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I understand that 10% tax will be deducted and paid to the government
                </Text>
              </View>
              
              <View style={styles.consentItem}>
                <Switch
                  value={allTermsAccepted.verification}
                  onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, verification: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#fff' : undefined}
                />
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I agree to provide verification documents if requested (KYC/AML)
                </Text>
              </View>
              
              <View style={styles.consentItem}>
                <Switch
                  value={allTermsAccepted.agreement}
                  onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, agreement: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#fff' : undefined}
                />
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I agree that withdrawal decisions are final and at Showa's discretion
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              (!amount || !selectedMethod || submitting || 
               !Object.values(allTermsAccepted).every(v => v)) && styles.submitButtonDisabled
            ]}
            onPress={handleWithdrawalSubmit}
            disabled={!amount || !selectedMethod || submitting || 
                     !Object.values(allTermsAccepted).every(v => v)}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={22} color="#fff" />
                <Text style={styles.submitButtonText}>Request Withdrawal</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Important Notes */}
          <View style={[styles.notesCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.notesTitle, { color: colors.text }]}>⚠️ Important Information</Text>
            <View style={styles.noteItem}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={[styles.noteText, { color: colors.text }]}>
                First withdrawal requires identity verification (KYC)
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="account-balance" size={16} color={colors.primary} />
              <Text style={[styles.noteText, { color: colors.text }]}>
                10% tax automatically deducted and paid to government
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="timer" size={16} color="#FF9800" />
              <Text style={[styles.noteText, { color: colors.text }]}>
                Processing times vary by method (1-7 business days)
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="security" size={16} color="#2196F3" />
              <Text style={[styles.noteText, { color: colors.text }]}>
                All transactions are monitored for fraud and security
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Icon name="warning" size={16} color="#F44336" />
              <Text style={[styles.noteText, { color: colors.text }]}>
                Incorrect payment details may result in permanent loss of funds
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Terms & Conditions Modal */}
        <Modal
          visible={showTermsModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowTermsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Terms & Conditions</Text>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowTermsModal(false)}
                >
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.termsContent}>
                <Text style={[styles.termsHeading, { color: colors.primary }]}>
                  SHOWA WITHDRAWAL TERMS & CONDITIONS
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>1. ELIGIBILITY</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  1.1. You must be at least 18 years old to withdraw funds.{'\n'}
                  1.2. Your account must be verified with valid government-issued ID.{'\n'}
                  1.3. Minimum withdrawal amount is $10.00 USD.{'\n'}
                  1.4. You must have earned funds through legitimate platform use.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>2. PROCESSING TIME & FEES</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  2.1. Processing times: PayPal (1-3 days), Bank Transfer (3-7 days), Mobile Money (24-48 hours), Crypto (1-2 hours).{'\n'}
                  2.2. Processing fee: 5% of withdrawal amount (minimum $1.00).{'\n'}
                  2.3. Additional network fees may apply for crypto withdrawals.{'\n'}
                  2.4. Currency conversion fees apply for non-USD withdrawals.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>3. TAX DEDUCTION</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  3.1. A 10% government tax is automatically deducted from all withdrawals.{'\n'}
                  3.2. Showa handles all tax payments to the government on your behalf.{'\n'}
                  3.3. Tax deduction is mandatory and non-negotiable.{'\n'}
                  3.4. You will receive documentation for tax purposes.{'\n'}
                  3.5. The tax rate is subject to change based on government regulations.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>4. VERIFICATION REQUIREMENTS</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  4.1. First withdrawal requires full KYC verification.{'\n'}
                  4.2. You must provide valid government-issued photo ID.{'\n'}
                  4.3. Proof of address (utility bill, bank statement) may be required.{'\n'}
                  4.4. Selfie verification with ID may be requested.{'\n'}
                  4.5. We reserve the right to request additional documentation.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>5. ANTI-FRAUD & COMPLIANCE</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  5.1. All withdrawals are subject to fraud review.{'\n'}
                  5.2. We monitor for suspicious activity and money laundering.{'\n'}
                  5.3. We may delay or reject withdrawals for security reasons.{'\n'}
                  5.4. You must not use the service for illegal activities.{'\n'}
                  5.5. We comply with all applicable laws and regulations.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>6. LIMITATIONS & RESTRICTIONS</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  6.1. Daily withdrawal limit: $1,000 USD.{'\n'}
                  6.2. Weekly withdrawal limit: $5,000 USD.{'\n'}
                  6.3. Monthly withdrawal limit: $10,000 USD.{'\n'}
                  6.4. Limits may vary based on account verification level.{'\n'}
                  6.5. We reserve the right to modify limits at any time.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>7. DISPUTES & CANCELLATIONS</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  7.1. Withdrawals cannot be cancelled once processing begins.{'\n'}
                  7.2. Incorrect payment details may result in permanent loss.{'\n'}
                  7.3. Disputes must be submitted within 7 days of withdrawal.{'\n'}
                  7.4. Our decisions regarding withdrawals are final.{'\n'}
                </Text>
                
                <Text style={[styles.termsSection, { color: colors.text }]}>8. TERMINATION</Text>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  8.1. We may terminate withdrawal privileges for violations.{'\n'}
                  8.2. Fraudulent activity will result in permanent ban.{'\n'}
                  8.3. Remaining balance may be forfeited upon termination.{'\n'}
                </Text>
                
                <Text style={[styles.termsNote, { color: '#FF9800' }]}>
                  By proceeding with withdrawal, you acknowledge that you have read, understood, and agree to all terms and conditions above.
                </Text>
              </ScrollView>
              
              <TouchableOpacity 
                style={[styles.termsAcceptButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.termsAcceptText}>I Understand</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* History Modal */}
        <Modal
          visible={showHistoryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowHistoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Withdrawal History</Text>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowHistoryModal(false)}
                >
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.historyContainer}>
                {history.length > 0 ? (
                  history.map(renderHistoryItem)
                ) : (
                  <View style={styles.emptyHistory}>
                    <Icon name="history" size={50} color={colors.border} />
                    <Text style={[styles.emptyHistoryText, { color: colors.text }]}>
                      No withdrawal history yet
                    </Text>
                    <Text style={[styles.emptyHistorySubtext, { color: colors.textSecondary }]}>
                      Your withdrawal requests will appear here
                    </Text>
                  </View>
                )}
              </ScrollView>
              
              <TouchableOpacity 
                style={[styles.closeHistoryButton, { borderTopColor: colors.border }]}
                onPress={() => setShowHistoryModal(false)}
              >
                <Text style={[styles.closeHistoryText, { color: colors.primary }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Method Details Modal */}
        <Modal
          visible={showMethodDetails}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMethodDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.methodModalContainer, { backgroundColor: colors.card }]}>
              {renderMethodDetails()}
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.successOverlay}>
            <View style={[styles.successCard, { backgroundColor: colors.card }]}>
              <View style={styles.successIcon}>
                <Icon name="check-circle" size={80} color="#4CAF50" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Withdrawal Request Submitted!
              </Text>
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                Your withdrawal request for {formatCurrency(parseFloat(amount) || 0)} has been received.
              </Text>
              
              <View style={[styles.successDetails, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Gross Amount:</Text>
                  <Text style={[styles.successValue, { color: colors.text }]}>
                    {formatCurrency(parseFloat(amount) || 0)}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Processing Fee:</Text>
                  <Text style={[styles.successValue, { color: '#F44336' }]}>
                    -{formatCurrency(calculateFee())}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Government Tax (10%):</Text>
                  <Text style={[styles.successValue, { color: '#F44336' }]}>
                    -{formatCurrency(calculateTax())}
                  </Text>
                </View>
                <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.text }]}>Net Amount (USD):</Text>
                  <Text style={[styles.successValue, { color: '#4CAF50' }]}>
                    {formatCurrency(calculateNetAmount())}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.text }]}>Net Amount (NGN):</Text>
                  <Text style={[styles.successValue, { color: '#4CAF50' }]}>
                    {formatNaira(convertToNaira(calculateNetAmount()))}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Method:</Text>
                  <Text style={[styles.successValue, { color: colors.text }]}>
                    {selectedMethod === 'paypal' ? 'PayPal' :
                     selectedMethod === 'bank_transfer' ? 'Bank Transfer' :
                     selectedMethod === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Estimated Processing:</Text>
                  <Text style={[styles.successValue, { color: colors.text }]}>3-7 business days</Text>
                </View>
              </View>
              
              <Text style={[styles.successNote, { color: colors.textSecondary }]}>
                We'll notify you via email when your withdrawal is processed. Tax has been deducted and will be paid to the government.
              </Text>
              <TouchableOpacity 
                style={[styles.successButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.successButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal: Platform.OS === 'android' ? 20 : 20,
    //paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
    marginLeft: 20,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical:30
  },
  historyButton: {
    padding: 5,
    marginRight: 20,
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nairaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  nairaToggleText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  nairaConversion: {
    alignItems: 'center',
    marginBottom: 15,
  },
  nairaAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exchangeRate: {
    fontSize: 12,
    marginTop: 5,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    marginLeft: 5,
  },
  amountCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    padding: 0,
  },
  currencyText: {
    fontSize: 16,
    marginLeft: 10,
  },
  nairaEquivalent: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  nairaEquivalentText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  quickAmountButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  quickAmountSelected: {
    backgroundColor: '#0d64dd',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickAmountTextSelected: {
    color: '#fff',
  },
  previewCard: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  netAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nairaNetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  nairaNetLabel: {
    fontSize: 14,
  },
  nairaNetValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  previewNote: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  taxCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  taxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taxDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  taxInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
  },
  taxInfoText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 20,
  },
  methodsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodButton: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  methodSelected: {
    borderColor: '#0d64dd',
    backgroundColor: '#E3F2FD',
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  methodTime: {
    fontSize: 11,
    marginBottom: 3,
  },
  methodFee: {
    fontSize: 11,
    fontWeight: '500',
  },
  termsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  viewTermsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  viewTermsText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  consentsContainer: {
    marginTop: 10,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 20,
  },
  consentLink: {
    textDecorationLine: 'underline',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notesCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 5,
  },
  termsContent: {
    padding: 20,
    maxHeight: 500,
  },
  termsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  termsSection: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  termsNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  termsAcceptButton: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  termsAcceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 20,
    maxHeight: 500,
  },
  historyItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyMethodText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: 12,
    marginTop: 2,
  },
  historyNet: {
    alignItems: 'flex-end',
  },
  historyNetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyFeeText: {
    fontSize: 12,
    marginTop: 2,
  },
  rejectionReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  rejectionText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  closeHistoryButton: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  closeHistoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodModalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  methodDetailsCard: {
    paddingBottom: 30,
  },
  methodDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
  },
  methodNote: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  networkSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  networkOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  networkSelected: {
    backgroundColor: '#0d64dd',
  },
  networkText: {
    fontSize: 12,
  },
  cryptoSelector: {
    marginBottom: 15,
  },
  cryptoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cryptoSelected: {
    borderColor: '#0d64dd',
    backgroundColor: '#E3F2FD',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cryptoName: {
    fontSize: 12,
  },
  closeDetailsButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCard: {
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successDetails: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  successLabel: {
    fontSize: 14,
  },
  successValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  successDivider: {
    height: 1,
    marginVertical: 10,
  },
  successNote: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  successButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;