import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../../globalshared/constants/colors";

const TalkPreferenceScreen = ({ navigation, route }) => {

   const {
    name,age,language,profileImage,issues,job,status, customIssue
} = route.params || {}


// useEffect(()=>{
// if (profileImage) {
//   console.log("data image",profileImage)
// } else {
//  console.log("No data image found")
  
// }
// },[])

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { 
      label: "Voice Call", 
      icon: "phone", 
      description: "Talk directly with a listener over voice call",
      iconType: "feather"
    },
    { 
      label: "Chat", 
      icon: "message-text", 
      description: "Text-based conversation with a listener",
      iconType: "material"
    },
    { 
      label: "Video Call", 
      icon: "video", 
      description: "Face-to-face conversation with video",
      iconType: "feather"
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 3 of 6</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          {/* <View style={styles.titleIcon}>
            <Icon name="phone-call" size={24} color={Colors.primary} />
          </View> */}
          <Text style={styles.title}>How do you prefer to talk?</Text>
          <Text style={styles.subtitle}>
            Choose your preferred communication method. You can always change this later in settings.
          </Text>
        </View>
        <View style={styles.optionsSection}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.optionCard,
                selectedOption === item.label && styles.optionCardActive
              ]}
              onPress={() => setSelectedOption(item.label)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <View style={[
                    styles.iconContainer,
                    selectedOption === item.label && styles.iconContainerActive
                  ]}>
                    {item.iconType === "material" ? (
                      <MaterialIcon 
                        name={item.icon} 
                        size={22} 
                        color={selectedOption === item.label ? Colors.white : Colors.primary} 
                      />
                    ) : (
                      <Icon 
                        name={item.icon} 
                        size={22} 
                        color={selectedOption === item.label ? Colors.white : Colors.primary} 
                      />
                    )}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.optionText,
                      selectedOption === item.label && styles.optionTextActive
                    ]}>
                      {item.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.radioOuter,
                  selectedOption === item.label && styles.radioOuterActive
                ]}>
                  {selectedOption === item.label && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="info" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>
              Your choice helps us match you with listeners who are available for your preferred communication method.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
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
              !selectedOption && styles.primaryButtonDisabled
            ]}
            onPress={() => navigation.navigate("CAvailabilty",{
                  customIssue:customIssue,
                  status:status,
                  name:name,
                  age:age,
                  language:language,
                  profileImage:profileImage,
                  job:job,
                  issues:issues


                
            })}
            disabled={!selectedOption}
          >
            <Text style={styles.primaryButtonText}>
              Next
            </Text>
            <Icon name="chevron-right" size={18} color={Colors.white} />
            <Icon style={{marginLeft:-20}} name="chevron-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    marginBottom: 20,
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
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 30,
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
  optionsSection: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 51, 102, 0.02)',
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerActive: {
    backgroundColor: Colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
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
});

export default TalkPreferenceScreen;