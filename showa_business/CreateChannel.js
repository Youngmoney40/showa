import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import Snackbar from '../components/SnackBar';
import { useTheme } from '../src/context/ThemeContext';

// Expanded categories for social media app
const categories = [
  '🎮 Gaming', '⚽ Sports', '🎵 Music', '💻 Technology', 
  '📚 Education', '🍿 Entertainment', '💼 Business', 
  '💪 Fitness', '✈️ Travel', '🍳 Food & Cooking',
  '🎨 Art & Design', '📸 Photography', '📺 Movies & TV',
  '📱 Social Media', '💰 Finance', '🧘 Wellness',
  '🐾 Pets', '🚗 Automotive', '👗 Fashion', '🏡 Home & Garden',
  '🔬 Science', '🎭 Comedy', '📖 Books', '🌍 News & Politics'
];

export default function CreateChannelScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleImagePick = () => {
    launchImageLibrary({ 
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      showSnackbar('Please enter a channel name');
      return;
    }

    if (!category) {
      showSnackbar('Please select a category');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', channelName.trim());
    formData.append('description', description.trim());
    
    // Remove emoji from category for backend
    const categoryWithoutEmoji = category.replace(/^[^\w\s]*\s*/, '');
    formData.append('category', categoryWithoutEmoji);

    if (image) {
      const uri = image.startsWith('file://') ? image : `file://${image}`;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri,
        name: filename,
        type,
      });
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `${API_ROUTE}/channels/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (res.status === 201 || res.status === 200) {
        showSnackbar('🎉 Channel created successfully!');
        setTimeout(() => {
          navigation.goBack();
          setChannelName('');
          setDescription('');
          setCategory('');
          setImage(null);
        }, 1500);
      } else {
        showSnackbar('Failed to create channel. Please try again.');
      }
    } catch (error) {
      console.log('Upload error', error?.response?.data || error?.message);
      if (error.response?.status === 409) {
        showSnackbar('A channel with this name already exists');
      } else {
        showSnackbar('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { 
        borderBottomColor: colors.border,
        backgroundColor: colors.card 
      }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Channel</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Channel Image Upload */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={handleImagePick}
            activeOpacity={0.8}
          >
            {image ? (
              <>
                <Image source={{ uri: image }} style={[styles.image, { borderColor: colors.card }]} />
                <View style={[styles.imageOverlay, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="edit" size={24} color="#fff" />
                </View>
              </>
            ) : (
              <View style={[styles.placeholder, { 
                borderColor: colors.border,
                backgroundColor: colors.backgroundSecondary 
              }]}>
                <Icon name="camera-outline" size={32} color={colors.textSecondary} />
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Add Photo</Text>
                <Text style={[styles.placeholderSubText, { color: colors.textSecondary }]}>500×500px</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Channel Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Channel Name *</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.backgroundSecondary 
            }]}
            placeholder="Enter a unique name for your channel"
            placeholderTextColor={colors.textSecondary}
            value={channelName}
            onChangeText={setChannelName}
            maxLength={50}
            autoCapitalize="words"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {channelName.length}/50
          </Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.backgroundSecondary 
            }]}
            placeholder="Tell people what your channel is about"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {description.length}/200
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Select Category *</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  category === cat && styles.categorySelected,
                  { 
                    backgroundColor: category === cat ? colors.primary : colors.backgroundSecondary,
                    borderColor: category === cat ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextSelected,
                    { color: category === cat ? '#fff' : colors.text }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: isDark ? 0.4 : 0.3,
            },
            (!channelName.trim() || !category || loading) && [styles.buttonDisabled, { 
              backgroundColor: isDark ? colors.backgroundSecondary : '#B3D7FF',
              shadowOpacity: 0 
            }]
          ]} 
          onPress={handleCreateChannel}
          disabled={!channelName.trim() || !category || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.buttonText}>Creating...</Text>
            </View>
          ) : (
            <>
              <MaterialIcons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Create Channel</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tips Section */}
        <View style={[styles.tipsContainer, { 
          backgroundColor: isDark ? '#2D3748' : '#FFF8E1',
          borderColor: isDark ? colors.border : '#FFECB3'
        }]}>
          <View style={styles.tipHeader}>
            <MaterialIcons name="lightbulb-outline" size={20} color={isDark ? '#FFD700' : '#FFB74D'} />
            <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips for a great channel</Text>
          </View>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Choose a clear, descriptive name</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Add a high-quality profile picture</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Write a compelling description</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Select the most relevant category</Text>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        isDark={isDark}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePicker: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  categoryScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryScrollContent: {
    paddingRight: 20,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
  },
  categorySelected: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    fontWeight: '600',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});