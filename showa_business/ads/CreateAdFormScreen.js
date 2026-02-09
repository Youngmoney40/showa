import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateAdFormScreen({ navigation }){

  const [adTitle, setAdTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle image selection
  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response) => {
        if (!response.didCancel && !response.error) {
          setSelectedImage(response.assets[0]);
        }
      }
    );
  };

  // Date picker handlers
  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  // Form validation
  const validateForm = () => {
    if (!adTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter an ad title');
      return false;
    }
    if (adTitle.length < 10) {
      Alert.alert('Validation Error', 'Ad title should be at least 10 characters');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return false;
    }
    if (description.length < 50) {
      Alert.alert('Validation Error', 'Description should be at least 50 characters');
      return false;
    }
    if (!budget) {
      Alert.alert('Validation Error', 'Please enter a budget');
      return false;
    }
    if (isNaN(budget) || parseFloat(budget) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid budget amount');
      return false;
    }
    if (!selectedImage) {
      Alert.alert('Validation Error', 'Please select an image for your ad');
      return false;
    }
    if (startDate > endDate) {
      Alert.alert('Validation Error', 'End date should be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    
     navigation.replace('AdReview');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <StatusBar backgroundColor='#fff' barStyle='dark-content' />
              <Text style={styles.heading}>Create New Advertisement</Text>
              <Text style={styles.subHeading}>Fill in the details below to create your ad campaign</Text>

              {/* Ad Image Section =====*/}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ad Creative</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                  {selectedImage ? (
                    <Image 
                      source={{ uri: selectedImage.uri }} 
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Icon name="image-plus" size={40} color="#1976D2" />
                      <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                      <Text style={styles.imageHint}>Recommended size: 1200×628px</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Ad Details Section =================*/}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ad Details</Text>
                
                <View style={styles.inputContainer}>
                  <Icon name="text-box" size={20} color="#1976D2" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Ad Title (e.g., Summer Sale - 50% Off)"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={adTitle}
                    
                    onChangeText={setAdTitle}
                    maxLength={100}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Icon name="file-document-outline" size={20} color="#1976D2" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Detailed Description (What makes your offer special?)"
                    placeholderTextColor="#999"
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                  />
                </View>
              </View>

              {/* Budget & Targeting Section ========================*/}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Budget & Targeting</Text>
                
                <View style={styles.inputContainer}>
                <Icon name="currency-ngn" size={20} color="#1976D2" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Daily Budget"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={budget}
                    onChangeText={(text) => setBudget(text.replace(/[^0-9.]/g, ''))}
                    keyboardType="decimal-pad"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Icon name="account-group" size={20} color="#1976D2" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Target Audience (e.g., Women 25-40, Tech Enthusiasts)"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={targetAudience}
                    onChangeText={setTargetAudience}
                  />
                </View>
              </View>

              {/* ==============================Campaign Duration Section ========================*/}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Campaign Duration</Text>
                
                <TouchableOpacity 
                  style={styles.dateInputContainer}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Icon name="calendar-start" size={20} color="#1976D2" style={styles.inputIcon} />
                  <Text style={styles.dateText}>Start Date: {formatDate(startDate)}</Text>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dateInputContainer}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Icon name="calendar-end" size={20} color="#1976D2" style={styles.inputIcon} />
                  <Text style={styles.dateText}>End Date: {formatDate(endDate)}</Text>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                      minimumDate={startDate}
                    />
                  )}
                </TouchableOpacity>
              </View>

            
              <TouchableOpacity 
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Submit Ad for Approval
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerNote}>
                Your ad will be reviewed within 24 hours. We'll notify you once it's approved.
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
    </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imagePicker: {
    height: 180,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#1976D2',
    marginTop: 8,
    fontWeight: '500',
  },
  imageHint: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  footerNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
