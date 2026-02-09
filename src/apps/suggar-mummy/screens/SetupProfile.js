import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../globalshared/constants/colors';

export default function SetupProfileScreen({ navigation, route }) {
  const { status } = route.params || {};
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [income, setIncome] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [expectations, setExpectations] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showLifestyleModal, setShowLifestyleModal] = useState(false);

  const popularLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'
  ];

  const incomeRanges = [
    'Under ₦50K', '₦50K - ₦100K', '₦100K - ₦250K', '₦250K - ₦500K', 
    '₦500K - ₦1M', '₦1M - ₦10M', 'Over ₦10M', 'Prefer not to say'
  ];

  const lifestyleTypes = [
    'Luxury & High-End', 'Business Professional', 'Entrepreneurial', 
    'Creative & Artistic', 'Academic & Intellectual', 'Travel & Adventure',
    'Fitness & Wellness', 'Philanthropic', 'Discreet & Private'
  ];

  const getRoleSpecificData = () => {
    const roleData = {
      daddy: {
        title: "Sugar Daddy",
        description: "Establish your presence as a generous benefactor",
        incomeLabel: "Annual Income Range",
        incomeHint: "Helps companions understand your capacity for support",
        lifestyleLabel: "Lifestyle Type",
        jobHint: "e.g., CEO, Investor, Business Owner, Entrepreneur"
      },
      mummy: {
        title: "Sugar Mummy",
        description: "Create your profile as an established, caring benefactor",
        incomeLabel: "Annual Income Range", 
        incomeHint: "Shows your ability to provide support and experiences",
        lifestyleLabel: "Lifestyle Type",
        jobHint: "e.g., Executive, Business Owner, Investor, Professional"
      },
      boy: {
        title: "Sugar Boy", 
        description: "Showcase what makes you an appealing companion",
        incomeLabel: "Current Situation",
        incomeHint: "Helps benefactors understand how they can support you",
        lifestyleLabel: "Aspirational Lifestyle",
        jobHint: "e.g., Student, Model, Artist, Professional"
      },
      girl: {
        title: "Sugar Girl",
        description: "Highlight your qualities as a desirable companion",
        incomeLabel: "Current Situation", 
        incomeHint: "Shows where support can make the most impact",
        lifestyleLabel: "Aspirational Lifestyle",
        jobHint: "e.g., Student, Model, Dancer, Creative Professional"
      }
    };
    return roleData[status] || roleData.daddy;
  };

  const roleData = getRoleSpecificData();

  const handleLanguageSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  const handleIncomeSelect = (selectedIncome) => {
    setIncome(selectedIncome);
    setShowIncomeModal(false);
  };

  const handleLifestyleSelect = (selectedLifestyle) => {
    setLifestyle(selectedLifestyle);
    setShowLifestyleModal(false);
  };

  useEffect(() => {
    if (status) {
      console.log('Role selected:', status);
    }
  }, []);

  const renderDropdownModal = (title, items, selectedValue, onSelect, isVisible, onClose) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <Icon name="options-outline" size={24} color={Colors.white} />
                </View>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <Text style={styles.modalSubtitle}>
                    Select from available options
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Icon name="close" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={items}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      selectedValue === item && styles.listItemActive
                    ]}
                    onPress={() => onSelect(item)}
                  >
                    <Text style={[
                      styles.listText,
                      selectedValue === item && styles.listTextActive
                    ]}>
                      {item}
                    </Text>
                    {selectedValue === item && (
                      <Icon name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 1 of 6</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <View style={styles.titleSection}>
          <View style={styles.titleIcon}>
            <Icon name="diamond-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>
            Create Your {roleData.title} Profile
          </Text>
          <Text style={styles.subtitle}>
            {roleData.description}. Share authentic information to attract compatible matches.
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Preferred Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What should your matches call you?"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Primary Language</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.selectorLeft}>
                <Icon name="language-outline" size={20} color={Colors.primary} />
                <Text style={[
                  styles.selectorText,
                  language && styles.selectorTextSelected
                ]}>
                  {language || 'Select your language'}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor={Colors.textTertiary}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Occupation & Background</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={roleData.jobHint}
              placeholderTextColor={Colors.textTertiary}
              value={job}
              onChangeText={setJob}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{roleData.incomeLabel}</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowIncomeModal(true)}
            >
              <View style={styles.selectorLeft}>
                <Icon name="cash-outline" size={20} color={Colors.primary} />
                <Text style={[
                  styles.selectorText,
                  income && styles.selectorTextSelected
                ]}>
                  {income || 'Select income range'}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
            <Text style={styles.hintText}>{roleData.incomeHint}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{roleData.lifestyleLabel}</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowLifestyleModal(true)}
            >
              <View style={styles.selectorLeft}>
                <Icon name="sparkles-outline" size={20} color={Colors.primary} />
                <Text style={[
                  styles.selectorText,
                  lifestyle && styles.selectorTextSelected
                ]}>
                  {lifestyle || 'Select lifestyle type'}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Relationship Expectations</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What are you looking for in this arrangement? (e.g., mentorship, travel companion, emotional connection, financial support)"
              placeholderTextColor={Colors.textTertiary}
              value={expectations}
              onChangeText={setExpectations}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.infoBox}>
            <Icon name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>
              Your information is secure and only shared with verified, compatible matches. 
              Be authentic to attract the right connections.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!name || !language || !age) && styles.primaryButtonDisabled
            ]}
            

            
                onPress={() =>
                navigation.navigate('SugarMatchingPreferences', { 
                    status: status,
                    name: name,
                    language: language, 
                    age: age,
                    job: job,
                    income: income,
                    lifestyle: lifestyle,
                    expectations: expectations
                })
                }
            disabled={!name || !language || !age}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Icon name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {renderDropdownModal(
        "Select Language",
        popularLanguages,
        language,
        handleLanguageSelect,
        showLanguageModal,
        () => setShowLanguageModal(false)
      )}

      {renderDropdownModal(
        "Income Range",
        incomeRanges,
        income,
        handleIncomeSelect,
        showIncomeModal,
        () => setShowIncomeModal(false)
      )}

      {renderDropdownModal(
        "Lifestyle Type",
        lifestyleTypes,
        lifestyle,
        handleLifestyleSelect,
        showLifestyleModal,
        () => setShowLifestyleModal(false)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 30,
    marginTop: 10,
  },
  titleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  selectorTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    paddingTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonSection: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 0,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 24,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  listContent: {
    padding: 16,
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listItemActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderColor: Colors.primary,
  },
  listText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  listTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});