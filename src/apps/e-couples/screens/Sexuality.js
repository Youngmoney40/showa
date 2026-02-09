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

export default function HobbiesScreen({ navigation }) {
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const hobbyCategories = [
    {
      title: 'Outdoor & Adventure',
      hobbies: ['Hiking', 'Camping', 'Cycling', 'Running', 'Rock climbing', 'Swimming', 'Skiing', 'Surfing']
    },
    {
      title: 'Creative & Arts',
      hobbies: ['Painting', 'Photography', 'Writing', 'Playing music', 'Dancing', 'Cooking', 'Pottery', 'Singing']
    },
    {
      title: 'Social & Entertainment',
      hobbies: ['Board games', 'Video games', 'Movies', 'Concerts', 'Dining out', 'Traveling', 'Reading', 'Theater']
    },
    {
      title: 'Sports & Fitness',
      hobbies: ['Yoga', 'Gym workouts', 'Team sports', 'Martial arts', 'Dance fitness', 'Pilates', 'Crossfit', 'Meditation']
    },
    {
      title: 'Learning & Development',
      hobbies: ['Learning languages', 'Online courses', 'Book clubs', 'Museums', 'Workshops', 'Podcasts', 'Documentaries']
    }
  ];

  const toggleHobby = (hobby) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) 
        ? prev.filter(item => item !== hobby)
        : [...prev, hobby]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '62%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Hobbies & Interests</Text>
          <Text style={styles.subText}>
            Select activities you enjoy to find like-minded matches
          </Text>
          <Text style={styles.selectedCount}>
            {selectedHobbies.length} hobbies selected
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Sexuality')}
            >
              <Text style={styles.tabText}>Sexuality</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Hobbies</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Preferences')}
            >
              <Text style={styles.tabText}>Preferences</Text>
            </TouchableOpacity>
            {/* ... other tabs */}
          </View>
        </ScrollView>

        {/* Hobby Categories */}
        {hobbyCategories.map((category, index) => (
          <View key={category.title} style={styles.categoryGroup}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.hobbyGrid}>
              {category.hobbies.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  style={[
                    styles.hobbyButton,
                    selectedHobbies.includes(hobby) && styles.hobbyButtonSelected
                  ]}
                  onPress={() => toggleHobby(hobby)}
                >
                  <Text style={[
                    styles.hobbyText,
                    selectedHobbies.includes(hobby) && styles.hobbyTextSelected
                  ]}>
                    {hobby}
                  </Text>
                  {selectedHobbies.includes(hobby) && (
                    <Icon name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

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
              selectedHobbies.length === 0 && styles.continueButtonDisabled
            ]}
            onPress={() => navigation.navigate('Preference')}
            disabled={selectedHobbies.length === 0}
          >
            <Text style={styles.continueButtonText}>
              {selectedHobbies.length === 0 ? 'Select hobbies' : 'Continue to Preferences'}
            </Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  container: {
    flex: 1,
    backgroundColor: '#faf7fc',
  },
  selectedCount: {
    textAlign: 'center',
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryGroup: {
    marginBottom: 28,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  hobbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hobbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0ebf5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  hobbyButtonSelected: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  hobbyText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  hobbyTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
  },
  // ... other styles
});