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
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const popularLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian',
    'Dutch', 'Turkish', 'Vietnamese', 'Thai', 'Indonesian', 'Malay',
    'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech',
    'Hungarian', 'Greek', 'Hebrew', 'Persian', 'Urdu', 'Bengali',
    'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi', 'Kannada',
    'Malayalam', 'Sinhala', 'Burmese', 'Khmer', 'Lao', 'Tagalog',
    'Ukrainian', 'Romanian', 'Bulgarian', 'Serbian', 'Croatian', 'Slovak'
  ];

  const handleLanguageSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIcon}>
                    <Icon name="language-outline" size={24} color={Colors.white} />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>Select Language</Text>
                    <Text style={styles.modalSubtitle}>
                      Choose your primary language
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowLanguageModal(false)}
                  >
                    <Icon name="close" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>

              <FlatList
                data={popularLanguages}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.languagesList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      language === item && styles.languageItemActive
                    ]}
                    onPress={() => handleLanguageSelect(item)}
                  >
                    <Text style={[
                      styles.languageText,
                      language === item && styles.languageTextActive
                    ]}>
                      {item}
                    </Text>
                    {language === item && (
                      <Icon name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ListHeaderComponent={
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Languages</Text>
                    <Text style={styles.sectionSubtitle}>
                      {popularLanguages.length} languages available
                    </Text>
                  </View>
                }
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
            <Icon name="person-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>
            Let's set up your Talker profile
          </Text>
          <Text style={styles.subtitle}>
            Share a bit about yourself to help us match you with the perfect listener. This will only take a few minutes!
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Name or Nickname</Text>
            <TextInput
              style={styles.input}
              placeholder="What should we call you?"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Primary Language</Text>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.languageSelectorLeft}>
                <Icon name="language-outline" size={20} color={Colors.primary} />
                <Text style={[
                  styles.languageSelectorText,
                  language && styles.languageSelectorTextSelected
                ]}>
                  {language || 'Select your language'}
                </Text>
              </View>
              <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
            {language && (
              <View style={styles.selectedLanguageBadge}>
                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.selectedLanguageText}>
                  {language} selected
                </Text>
              </View>
            )}
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
            <Text style={styles.inputLabel}>About Your Work</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What do you do? (Optional)"
              placeholderTextColor={Colors.textTertiary}
              value={job}
              onChangeText={setJob}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.infoBox}>
            <Icon name="information-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>
              This information helps us match you with listeners who understand your background and experiences.
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
              navigation.navigate(
                'CUploadPicture',
                {
                  status: status,
                  name: name,
                  language: language, 
                  age: age,
                  job: job
                })
            }
            disabled={!name || !language || !age}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Icon name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <LanguageModal />
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
    fontFamily: 'Lato-Bold'
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
  // Language Selector Styles
  languageSelector: {
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
  languageSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageSelectorText: {
    fontSize: 16,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  languageSelectorTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  selectedLanguageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  selectedLanguageText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    paddingTop: 16,
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
  // Modal Styles
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  languagesList: {
    padding: 16,
    maxHeight: 400,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  languageItem: {
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
  languageItemActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderColor: Colors.primary,
  },
  languageText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  languageTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  customLanguageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  customLanguageText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  success: {
    color: Colors.success,
  },
});