import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Image,
  FlatList,
  ActivityIndicator
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { authAPI } from '../../globalshared/services/api';

export default function ProfileSetupScreen({ navigation, route }) {
  const { 
    status, name, language, age, job, income, lifestyle, expectations,matchingPreferences 
} = route.params || {};

  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [bio, setBio] = useState("");
  const [profileImages, setProfileImages] = useState([]); 
  const [occupation, setOccupation] = useState(job || "");
  const [religion, setReligion] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showReligionDropdown, setShowReligionDropdown] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [relationshipType, setRelationshipType] = useState("");
  const [showRelationshipTypeDropdown, setShowRelationshipTypeDropdown] = useState(false);
  const [availability, setAvailability] = useState("");
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "United Arab Emirates", "Singapore", "Japan", "South Korea",
    "Brazil", "Mexico", "Spain", "Italy", "Netherlands", "Switzerland"
  ];

  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
  
  const religions = [
    "Christianity", "Islam", "Hinduism", "Buddhism", "Judaism",
    "Atheist", "Agnostic", "Spiritual", "Other", "Prefer not to say"
  ];

  const relationshipTypes = [
    "Mentorship & Guidance",
    "Travel Companion",
    "Emotional Connection",
    "Social Partner",
    "Discreet Arrangement", 
    "Long-term Partnership",
    "Casual Dating",
    "Experience Sharing"
  ];

  const availabilityOptions = [
    "Very Flexible",
    "Weekends Only", 
    "Evenings Only",
    "Business Hours",
    "Travel Frequently",
    "Limited Availability",
    "On Demand"
  ];

  const getRoleSpecificContent = () => {
    const content = {
      daddy: {
        bioPlaceholder: "Describe your background, interests, and what you can offer as a Sugar Daddy. Mention your lifestyle, travel preferences, and what you're looking for in a companion...",
        occupationLabel: "Profession & Business",
        relationshipLabel: "Preferred Arrangement Type"
      },
      mummy: {
        bioPlaceholder: "Share about your life, interests, and what makes you a great Sugar Mummy. Describe your personality, what you enjoy, and what you seek in a companion...",
        occupationLabel: "Career & Interests", 
        relationshipLabel: "Preferred Arrangement Type"
      },
      boy: {
        bioPlaceholder: "Tell potential Sugar Mommies about yourself - your ambitions, hobbies, personality, and what you bring to a relationship. Be authentic and appealing...",
        occupationLabel: "Current Pursuits & Goals",
        relationshipLabel: "Desired Arrangement Type"
      },
      girl: {
        bioPlaceholder: "Introduce yourself to potential Sugar Daddies. Share your personality, dreams, interests, and what makes you a great companion. Be genuine and attractive...",
        occupationLabel: "Current Pursuits & Goals", 
        relationshipLabel: "Desired Arrangement Type"
      }
    };
    return content[status] || content.daddy;
  };

  const roleContent = getRoleSpecificContent();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  useEffect(() => {
    const requiredFieldsComplete = name && name.length > 0 && 
      country.length > 0 && 
      calculateAge(date) >= 18 &&
      gender.length > 0 &&
      profileImages.length > 0;
    
    setIsFormComplete(requiredFieldsComplete);
  }, [name, country, date, gender, profileImages]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageSelect = () => {
    setShowImagePickerModal(true);
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'front',
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error', `Camera Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const newImage = {
          uri: response.assets[0].uri,
          id: Date.now().toString(),
          isMain: profileImages.length === 0 
        };
        setProfileImages(prev => [newImage, ...prev]);
        setShowImagePickerModal(false);
      }
    });
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 10 - profileImages.length,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', `Image Picker Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map((asset, index) => ({
          uri: asset.uri,
          id: Date.now().toString() + index,
          isMain: profileImages.length === 0 && index === 0
        }));
        setProfileImages(prev => [...newImages, ...prev]);
        setShowImagePickerModal(false);
      }
    });
  };

  const removeImage = (imageId) => {
    setProfileImages(prev => {
      const updatedImages = prev.filter(img => img.id !== imageId);
      if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
        updatedImages[0].isMain = true;
      }
      return updatedImages;
    });
  };

  const setAsMainImage = (imageId) => {
    setProfileImages(prev => 
      prev.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    );
  };

  const handleCreateProfile = async () => {
    if (!isFormComplete) {
      Alert.alert("Incomplete Profile", "Please complete all required fields and add at least one photo to continue.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("nick_name", name);
    formData.append("date_of_birth", date.toISOString().split("T")[0]);
    formData.append("country", country);
    formData.append("gender", gender);
    formData.append("occupation", occupation);
    formData.append("bio", bio);
    formData.append("religion", religion);
    formData.append("language", language);
    formData.append("relationship_type", relationshipType);
    formData.append("availability", availability);
    formData.append("income_range", income || "");
    formData.append("lifestyle", lifestyle || "");
    formData.append("expectations", expectations || "");
    formData.append("matching_references", matchingPreferences || "");

    profileImages.forEach((img, index) => {
      formData.append("profile_images", {
        uri: img.uri,
        name: `photo_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    navigation.navigate("SuggarHome");

    // try {
    //   const response = await authAPI.setupEdateProfile(formData);
    //   navigation.navigate("SugarMatchingPreferences");
    // } catch (error) {
    //   console.error("Profile creation failed:", error);
    //   Alert.alert("Error", error.message || "Something went wrong. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.galleryImage} />
      <View style={styles.imageActions}>
        {item.isMain && (
          <View style={styles.mainBadge}>
            <Text style={styles.mainBadgeText}>Main</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.imageActionButton}
          onPress={() => setAsMainImage(item.id)}
          disabled={item.isMain}
        >
          <Icon 
            name="star" 
            size={16} 
            color={item.isMain ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.imageActionButton}
          onPress={() => removeImage(item.id)}
        >
          <Icon name="delete" size={16} color="#FF3366" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDropdownModal = (title, items, selectedValue, onSelect, isVisible, onClose) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <ScrollView style={styles.dropdownList}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.dropdownItem,
                    selectedValue === item && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={[
                    styles.dropdownText,
                    selectedValue === item && styles.selectedDropdownText
                  ]}>{item}</Text>
                  {selectedValue === item && (
                    <Icon name="check" size={20} color="#FF3366" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const mainImage = profileImages.find(img => img.isMain) || profileImages[0];

  return (
    <LinearGradient
      colors={["#FF3366", "#FF6F00", "#FF3366"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Sugar Profile</Text>
              <Text style={styles.subtitle}>
                Add photos and details to attract your ideal match
              </Text>
            </View>

            {/* Profile Image Section */}
            <View style={styles.imageSection}>
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={handleImageSelect}
                activeOpacity={0.8}
              >
                {mainImage ? (
                  <Image source={{ uri: mainImage.uri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon name="add-a-photo" size={30} color='#FF3366' />
                    <Text style={styles.placeholderText}>Add Profile</Text>
                    <Text style={styles.placeholderText}>Photos</Text>
                   
                  </View>
                )}
                
                {profileImages.length > 0 && (
                  <View style={styles.imageCountBadge}>
                    <Text style={styles.imageCountText}>{profileImages.length}/10</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.imageHint}>
                {profileImages.length > 0 
                  ? "Add more photos to showcase different aspects of your lifestyle"
                  : "Add clear, recent photos that represent you well"
                }
              </Text>
              
              {/*===== Image Gallery=========== */}
              {profileImages.length > 0 && (
                <View style={styles.gallerySection}>
                  <Text style={styles.galleryTitle}>Your Photos</Text>
                  <FlatList
                    data={profileImages}
                    renderItem={renderImageItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryList}
                  />
                  <Text style={styles.galleryHint}>
                    Tap ★ for main photo • 🗑 to remove • {10 - profileImages.length} remaining
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.formContainer}>
              {/* Basic Information Section */}
              <Text style={styles.sectionHeader}>Basic Information</Text>

              <View style={styles.prefilledSection}>
                <View style={styles.prefilledItem}>
                  <Icon name="person" size={16} color="#FF3366" />
                  <Text style={styles.prefilledLabel}>Name:</Text>
                  <Text style={styles.prefilledValue}>{name}</Text>
                </View>
                <View style={styles.prefilledItem}>
                  <Icon name="language" size={16} color="#FF3366" />
                  <Text style={styles.prefilledLabel}>Language:</Text>
                  <Text style={styles.prefilledValue}>{language}</Text>
                </View>
                {age && (
                  <View style={styles.prefilledItem}>
                    <Icon name="cake" size={16} color="#FF3366" />
                    <Text style={styles.prefilledLabel}>Age:</Text>
                    <Text style={styles.prefilledValue}>{age} years</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Gender *</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowGenderDropdown(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="wc" size={20} color="#FF3366" style={styles.inputIcon} />
                  <Text style={gender ? styles.valueText : styles.placeholderText}>
                    {gender || 'Select your gender'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={24} color="#FF3366" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Birthday *</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="cake" size={20} color="#FF3366" style={styles.inputIcon} />
                  <View style={styles.valueContainer}>
                    <Text style={date ? styles.valueText : styles.placeholderText}>
                      {date ? formatDate(date) : 'Select your birthday'}
                    </Text>
                    {date && (
                      <Text style={styles.ageText}>
                        {calculateAge(date)} years old
                      </Text>
                    )}
                  </View>
                  <Icon name="calendar-today" size={20} color="#FF3366" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                    textColor="#FF3366"
                  />
                )}
                <Text style={styles.hint}>
                  You must be 18 years or older to join our community
                </Text>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Country *</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowCountryDropdown(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="location-on" size={20} color="#FF3366" style={styles.inputIcon} />
                  <Text style={country ? styles.valueText : styles.placeholderText}>
                    {country || 'Select your country'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={24} color="#FF3366" />
                </TouchableOpacity>
              </View>

              {/* Sugar Relationship Details */}
              <Text style={styles.sectionHeader}>Arrangement Details</Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>{roleContent.occupationLabel}</Text>
                <View style={styles.inputContainer}>
                  <Icon name="work" size={20} color="#FF3366" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={occupation}
                    onChangeText={setOccupation}
                    placeholder="Describe your profession, studies, or interests"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>{roleContent.relationshipLabel}</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowRelationshipTypeDropdown(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="favorite" size={20} color="#FF3366" style={styles.inputIcon} />
                  <Text style={relationshipType ? styles.valueText : styles.placeholderText}>
                    {relationshipType || 'Select arrangement type'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={24} color="#FF3366" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Availability</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowAvailabilityDropdown(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="schedule" size={20} color="#FF3366" style={styles.inputIcon} />
                  <Text style={availability ? styles.valueText : styles.placeholderText}>
                    {availability || 'Select your availability'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={24} color="#FF3366" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Religion</Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowReligionDropdown(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="spa" size={20} color="#FF3366" style={styles.inputIcon} />
                  <Text style={religion ? styles.valueText : styles.placeholderText}>
                    {religion || 'Select your religion'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={24} color="#FF3366" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>About You & What You Offer</Text>
                <View style={[styles.inputContainer, styles.bioContainer]}>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder={roleContent.bioPlaceholder}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={1000}
                  />
                </View>
                <Text style={styles.hint}>
                  {bio.length}/1000 characters - Be authentic and detailed
                </Text>
              </View>

              {/* Previous Section Info */}
              {(income || lifestyle || expectations) && (
                <View style={styles.previousInfoSection}>
                  <Text style={styles.sectionHeader}>Previous Selections</Text>
                  {income && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Income Range:</Text>
                      <Text style={styles.infoValue}>{income}</Text>
                    </View>
                  )}
                  {lifestyle && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Lifestyle:</Text>
                      <Text style={styles.infoValue}>{lifestyle}</Text>
                    </View>
                  )}
                  {expectations && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Expectations:</Text>
                      <Text style={styles.infoValue}>{expectations}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Icon name="arrow-back" size={20} color="#FF3366" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.continueButton, !isFormComplete && styles.disabledButton]}
                onPress={handleCreateProfile}
                disabled={!isFormComplete}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isFormComplete ? ["#FF3366", "#FF6F00"] : ["#CCC", "#999"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.continueButtonText}>
                      Complete Profile
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>Add Profile Photos</Text>
            <Text style={styles.imagePickerSubtitle}>
              Quality photos significantly increase your matches
            </Text>
            
            <TouchableOpacity 
              style={styles.imagePickerOption}
              onPress={openCamera}
            >
              <Icon name="photo-camera" size={30} color="#FF3366" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.imagePickerOptionText}>Take Photo</Text>
                <Text style={styles.optionHint}>Current, well-lit selfies work best</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imagePickerOption}
              onPress={openImageLibrary}
            >
              <Icon name="photo-library" size={30} color="#FF3366" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.imagePickerOptionText}>Choose from Gallery</Text>
                <Text style={styles.optionHint}>
                  {10 - profileImages.length} photos remaining
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dropdown Modals */}
      {renderDropdownModal(
        "Select Your Country",
        countries,
        country,
        setCountry,
        showCountryDropdown,
        () => setShowCountryDropdown(false)
      )}

      {renderDropdownModal(
        "Select Your Gender",
        genders,
        gender,
        setGender,
        showGenderDropdown,
        () => setShowGenderDropdown(false)
      )}

      {renderDropdownModal(
        "Select Your Religion",
        religions,
        religion,
        setReligion,
        showReligionDropdown,
        () => setShowReligionDropdown(false)
      )}

      {renderDropdownModal(
        "Relationship Type",
        relationshipTypes,
        relationshipType,
        setRelationshipType,
        showRelationshipTypeDropdown,
        () => setShowRelationshipTypeDropdown(false)
      )}

      {renderDropdownModal(
        "Your Availability",
        availabilityOptions,
        availability,
        setAvailability,
        showAvailabilityDropdown,
        () => setShowAvailabilityDropdown(false)
      )}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  
  prefilledSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  prefilledItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prefilledLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    marginRight: 4,
  },
  prefilledValue: {
    fontSize: 14,
    color: '#FF3366',
    fontWeight: '500',
  },
  previousInfoSection: {
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
 
  container: {
    flex: 1,
    padding: 0,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 100,
    left: -50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginTop:20,
    color: "#000000ff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#0b0b0bff',
  },
  placeholderImage: {
    width: 140,
    height: 140,
    borderRadius: 60,
    backgroundColor: '#F8F8F8',
    borderWidth: 3,
    borderColor: '#555',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  imageCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3366',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  gallerySection: {
    width: '100%',
    marginTop: 15,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  galleryList: {
    paddingHorizontal: 10,
  },
  imageItem: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3366',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  mainBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 5,
  },
  mainBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageActionButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  galleryHint: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF3366",
    marginBottom: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  bioContainer: {
    height: 120,
    alignItems: 'flex-start',
  },
  bioInput: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: "#333",
    fontSize: 16,
  },
  valueContainer: {
    flex: 1,
  },
  valueText: {
    color: "#333",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  ageText: {
    color: "#FF3366",
    fontSize: 12,
    marginTop: 2,
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF3366",
  },
  backButtonText: {
    color: "#FF3366",
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    marginLeft: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '60%',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3366',
    marginBottom: 15,
    textAlign: 'center',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderRadius: 10,
  },
  dropdownText: {
    color: '#333',
    fontSize: 16,
  },
  selectedDropdownText: {
    color: '#FF3366',
    fontWeight: '600',
  },
  imagePickerModal: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imagePickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF3366',
    marginBottom: 5,
  },
  imagePickerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
  },
  imagePickerOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  imagePickerOptionHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cancelButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF3366',
    fontWeight: '600',
  },
});