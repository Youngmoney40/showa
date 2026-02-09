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

export default function AppearanceScreen({ navigation }) {
  const [appearance, setAppearance] = useState({
    height: '',
    bodyType: '',
    hairColor: '',
    eyeColor: '',
    style: '',
  });

  const updateAppearance = (field, value) => {
    setAppearance(prev => ({ ...prev, [field]: value }));
  };

  const heightOptions = ["4'0\" - 4'5\"", "4'6\" - 4'11\"", "5'0\" - 5'5\"", "5'6\" - 5'11\"", "6'0\" - 6'5\"", "6'6\" and above"];
  const bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Plus size'];
  const hairColorOptions = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray', 'Bald', 'Other'];
  const eyeColorOptions = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'];
  const styleOptions = ['Casual', 'Professional', 'Bohemian', 'Athletic', 'Alternative', 'Classic', 'Trendy'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '87%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Appearance</Text>
          <Text style={styles.subText}>
            Share your physical appearance to help others recognize you
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('Preferences')}
            >
              <Text style={styles.tabText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Appearance</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('AboutMe')}
            >
              <Text style={styles.tabText}>About Me</Text>
            </TouchableOpacity>
            {/* ... other tabs */}
          </View>
        </ScrollView>

        {/* Height */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.optionGrid}>
            {heightOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  appearance.height === option && styles.optionCardSelected
                ]}
                onPress={() => updateAppearance('height', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  appearance.height === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Body Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Body Type</Text>
          <View style={styles.optionGrid}>
            {bodyTypeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  appearance.bodyType === option && styles.optionCardSelected
                ]}
                onPress={() => updateAppearance('bodyType', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  appearance.bodyType === option && styles.optionCardTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hair Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hair Color</Text>
          <View style={styles.colorGrid}>
            {hairColorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  appearance.hairColor === color && styles.colorOptionSelected
                ]}
                onPress={() => updateAppearance('hairColor', color)}
              >
                <View style={[
                  styles.colorCircle,
                  { backgroundColor: getHairColor(color) }
                ]} />
                <Text style={[
                  styles.colorText,
                  appearance.hairColor === color && styles.colorTextSelected
                ]}>
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Eye Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Eye Color</Text>
          <View style={styles.colorGrid}>
            {eyeColorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  appearance.eyeColor === color && styles.colorOptionSelected
                ]}
                onPress={() => updateAppearance('eyeColor', color)}
              >
                <View style={[
                  styles.colorCircle,
                  { backgroundColor: getEyeColor(color) }
                ]} />
                <Text style={[
                  styles.colorText,
                  appearance.eyeColor === color && styles.colorTextSelected
                ]}>
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal Style */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Personal Style</Text>
          <View style={styles.optionGrid}>
            {styleOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  appearance.style === option && styles.optionCardSelected
                ]}
                onPress={() => updateAppearance('style', option)}
              >
                <Text style={[
                  styles.optionCardText,
                  appearance.style === option && styles.optionCardTextSelected
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
            onPress={() => navigation.navigate('CouplesDasboard')}
            // onPress={() => navigation.navigate('AboutMe')}
          >
            <Text style={styles.continueButtonText}>Continue </Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions for color visualization
const getHairColor = (color) => {
  const colors = {
    'Black': '#2C2C2C',
    'Brown': '#8B4513',
    'Blonde': '#F5D76E',
    'Red': '#A52A2A',
    'Auburn': '#9A2A2A',
    'Gray': '#808080',
    'Bald': '#F5F5F5',
    'Other': '#D4D4D4'
  };
  return colors[color] || '#D4D4D4';
};

const getEyeColor = (color) => {
  const colors = {
    'Brown': '#8B4513',
    'Blue': '#1E90FF',
    'Green': '#228B22',
    'Hazel': '#C9B037',
    'Gray': '#708090',
    'Other': '#D4D4D4'
  };
  return colors[color] || '#D4D4D4';
};

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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0ebf5',
    minWidth: 80,
  },
  colorOptionSelected: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5dbee',
  },
  colorText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
  },
  colorTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // ... other styles
});