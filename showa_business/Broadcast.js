import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import LottieView from 'lottie-react-native';
import { useTheme } from '../src/context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Carousel Data with Online Images
const CAROUSEL_ITEMS = [
  {
    id: '1',
    title: '📢 Reach Everyone Instantly',
    description: 'Send announcements to multiple contacts at once. Each recipient gets a private message.',
    icon: 'megaphone',
    color: '#4F46E5',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Personalize Your Message',
    description: 'Add text, images, or both. Make your broadcast engaging and professional.',
    icon: 'create',
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Track Delivery Status',
    description: 'Monitor who received your broadcast with real-time delivery tracking.',
    icon: 'checkmark-circle',
    color: '#059669',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Secure & Private',
    description: 'Your broadcasts are encrypted and sent directly to recipients\' inboxes.',
    icon: 'shield',
    color: '#2563EB',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
  },
];

// Feature Cards
const FEATURES = [
  {
    id: 'f1',
    title: '📱 Mobile Friendly',
    description: 'Send broadcasts from anywhere, anytime.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  },
  {
    id: 'f2',
    title: '⚡ Real-time Delivery',
    description: 'Messages are delivered instantly to all recipients.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
  },
  {
    id: 'f3',
    title: '📊 Analytics',
    description: 'Track engagement and delivery statistics.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  },
];

export default function BroadcastScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [failedRecipients, setFailedRecipients] = useState([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Animation for progress
  const progressAnim = useState(new Animated.Value(0))[0];
  const carouselScrollRef = useRef(null);
  const carouselInterval = useRef(null);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/get-users/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setUserData(response.data);
      } else {
        //console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      //console.log('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Auto-play carousel
    carouselInterval.current = setInterval(() => {
      setCurrentCarouselIndex((prev) => 
        prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => {
      if (carouselInterval.current) {
        clearInterval(carouselInterval.current);
      }
    };
  }, []);

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const openImagePicker = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const sendBroadcastMessages = async () => {
    setShowProcessingModal(true);
    setFailedRecipients([]);
    setProgress({ current: 0, total: selectedUsers.length });
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found');

      const messageData = {
        content: message,
        chat_type: 'single',
        account_mode: 'business',
      };

      if (image) {
        messageData.image = {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'image.jpg',
        };
      }

      // Reset animation
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: selectedUsers.length * 500,
        useNativeDriver: false,
      }).start();

      // Send to each user
      const failures = [];
      for (let i = 0; i < selectedUsers.length; i++) {
        const userId = selectedUsers[i];
        setProgress(p => ({ ...p, current: i + 1 }));
        
        try {
          const formData = new FormData();
          Object.keys(messageData).forEach(key => {
            if (key === 'image') {
              formData.append('image', messageData.image);
            } else {
              formData.append(key, messageData[key]);
            }
          });
          formData.append('receiver', userId);

          await axios.post(`${API_ROUTE}/api/chat/`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

        } catch (error) {
          console.error(`Error sending to user ${userId}:`, error.message);
          failures.push({
            id: userId,
            name: userData.find(u => u.id === userId)?.name || 'Unknown',
            error: error.message
          });
        }
      }

      setFailedRecipients(failures);
      if (failures.length === 0) {
        navigation.navigate('BroadcastSuccess', { 
          recipientsCount: selectedUsers.length,
          hasImage: !!image 
        });
      }
    } catch (error) {
      //console.error('Broadcast error:', error.message);
      setFailedRecipients(selectedUsers.map(id => ({
        id,
        name: userData.find(u => u.id === id)?.name || 'Unknown',
        error: error.message
      })));
    } finally {
      setShowProcessingModal(false);
    }
  };

  const handleBroadcastNow = () => {
    setShowMessageModal(false);
    sendBroadcastMessages();
  };

  const getProgressPercentage = () => {
    return progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  };

  const renderCarouselItem = ({ item, index }) => {
    const isActive = index === currentCarouselIndex;
    return (
      <View style={styles.carouselCard}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.carouselImageBackground}
          imageStyle={styles.carouselImageStyle}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
            style={styles.carouselGradient}
          >
            <View style={styles.carouselContent}>
              <View style={[styles.carouselIconContainer, { backgroundColor: item.color + '30' }]}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.carouselTitle}>
                {item.title}
              </Text>
              <Text style={styles.carouselDescription}>
                {item.description}
              </Text>
              <View style={styles.carouselDots}>
                {CAROUSEL_ITEMS.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.carouselDot,
                      {
                        backgroundColor: dotIndex === currentCarouselIndex
                          ? '#fff'
                          : 'rgba(255,255,255,0.4)',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  const renderFeatureCard = ({ item }) => (
    <View style={[styles.featureCard, { 
      backgroundColor: colors.card,
      shadowColor: isDark ? 'transparent' : '#000',
    }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.featureImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
        style={styles.featureGradient}
      />
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderRecipientItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.recipientItem,
          isSelected && [styles.selectedRecipient, { backgroundColor: colors.primary + '15' }],
          { borderBottomColor: colors.border }
        ]}
        onPress={() => toggleSelectUser(item.id)}
      >
        <Image
          source={
            item.profile_picture
              ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
              : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          }
          style={[styles.recipientAvatar, { backgroundColor: colors.backgroundSecondary }]}
        />
        <View style={styles.recipientInfo}>
          <Text style={[styles.recipientName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.recipientMeta, { color: colors.textSecondary }]}>{item.business_name || 'Business'}</Text>
        </View>
        {isSelected ? (
          <View style={styles.selectedCheck}>
            <Icon name="checkmark-circle" size={24} color={colors.primary} />
          </View>
        ) : (
          <View style={[styles.unselectedCheck, { borderColor: colors.border }]} />
        )}
      </TouchableOpacity>
    );
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'light-content'}
        backgroundColor={colors.primary}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Carousel Section */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={carouselScrollRef}
            data={CAROUSEL_ITEMS}
            keyExtractor={(item) => item.id}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentCarouselIndex(newIndex);
            }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Why Use Broadcast?
          </Text>
          <FlatList
            data={FEATURES}
            keyExtractor={(item) => item.id}
            renderItem={renderFeatureCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresList}
            snapToInterval={width * 0.7 + 12}
            decelerationRate="fast"
          />
        </View>

        <View style={[styles.introCard, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? 'transparent' : '#000',
        }]}>
          <View style={[styles.introIcon, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="megaphone" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            Broadcast messages allow you to send announcements to multiple contacts at once.
            Each recipient will receive the message as a private message.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? 'transparent' : '#000',
          }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{selectedUsers.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Selected</Text>
          </View>
          <View style={[styles.statCard, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? 'transparent' : '#000',
          }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{userData.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Contacts</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.newBroadcastButton, { 
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          }]}
          onPress={() => setShowUserModal(true)}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.newBroadcastButtonText}>New Broadcast</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Select Users Modal */}
      <Modal visible={showUserModal} animationType="slide" transparent>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Recipients</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.searchContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
              <TextInput
                placeholder="Search contacts..."
                placeholderTextColor={colors.textTertiary}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            <FlatList
              data={userData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRecipientItem}
              contentContainerStyle={styles.recipientList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="people" size={48} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contacts available</Text>
                </View>
              }
            />

            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Text style={[styles.selectedCount, { color: colors.textSecondary }]}>
                {selectedUsers.length} {selectedUsers.length === 1 ? 'recipient' : 'recipients'} selected
              </Text>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  selectedUsers.length === 0 && [styles.disabledButton, { backgroundColor: colors.border }],
                  { backgroundColor: colors.primary }
                ]}
                disabled={selectedUsers.length === 0}
                onPress={() => {
                  setShowUserModal(false);
                  setShowMessageModal(true);
                }}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Compose Modal */}
      <Modal visible={showMessageModal} animationType="slide" transparent>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Compose Message</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.recipientPreview, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.recipientPreviewText, { color: colors.primary }]}>
                Sending to {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
              </Text>
            </View>

            <TextInput
              placeholder="Type your broadcast message..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.messageInput, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.text
              }]}
              value={message}
              onChangeText={setMessage}
              multiline
            />

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={[styles.removeImageButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                  onPress={() => setImage(null)}
                >
                  <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.attachmentButtons}>
              <TouchableOpacity 
                style={[styles.attachmentButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={openImagePicker}
              >
                <Icon name="image" size={20} color={colors.primary} />
                <Text style={[styles.attachmentButtonText, { color: colors.primary }]}>Add Image</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (message.trim().length === 0 && !image) && [styles.disabledButton, { backgroundColor: colors.border }],
                { backgroundColor: colors.primary }
              ]}
              disabled={message.trim().length === 0 && !image}
              onPress={handleBroadcastNow}
            >
              <Text style={styles.sendButtonText}>Send Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Processing Modal */}
      <Modal visible={showProcessingModal} transparent animationType="fade">
        <View style={[styles.processingModalContainer, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.processingModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>Sending Broadcast</Text>
              <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                {progress.current} of {progress.total} sent
              </Text>
            </View>

            <View style={[styles.progressBarContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: colors.primary,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>

            <Text style={[styles.progressPercentage, { color: colors.primary }]}>
              {getProgressPercentage()}%
            </Text>

            <ActivityIndicator size="large" color={colors.primary} style={styles.progressSpinner} />

            {failedRecipients.length > 0 && (
              <View style={[styles.failedContainer, { borderTopColor: colors.border }]}>
                <Text style={[styles.failedTitle, { color: colors.error || '#ff4444' }]}>
                  {failedRecipients.length} {failedRecipients.length === 1 ? 'message' : 'messages'} failed to send
                </Text>
                <ScrollView style={styles.failedList}>
                  {failedRecipients.map((recipient, index) => (
                    <View key={index} style={styles.failedItem}>
                      <Text style={[styles.failedName, { color: colors.text }]}>{recipient.name}</Text>
                      <Text style={[styles.failedError, { color: colors.error || '#ff4444' }]}>{recipient.error}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  carouselWrapper: {
    marginBottom: 20,
    marginHorizontal: -16,
  },
  carouselCard: {
    width: width - 32,
    height: 220,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  carouselImageBackground: {
    width: '100%',
    height: '100%',
  },
  carouselImageStyle: {
    borderRadius: 16,
  },
  carouselGradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  carouselDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  featuresList: {
    paddingRight: 16,
  },
  featureCard: {
    width: width * 0.7,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    height: 160,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  featureGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  featureContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  introCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  newBroadcastButton: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newBroadcastButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.85,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  recipientList: {
    paddingHorizontal: 16,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectedRecipient: {},
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recipientMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedCheck: {
    width: 24,
    height: 24,
  },
  unselectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  selectedCount: {
    fontSize: 14,
  },
  nextButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  recipientPreview: {
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipientPreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageInput: {
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  attachmentButtonText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  sendButton: {
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  processingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModalContent: {
    borderRadius: 16,
    width: width * 0.85,
    padding: 20,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressPercentage: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressSpinner: {
    marginVertical: 16,
  },
  failedContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  failedTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  failedList: {
    maxHeight: 150,
  },
  failedItem: {
    marginBottom: 8,
  },
  failedName: {
    fontSize: 14,
    fontWeight: '500',
  },
  failedError: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});