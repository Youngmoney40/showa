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

export default function PreferencesScreen({ navigation }) {
  const [preferences, setPreferences] = useState({
    ageRange: { min: 25, max: 35 },
    distance: 50,
    relationshipGoals: '',
    dealBreakers: '',
    communicationStyle: '',
    personalityTraits: [],
  });

  const relationshipGoals = ['Marriage', 'Long-term relationship', 'Casual dating', 'Friendship', 'Not sure'];
  const communicationStyles = ['Frequent texter', 'Phone calls', 'In-person only', 'Mixed', 'Slow to respond'];
  const personalityTraits = ['Adventurous', 'Ambitious', 'Compassionate', 'Funny', 'Intellectual', 'Spontaneous', 'Traditional', 'Creative'];

  const toggleTrait = (trait) => {
    setPreferences(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter(item => item !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Your Preferences</Text>
          <Text style={styles.subText}>
            Tell us what you're looking for in a partner
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Hobbies')}
            >
              <Text style={styles.tabText}>Hobbies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Appearance')}
            >
              <Text style={styles.tabText}>Appearance</Text>
            </TouchableOpacity>
            {/* ... other tabs */}
          </View>
        </ScrollView>

        {/* Age Range */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Age Range</Text>
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeValue}>{preferences.ageRange.min}</Text>
            <Text style={styles.rangeDash}>-</Text>
            <Text style={styles.rangeValue}>{preferences.ageRange.max}</Text>
          </View>
          <View style={styles.sliderContainer}>
            {/* Slider would be implemented here */}
            <Text style={styles.sliderHint}>Drag to adjust age range</Text>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum Distance</Text>
          <Text style={styles.distanceValue}>{preferences.distance} miles</Text>
          <View style={styles.sliderContainer}>
            {/* Slider would be implemented here */}
            <Text style={styles.sliderHint}>Adjust distance preference</Text>
          </View>
        </View>

        {/* Relationship Goals */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relationship Goals</Text>
          <View style={styles.optionGrid}>
            {relationshipGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionCard,
                  preferences.relationshipGoals === goal && styles.optionCardSelected
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, relationshipGoals: goal }))}
              >
                <Text style={[
                  styles.optionCardText,
                  preferences.relationshipGoals === goal && styles.optionCardTextSelected
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferred Personality Traits */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Personality Traits</Text>
          <View style={styles.traitGrid}>
            {personalityTraits.map((trait) => (
              <TouchableOpacity
                key={trait}
                style={[
                  styles.traitButton,
                  preferences.personalityTraits.includes(trait) && styles.traitButtonSelected
                ]}
                onPress={() => toggleTrait(trait)}
              >
                <Text style={[
                  styles.traitText,
                  preferences.personalityTraits.includes(trait) && styles.traitTextSelected
                ]}>
                  {trait}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Communication Style */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Communication Style</Text>
          <View style={styles.optionGrid}>
            {communicationStyles.map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.optionCard,
                  preferences.communicationStyle === style && styles.optionCardSelected
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, communicationStyle: style }))}
              >
                <Text style={[
                  styles.optionCardText,
                  preferences.communicationStyle === style && styles.optionCardTextSelected
                ]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Deal Breakers */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deal Breakers</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What are your absolute deal breakers?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={preferences.dealBreakers}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, dealBreakers: text }))}
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
            onPress={() => navigation.navigate('Apperance')}
          >
            <Text style={styles.continueButtonText}>Continue to Appearance</Text>
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
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  rangeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF3366',
    minWidth: 40,
    textAlign: 'center',
  },
  rangeDash: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3366',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5dbee',
  },
  sliderHint: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  traitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  traitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0ebf5',
  },
  traitButtonSelected: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
  },
  traitText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  traitTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // ... other styles
});