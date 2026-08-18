import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext'; 

const ContactUsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme(); 
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [storyForm, setStoryForm] = useState({
    name: '',
    email: '',
    title: '',
    story: '',
    category: ''
  });

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@showaapp.com?subject=App Support');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+2349785745');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://showaapp.com');
  };

  const handleSocialMediaPress = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/showa',
      twitter: 'https://twitter.com/showa',
      instagram: 'https://instagram.com/showa',
    };
    Linking.openURL(urls[platform]);
  };

  const handleShareStory = () => {
    setIsStoryModalVisible(true);
  };

  const handleSubmitStory = () => {
    if (!storyForm.name || !storyForm.title || !storyForm.story) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    console.log('Story submitted:', storyForm);
    
    setIsStoryModalVisible(false);
    setIsSuccessModalVisible(true);
    
    setStoryForm({
      name: '',
      email: '',
      title: '',
      story: '',
      category: ''
    });
  };

  const categories = [
    'Success Story',
    'Business Growth',
    'Personal Achievement',
    'Community Impact',
    'Overcoming Challenges',
    'Other'
  ];

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />
      
      {/* Navbar / Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contact Us</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageContainer}>
            <Image 
              source={require('../assets/images/zenithdirect-rep-animation-big.png')} 
              style={styles.heroImage}
            />
          </View>
          <Text style={[styles.heroText, { color: colors.text }]}>
            We're here to help!
          </Text>
          <Text style={[styles.heroSubtext, { color: colors.textSecondary }]}>
            Reach out to our team for any questions or support
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={[styles.section, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
          shadowOpacity: isDark ? 0 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Options</Text>
          
          {/* Email */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#3498db20' }]}>
              <Icon name="envelope" size={20} color="#3498db" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Email Support</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>info@showaapp.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#2ecc7120' }]}>
              <Icon name="phone" size={20} color="#2ecc71" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Call Us</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>+234 9785 745</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Website */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handleWebsitePress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#9b59b620' }]}>
              <Icon name="globe" size={20} color="#9b59b6" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Visit Website</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>showapp.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={[styles.section, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
          shadowOpacity: isDark ? 0 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Follow Us</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Stay connected on social media
          </Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#3b599820' }]}
              onPress={() => handleSocialMediaPress('facebook')}
              activeOpacity={0.7}
            >
              <Icon name="facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#1da1f220' }]}
              onPress={() => handleSocialMediaPress('twitter')}
              activeOpacity={0.7}
            >
              <Icon name="twitter" size={24} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#e1306c20' }]}
              onPress={() => handleSocialMediaPress('instagram')}
              activeOpacity={0.7}
            >
              <Icon name="instagram" size={24} color="#e1306c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Office Address */}
        <View style={[styles.section, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
          shadowOpacity: isDark ? 0 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Location</Text>
          <View style={styles.locationContainer}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#e74c3c20' }]}>
              <Fontisto name="map-marker-alt" size={20} color="#e74c3c" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Headquarters</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>Lagos State, Nigeria</Text>
            </View>
          </View>
        </View>

        {/* Share Your Story */}
        <View style={[styles.section, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
          shadowOpacity: isDark ? 0 : 0.05,
          marginBottom: 20,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Share Your Story</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Your story could inspire others in the community
          </Text>

          <View style={[styles.storyCard, { backgroundColor: isDark ? colors.surfaceSecondary : '#f8f9fa' }]}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.primary} style={styles.storyIcon} />
            <Text style={[styles.storyText, { color: colors.textSecondary }]}>
              "I was hesitant to post at first, but after sharing my experience, I connected with so many people going through similar challenges."
            </Text>
            <Text style={[styles.storyAuthor, { color: colors.text }]}>- Sarah J.</Text>
          </View>

          <View style={[styles.storyCard, { backgroundColor: isDark ? colors.surfaceSecondary : '#f8f9fa' }]}>
            <Ionicons name="bulb-outline" size={24} color={colors.primary} style={styles.storyIcon} />
            <Text style={[styles.storyText, { color: colors.textSecondary }]}>
              "Posting my story led to unexpected opportunities. A local organization reached out and offered resources that helped me tremendously."
            </Text>
            <Text style={[styles.storyAuthor, { color: colors.text }]}>- Michael T.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: colors.primary }]} 
            onPress={handleShareStory}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={20} color="#fff" style={styles.ctaIcon} />
            <Text style={styles.ctaButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Story Modal */}
      <Modal
        visible={isStoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsStoryModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Share Your Story</Text>
                <TouchableOpacity 
                  onPress={() => setIsStoryModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
              >
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Your Name *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: isDark ? colors.background : '#fff'
                    }]}
                    placeholder="Enter your full name"
                    value={storyForm.name}
                    placeholderTextColor={colors.textTertiary}
                    onChangeText={(text) => setStoryForm({...storyForm, name: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: isDark ? colors.background : '#fff'
                    }]}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    placeholderTextColor={colors.textTertiary}
                    value={storyForm.email}
                    onChangeText={(text) => setStoryForm({...storyForm, email: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Story Title *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: isDark ? colors.background : '#fff'
                    }]}
                    placeholderTextColor={colors.textTertiary}
                    placeholder="Give your story a title"
                    value={storyForm.title}
                    onChangeText={(text) => setStoryForm({...storyForm, title: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.categoryPill, 
                          { 
                            backgroundColor: isDark ? colors.background : '#f8f9fa',
                            borderColor: colors.border 
                          },
                          storyForm.category === category && [
                            styles.categoryPillActive, 
                            { backgroundColor: colors.primary, borderColor: colors.primary }
                          ]
                        ]}
                        onPress={() => setStoryForm({...storyForm, category})}
                      >
                        <Text style={[
                          styles.categoryText, 
                          { color: storyForm.category === category ? '#fff' : colors.textSecondary },
                          storyForm.category === category && styles.categoryTextActive
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Your Story *</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      styles.textArea, 
                      { 
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: isDark ? colors.background : '#fff'
                      }
                    ]}
                    placeholder="Share your inspiring story..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={storyForm.story}
                    placeholderTextColor={colors.textTertiary}
                    onChangeText={(text) => setStoryForm({...storyForm, story: text})}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: colors.primary }]} 
                  onPress={handleSubmitStory}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>Submit Your Story</Text>
                </TouchableOpacity>
                
                <View style={styles.modalBottomSpacer} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={[styles.successModalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.successModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={70} color="#27ae60" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>Thank You!</Text>
            <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
              Your story has been received and will be published soon after review.
            </Text>
            <TouchableOpacity 
              style={[styles.successButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsSuccessModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  heroSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? colors.surfaceSecondary : '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  heroText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtext: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    marginTop: 2,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  socialIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  storyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    position: 'relative',
  },
  storyIcon: {
    marginBottom: 8,
  },
  storyText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  storyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  ctaButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ctaIcon: {
    marginRight: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formContent: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryPillActive: {},
  categoryText: {
    fontSize: 14,
  },
  categoryTextActive: {
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBottomSpacer: {
    height: 30,
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContent: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successButton: {
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactUsScreen;