

// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   StatusBar,
//   Dimensions,
//   ScrollView,
//   KeyboardAvoidingView,
//   Alert,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import Video from 'react-native-video';
// import Snackbar from 'react-native-snackbar';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';

// const { width, height } = Dimensions.get('window');


// const hashTag = [
//   "Music",
// ]

// const UploadShortScreen = ({ navigation }) => {
//   const [video, setVideo] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const videoRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   const selectVideoFromGallery = () => {
//     const options = {
//       mediaType: 'video',
//       videoQuality: 'high',
//       durationLimit: 60,
//     };
    
//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) return;
      
//       if (response.error) {
//         Snackbar.show({
//           text: 'Error selecting video',
//           backgroundColor: '#FF6B6B',
//         });
//         return;
//       }
      
//       if (response.assets && response.assets.length > 0) {
//         const selectedVideo = response.assets[0];
//         if (selectedVideo.duration > 60000) {
//           Snackbar.show({
//             text: 'Video must be 60 seconds or shorter',
//             backgroundColor: '#FF6B6B',
//           });
//           return;
//         }
//         setVideo(selectedVideo);
//       }
//     });
//   };

//   const recordVideoFromCamera = () => {
//     const options = {
//       mediaType: 'video',
//       videoQuality: 'high',
//       durationLimit: 15,
//       saveToPhotos: false,
//     };
    
//     launchCamera(options, (response) => {
//       if (response.didCancel) return;
      
//       if (response.error) {
//         Snackbar.show({
//           text: 'Camera error',
//           backgroundColor: '#FF6B6B',
//         });
//         return;
//       }
      
//       if (response.assets && response.assets.length > 0) {
//         setVideo(response.assets[0]);
//       }
//     });
//   };

//   const togglePlayPause = () => {
//     setIsPaused(!isPaused);
//   };

//   const handleUpload = async () => {
//     if (!video) {
//       Snackbar.show({
//         text: 'Please select a video first',
//         backgroundColor: '#FF6B6B',
//       });
//       return;
//     }

//     if (!caption.trim()) {
//       Snackbar.show({
//         text: 'Please add a caption',
//         backgroundColor: '#FF6B6B',
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('caption', caption);
//     formData.append('video', {
//       uri: video.uri,
//       name: video.fileName || `short_${Date.now()}.mp4`,
//       type: video.type || 'video/mp4',
//     });

//     try {
//       setIsUploading(true);
//       const token = await AsyncStorage.getItem('userToken');

//       await axios.post(`${API_ROUTE}/shorts/`, formData, { 
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       Snackbar.show({
//         text: 'Short uploaded successfully!',
//         backgroundColor: '#51A851',
//       });
      

//       setCaption('');
//       setVideo(null);
//       navigation.navigate('SocialHome', { newShort: true });
//     } catch (error) {
//       console.error('Upload error:', error);
//       Snackbar.show({
//         text: 'Upload failed. Please try again.',
//         backgroundColor: '#FF6B6B',
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const clearVideo = () => {
//     setVideo(null);
//   };

//   const scrollToInput = (yOffset) => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
//     }
//   };

//   return (
//     <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <View style={styles.container}>
//           <StatusBar barStyle={Platform.OS === 'android'? 'light-content' : 'light-content'} backgroundColor="#000" />
//           <View style={styles.header}>
//             <TouchableOpacity 
//               onPress={() => navigation.goBack()} 
//               style={styles.backButton}
//             >
//               <Icon name="arrow-back" size={24} color="#FFF" />
//             </TouchableOpacity>
            
//             <Text style={styles.headerTitle}>Create Short</Text>
            
//             <TouchableOpacity 
//               onPress={handleUpload} 
//               disabled={isUploading || !video || !caption.trim()}
//               style={[
//                 styles.postButton,
//                 (!video || !caption.trim()) && styles.postButtonDisabled
//               ]}
//             >
//               {isUploading ? (
//                 <ActivityIndicator color="#FFF" size="small" />
//               ) : (
//                 <Text style={styles.postButtonText}>Post</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.content}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="interactive"
//             contentContainerStyle={{ paddingBottom: 40 }}
//           >
//             {/* Video Preview Section */}
//             <View style={styles.previewSection}>
//               {video ? (
//                 <View style={styles.videoContainer}>
//                   <Video
//                     ref={videoRef}
//                     source={{ uri: video.uri }}
//                     style={styles.videoPreview}
//                     resizeMode="cover"
//                     paused={isPaused}
//                     repeat={true}
//                     muted={true}
//                   />
                  
//                   <View style={styles.videoOverlay}>
//                     <TouchableOpacity 
//                       style={styles.playButton}
//                       onPress={togglePlayPause}
//                     >
//                       <Icon 
//                         name={isPaused ? "play-arrow" : "pause"} 
//                         size={32} 
//                         color="#FFF" 
//                       />
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                       style={styles.clearButton}
//                       onPress={clearVideo}
//                     >
//                       <Icon name="close" size={20} color="#FFF" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ) : (
//                 <View style={styles.placeholderContainer}>
//                   <Icon name="videocam" size={64} color="#666" />
//                   <Text style={styles.placeholderText}>
//                     Select a video to get started
//                   </Text>
//                   <Text style={styles.placeholderSubtext}>
//                     Maximum 60 seconds
//                   </Text>
//                 </View>
//               )}
//             </View>
           
//             <View style={styles.actionButtons}>
//               <TouchableOpacity 
//                 onPress={selectVideoFromGallery} 
//                 style={styles.actionButton}
//               >
//                 <View style={[styles.buttonIcon, { backgroundColor: '#6366F1' }]}>
//                   <Icon name="photo-library" size={24} color="#FFF" />
//                 </View>
//                 <Text style={styles.actionButtonText}>Choose from Gallery</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 onPress={recordVideoFromCamera} 
//                 style={styles.actionButton}
//               >
//                 <View style={[styles.buttonIcon, { backgroundColor: '#EF4444' }]}>
//                   <Icon name="videocam" size={24} color="#FFF" />
//                 </View>
//                 <Text style={styles.actionButtonText}>Record Video</Text>
//               </TouchableOpacity>
//             </View>

            
//             <View style={styles.captionSection}>
//               <Text style={styles.sectionLabel}>Caption</Text>
//               <TextInput
//                 placeholder="What's happening?"
//                 placeholderTextColor="#94A3B8"
//                 style={styles.captionInput}
//                 value={caption}
//                 onChangeText={setCaption}
//                 multiline={true}
//                 maxLength={150}
//                 textAlignVertical="top"
//                 onFocus={() => scrollToInput(200)}
//               />
//               <View style={styles.captionFooter}>
//                 <Text style={styles.charCount}>
//                   {caption.length}/150
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.infoSection}>
//               <Icon name="info" size={18} color="#94A3B8" />
//               <Text style={styles.infoText}>
//                 Your short will be visible to everyone and may appear in recommendations
//               </Text>
//             </View>
//           </ScrollView>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0F0F0F',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: '#1A1A1A',
//     borderBottomWidth: 1,
//     borderBottomColor: '#2A2A2A',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFF',
//   },
//   postButton: {
//     backgroundColor: '#6366F1',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   postButtonDisabled: {
//     backgroundColor: '#374151',
//     opacity: 0.6,
//   },
//   postButtonText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   previewSection: {
//     marginBottom: 24,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#1A1A1A',
//     height: height * 0.35,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   videoContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   videoPreview: {
//     width: '100%',
//     height: '100%',
//   },
//   videoOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   playButton: {
//     padding: 16,
//     borderRadius: 40,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   clearButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   placeholderText: {
//     color: '#E5E7EB',
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   placeholderSubtext: {
//     color: '#94A3B8',
//     fontSize: 14,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   actionButtons: {
//     marginBottom: 24,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1A1A1A',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   buttonIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   actionButtonText: {
//     color: '#E5E7EB',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   captionSection: {
//     marginBottom: 24,
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   sectionLabel: {
//     color: '#E5E7EB',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   captionInput: {
//     backgroundColor: '#0F0F0F',
//     borderRadius: 8,
//     padding: 12,
//     color: '#E5E7EB',
//     minHeight: 100,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   captionFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 8,
//   },
//   charCount: {
//     color: '#94A3B8',
//     fontSize: 14,
//   },
//   infoSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#1E3A8A',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   infoText: {
//     color: '#E0F2FE',
//     fontSize: 14,
//     marginLeft: 12,
//     flex: 1,
//     lineHeight: 20,
//   },
// });

// export default UploadShortScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Video from 'react-native-video';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';

const { width, height } = Dimensions.get('window');

const POPULAR_HASHTAGS = [
  "#Music",
  "#Dance",
  "#Comedy",
  "#Fashion",
  "#Beauty",
  "#Fitness",
  "#Food",
  "#Travel",
  "#Sports",
  "#Gaming",
  "#DIY",
  "#Education",
  "#Technology",
  "#Business",
  "#Art",
  "#Photography",
  "#Nature",
  "#Pets",
  "#Family",
  "#Lifestyle",
  "#Motivation",
  "#Tutorial",
  "#Review",
  "#Unboxing",
  "#Challenge",
  "#Trending",
  "#Viral",
  "#Shorts",
  "#Funny",
  "#Cooking"
];

const UploadShortScreen = ({ navigation }) => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [customHashtag, setCustomHashtag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const videoRef = useRef(null);
  const scrollViewRef = useRef(null);

  const selectVideoFromGallery = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: 60,
    };
    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      
      if (response.error) {
        Snackbar.show({
          text: 'Error selecting video',
          backgroundColor: '#FF6B6B',
        });
        return;
      }
      
      if (response.assets && response.assets.length > 0) {
        const selectedVideo = response.assets[0];
        if (selectedVideo.duration > 60000) {
          Snackbar.show({
            text: 'Video must be 60 seconds or shorter',
            backgroundColor: '#FF6B6B',
          });
          return;
        }
        setVideo(selectedVideo);
      }
    });
  };

  const recordVideoFromCamera = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: 15,
      saveToPhotos: false,
    };
    
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      
      if (response.error) {
        Snackbar.show({
          text: 'Camera error',
          backgroundColor: '#FF6B6B',
        });
        return;
      }
      
      if (response.assets && response.assets.length > 0) {
        setVideo(response.assets[0]);
      }
    });
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };

  // Handle hashtag selection
  const toggleHashtag = (hashtag) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
    } else {
      if (selectedHashtags.length < 5) {
        setSelectedHashtags([...selectedHashtags, hashtag]);
      } else {
        Snackbar.show({
          text: 'Maximum 5 hashtags allowed',
          backgroundColor: '#FF6B6B',
        });
      }
    }
  };

  // Add custom hashtag
  const addCustomHashtag = () => {
    const trimmed = customHashtag.trim();
    if (!trimmed) return;

    // Format hashtag - add # if not present
    let formattedTag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    
    // Remove spaces and special characters (keep only letters, numbers, and underscores)
    formattedTag = '#' + formattedTag.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
    
    if (formattedTag.length < 2 || formattedTag === '#') {
      Snackbar.show({
        text: 'Hashtag must be at least 2 characters',
        backgroundColor: '#FF6B6B',
      });
      return;
    }

    if (selectedHashtags.length >= 5) {
      Snackbar.show({
        text: 'Maximum 5 hashtags allowed',
        backgroundColor: '#FF6B6B',
      });
      return;
    }

    if (!selectedHashtags.includes(formattedTag)) {
      setSelectedHashtags([...selectedHashtags, formattedTag]);
      setCustomHashtag('');
      setShowHashtagSuggestions(false);
    } else {
      Snackbar.show({
        text: 'Hashtag already added',
        backgroundColor: '#FF6B6B',
      });
    }
  };

  // Remove hashtag
  const removeHashtag = (hashtag) => {
    setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
  };

  // Filter hashtag suggestions based on input
  const getHashtagSuggestions = () => {
    if (!customHashtag.trim()) return [];
    const searchTerm = customHashtag.toLowerCase().replace('#', '');
    return POPULAR_HASHTAGS.filter(tag => 
      tag.toLowerCase().includes(searchTerm) && !selectedHashtags.includes(tag)
    ).slice(0, 5);
  };

  const handleUpload = async () => {
    if (!video) {
      Snackbar.show({
        text: 'Please select a video first',
        backgroundColor: '#FF6B6B',
      });
      return;
    }

    if (!caption.trim()) {
      Snackbar.show({
        text: 'Please add a caption',
        backgroundColor: '#FF6B6B',
      });
      return;
    }

    if (selectedHashtags.length === 0) {
      Snackbar.show({
        text: 'Please add at least one hashtag',
        backgroundColor: '#FF6B6B',
      });
      return;
    }

    // Combine caption with hashtags
    const captionWithHashtags = `${caption}\n\n${selectedHashtags.join(' ')}`;

    const formData = new FormData();
    formData.append('caption', captionWithHashtags);
    formData.append('video', {
      uri: video.uri,
      name: video.fileName || `short_${Date.now()}.mp4`,
      type: video.type || 'video/mp4',
    });

    try {
      setIsUploading(true);
      const token = await AsyncStorage.getItem('userToken');

      await axios.post(`${API_ROUTE}/shorts/`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Snackbar.show({
        text: 'Short uploaded successfully!',
        backgroundColor: '#51A851',
      });

      setCaption('');
      setVideo(null);
      setSelectedHashtags([]);
      navigation.navigate('SocialHome', { newShort: true });
    } catch (error) {
      console.error('Upload error:', error);
      Snackbar.show({
        text: 'Upload failed. Please try again.',
        backgroundColor: '#FF6B6B',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    setVideo(null);
  };

  const scrollToInput = (yOffset) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const suggestions = getHashtagSuggestions();

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <StatusBar barStyle={Platform.OS === 'android'? 'light-content' : 'light-content'} backgroundColor="#000" />
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Create Short</Text>
            
            <TouchableOpacity 
              onPress={handleUpload} 
              disabled={isUploading || !video || !caption.trim() || selectedHashtags.length === 0}
              style={[
                styles.postButton,
                (!video || !caption.trim() || selectedHashtags.length === 0) && styles.postButtonDisabled
              ]}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Video Preview Section */}
            <View style={styles.previewSection}>
              {video ? (
                <View style={styles.videoContainer}>
                  <Video
                    ref={videoRef}
                    source={{ uri: video.uri }}
                    style={styles.videoPreview}
                    resizeMode="cover"
                    paused={isPaused}
                    repeat={true}
                    muted={true}
                  />
                  
                  <View style={styles.videoOverlay}>
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={togglePlayPause}
                    >
                      <Icon 
                        name={isPaused ? "play-arrow" : "pause"} 
                        size={32} 
                        color="#FFF" 
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.clearButton}
                      onPress={clearVideo}
                    >
                      <Icon name="close" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="videocam" size={64} color="#666" />
                  <Text style={styles.placeholderText}>
                    Select a video to get started
                  </Text>
                  <Text style={styles.placeholderSubtext}>
                    Maximum 60 seconds
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={selectVideoFromGallery} 
                style={styles.actionButton}
              >
                <View style={[styles.buttonIcon, { backgroundColor: '#6366F1' }]}>
                  <Icon name="photo-library" size={24} color="#FFF" />
                </View>
                <Text style={styles.actionButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={recordVideoFromCamera} 
                style={styles.actionButton}
              >
                <View style={[styles.buttonIcon, { backgroundColor: '#EF4444' }]}>
                  <Icon name="videocam" size={24} color="#FFF" />
                </View>
                <Text style={styles.actionButtonText}>Record Video</Text>
              </TouchableOpacity>
            </View>

            {/* Caption Section */}
            <View style={styles.captionSection}>
              <Text style={styles.sectionLabel}>Caption</Text>
              <TextInput
                placeholder="What's happening?"
                placeholderTextColor="#94A3B8"
                style={styles.captionInput}
                value={caption}
                onChangeText={setCaption}
                multiline={true}
                maxLength={150}
                textAlignVertical="top"
                onFocus={() => scrollToInput(200)}
              />
              <View style={styles.captionFooter}>
                <Text style={styles.charCount}>
                  {caption.length}/150
                </Text>
              </View>
            </View>

            {/* Hashtags/Categories Section */}
            <View style={styles.hashtagSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Categories (Hashtags)</Text>
                <Text style={styles.hashtagCount}>
                  {selectedHashtags.length}/5
                </Text>
              </View>

              {/* Selected Hashtags */}
              {selectedHashtags.length > 0 && (
                <View style={styles.selectedHashtagsContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedHashtags.map((tag, index) => (
                      <View key={index} style={styles.selectedHashtag}>
                        <Text style={styles.selectedHashtagText}>{tag}</Text>
                        <TouchableOpacity
                          onPress={() => removeHashtag(tag)}
                          style={styles.removeHashtag}
                        >
                          <Icon name="close" size={14} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Add Custom Hashtag */}
              <View style={styles.addHashtagContainer}>
                <TextInput
                  style={styles.hashtagInput}
                  placeholder="Add custom hashtag (e.g., #MyTag)"
                  placeholderTextColor="#94A3B8"
                  value={customHashtag}
                  onChangeText={(text) => {
                    setCustomHashtag(text);
                    setShowHashtagSuggestions(true);
                  }}
                  onFocus={() => setShowHashtagSuggestions(true)}
                />
                <TouchableOpacity
                  style={styles.addHashtagButton}
                  onPress={addCustomHashtag}
                >
                  <Icon name="add" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Hashtag Suggestions */}
              {showHashtagSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    horizontal
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionTag}
                        onPress={() => {
                          toggleHashtag(item);
                          setCustomHashtag('');
                          setShowHashtagSuggestions(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}

              {/* Popular Hashtags Grid */}
              <Text style={styles.popularHashtagsTitle}>Popular Hashtags</Text>
              <View style={styles.popularHashtagsGrid}>
                {POPULAR_HASHTAGS.slice(0, 12).map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.popularHashtag,
                      selectedHashtags.includes(tag) && styles.popularHashtagSelected
                    ]}
                    onPress={() => toggleHashtag(tag)}
                  >
                    <Text style={[
                      styles.popularHashtagText,
                      selectedHashtags.includes(tag) && styles.popularHashtagTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Icon name="info" size={18} color="#94A3B8" />
              <Text style={styles.infoText}>
                Add hashtags to help people discover your short. Maximum 5 hashtags allowed.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  postButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.6,
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  previewSection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    height: height * 0.35,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    padding: 16,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
  },
  captionSection: {
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  captionInput: {
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    padding: 12,
    color: '#E5E7EB',
    minHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  captionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  charCount: {
    color: '#94A3B8',
    fontSize: 14,
  },
  // Hashtag Styles
  hashtagSection: {
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hashtagCount: {
    color: '#94A3B8',
    fontSize: 14,
  },
  selectedHashtagsContainer: {
    marginBottom: 16,
  },
  selectedHashtag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedHashtagText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  removeHashtag: {
    padding: 2,
  },
  addHashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hashtagInput: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    padding: 12,
    color: '#E5E7EB',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginRight: 8,
  },
  addHashtagButton: {
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionTag: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  popularHashtagsTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  popularHashtagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularHashtag: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  popularHashtagSelected: {
    backgroundColor: '#6366F1',
  },
  popularHashtagText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  popularHashtagTextSelected: {
    color: '#FFF',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: '#E0F2FE',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default UploadShortScreen;