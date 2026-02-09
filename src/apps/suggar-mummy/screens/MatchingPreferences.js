import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

export default function MatchingPreferencesScreen({ navigation, route }) {
  const { 
    status, 
    name, 
    language, 
    age, 
    job, 
    income, 
    lifestyle, 
    expectations,
    profileData 
  } = route.params || {};

  // Age Range
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  // Location Preferences
  const [locationType, setLocationType] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [preferredCities, setPreferredCities] = useState([]);
  const [currentCity, setCurrentCity] = useState('');

  // Relationship Preferences
  const [relationshipGoals, setRelationshipGoals] = useState([]);
  const [arrangementType, setArrangementType] = useState('');
  const [meetingFrequency, setMeetingFrequency] = useState('');

  // Physical Preferences
  const [bodyType, setBodyType] = useState('');
  const [heightRange, setHeightRange] = useState('');
  const [ethnicity, setEthnicity] = useState([]);

  // Lifestyle & Personality
  const [educationLevel, setEducationLevel] = useState('');
  const [smokingPreference, setSmokingPreference] = useState('');
  const [drinkingPreference, setDrinkingPreference] = useState('');
  const [personalityTraits, setPersonalityTraits] = useState([]);

  // Modal States - FIXED: Added missing modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showBodyTypeModal, setShowBodyTypeModal] = useState(false);
  const [showEthnicityModal, setShowEthnicityModal] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showArrangementModal, setShowArrangementModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSmokingModal, setShowSmokingModal] = useState(false);
  const [showDrinkingModal, setShowDrinkingModal] = useState(false);

  // Options Data
  const locationTypes = [
    'Same City', 'Same Country', 'Anywhere', 'Specific Cities'
  ];

  const distanceOptions = ['10 miles', '25 miles', '50 miles', '100 miles', '250 miles', 'Any distance'];

  const relationshipGoalsOptions = [
    'Long-term Arrangement',
    'Short-term Fun',
    'Travel Companion',
    'Mentorship',
    'Emotional Connection',
    'Social Events Partner',
    'Discreet Relationship',
    'Marriage Potential',
    'Casual Dating',
    'Experience Sharing'
  ];

  const arrangementTypes = [
    'Monthly Allowance',
    'Per Meeting',
    'Gifts & Experiences',
    'Travel Opportunities',
    'Career Support',
    'Educational Support',
    'Lifestyle Support',
    'Flexible Arrangement'
  ];

  const meetingFrequencies = [
    'Once a week',
    '2-3 times a week',
    'Once every 2 weeks',
    'Once a month',
    'Flexible',
    'On demand'
  ];

  const bodyTypes = [
    'Slim', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Plus Size', 'Any'
  ];

  const heightRanges = [
    "Under 5'0\"", "5'0\" - 5'4\"", "5'4\" - 5'8\"", "5'8\" - 6'0\"", 
    "6'0\" - 6'4\"", "Over 6'4\"", "Any height"
  ];

  const ethnicityOptions = [
    'Asian', 'Black/African', 'Caucasian/White', 'Hispanic/Latino', 
    'Middle Eastern', 'Mixed Race', 'Native American', 'Pacific Islander', 'Any'
  ];

  const educationLevels = [
    'High School', 'Some College', "Bachelor's Degree", "Master's Degree", 
    'Doctorate', 'Prefer not to say', 'Any'
  ];

  const smokingPreferences = ['Non-smoker', 'Social smoker', 'Smoker', 'Any'];
  const drinkingPreferences = ['Non-drinker', 'Social drinker', 'Drinker', 'Any'];

  const personalityTraitsOptions = [
    'Ambitious', 'Adventurous', 'Artsy', 'Compassionate', 'Confident',
    'Family-oriented', 'Funny', 'Generous', 'Intellectual', 'Loyal',
    'Outgoing', 'Reserved', 'Romantic', 'Spontaneous', 'Traditional'
  ];

  const getRoleSpecificPreferences = () => {
    const preferences = {
      daddy: {
        title: "What kind of Sugar Baby are you looking for?",
        description: "Set your preferences to see compatible Sugar Babies who match your ideal criteria",
        ageLabel: "Preferred Age Range",
        defaultMinAge: "18",
        defaultMaxAge: "35"
      },
      mummy: {
        title: "What kind of Sugar Partner are you seeking?",
        description: "Define your preferences to connect with suitable companions",
        ageLabel: "Preferred Age Range", 
        defaultMinAge: "21",
        defaultMaxAge: "45"
      },
      boy: {
        title: "What type of Sugar Mummy interests you?",
        description: "Set your preferences to match with compatible benefactors",
        ageLabel: "Preferred Age Range",
        defaultMinAge: "30",
        defaultMaxAge: "65"
      },
      girl: {
        title: "What kind of Sugar Daddy are you looking for?",
        description: "Define your ideal match to see compatible benefactors",
        ageLabel: "Preferred Age Range",
        defaultMinAge: "35",
        defaultMaxAge: "70"
      }
    };
    return preferences[status] || preferences.daddy;
  };

  const rolePrefs = getRoleSpecificPreferences();

  const handleGoalSelect = (goal) => {
    setRelationshipGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(item => item !== goal);
      } else if (prev.length < 5) {
        return [...prev, goal];
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 relationship goals');
        return prev;
      }
    });
  };

  const handleEthnicitySelect = (ethnic) => {
    setEthnicity(prev => {
      if (prev.includes(ethnic)) {
        return prev.filter(item => item !== ethnic);
      } else if (prev.length < 3) {
        return [...prev, ethnic];
      } else {
        Alert.alert('Limit Reached', 'You can select up to 3 ethnic preferences');
        return prev;
      }
    });
  };

  const handlePersonalitySelect = (trait) => {
    setPersonalityTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(item => item !== trait);
      } else if (prev.length < 5) {
        return [...prev, trait];
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 personality traits');
        return prev;
      }
    });
  };

  const addCity = () => {
    if (currentCity.trim() && preferredCities.length < 5) {
      setPreferredCities(prev => [...prev, currentCity.trim()]);
      setCurrentCity('');
    } else if (preferredCities.length >= 5) {
      Alert.alert('Limit Reached', 'You can add up to 5 preferred cities');
    }
  };

  const removeCity = (cityToRemove) => {
    setPreferredCities(prev => prev.filter(city => city !== cityToRemove));
  };

  const isFormComplete = () => {
    return minAge && maxAge && locationType && relationshipGoals.length > 0;
  };

  const handleCompleteProfile = () => {
    const preferences = {
      ageRange: { min: parseInt(minAge), max: parseInt(maxAge) },
      location: {
        type: locationType,
        maxDistance: maxDistance,
        preferredCities: preferredCities
      },
      relationship: {
        goals: relationshipGoals,
        arrangementType: arrangementType,
        meetingFrequency: meetingFrequency
      },
      physical: {
        bodyType: bodyType,
        heightRange: heightRange,
        ethnicity: ethnicity
      },
      lifestyle: {
        educationLevel: educationLevel,
        smoking: smokingPreference,
        drinking: drinkingPreference,
        personality: personalityTraits
      }
    };
        
    navigation.navigate('SugarCompleteProfileSetup', {
      status,
      name,
      language, 
      age,
      job,
      income,
      lifestyle,
      expectations,
      matchingPreferences: preferences
    });
  };

  const renderMultiSelectModal = (title, items, selectedItems, onSelect, isVisible, onClose, maxSelections = 5) => (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.multiSelectModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalSubtitle}>
              Select up to {maxSelections} options
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.multiSelectItem,
                  selectedItems.includes(item) && styles.multiSelectItemActive
                ]}
                onPress={() => onSelect(item)}
              >
                <Text style={[
                  styles.multiSelectText,
                  selectedItems.includes(item) && styles.multiSelectTextActive
                ]}>
                  {item}
                </Text>
                {selectedItems.includes(item) && (
                  <Icon name="check" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.multiSelectList}
          />
          
          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountText}>
              {selectedItems.length}/{maxSelections} selected
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSingleSelectModal = (title, items, selectedValue, onSelect, isVisible, onClose) => (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.singleSelectModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.singleSelectItem,
                  selectedValue === item && styles.singleSelectItemActive
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.singleSelectText,
                  selectedValue === item && styles.singleSelectTextActive
                ]}>
                  {item}
                </Text>
                {selectedValue === item && (
                  <Icon name="check" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '90%' }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View style={styles.titleIcon}>
            <Icon name="filter-alt" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{rolePrefs.title}</Text>
          <Text style={styles.subtitle}>
            {rolePrefs.description}. Your preferences help us show you the most compatible matches.
          </Text>
        </View>

        {/* Age Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{rolePrefs.ageLabel} *</Text>
          <View style={styles.ageContainer}>
            <View style={styles.ageInputContainer}>
              <Text style={styles.ageLabel}>From</Text>
              <TextInput
                style={styles.ageInput}
                placeholder={rolePrefs.defaultMinAge}
                value={minAge}
                onChangeText={setMinAge}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.ageSuffix}>years</Text>
            </View>
            <Text style={styles.ageSeparator}>to</Text>
            <View style={styles.ageInputContainer}>
              <Text style={styles.ageLabel}>To</Text>
              <TextInput
                style={styles.ageInput}
                placeholder={rolePrefs.defaultMaxAge}
                value={maxAge}
                onChangeText={setMaxAge}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.ageSuffix}>years</Text>
            </View>
          </View>
        </View>

        {/* Location Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Preferences *</Text>
          
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowLocationModal(true)}
          >
            <Icon name="location-on" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {locationType || 'Select location preference'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>

          {locationType === 'Specific Cities' && (
            <View style={styles.citiesSection}>
              <Text style={styles.citiesLabel}>Preferred Cities</Text>
              <View style={styles.cityInputContainer}>
                <TextInput
                  style={styles.cityInput}
                  placeholder="Enter city name"
                  value={currentCity}
                  onChangeText={setCurrentCity}
                />
                <TouchableOpacity style={styles.addCityButton} onPress={addCity}>
                  <Icon name="add" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.citiesList}>
                {preferredCities.map((city, index) => (
                  <View key={index} style={styles.cityTag}>
                    <Text style={styles.cityTagText}>{city}</Text>
                    <TouchableOpacity onPress={() => removeCity(city)}>
                      <Icon name="close" size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {locationType && locationType !== 'Anywhere' && (
            <View style={styles.distanceSection}>
              <Text style={styles.distanceLabel}>Maximum Distance</Text>
              <View style={styles.distanceOptions}>
                {distanceOptions.map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.distanceOption,
                      maxDistance === distance && styles.distanceOptionActive
                    ]}
                    onPress={() => setMaxDistance(distance)}
                  >
                    <Text style={[
                      styles.distanceOptionText,
                      maxDistance === distance && styles.distanceOptionTextActive
                    ]}>
                      {distance}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Relationship Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relationship Goals *</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowGoalsModal(true)}
          >
            <Icon name="favorite" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {relationshipGoals.length > 0 
                ? `${relationshipGoals.length} goals selected` 
                : 'Select relationship goals'
              }
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
          {relationshipGoals.length > 0 && (
            <View style={styles.selectedItems}>
              {relationshipGoals.map((goal, index) => (
                <View key={index} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{goal}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arrangement Type</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowArrangementModal(true)}
          >
            <Icon name="attach-money" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {arrangementType || 'Select arrangement type'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Frequency</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowMeetingModal(true)}
          >
            <Icon name="event" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {meetingFrequency || 'Select meeting frequency'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Physical Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Preferences</Text>
          
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowBodyTypeModal(true)}
          >
            <Icon name="fitness-center" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {bodyType || 'Select body type preference'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.selector, styles.selectorMargin]}
            onPress={() => setShowHeightModal(true)}
          >
            <Icon name="straighten" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {heightRange || 'Select height preference'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowEthnicityModal(true)}
          >
            <Icon name="public" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {ethnicity.length > 0 
                ? `${ethnicity.length} ethnicities selected` 
                : 'Select ethnicity preferences'
              }
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
          {ethnicity.length > 0 && (
            <View style={styles.selectedItems}>
              {ethnicity.map((ethnic, index) => (
                <View key={index} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{ethnic}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Lifestyle Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle & Personality</Text>
          
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowEducationModal(true)}
          >
            <Icon name="school" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {educationLevel || 'Select education preference'}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.lifestyleRow}>
            <TouchableOpacity 
              style={[styles.selector, styles.halfSelector]}
              onPress={() => setShowSmokingModal(true)}
            >
              <Icon name="smoking-rooms" size={20} color={Colors.primary} />
              <Text style={styles.selectorText}>
                {smokingPreference || 'Smoking'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.selector, styles.halfSelector]}
              onPress={() => setShowDrinkingModal(true)}
            >
              <Icon name="local-bar" size={20} color={Colors.primary} />
              <Text style={styles.selectorText}>
                {drinkingPreference || 'Drinking'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowPersonalityModal(true)}
          >
            <Icon name="psychology" size={20} color={Colors.primary} />
            <Text style={styles.selectorText}>
              {personalityTraits.length > 0 
                ? `${personalityTraits.length} traits selected` 
                : 'Select personality traits'
              }
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
          {personalityTraits.length > 0 && (
            <View style={styles.selectedItems}>
              {personalityTraits.map((trait, index) => (
                <View key={index} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{trait}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Icon name="info" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>
            Your preferences are used to show you the most compatible matches. 
            You can adjust these anytime in your settings.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !isFormComplete() && styles.continueButtonDisabled]}
          onPress={handleCompleteProfile}
          disabled={!isFormComplete()}
        >
          <LinearGradient
            colors={isFormComplete() ? [Colors.primary, '#FF6F00'] : ['#CCC', '#999']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Set Preferences</Text>
            <Icon name="arrow-forward" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modals - FIXED: All modals properly connected to their state */}
      {renderSingleSelectModal(
        'Location Preference',
        locationTypes,
        locationType,
        setLocationType,
        showLocationModal,
        () => setShowLocationModal(false)
      )}

      {renderMultiSelectModal(
        'Relationship Goals',
        relationshipGoalsOptions,
        relationshipGoals,
        handleGoalSelect,
        showGoalsModal,
        () => setShowGoalsModal(false),
        5
      )}

      {renderSingleSelectModal(
        'Arrangement Type',
        arrangementTypes,
        arrangementType,
        setArrangementType,
        showArrangementModal,
        () => setShowArrangementModal(false)
      )}

      {renderSingleSelectModal(
        'Meeting Frequency',
        meetingFrequencies,
        meetingFrequency,
        setMeetingFrequency,
        showMeetingModal,
        () => setShowMeetingModal(false)
      )}

      {renderSingleSelectModal(
        'Body Type Preference',
        bodyTypes,
        bodyType,
        setBodyType,
        showBodyTypeModal,
        () => setShowBodyTypeModal(false)
      )}

      {renderSingleSelectModal(
        'Height Range',
        heightRanges,
        heightRange,
        setHeightRange,
        showHeightModal,
        () => setShowHeightModal(false)
      )}

      {renderMultiSelectModal(
        'Ethnicity Preferences',
        ethnicityOptions,
        ethnicity,
        handleEthnicitySelect,
        showEthnicityModal,
        () => setShowEthnicityModal(false),
        3
      )}

      {renderSingleSelectModal(
        'Education Level',
        educationLevels,
        educationLevel,
        setEducationLevel,
        showEducationModal,
        () => setShowEducationModal(false)
      )}

      {renderSingleSelectModal(
        'Smoking Preference',
        smokingPreferences,
        smokingPreference,
        setSmokingPreference,
        showSmokingModal,
        () => setShowSmokingModal(false)
      )}

      {renderSingleSelectModal(
        'Drinking Preference',
        drinkingPreferences,
        drinkingPreference,
        setDrinkingPreference,
        showDrinkingModal,
        () => setShowDrinkingModal(false)
      )}

      {renderMultiSelectModal(
        'Personality Traits',
        personalityTraitsOptions,
        personalityTraits,
        handlePersonalitySelect,
        showPersonalityModal,
        () => setShowPersonalityModal(false),
        5
      )}
    </View>
  );
}

// ... keep your existing styles the same ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  progressContainer: {
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  ageInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textPrimary,
    width: 80,
  },
  ageSuffix: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  ageSeparator: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginHorizontal: 15,
    marginTop: 20,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectorMargin: {
    marginTop: 8,
  },
  selectorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  citiesSection: {
    marginTop: 12,
  },
  citiesLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  addCityButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  cityTagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  distanceSection: {
    marginTop: 12,
  },
  distanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  distanceOption: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  distanceOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  distanceOptionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  distanceOptionTextActive: {
    color: Colors.white,
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectedTag: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  lifestyleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfSelector: {
    flex: 0.48,
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
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  multiSelectModal: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  singleSelectModal: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  multiSelectList: {
    padding: 16,
  },
  multiSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  multiSelectItemActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderColor: Colors.primary,
  },
  multiSelectText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  multiSelectTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  singleSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  singleSelectItemActive: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  singleSelectText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  singleSelectTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  selectedCount: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  selectedCountText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});