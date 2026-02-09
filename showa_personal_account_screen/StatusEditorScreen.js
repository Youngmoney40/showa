import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector from 'react-native-emoji-selector';
import Canvas from 'react-native-canvas';
import { API_ROUTE } from '../api_routing/api';

const CreateStatusScreen = ({ navigation }) => {
  const [statusText, setStatusText] = useState('');
  const [image, setImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#a1057a');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);

  const colorOptions = [
    '#000000', '#1E90FF', '#FF6347','#a1057a', '#32CD32', '#FFD700', '#BA55D3', '#00CED1',
  ];

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back', quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Failed to open camera.');
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setBackgroundColor(null);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorCode) {
        Alert.alert('Gallery Error', response.errorMessage || 'Failed to open gallery.');
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setBackgroundColor(null);
      }
    });
  };

  const handleSelectImage = () => {
    Alert.alert('Choose Option', '', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const generateTextStatusImage = async () => {
    if (!canvasRef.current || !statusText.trim()) {
      console.log('generateTextStatusImage: No canvasRef or statusText');
      return null;
    }

    try {
      const canvas = canvasRef.current;
      canvas.width = 1080;
      canvas.height = 1920;

      const ctx = canvas.getContext('2d');
      console.log('generateTextStatusImage: Canvas context', !!ctx);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '60px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxWidth = canvas.width - 40;
      const lineHeight = 70;
      const words = statusText.split(' ');
      let line = '';
      let lines = [];
      for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const textY = canvas.height / 2 - (lines.length * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, textY + i * lineHeight);
      });

      const dataUrl = await canvas.toDataURL('image/jpeg', 0.7);
      console.log('generateTextStatusImage: Data URL length', dataUrl.length);
      // Convert base64 to file URI
      const base64Data = dataUrl.split(',')[1];
      return {
        uri: `data:image/jpeg;base64,${base64Data}`,
        type: 'image/jpeg',
        name: 'text_status.jpg',
      };
    } catch (error) {
      console.error('generateTextStatusImage: Canvas error:', error);
      Alert.alert('Error', 'Failed to generate text status image.');
      return null;
    }
  };

  const handlePostStatus = async () => {
    if (!image && !statusText.trim()) {
      Alert.alert('Error', 'Please select an image or enter a status text.');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No user token found');
      }
   

      const formData = new FormData();
      let media = image;
      if (!image && statusText.trim()) {

        media = await generateTextStatusImage();
        if (!media) {
          throw new Error('Failed to generate text status image');
        }
      }

      console.log('handlePostStatus: Media URI', media.uri.substring(0, 50) + '...');
      formData.append('media', {
        uri: media.uri,
        type: media.type || 'image/jpeg',
        name: media.name || 'status.jpg',
      });
      formData.append('text', statusText.trim());
      formData.append('status_type', 'image');
      const res = await axios.post(`${API_ROUTE}/status/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Your Status was uploaded successfully!');
      setImage(null);
      setStatusText('');
      setBackgroundColor('#000000');
      navigation.goBack();
    } catch (error) {
      
      
      Alert.alert('Upload Failed', error.message.includes('Network Error') ? 'Network issue detected. Please check your connection and try again.' : 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBack = () => {
    navigation.goBack();
  };

  const toggleColorPicker = () => {
    if (image) {
      Alert.alert('Info', 'Background color is only available for text statuses.');
      return;
    }
    setShowColorPicker(!showColorPicker);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: image ? '#000' : backgroundColor }]}>
      <Canvas ref={canvasRef} style={styles.hiddenCanvas} />
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={redirectBack}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
            <Icon name="happy-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectImage}>
            <Icon name="image-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleColorPicker}>
            <Icon name="color-palette-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.centerBox}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
            onError={() => console.log('Failed to load preview image')}
          />
        ) : null}
        <TextInput
          style={[styles.statusInput, image ? styles.statusInputWithImage : {}]}
          placeholder={image ? 'Add a caption...' : 'Type a status..'}
          placeholderTextColor={image ? '#888' : '#dfe6f1'}
          value={statusText}
          onChangeText={setStatusText}
          multiline
          maxLength={200}
          autoFocus
        />
      </ScrollView>

      {showColorPicker && !image ? (
        <View style={styles.colorPicker}>
          {colorOptions.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorOption, { backgroundColor: color }]}
              onPress={() => {
                setBackgroundColor(color);
                setShowColorPicker(false);
              }}
            />
          ))}
        </View>
      ) : null}

      <Modal
        visible={showEmojiPicker}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <SafeAreaView style={styles.emojiPickerContainer}>
          <View style={styles.emojiPickerHeader}>
            <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.emojiPickerHeaderText}>Select Emoji</Text>
            <View style={{ width: 24 }} />
          </View>
          <EmojiSelector
            onEmojiSelected={(emoji) => setStatusText((prev) => prev + emoji)}
            columns={8}
            showSearchBar={true}
            showTabs={true}
            showHistory={true}
            categoryPosition="top"
          />
        </SafeAreaView>
      </Modal>

      <TouchableOpacity
        style={[
          styles.postButton,
          (!image && !statusText.trim()) || isLoading ? styles.postButtonDisabled : {},
        ]}
        onPress={handlePostStatus}
        disabled={(!image && !statusText.trim()) || isLoading}
      >
        <Text style={styles.postButtonText}>{isLoading ? <ActivityIndicator color='#fff'  /> : 'Post Status'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenCanvas: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  centerBox: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statusInput: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  statusInputWithImage: {
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  postButton: {
    backgroundColor: '#0b07d5ff',
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#333',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emojiPickerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  emojiPickerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CreateStatusScreen;