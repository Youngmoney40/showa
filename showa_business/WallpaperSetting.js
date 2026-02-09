import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const defaultWallpapers = [
  require('../assets/backroundsplash.png'),
  require('../assets/wallpaper/spring-5016266_1280.jpg'),
  require('../assets/wallpaper/8a91c94c-a725-41fc-b65a-69237c6b12f2.png'),
  require('../assets/wallpaper/whitebkpattern.jpg'),
  require('../assets/wallpaper/ggg.jpg'),
  require('../assets/wallpaper/3013e3495a1ce2ddc938f75fb3c50c86.jpg'),
  require('../assets/wallpaper/8379d5e75849275387025f8745f7701a.png'),
  require('../assets/wallpaper/76406.jpg'),
  require('../assets/wallpaper/b91dc2113881469c07ac99ad9a024a01.jpg'),
  require('../assets/wallpaper/fon-dlya-vatsap-3.jpg'),
  require('../assets/wallpaper/whatsapp_bg_chat_img.jpeg'),
];

// Helper function to get image source
const getImageSource = (imageAsset) => {
  if (Platform.OS === 'ios') {
    return Image.resolveAssetSource(imageAsset);
  }
  return imageAsset;
};

const Wallpaper = ({ navigation }) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [selectedWallpaperType, setSelectedWallpaperType] = useState('default'); // 'default' or 'custom'

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePickImage = () => {
    launchImageLibrary({ 
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    }, (response) => {
      if (response?.assets && response.assets.length > 0) {
        const selected = response.assets[0].uri;
        setSelectedWallpaper(selected);
        setSelectedWallpaperType('custom');
        AsyncStorage.setItem('chatBackground', JSON.stringify({ 
          type: 'image', 
          value: selected,
          source: 'gallery'
        })).then(() => {
          navigation.goBack(); 
        });
      }
    });
  };

  const handleSelectDefault = (wallpaper, index) => {
    const source = getImageSource(wallpaper);
    setSelectedWallpaper(source.uri || source);
    setSelectedWallpaperType('default');
    AsyncStorage.setItem('chatBackground', JSON.stringify({ 
      type: 'image', 
      value: source.uri || source,
      source: 'default',
      index: index
    })).then(() => {
      navigation.goBack(); 
    });
  };

  const options = [
    {
      key: 'pickImage',
      label: 'Choose from Gallery',
      icon: 'image-outline',
      onPress: handlePickImage,
    },
  ];

  const renderWallpaperItem = ({ item, index }) => {
    const source = getImageSource(item);
    const isSelected = selectedWallpaperType === 'default' && 
                      selectedWallpaper === (source.uri || source);
    
    return (
      <TouchableOpacity onPress={() => handleSelectDefault(item, index)}>
        <View style={styles.phoneFrame}>
          <Image 
            source={item} 
            style={styles.wallpaperPreview}
            resizeMode="cover"
          />
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Icon name="checkmark-circle" size={30} color="#0d64dd" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Chat Wallpaper</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Gallery Option */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Wallpaper</Text>
            {options.map(({ key, label, icon, onPress }) => (
              <TouchableOpacity 
                key={key} 
                style={styles.menuItem} 
                onPress={onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconBox}>
                    <Icon name={icon} size={20} color="#0d64dd" />
                  </View>
                  <Text style={styles.menuText}>{label}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Default Wallpapers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Wallpapers</Text>
            <FlatList
              data={defaultWallpapers}
              numColumns={2}
              keyExtractor={(item, index) => `wallpaper-${index}`}
              renderItem={renderWallpaperItem}
              contentContainerStyle={styles.wallpaperList}
              scrollEnabled={false}
            />
          </View>

          {/* Preview Section */}
          {selectedWallpaper && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {selectedWallpaperType === 'custom' ? 'Selected from Gallery' : 'Selected Wallpaper'}
              </Text>
              <View style={[styles.phoneFrame, styles.previewFrame]}>
                <Image 
                  source={selectedWallpaperType === 'custom' ? { uri: selectedWallpaper } : 
                    defaultWallpapers.find((_, index) => 
                      selectedWallpaper === (getImageSource(defaultWallpapers[index]).uri || getImageSource(defaultWallpapers[index]))
                    )}
                  style={styles.wallpaperPreview}
                  resizeMode="cover"
                />
                <View style={styles.selectedPreviewBadge}>
                  <Icon name="checkmark" size={20} color="#fff" />
                  <Text style={styles.selectedPreviewText}>Selected</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#e8f2ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  wallpaperList: {
    paddingBottom: 10,
  },
  phoneFrame: {
    width: width / 2 - 25,
    height: (width / 2 - 25) * 1.8,
    margin: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  wallpaperPreview: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0d64dd',
  },
  previewFrame: {
    alignSelf: 'center',
    width: width - 60,
    height: (width - 60) * 1.8,
    marginTop: 10,
  },
  selectedPreviewBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#0d64dd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  selectedPreviewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Wallpaper;