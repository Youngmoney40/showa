import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MedicalHistoryScreen({ navigation }) {
  const [medicalData, setMedicalData] = useState({
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    disabilities: '',
    emergencyContact: '',
    healthNotes: '',
  });

  const updateMedicalData = (field, value) => {
    setMedicalData(prev => ({ ...prev, [field]: value }));
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure'];
  const conditionOptions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart condition', 'None', 'Prefer not to say'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '37%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Medical History</Text>
          <Text style={styles.subText}>
            Share important health information for better compatibility
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Habits')}
            >
              <Text style={styles.tabText}>Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Medical</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Sexuality')}
            >
              <Text style={styles.tabText}>Sexuality</Text>
            </TouchableOpacity>
            {/* ... other tabs */}
          </View>
        </ScrollView>

        {/* Blood Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.optionGrid}>
            {bloodTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionCard,
                  medicalData.bloodType === type && styles.optionCardSelected
                ]}
                onPress={() => updateMedicalData('bloodType', type)}
              >
                <Text style={[
                  styles.optionCardText,
                  medicalData.bloodType === type && styles.optionCardTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Allergies */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any allergies (food, medication, environmental)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={medicalData.allergies}
            onChangeText={(text) => updateMedicalData('allergies', text)}
          />
        </View>

        {/* Medical Conditions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medical Conditions</Text>
          <View style={styles.optionGrid}>
            {conditionOptions.map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.optionCard,
                  medicalData.conditions === condition && styles.optionCardSelected
                ]}
                onPress={() => updateMedicalData('conditions', condition)}
              >
                <Text style={[
                  styles.optionCardText,
                  medicalData.conditions === condition && styles.optionCardTextSelected
                ]}>
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medications */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Medications</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any regular medications"
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            value={medicalData.medications}
            onChangeText={(text) => updateMedicalData('medications', text)}
          />
        </View>

        {/* Disabilities */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Disabilities or Special Needs</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share any disabilities or special needs"
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            value={medicalData.disabilities}
            onChangeText={(text) => updateMedicalData('disabilities', text)}
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Contact Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name of emergency contact"
            placeholderTextColor="#999"
            value={medicalData.emergencyContact}
            onChangeText={(text) => updateMedicalData('emergencyContact', text)}
          />
        </View>

        {/* Additional Health Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Health Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any other important health information"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={medicalData.healthNotes}
            onChangeText={(text) => updateMedicalData('healthNotes', text)}
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color="#FF3366" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Sexuality')}
          >
            <Text style={styles.continueButtonText}>Continue to Sexuality</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7fc',
  },
  scrollContainer: {
    flex: 1,
    padding: 24,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e4ddea',
    borderRadius: 3,
    marginBottom: 24,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FF3366',
    borderRadius: 3,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c2c2c',
    marginBottom: 8,
  },
  subText: {
    textAlign: 'center',
    color: '#6e6e6e',
    fontSize: 16,
    lineHeight: 22,
  },
  tabScroll: {
    marginBottom: 24,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FF3366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5dbee',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5dbee',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0ebf5',
    minWidth: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionCardSelected: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionCardText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  optionCardTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF3366',
    gap: 8,
  },
  backButtonText: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});