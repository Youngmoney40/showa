import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HabitsScreen({ navigation }) {
  const [habits, setHabits] = useState({
    smoking: '',
    drinking: '',
    exercise: '',
    diet: '',
    sleep: '',
  });

  const updateHabits = (field, value) => {
    setHabits(prev => ({ ...prev, [field]: value }));
  };

  const habitOptions = {
    smoking: ['Non-smoker', 'Social smoker', 'Regular smoker', 'Trying to quit'],
    drinking: ['Non-drinker', 'Social drinker', 'Regular drinker', 'Sober'],
    exercise: ['Daily', 'Several times/week', 'Weekly', 'Occasionally', 'Never'],
    diet: ['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Gluten-free', 'No restrictions'],
    sleep: ['Early bird', 'Night owl', 'Flexible', 'Irregular'],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Lifestyle & Habits</Text>
          <Text style={styles.subText}>
            Share your daily habits and lifestyle preferences
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('BasicDetails')}
            >
              <Text style={styles.tabText}>Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Medical')}
            >
              <Text style={styles.tabText}>Medical</Text>
            </TouchableOpacity>
            {/* ... other tabs */}
          </View>
        </ScrollView>

        {/* Smoking */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Smoking habits</Text>
          <View style={styles.optionGrid}>
            {habitOptions.smoking.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  habits.smoking === option && styles.optionCardSelected
                ]}
                onPress={() => updateHabits('smoking', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  habits.smoking === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drinking */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Drinking habits</Text>
          <View style={styles.optionGrid}>
            {habitOptions.drinking.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  habits.drinking === option && styles.optionCardSelected
                ]}
                onPress={() => updateHabits('drinking', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  habits.drinking === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercise */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Exercise frequency</Text>
          <View style={styles.optionGrid}>
            {habitOptions.exercise.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  habits.exercise === option && styles.optionCardSelected
                ]}
                onPress={() => updateHabits('exercise', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  habits.exercise === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Diet */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary preferences</Text>
          <View style={styles.optionGrid}>
            {habitOptions.diet.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  habits.diet === option && styles.optionCardSelected
                ]}
                onPress={() => updateHabits('diet', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  habits.diet === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sleep schedule</Text>
          <View style={styles.optionGrid}>
            {habitOptions.sleep.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  habits.sleep === option && styles.optionCardSelected
                ]}
                onPress={() => updateHabits('sleep', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  habits.sleep === option && styles.optionCardTextSelected
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
            onPress={() => navigation.navigate('Medical')}
          >
            <Text style={styles.continueButtonText}>Continue to Medical</Text>
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
    marginBottom: 28,
  },
  label: {
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0ebf5',
    minWidth: '48%',
    flex: 1,
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