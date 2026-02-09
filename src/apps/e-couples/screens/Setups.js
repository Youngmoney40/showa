import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BasicDetailsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    location: '',
    nationality: '',
  });

  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  const ages = Array.from({ length: 83 }, (_, i) => (i + 18).toString());
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const nationalities = ['American', 'British', 'Canadian', 'Australian', 'Indian', 'Chinese', 'French', 'German', 'Other'];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderDropdownItem = (item, onSelect, currentValue) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        currentValue === item && styles.dropdownItemSelected
      ]}
      onPress={() => {
        onSelect(item);
        setShowAgeDropdown(false);
        setShowGenderDropdown(false);
        setShowNationalityDropdown(false);
      }}
    >
      <Text style={[
        styles.dropdownItemText,
        currentValue === item && styles.dropdownItemTextSelected
      ]}>
        {item}
      </Text>
      {currentValue === item && (
        <Icon name="checkmark" size={20} color="#FF3366" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Tell us about yourself</Text>
          <Text style={styles.subText}>
            This won't take long—just a few simple steps to ensure you get the best experience
          </Text>
        </View>

        {/* Enhanced Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Basic Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Habits')}
            >
              <Text style={styles.tabText}>Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Medical')}
            >
              <Text style={styles.tabText}>Medical</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Sexuality')}
            >
              <Text style={styles.tabText}>Sexuality</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Hobbies')}
            >
              <Text style={styles.tabText}>Hobbies</Text>
            </TouchableOpacity> */}
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Preference')}
            >
              <Text style={styles.tabText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Appearance')}
            >
              <Text style={styles.tabText}>Appearance</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('AboutMe')}
            >
              <Text style={styles.tabText}>About Me</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('UploadPhotos')}
            >
              <Text style={styles.tabText}>Photos</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What is your full name? Surname first</Text>
          <TextInput
            style={styles.input}
            placeholder="Amusa Edward"
            placeholderTextColor="#999"
            value={formData.fullName}
            onChangeText={(text) => updateFormData('fullName', text)}
          />
          <Text style={styles.hint}>This is the name others will see on your profile</Text>
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your age</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowAgeDropdown(true)}
          >
            <Text style={formData.age ? styles.dropdownTextFilled : styles.dropdownText}>
              {formData.age || 'Select your age'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What is your gender?</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowGenderDropdown(true)}
          >
            <Text style={formData.gender ? styles.dropdownTextFilled : styles.dropdownText}>
              {formData.gender || 'Select your gender'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Where are you located?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            placeholderTextColor="#999"
            value={formData.location}
            onChangeText={(text) => updateFormData('location', text)}
          />
         
        </View>

        {/* Nationality */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select your nationality</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowNationalityDropdown(true)}
          >
            <Text style={formData.nationality ? styles.dropdownTextFilled : styles.dropdownText}>
              {formData.nationality || 'Select your nationality'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('Habits')}
        >
          <Text style={styles.continueButtonText}>Continue to Habits</Text>
          <Icon name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Age Dropdown Modal */}
      <Modal
        visible={showAgeDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAgeDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Age</Text>
              <TouchableOpacity onPress={() => setShowAgeDropdown(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={ages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderDropdownItem(item, (value) => updateFormData('age', value), formData.age)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Gender Dropdown Modal */}
      <Modal
        visible={showGenderDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderDropdown(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genders}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderDropdownItem(item, (value) => updateFormData('gender', value), formData.gender)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Nationality Dropdown Modal */}
      <Modal
        visible={showNationalityDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNationalityDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Nationality</Text>
              <TouchableOpacity onPress={() => setShowNationalityDropdown(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={nationalities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderDropdownItem(item, (value) => updateFormData('nationality', value), formData.nationality)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
    width: '12%',
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
    marginBottom: 8,
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
  hint: {
    fontSize: 13,
    color: '#777',
    marginTop: 6,
    fontStyle: 'italic',
  },
  dropdown: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5dbee',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  mapSelect: {
    color: '#FF3366',
    fontWeight: '600',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemSelected: {
    backgroundColor: '#fff5f7',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#FF3366',
    fontWeight: '600',
  },
});