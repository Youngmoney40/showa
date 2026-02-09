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

export default function FamilyDetailsScreen({ navigation }) {
  const [familyData, setFamilyData] = useState({
    familyValues: '',
    children: '',
    wantChildren: '',
    parentsStatus: '',
    siblings: '',
  });

  const updateFamilyData = (field, value) => {
    setFamilyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Family Background</Text>
          <Text style={styles.subText}>
            Share about your family values and background to find compatible matches
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
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Family</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => navigation.navigate('WorkDetails')}
          >
            <Text style={styles.tabText}>Work</Text>
          </TouchableOpacity>
        </View>

        {/* Family Values */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Family values that are important to you</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Traditional, modern, religious, etc."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={familyData.familyValues}
            onChangeText={(text) => updateFamilyData('familyValues', text)}
          />
        </View>

        {/* Children */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Do you have children?</Text>
          <View style={styles.optionRow}>
            {['No children', '1 child', '2 children', '3+ children'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  familyData.children === option && styles.optionButtonSelected
                ]}
                onPress={() => updateFamilyData('children', option)}
              >
                <Text style={[
                  styles.optionText,
                  familyData.children === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Want Children */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Do you want (more) children?</Text>
          <View style={styles.optionRow}>
            {['Yes', 'No', 'Maybe', 'Not sure'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  familyData.wantChildren === option && styles.optionButtonSelected
                ]}
                onPress={() => updateFamilyData('wantChildren', option)}
              >
                <Text style={[
                  styles.optionText,
                  familyData.wantChildren === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Parents Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parents' status</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={familyData.parentsStatus ? styles.dropdownTextFilled : styles.dropdownText}>
              {familyData.parentsStatus || 'Select status'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Siblings */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of siblings</Text>
          <View style={styles.optionRow}>
            {['Only child', '1 sibling', '2 siblings', '3+ siblings'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  familyData.siblings === option && styles.optionButtonSelected
                ]}
                onPress={() => updateFamilyData('siblings', option)}
              >
                <Text style={[
                  styles.optionText,
                  familyData.siblings === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
            onPress={() => navigation.navigate('WorkDetails')}
          >
            <Text style={styles.continueButtonText}>Continue to Work</Text>
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
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});