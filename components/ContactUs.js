import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  SafeAreaView,
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
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { useTheme } from '../src/context/ThemeContext'; // Import ThemeContext

const ContactUsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme(); // Get theme colors
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
    Linking.openURL('mailto:support@example.com?subject=App Support');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.example.com');
  };

  const handleSocialMediaPress = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/example',
      twitter: 'https://twitter.com/example',
      instagram: 'https://instagram.com/example',
    };
    Linking.openURL(urls[platform]);
  };

  const handleShareStory = () => {
    setIsStoryModalVisible(true);
  };

  const handleSubmitStory = () => {
    // Validate form
    if (!storyForm.name || !storyForm.title || !storyForm.story) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    console.log('Story submitted:', storyForm);
    
    // Show success modal
    setIsStoryModalVisible(false);
    setIsSuccessModalVisible(true);
    
    // Reset form
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
      
      {/* Header with Back Button */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../assets/images/zenithdirect-rep-animation-big.png')} 
            style={{width:150, height:150, borderRadius:50, justifyContent:'center', alignSelf:'center'}}
          />
          <Text style={[styles.heroText, {marginTop:18, alignSelf:'center', color: colors.text}]}>
            We're here to help!
          </Text>
          <Text style={[styles.heroSubtext, { color: colors.textSecondary }]}>
            Reach out to our team for any questions or support.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.1 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Options</Text>
          
          {/* Email */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handleEmailPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#3498db20' }]}>
              <Icon name="envelope" size={20} color="#3498db" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Email Support</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>info@essential.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handlePhonePress}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#2ecc7120' }]}>
              <Icon name="phone" size={20} color="#2ecc71" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Call Us</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>+234 9785 745</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Website */}
          <TouchableOpacity 
            style={[styles.contactMethod, { borderBottomColor: colors.border }]} 
            onPress={handleWebsitePress}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#9b59b620' }]}>
              <Icon name="globe" size={20} color="#9b59b6" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Visit Website</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>https://www.showa.ng</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.1 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Follow Us</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Stay connected on social media
          </Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#3b599820' }]}
              onPress={() => handleSocialMediaPress('facebook')}
            >
              <Icon name="facebook" size={20} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#1da1f220' }]}
              onPress={() => handleSocialMediaPress('twitter')}
            >
              <Icon name="twitter" size={20} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#e1306c20' }]}
              onPress={() => handleSocialMediaPress('instagram')}
            >
              <Icon name="instagram" size={20} color="#e1306c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Office Address */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.1 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Location</Text>
          <View style={[styles.contactMethod, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.backgroundSecondary : '#e74c3c20' }]}>
              <Fontisto name="map-marker-alt" size={20} color="#e74c3c" />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactLabel, { color: colors.text }]}>Headquarters</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>128 Iyala Lagos State</Text>
              <Text style={[styles.contactValue, { color: colors.textSecondary }]}>Nigeria</Text>
            </View>
          </View>
        </View>

        {/* Success Stories */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.1 : 0.05,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Community Stories</Text>
          <Text style={[styles.successIntro, { color: colors.textSecondary }]}>
            Hear from people who shared their stories with us
          </Text>

          <View style={[styles.storyCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.storyText, { color: colors.textSecondary }]}>
              "I was hesitant to post at first, but after sharing my experience, I connected with so many people going through similar challenges."
            </Text>
            <Text style={[styles.storyAuthor, { color: colors.text }]}>- Sarah J.</Text>
          </View>

          <View style={[styles.storyCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.storyText, { color: colors.textSecondary }]}>
              "Posting my story led to unexpected opportunities. A local organization reached out and offered resources that helped me tremendously."
            </Text>
            <Text style={[styles.storyAuthor, { color: colors.text }]}>- Michael T.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: colors.primary }]} 
            onPress={handleShareStory}
          >
            <Text style={styles.ctaButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Story Submission Modal */}
      <Modal
        visible={isStoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsStoryModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Share Your Story</Text>
                <TouchableOpacity 
                  onPress={() => setIsStoryModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Your Name *</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.backgroundSecondary 
                    }]}
                    placeholder="Enter your full name"
                    value={storyForm.name}
                    placeholderTextColor={colors.textSecondary}
                    onChangeText={(text) => setStoryForm({...storyForm, name: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.backgroundSecondary 
                    }]}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    placeholderTextColor={colors.textSecondary}
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
                      backgroundColor: colors.backgroundSecondary 
                    }]}
                    placeholderTextColor={colors.textSecondary}
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
                            backgroundColor: isDark ? colors.backgroundSecondary : '#f8f9fa',
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
                          { color: colors.textSecondary },
                          storyForm.category === category && [
                            styles.categoryTextActive, 
                            { color: '#fff' }
                          ]
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
                        backgroundColor: colors.backgroundSecondary 
                      }
                    ]}
                    placeholder="Share your inspiring story..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={storyForm.story}
                    placeholderTextColor={colors.textSecondary}
                    onChangeText={(text) => setStoryForm({...storyForm, story: text})}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: colors.primary }]} 
                  onPress={handleSubmitStory}
                >
                  <Text style={styles.submitButtonText}>Submit Your Story</Text>
                </TouchableOpacity>
                <View style={{padding:40}}></View>
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
        <View style={styles.successModalContainer}>
          <View style={[styles.successModalContent, { backgroundColor: colors.card }]}>
            {/* <LottieView
              source={require('../assets/animations/success.json')}
              autoPlay
              loop={false}
              style={styles.successAnimation}
            /> */}
            <Text style={[styles.successTitle, { color: colors.text }]}>Thank You!</Text>
            <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
              Your story has been received and will be published soon after review.
            </Text>
            <TouchableOpacity 
              style={[styles.successButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor handled inline
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    // backgroundColor handled inline
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    // color handled inline
  },
  heroSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  heroText: {
    fontSize: 24,
    fontWeight: '700',
    // color handled inline
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 16,
    // color handled inline
    lineHeight: 24,
    alignSelf:'center',
    justifyContent:'center',
    alignContent:'center',
    textAlign:'center'
  },
  section: {
    // backgroundColor handled inline
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    // shadowColor handled inline
    // shadowOpacity handled inline
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color handled inline
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    // color handled inline
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // backgroundColor handled inline
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    // color handled inline
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    // color handled inline
    marginTop: 2,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    // backgroundColor handled inline
  },
  successIntro: {
    fontSize: 15,
    // color handled inline
    marginBottom: 16,
    lineHeight: 22,
  },
  storyCard: {
    // backgroundColor handled inline
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 15,
    // color handled inline
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  storyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    // color handled inline
    textAlign: 'right',
  },
  ctaButton: {
    // backgroundColor handled inline
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    // backgroundColor handled inline
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    // color handled inline
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    // color handled inline
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    // borderColor handled inline
    borderRadius: 8,
    // color handled inline
    padding: 12,
    fontSize: 16,
    // backgroundColor handled inline
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // backgroundColor handled inline
    borderWidth: 1,
    // borderColor handled inline
    marginRight: 8,
  },
  categoryPillActive: {
    // backgroundColor handled inline
    // borderColor handled inline
  },
  categoryText: {
    fontSize: 14,
    // color handled inline
  },
  categoryTextActive: {
    // color handled inline
    fontWeight: '500',
  },
  submitButton: {
    // backgroundColor handled inline
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Success Modal Styles
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  successModalContent: {
    // backgroundColor handled inline
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  successAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    // color handled inline
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successButton: {
    // backgroundColor handled inline
    borderRadius: 8,
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