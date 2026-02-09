import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../globalshared/constants/colors';


export default function UploadPictureScreen({ navigation, route }) {

  const {status,name, job, language, age} = route.params || {}
  const [profileImage, setProfileImage] = useState(null);


  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick image');
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets[0].uri) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to take photo');
        console.log('Camera Error: ', response.error);
      } else if (response.assets && response.assets[0].uri) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SetupProfile')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar ===========*/}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 2 of 6</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
     
        <View style={styles.titleSection}>
          <View style={styles.titleIcon}>
            <Icon name="camera-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.title}>
            Add a Profile Picture
          </Text>
          <Text style={styles.subtitle}>
            Uploading a picture is optional—you can choose to stay anonymous if you prefer. Profiles with pictures often get more meaningful connections.
          </Text>
        </View>

        {/* Profile Image Section ==============================*/}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <View style={styles.imageWrapper}>
                <View style={styles.profileImage}>
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.image}
                  />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={removeImage}
                  >
                    <Icon name="close" size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.imageSuccessText}>Picture added! </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.profilePlaceholder}
                onPress={pickImage}
              >
                <View style={styles.placeholderIcon}>
                  <Icon name="person-outline" size={32} color={Colors.textTertiary} />
                </View>
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={16} color={Colors.white} />
                </View>
                <Text style={styles.placeholderText}>Tap to add</Text>
                <Text style={styles.placeholderText}>photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.uploadOptions}>
            <TouchableOpacity 
              style={styles.uploadOption}
              onPress={pickImage}
            >
              <View style={[styles.optionIcon, styles.galleryIcon]}>
                <Icon name="images-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadOption}
              onPress={takePhoto}
            >
              <View style={[styles.optionIcon, styles.cameraIcon]}>
                <Icon name="camera" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.optionText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Icon name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.privacyText}>
              Your photo is only visible to matched listeners and is never shared publicly.
            </Text>
          </View>
        </View>
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
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CIssues',{
              name: name,
              status:status,
              age: age,
              language:language,
              job:job,
              profile_image: profileImage
            })}
          >
            <Text style={styles.primaryButtonText}>
              {profileImage ? 'Continue with Photo' : 'Continue Anonymously'}
            </Text>
            <Icon name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  skipText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  progressContainer: {
    paddingHorizontal: 20,
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 30,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.border,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    position: 'relative',
  },
  placeholderIcon: {
    marginBottom: 8,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  imageSuccessText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  uploadOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  galleryIcon: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
  },
  cameraIcon: {
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  privacyText: {
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
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});