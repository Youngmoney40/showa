import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Colors from "../../globalshared/constants/colors";

const IssuesScreen = ({ navigation, route }) => {

  const {name, job, language, profile_image, age,status} = route.params || {}
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [customIssue, setCustomIssue] = useState("");

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((i) => i !== issue)
        : [...prev, issue]
    );
  };

  const issues = [
    { label: "Relationships", icon: "heart" },
    { label: "Marriage Issues", icon: "users" },
    { label: "Parenting Issues", icon: "smile" },
    { label: "Career Issues", icon: "briefcase" },
    { label: "Business Issues", icon: "trending-up" },
    { label: "Finance", icon: "dollar-sign" },
    { label: "Education", icon: "book" },
    { label: "Spirituality", icon: "feather" },
    { label: "Breakups", icon: "heart" },
    { label: "Fitness", icon: "activity" },
    { label: "Grief", icon: "cloud-rain" },
    { label: "Major Decisions", icon: "target" },
    { label: "Productivity", icon: "check-circle" },
    { label: "Others", icon: "more-horizontal" },
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
          <Text style={styles.progressText}>Complete Your Profile</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.titleSection}>
          <View style={styles.titleIcon}>
            <Icon name="edit-3" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>What's on Your Mind?</Text>
          <Text style={styles.subtitle}>
            Select topics you'd like to discuss. This helps us match you with listeners who specialize in these areas.
          </Text>
        </View>

        {/* Issues Grid ----------------------------------------*/}
        <View style={styles.issuesSection}>
          <Text style={styles.sectionTitle}>Common Topics</Text>
          <View style={styles.issuesGrid}>
            {issues.map((issue) => (
              <TouchableOpacity
                key={issue.label}
                style={[
                  styles.issueChip,
                  selectedIssues.includes(issue.label) && styles.issueChipActive
                ]}
                onPress={() => toggleIssue(issue.label)}
              >
                <View style={styles.issueContent}>
                  <Icon 
                    name={issue.icon} 
                    size={16} 
                    color={selectedIssues.includes(issue.label) ? Colors.white : Colors.primary} 
                  />
                  <Text style={[
                    styles.issueLabel,
                    selectedIssues.includes(issue.label) && styles.issueLabelActive
                  ]}>
                    {issue.label}
                  </Text>
                </View>
                {selectedIssues.includes(issue.label) && (
                  <View style={styles.checkmark}>
                    <Icon name="check" size={12} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
    
        <View style={styles.customSection}>
          <Text style={styles.sectionTitle}>Something Else?</Text>
          <View style={styles.inputContainer}>
            <Icon name="edit-2" size={20} color={Colors.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Type your specific concern here..."
              placeholderTextColor={Colors.textTertiary}
              value={customIssue}
              onChangeText={setCustomIssue}
              multiline
            />
          </View>
          <Text style={styles.inputHint}>
            Don't see your specific concern? Let us know and we'll find the right listener for you.
          </Text>
        </View>
        {selectedIssues.length > 0 && (
          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Icon name="check-circle" size={18} color={Colors.primary} />
              <Text style={styles.summaryTitle}>
                {selectedIssues.length} topic{selectedIssues.length > 1 ? 's' : ''} selected
              </Text>
            </View>
            <View style={styles.selectedTags}>
              {selectedIssues.slice(0, 3).map((issue) => (
                <View key={issue} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{issue}</Text>
                </View>
              ))}
              {selectedIssues.length > 3 && (
                <View style={styles.moreTag}>
                  <Text style={styles.moreTagText}>+{selectedIssues.length - 3} more</Text>
                </View>
              )}
            </View>
          </View>
        )}
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
              selectedIssues.length === 0 && !customIssue && styles.primaryButtonDisabled
            ]}
            onPress={() => {
              
            //   console.log('Selected issues:', selectedIssues);
            //   console.log('Custom issue:', customIssue);
             // navigation.navigate('CTalkPreference');

              navigation.navigate('CTalkPreference',
                { 
                  customIssue:customIssue,
                  status:status,
                  name:name,
                  age:age,
                  language:language,
                  profileImage:profile_image,
                  issues:selectedIssues,
                  job:job


                }
              );
            }}
            disabled={selectedIssues.length === 0 && !customIssue}
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
  issuesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  issuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  issueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  issueChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  issueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  issueLabelActive: {
    color: Colors.white,
  },
  checkmark: {
    marginLeft: 8,
  },
  customSection: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 14,
    color: Colors.textTertiary,
    lineHeight: 18,
    marginLeft: 4,
  },
  summarySection: {
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  moreTag: {
    backgroundColor: 'rgba(255, 51, 102, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moreTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
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

export default IssuesScreen;