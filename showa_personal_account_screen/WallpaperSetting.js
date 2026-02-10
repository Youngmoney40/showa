import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';

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
const getImageUri = (imageAsset) => {
  try {
    const resolvedSource = Image.resolveAssetSource(imageAsset);
    return resolvedSource.uri || resolvedSource;
  } catch (error) {
    console.error('Error resolving image source:', error);
    return null;
  }
};

const saveWallpaperData = async (data) => {
  try {
    await AsyncStorage.setItem('chatBackground', JSON.stringify(data));
    console.log('Wallpaper saved successfully:', data);
    return true;
  } catch (error) {
    console.error('Error saving wallpaper:', error);
    return false;
  }
};

const loadWallpaperData = async () => {
  try {
    const savedData = await AsyncStorage.getItem('chatBackground');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error('Error loading wallpaper:', error);
    return null;
  }
};

const Wallpaper = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [selectedWallpaperType, setSelectedWallpaperType] = useState(null);
  const [selectedWallpaperIndex, setSelectedWallpaperIndex] = useState(null);

  // Load saved wallpaper 
  useEffect(() => {
    loadSavedWallpaper();
  }, []);

  const loadSavedWallpaper = async () => {
    try {
      const savedData = await loadWallpaperData();
      if (savedData) {
        if (savedData.source === 'default' && savedData.index !== undefined) {
          setSelectedWallpaperIndex(savedData.index);
          setSelectedWallpaperType('default');
          if (defaultWallpapers[savedData.index]) {
            const uri = getImageUri(defaultWallpapers[savedData.index]);
            setSelectedWallpaper(uri);
          }
        } else if (savedData.source === 'gallery' && savedData.value) {
          setSelectedWallpaper(savedData.value);
          setSelectedWallpaperType('custom');
          setSelectedWallpaperIndex(null);
        }
        console.log('Loaded saved wallpaper:', savedData);
      }
    } catch (error) {
      console.error('Error loading saved wallpaper:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }

        if (response.errorCode) {
          console.error('Image picker error:', response.errorMessage);
          Alert.alert('Error', 'Failed to pick image. Please try again.');
          return;
        }

        if (response?.assets && response.assets.length > 0) {
          const selected = response.assets[0].uri;
          setSelectedWallpaper(selected);
          setSelectedWallpaperType('custom');
          setSelectedWallpaperIndex(null);

          const saveData = {
            type: 'image',
            value: selected,
            source: 'gallery',
            timestamp: new Date().toISOString(),
          };

          const saved = await saveWallpaperData(saveData);
          if (saved) {
            Alert.alert('Success', 'Wallpaper saved successfully!', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } else {
            Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
          }
        }
      }
    );
  };

  const handleSelectDefault = async (index) => {
    if (index < 0 || index >= defaultWallpapers.length) {
      console.error('Invalid wallpaper index:', index);
      return;
    }

    const wallpaper = defaultWallpapers[index];
    const uri = getImageUri(wallpaper);

    if (!uri) {
      Alert.alert('Error', 'Could not load wallpaper. Please try another.');
      return;
    }

    setSelectedWallpaper(uri);
    setSelectedWallpaperType('default');
    setSelectedWallpaperIndex(index);

    const saveData = {
      type: 'image',
      source: 'default',
      index: index,
      uri: uri, 
      timestamp: new Date().toISOString(),
    };

    const saved = await saveWallpaperData(saveData);
    if (saved) {
      Alert.alert('Success', 'Wallpaper saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
    }
  };

  const handleResetWallpaper = async () => {
    try {
      await AsyncStorage.removeItem('chatBackground');
      setSelectedWallpaper(null);
      setSelectedWallpaperType(null);
      setSelectedWallpaperIndex(null);
      Alert.alert('Success', 'Wallpaper reset to default');
    } catch (error) {
      console.error('Error resetting wallpaper:', error);
      Alert.alert('Error', 'Failed to reset wallpaper');
    }
  };

  const options = [
    {
      key: 'pickImage',
      label: 'Choose from Gallery',
      icon: 'image-outline',
      onPress: handlePickImage,
    },
    {
      key: 'reset',
      label: 'Reset to Default',
      icon: 'refresh-outline',
      onPress: handleResetWallpaper,
    },
  ];

  const styles = createStyles(colors, isDark);

  const renderWallpaperItem = ({ item, index }) => {
    const isSelected = selectedWallpaperType === 'default' && selectedWallpaperIndex === index;

    return (
      <TouchableOpacity
        onPress={() => handleSelectDefault(index)}
        activeOpacity={0.7}
      >
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
        {isSelected && (
          <Text style={styles.selectedLabel}>Selected</Text>
        )}
      </TouchableOpacity>
    );
  };

  const getSelectedImageSource = () => {
    if (selectedWallpaperType === 'custom') {
      return { uri: selectedWallpaper };
    } else if (selectedWallpaperType === 'default' && selectedWallpaperIndex !== null) {
      return defaultWallpapers[selectedWallpaperIndex];
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
         
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallpaper Options</Text>
            {options.map(({ key, label, icon, onPress }) => (
              <TouchableOpacity
                key={key}
                style={styles.menuItem}
                onPress={onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconBox}>
                    <Icon
                      name={icon}
                      size={20}
                      color={isDark ? '#60a5fa' : '#0d64dd'}
                    />
                  </View>
                  <Text style={styles.menuText}>{label}</Text>
                </View>
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            ))}
          </View>

         
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

         
          {selectedWallpaper && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {selectedWallpaperType === 'custom'
                  ? 'Selected from Gallery'
                  : 'Selected Wallpaper'}
              </Text>
              <View style={[styles.phoneFrame, styles.previewFrame]}>
                <Image
                  source={getSelectedImageSource()}
                  style={styles.wallpaperPreview}
                  resizeMode="cover"
                />
                <View style={styles.selectedPreviewBadge}>
                  <Icon name="checkmark" size={20} color="#fff" />
                  <Text style={styles.selectedPreviewText}>
                    {selectedWallpaperType === 'custom' ? 'Custom' : 'Default'}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewInfo}>
                {selectedWallpaperType === 'custom'
                  ? 'This wallpaper will be applied to all chats'
                  : `Default wallpaper #${selectedWallpaperIndex + 1} selected`}
              </Text>
            </View>
          )}

         
          {!selectedWallpaper && (
            <View style={styles.section}>
              <Text style={styles.infoText}>
                No wallpaper selected. Choose from gallery or select a default wallpaper above.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.background,
    },
    section: {
      marginVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.cardBackground || colors.background,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: isDark ? 3 : 1,
        },
      }),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#60a5fa' : '#0d64dd',
      marginBottom: 15,
      letterSpacing: 0.3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBox: {
      backgroundColor: isDark ? '#1e3a8a' : '#e8f2ff',
      padding: 10,
      borderRadius: 10,
      marginRight: 15,
    },
    menuText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    wallpaperList: {
      paddingBottom: 10,
    },
    phoneFrame: {
      width: width / 2 - 25,
      height: (width / 2 - 25) * 1.8,
      margin: 5,
      padding: 0,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#e0e0e0',
      backgroundColor: isDark ? '#1f2937' : '#f5f5f5',
      position: 'relative',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: isDark ? 4 : 3,
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
      backgroundColor: isDark ? 'rgba(30, 58, 138, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#0d64dd',
    },
    selectedLabel: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.text,
      marginTop: 5,
      fontWeight: '500',
    },
    previewFrame: {
      alignSelf: 'center',
      width: width - 60,
      height: (width - 60) * 1.8,
      marginTop: 10,
      marginBottom: 15,
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
    previewInfo: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.textSecondary || '#666',
      marginTop: 10,
    },
    infoText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.textSecondary || '#666',
      paddingVertical: 20,
    },
  });

export default Wallpaper;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   FlatList,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { launchImageLibrary } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { width } = Dimensions.get('window');

// const defaultWallpapers = [
//   require('../assets/backroundsplash.png'),
//   require('../assets/wallpaper/spring-5016266_1280.jpg'),
//   require('../assets/wallpaper/8a91c94c-a725-41fc-b65a-69237c6b12f2.png'),
//   require('../assets/wallpaper/whitebkpattern.jpg'),
//   require('../assets/wallpaper/ggg.jpg'),
//   require('../assets/wallpaper/3013e3495a1ce2ddc938f75fb3c50c86.jpg'),
//   require('../assets/wallpaper/8379d5e75849275387025f8745f7701a.png'),
//   require('../assets/wallpaper/76406.jpg'),
//   require('../assets/wallpaper/b91dc2113881469c07ac99ad9a024a01.jpg'),
//   require('../assets/wallpaper/fon-dlya-vatsap-3.jpg'),
//   require('../assets/wallpaper/whatsapp_bg_chat_img.jpeg'),
// ];

// const getImageSource = (imageAsset) => {
//   if (Platform.OS === 'ios') {
//     return Image.resolveAssetSource(imageAsset);
//   }
//   return imageAsset;
// };

// const Wallpaper = ({ navigation }) => {
//   const { colors, isDark } = useTheme(); 
//   const [selectedWallpaper, setSelectedWallpaper] = useState(null);
//   const [selectedWallpaperType, setSelectedWallpaperType] = useState('default'); 

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const handlePickImage = () => {
//     launchImageLibrary({ 
//       mediaType: 'photo',
//       quality: 0.8,
//       selectionLimit: 1,
//     }, (response) => {
//       if (response?.assets && response.assets.length > 0) {
//         const selected = response.assets[0].uri;
//         setSelectedWallpaper(selected);
//         setSelectedWallpaperType('custom');
//         AsyncStorage.setItem('chatBackground', JSON.stringify({ 
//           type: 'image', 
//           value: selected,
//           source: 'gallery'
//         })).then(() => {
//           navigation.goBack(); 
//         });
//       }
//     });
//   };

//   const handleSelectDefault = (wallpaper, index) => {
//     const source = getImageSource(wallpaper);
//     setSelectedWallpaper(source.uri || source);
//     setSelectedWallpaperType('default');
//     AsyncStorage.setItem('chatBackground', JSON.stringify({ 
//       type: 'image', 
//       value: source.uri || source,
//       source: 'default',
//       index: index
//     })).then(() => {
//       navigation.goBack(); 
//     });
//   };

//   const options = [
//     {
//       key: 'pickImage',
//       label: 'Choose from Gallery',
//       icon: 'image-outline',
//       onPress: handlePickImage,
//     },
//   ];

//   const styles = createStyles(colors, isDark);

//   const renderWallpaperItem = ({ item, index }) => {
//     const source = getImageSource(item);
//     const isSelected = selectedWallpaperType === 'default' && 
//     selectedWallpaper === (source.uri || source);
    
//     return (
//       <TouchableOpacity onPress={() => handleSelectDefault(item, index)}>
//         <View style={styles.phoneFrame}>
//           <Image 
//             source={item} 
//             style={styles.wallpaperPreview}
//             resizeMode="cover"
//           />
//           {isSelected && (
//             <View style={styles.selectedOverlay}>
//               <Icon name="checkmark-circle" size={30} color="#0d64dd" />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//             <Icon name="arrow-back" size={24} color="#fff" />
//             <Text style={styles.headerTitle}>Chat Wallpaper</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView 
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Gallery Option */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Custom Wallpaper</Text>
//             {options.map(({ key, label, icon, onPress }) => (
//               <TouchableOpacity 
//                 key={key} 
//                 style={styles.menuItem} 
//                 onPress={onPress}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.menuItemLeft}>
//                   <View style={styles.iconBox}>
//                     <Icon name={icon} size={20} color={isDark ? '#60a5fa' : '#0d64dd'} />
//                   </View>
//                   <Text style={styles.menuText}>{label}</Text>
//                 </View>
//                 <Icon name="chevron-forward-outline" size={20} color={colors.text} />
//               </TouchableOpacity>
//             ))}
//           </View>
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Featured Wallpapers</Text>
//             <FlatList
//               data={defaultWallpapers}
//               numColumns={2}
//               keyExtractor={(item, index) => `wallpaper-${index}`}
//               renderItem={renderWallpaperItem}
//               contentContainerStyle={styles.wallpaperList}
//               scrollEnabled={false}
//             />
//           </View>

//           {selectedWallpaper && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>
//                 {selectedWallpaperType === 'custom' ? 'Selected from Gallery' : 'Selected Wallpaper'}
//               </Text>
//               <View style={[styles.phoneFrame, styles.previewFrame]}>
//                 <Image 
//                   source={selectedWallpaperType === 'custom' ? { uri: selectedWallpaper } : 
//                     defaultWallpapers.find((_, index) => 
//                       selectedWallpaper === (getImageSource(defaultWallpapers[index]).uri || getImageSource(defaultWallpapers[index]))
//                     )}
//                   style={styles.wallpaperPreview}
//                   resizeMode="cover"
//                 />
//                 <View style={styles.selectedPreviewBadge}>
//                   <Icon name="checkmark" size={20} color="#fff" />
//                   <Text style={styles.selectedPreviewText}>Selected</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const createStyles = (colors, isDark) => StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 60,
//     paddingHorizontal: 15,
//     backgroundColor: '#0d64dd',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: '#fff',
//     marginLeft: 15,
//     fontWeight: '600',
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   section: {
//     marginVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: colors.background,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//     ...Platform.select({
//       ios: {
//         shadowColor: isDark ? '#000' : '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: isDark ? 0.3 : 0.05,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: isDark ? 3 : 2,
//       },
//     }),
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: isDark ? '#60a5fa' : '#0d64dd',
//     marginBottom: 15,
//     letterSpacing: 0.3,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     backgroundColor: colors.background,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconBox: {
//     backgroundColor: isDark ? '#1e3a8a' : '#e8f2ff',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   menuText: {
//     fontSize: 16,
//     color: colors.text,
//     fontWeight: '500',
//   },
//   wallpaperList: {
//     paddingBottom: 10,
//   },
//   phoneFrame: {
//     width: width / 2 - 25,
//     height: (width / 2 - 25) * 1.8,
//     margin: 5,
//     padding: 0,
//     borderRadius: 20,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: isDark ? '#374151' : '#e0e0e0',
//     backgroundColor: isDark ? '#1f2937' : '#f5f5f5',
//     position: 'relative',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: isDark ? 0.3 : 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: isDark ? 4 : 3,
//       },
//     }),
//   },
//   wallpaperPreview: {
//     width: '100%',
//     height: '100%',
//   },
//   selectedOverlay: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: isDark ? 'rgba(30, 58, 138, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//   },
//   previewFrame: {
//     alignSelf: 'center',
//     width: width - 60,
//     height: (width - 60) * 1.8,
//     marginTop: 10,
//   },
//   selectedPreviewBadge: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     backgroundColor: '#0d64dd',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 6,
//   },
//   selectedPreviewText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default Wallpaper;
