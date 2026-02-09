import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function WorkDetailsScreen({ navigation }) {
  const [workData, setWorkData] = useState({
    occupation: '',
    education: '',
    income: '',
    workHours: '',
    careerGoals: '',
  });

  const updateWorkData = (field, value) => {
    setWorkData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Professional Life</Text>
          <Text style={styles.subText}>
            Tell us about your career and educational background
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => navigation.navigate('BasicDetails')}
          >
            <Text style={styles.tabText}>Basic</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => navigation.navigate('FamilyDetails')}
          >
            <Text style={styles.tabText}>Family</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Work</Text>
          </TouchableOpacity>
        </View>

        {/* Occupation */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Software Engineer, Teacher, Business Owner"
            placeholderTextColor="#999"
            value={workData.occupation}
            onChangeText={(text) => updateWorkData('occupation', text)}
          />
        </View>

        {/* Education */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Highest education level</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={workData.education ? styles.dropdownTextFilled : styles.dropdownText}>
              {workData.education || 'Select education level'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Income */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Annual income range</Text>
          <View style={styles.optionRow}>
            {['Under $50k', '$50k-$100k', '$100k-$150k', '$150k+'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  workData.income === option && styles.optionButtonSelected
                ]}
                onPress={() => updateWorkData('income', option)}
              >
                <Text style={[
                  styles.optionText,
                  workData.income === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Work Hours */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Typical work schedule</Text>
          <View style={styles.optionRow}>
            {['9-5', 'Flexible', 'Shift work', 'Remote', 'Freelance'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  workData.workHours === option && styles.optionButtonSelected
                ]}
                onPress={() => updateWorkData('workHours', option)}
              >
                <Text style={[
                  styles.optionText,
                  workData.workHours === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Career Goals */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Career goals and aspirations</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share your professional ambitions and goals..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={workData.careerGoals}
            onChangeText={(text) => updateWorkData('careerGoals', text)}
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
            style={styles.completeButton}
            onPress={() => navigation.navigate('Matching')}
          >
            <Text style={styles.completeButtonText}>Complete Profile</Text>
            <Icon name="checkmark" size={20} color="#FFFFFF" />
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
    marginBottom: 32,
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    backgroundColor: '#f0ebf5',
    borderRadius: 12,
    padding: 4,
  },
  activeTab: {
    backgroundColor: '#FF3366',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5dbee',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dropdown: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5dbee',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#999',
    fontSize: 16,
  },
  dropdownTextFilled: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0ebf5',
    borderWidth: 1,
    borderColor: '#e5dbee',
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
  },
  optionText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  optionTextSelected: {
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3366',
    gap: 8,
  },
  backButtonText: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 2,
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});