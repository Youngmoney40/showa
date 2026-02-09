import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AboutMeScreen({ navigation }) {
  const [aboutMe, setAboutMe] = useState({
    headline: '',
    bio: '',
    lifePhilosophy: '',
    proudOf: '',
    lookingFor: '',
    funFact: '',
  });

  const [activeSection, setActiveSection] = useState('bio');
  const [characterCount, setCharacterCount] = useState(0);
  const maxBioLength = 500;

  const updateAboutMe = (field, value) => {
    setAboutMe(prev => ({ ...prev, [field]: value }));
    if (field === 'bio') {
      setCharacterCount(value.length);
    }
  };

  const sections = [
    { key: 'bio', icon: 'person', label: 'Bio', color: '#FF6B8B' },
    { key: 'philosophy', icon: 'brain', label: 'Philosophy', color: '#4ECDC4' },
    { key: 'proud', icon: 'trophy', label: 'Achievements', color: '#45B7D1' },
    { key: 'looking', icon: 'search', label: 'Looking For', color: '#96CEB4' },
    { key: 'fun', icon: 'sparkles', label: 'Fun Facts', color: '#FFBE76' },
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'bio':
        return {
          title: "Tell Your Story",
          placeholder: "What makes you unique? Share your passions, interests, and what drives you...",
          value: aboutMe.bio,
          field: 'bio',
          hint: "This is the first thing people will read about you!"
        };
      case 'philosophy':
        return {
          title: "Life Philosophy",
          placeholder: "What guides you in life? What values and principles are important to you?",
          value: aboutMe.lifePhilosophy,
          field: 'lifePhilosophy',
          hint: "Share what truly matters to you"
        };
      case 'proud':
        return {
          title: "Proud Achievements",
          placeholder: "What are you most proud of? Big accomplishments or small meaningful moments...",
          value: aboutMe.proudOf,
          field: 'proudOf',
          hint: "Celebrate your journey and growth"
        };
      case 'looking':
        return {
          title: "Looking For",
          placeholder: "Describe your ideal partner and the kind of relationship you're seeking...",
          value: aboutMe.lookingFor,
          field: 'lookingFor',
          hint: "Be specific about what you want"
        };
      case 'fun':
        return {
          title: "Fun Facts",
          placeholder: "Share something interesting, quirky, or unexpected about yourself...",
          value: aboutMe.funFact,
          field: 'funFact',
          hint: "What makes people smile when they learn about you?"
        };
      default:
        return {
          title: "Tell Your Story",
          placeholder: "Share what makes you special...",
          value: aboutMe.bio,
          field: 'bio',
          hint: "This is your chance to shine!"
        };
    }
  };

  const currentSection = getSectionContent();

  const writingTips = [
    "Be authentic and genuine in your writing",
    "Use specific examples and stories",
    "Show your personality through your words",
    "Keep it positive and engaging",
    "Don't be afraid to be vulnerable",
    "Highlight what makes you unique",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: '95%' }]} />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.header}>Your Story</Text>
            <Text style={styles.subText}>
              Share what makes you uniquely amazing
            </Text>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
            <View style={styles.tabRow}>
              <TouchableOpacity 
                style={styles.tab}
                onPress={() => navigation.navigate('Appearance')}
              >
                <Text style={styles.tabText}>Appearance</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.activeTab}>
                <Text style={styles.activeTabText}>About Me</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab}
                onPress={() => navigation.navigate('UploadImages')}
              >
                <Text style={styles.tabText}>Photos</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Headline Section */}
          <View style={styles.headlineSection}>
            <Text style={styles.sectionLabel}>Your Headline</Text>
            <TextInput
              style={styles.headlineInput}
              placeholder="Catchy phrase that captures your essence..."
              placeholderTextColor="#999"
              value={aboutMe.headline}
              onChangeText={(text) => updateAboutMe('headline', text)}
              maxLength={60}
            />
            <Text style={styles.headlineHint}>
              This appears at the top of your profile
            </Text>
          </View>

          {/* Section Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.sectionNav}
          >
            {sections.map((section) => (
              <TouchableOpacity
                key={section.key}
                style={[
                  styles.sectionButton,
                  activeSection === section.key && styles.sectionButtonActive,
                  activeSection === section.key && { borderColor: section.color }
                ]}
                onPress={() => setActiveSection(section.key)}
              >
                <MaterialIcons 
                  name={section.icon} 
                  size={20} 
                  color={activeSection === section.key ? section.color : '#666'} 
                />
                <Text style={[
                  styles.sectionButtonText,
                  activeSection === section.key && styles.sectionButtonTextActive,
                  activeSection === section.key && { color: section.color }
                ]}>
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Current Section Content */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{currentSection.title}</Text>
              {activeSection === 'bio' && (
                <Text style={styles.characterCount}>
                  {characterCount}/{maxBioLength}
                </Text>
              )}
            </View>

            <TextInput
              style={[
                styles.textArea,
                activeSection === 'bio' && styles.bioTextArea,
                activeSection !== 'bio' && styles.otherTextArea
              ]}
              placeholder={currentSection.placeholder}
              placeholderTextColor="#999"
              multiline
              numberOfLines={activeSection === 'bio' ? 8 : 5}
              textAlignVertical="top"
              value={currentSection.value}
              onChangeText={(text) => updateAboutMe(currentSection.field, text)}
              maxLength={activeSection === 'bio' ? maxBioLength : 1000}
            />

            <Text style={styles.sectionHint}>{currentSection.hint}</Text>
          </View>

          {/* Writing Tips */}
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FFD93D" />
              <Text style={styles.tipsTitle}>Writing Tips</Text>
            </View>
            <View style={styles.tipsGrid}>
              {writingTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={[styles.tipIcon, { backgroundColor: sections[index % sections.length].color }]}>
                    <Text style={styles.tipNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Preview Card */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Profile Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewName}>Your Name</Text>
                <Text style={styles.previewAge}>28</Text>
              </View>
              {aboutMe.headline ? (
                <Text style={styles.previewHeadline}>"{aboutMe.headline}"</Text>
              ) : (
                <Text style={styles.previewHeadlinePlaceholder}>Your headline will appear here</Text>
              )}
              {aboutMe.bio ? (
                <Text style={styles.previewBio} numberOfLines={3}>
                  {aboutMe.bio}
                </Text>
              ) : (
                <Text style={styles.previewBioPlaceholder}>
                  Your bio will give people a glimpse into your personality...
                </Text>
              )}
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
              style={[
                styles.continueButton,
               
              ]}
              onPress={() => navigation.navigate('UploadImages')}
              disabled={!aboutMe.headline || !aboutMe.bio}
            >
              <Text style={styles.continueButtonText}>
               Continue
              </Text>
              
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 32,
    fontWeight: '800',
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
  headlineSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  headlineInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#e5dbee',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headlineHint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionNav: {
    marginBottom: 24,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  sectionButtonTextActive: {
    fontWeight: '700',
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
//   characterCount: {
//     fontSize: 14,
//     color: characterCount > 450 ? '#FF3366' : '#666',
//     fontWeight: '600',
//   },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5dbee',
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  bioTextArea: {
    height: 200,
  },
  otherTextArea: {
    height: 150,
  },
  sectionHint: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  tipsGrid: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tipNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  previewAge: {
    fontSize: 16,
    color: '#666',
  },
  previewHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3366',
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewHeadlinePlaceholder: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  previewBioPlaceholder: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
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
  continueButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
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