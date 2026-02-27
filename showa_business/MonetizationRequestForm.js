// // import React, { useState } from 'react';
// // import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,ActivityIndicator, Image, StatusBar, Dimensions, Alert } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Feather from 'react-native-vector-icons/Feather';
// // import { SafeAreaView } from 'react-native-safe-area-context';



// // const MonetizationRequest = ({ navigation }) => {
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     email: '',
// //     phone: '',
// //     channelName: '',
// //     category: '',
// //     bio: '',
// //     website: '',
// //     taxInfo: '',
// //     paymentMethod: 'Paystack',
// //     contentType: 'Videos',
// //     audienceAge: '18-34',
// //     uploadFrequency: '3-5 per week',
// //     agreeTerms: false
// //   });

// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (field, value) => {
// //     setFormData({ ...formData, [field]: value });
// //   };

// //   const handleSubmit = () => {
// //     setLoading(true);
// //     setTimeout(() => {
// //       setLoading(false);
// //       Alert.alert(
// //         'Application Submitted',
// //         'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
// //         [
// //           // { text: 'OK', onPress: () => navigation.replace('CreatorDashboard') }
// //           { text: 'OK', onPress: () => navigation.replace('BusinessHome') }
// //         ]
// //       );
// //     }, 2000);
// //   };

// //   const nextStep = () => {
// //     if (currentStep < 4) {
// //       setCurrentStep(currentStep + 1);
// //     }
// //   };

// //   const prevStep = () => {
// //     if (currentStep > 1) {
// //       setCurrentStep(currentStep - 1);
// //     }
// //   };

// //   const renderStepIndicator = () => {
// //     return (
// //       <View style={styles.stepContainer}>
// //         {[1, 2, 3, 4].map((step) => (
// //           <React.Fragment key={step}>
// //             <View style={[styles.step, currentStep === step && styles.activeStep]}>
// //               <Text style={[styles.stepText, currentStep === step && styles.activeStepText]}>{step}</Text>
// //             </View>
// //             {step < 4 && <View style={[styles.stepLine, currentStep > step && styles.activeStepLine]} />}
// //           </React.Fragment>
// //         ))}
// //       </View>
// //     );
// //   };

// //   const renderStepOne = () => (
// //     <View style={styles.formSection}>
// //       <Text style={styles.sectionTitle}>Basic Information</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Full Name</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Micheal Adabayo"
// //           placeholderTextColor='#555'
// //           value={formData.fullName}
// //           onChangeText={(text) => handleChange('fullName', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Email Address</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="mike@gmail.com"
// //           keyboardType="email-address"
// //           placeholderTextColor='#555'
// //           value={formData.email}
// //           onChangeText={(text) => handleChange('email', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Phone Number</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="+234 456 7890"
// //           keyboardType="phone-pad"
// //           placeholderTextColor='#555'
// //           value={formData.phone}
// //           onChangeText={(text) => handleChange('phone', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Account Name</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="My Awesome Account"
// //           placeholderTextColor='#555'
// //           value={formData.channelName}
// //           onChangeText={(text) => handleChange('channelName', text)}
// //         />
// //       </View>
// //     </View>
// //   );

// //   const renderStepTwo = () => (
// //     <View style={styles.formSection}>
// //       <Text style={styles.sectionTitle}>Content Details</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Content Category</Text>
// //         <View style={styles.selectInput}>
// //           <Text style={styles.selectText}>{formData.category || 'Select category bellow'}</Text>
          
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Primary Content Type</Text>
// //         <View style={styles.radioGroup}>
// //           {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
// //             <TouchableOpacity 
// //               key={type} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('contentType', type)}
// //             >
// //               <View style={styles.radioCircle}>
// //                 {formData.contentType === type && <View style={styles.radioChecked} />}
// //               </View>
// //               <Text style={styles.radioLabel}>{type}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Primary Audience Age</Text>
// //         <View style={styles.radioGroup}>
// //           {['13-17', '18-34', '35-54', '55+'].map((age) => (
// //             <TouchableOpacity 
// //               key={age} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('audienceAge', age)}
// //             >
// //               <View style={styles.radioCircle}>
// //                 {formData.audienceAge === age && <View style={styles.radioChecked} />}
// //               </View>
// //               <Text style={styles.radioLabel}>{age}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Upload Frequency</Text>
// //         <View style={styles.radioGroup}>
// //           {['Daily', '3-5 per week', '1-2 per week', 'Less than weekly'].map((freq) => (
// //             <TouchableOpacity 
// //               key={freq} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('uploadFrequency', freq)}
// //             >
// //               <View style={styles.radioCircle}>
// //                 {formData.uploadFrequency === freq && <View style={styles.radioChecked} />}
// //               </View>
// //               <Text style={styles.radioLabel}>{freq}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Channel Bio</Text>
// //         <TextInput
// //           style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
// //           placeholder="Tell us about your content..."
// //           multiline
// //           value={formData.bio}
// //           onChangeText={(text) => handleChange('bio', text)}
// //         />
// //       </View>
// //     </View>
// //   );

// //   const renderStepThree = () => (
// //     <View style={styles.formSection}>
// //       <Text style={styles.sectionTitle}>Monetization Preferences</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Preferred Payment Method</Text>
// //         <View style={styles.selectInput}>
// //           <Text style={styles.selectText}>{formData.paymentMethod}</Text>
// //           <Icon name="keyboard-arrow-down" size={24} color="#666" />
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Tax Information (SSN/EIN)</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Required for payment processing"
// //           value={formData.taxInfo}
// //           onChangeText={(text) => handleChange('taxInfo', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Website/Portfolio (Optional)</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="https://example.com"
// //           keyboardType="url"
// //           value={formData.website}
// //           onChangeText={(text) => handleChange('website', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={styles.label}>Monetization Options</Text>
// //         <View style={styles.checkboxContainer}>
// //           <TouchableOpacity 
// //             style={styles.checkbox}
// //             onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
// //           >
// //             {formData.agreeTerms ? (
// //               <Icon name="check-box" size={24} color="#0d64dd" />
// //             ) : (
// //               <Icon name="check-box-outline-blank" size={24} color="#666" />
// //             )}
// //           </TouchableOpacity>
// //           <Text style={styles.checkboxLabel}>
// //             I agree to the Terms of Service and confirm that all content is original and complies with community guidelines
// //           </Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderStepFour = () => (
// //     <View style={styles.formSection}>
// //       <View style={styles.summaryHeader}>
// //         <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
// //         <Text style={styles.summaryTitle}>Review Your Information</Text>
// //         <Text style={styles.summarySubtitle}>Please verify all details before submitting your application</Text>
// //       </View>

// //       <View style={styles.summaryCard}>
// //         <Text style={styles.summaryCardTitle}>Basic Information</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Full Name:</Text>
// //           <Text style={styles.summaryValue}>{formData.fullName || 'Not provided'}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Email:</Text>
// //           <Text style={styles.summaryValue}>{formData.email || 'Not provided'}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Channel Name:</Text>
// //           <Text style={styles.summaryValue}>{formData.channelName || 'Not provided'}</Text>
// //         </View>
// //       </View>

// //       <View style={styles.summaryCard}>
// //         <Text style={styles.summaryCardTitle}>Content Details</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Content Type:</Text>
// //           <Text style={styles.summaryValue}>{formData.contentType}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Primary Audience:</Text>
// //           <Text style={styles.summaryValue}>{formData.audienceAge}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Upload Frequency:</Text>
// //           <Text style={styles.summaryValue}>{formData.uploadFrequency}</Text>
// //         </View>
// //       </View>

// //       <View style={styles.summaryCard}>
// //         <Text style={styles.summaryCardTitle}>Payment Information</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Payment Method:</Text>
// //           <Text style={styles.summaryValue}>{formData.paymentMethod}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={styles.summaryLabel}>Tax Info Provided:</Text>
// //           <Text style={styles.summaryValue}>{formData.taxInfo ? 'Yes' : 'No'}</Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={{flex:1}}>
// //     <View style={styles.container}>
// //             <StatusBar backgroundColor='#fff' barStyle='dark-content' />
// //           <ScrollView contentContainerStyle={styles.scrollContainer}>
// //             <View style={styles.header}>
// //               <TouchableOpacity onPress={() => navigation.goBack()}>
// //                 <Icon name="arrow-back" size={24} color="#4267B2" />
// //               </TouchableOpacity>
// //               <Text style={styles.headerTitle}>Monetization Request</Text>
// //               <View style={{ width: 24 }} />
// //             </View>

// //             {renderStepIndicator()}

// //             {currentStep === 1 && renderStepOne()}
// //             {currentStep === 2 && renderStepTwo()}
// //             {currentStep === 3 && renderStepThree()}
// //             {currentStep === 4 && renderStepFour()}
// //           </ScrollView>

// //           <View style={styles.footer}>
// //             {currentStep > 1 && (
// //               <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
// //                 <Text style={styles.secondaryButtonText}>Back</Text>
// //               </TouchableOpacity>
// //             )}
            
// //             {currentStep < 4 ? (
// //               <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
// //                 <Text style={styles.primaryButtonText}>Continue</Text>
// //                 <Feather name="arrow-right" size={20} color="#fff" />
// //               </TouchableOpacity>
// //             ) : (
// //               <TouchableOpacity 
// //                 style={[styles.primaryButton, loading && styles.loadingButton]} 
// //                 onPress={handleSubmit}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <ActivityIndicator color="#fff" />
// //                 ) : (
// //                   <>
// //                     <Text style={styles.primaryButtonText}>Submit Application</Text>
// //                     <Icon name="send" size={20} color="#fff" />
// //                   </>
// //                 )}
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //     </SafeAreaView>
   
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   scrollContainer: {
// //     paddingBottom: 80,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 20,
// //     paddingTop: 10,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eaeaea',
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#333',
// //     fontFamily:'Lato-Bold',
// //   },
// //   stepContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 20,
// //     backgroundColor: '#fff',
// //     marginBottom: 10,
// //   },
// //   step: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: '#eaeaea',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   activeStep: {
// //     backgroundColor: '#0d64dd',
// //   },
// //   stepText: {
// //     color: '#666',
// //     fontWeight: 'bold',
// //   },
// //   activeStepText: {
// //     color: '#fff',
// //   },
// //   stepLine: {
// //     width: 50,
// //     height: 2,
// //     backgroundColor: '#eaeaea',
// //   },
// //   activeStepLine: {
// //     backgroundColor: '#0d64dd',
// //   },
// //   formSection: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 20,
// //     marginHorizontal: 20,
// //     marginBottom: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 14,
// //     color: '#555',
// //     marginBottom: 8,
// //     fontWeight: '500',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     color:'#777',
// //     padding: 12,
// //     fontSize: 16,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   selectInput: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     padding: 12,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   selectText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   radioGroup: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginTop: 5,
// //   },
// //   radioOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 20,
// //     marginBottom: 10,
// //   },
// //   radioCircle: {
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#666',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 8,
// //   },
// //   radioChecked: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: '#0d64dd',
// //   },
// //   radioLabel: {
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   checkboxContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginTop: 10,
// //   },
// //   checkbox: {
// //     marginRight: 10,
// //   },
// //   checkboxLabel: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: '#555',
// //     lineHeight: 20,
// //   },
// //   summaryHeader: {
// //     alignItems: 'center',
// //     marginBottom: 25,
// //   },
// //   summaryTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginTop: 10,
// //     marginBottom: 5,
// //   },
// //   summarySubtitle: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   summaryCard: {
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 8,
// //     padding: 15,
// //     marginBottom: 15,
// //   },
// //   summaryCardTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#0d64dd',
// //     marginBottom: 10,
// //   },
// //   summaryItem: {
// //     flexDirection: 'row',
// //     marginBottom: 8,
// //   },
// //   summaryLabel: {
// //     width: 120,
// //     fontSize: 14,
// //     color: '#666',
// //     fontWeight: '500',
// //   },
// //   summaryValue: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   footer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     padding: 20,
// //     backgroundColor: '#fff',
// //     borderTopWidth: 1,
// //     borderTopColor: '#eaeaea',
// //   },
// //   primaryButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#0d64dd',
// //     borderRadius: 8,
// //     padding: 15,
// //     marginLeft: 10,
// //   },
// //   loadingButton: {
// //     opacity: 0.8,
// //   },
// //   primaryButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginRight: 10,
// //   },
// //   secondaryButton: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f2f5',
// //     borderRadius: 8,
// //     padding: 15,
// //     marginRight: 10,
// //   },
// //   secondaryButtonText: {
// //     color: '#333',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default MonetizationRequest;

// // import React, { useState } from 'react';
// // import { 
// //   View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
// //   ActivityIndicator, Image, StatusBar, Dimensions, Alert 
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Feather from 'react-native-vector-icons/Feather';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useTheme } from '../src/context/ThemeContext'; 
// // const MonetizationRequest = ({ navigation }) => {
// //   const { colors, isDark } = useTheme(); 
  
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     email: '',
// //     phone: '',
// //     channelName: '',
// //     category: '',
// //     bio: '',
// //     website: '',
// //     taxInfo: '',
// //     paymentMethod: 'Paystack',
// //     contentType: 'Videos',
// //     audienceAge: '18-34',
// //     uploadFrequency: '3-5 per week',
// //     agreeTerms: false
// //   });

// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (field, value) => {
// //     setFormData({ ...formData, [field]: value });
// //   };

// //   const handleSubmit = () => {
// //     setLoading(true);
// //     setTimeout(() => {
// //       setLoading(false);
// //       Alert.alert(
// //         'Application Submitted',
// //         'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
// //         [
// //           { text: 'OK', onPress: () => navigation.replace('BusinessHome') }
// //         ]
// //       );
// //     }, 2000);
// //   };

// //   const nextStep = () => {
// //     if (currentStep < 4) {
// //       setCurrentStep(currentStep + 1);
// //     }
// //   };

// //   const prevStep = () => {
// //     if (currentStep > 1) {
// //       setCurrentStep(currentStep - 1);
// //     }
// //   };

// //   const renderStepIndicator = () => {
// //     return (
// //       <View style={styles.stepContainer}>
// //         {[1, 2, 3, 4].map((step) => (
// //           <React.Fragment key={step}>
// //             <View style={[
// //               styles.step, 
// //               { 
// //                 backgroundColor: currentStep === step ? colors.primary : colors.backgroundSecondary 
// //               }
// //             ]}>
// //               <Text style={[
// //                 styles.stepText, 
// //                 { 
// //                   color: currentStep === step ? '#fff' : colors.textSecondary 
// //                 }
// //               ]}>{step}</Text>
// //             </View>
// //             {step < 4 && (
// //               <View style={[
// //                 styles.stepLine, 
// //                 { 
// //                   backgroundColor: currentStep > step ? colors.primary : colors.backgroundSecondary 
// //                 }
// //               ]} />
// //             )}
// //           </React.Fragment>
// //         ))}
// //       </View>
// //     );
// //   };

// //   const renderStepOne = () => (
// //     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
// //       <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="Micheal Adabayo"
// //           placeholderTextColor={colors.textSecondary}
// //           value={formData.fullName}
// //           onChangeText={(text) => handleChange('fullName', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="mike@gmail.com"
// //           keyboardType="email-address"
// //           placeholderTextColor={colors.textSecondary}
// //           value={formData.email}
// //           onChangeText={(text) => handleChange('email', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="+234 456 7890"
// //           keyboardType="phone-pad"
// //           placeholderTextColor={colors.textSecondary}
// //           value={formData.phone}
// //           onChangeText={(text) => handleChange('phone', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Account Name</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="My Awesome Account"
// //           placeholderTextColor={colors.textSecondary}
// //           value={formData.channelName}
// //           onChangeText={(text) => handleChange('channelName', text)}
// //         />
// //       </View>
// //     </View>
// //   );

// //   const renderStepTwo = () => (
// //     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
// //       <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Details</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Content Category</Text>
// //         <View style={[styles.selectInput, { 
// //           borderColor: colors.border,
// //           backgroundColor: colors.backgroundSecondary
// //         }]}>
// //           <Text style={[styles.selectText, { color: formData.category ? colors.text : colors.textSecondary }]}>
// //             {formData.category || 'Select category below'}
// //           </Text>
// //           <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Content Type</Text>
// //         <View style={styles.radioGroup}>
// //           {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
// //             <TouchableOpacity 
// //               key={type} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('contentType', type)}
// //             >
// //               <View style={[
// //                 styles.radioCircle, 
// //                 { borderColor: colors.textSecondary }
// //               ]}>
// //                 {formData.contentType === type && <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />}
// //               </View>
// //               <Text style={[styles.radioLabel, { color: colors.text }]}>{type}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Audience Age</Text>
// //         <View style={styles.radioGroup}>
// //           {['13-17', '18-34', '35-54', '55+'].map((age) => (
// //             <TouchableOpacity 
// //               key={age} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('audienceAge', age)}
// //             >
// //               <View style={[
// //                 styles.radioCircle, 
// //                 { borderColor: colors.textSecondary }
// //               ]}>
// //                 {formData.audienceAge === age && <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />}
// //               </View>
// //               <Text style={[styles.radioLabel, { color: colors.text }]}>{age}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Upload Frequency</Text>
// //         <View style={styles.radioGroup}>
// //           {['Daily', '3-5 per week', '1-2 per week', 'Less than weekly'].map((freq) => (
// //             <TouchableOpacity 
// //               key={freq} 
// //               style={styles.radioOption}
// //               onPress={() => handleChange('uploadFrequency', freq)}
// //             >
// //               <View style={[
// //                 styles.radioCircle, 
// //                 { borderColor: colors.textSecondary }
// //               ]}>
// //                 {formData.uploadFrequency === freq && <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />}
// //               </View>
// //               <Text style={[styles.radioLabel, { color: colors.text }]}>{freq}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Channel Bio</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             height: 100, 
// //             textAlignVertical: 'top',
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="Tell us about your content..."
// //           placeholderTextColor={colors.textSecondary}
// //           multiline
// //           value={formData.bio}
// //           onChangeText={(text) => handleChange('bio', text)}
// //         />
// //       </View>
// //     </View>
// //   );

// //   const renderStepThree = () => (
// //     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
// //       <Text style={[styles.sectionTitle, { color: colors.text }]}>Monetization Preferences</Text>
      
// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Preferred Payment Method</Text>
// //         <View style={[styles.selectInput, { 
// //           borderColor: colors.border,
// //           backgroundColor: colors.backgroundSecondary
// //         }]}>
// //           <Text style={[styles.selectText, { color: colors.text }]}>{formData.paymentMethod}</Text>
// //           <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
// //         </View>
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Tax Information (SSN/EIN)</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="Required for payment processing"
// //           placeholderTextColor={colors.textSecondary}
// //           value={formData.taxInfo}
// //           onChangeText={(text) => handleChange('taxInfo', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Website/Portfolio (Optional)</Text>
// //         <TextInput
// //           style={[styles.input, { 
// //             borderColor: colors.border,
// //             backgroundColor: colors.backgroundSecondary,
// //             color: colors.text
// //           }]}
// //           placeholder="https://example.com"
// //           placeholderTextColor={colors.textSecondary}
// //           keyboardType="url"
// //           value={formData.website}
// //           onChangeText={(text) => handleChange('website', text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text style={[styles.label, { color: colors.textSecondary }]}>Monetization Options</Text>
// //         <View style={styles.checkboxContainer}>
// //           <TouchableOpacity 
// //             style={styles.checkbox}
// //             onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
// //           >
// //             {formData.agreeTerms ? (
// //               <Icon name="check-box" size={24} color={colors.primary} />
// //             ) : (
// //               <Icon name="check-box-outline-blank" size={24} color={colors.textSecondary} />
// //             )}
// //           </TouchableOpacity>
// //           <Text style={[styles.checkboxLabel, { color: colors.text }]}>
// //             I agree to the Terms of Service and confirm that all content is original and complies with community guidelines
// //           </Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderStepFour = () => (
// //     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
// //       <View style={styles.summaryHeader}>
// //         <Ionicons name="checkmark-circle" size={60} color={colors.success || '#4CAF50'} />
// //         <Text style={[styles.summaryTitle, { color: colors.text }]}>Review Your Information</Text>
// //         <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
// //           Please verify all details before submitting your application
// //         </Text>
// //       </View>

// //       <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
// //         <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Basic Information</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Full Name:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.fullName || 'Not provided'}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Email:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.email || 'Not provided'}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Channel Name:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.channelName || 'Not provided'}</Text>
// //         </View>
// //       </View>

// //       <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
// //         <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Content Details</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Content Type:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.contentType}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Primary Audience:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.audienceAge}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Upload Frequency:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.uploadFrequency}</Text>
// //         </View>
// //       </View>

// //       <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
// //         <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Payment Information</Text>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Payment Method:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.paymentMethod}</Text>
// //         </View>
// //         <View style={styles.summaryItem}>
// //           <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax Info Provided:</Text>
// //           <Text style={[styles.summaryValue, { color: colors.text }]}>{formData.taxInfo ? 'Yes' : 'No'}</Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
// //       <View style={[styles.container, { backgroundColor: colors.background }]}>
// //         <StatusBar 
// //           backgroundColor={colors.card} 
// //           barStyle={isDark ? "light-content" : "dark-content"} 
// //         />
// //         <ScrollView contentContainerStyle={styles.scrollContainer}>
// //           <View style={[styles.header, { 
// //             backgroundColor: colors.card,
// //             borderBottomColor: colors.border
// //           }]}>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //               <Icon name="arrow-back" size={24} color={colors.primary} />
// //             </TouchableOpacity>
// //             <Text style={[styles.headerTitle, { color: colors.text }]}>Monetization Request</Text>
// //             <View style={{ width: 24 }} />
// //           </View>

// //           <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
// //             {renderStepIndicator()}
// //           </View>

// //           {currentStep === 1 && renderStepOne()}
// //           {currentStep === 2 && renderStepTwo()}
// //           {currentStep === 3 && renderStepThree()}
// //           {currentStep === 4 && renderStepFour()}
// //         </ScrollView>

// //         <View style={[styles.footer, { 
// //           backgroundColor: colors.card,
// //           borderTopColor: colors.border
// //         }]}>
// //           {currentStep > 1 && (
// //             <TouchableOpacity 
// //               style={[styles.secondaryButton, { 
// //                 backgroundColor: colors.backgroundSecondary 
// //               }]} 
// //               onPress={prevStep}
// //             >
// //               <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Back</Text>
// //             </TouchableOpacity>
// //           )}
          
// //           {currentStep < 4 ? (
// //             <TouchableOpacity 
// //               style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
// //               onPress={nextStep}
// //             >
// //               <Text style={styles.primaryButtonText}>Continue</Text>
// //               <Feather name="arrow-right" size={20} color="#fff" />
// //             </TouchableOpacity>
// //           ) : (
// //             <TouchableOpacity 
// //               style={[
// //                 styles.primaryButton, 
// //                 { backgroundColor: colors.primary },
// //                 loading && styles.loadingButton
// //               ]} 
// //               onPress={handleSubmit}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <>
// //                   <Text style={styles.primaryButtonText}>Submit Application</Text>
// //                   <Icon name="send" size={20} color="#fff" />
// //                 </>
// //               )}
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   scrollContainer: {
// //     paddingBottom: 80,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 20,
// //     paddingTop: 10,
// //     borderBottomWidth: 1,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     fontFamily: 'Lato-Bold',
// //   },
// //   stepContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 20,
// //     marginBottom: 10,
// //   },
// //   step: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   stepText: {
// //     fontWeight: 'bold',
// //   },
// //   stepLine: {
// //     width: 50,
// //     height: 2,
// //   },
// //   formSection: {
// //     borderRadius: 10,
// //     padding: 20,
// //     marginHorizontal: 20,
// //     marginBottom: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 14,
// //     marginBottom: 8,
// //     fontWeight: '500',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 16,
// //   },
// //   selectInput: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     borderWidth: 1,
// //     borderRadius: 8,
// //     padding: 12,
// //   },
// //   selectText: {
// //     fontSize: 16,
// //   },
// //   radioGroup: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginTop: 5,
// //   },
// //   radioOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 20,
// //     marginBottom: 10,
// //   },
// //   radioCircle: {
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 8,
// //   },
// //   radioChecked: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //   },
// //   radioLabel: {
// //     fontSize: 14,
// //   },
// //   checkboxContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginTop: 10,
// //   },
// //   checkbox: {
// //     marginRight: 10,
// //   },
// //   checkboxLabel: {
// //     flex: 1,
// //     fontSize: 14,
// //     lineHeight: 20,
// //   },
// //   summaryHeader: {
// //     alignItems: 'center',
// //     marginBottom: 25,
// //   },
// //   summaryTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //     marginBottom: 5,
// //   },
// //   summarySubtitle: {
// //     fontSize: 14,
// //     textAlign: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   summaryCard: {
// //     borderRadius: 8,
// //     padding: 15,
// //     marginBottom: 15,
// //   },
// //   summaryCardTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //   },
// //   summaryItem: {
// //     flexDirection: 'row',
// //     marginBottom: 8,
// //   },
// //   summaryLabel: {
// //     width: 120,
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   summaryValue: {
// //     flex: 1,
// //     fontSize: 14,
// //   },
// //   footer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     padding: 20,
// //     borderTopWidth: 1,
// //   },
// //   primaryButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 8,
// //     padding: 15,
// //     marginLeft: 10,
// //   },
// //   loadingButton: {
// //     opacity: 0.8,
// //   },
// //   primaryButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginRight: 10,
// //   },
// //   secondaryButton: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 8,
// //     padding: 15,
// //     marginRight: 10,
// //   },
// //   secondaryButtonText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default MonetizationRequest;
// import React, { useState } from 'react';
// import { 
//   View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
//   ActivityIndicator, Image, StatusBar, Dimensions, Alert, KeyboardAvoidingView, Platform 
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { width } = Dimensions.get('window');

// const MonetizationRequest = ({ navigation }) => {
//   const { colors, isDark } = useTheme(); 
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     channelName: '',
//     category: '',
//     bio: '',
//     website: '',
//     taxInfo: '',
//     paymentMethod: 'Paystack',
//     contentType: 'Videos',
//     audienceAge: '18-34',
//     uploadFrequency: '3-5 per week',
//     agreeTerms: false
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Required fields for each step
//   const step1RequiredFields = ['fullName', 'email', 'phone', 'channelName'];
//   const step2RequiredFields = ['category', 'bio'];
//   const step3RequiredFields = ['taxInfo'];

//   const validateField = (field, value) => {
//     if (step1RequiredFields.includes(field) || 
//         step2RequiredFields.includes(field) || 
//         step3RequiredFields.includes(field)) {
      
//       if (!value || value.trim() === '') {
//         return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
//       }
      
//       // Email validation
//       if (field === 'email' && value) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//           return 'Please enter a valid email address';
//         }
//       }
      
//       // Phone validation
//       if (field === 'phone' && value) {
//         const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
//         if (!phoneRegex.test(value.replace(/\s/g, ''))) {
//           return 'Please enter a valid phone number';
//         }
//       }
//     }
//     return '';
//   };

//   const validateStep = (step) => {
//     const requiredFields = step === 1 ? step1RequiredFields :
//                           step === 2 ? step2RequiredFields :
//                           step === 3 ? step3RequiredFields : [];
    
//     const newErrors = {};
//     let isValid = true;

//     requiredFields.forEach(field => {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         newErrors[field] = error;
//         isValid = false;
//       }
//     });

//     // Additional validation for step 3: agreeTerms
//     if (step === 3 && !formData.agreeTerms) {
//       newErrors.agreeTerms = 'You must agree to the terms and conditions';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
    
//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: '' });
//     }
    
//     // Mark field as touched
//     setTouched({ ...touched, [field]: true });
//   };

//   const handleBlur = (field) => {
//     setTouched({ ...touched, [field]: true });
//     const error = validateField(field, formData[field]);
//     if (error) {
//       setErrors({ ...errors, [field]: error });
//     }
//   };

//   const handleSubmit = () => {
//     // Validate all steps before final submission
//     const step1Valid = validateStep(1);
//     const step2Valid = validateStep(2);
//     const step3Valid = validateStep(3);
    
//     if (!step1Valid || !step2Valid || !step3Valid) {
//       Alert.alert(
//         'Incomplete Information',
//         'Please fill in all required fields correctly before submitting.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       Alert.alert(
//         'Application Submitted',
//         'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
//         [
//           { text: 'OK', onPress: () => navigation.replace('BusinessHome') }
//         ]
//       );
//     }, 2000);
//   };

//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(currentStep + 1);
//       setErrors({}); // Clear errors when moving to next step
//     } else {
//       // Scroll to first error
//       Alert.alert(
//         'Required Fields',
//         'Please fill in all required fields before proceeding.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       setErrors({}); // Clear errors when going back
//     }
//   };

//   const renderStepIndicator = () => {
//     return (
//       <View style={styles.stepContainer}>
//         {[1, 2, 3, 4].map((step) => (
//           <React.Fragment key={step}>
//             <TouchableOpacity 
//               style={[
//                 styles.step, 
//                 { 
//                   backgroundColor: currentStep === step ? colors.primary : 
//                                  currentStep > step ? colors.success || '#4CAF50' : colors.backgroundSecondary 
//                 }
//               ]}
//               onPress={() => {
//                 if (step < currentStep) {
//                   setCurrentStep(step);
//                 }
//               }}
//               disabled={step > currentStep}
//             >
//               <Text style={[
//                 styles.stepText, 
//                 { 
//                   color: currentStep >= step ? '#fff' : colors.textSecondary 
//                 }
//               ]}>
//                 {currentStep > step ? '✓' : step}
//               </Text>
//             </TouchableOpacity>
//             {step < 4 && (
//               <View style={[
//                 styles.stepLine, 
//                 { 
//                   backgroundColor: currentStep > step ? colors.success || '#4CAF50' : colors.backgroundSecondary 
//                 }
//               ]} />
//             )}
//           </React.Fragment>
//         ))}
//       </View>
//     );
//   };

//   const renderInput = (field, label, placeholder, options = {}) => (
//     <View style={styles.inputContainer}>
//       <View style={styles.labelContainer}>
//         <Text style={[styles.label, { color: colors.textSecondary }]}>
//           {label} {options.required && <Text style={styles.requiredStar}>*</Text>}
//         </Text>
//         {touched[field] && errors[field] && (
//           <Text style={styles.errorText}>{errors[field]}</Text>
//         )}
//       </View>
//       <TextInput
//         style={[
//           styles.input, 
//           { 
//             borderColor: errors[field] && touched[field] ? colors.error || '#ff4444' : colors.border,
//             backgroundColor: colors.backgroundSecondary,
//             color: colors.text
//           }
//         ]}
//         placeholder={placeholder}
//         placeholderTextColor={colors.textSecondary}
//         value={formData[field]}
//         onChangeText={(text) => handleChange(field, text)}
//         onBlur={() => handleBlur(field)}
//         {...options}
//       />
//     </View>
//   );

//   const renderStepOne = () => (
//     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
//       <View style={styles.sectionHeader}>
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
//         <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
//       </View>
      
//       {renderInput('fullName', 'Full Name', 'Enter your full name', { 
//         required: true,
//         autoCapitalize: 'words' 
//       })}
      
//       {renderInput('email', 'Email Address', 'Enter your email address', { 
//         required: true,
//         keyboardType: 'email-address',
//         autoCapitalize: 'none'
//       })}
      
//       {renderInput('phone', 'Phone Number', 'Enter your phone number', { 
//         required: true,
//         keyboardType: 'phone-pad'
//       })}
      
//       {renderInput('channelName', 'Channel Name', 'Enter your channel name', { 
//         required: true,
//         autoCapitalize: 'words'
//       })}
//     </View>
//   );

//   const renderStepTwo = () => (
//     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
//       <View style={styles.sectionHeader}>
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Details</Text>
//         <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
//       </View>
      
//       <View style={styles.inputContainer}>
//         <View style={styles.labelContainer}>
//           <Text style={[styles.label, { color: colors.textSecondary }]}>
//             Content Category <Text style={styles.requiredStar}>*</Text>
//           </Text>
//           {touched.category && errors.category && (
//             <Text style={styles.errorText}>{errors.category}</Text>
//           )}
//         </View>
//         <TouchableOpacity 
//           style={[styles.selectInput, { 
//             borderColor: errors.category && touched.category ? colors.error || '#ff4444' : colors.border,
//             backgroundColor: colors.backgroundSecondary
//           }]}
//           onPress={() => {/* Open category picker modal */}}
//         >
//           <Text style={[styles.selectText, { color: formData.category ? colors.text : colors.textSecondary }]}>
//             {formData.category || 'Select category'}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Content Type</Text>
//         <View style={styles.radioGroup}>
//           {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
//             <TouchableOpacity 
//               key={type} 
//               style={styles.radioOption}
//               onPress={() => handleChange('contentType', type)}
//             >
//               <View style={[
//                 styles.radioCircle, 
//                 { borderColor: colors.primary }
//               ]}>
//                 {formData.contentType === type && 
//                   <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
//                 }
//               </View>
//               <Text style={[styles.radioLabel, { color: colors.text }]}>{type}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Audience Age</Text>
//         <View style={styles.radioGroup}>
//           {['13-17', '18-34', '35-54', '55+'].map((age) => (
//             <TouchableOpacity 
//               key={age} 
//               style={styles.radioOption}
//               onPress={() => handleChange('audienceAge', age)}
//             >
//               <View style={[
//                 styles.radioCircle, 
//                 { borderColor: colors.primary }
//               ]}>
//                 {formData.audienceAge === age && 
//                   <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
//                 }
//               </View>
//               <Text style={[styles.radioLabel, { color: colors.text }]}>{age}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: colors.textSecondary }]}>Upload Frequency</Text>
//         <View style={styles.radioGroup}>
//           {['Daily', '3-5 per week', '1-2 per week', 'Less than weekly'].map((freq) => (
//             <TouchableOpacity 
//               key={freq} 
//               style={styles.radioOption}
//               onPress={() => handleChange('uploadFrequency', freq)}
//             >
//               <View style={[
//                 styles.radioCircle, 
//                 { borderColor: colors.primary }
//               ]}>
//                 {formData.uploadFrequency === freq && 
//                   <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
//                 }
//               </View>
//               <Text style={[styles.radioLabel, { color: colors.text }]}>{freq}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {renderInput('bio', 'Channel Bio', 'Tell us about your content...', { 
//         required: true,
//         multiline: true,
//         numberOfLines: 4,
//         textAlignVertical: 'top',
//         style: { height: 100, textAlignVertical: 'top' }
//       })}
//     </View>
//   );

//   const renderStepThree = () => (
//     <View style={[styles.formSection, { backgroundColor: colors.card }]}>
//       <View style={styles.sectionHeader}>
//         <Text style={[styles.sectionTitle, { color: colors.text }]}>Monetization Preferences</Text>
//         <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
//       </View>
      
//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: colors.textSecondary }]}>Preferred Payment Method</Text>
//         <TouchableOpacity 
//           style={[styles.selectInput, { 
//             borderColor: colors.border,
//             backgroundColor: colors.backgroundSecondary
//           }]}
//           onPress={() => {/* Open payment method picker */}}
//         >
//           <Text style={[styles.selectText, { color: colors.text }]}>{formData.paymentMethod}</Text>
//           <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
//         </TouchableOpacity>
//       </View>

//       {renderInput('taxInfo', 'Tax Information (SSN/EIN)', 'Required for payment processing', { 
//         required: true,
//         secureTextEntry: true
//       })}

//       {renderInput('website', 'Website/Portfolio (Optional)', 'https://example.com', { 
//         keyboardType: 'url',
//         autoCapitalize: 'none'
//       })}

//       <View style={styles.inputContainer}>
//         <View style={styles.checkboxContainer}>
//           <TouchableOpacity 
//             style={styles.checkbox}
//             onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
//           >
//             {formData.agreeTerms ? (
//               <Icon name="check-box" size={24} color={colors.primary} />
//             ) : (
//               <Icon name="check-box-outline-blank" size={24} color={colors.textSecondary} />
//             )}
//           </TouchableOpacity>
//           <Text style={[styles.checkboxLabel, { color: colors.text }]}>
//             I agree to the Terms of Service and confirm that all content is original and complies with community guidelines
//             <Text style={styles.requiredStar}>*</Text>
//           </Text>
//         </View>
//         {touched.agreeTerms && errors.agreeTerms && (
//           <Text style={[styles.errorText, { marginLeft: 34 }]}>{errors.agreeTerms}</Text>
//         )}
//       </View>
//     </View>
//   );

//   const renderStepFour = () => {
//     const missingFields = [
//       ...step1RequiredFields.filter(f => !formData[f]),
//       ...step2RequiredFields.filter(f => !formData[f]),
//       ...step3RequiredFields.filter(f => !formData[f])
//     ];

//     return (
//       <View style={[styles.formSection, { backgroundColor: colors.card }]}>
//         <View style={styles.summaryHeader}>
//           <Ionicons 
//             name={missingFields.length === 0 ? "checkmark-circle" : "alert-circle"} 
//             size={60} 
//             color={missingFields.length === 0 ? colors.success || '#4CAF50' : colors.warning || '#FFA000'} 
//           />
//           <Text style={[styles.summaryTitle, { color: colors.text }]}>
//             {missingFields.length === 0 ? 'Ready to Submit!' : 'Review Your Information'}
//           </Text>
//           <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
//             {missingFields.length === 0 
//               ? 'All required fields are complete. Please verify your information below.'
//               : 'Some required fields are missing. Please go back to complete them.'}
//           </Text>
//           {missingFields.length > 0 && (
//             <View style={styles.missingFieldsContainer}>
//               <Text style={[styles.missingFieldsTitle, { color: colors.text }]}>
//                 Missing Required Fields:
//               </Text>
//               {missingFields.map(field => (
//                 <Text key={field} style={[styles.missingField, { color: colors.error || '#ff4444' }]}>
//                   • {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
//                 </Text>
//               ))}
//             </View>
//           )}
//         </View>

//         <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
//           <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Basic Information</Text>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Full Name:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]}>
//               {formData.fullName || <Text style={styles.missingValue}>Not provided</Text>}
//             </Text>
//           </View>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Email:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]}>
//               {formData.email || <Text style={styles.missingValue}>Not provided</Text>}
//             </Text>
//           </View>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Channel Name:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]}>
//               {formData.channelName || <Text style={styles.missingValue}>Not provided</Text>}
//             </Text>
//           </View>
//         </View>

//         <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
//           <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Content Details</Text>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Category:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]}>
//               {formData.category || <Text style={styles.missingValue}>Not selected</Text>}
//             </Text>
//           </View>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Bio:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]} numberOfLines={2}>
//               {formData.bio || <Text style={styles.missingValue}>Not provided</Text>}
//             </Text>
//           </View>
//         </View>

//         <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
//           <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Payment Information</Text>
//           <View style={styles.summaryItem}>
//             <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax Info:</Text>
//             <Text style={[styles.summaryValue, { color: colors.text }]}>
//               {formData.taxInfo ? '✓ Provided' : <Text style={styles.missingValue}>Required</Text>}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const isStepValid = (step) => {
//     const requiredFields = step === 1 ? step1RequiredFields :
//                           step === 2 ? step2RequiredFields :
//                           step === 3 ? step3RequiredFields : [];
    
//     return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <KeyboardAvoidingView 
//         style={{ flex: 1 }} 
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
//       >
//         <View style={[styles.container, { backgroundColor: colors.background }]}>
//           <StatusBar 
//             backgroundColor={colors.card} 
//             barStyle={isDark ? "light-content" : "dark-content"} 
//           />
          
//           <View style={[styles.header, { 
//             backgroundColor: colors.card,
//             borderBottomColor: colors.border
//           }]}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Icon name="arrow-back" size={24} color={colors.primary} />
//             </TouchableOpacity>
//             <Text style={[styles.headerTitle, { color: colors.text }]}>Monetization Request</Text>
//             <View style={{ width: 24 }} />
//           </View>

//           <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
//             {renderStepIndicator()}
//           </View>

//           <ScrollView 
//             contentContainerStyle={styles.scrollContainer}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             {currentStep === 1 && renderStepOne()}
//             {currentStep === 2 && renderStepTwo()}
//             {currentStep === 3 && renderStepThree()}
//             {currentStep === 4 && renderStepFour()}
//           </ScrollView>

//           <View style={[styles.footer, { 
//             backgroundColor: colors.card,
//             borderTopColor: colors.border
//           }]}>
//             {currentStep > 1 && (
//               <TouchableOpacity 
//                 style={[styles.secondaryButton, { 
//                   backgroundColor: colors.backgroundSecondary 
//                 }]} 
//                 onPress={prevStep}
//               >
//                 <Feather name="arrow-left" size={20} color={colors.text} />
//                 <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Back</Text>
//               </TouchableOpacity>
//             )}
            
//             {currentStep < 4 ? (
//               <TouchableOpacity 
//                 style={[
//                   styles.primaryButton, 
//                   { backgroundColor: colors.primary },
//                   !isStepValid(currentStep) && styles.disabledButton
//                 ]} 
//                 onPress={nextStep}
//                 disabled={!isStepValid(currentStep)}
//               >
//                 <Text style={styles.primaryButtonText}>Continue</Text>
//                 <Feather name="arrow-right" size={20} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity 
//                 style={[
//                   styles.primaryButton, 
//                   { backgroundColor: colors.primary },
//                   (loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)) && styles.disabledButton
//                 ]} 
//                 onPress={handleSubmit}
//                 disabled={loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <>
//                     <Text style={styles.primaryButtonText}>Submit Application</Text>
//                     <Icon name="send" size={20} color="#fff" />
//                   </>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     paddingBottom: 100,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 10,
//     borderBottomWidth: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     fontFamily: 'Lato-Bold',
//   },
//   stepContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     marginBottom: 10,
//     paddingHorizontal: 20,
//   },
//   step: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   stepText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   stepLine: {
//     width: 60,
//     height: 2,
//     marginHorizontal: 5,
//   },
//   formSection: {
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     fontFamily: 'Lato-Bold',
//   },
//   requiredHint: {
//     fontSize: 12,
//     fontStyle: 'italic',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   labelContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     fontFamily: 'Lato-Regular',
//   },
//   requiredStar: {
//     color: '#ff4444',
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 15,
//     fontSize: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   selectInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 15,
//   },
//   selectText: {
//     fontSize: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   errorText: {
//     color: '#ff4444',
//     fontSize: 12,
//     fontFamily: 'Lato-Regular',
//     marginTop: 4,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 5,
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//     marginBottom: 10,
//     minWidth: 100,
//   },
//   radioCircle: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   radioChecked: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   radioLabel: {
//     fontSize: 14,
//     fontFamily: 'Lato-Regular',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginTop: 10,
//   },
//   checkbox: {
//     marginRight: 10,
//     marginTop: 2,
//   },
//   checkboxLabel: {
//     flex: 1,
//     fontSize: 14,
//     lineHeight: 20,
//     fontFamily: 'Lato-Regular',
//   },
//   summaryHeader: {
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   summaryTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//     fontFamily: 'Lato-Bold',
//   },
//   summarySubtitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//     fontFamily: 'Lato-Regular',
//     marginBottom: 15,
//   },
//   missingFieldsContainer: {
//     backgroundColor: 'rgba(255, 68, 68, 0.1)',
//     padding: 15,
//     borderRadius: 12,
//     width: '100%',
//     marginTop: 10,
//   },
//   missingFieldsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 5,
//     fontFamily: 'Lato-Bold',
//   },
//   missingField: {
//     fontSize: 13,
//     marginLeft: 10,
//     marginBottom: 3,
//     fontFamily: 'Lato-Regular',
//   },
//   missingValue: {
//     color: '#ff4444',
//     fontStyle: 'italic',
//   },
//   summaryCard: {
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//   },
//   summaryCardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     fontFamily: 'Lato-Bold',
//   },
//   summaryItem: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   summaryLabel: {
//     width: 120,
//     fontSize: 14,
//     fontWeight: '500',
//     fontFamily: 'Lato-Regular',
//   },
//   summaryValue: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'Lato-Regular',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     borderTopWidth: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 10,
//   },
//   primaryButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     padding: 15,
//     marginLeft: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 10,
//     fontFamily: 'Lato-Bold',
//   },
//   secondaryButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     padding: 15,
//     marginRight: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   secondaryButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//     fontFamily: 'Lato-Bold',
//   },
// });

// export default MonetizationRequest;
import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Image, StatusBar, Dimensions, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; 

const { width } = Dimensions.get('window');

const MonetizationRequest = ({ navigation }) => {
  const { colors, isDark } = useTheme(); 
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    channelName: '',
    category: '',
    bio: '',
    website: '',
    taxInfo: '',
    paymentMethod: 'Paystack',
    contentType: 'Videos',
    audienceAge: '18-34',
    uploadFrequency: '3-5 per week',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Required fields for each step
  const step1RequiredFields = ['fullName', 'email', 'phone', 'channelName'];
  const step2RequiredFields = ['category', 'bio'];
  const step3RequiredFields = ['taxInfo'];

  const validateField = (field, value) => {
    if (step1RequiredFields.includes(field) || 
        step2RequiredFields.includes(field) || 
        step3RequiredFields.includes(field)) {
      
      if (!value || value.trim() === '') {
        return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
      
      // Email validation
      if (field === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      if (field === 'phone' && value) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
      }
    }
    return '';
  };

  const validateStep = (step) => {
    const requiredFields = step === 1 ? step1RequiredFields :
                          step === 2 ? step2RequiredFields :
                          step === 3 ? step3RequiredFields : [];
    
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Additional validation for step 3: agreeTerms
    if (step === 3 && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Mark field as touched
    setTouched({ ...touched, [field]: true });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = () => {
    // Validate all steps before final submission
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    
    if (!step1Valid || !step2Valid || !step3Valid) {
      Alert.alert(
        'Incomplete Information',
        'Please fill in all required fields correctly before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Application Submitted',
        'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
        [
          { text: 'OK', onPress: () => navigation.replace('BusinessHome') }
        ]
      );
    }, 2000);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({}); // Clear errors when moving to next step
    } else {
      // Scroll to first error
      Alert.alert(
        'Required Fields',
        'Please fill in all required fields before proceeding.',
        [{ text: 'OK' }]
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepContainer}>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <TouchableOpacity 
              style={[
                styles.step, 
                { 
                  backgroundColor: currentStep === step ? colors.primary : 
                                 currentStep > step ? colors.success || '#4CAF50' : colors.backgroundSecondary 
                }
              ]}
              onPress={() => {
                if (step < currentStep) {
                  setCurrentStep(step);
                }
              }}
              disabled={step > currentStep}
            >
              <Text style={[
                styles.stepText, 
                { 
                  color: currentStep >= step ? '#fff' : colors.textSecondary 
                }
              ]}>
                {currentStep > step ? '✓' : step}
              </Text>
            </TouchableOpacity>
            {step < 4 && (
              <View style={[
                styles.stepLine, 
                { 
                  backgroundColor: currentStep > step ? colors.success || '#4CAF50' : colors.backgroundSecondary 
                }
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderInput = (field, label, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label} {options.required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        {touched[field] && errors[field] && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: errors[field] && touched[field] ? colors.error || '#ff4444' : colors.border,
            backgroundColor: colors.backgroundSecondary,
            color: colors.text
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        onBlur={() => handleBlur(field)}
        {...options}
      />
    </View>
  );

  const renderStepOne = () => (
    <View style={[styles.formSection, { backgroundColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
      </View>
      
      {renderInput('fullName', 'Full Name', 'Enter your full name', { 
        required: true,
        autoCapitalize: 'words' 
      })}
      
      {renderInput('email', 'Email Address', 'Enter your email address', { 
        required: true,
        keyboardType: 'email-address',
        autoCapitalize: 'none'
      })}
      
      {renderInput('phone', 'Phone Number', 'Enter your phone number', { 
        required: true,
        keyboardType: 'phone-pad'
      })}
      
      {renderInput('channelName', 'Channel Name', 'Enter your channel name', { 
        required: true,
        autoCapitalize: 'words'
      })}
    </View>
  );

  const renderStepTwo = () => (
    <View style={[styles.formSection, { backgroundColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Details</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Content Category <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.category && errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.selectInput, { 
            borderColor: errors.category && touched.category ? colors.error || '#ff4444' : colors.border,
            backgroundColor: colors.backgroundSecondary
          }]}
          onPress={() => {/* Open category picker modal */}}
        >
          <Text style={[styles.selectText, { color: formData.category ? colors.text : colors.textSecondary }]}>
            {formData.category || 'Select category'}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Content Type</Text>
        <View style={styles.radioGroup}>
          {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={styles.radioOption}
              onPress={() => handleChange('contentType', type)}
            >
              <View style={[
                styles.radioCircle, 
                { borderColor: colors.primary }
              ]}>
                {formData.contentType === type && 
                  <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
                }
              </View>
              <Text style={[styles.radioLabel, { color: colors.text }]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Audience Age</Text>
        <View style={styles.radioGroup}>
          {['13-17', '18-34', '35-54', '55+'].map((age) => (
            <TouchableOpacity 
              key={age} 
              style={styles.radioOption}
              onPress={() => handleChange('audienceAge', age)}
            >
              <View style={[
                styles.radioCircle, 
                { borderColor: colors.primary }
              ]}>
                {formData.audienceAge === age && 
                  <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
                }
              </View>
              <Text style={[styles.radioLabel, { color: colors.text }]}>{age}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Upload Frequency</Text>
        <View style={styles.radioGroup}>
          {['Daily', '3-5 per week', '1-2 per week', 'Less than weekly'].map((freq) => (
            <TouchableOpacity 
              key={freq} 
              style={styles.radioOption}
              onPress={() => handleChange('uploadFrequency', freq)}
            >
              <View style={[
                styles.radioCircle, 
                { borderColor: colors.primary }
              ]}>
                {formData.uploadFrequency === freq && 
                  <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
                }
              </View>
              <Text style={[styles.radioLabel, { color: colors.text }]}>{freq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderInput('bio', 'Channel Bio', 'Tell us about your content...', { 
        required: true,
        multiline: true,
        numberOfLines: 4,
        textAlignVertical: 'top',
        style: { height: 100, textAlignVertical: 'top' }
      })}
    </View>
  );

  const renderStepThree = () => (
    <View style={[styles.formSection, { backgroundColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Monetization Preferences</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required fields</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Preferred Payment Method</Text>
        <TouchableOpacity 
          style={[styles.selectInput, { 
            borderColor: colors.border,
            backgroundColor: colors.backgroundSecondary
          }]}
          onPress={() => {/* Open payment method picker */}}
        >
          <Text style={[styles.selectText, { color: colors.text }]}>{formData.paymentMethod}</Text>
          <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {renderInput('taxInfo', 'Tax Information (SSN/EIN)', 'Required for payment processing', { 
        required: true,
        secureTextEntry: true
      })}

      {renderInput('website', 'Website/Portfolio (Optional)', 'https://example.com', { 
        keyboardType: 'url',
        autoCapitalize: 'none'
      })}

      <View style={styles.inputContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
          >
            {formData.agreeTerms ? (
              <Icon name="check-box" size={24} color={colors.primary} />
            ) : (
              <Icon name="check-box-outline-blank" size={24} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          <Text style={[styles.checkboxLabel, { color: colors.text }]}>
            I agree to the Terms of Service and confirm that all content is original and complies with community guidelines
            <Text style={styles.requiredStar}>*</Text>
          </Text>
        </View>
        {touched.agreeTerms && errors.agreeTerms && (
          <Text style={[styles.errorText, { marginLeft: 34 }]}>{errors.agreeTerms}</Text>
        )}
      </View>
    </View>
  );

  const renderStepFour = () => {
    const missingFields = [
      ...step1RequiredFields.filter(f => !formData[f]),
      ...step2RequiredFields.filter(f => !formData[f]),
      ...step3RequiredFields.filter(f => !formData[f])
    ];

    return (
      <View style={[styles.formSection, { backgroundColor: colors.card }]}>
        <View style={styles.summaryHeader}>
          <Ionicons 
            name={missingFields.length === 0 ? "checkmark-circle" : "alert-circle"} 
            size={60} 
            color={missingFields.length === 0 ? colors.success || '#4CAF50' : colors.warning || '#FFA000'} 
          />
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            {missingFields.length === 0 ? 'Ready to Submit!' : 'Review Your Information'}
          </Text>
          <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
            {missingFields.length === 0 
              ? 'All required fields are complete. Please verify your information below.'
              : 'Some required fields are missing. Please go back to complete them.'}
          </Text>
          {missingFields.length > 0 && (
            <View style={styles.missingFieldsContainer}>
              <Text style={[styles.missingFieldsTitle, { color: colors.text }]}>
                Missing Required Fields:
              </Text>
              {missingFields.map(field => (
                <Text key={field} style={[styles.missingField, { color: colors.error || '#ff4444' }]}>
                  • {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Basic Information</Text>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Full Name:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.fullName || <Text style={styles.missingValue}>Not provided</Text>}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Email:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.email || <Text style={styles.missingValue}>Not provided</Text>}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Channel Name:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.channelName || <Text style={styles.missingValue}>Not provided</Text>}
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Content Details</Text>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Category:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.category || <Text style={styles.missingValue}>Not selected</Text>}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Bio:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]} numberOfLines={2}>
              {formData.bio || <Text style={styles.missingValue}>Not provided</Text>}
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.summaryCardTitle, { color: colors.primary }]}>Payment Information</Text>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax Info:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.taxInfo ? '✓ Provided' : <Text style={styles.missingValue}>Required</Text>}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const isStepValid = (step) => {
    const requiredFields = step === 1 ? step1RequiredFields :
                          step === 2 ? step2RequiredFields :
                          step === 3 ? step3RequiredFields : [];
    
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar 
            backgroundColor={colors.card} 
            barStyle={isDark ? "light-content" : "dark-content"} 
          />
          
          <View style={[styles.header, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border
          }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Monetization Request</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
            {renderStepIndicator()}
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {currentStep === 1 && renderStepOne()}
            {currentStep === 2 && renderStepTwo()}
            {currentStep === 3 && renderStepThree()}
            {currentStep === 4 && renderStepFour()}
          </ScrollView>

          <View style={[styles.footer, { 
            backgroundColor: colors.card,
            borderTopColor: colors.border
          }]}>
            {currentStep > 1 && (
              <TouchableOpacity 
                style={[styles.secondaryButton, { 
                  backgroundColor: colors.backgroundSecondary 
                }]} 
                onPress={prevStep}
              >
                <Feather name="arrow-left" size={20} color={colors.text} />
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Back</Text>
              </TouchableOpacity>
            )}
            
            {currentStep < 4 ? (
              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  { backgroundColor: colors.primary },
                  !isStepValid(currentStep) && styles.disabledButton
                ]} 
                onPress={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                <Feather name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  { backgroundColor: colors.primary },
                  (loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)) && styles.disabledButton
                ]} 
                onPress={handleSubmit}
                disabled={loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Submit Application</Text>
                    <Icon name="send" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLine: {
    width: 60,
    height: 2,
    marginHorizontal: 5,
  },
  formSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lato-Bold',
  },
  requiredHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Lato-Regular',
  },
  requiredStar: {
    color: '#ff4444',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
    minWidth: 100,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'Lato-Bold',
  },
  summarySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Lato-Regular',
    marginBottom: 15,
  },
  missingFieldsContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginTop: 10,
  },
  missingFieldsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Lato-Bold',
  },
  missingField: {
    fontSize: 13,
    marginLeft: 10,
    marginBottom: 3,
    fontFamily: 'Lato-Regular',
  },
  missingValue: {
    color: '#ff4444',
    fontStyle: 'italic',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Lato-Bold',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Lato-Regular',
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: 'Lato-Bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Lato-Bold',
  },
});

export default MonetizationRequest;