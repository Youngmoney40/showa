// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
//   StatusBar,
//   Keyboard,
//   Image,
//   Platform
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const DATA_BUNDLES = {
//   'MTN': [
//     { id: '1', name: 'Daily Plan', data: '50MB', validity: '1 day', price: '₦50' },
//     { id: '2', name: 'Weekly Plan', data: '500MB', validity: '7 days', price: '₦500' },
//     { id: '3', name: 'Monthly Plan', data: '3GB', validity: '30 days', price: '₦3,000' },
//   ],
//   'Airtel': [
//     { id: '1', name: 'Daily Plan', data: '100MB', validity: '1 day', price: '₦100' },
//     { id: '2', name: 'Weekly Plan', data: '1GB', validity: '7 days', price: '₦1,000' },
//     { id: '3', name: 'Monthly Plan', data: '5GB', validity: '30 days', price: '₦5,000' },
//   ],
//   'Glo': [
//     { id: '1', name: 'Daily Plan', data: '200MB', validity: '1 day', price: '₦200' },
//     { id: '2', name: 'Weekly Plan', data: '2GB', validity: '7 days', price: '₦1,500' },
//     { id: '3', name: 'Monthly Plan', data: '10GB', validity: '30 days', price: '₦8,000' },
//   ],
//   '9mobile': [
//     { id: '1', name: 'Daily Plan', data: '100MB', validity: '1 day', price: '₦100' },
//     { id: '2', name: 'Weekly Plan', data: '750MB', validity: '7 days', price: '₦750' },
//     { id: '3', name: 'Monthly Plan', data: '4GB', validity: '30 days', price: '₦4,000' },
//   ],
// };

// export default function DataTopUpScreen({navigation}) {
//   const [selectedNetwork, setSelectedNetwork] = useState('MTN');
//   const [phone, setPhone] = useState('');
//   const [selectedBundle, setSelectedBundle] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [walletBalance, setWalletBalance] = useState(12500);
  
//   const phoneInputRef = useRef(null);

//   // Quick actions data
//   const quickActions = [
//     { id: '1', icon: 'flash-on', title: 'Buy Data', color: '#007AFF' },
//     { id: '2', icon: 'call', title: 'Buy Airtime', color: '#34C759' },
//     { id: '3', icon: 'receipt', title: 'History', color: '#FF9500' },
//     { id: '4', icon: 'help', title: 'Support', color: '#FF3B30' },
//   ];

//   const handleQuickAction = (action) => {
//     switch (action) {
//       case 'Buy Airtime':
//         Alert.alert('Coming Soon', 'Airtime purchase feature will be available soon!');
//         break;
//       case 'History':
//         Alert.alert('Coming Soon', 'Transaction history will be available soon!');
//         break;
//       case 'Support':
//         Alert.alert('Support', 'Contact support@yourapp.com for assistance');
//         break;
//     }
//   };

//   const handlePurchase = async () => {
//     if (!phone || !validatePhoneNumber(phone)) {
//       Alert.alert('Invalid Phone', 'Please enter a valid phone number');
//       return;
//     }

//     if (!selectedBundle) {
//       Alert.alert('Select Bundle', 'Please choose a data bundle');
//       return;
//     }

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       Alert.alert(
//         '✅ Success!',
//         `You've purchased ${selectedBundle.data} for ${phone}.\n\nYou will receive a confirmation SMS shortly.`,
//         [
//           { 
//             text: 'OK', 
//             onPress: () => {
//               setSelectedBundle(null);
//               setPhone('');
//             }
//           }
//         ]
//       );
//     }, 1500);
//   };

//   const validatePhoneNumber = (number) => {
//     const cleaned = number.replace(/\D/g, '');
//     return cleaned.length === 11;
//   };

//   const formatPhoneNumber = (input) => {
//     const cleaned = input.replace(/\D/g, '');
//     if (cleaned.length <= 3) return cleaned;
//     if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
//     return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
//   };

//   const handlePhoneChange = (text) => {
//     const formatted = formatPhoneNumber(text);
//     setPhone(formatted);
//   };

//   const NetworkSelector = () => (
//     <View style={styles.networkSelector}>
//       {Object.keys(DATA_BUNDLES).map((network) => (
//         <TouchableOpacity
//           key={network}
//           style={[
//             styles.networkButton,
//             selectedNetwork === network && styles.networkButtonActive
//           ]}
//           onPress={() => {
//             setSelectedNetwork(network);
//             setSelectedBundle(null);
//           }}
//         >
//           <Text style={[
//             styles.networkText,
//             selectedNetwork === network && styles.networkTextActive
//           ]}>
//             {network}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const QuickActions = () => (
//     <View style={styles.quickActionsContainer}>
//       <Text style={styles.sectionTitle}>Quick Actions</Text>
//       <View style={styles.quickActionsGrid}>
//         {quickActions.map((action) => (
//           <TouchableOpacity
//             key={action.id}
//             style={styles.quickActionButton}
//             onPress={() => handleQuickAction(action.title)}
//           >
//             <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
//               <Icon name={action.icon} size={24} color={action.color} />
//             </View>
//             <Text style={styles.quickActionText}>{action.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//            <TouchableOpacity onPress={()=>navigation.goBack()}>
//              <Icon name='arrow-back' s size={30} color='black'/>
//            </TouchableOpacity>
//            <Text style={{ fontSize: 28, marginTop: 20, fontWeight: '800', }}>
//                 Running out of data?
//                 </Text>

//                 <Text style={styles.headerTitle}>
//                 Top up instantly on Showa
//                 </Text>

//                 <Text style={styles.headerSubtitle}>
//                 Stay connected and continue enjoying showa app
//                 </Text>

//         </View>
//         <TouchableOpacity 
//           style={styles.balanceBadge}
//           onPress={() => Alert.alert('Wallet', `Current balance: ₦${walletBalance.toLocaleString()}`)}
//         >
//           <Icon name="account-balance-wallet" size={16} color="#007AFF" />
        
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Quick Actions */}
//         <QuickActions />

//         {/* Network Selection */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Select Network</Text>
//           <NetworkSelector />
//         </View>

//         {/* Phone Input */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Phone Number</Text>
//           <View style={styles.phoneInputContainer}>
//             <Icon name="phone" size={20} color="#666" style={styles.phoneIcon} />
//             <TextInput
//               ref={phoneInputRef}
//               style={styles.phoneInput}
//               placeholder="Enter phone number"
//               placeholderTextColor="#999"
//               keyboardType="phone-pad"
//               value={phone}
//               onChangeText={handlePhoneChange}
//               maxLength={14}
//             />
//             {phone ? (
//               <TouchableOpacity onPress={() => setPhone('')}>
//                 <Icon name="close" size={20} color="#999" />
//               </TouchableOpacity>
//             ) : null}
//           </View>
//         </View>

//         {/* Data Bundles */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Available Bundles</Text>
//             <Text style={styles.networkIndicator}>{selectedNetwork}</Text>
//           </View>
          
//           <View style={styles.bundlesContainer}>
//             {DATA_BUNDLES[selectedNetwork]?.map((bundle) => (
//               <TouchableOpacity
//                 key={bundle.id}
//                 style={[
//                   styles.bundleCard,
//                   selectedBundle?.id === bundle.id && styles.bundleCardSelected
//                 ]}
//                 onPress={() => setSelectedBundle(bundle)}
//               >
//                 <View style={styles.bundleHeader}>
//                   <Text style={[
//                     styles.bundleData,
//                     selectedBundle?.id === bundle.id && styles.bundleDataSelected
//                   ]}>
//                     {bundle.data}
//                   </Text>
//                   {selectedBundle?.id === bundle.id && (
//                     <Icon name="check-circle" size={20} color="#007AFF" />
//                   )}
//                 </View>
//                 <Text style={[
//                   styles.bundleName,
//                   selectedBundle?.id === bundle.id && styles.bundleNameSelected
//                 ]}>
//                   {bundle.name}
//                 </Text>
//                 <Text style={[
//                   styles.bundleValidity,
//                   selectedBundle?.id === bundle.id && styles.bundleValiditySelected
//                 ]}>
//                   {bundle.validity}
//                 </Text>
//                 <View style={[
//                   styles.bundlePrice,
//                   selectedBundle?.id === bundle.id && styles.bundlePriceSelected
//                 ]}>
//                   <Text style={[
//                     styles.bundlePriceText,
//                     selectedBundle?.id === bundle.id && styles.bundlePriceTextSelected
//                   ]}>
//                     {bundle.price}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Info Card */}
//         <View style={styles.infoCard}>
//           <Icon name="info" size={20} color="#007AFF" />
//           <Text style={styles.infoText}>
//             Data is delivered instantly. You'll receive an SMS confirmation.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Purchase Button */}
//       <View style={styles.footer}>
//         {selectedBundle ? (
//           <View style={styles.orderSummary}>
//             <View>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//               <Text style={styles.summaryDetail}>
//                 {selectedBundle.data} • {selectedBundle.name}
//               </Text>
//             </View>
//             <Text style={styles.summaryPrice}>{selectedBundle.price}</Text>
//           </View>
//         ) : null}
        
//         <TouchableOpacity
//           style={[
//             styles.purchaseButton,
//             (!phone || !selectedBundle || isLoading) && styles.purchaseButtonDisabled
//           ]}
//           onPress={handlePurchase}
//           disabled={!phone || !selectedBundle || isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <>
//               <Icon name="check-circle" size={22} color="#FFFFFF" />
//               <Text style={styles.purchaseButtonText}>
//                 {selectedBundle ? `Buy ${selectedBundle.data}` : 'Select a Bundle'}
//               </Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerTitle: {
//     marginTop:5,
//     fontSize: 25,
//     fontWeight: '600',
//     color: '#000000',
//   },
//   headerSubtitle: {
//     marginTop:3,
//     fontSize: 15,
//     color: '#666666',
    
//   },
//   balanceBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F7FF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginLeft: 12,
//   },
//   balanceText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#007AFF',
//     marginLeft: 4,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000000',
//     marginBottom: 12,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   networkIndicator: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#007AFF',
//     backgroundColor: '#F0F7FF',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   quickActionsContainer: {
//     marginBottom: 24,
//   },
//   quickActionsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   quickActionButton: {
//     alignItems: 'center',
//     width: '23%',
//   },
//   quickActionIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   quickActionText: {
//     fontSize: 12,
//     color: '#333333',
//     textAlign: 'center',
//   },
//   networkSelector: {
//     flexDirection: 'row',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 4,
//   },
//   networkButton: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   networkButtonActive: {
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   networkText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666666',
//   },
//   networkTextActive: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   phoneInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//   },
//   phoneIcon: {
//     marginRight: 12,
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000000',
//     fontWeight: '500',
//   },
//   bundlesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -6,
//   },
//   bundleCard: {
//     width: '48%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: '1%',
//     marginBottom: 12,
//     borderWidth: 1.5,
//     borderColor: '#F0F0F0',
//   },
//   bundleCardSelected: {
//     borderColor: '#007AFF',
//     backgroundColor: '#F0F7FF',
//   },
//   bundleHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   bundleData: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#000000',
//   },
//   bundleDataSelected: {
//     color: '#007AFF',
//   },
//   bundleName: {
//     fontSize: 13,
//     color: '#666666',
//     marginBottom: 4,
//   },
//   bundleNameSelected: {
//     color: '#007AFF',
//   },
//   bundleValidity: {
//     fontSize: 12,
//     color: '#999999',
//     marginBottom: 12,
//   },
//   bundleValiditySelected: {
//     color: '#007AFF',
//   },
//   bundlePrice: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//     paddingVertical: 6,
//     alignItems: 'center',
//   },
//   bundlePriceSelected: {
//     backgroundColor: '#007AFF',
//   },
//   bundlePriceText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#007AFF',
//   },
//   bundlePriceTextSelected: {
//     color: '#FFFFFF',
//   },
//   infoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F7FF',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#007AFF',
//     marginLeft: 12,
//     lineHeight: 20,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingBottom: Platform.OS === 'ios' ? 34 : 12,
//   },
//   orderSummary: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   summaryTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000000',
//   },
//   summaryDetail: {
//     fontSize: 13,
//     color: '#666666',
//     marginTop: 2,
//   },
//   summaryPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#007AFF',
//   },
//   purchaseButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//   },
//   purchaseButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//   },
//   purchaseButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
// });
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Define a color palette
const COLORS = {
  primary: '#0066FF',
  primaryLight: '#E6F0FF',
  secondary: '#00C4B4',
  accent: '#FF6B6B',
  dark: '#1A1A2E',
  gray: '#8A8AA3',
  lightGray: '#F5F7FA',
  white: '#FFFFFF',
  success: '#00C851',
  warning: '#FFC107',
  shadow: 'rgba(0, 102, 255, 0.1)',
};

const DATA_BUNDLES = {
  'MTN': [
    { id: '1', name: 'Daily Plan', data: '50MB', validity: '1 day', price: '₦50', popular: false },
    { id: '2', name: 'Weekly Plan', data: '500MB', validity: '7 days', price: '₦500', popular: true },
    { id: '3', name: 'Monthly Plan', data: '3GB', validity: '30 days', price: '₦3,000', popular: false },
  ],
  'Airtel': [
    { id: '1', name: 'Daily Plan', data: '100MB', validity: '1 day', price: '₦100', popular: false },
    { id: '2', name: 'Weekly Plan', data: '1GB', validity: '7 days', price: '₦1,000', popular: true },
    { id: '3', name: 'Monthly Plan', data: '5GB', validity: '30 days', price: '₦5,000', popular: false },
  ],
  'Glo': [
    { id: '1', name: 'Daily Plan', data: '200MB', validity: '1 day', price: '₦200', popular: false },
    { id: '2', name: 'Weekly Plan', data: '2GB', validity: '7 days', price: '₦1,500', popular: true },
    { id: '3', name: 'Monthly Plan', data: '10GB', validity: '30 days', price: '₦8,000', popular: false },
  ],
  '9mobile': [
    { id: '1', name: 'Daily Plan', data: '100MB', validity: '1 day', price: '₦100', popular: false },
    { id: '2', name: 'Weekly Plan', data: '750MB', validity: '7 days', price: '₦750', popular: true },
    { id: '3', name: 'Monthly Plan', data: '4GB', validity: '30 days', price: '₦4,000', popular: false },
  ],
};

// Network logos/colors
const NETWORK_CONFIG = {
  'MTN': { color: '#FFC400', light: '#FFF9E6' },
  'Airtel': { color: '#E60000', light: '#FFE6E6' },
  'Glo': { color: '#00A859', light: '#E6F7EF' },
  '9mobile': { color: '#FF8C00', light: '#FFF2E6' },
};

export default function DataTopUpScreen({navigation}) {
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(12500);
  
  const phoneInputRef = useRef(null);

  const quickActions = [
    { id: '1', icon: 'flash-on', title: 'Buy Data', color: COLORS.primary },
    { id: '2', icon: 'call', title: 'Buy Airtime', color: COLORS.success },
    { id: '3', icon: 'history', title: 'History', color: COLORS.secondary },
    { id: '4', icon: 'support-agent', title: 'Support', color: COLORS.accent },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Buy Airtime':
        Alert.alert('Coming Soon', 'Airtime purchase feature will be available soon!');
        break;
      case 'History':
        Alert.alert('Coming Soon', 'Transaction history will be available soon!');
        break;
      case 'Support':
        Alert.alert('Support', 'Contact support@showa.com for assistance');
        break;
    }
  };

  const handlePurchase = async () => {
    if (!phone || !validatePhoneNumber(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    if (!selectedBundle) {
      Alert.alert('Select Bundle', 'Please choose a data bundle');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '🎉 Success!',
        `${selectedBundle.data} data bundle purchased successfully for ${phone}.\n\nConfirmation SMS will be sent shortly.`,
        [
          { 
            text: 'Great!', 
            onPress: () => {
              setSelectedBundle(null);
              setPhone('');
            }
          }
        ]
      );
    }, 1500);
  };

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 11;
  };

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const NetworkSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.networkScroll}
    >
      {Object.keys(DATA_BUNDLES).map((network) => (
        <TouchableOpacity
          key={network}
          style={[
            styles.networkButton,
            selectedNetwork === network && {
              backgroundColor: NETWORK_CONFIG[network].light,
              borderColor: NETWORK_CONFIG[network].color,
            }
          ]}
          onPress={() => {
            setSelectedNetwork(network);
            setSelectedBundle(null);
          }}
        >
          <View style={[
            styles.networkIcon,
            { backgroundColor: NETWORK_CONFIG[network].color }
          ]}>
            <Text style={styles.networkIconText}>{network.charAt(0)}</Text>
          </View>
          <Text style={[
            styles.networkText,
            selectedNetwork === network && { color: NETWORK_CONFIG[network].color, fontWeight: '700' }
          ]}>
            {network}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const QuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionButton}
            onPress={() => handleQuickAction(action.title)}
          >
            <LinearGradient
              colors={[`${action.color}15`, `${action.color}08`]}
              style={styles.quickActionIcon}
            >
              <Icon name={action.icon} size={22} color={action.color} />
            </LinearGradient>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.white]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name='arrow-back' size={24} color={COLORS.dark} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.walletButton}
              onPress={() => Alert.alert('Wallet Balance', `₦${walletBalance.toLocaleString()}`)}
            >
              <Icon name="account-balance-wallet" size={20} color={COLORS.primary} />
              <Text style={styles.walletText}>₦{walletBalance.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Stay Connected</Text>
            <Text style={styles.headerSubtitle}>
              Top up your data instantly and continue enjoying Showa
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        {/* <QuickActions /> */}

        {/* Phone Input Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Enter Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+234</Text>
            </View>
            <TextInput
              ref={phoneInputRef}
              style={styles.phoneInput}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.gray}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
              maxLength={14}
            />
            {phone ? (
              <TouchableOpacity 
                onPress={() => setPhone('')}
                style={styles.clearButton}
              >
                <Icon name="close" size={18} color={COLORS.gray} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Network Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Network Provider</Text>
          <NetworkSelector />
        </View>

        {/* Data Bundles */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Available Data Bundles</Text>
              <Text style={styles.sectionSubtitle}>
                {selectedNetwork} • Select your preferred plan
              </Text>
            </View>
            <View style={[
              styles.networkBadge,
              { backgroundColor: NETWORK_CONFIG[selectedNetwork].light }
            ]}>
              <Text style={[
                styles.networkBadgeText,
                { color: NETWORK_CONFIG[selectedNetwork].color }
              ]}>
                {selectedNetwork}
              </Text>
            </View>
          </View>
          
          <View style={styles.bundlesGrid}>
            {DATA_BUNDLES[selectedNetwork]?.map((bundle) => (
              <TouchableOpacity
                key={bundle.id}
                style={[
                  styles.bundleCard,
                  selectedBundle?.id === bundle.id && styles.bundleCardSelected
                ]}
                onPress={() => setSelectedBundle(bundle)}
              >
                {bundle.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.bundleHeader}>
                  <Text style={[
                    styles.bundleData,
                    selectedBundle?.id === bundle.id && styles.bundleDataSelected
                  ]}>
                    {bundle.data}
                  </Text>
                  {selectedBundle?.id === bundle.id && (
                    <View style={styles.checkCircle}>
                      <Icon name="check" size={16} color={COLORS.white} />
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.bundleName,
                  selectedBundle?.id === bundle.id && styles.bundleNameSelected
                ]}>
                  {bundle.name}
                </Text>
                
                <Text style={[
                  styles.bundleValidity,
                  selectedBundle?.id === bundle.id && styles.bundleValiditySelected
                ]}>
                  ⏱ {bundle.validity}
                </Text>
                
                <LinearGradient
                  colors={selectedBundle?.id === bundle.id ? 
                    [COLORS.primary, '#0077E6'] : 
                    [`${COLORS.primary}08`, `${COLORS.primary}04`]
                  }
                  style={styles.bundlePrice}
                >
                  <Text style={[
                    styles.bundlePriceText,
                    selectedBundle?.id === bundle.id && styles.bundlePriceTextSelected
                  ]}>
                    {bundle.price}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Data is delivered instantly within 2 minutes. You'll receive an SMS confirmation.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        {selectedBundle && (
          <LinearGradient
            colors={[`${COLORS.primary}08`, `${COLORS.primary}04`]}
            style={styles.orderSummary}
          >
            <View>
              <Text style={styles.summaryLabel}>Order Summary</Text>
              <Text style={styles.summaryDetail}>
                {selectedBundle.data} • {selectedBundle.name} • {selectedBundle.validity}
              </Text>
            </View>
            <View style={styles.priceContaiser}>
              <Text style={styles.summaryPrice}>{selectedBundle.price}</Text>
              <Text style={[styles.summaryDiscount,{marginRight:10}]}>No extra fees</Text>
            </View>
          </LinearGradient>
        )}
        
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            (!phone || !selectedBundle || isLoading) && styles.purchaseButtonDisabled
          ]}
          onPress={handlePurchase}
          disabled={!phone || !selectedBundle || isLoading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={(!phone || !selectedBundle || isLoading) ? 
              [COLORS.gray, COLORS.gray] : 
              [COLORS.primary, '#0077E6']
            }
            style={styles.purchaseButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Icon name="check-circle" size={22} color={COLORS.white} />
                <Text style={styles.purchaseButtonText}>
                  {selectedBundle ? 
                    `Buy ${selectedBundle.data} Bundle` : 
                    'Select a Data Bundle'
                  }
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  headerContent: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.dark,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
    lineHeight: 22,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: -4,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  quickActionsContainer: {
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.dark,
    textAlign: 'center',
  },
  networkScroll: {
    marginHorizontal: -4,
  },
  networkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  networkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  networkIconText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
  },
  networkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  networkBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: `${COLORS.primary}10`,
    borderRightWidth: 1,
    borderRightColor: '#E8E8E8',
  },
  phonePrefixText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  clearButton: {
    paddingHorizontal: 16,
  },
  bundlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  bundleCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  bundleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  popularText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bundleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bundleData: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.dark,
  },
  bundleDataSelected: {
    color: COLORS.primary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bundleName: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  bundleNameSelected: {
    color: COLORS.primary,
  },
  bundleValidity: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 16,
  },
  bundleValiditySelected: {
    color: COLORS.primary,
  },
  bundlePrice: {
    borderRadius: 8,
    paddingVertical: 0,
    alignItems: 'center',
  },
  bundlePriceText: {
    padding:10,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bundlePriceTextSelected: {
    color: COLORS.white,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  summaryDetail: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryDiscount: {
    fontSize: 11,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: '500',
  },
  purchaseButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 10,
    padding:15,
  },
});