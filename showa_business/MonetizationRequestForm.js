import React, { useState, useRef } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Image, StatusBar, Dimensions, Alert, KeyboardAvoidingView, Platform,
  Modal, FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const { width, height } = Dimensions.get('window');

// Category options
const CATEGORIES = [
  'Entertainment',
  'Education',
  'Technology',
  'Gaming',
  'Music',
  'Sports',
  'Fashion',
  'Food',
  'Travel',
  'Lifestyle',
  'Comedy',
  'News',
  'Finance',
  'Health & Fitness',
  'DIY & Crafts',
  'Beauty',
  'Photography',
  'Business',
  'Science',
  'History',
  'Motivation',
  'Spiritual',
  'Fitness',
  'Cooking'
];

const MonetizationRequest = ({ navigation }) => {
  const { colors, isDark } = useTheme(); 
  const scrollViewRef = useRef(null);
  
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');

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
      
      if (field === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      }
      
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

    if (step === 3 && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    setTouched({ ...touched, [field]: true });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };



const handleSubmit = async () => {
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
  try {
    const token = await AsyncStorage.getItem('userToken');
    
   
    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      channel_name: formData.channelName,
      category: formData.category,
      bio: formData.bio,
      website: formData.website || '',
      content_type: formData.contentType,
      audience_age: formData.audienceAge,
      upload_frequency: formData.uploadFrequency,
      payment_method: formData.paymentMethod,
      tax_info: formData.taxInfo,
      bank_name: formData.bankName || '',
      account_number: formData.accountNumber || '',
      account_name: formData.accountName || '',
    };

    const response = await axios.post(
      `${API_ROUTE}/monetization/apply/`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.success) {
      Alert.alert(
        'Application Submitted Successfully! ',
        'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.replace('BroadcastHome') 
          }
        ]
      );
    }
  } catch (error) {
    console.error('Submit error:', error);
    let errorMessage = 'Failed to submit application. Please try again.';
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      errorMessage = Object.values(errors).flat()[0] || errorMessage;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    Alert.alert('Submission Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } else {
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
      setErrors({});
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const selectCategory = (category) => {
    handleChange('category', category);
    setShowCategoryModal(false);
    setSearchCategory('');
  };

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const renderStepIndicator = () => {
    return (
      <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
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
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                  }
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
                  backgroundColor: currentStep > step ? colors.success || '#4CAF50' : colors.backgroundSecondary,
                  flex: 1,
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
    <View style={[styles.formSection, { backgroundColor: colors.surface || colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Full Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.fullName && errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: errors.fullName && touched.fullName ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Enter your full name"
          placeholderTextColor={colors.textSecondary}
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          onBlur={() => handleBlur('fullName')}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Email Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: errors.email && touched.email ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Enter your email address"
          placeholderTextColor={colors.textSecondary}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          onBlur={() => handleBlur('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Phone Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.phone && errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: errors.phone && touched.phone ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Enter your phone number"
          placeholderTextColor={colors.textSecondary}
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          onBlur={() => handleBlur('phone')}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Channel Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.channelName && errors.channelName && (
            <Text style={styles.errorText}>{errors.channelName}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: errors.channelName && touched.channelName ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Enter your channel name"
          placeholderTextColor={colors.textSecondary}
          value={formData.channelName}
          onChangeText={(text) => handleChange('channelName', text)}
          onBlur={() => handleBlur('channelName')}
          autoCapitalize="words"
          returnKeyType="done"
        />
      </View>


      <TouchableOpacity 
        style={[
          styles.stepContinueButton, 
          { backgroundColor: colors.primary },
          !isStepValid(1) && styles.disabledButton
        ]} 
        onPress={nextStep}
        disabled={!isStepValid(1)}
      >
        <Text style={styles.stepContinueButtonText}>Continue</Text>
        <Feather name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View style={[styles.formSection, { backgroundColor: colors.surface || colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Details</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required</Text>
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
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={[styles.selectText, { color: formData.category ? colors.text : colors.textSecondary }]}>
            {formData.category || 'Select a category'}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface || colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border
            }]}>
              <Icon name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search categories..."
                placeholderTextColor={colors.textSecondary}
                value={searchCategory}
                onChangeText={setSearchCategory}
              />
              {searchCategory.length > 0 && (
                <TouchableOpacity onPress={() => setSearchCategory('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    formData.category === item && [styles.categoryItemSelected, { backgroundColor: colors.primary }]
                  ]}
                  onPress={() => selectCategory(item)}
                >
                  <Text style={[
                    styles.categoryItemText,
                    { color: formData.category === item ? '#fff' : colors.text }
                  ]}>
                    {item}
                  </Text>
                  {formData.category === item && (
                    <Icon name="check" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalListContent}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Content Type</Text>
        <View style={styles.radioGroup}>
          {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={styles.radioOption}
              onPress={() => handleChange('contentType', type)}
            >
              <View style={[styles.radioCircle, { borderColor: colors.primary }]}>
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
              <View style={[styles.radioCircle, { borderColor: colors.primary }]}>
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
              <View style={[styles.radioCircle, { borderColor: colors.primary }]}>
                {formData.uploadFrequency === freq && 
                  <View style={[styles.radioChecked, { backgroundColor: colors.primary }]} />
                }
              </View>
              <Text style={[styles.radioLabel, { color: colors.text }]}>{freq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Channel Bio <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.bio && errors.bio && (
            <Text style={styles.errorText}>{errors.bio}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            styles.textArea,
            { 
              borderColor: errors.bio && touched.bio ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Tell us about your content..."
          placeholderTextColor={colors.textSecondary}
          value={formData.bio}
          onChangeText={(text) => handleChange('bio', text)}
          onBlur={() => handleBlur('bio')}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="done"
        />
      </View>

      <View style={styles.stepButtonsRow}>
        <TouchableOpacity 
          style={[styles.stepBackButton, { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            borderWidth: 1
          }]} 
          onPress={prevStep}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
          <Text style={[styles.stepBackButtonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.stepContinueButton, 
            { backgroundColor: colors.primary },
            !isStepValid(2) && styles.disabledButton
          ]} 
          onPress={nextStep}
          disabled={!isStepValid(2)}
        >
          <Text style={styles.stepContinueButtonText}>Continue</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepThree = () => (
    <View style={[styles.formSection, { backgroundColor: colors.surface || colors.card }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Monetization Preferences</Text>
        <Text style={[styles.requiredHint, { color: colors.textSecondary }]}>* Required</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Payment Method</Text>
        <TouchableOpacity 
          style={[styles.selectInput, { 
            borderColor: colors.border,
            backgroundColor: colors.backgroundSecondary
          }]}
          onPress={() => {/* Open payment method picker */}}
        >
          <Text style={[styles.selectText, { color: colors.text }]}>{formData.paymentMethod}</Text>
          {/* <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} /> */}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Tax Information (SSN/EIN) <Text style={styles.requiredStar}>*</Text>
          </Text>
          {touched.taxInfo && errors.taxInfo && (
            <Text style={styles.errorText}>{errors.taxInfo}</Text>
          )}
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: errors.taxInfo && touched.taxInfo ? colors.error || '#ff4444' : colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="Required for payment processing"
          placeholderTextColor={colors.textSecondary}
          value={formData.taxInfo}
          onChangeText={(text) => handleChange('taxInfo', text)}
          onBlur={() => handleBlur('taxInfo')}
          secureTextEntry
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Website/Portfolio (Optional)</Text>
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text
            }
          ]}
          placeholder="https://example.com"
          placeholderTextColor={colors.textSecondary}
          value={formData.website}
          onChangeText={(text) => handleChange('website', text)}
          keyboardType="url"
          autoCapitalize="none"
          returnKeyType="done"
        />
      </View>

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

      <View style={styles.stepButtonsRow}>
        <TouchableOpacity 
          style={[styles.stepBackButton, { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            borderWidth: 1
          }]} 
          onPress={prevStep}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
          <Text style={[styles.stepBackButtonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.stepContinueButton, 
            { backgroundColor: colors.primary },
            (!isStepValid(3) || !formData.agreeTerms) && styles.disabledButton
          ]} 
          onPress={nextStep}
          disabled={!isStepValid(3) || !formData.agreeTerms}
        >
          <Text style={styles.stepContinueButtonText}>Continue</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
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
      <View style={[styles.formSection, { backgroundColor: colors.surface || colors.card }]}>
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
            <View style={[styles.missingFieldsContainer, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
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
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Phone:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.phone || <Text style={styles.missingValue}>Not provided</Text>}
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
        
        <View style={styles.stepButtonsRow}>
          <TouchableOpacity 
            style={[styles.stepBackButton, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              borderWidth: 1
            }]} 
            onPress={prevStep}
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
            <Text style={[styles.stepBackButtonText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.stepContinueButton, 
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
                <Text style={styles.stepContinueButtonText}>Submit</Text>
                <Icon name="send" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
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
            backgroundColor={colors.primary} 
            barStyle="light-content"
            translucent={Platform.OS === 'android'}
          />
          
          <View style={[styles.header, { 
            backgroundColor: colors.primary,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          }]}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Monetization Request</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={[styles.stepContainerWrapper, { backgroundColor: colors.background }]}>
            {renderStepIndicator()}
          </View>

          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            {currentStep === 1 && renderStepOne()}
            {currentStep === 2 && renderStepTwo()}
            {currentStep === 3 && renderStepThree()}
            {currentStep === 4 && renderStepFour()}
            
            <View style={styles.bottomSpacer} />
          </ScrollView>
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
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  stepContainerWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 14,
  },
  stepLine: {
    height: 2,
    marginHorizontal: 4,
    minWidth: 20,
  },
  formSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom:130
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  requiredHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  requiredStar: {
    color: '#ff4444',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    fontFamily: 'System',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  selectText: {
    fontSize: 15,
    fontFamily: 'System',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    minWidth: 80,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioChecked: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 13,
    fontFamily: 'System',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'System',
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'System',
  },
  summarySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'System',
    marginBottom: 12,
  },
  missingFieldsContainer: {
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginTop: 8,
  },
  missingFieldsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  missingField: {
    fontSize: 13,
    marginLeft: 10,
    marginBottom: 2,
    fontFamily: 'System',
  },
  missingValue: {
    color: '#ff4444',
    fontStyle: 'italic',
  },
  summaryCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  summaryCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'System',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  summaryLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'System',
  },
  summaryValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'System',
  },
  stepButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  stepContinueButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stepContinueButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'System',
  },
  stepBackButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepBackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'System',
  },
  modalListContent: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryItemSelected: {
    backgroundColor: '#0d64dd',
  },
  categoryItemText: {
    fontSize: 15,
    fontFamily: 'System',
  },
});

export default MonetizationRequest;