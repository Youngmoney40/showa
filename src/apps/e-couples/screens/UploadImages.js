import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

export default function UploadPhotosScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showTips, setShowTips] = useState(false);

  const handleAddPhoto = () => {
    if (photos.length >= 7) {
      Alert.alert('Maximum Reached', 'You can only upload up to 7 photos. Remove some to add new ones.', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }
    
    // Simulate photo picker - in real app, use react-native-image-picker
    const newPhoto = {
      id: Date.now().toString(),
      uri: `https://picsum.photos/400/500?random=${photos.length + 1}`,
      isProfile: photos.length === 0,
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const handleRemovePhoto = (id) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter(photo => photo.id !== id);
            // If we're removing the profile photo, set the first photo as profile
            if (photos.find(photo => photo.id === id)?.isProfile && newPhotos.length > 0) {
              newPhotos[0].isProfile = true;
            }
            setPhotos(newPhotos);
          }
        },
      ]
    );
  };

  const handleSetProfilePhoto = (id) => {
    setPhotos(prev => 
      prev.map(photo => ({
        ...photo,
        isProfile: photo.id === id
      }))
    );
  };

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
  };

  const photoTips = [
    {
      icon: 'face',
      title: 'Clear Face Photo',
      description: 'Make sure your face is clearly visible and well-lit',
      color: '#FF6B8B'
    },
    {
      icon: 'directions-run',
      title: 'Full Body Shot',
      description: 'Include at least one photo showing your full body',
      color: '#4ECDC4'
    },
    {
      icon: 'favorite',
      title: 'Activity Photos',
      description: 'Show yourself doing things you love and enjoy',
      color: '#45B7D1'
    },
    {
      icon: 'wb-sunny',
      title: 'Good Lighting',
      description: 'Natural light works best for great photos',
      color: '#FFBE76'
    },
    {
      icon: 'mood',
      title: 'Genuine Smiles',
      description: 'Be yourself and let your personality shine through',
      color: '#96CEB4'
    },
    {
      icon: 'photo-library',
      title: 'Variety',
      description: 'Mix of close-ups, full shots, and activity photos',
      color: '#6C5CE7'
    }
  ];

  const renderPhotoGrid = () => {
    const emptySlots = 7 - photos.length;
    const gridItems = [];

    // Add existing photos
    photos.forEach((photo, index) => {
      gridItems.push(
        <TouchableOpacity
          key={photo.id}
          style={styles.photoContainer}
          onPress={() => handlePhotoPress(photo)}
        >
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          
          {/* Profile Photo Badge */}
          {photo.isProfile && (
            <View style={styles.profileBadge}>
              <Icon name="star" size={16} color="#fff" />
              <Text style={styles.profileBadgeText}>Profile</Text>
            </View>
          )}

          {/* Action Overlay */}
          <View style={styles.photoOverlay}>
            <TouchableOpacity 
              style={styles.overlayButton}
              onPress={() => handleSetProfilePhoto(photo.id)}
            >
              <Icon 
                name={photo.isProfile ? "star" : "star-outline"} 
                size={20} 
                color={photo.isProfile ? "#FFD93D" : "#fff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.overlayButton}
              onPress={() => handleRemovePhoto(photo.id)}
            >
              <Icon name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    });

    // Add empty slots
    for (let i = 0; i < emptySlots; i++) {
      gridItems.push(
        <TouchableOpacity
          key={`empty-${i}`}
          style={styles.addPhotoButton}
          onPress={handleAddPhoto}
        >
          <View style={styles.addPhotoContent}>
            <Icon name="camera" size={32} color="#FF3366" />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return gridItems;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Your Photos</Text>
          <Text style={styles.subText}>
            Showcase your personality with up to 7 photos
          </Text>
          <View style={styles.photoCountContainer}>
            <Text style={styles.photoCount}>{photos.length}</Text>
            <Text style={styles.photoCountLabel}>/ 7 photos</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation.navigate('AboutMe')}
            >
              <Text style={styles.tabText}>About Me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>Photos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {renderPhotoGrid()}
        </View>

        {/* Tips Button */}
        <TouchableOpacity 
          style={styles.tipsButton}
          onPress={() => setShowTips(true)}
        >
          <MaterialIcons name="photo-library" size={20} color="#FF3366" />
          <Text style={styles.tipsButtonText}>Photo Tips</Text>
          <Icon name="chevron-forward" size={16} color="#FF3366" />
        </TouchableOpacity>

        {/* Upload Progress */}
        {photos.length > 0 && (
          <View style={styles.uploadProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFillBar,
                  { width: `${(photos.length / 7) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {photos.length} of 7 photos uploaded • {7 - photos.length} spots remaining
            </Text>
          </View>
        )}

        {/* Complete Button */}
        <TouchableOpacity 
          style={[
            styles.completeButton,
            photos.length === 0 && styles.completeButtonDisabled
          ]}
          onPress={() => navigation.navigate('Home')}
          disabled={photos.length === 0}
        >
          <Text style={styles.completeButtonText}>
            {photos.length === 0 ? 'Add Photos to Continue' : 'Complete Profile & Start Matching'}
          </Text>
          <Icon name="sparkles" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Photo Tips Modal */}
      <Modal
        visible={showTips}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTips(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Photo Tips</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTips(false)}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.tipsList}>
            {photoTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={[styles.tipIconContainer, { backgroundColor: tip.color }]}>
                  <MaterialIcons name={tip.icon} size={24} color="#fff" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.gotItButton}
              onPress={() => setShowTips(false)}
            >
              <Text style={styles.gotItButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#2c2c2c',
    marginBottom: 8,
  },
  subText: {
    textAlign: 'center',
    color: '#6e6e6e',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  photoCountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  photoCount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF3366',
  },
  photoCountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoContainer: {
    width: (screenWidth - 72) / 2, // (screen width - padding - gap) / 2
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  profileBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 51, 102, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  profileBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 12,
    opacity: 0,
  },
  photoContainer: {
    width: (screenWidth - 72) / 2,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  photoContainer: {
    overlay: {
      opacity: 1,
    },
  },
  overlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  addPhotoButton: {
    width: (screenWidth - 72) / 2,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5dbee',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addPhotoContent: {
    alignItems: 'center',
    gap: 12,
  },
  addPhotoText: {
    color: '#FF3366',
    fontWeight: '600',
    fontSize: 16,
  },
  tipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipsButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  uploadProgress: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0ebf5',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFillBar: {
    height: '100%',
    backgroundColor: '#FF3366',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#FF3366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#faf7fc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5dbee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0ebf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsList: {
    flex: 1,
    padding: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5dbee',
  },
  gotItButton: {
    backgroundColor: '#FF3366',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  gotItButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});