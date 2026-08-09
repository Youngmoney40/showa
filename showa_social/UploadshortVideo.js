

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
//   FlatList,
//   Modal,
//   ProgressBarAndroid,
//   ProgressViewIOS,
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

// const POPULAR_HASHTAGS = [
//   "#Music", "#Dance", "#Comedy", "#Fashion", "#Beauty", "#Fitness",
//   "#Food", "#Travel", "#Sports", "#Gaming", "#DIY", "#Education",
//   "#Technology", "#Business", "#Art", "#Photography", "#Nature", "#Pets",
//   "#Family", "#Lifestyle", "#Motivation", "#Tutorial", "#Review",
//   "#Unboxing", "#Challenge", "#Trending", "#Viral", "#Shorts",
//   "#Funny", "#Cooking"
// ];

// const UploadShortScreen = ({ navigation }) => {
//   const [video, setVideo] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [selectedHashtags, setSelectedHashtags] = useState([]);
//   const [customHashtag, setCustomHashtag] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showProgressModal, setShowProgressModal] = useState(false);
//   const [videoDuration, setVideoDuration] = useState(0);
  
//   const videoRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   const selectVideoFromGallery = () => {
//     const options = {
//       mediaType: 'video',
//       videoQuality: 'high',
//       durationLimit: 60,
//       includeBase64: false,
//     };
    
//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) return;
      
//       if (response.error) {
//         Snackbar.show({
//           text: 'Error selecting video: ' + response.error.message,
//           backgroundColor: '#FF6B6B',
//         });
//         return;
//       }
      
//       if (response.assets && response.assets.length > 0) {
//         const selectedVideo = response.assets[0];
//         // Check duration in seconds
//         if (selectedVideo.duration && selectedVideo.duration > 60) {
//           Snackbar.show({
//             text: 'Video must be 60 seconds or shorter',
//             backgroundColor: '#FF6B6B',
//           });
//           return;
//         }
//         setVideo(selectedVideo);
//         setVideoDuration(selectedVideo.duration || 0);
//       }
//     });
//   };

//   const recordVideoFromCamera = () => {
//     const options = {
//       mediaType: 'video',
//       videoQuality: 'high',
//       durationLimit: 60,
//       saveToPhotos: true,
//       includeBase64: false,
//     };
    
//     launchCamera(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//         return;
//       }
      
//       if (response.error) {
//         console.error('Camera Error:', response.error);
//         Snackbar.show({
//           text: 'Camera error: ' + response.error.message,
//           backgroundColor: '#FF6B6B',
//         });
//         return;
//       }
      
//       if (response.assets && response.assets.length > 0) {
//         const recordedVideo = response.assets[0];
//         console.log('Recorded video:', recordedVideo);
        
//         // Check if video was actually recorded
//         if (!recordedVideo.uri) {
//           Snackbar.show({
//             text: 'Failed to record video. Please try again.',
//             backgroundColor: '#FF6B6B',
//           });
//           return;
//         }
        
//         // Check duration
//         if (recordedVideo.duration && recordedVideo.duration > 60) {
//           Snackbar.show({
//             text: 'Video must be 60 seconds or shorter',
//             backgroundColor: '#FF6B6B',
//           });
//           return;
//         }
        
//         setVideo(recordedVideo);
//         setVideoDuration(recordedVideo.duration || 0);
        
//         Snackbar.show({
//           text: 'Video recorded successfully!',
//           backgroundColor: '#51A851',
//         });
//       } else {
//         Snackbar.show({
//           text: 'No video captured. Please try again.',
//           backgroundColor: '#FF6B6B',
//         });
//       }
//     });
//   };

//   const togglePlayPause = () => {
//     setIsPaused(!isPaused);
//   };

//   const toggleHashtag = (hashtag) => {
//     if (selectedHashtags.includes(hashtag)) {
//       setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
//     } else {
//       if (selectedHashtags.length < 5) {
//         setSelectedHashtags([...selectedHashtags, hashtag]);
//       } else {
//         Snackbar.show({
//           text: 'Maximum 5 hashtags allowed',
//           backgroundColor: '#FF6B6B',
//         });
//       }
//     }
//   };

//   const addCustomHashtag = () => {
//     const trimmed = customHashtag.trim();
//     if (!trimmed) return;

//     let formattedTag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
//     formattedTag = '#' + formattedTag.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
    
//     if (formattedTag.length < 2 || formattedTag === '#') {
//       Snackbar.show({
//         text: 'Hashtag must be at least 2 characters',
//         backgroundColor: '#FF6B6B',
//       });
//       return;
//     }

//     if (selectedHashtags.length >= 5) {
//       Snackbar.show({
//         text: 'Maximum 5 hashtags allowed',
//         backgroundColor: '#FF6B6B',
//       });
//       return;
//     }

//     if (!selectedHashtags.includes(formattedTag)) {
//       setSelectedHashtags([...selectedHashtags, formattedTag]);
//       setCustomHashtag('');
//       setShowHashtagSuggestions(false);
//     } else {
//       Snackbar.show({
//         text: 'Hashtag already added',
//         backgroundColor: '#FF6B6B',
//       });
//     }
//   };

//   const removeHashtag = (hashtag) => {
//     setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
//   };

//   const getHashtagSuggestions = () => {
//     if (!customHashtag.trim()) return [];
//     const searchTerm = customHashtag.toLowerCase().replace('#', '');
//     return POPULAR_HASHTAGS.filter(tag => 
//       tag.toLowerCase().includes(searchTerm) && !selectedHashtags.includes(tag)
//     ).slice(0, 5);
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

//     if (selectedHashtags.length === 0) {
//       Snackbar.show({
//         text: 'Please add at least one hashtag',
//         backgroundColor: '#FF6B6B',
//       });
//       return;
//     }

//     // Show progress modal
//     setShowProgressModal(true);
//     setUploadProgress(0);

//     const captionWithHashtags = `${caption}\n\n${selectedHashtags.join(' ')}`;

//     const formData = new FormData();
//     formData.append('caption', captionWithHashtags);
//     formData.append('video', {
//       uri: video.uri,
//       name: video.fileName || `short_${Date.now()}.mp4`,
//       type: video.type || 'video/mp4',
//     });

//     try {
//       setIsUploading(true);
//       const token = await AsyncStorage.getItem('userToken');

//       const response = await axios.post(`${API_ROUTE}/shorts/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(progress);
//         },
//       });

//       // Upload complete
//       setUploadProgress(100);
      
//       setTimeout(() => {
//         setShowProgressModal(false);
//         Snackbar.show({
//           text: 'Short uploaded successfully!',
//           backgroundColor: '#51A851',
//         });

//         setCaption('');
//         setVideo(null);
//         setSelectedHashtags([]);
//         setVideoDuration(0);
//         navigation.navigate('SocialHome', { newShort: true });
//       }, 500);

//     } catch (error) {
//       console.error('Upload error:', error);
//       setShowProgressModal(false);
//       Snackbar.show({
//         text: error.response?.data?.message || 'Upload failed. Please try again.',
//         backgroundColor: '#FF6B6B',
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const clearVideo = () => {
//     setVideo(null);
//     setVideoDuration(0);
//   };

//   const scrollToInput = (yOffset) => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
//     }
//   };

//   const suggestions = getHashtagSuggestions();

//   // Platform-specific progress component
//   const ProgressBar = Platform.OS === 'android' ? ProgressBarAndroid : ProgressViewIOS;

//   return (
//     <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <View style={styles.container}>
//           <StatusBar barStyle="light-content" backgroundColor="#000" />
          
//           {/* Header */}
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
//               disabled={isUploading || !video || !caption.trim() || selectedHashtags.length === 0}
//               style={[
//                 styles.postButton,
//                 (!video || !caption.trim() || selectedHashtags.length === 0) && styles.postButtonDisabled
//               ]}
//             >
//               {isUploading ? (
//                 <ActivityIndicator color="#FFF" size="small" />
//               ) : (
//                 <Text style={styles.postButtonText}>Post</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Upload Progress Modal */}
//           <Modal
//             visible={showProgressModal}
//             transparent={true}
//             animationType="fade"
//           >
//             <View style={styles.progressModalOverlay}>
//               <View style={styles.progressModalContent}>
//                 <Text style={styles.progressModalTitle}>Uploading Video</Text>
//                 <Text style={styles.progressModalSubtitle}>
//                   Please wait while your video is being uploaded
//                 </Text>
                
//                 <View style={styles.progressBarContainer}>
//                   {Platform.OS === 'android' ? (
//                     <ProgressBarAndroid
//                       styleAttr="Horizontal"
//                       indeterminate={false}
//                       progress={uploadProgress / 100}
//                       color="#6366F1"
//                       style={styles.progressBar}
//                     />
//                   ) : (
//                     <ProgressViewIOS
//                       progress={uploadProgress / 100}
//                       progressTintColor="#6366F1"
//                       trackTintColor="#2A2A2A"
//                       style={styles.progressBar}
//                     />
//                   )}
//                   <Text style={styles.progressPercentage}>{uploadProgress}%</Text>
//                 </View>
                
//                 <ActivityIndicator size="large" color="#6366F1" style={styles.progressSpinner} />
//               </View>
//             </View>
//           </Modal>

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
//                     onLoad={(data) => {
//                       setVideoDuration(data.duration);
//                     }}
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

//                     {/* Video duration badge */}
//                     {videoDuration > 0 && (
//                       <View style={styles.durationBadge}>
//                         <Icon name="timer" size={14} color="#FFF" />
//                         <Text style={styles.durationText}>
//                           {Math.round(videoDuration)}s
//                         </Text>
//                       </View>
//                     )}
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

//             {/* Action Buttons */}
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

//               {/* <TouchableOpacity 
//                 onPress={recordVideoFromCamera} 
//                 style={styles.actionButton}
//               >
//                 <View style={[styles.buttonIcon, { backgroundColor: '#EF4444' }]}>
//                   <Icon name="videocam" size={24} color="#FFF" />
//                 </View>
//                 <Text style={styles.actionButtonText}>Record Video</Text>
//               </TouchableOpacity> */}
//             </View>

//             {/* Caption Section */}
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

//             {/* Hashtags Section */}
//             <View style={styles.hashtagSection}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionLabel}>Categories (Hashtags)</Text>
//                 <Text style={styles.hashtagCount}>
//                   {selectedHashtags.length}/5
//                 </Text>
//               </View>

//               {/* Selected Hashtags */}
//               {selectedHashtags.length > 0 && (
//                 <View style={styles.selectedHashtagsContainer}>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {selectedHashtags.map((tag, index) => (
//                       <View key={index} style={styles.selectedHashtag}>
//                         <Text style={styles.selectedHashtagText}>{tag}</Text>
//                         <TouchableOpacity
//                           onPress={() => removeHashtag(tag)}
//                           style={styles.removeHashtag}
//                         >
//                           <Icon name="close" size={14} color="#FFF" />
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}

//               {/* Add Custom Hashtag */}
//               <View style={styles.addHashtagContainer}>
//                 <TextInput
//                   style={styles.hashtagInput}
//                   placeholder="Add custom hashtag (e.g., #MyTag)"
//                   placeholderTextColor="#94A3B8"
//                   value={customHashtag}
//                   onChangeText={(text) => {
//                     setCustomHashtag(text);
//                     setShowHashtagSuggestions(true);
//                   }}
//                   onFocus={() => setShowHashtagSuggestions(true)}
//                 />
//                 <TouchableOpacity
//                   style={styles.addHashtagButton}
//                   onPress={addCustomHashtag}
//                 >
//                   <Icon name="add" size={24} color="#FFF" />
//                 </TouchableOpacity>
//               </View>

//               {/* Hashtag Suggestions */}
//               {showHashtagSuggestions && suggestions.length > 0 && (
//                 <View style={styles.suggestionsContainer}>
//                   <FlatList
//                     horizontal
//                     data={suggestions}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity
//                         style={styles.suggestionTag}
//                         onPress={() => {
//                           toggleHashtag(item);
//                           setCustomHashtag('');
//                           setShowHashtagSuggestions(false);
//                         }}
//                       >
//                         <Text style={styles.suggestionText}>{item}</Text>
//                       </TouchableOpacity>
//                     )}
//                     showsHorizontalScrollIndicator={false}
//                   />
//                 </View>
//               )}

//               {/* Popular Hashtags */}
//               <Text style={styles.popularHashtagsTitle}>Popular Hashtags</Text>
//               <View style={styles.popularHashtagsGrid}>
//                 {POPULAR_HASHTAGS.slice(0, 12).map((tag, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.popularHashtag,
//                       selectedHashtags.includes(tag) && styles.popularHashtagSelected
//                     ]}
//                     onPress={() => toggleHashtag(tag)}
//                   >
//                     <Text style={[
//                       styles.popularHashtagText,
//                       selectedHashtags.includes(tag) && styles.popularHashtagTextSelected
//                     ]}>
//                       {tag}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Info Section */}
//             <View style={styles.infoSection}>
//               <Icon name="info" size={18} color="#94A3B8" />
//               <Text style={styles.infoText}>
//                 Add hashtags to help people discover your short. Maximum 5 hashtags allowed.
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
//   durationBadge: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   durationText: {
//     color: '#FFF',
//     fontSize: 12,
//     marginLeft: 4,
//     fontWeight: '500',
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
//   hashtagSection: {
//     marginBottom: 24,
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   hashtagCount: {
//     color: '#94A3B8',
//     fontSize: 14,
//   },
//   selectedHashtagsContainer: {
//     marginBottom: 16,
//   },
//   selectedHashtag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#6366F1',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   selectedHashtagText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//     marginRight: 4,
//   },
//   removeHashtag: {
//     padding: 2,
//   },
//   addHashtagContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   hashtagInput: {
//     flex: 1,
//     backgroundColor: '#0F0F0F',
//     borderRadius: 8,
//     padding: 12,
//     color: '#E5E7EB',
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//     marginRight: 8,
//   },
//   addHashtagButton: {
//     backgroundColor: '#6366F1',
//     padding: 12,
//     borderRadius: 8,
//   },
//   suggestionsContainer: {
//     marginBottom: 16,
//   },
//   suggestionTag: {
//     backgroundColor: '#2A2A2A',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   suggestionText: {
//     color: '#E5E7EB',
//     fontSize: 14,
//   },
//   popularHashtagsTitle: {
//     color: '#E5E7EB',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   popularHashtagsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   popularHashtag: {
//     backgroundColor: '#2A2A2A',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   popularHashtagSelected: {
//     backgroundColor: '#6366F1',
//   },
//   popularHashtagText: {
//     color: '#E5E7EB',
//     fontSize: 14,
//   },
//   popularHashtagTextSelected: {
//     color: '#FFF',
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
//   // Progress Modal Styles
//   progressModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressModalContent: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 20,
//     padding: 30,
//     width: '85%',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   progressModalTitle: {
//     color: '#FFF',
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   progressModalSubtitle: {
//     color: '#94A3B8',
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   progressBarContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   progressBar: {
//     width: '100%',
//     height: 8,
//     borderRadius: 4,
//   },
//   progressPercentage: {
//     color: '#94A3B8',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   progressSpinner: {
//     marginTop: 8,
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
  Modal,
  ProgressBarAndroid,
  ProgressViewIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Video from 'react-native-video';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

const MAX_VIDEO_DURATION = 90; // 1.5 minutes in seconds
const MAX_VIDEO_SIZE_MB = 50; // Maximum file size in MB before compression
const COMPRESSED_VIDEO_BITRATE = 2000000; // 2 Mbps (adjust as needed)
const COMPRESSED_VIDEO_WIDTH = 720; // Target width for compression
const COMPRESSED_VIDEO_HEIGHT = 1280; // Target height for compression

const POPULAR_HASHTAGS = [
  "#Music", "#Dance", "#Comedy", "#Fashion", "#Beauty", "#Fitness",
  "#Food", "#Travel", "#Sports", "#Gaming", "#DIY", "#Education",
  "#Technology", "#Business", "#Art", "#Photography", "#Nature", "#Pets",
  "#Family", "#Lifestyle", "#Motivation", "#Tutorial", "#Review",
  "#Unboxing", "#Challenge", "#Trending", "#Viral", "#Shorts",
  "#Funny", "#Cooking"
];

const UploadShortScreen = ({ navigation }) => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [customHashtag, setCustomHashtag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState(null);
  
  const videoRef = useRef(null);
  const scrollViewRef = useRef(null);


  const compressVideoWithImagePicker = async (videoAsset) => {
    
    return new Promise((resolve, reject) => {
      const options = {
        mediaType: 'video',
        videoQuality: 'low', // 'low', 'medium', 'high'
        durationLimit: MAX_VIDEO_DURATION,
        includeBase64: false,
        // Android specific: compression options
        ...(Platform.OS === 'android' && {
          videoQuality: 'low', // Compress more on Android
        }),
        // iOS specific: compression options
        ...(Platform.OS === 'ios' && {
          videoQuality: 'low', // Compress more on iOS
        })
      };
      
  
      launchImageLibrary({
        ...options,
        selectionLimit: 1,
        includeBase64: false,
      }, (response) => {
        if (response.didCancel) {
          reject(new Error('Compression cancelled'));
          return;
        }
        if (response.error) {
          reject(new Error(response.error.message));
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const compressedAsset = response.assets[0];
          // Check if compression reduced the size
          const originalSize = videoAsset.fileSize || 0;
          const compressedSize = compressedAsset.fileSize || 0;
          console.log(`Original size: ${originalSize} bytes, Compressed size: ${compressedSize} bytes`);
          
          if (compressedSize < originalSize || compressedSize < MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            resolve(compressedAsset);
          } else {
            
            resolve(videoAsset);
          }
        } else {
          reject(new Error('No video selected for compression'));
        }
      });
    });
  };

  
  const needsCompression = (videoAsset) => {
    const fileSize = videoAsset.fileSize || 0;
    const sizeInMB = fileSize / (1024 * 1024);
    console.log(`Video size: ${sizeInMB.toFixed(2)} MB`);
    
    // Compress if file is larger than 50MB or if it's a high resolution video
    return sizeInMB > MAX_VIDEO_SIZE_MB;
  };

  
  const compressVideo = async (videoAsset) => {
    try {
      setIsCompressing(true);
      setUploadProgress(0);
      setShowProgressModal(true);
      
      // Get file info
      const fileSize = videoAsset.fileSize || 0;
      const sizeInMB = fileSize / (1024 * 1024);
      
      console.log(`📹 Original video: ${sizeInMB.toFixed(2)} MB`);
      
      // If video is small enough, skip compression
      if (sizeInMB <= MAX_VIDEO_SIZE_MB) {
        console.log('Video size is acceptable, skipping compression');
        setIsCompressing(false);
        setShowProgressModal(false);
        return videoAsset;
      }
    
      let compressed = null;
      
      if (Platform.OS === 'ios') {
       
        compressed = await compressVideoWithImagePicker(videoAsset);
      } else {
        // Android: Use MediaCodec compression
        compressed = await compressVideoWithImagePicker(videoAsset);
      }
      
      // If compression failed, use original
      if (!compressed) {
        console.log('⚠️ Compression failed, using original video');
        setIsCompressing(false);
        setShowProgressModal(false);
        return videoAsset;
      }
      
      // Check compressed file size
      const compressedSize = compressed.fileSize || 0;
      const compressedSizeMB = compressedSize / (1024 * 1024);
      console.log(`📹 Compressed video: ${compressedSizeMB.toFixed(2)} MB`);
      
      // If compressed file is actually larger, use original
      if (compressedSize > fileSize) {
        console.log('⚠️ Compressed file is larger, using original');
        setIsCompressing(false);
        setShowProgressModal(false);
        return videoAsset;
      }
      
      setCompressedVideo(compressed);
      setIsCompressing(false);
      setShowProgressModal(false);
      
      return compressed;
      
    } catch (error) {
      console.error('Compression error:', error);
      setIsCompressing(false);
      setShowProgressModal(false);
      
      // Fall back to original video if compression fails
      return videoAsset;
    }
  };

  
  const selectVideoFromGallery = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: MAX_VIDEO_DURATION,
      includeBase64: false,
    };
    
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      
      if (response.error) {
        Snackbar.show({
          text: 'Error selecting video: ' + response.error.message,
          backgroundColor: '#FF6B6B',
        });
        return;
      }
      
      if (response.assets && response.assets.length > 0) {
        const selectedVideo = response.assets[0];
        
        if (selectedVideo.duration && selectedVideo.duration > MAX_VIDEO_DURATION) {
          Snackbar.show({
            text: `Video must be ${MAX_VIDEO_DURATION} seconds or shorter (${Math.round(MAX_VIDEO_DURATION/60)} minutes)`,
            backgroundColor: '#FF6B6B',
          });
          return;
        }
        
        // Check if compression is needed
        if (needsCompression(selectedVideo)) {
          // Show compression status
          setShowProgressModal(true);
          setUploadProgress(0);
          
          // Compress the video
          const compressed = await compressVideo(selectedVideo);
          
          if (compressed) {
            setVideo(compressed);
            setVideoDuration(compressed.duration || 0);
            setShowProgressModal(false);
            
            // Show compression success message
            const originalSizeMB = (selectedVideo.fileSize || 0) / (1024 * 1024);
            const compressedSizeMB = (compressed.fileSize || 0) / (1024 * 1024);
            const reduction = ((1 - (compressedSizeMB / originalSizeMB)) * 100).toFixed(0);
            
            Snackbar.show({
              text: `Video compressed! Size reduced by ${reduction}%`,
              backgroundColor: '#6366F1',
            });
          } else {
            // If compression failed, use original
            setVideo(selectedVideo);
            setVideoDuration(selectedVideo.duration || 0);
            setShowProgressModal(false);
            
            Snackbar.show({
              text: 'Using original video (compression failed)',
              backgroundColor: '#FF6B6B',
            });
          }
        } else {
          // No compression needed
          setVideo(selectedVideo);
          setVideoDuration(selectedVideo.duration || 0);
        }
      }
    });
  };


  const recordVideoFromCamera = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: MAX_VIDEO_DURATION,
      saveToPhotos: true,
      includeBase64: false,
    };
    
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }
      
      if (response.error) {
        console.error('Camera Error:', response.error);
        Snackbar.show({
          text: 'Camera error: ' + response.error.message,
          backgroundColor: '#FF6B6B',
        });
        return;
      }
      
      if (response.assets && response.assets.length > 0) {
        const recordedVideo = response.assets[0];
        console.log('Recorded video:', recordedVideo);
        
        if (!recordedVideo.uri) {
          Snackbar.show({
            text: 'Failed to record video. Please try again.',
            backgroundColor: '#FF6B6B',
          });
          return;
        }
        
        if (recordedVideo.duration && recordedVideo.duration > MAX_VIDEO_DURATION) {
          Snackbar.show({
            text: `Video must be ${MAX_VIDEO_DURATION} seconds or shorter (${Math.round(MAX_VIDEO_DURATION/60)} minutes)`,
            backgroundColor: '#FF6B6B',
          });
          return;
        }
        
        // Check if compression is needed
        if (needsCompression(recordedVideo)) {
          setShowProgressModal(true);
          setUploadProgress(0);
          
          const compressed = await compressVideo(recordedVideo);
          
          if (compressed) {
            setVideo(compressed);
            setVideoDuration(compressed.duration || 0);
            setShowProgressModal(false);
            
            const originalSizeMB = (recordedVideo.fileSize || 0) / (1024 * 1024);
            const compressedSizeMB = (compressed.fileSize || 0) / (1024 * 1024);
            const reduction = ((1 - (compressedSizeMB / originalSizeMB)) * 100).toFixed(0);
            
            Snackbar.show({
              text: `Video compressed! Size reduced by ${reduction}%`,
              backgroundColor: '#6366F1',
            });
          } else {
            setVideo(recordedVideo);
            setVideoDuration(recordedVideo.duration || 0);
            setShowProgressModal(false);
          }
        } else {
          setVideo(recordedVideo);
          setVideoDuration(recordedVideo.duration || 0);
        }
        
        Snackbar.show({
          text: 'Video recorded successfully!',
          backgroundColor: '#51A851',
        });
      } else {
        Snackbar.show({
          text: 'No video captured. Please try again.',
          backgroundColor: '#FF6B6B',
        });
      }
    });
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };

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

  const addCustomHashtag = () => {
    const trimmed = customHashtag.trim();
    if (!trimmed) return;

    let formattedTag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
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

  const removeHashtag = (hashtag) => {
    setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
  };

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

    setShowProgressModal(true);
    setUploadProgress(0);

    const captionWithHashtags = `${caption}\n\n${selectedHashtags.join(' ')}`;

    const formData = new FormData();
    formData.append('caption', captionWithHashtags);
    
    // Use the video (could be original or compressed)
    const videoToUpload = compressedVideo || video;
    
    // Log file size for debugging
    const fileSizeMB = (videoToUpload.fileSize || 0) / (1024 * 1024);
    console.log(`📤 Uploading video: ${fileSizeMB.toFixed(2)} MB`);
    
    formData.append('video', {
      uri: videoToUpload.uri,
      name: videoToUpload.fileName || `short_${Date.now()}.mp4`,
      type: videoToUpload.type || 'video/mp4',
    });

    try {
      setIsUploading(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(`${API_ROUTE}/shorts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploadProgress(100);
      
      setTimeout(() => {
        setShowProgressModal(false);
        Snackbar.show({
          text: 'Short uploaded successfully!',
          backgroundColor: '#51A851',
        });

        setCaption('');
        setVideo(null);
        setCompressedVideo(null);
        setSelectedHashtags([]);
        setVideoDuration(0);
        navigation.navigate('SocialHome', { newShort: true });
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setShowProgressModal(false);
      Snackbar.show({
        text: error.response?.data?.message || 'Upload failed. Please try again.',
        backgroundColor: '#FF6B6B',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    setVideo(null);
    setCompressedVideo(null);
    setVideoDuration(0);
  };

  const scrollToInput = (yOffset) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const suggestions = getHashtagSuggestions();
  const ProgressBar = Platform.OS === 'android' ? ProgressBarAndroid : ProgressViewIOS;

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          
          
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

          {/* Progress Modal - Updated for compression */}
          <Modal
            visible={showProgressModal}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.progressModalOverlay}>
              <View style={styles.progressModalContent}>
                <Text style={styles.progressModalTitle}>
                  {isCompressing ? 'Compressing Video' : 'Uploading Video'}
                </Text>
                <Text style={styles.progressModalSubtitle}>
                  {isCompressing 
                    ? 'Optimizing video for faster upload...' 
                    : 'Please wait while your video is being uploaded'}
                </Text>
                
                {/* <View style={styles.progressBarContainer}>
                  {Platform.OS === 'android' ? (
                    <ProgressBarAndroid
                      styleAttr="Horizontal"
                      indeterminate={false}
                      progress={uploadProgress / 100}
                      color="#6366F1"
                      style={styles.progressBar}
                    />
                  ) : (
                    <ProgressViewIOS
                      progress={uploadProgress / 100}
                      progressTintColor="#6366F1"
                      trackTintColor="#2A2A2A"
                      style={styles.progressBar}
                    />
                  )}
                  <Text style={styles.progressPercentage}>{uploadProgress}%</Text>
                </View> */}
                
                <ActivityIndicator size="large" color="#6366F1" style={styles.progressSpinner} />
              </View>
            </View>
          </Modal>

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
                    onLoad={(data) => {
                      setVideoDuration(data.duration);
                    }}
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

                    {/* Video duration badge */}
                    {videoDuration > 0 && (
                      <View style={styles.durationBadge}>
                        <Icon name="timer" size={14} color="#FFF" />
                        <Text style={styles.durationText}>
                          {formatDuration(videoDuration)}
                        </Text>
                      </View>
                    )}
                    
                    {/* Show compression status badge */}
                    {compressedVideo && (
                      <View style={[styles.durationBadge, { left: 12, right: 'auto' }]}>
                        <Icon name="compress" size={14} color="#FFF" />
                        <Text style={styles.durationText}>Compressed</Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="videocam" size={64} color="#666" />
                  <Text style={styles.placeholderText}>
                    Select a video to get started
                  </Text>
                  <Text style={styles.placeholderSubtext}>
                    Maximum {Math.round(MAX_VIDEO_DURATION/60)} minutes ({MAX_VIDEO_DURATION} seconds)
                  </Text>
                  <Text style={styles.placeholderSubtext}>
                    Videos over {MAX_VIDEO_SIZE_MB}MB will be compressed
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

              {/* Uncomment to enable camera recording */}
              {/* <TouchableOpacity 
                onPress={recordVideoFromCamera} 
                style={styles.actionButton}
              >
                <View style={[styles.buttonIcon, { backgroundColor: '#EF4444' }]}>
                  <Icon name="videocam" size={24} color="#FFF" />
                </View>
                <Text style={styles.actionButtonText}>Record Video</Text>
              </TouchableOpacity> */}
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

            {/* Hashtags Section */}
            <View style={styles.hashtagSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Categories (Hashtags)</Text>
                <Text style={styles.hashtagCount}>
                  {selectedHashtags.length}/5
                </Text>
              </View>

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
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
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
  progressModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  progressModalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressModalSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  progressSpinner: {
    marginTop: 8,
  },
});

export default UploadShortScreen;