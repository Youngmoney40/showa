// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   Switch,
//   useColorScheme
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Feather';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { launchImageLibrary } from 'react-native-image-picker';
// import LottieView from 'lottie-react-native';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const AD_OBJECTIVES = [
//   { id: 'AWARENESS', icon: 'eye', label: 'Awareness', desc: 'Increase visibility' },
//   { id: 'ENGAGEMENT', icon: 'message-circle', label: 'Engagement', desc: 'Get interactions' },
//   { id: 'FOLLOWERS', icon: 'users', label: 'Followers', desc: 'Grow audience' },
//   { id: 'WEBSITE', icon: 'mouse-pointer', label: 'Website', desc: 'Drive traffic' },
//   { id: 'SALES', icon: 'shopping-bag', label: 'Sales', desc: 'Boost purchases' },
//   { id: 'LEADS', icon: 'download', label: 'Leads', desc: 'Collect info' },
// ];

// const CTA_OPTIONS = [
//   { value: 'FOLLOW', label: 'Follow Us', icon: 'users' },
//   { value: 'VISIT', label: 'Visit Site', icon: 'globe' },
//   { value: 'SHOP_NOW', label: 'Shop Now', icon: 'shopping-bag' },
//   { value: 'LEARN_MORE', label: 'Learn More', icon: 'info' },
//   { value: 'SIGN_UP', label: 'Sign Up', icon: 'download' },
//   { value: 'CONTACT', label: 'Contact', icon: 'message-circle' },
// ];

// const AUDIENCE_INTERESTS = [
//   'Tech', 'Fashion', 'Fitness', 'Food', 'Travel',
//   'Music', 'Gaming', 'Business', 'Education', 'Sports'
// ];

// const NIGERIA_STATES = [
//   'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
//   'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
//   'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
//   'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
//   'FCT (Abuja)'
// ].sort();

// const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
// const BUDGET_PRESETS = [500, 1000, 5000, 10000];

// export default function CreateAdForm({ onClose, onAdCreated }) {
//   const navigation = useNavigation();
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [userData, setUserData] = useState({
//     name: '',
//     username: '',
//     profileImage: ''
//   });

//   const [adContent, setAdContent] = useState({
//     headline: '',
//     description: '',
//     image: null,
//     imagePreview: '',
//     video: null,
//     videoPreview: '',
//     mediaType: 'IMAGE',
//     link: '',
//     hashtags: [],
//     customHashtag: ''
//   });

//   const [adSettings, setAdSettings] = useState({
//     objective: 'AWARENESS',
//     cta: '',
//     budget: '1000',
//     duration: 7,
//     scheduleType: 'immediate',
//     scheduledDate: new Date(),
//     scheduledTime: new Date(),
//     scheduledDateString: '',
//     scheduledTimeString: ''
//   });

//   const [targeting, setTargeting] = useState({
//     location: '',
//     locations: [],
//     ageRanges: [],
//     gender: 'all',
//     interests: [],
//     customInterest: '',
//     showLocationDropdown: false,
//     locationSearch: ''
//   });

//   const [advanced, setAdvanced] = useState({
//     rewardEnabled: false,
//     rewardAmount: '',
//     maxBid: '',
//     optimizationGoal: 'engagement',
//     excludeLocations: [],
//     deviceTargeting: 'all',
//     frequencyCap: 3
//   });

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const storedUserString = await AsyncStorage.getItem('userData');
//       const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      
//       if (!token || !storedUser?.id) return;

//       const res = await axios.get(`${API_ROUTE}/user/${storedUser.id}/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setUserData({
//         name: res.data.name,
//         username: res.data.username,
//         profileImage: `${API_ROUTE_IMAGE}${res.data.profile_picture}`
//       });
//     } catch {
//       setError('Failed to load user profile');
//     }
//   };

//   const handleMediaSelect = (type) => {
//     const options = {
//       mediaType: type === 'image' ? 'photo' : 'video',
//       quality: 1,
//       videoQuality: 'high',
//       durationLimit: 60,
//       includeBase64: false,
//       maxWidth: 1200,
//       maxHeight: 1200,
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         Alert.alert('Error', 'Failed to select media: ' + response.error);
//       } else if (response.assets && response.assets[0]) {
//         const asset = response.assets[0];
        
//         if (type === 'image') {
//           setAdContent({
//             ...adContent,
//             image: {
//               uri: asset.uri,
//               type: asset.type,
//               name: asset.fileName || 'image.jpg',
//               size: asset.fileSize
//             },
//             imagePreview: asset.uri,
//             mediaType: 'IMAGE',
//             video: null,
//             videoPreview: ''
//           });
//         } else {
//           setAdContent({
//             ...adContent,
//             video: {
//               uri: asset.uri,
//               type: asset.type,
//               name: asset.fileName || 'video.mp4',
//               size: asset.fileSize
//             },
//             videoPreview: asset.uri,
//             mediaType: 'VIDEO',
//             image: null,
//             imagePreview: ''
//           });
//         }
//       }
//     });
//   };

//   const addHashtag = () => {
//     if (adContent.customHashtag.trim() && !adContent.hashtags.includes(adContent.customHashtag)) {
//       setAdContent({
//         ...adContent,
//         hashtags: [...adContent.hashtags, adContent.customHashtag],
//         customHashtag: ''
//       });
//     }
//   };

//   const removeHashtag = (tag) => {
//     setAdContent({
//       ...adContent,
//       hashtags: adContent.hashtags.filter(t => t !== tag)
//     });
//   };

//   const addInterest = () => {
//     if (targeting.customInterest.trim() && !targeting.interests.includes(targeting.customInterest)) {
//       setTargeting({
//         ...targeting,
//         interests: [...targeting.interests, targeting.customInterest],
//         customInterest: ''
//       });
//     }
//   };

//   const removeInterest = (interest) => {
//     setTargeting({
//       ...targeting,
//       interests: targeting.interests.filter(i => i !== interest)
//     });
//   };

//   const nextStep = () => {
//     if (currentStep < 5) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const onDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setAdSettings({
//         ...adSettings,
//         scheduledDate: selectedDate,
//         scheduledDateString: selectedDate.toISOString().split('T')[0]
//       });
//     }
//   };

//   const onTimeChange = (event, selectedTime) => {
//     setShowTimePicker(false);
//     if (selectedTime) {
//       setAdSettings({
//         ...adSettings,
//         scheduledTime: selectedTime,
//         scheduledTimeString: selectedTime.toTimeString().split(' ')[0].substring(0, 5)
//       });
//     }
//   };

//   const toggleLocation = (state) => {
//     setTargeting(prev => {
//       const newLocations = prev.locations.includes(state)
//         ? prev.locations.filter(l => l !== state)
//         : [...prev.locations, state];
      
//       return {
//         ...prev,
//         locations: newLocations,
//         location: newLocations.length > 0 ? newLocations.join(', ') : ''
//       };
//     });
//   };

//   const selectAllLocations = () => {
//     setTargeting(prev => ({
//       ...prev,
//       locations: NIGERIA_STATES,
//       location: 'All Nigeria',
//       showLocationDropdown: false
//     }));
//   };

//   const clearLocations = () => {
//     setTargeting(prev => ({
//       ...prev,
//       locations: [],
//       location: '',
//       showLocationDropdown: false
//     }));
//   };

//   const filteredStates = NIGERIA_STATES.filter(state =>
//     state.toLowerCase().includes(targeting.locationSearch.toLowerCase())
//   );

//   const toggleAgeRange = (range) => {
//     setTargeting(prev => ({
//       ...prev,
//       ageRanges: prev.ageRanges.includes(range)
//         ? prev.ageRanges.filter(r => r !== range)
//         : [...prev.ageRanges, range]
//     }));
//   };

//   const handleCreateAd = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) throw new Error('Authentication required');

//       const formData = new FormData();

//       formData.append('headline', adContent.headline);
//       formData.append('description', adContent.description);
//       formData.append('link', adContent.link || '');
//       formData.append('hashtags', JSON.stringify(adContent.hashtags));
//       formData.append('media_type', adContent.mediaType);

//       if (adContent.mediaType === 'IMAGE' && adContent.image) {
//         formData.append('image', {
//           uri: adContent.image.uri,
//           type: adContent.image.type,
//           name: adContent.image.name
//         });
//       } else if (adContent.mediaType === 'VIDEO' && adContent.video) {
//         formData.append('video', {
//           uri: adContent.video.uri,
//           type: adContent.video.type,
//           name: adContent.video.name
//         });
//       }

//       formData.append('objective', adSettings.objective);
//       formData.append('cta', adSettings.cta || '');

//       const budgetValue = parseFloat(adSettings.budget);
//       if (isNaN(budgetValue) || budgetValue < 100) {
//         throw new Error('Budget must be at least ₦100');
//       }
//       formData.append('budget', budgetValue.toString());
//       formData.append('duration_days', adSettings.duration.toString());
//       formData.append('schedule_type', adSettings.scheduleType);

//       if (adSettings.scheduleType === 'scheduled') {
//         if (adSettings.scheduledDateString && adSettings.scheduledTimeString) {
//           const scheduledDateTime = `${adSettings.scheduledDateString}T${adSettings.scheduledTimeString}`;
//           formData.append('scheduled_start', scheduledDateTime);
//         }
//       }

//       formData.append('targeting', JSON.stringify({
//         locations: targeting.locations,
//         ageRanges: targeting.ageRanges,
//         gender: targeting.gender,
//         interests: targeting.interests
//       }));

//       formData.append('advanced', JSON.stringify({
//         reward_enabled: advanced.rewardEnabled,
//         reward_amount: advanced.rewardAmount || '0',
//         max_bid: advanced.maxBid || '',
//         optimization_goal: advanced.optimizationGoal,
//         frequency_cap: advanced.frequencyCap
//       }));

//       const response = await axios.post(`${API_ROUTE}/ads/create/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setShowSuccess(true);

//       setTimeout(() => {
//         setShowSuccess(false);
//         if (onAdCreated) onAdCreated(response.data);
//         navigation.goBack();
//       }, 3000);

//     } catch (err) {
//       console.error('Error creating ad:', err);
      
//       if (err.response?.data?.errors) {
//         const validationErrors = err.response.data.errors;
//         let errorMessage = 'Validation errors:\n';

//         Object.keys(validationErrors).forEach(key => {
//           const errorValue = validationErrors[key];
//           if (Array.isArray(errorValue)) {
//             errorMessage += `${key}: ${errorValue.join(', ')}\n`;
//           } else if (typeof errorValue === 'object') {
//             const nestedMessages = [];
//             Object.values(errorValue).forEach(nestedError => {
//               if (Array.isArray(nestedError)) {
//                 nestedMessages.push(nestedError.join(', '));
//               } else if (typeof nestedError === 'string') {
//                 nestedMessages.push(nestedError);
//               }
//             });
//             errorMessage += `${key}: ${nestedMessages.join(', ')}\n`;
//           } else if (typeof errorValue === 'string') {
//             errorMessage += `${key}: ${errorValue}\n`;
//           }
//         });

//         setError(errorMessage);
//       } else {
//         setError(err.response?.data?.detail || err.message || 'Failed to create ad');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const estimatedReach = adSettings.budget ? Math.round(parseInt(adSettings.budget) * 50) : 0;
//   const estimatedClicks = adSettings.budget ? Math.round(parseInt(adSettings.budget) * 5) : 0;
//   const totalCost = adSettings.budget ? parseInt(adSettings.budget) * adSettings.duration : 0;

//   const SuccessModal = () => (
//     <Modal visible={showSuccess} transparent animationType="fade">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>🎉 Ad Created Successfully!</Text>
//           <Text style={styles.modalText}>
//             Your advertisement has been submitted for review. It will go live once approved by our team.
//           </Text>
//           <View style={styles.modalInfoContainer}>
//             <View style={styles.modalInfoRow}>
//               <Icon name="clock" size={16} color="#6b7280" />
//               <Text style={styles.modalInfoText}>Review process usually takes 24-48 hours</Text>
//             </View>
//             <View style={styles.modalInfoRow}>
//               <Icon name="eye" size={16} color="#6b7280" />
//               <Text style={styles.modalInfoText}>Estimated reach: {estimatedReach.toLocaleString()} people</Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             style={styles.modalButton}
//             onPress={() => {
//               setShowSuccess(false);
//               navigation.goBack();
//             }}
//           >
//             <Text style={styles.modalButtonText}>Got it!</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   const StepIndicator = () => (
//     <View style={styles.stepIndicatorContainer}>
//       {[1, 2, 3, 4, 5].map((step) => (
//         <View
//           key={step}
//           style={[
//             styles.stepDot,
//             step <= currentStep && styles.stepDotActive,
//             step === currentStep && styles.stepDotCurrent
//           ]}
//         />
//       ))}
//     </View>
//   );

//   const renderAdContentStep = () => (
//     <View style={styles.stepContainer}>
//       <Text style={styles.stepTitle}>
//         <Icon name="zap" size={24} color="#3b82f6" /> Create Your Ad Content
//       </Text>

//       <View style={styles.mediaTypeContainer}>
//         <TouchableOpacity
//           style={[
//             styles.mediaTypeButton,
//             adContent.mediaType === 'IMAGE' && styles.mediaTypeButtonActive
//           ]}
//           onPress={() => setAdContent({
//             ...adContent,
//             mediaType: 'IMAGE',
//             video: null,
//             videoPreview: ''
//           })}
//         >
//           <Icon
//             name="image"
//             size={24}
//             color={adContent.mediaType === 'IMAGE' ? '#3b82f6' : '#9ca3af'}
//           />
//           <Text style={[
//             styles.mediaTypeLabel,
//             adContent.mediaType === 'IMAGE' && styles.mediaTypeLabelActive
//           ]}>Image Ad</Text>
//           <Text style={styles.mediaTypeDesc}>Single image</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.mediaTypeButton,
//             adContent.mediaType === 'VIDEO' && styles.mediaTypeButtonActive
//           ]}
//           onPress={() => setAdContent({
//             ...adContent,
//             mediaType: 'VIDEO',
//             image: null,
//             imagePreview: ''
//           })}
//         >
//           <Icon
//             name="video"
//             size={24}
//             color={adContent.mediaType === 'VIDEO' ? '#3b82f6' : '#9ca3af'}
//           />
//           <Text style={[
//             styles.mediaTypeLabel,
//             adContent.mediaType === 'VIDEO' && styles.mediaTypeLabelActive
//           ]}>Video Ad</Text>
//           <Text style={styles.mediaTypeDesc}>Up to 60s</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.uploadContainer}>
//         {adContent.mediaType === 'IMAGE' && adContent.imagePreview ? (
//           <View style={styles.previewContainer}>
//             <Image source={{ uri: adContent.imagePreview }} style={styles.previewImage} />
//             <TouchableOpacity
//               style={styles.removeButton}
//               onPress={() => setAdContent({ ...adContent, image: null, imagePreview: '' })}
//             >
//               <Icon name="x" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         ) : adContent.mediaType === 'VIDEO' && adContent.videoPreview ? (
//           <View style={styles.previewContainer}>
//             <View style={styles.videoPreviewContainer}>
//               <Icon name="video" size={48} color="#3b82f6" />
//               <Text style={styles.videoPreviewText}>Video selected</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.removeButton}
//               onPress={() => setAdContent({ ...adContent, video: null, videoPreview: '' })}
//             >
//               <Icon name="x" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity 
//             style={styles.uploadPlaceholder}
//             onPress={() => handleMediaSelect(adContent.mediaType.toLowerCase())}
//           >
//             <Icon name={adContent.mediaType === 'IMAGE' ? 'image' : 'video'} size={48} color="#9ca3af" />
//             <Text style={styles.uploadTitle}>
//               Upload {adContent.mediaType === 'IMAGE' ? 'Image' : 'Video'}
//             </Text>
//             <Text style={styles.uploadSubtitle}>
//               {adContent.mediaType === 'IMAGE' ? 'JPG, PNG up to 10MB' : 'MP4 up to 100MB'}
//             </Text>
//             <View style={styles.uploadButton}>
//               <Text style={styles.uploadButtonText}>Choose File</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Headline *</Text>
//         <TextInput
//           style={styles.input}
//           value={adContent.headline}
//           onChangeText={(text) => setAdContent({ ...adContent, headline: text })}
//           placeholder="Catchy headline for your ad"
//           placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//           maxLength={60}
//         />
//         <Text style={styles.charCount}>{adContent.headline.length}/60</Text>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Description *</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           value={adContent.description}
//           onChangeText={(text) => setAdContent({ ...adContent, description: text })}
//           placeholder="Describe your offer..."
//           placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//           multiline
//           numberOfLines={4}
//           maxLength={220}
//         />
//         <Text style={styles.charCount}>{adContent.description.length}/220</Text>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Destination Link</Text>
//         <TextInput
//           style={styles.input}
//           value={adContent.link}
//           onChangeText={(text) => setAdContent({ ...adContent, link: text })}
//           placeholder="https://your-website.com"
//           placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//           keyboardType="url"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Hashtags</Text>
//         <View style={styles.row}>
//           <TextInput
//             style={[styles.input, styles.flex1]}
//             value={adContent.customHashtag}
//             onChangeText={(text) => setAdContent({ ...adContent, customHashtag: text })}
//             placeholder="Add custom hashtag"
//             placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//             onSubmitEditing={addHashtag}
//           />
//           <TouchableOpacity style={styles.addButton} onPress={addHashtag}>
//             <Icon name="hash" size={20} color={isDarkMode ? '#94a3b8' : '#4b5563'} />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.tagsContainer}>
//           {adContent.hashtags.map((tag, idx) => (
//             <View key={idx} style={styles.tag}>
//               <Text style={styles.tagText}>#{tag}</Text>
//               <TouchableOpacity onPress={() => removeHashtag(tag)}>
//                 <Icon name="x" size={12} color="#1e40af" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   );

//   const renderAudienceStep = () => (
//     <View style={styles.stepContainer}>
//       <Text style={styles.stepTitle}>
//         <Icon name="target" size={24} color="#3b82f6" /> Target Audience
//       </Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Location</Text>
//         <TouchableOpacity
//           style={styles.locationSelector}
//           onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: !prev.showLocationDropdown }))}
//         >
//           <Text style={[styles.locationText, !targeting.locations.length && styles.placeholderText]}>
//             {targeting.locations.length > 0 
//               ? targeting.locations.length === NIGERIA_STATES.length 
//                 ? 'All Nigeria'
//                 : `${targeting.locations.length} state${targeting.locations.length > 1 ? 's' : ''} selected`
//               : 'Select states to target'}
//           </Text>
//           <Icon name="chevron-down" size={20} color="#6b7280" />
//         </TouchableOpacity>

//         {targeting.locations.length > 0 && targeting.locations.length < NIGERIA_STATES.length && (
//           <View style={styles.selectedLocationsContainer}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {targeting.locations.map((state, idx) => (
//                 <View key={idx} style={styles.locationTag}>
//                   <Text style={styles.locationTagText}>{state}</Text>
//                   <TouchableOpacity onPress={() => toggleLocation(state)}>
//                     <Icon name="x" size={12} color="#1e40af" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <Modal
//           visible={targeting.showLocationDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.locationModalContent}>
//               <View style={styles.locationModalHeader}>
//                 <Text style={styles.locationModalTitle}>Select States to Target</Text>
//                 <TouchableOpacity 
//                   onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="x" size={26} color="#4b5563" />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.searchContainer}>
//                 <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search Nigerian states..."
//                   placeholderTextColor="#9ca3af"
//                   value={targeting.locationSearch}
//                   onChangeText={(text) => setTargeting(prev => ({ ...prev, locationSearch: text }))}
//                 />
//                 {targeting.locationSearch.length > 0 && (
//                   <TouchableOpacity 
//                     onPress={() => setTargeting(prev => ({ ...prev, locationSearch: '' }))}
//                     style={styles.clearSearchButton}
//                   >
//                     <Icon name="x-circle" size={18} color="#9ca3af" />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={styles.selectionStats}>
//                 <Text style={styles.selectionStatsText}>
//                   {targeting.locations.length} of {NIGERIA_STATES.length} states selected
//                 </Text>
//                 {targeting.locations.length > 0 && (
//                   <TouchableOpacity onPress={clearLocations}>
//                     <Text style={styles.clearAllText}>Clear All</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={styles.locationActions}>
//                 <TouchableOpacity style={styles.actionButton} onPress={selectAllLocations}>
//                   <Icon name="map-pin" size={16} color="#2563eb" />
//                   <Text style={styles.actionButtonText}>All States</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={[styles.actionButton, styles.clearButton]} 
//                   onPress={clearLocations}
//                 >
//                   <Icon name="trash-2" size={16} color="#ef4444" />
//                   <Text style={styles.clearButtonText}>Clear</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView 
//                 style={styles.statesList}
//                 showsVerticalScrollIndicator={true}
//                 contentContainerStyle={styles.statesListContent}
//               >
//                 {filteredStates.length > 0 ? (
//                   filteredStates.map((state) => (
//                     <TouchableOpacity
//                       key={state}
//                       style={[
//                         styles.stateItem,
//                         targeting.locations.includes(state) && styles.stateItemSelected
//                       ]}
//                       onPress={() => toggleLocation(state)}
//                     >
//                       <View style={styles.stateItemLeft}>
//                         <Icon 
//                           name="map-pin" 
//                           size={16} 
//                           color={targeting.locations.includes(state) ? "#2563eb" : "#9ca3af"} 
//                           style={styles.stateIcon}
//                         />
//                         <Text style={[
//                           styles.stateItemText,
//                           targeting.locations.includes(state) && styles.stateItemTextSelected
//                         ]}>
//                           {state}
//                         </Text>
//                       </View>
//                       {targeting.locations.includes(state) && (
//                         <View style={styles.checkmarkContainer}>
//                           <Icon name="check-circle" size={22} color="#2563eb" />
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <View style={styles.noResultsContainer}>
//                     <Icon name="search" size={40} color="#d1d5db" />
//                     <Text style={styles.noResultsText}>No states found</Text>
//                     <Text style={styles.noResultsSubtext}>Try a different search term</Text>
//                   </View>
//                 )}
//               </ScrollView>

//               {targeting.locations.length > 0 && (
//                 <View style={styles.selectedSummary}>
//                   <Text style={styles.selectedSummaryText}>
//                     Selected: {targeting.locations.slice(0, 3).join(', ')}
//                     {targeting.locations.length > 3 && ` +${targeting.locations.length - 3} more`}
//                   </Text>
//                 </View>
//               )}

//               {/* <TouchableOpacity
//                 style={styles.doneButton}
//                 onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
//               >
//                 <Text style={styles.doneButtonText}>Done</Text>
//               </TouchableOpacity> */}
//               <TouchableOpacity
//                 style={styles.doneButton}
//                 onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
//               >
//                 <Text style={styles.doneButtonText}>✓ Done</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>
//           Age Range {targeting.ageRanges.length > 0 ? `(${targeting.ageRanges.join(', ')})` : ''}
//         </Text>
//         <View style={styles.ageRangesContainer}>
//           {AGE_RANGES.map((range) => (
//             <TouchableOpacity
//               key={range}
//               style={[
//                 styles.ageRangeChip,
//                 targeting.ageRanges.includes(range) && styles.ageRangeChipActive
//               ]}
//               onPress={() => toggleAgeRange(range)}
//             >
//               <Text style={[
//                 styles.ageRangeChipText,
//                 targeting.ageRanges.includes(range) && styles.ageRangeChipTextActive
//               ]}>
//                 {range}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <Text style={styles.hint}>Select multiple age groups to target</Text>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Gender</Text>
//         <View style={styles.genderContainer}>
//           {['all', 'male', 'female'].map((gender) => (
//             <TouchableOpacity
//               key={gender}
//               style={[
//                 styles.genderButton,
//                 targeting.gender === gender && styles.genderButtonActive
//               ]}
//               onPress={() => setTargeting({ ...targeting, gender })}
//             >
//               <Text style={[
//                 styles.genderText,
//                 targeting.gender === gender && styles.genderTextActive
//               ]}>
//                 {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Interests</Text>
//         <View style={styles.row}>
//           <TextInput
//             style={[styles.input, styles.flex1]}
//             value={targeting.customInterest}
//             onChangeText={(text) => setTargeting({ ...targeting, customInterest: text })}
//             placeholder="Add custom interest"
//             placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//             onSubmitEditing={addInterest}
//           />
//           <TouchableOpacity style={styles.addButton} onPress={addInterest}>
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestsScroll}>
//           <View style={styles.interestsContainer}>
//             {AUDIENCE_INTERESTS.map((interest) => (
//               <TouchableOpacity
//                 key={interest}
//                 style={[
//                   styles.interestChip,
//                   targeting.interests.includes(interest) && styles.interestChipActive
//                 ]}
//                 onPress={() => {
//                   if (targeting.interests.includes(interest)) {
//                     removeInterest(interest);
//                   } else {
//                     setTargeting({
//                       ...targeting,
//                       interests: [...targeting.interests, interest]
//                     });
//                   }
//                 }}
//               >
//                 <Text style={[
//                   styles.interestChipText,
//                   targeting.interests.includes(interest) && styles.interestChipTextActive
//                 ]}>
//                   {interest}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>

//         <View style={styles.tagsContainer}>
//           {targeting.interests.map((interest, idx) => (
//             <View key={idx} style={styles.tag}>
//               <Text style={styles.tagText}>{interest}</Text>
//               <TouchableOpacity onPress={() => removeInterest(interest)}>
//                 <Icon name="x" size={12} color="#1e40af" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   );

//   const renderBudgetStep = () => (
//     <View style={styles.stepContainer}>
//       <Text style={styles.stepTitle}>
//         <Icon name="dollar-sign" size={24} color="#3b82f6" /> Budget & Objective
//       </Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Ad Objective *</Text>
//         <View style={styles.objectivesGrid}>
//           {AD_OBJECTIVES.map((obj) => (
//             <TouchableOpacity
//               key={obj.id}
//               style={[
//                 styles.objectiveCard,
//                 adSettings.objective === obj.id && styles.objectiveCardActive
//               ]}
//               onPress={() => setAdSettings({ ...adSettings, objective: obj.id })}
//             >
//               <Icon name={obj.icon} size={18} color={adSettings.objective === obj.id ? '#3b82f6' : '#6b7280'} />
//               <Text style={[
//                 styles.objectiveLabel,
//                 adSettings.objective === obj.id && styles.objectiveLabelActive
//               ]}>{obj.label}</Text>
//               <Text style={styles.objectiveDesc}>{obj.desc}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Call To Action</Text>
//         <View style={styles.ctaGrid}>
//           {CTA_OPTIONS.map((option) => (
//             <TouchableOpacity
//               key={option.value}
//               style={[
//                 styles.ctaButton,
//                 adSettings.cta === option.value && styles.ctaButtonActive
//               ]}
//               onPress={() => setAdSettings({ ...adSettings, cta: option.value })}
//             >
//               <Icon name={option.icon} size={16} color={adSettings.cta === option.value ? '#3b82f6' : '#6b7280'} />
//               <Text style={[
//                 styles.ctaText,
//                 adSettings.cta === option.value && styles.ctaTextActive
//               ]}>{option.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Daily Budget (₦) *</Text>
//         <View style={styles.budgetInputContainer}>
//           <Text style={styles.currencySymbol}>₦</Text>
//           <TextInput
//             style={styles.budgetInput}
//             value={adSettings.budget}
//             onChangeText={(text) => {
//               if (text === '' || /^\d+$/.test(text)) {
//                 setAdSettings({ ...adSettings, budget: text });
//               }
//             }}
//             placeholder="Minimum ₦100"
//             placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//             keyboardType="numeric"
//           />
//         </View>
//         <View style={styles.budgetPresets}>
//           {BUDGET_PRESETS.map((amount) => (
//             <TouchableOpacity
//               key={amount}
//               style={[
//                 styles.budgetPreset,
//                 parseInt(adSettings.budget) === amount && styles.budgetPresetActive
//               ]}
//               onPress={() => setAdSettings({ ...adSettings, budget: amount.toString() })}
//             >
//               <Text style={[
//                 styles.budgetPresetText,
//                 parseInt(adSettings.budget) === amount && styles.budgetPresetTextActive
//               ]}>
//                 ₦{amount.toLocaleString()}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.advancedCard}>
//         <Text style={styles.advancedTitle}>
//           <Icon name="bar-chart-2" size={18} color="#4b5563" /> Advanced Options
//         </Text>

//         <View style={styles.advancedRow}>
//           <Text style={styles.advancedLabel}>Enable Engagement Rewards</Text>
//           <Switch
//             value={advanced.rewardEnabled}
//             onValueChange={(value) => setAdvanced({ ...advanced, rewardEnabled: value })}
//             trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
//           />
//         </View>

//         {advanced.rewardEnabled && (
//           <View style={styles.rewardInputContainer}>
//             <Text style={styles.currencySymbol}>₦</Text>
//             <TextInput
//               style={styles.rewardInput}
//               value={advanced.rewardAmount}
//               onChangeText={(text) => setAdvanced({ ...advanced, rewardAmount: text })}
//               placeholder="Reward per engagement"
//               placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//               keyboardType="numeric"
//             />
//           </View>
//         )}

//         <View style={styles.advancedRow}>
//           <Text style={styles.advancedLabel}>Max Bid per Action (₦)</Text>
//         </View>
//         <View style={styles.bidInputContainer}>
//           <Text style={styles.currencySymbol}>₦</Text>
//           <TextInput
//             style={styles.bidInput}
//             value={advanced.maxBid}
//             onChangeText={(text) => setAdvanced({ ...advanced, maxBid: text })}
//             placeholder="Optional"
//             placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
//             keyboardType="numeric"
//           />
//         </View>
//       </View>
//     </View>
//   );

//   const renderScheduleStep = () => (
//     <View style={styles.stepContainer}>
//       <Text style={styles.stepTitle}>
//         <Icon name="calendar" size={24} color="#3b82f6" /> Schedule
//       </Text>

//       <View style={styles.scheduleTypeContainer}>
//         <TouchableOpacity
//           style={[
//             styles.scheduleTypeButton,
//             adSettings.scheduleType === 'immediate' && styles.scheduleTypeButtonActive
//           ]}
//           onPress={() => setAdSettings({ ...adSettings, scheduleType: 'immediate' })}
//         >
//           <Icon
//             name="zap"
//             size={24}
//             color={adSettings.scheduleType === 'immediate' ? '#3b82f6' : '#9ca3af'}
//           />
//           <Text style={[
//             styles.scheduleTypeLabel,
//             adSettings.scheduleType === 'immediate' && styles.scheduleTypeLabelActive
//           ]}>Start Now</Text>
//           <Text style={styles.scheduleTypeDesc}>After approval</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.scheduleTypeButton,
//             adSettings.scheduleType === 'scheduled' && styles.scheduleTypeButtonActive
//           ]}
//           onPress={() => setAdSettings({ ...adSettings, scheduleType: 'scheduled' })}
//         >
//           <Icon
//             name="clock"
//             size={24}
//             color={adSettings.scheduleType === 'scheduled' ? '#3b82f6' : '#9ca3af'}
//           />
//           <Text style={[
//             styles.scheduleTypeLabel,
//             adSettings.scheduleType === 'scheduled' && styles.scheduleTypeLabelActive
//           ]}>Schedule</Text>
//           <Text style={styles.scheduleTypeDesc}>Set date & time</Text>
//         </TouchableOpacity>
//       </View>

//       {adSettings.scheduleType === 'scheduled' && (
//         <View style={styles.scheduleInputs}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Start Date</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => setShowDatePicker(true)}
//             >
//               <Text style={styles.datePickerText}>
//                 {adSettings.scheduledDateString || 'Select Date'}
//               </Text>
//               <Icon name="calendar" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Start Time</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => setShowTimePicker(true)}
//             >
//               <Text style={styles.datePickerText}>
//                 {adSettings.scheduledTimeString || 'Select Time'}
//               </Text>
//               <Icon name="clock" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Duration: {adSettings.duration} days</Text>
//         <View style={styles.durationSliderContainer}>
//           <View style={styles.sliderTrack} />
//           <View style={styles.durationButtons}>
//             {[1, 3, 7, 14, 30].map((days) => (
//               <TouchableOpacity
//                 key={days}
//                 style={[
//                   styles.durationButton,
//                   adSettings.duration === days && styles.durationButtonActive
//                 ]}
//                 onPress={() => setAdSettings({ ...adSettings, duration: days })}
//               >
//                 <Text style={[
//                   styles.durationButtonText,
//                   adSettings.duration === days && styles.durationButtonTextActive
//                 ]}>{days}d</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </View>

//       {(showDatePicker || showTimePicker) && (
//         <DateTimePicker
//           value={showDatePicker ? adSettings.scheduledDate : adSettings.scheduledTime}
//           mode={showDatePicker ? 'date' : 'time'}
//           display="default"
//           onChange={showDatePicker ? onDateChange : onTimeChange}
//         />
//       )}
//     </View>
//   );

//   const renderReviewStep = () => {
//     const locationsDisplay = targeting.locations && targeting.locations.length > 0
//       ? (targeting.locations.length === NIGERIA_STATES.length ? 'All Nigeria' : `${targeting.locations.length} state(s) selected`)
//       : 'Not selected';
    
//     const ageDisplay = targeting.ageRanges && targeting.ageRanges.length > 0
//       ? targeting.ageRanges.join(', ')
//       : 'All ages';
    
//     const interestsDisplay = targeting.interests && targeting.interests.length > 0
//       ? `${targeting.interests.length} interest(s) selected`
//       : 'No interests selected';

//     return (
//       <View style={styles.stepContainer}>
//         <Text style={styles.stepTitle}>
//           <Icon name="check" size={24} color="#10b981" /> Review & Launch
//         </Text>

//         <View style={styles.summaryGrid}>
//           <View style={[styles.summaryCard, styles.summaryCardBlue]}>
//             <Text style={styles.summaryCardTitle}>Ad Content</Text>
//             <Text style={styles.summaryCardText}>{adContent.headline || '(No headline)'}</Text>
//             <Text style={styles.summaryCardSubtext}>{adContent.description || '(No description)'}</Text>
//             {adContent.hashtags && adContent.hashtags.length > 0 && (
//               <View style={styles.summaryTags}>
//                 {adContent.hashtags.map((tag, idx) => (
//                   <Text key={idx} style={styles.summaryTag}>#{tag}</Text>
//                 ))}
//               </View>
//             )}
//           </View>

//           <View style={[styles.summaryCard, styles.summaryCardPurple]}>
//             <Text style={styles.summaryCardTitle}>Targeting</Text>
//             <Text style={styles.summaryCardText}>📍 Location: {locationsDisplay}</Text>
//             <Text style={styles.summaryCardText}>👥 Age: {ageDisplay}</Text>
//             <Text style={styles.summaryCardText}>🎯 {interestsDisplay}</Text>
//             <Text style={styles.summaryCardText}>⚥ Gender: {targeting.gender === 'all' ? 'All' : targeting.gender === 'male' ? 'Male' : 'Female'}</Text>
//           </View>

//           <View style={[styles.summaryCard, styles.summaryCardGreen]}>
//             <Text style={styles.summaryCardTitle}>Budget & Schedule</Text>
//             <Text style={styles.summaryCardLarge}>₦{totalCost.toLocaleString()}</Text>
//             <Text style={styles.summaryCardText}>₦{adSettings.budget || 0}/day × {adSettings.duration} days</Text>
//             <Text style={styles.summaryCardText}>
//               {adSettings.scheduleType === 'immediate' 
//                 ? 'Starts immediately after approval' 
//                 : `Starts on ${adSettings.scheduledDateString || 'Not set'} at ${adSettings.scheduledTimeString || 'Not set'}`}
//             </Text>
//           </View>

//           <View style={[styles.summaryCard, styles.summaryCardOrange]}>
//             <Text style={styles.summaryCardTitle}>Performance</Text>
//             <Text style={styles.summaryCardText}>👁️ ~{estimatedReach.toLocaleString()} reach</Text>
//             <Text style={styles.summaryCardText}>👆 ~{estimatedClicks.toLocaleString()} clicks</Text>
//             <Text style={styles.summaryCardText}>💰 ~₦{Math.round(estimatedClicks ? totalCost / estimatedClicks : 0)} per click</Text>
//           </View>
//         </View>

//         <View style={styles.termsContainer}>
//           <TouchableOpacity style={styles.checkbox}>
//             <Icon name="check-square" size={20} color="#3b82f6" />
//           </TouchableOpacity>
//           <Text style={styles.termsText}>
//             I agree to Showa's Advertising Terms and confirm that my ad complies with all policies.
//             I understand that I'll be charged based on the budget I've set.
//           </Text>
//         </View>

//         {error ? (
//           <View style={styles.errorContainer}>
//             <Icon name="alert-circle" size={20} color="#ef4444" />
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         ) : null}
//       </View>
//     );
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1: return renderAdContentStep();
//       case 2: return renderAudienceStep();
//       case 3: return renderBudgetStep();
//       case 4: return renderScheduleStep();
//       case 5: return renderReviewStep();
//       default: return null;
//     }
//   };

//   const styles = getStyles(isDarkMode);

//   return (
//     <SafeAreaView style={{flex:1 }}>

   
//     <View style={styles.container}>
//       {showSuccess && <SuccessModal />}

//       <View style={styles.header}>
//         <TouchableOpacity onPress={onClose || (() => navigation.goBack())} style={styles.backButton}>
//           <Icon name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Create New Ad</Text>
//           <Text style={styles.headerSubtitle}>Step {currentStep} of 5</Text>
//         </View>
//         {currentStep === 5 && (
//           <TouchableOpacity
//             style={styles.launchButton}
//             onPress={handleCreateAd}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#3b82f6" />
//             ) : (
//               <Text style={styles.launchButtonText}>Launch</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//       <StepIndicator />
//       <ScrollView 
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.contentContainer}
//       >
//         {renderStep()}
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.footerButton, currentStep === 1 && styles.footerButtonDisabled]}
//           onPress={prevStep}
//           disabled={currentStep === 1}
//         >
//           <Text style={[styles.footerButtonText, currentStep === 1 && styles.footerButtonTextDisabled]}>
//             Back
//           </Text>
//         </TouchableOpacity>

//         {currentStep < 5 ? (
//           <TouchableOpacity 
//             style={[styles.footerButton, styles.footerButtonPrimary]} 
//             onPress={nextStep}
//           >
//             <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Continue</Text>
//             <Icon name="chevron-right" size={18} color="#fff" />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.footerButton, styles.footerButtonSuccess]}
//             onPress={handleCreateAd}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Launch Ad Campaign</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//      </SafeAreaView>
//   );
// }

// const getStyles = (isDarkMode) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
//   },
//   header: {
//     backgroundColor: '#2563eb',
//     paddingTop: Platform.OS === 'ios' ? 60 : 20,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   headerSubtitle: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   launchButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//   },
//   launchButtonText: {
//     color: '#2563eb',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   stepIndicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: isDarkMode ? '#334155' : '#e5e7eb',
//   },
//   stepDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: isDarkMode ? '#475569' : '#d1d5db',
//     marginHorizontal: 4,
//   },
//   stepDotActive: {
//     backgroundColor: '#2563eb',
//   },
//   stepDotCurrent: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   content: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   stepContainer: {
//     backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   stepTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//     marginBottom: 16,
//   },
//   mediaTypeContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   mediaTypeButton: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     alignItems: 'center',
//   },
//   mediaTypeButtonActive: {
//     borderColor: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   mediaTypeLabel: {
//     fontWeight: '600',
//     marginTop: 8,
//     fontSize: 14,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//   },
//   mediaTypeLabelActive: {
//     color: '#2563eb',
//   },
//   mediaTypeDesc: {
//     fontSize: 12,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 2,
//   },
//   uploadContainer: {
//     borderWidth: 2,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     borderStyle: 'dashed',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   uploadPlaceholder: {
//     alignItems: 'center',
//     padding: 16,
//   },
//   uploadTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: isDarkMode ? '#94a3b8' : '#4b5563',
//     marginTop: 8,
//   },
//   uploadSubtitle: {
//     fontSize: 12,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 4,
//   },
//   uploadButton: {
//     backgroundColor: '#2563eb',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 25,
//     marginTop: 12,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   previewContainer: {
//     position: 'relative',
//     width: '100%',
//   },
//   previewImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//   },
//   videoPreviewContainer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPreviewText: {
//     marginTop: 8,
//     color: '#2563eb',
//     fontWeight: '600',
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#ef4444',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: isDarkMode ? '#cbd5e1' : '#374151',
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 14,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   textArea: {
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   charCount: {
//     textAlign: 'right',
//     fontSize: 12,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   flex1: {
//     flex: 1,
//   },
//   addButton: {
//     padding: 12,
//     backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//     fontWeight: '600',
//   },
//   locationSelector: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   locationText: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#374151',
//   },
//   placeholderText: {
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//   },
//   selectedLocationsContainer: {
//     marginTop: 8,
//     paddingVertical: 4,
//   },
//   locationTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#dbeafe',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginRight: 6,
//     gap: 4,
//   },
//   locationTagText: {
//     fontSize: 11,
//     color: '#1e40af',
//   },

//   locationModalContent: {
//   backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//   borderRadius: 24,
//   padding: 24,
//   width: '95%',
//   maxWidth: 500,
//   maxHeight: '90%',
//   alignSelf: 'center',
// },
 

//   locationModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   locationModalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   clearSearchButton: {
//     padding: 8,
//   },
//   selectionStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   selectionStatsText: {
//     fontSize: 13,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//     fontWeight: '500',
//   },
//   clearAllText: {
//     fontSize: 13,
//     color: '#ef4444',
//     fontWeight: '600',
//   },
//   locationActions: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 12,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 8,
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//     borderRadius: 20,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 4,
//   },
//   actionButtonText: {
//     color: '#2563eb',
//     fontWeight: '500',
//   },
//   clearButton: {
//     backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
//   },
//   clearButtonText: {
//     color: '#ef4444',
//     fontWeight: '500',
//   },
//   statesList: {
//     maxHeight: 400,
//   },
//   statesListContent: {
//     paddingBottom: 10,
//   },
//   stateItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: isDarkMode ? '#334155' : '#f3f4f6',
//   },
//   stateItemSelected: {
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   stateItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   stateIcon: {
//     width: 20,
//   },
//   stateItemText: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   stateItemTextSelected: {
//     color: '#2563eb',
//     fontWeight: '500',
//   },
//   checkmarkContainer: {
//     padding: 4,
//   },
//   noResultsContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   noResultsText: {
//     fontSize: 16,
//     color: isDarkMode ? '#94a3b8' : '#4b5563',
//     fontWeight: '600',
//     marginTop: 12,
//   },
//   noResultsSubtext: {
//     fontSize: 14,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 4,
//   },
//   selectedSummary: {
//     backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
//     padding: 12,
//     borderRadius: 12,
//     marginVertical: 10,
//   },
//   selectedSummaryText: {
//     fontSize: 13,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//     fontStyle: 'italic',
//   },
  
//  doneButton: {
//   backgroundColor: '#2563eb',
//   paddingVertical: 14,
//   paddingHorizontal: 40,
//   borderRadius: 25,
//   alignItems: 'center',
//   marginTop: 16,
//   alignSelf: 'center',
//   minWidth: 120,
//   shadowColor: '#2563eb',
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.3,
//   shadowRadius: 8,
//   elevation: 4,
// },

// doneButtonText: {
//   color: '#fff',
//   fontWeight: '600',
//   fontSize: 16,
//   textAlign: 'center',
// },
//   closeButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
//   },
//   ageRangesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 4,
//   },
//   ageRangeChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   ageRangeChipActive: {
//     borderColor: '#2563eb',
//     backgroundColor: '#2563eb',
//   },
//   ageRangeChipText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   ageRangeChipTextActive: {
//     color: '#fff',
//   },
//   hint: {
//     fontSize: 12,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 4,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#dbeafe',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     gap: 4,
//   },
//   tagText: {
//     fontSize: 12,
//     color: '#1e40af',
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   genderButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     alignItems: 'center',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   genderButtonActive: {
//     borderColor: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   genderText: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   genderTextActive: {
//     color: '#2563eb',
//     fontWeight: '600',
//   },
//   interestsScroll: {
//     marginVertical: 8,
//   },
//   interestsContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     paddingVertical: 4,
//   },
//   interestChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
//   },
//   interestChipActive: {
//     borderColor: '#2563eb',
//     backgroundColor: '#2563eb',
//   },
//   interestChipText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   interestChipTextActive: {
//     color: '#fff',
//   },
//   objectivesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   objectiveCard: {
//     width: (SCREEN_WIDTH - 72) / 3,
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   objectiveCardActive: {
//     borderColor: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   objectiveLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//     marginTop: 4,
//   },
//   objectiveLabelActive: {
//     color: '#2563eb',
//   },
//   objectiveDesc: {
//     fontSize: 10,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 2,
//   },
//   ctaGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   ctaButton: {
//     width: (SCREEN_WIDTH - 56) / 3,
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   ctaButtonActive: {
//     borderColor: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   ctaText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   ctaTextActive: {
//     color: '#2563eb',
//     fontWeight: '600',
//   },
//   budgetInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   currencySymbol: {
//     fontSize: 16,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//     marginRight: 4,
//   },
//   budgetInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   budgetPresets: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   budgetPreset: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   budgetPresetActive: {
//     borderColor: '#2563eb',
//     backgroundColor: '#2563eb',
//   },
//   budgetPresetText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   budgetPresetTextActive: {
//     color: '#fff',
//   },
//   advancedCard: {
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   advancedTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: isDarkMode ? '#cbd5e1' : '#374151',
//     marginBottom: 12,
//   },
//   advancedRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   advancedLabel: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   rewardInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     marginBottom: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   rewardInput: {
//     flex: 1,
//     paddingVertical: 8,
//     fontSize: 14,
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   bidInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   bidInput: {
//     flex: 1,
//     paddingVertical: 8,
//     fontSize: 14,
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//   },
//   scheduleTypeContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   scheduleTypeButton: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//     alignItems: 'center',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   scheduleTypeButtonActive: {
//     borderColor: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   scheduleTypeLabel: {
//     fontWeight: '600',
//     marginTop: 8,
//     fontSize: 14,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//   },
//   scheduleTypeLabelActive: {
//     color: '#2563eb',
//   },
//   scheduleTypeDesc: {
//     fontSize: 12,
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//     marginTop: 2,
//   },
//   scheduleInputs: {
//     gap: 12,
//     marginBottom: 16,
//   },
//   datePickerButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   datePickerText: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#374151',
//   },
//   durationSliderContainer: {
//     marginTop: 8,
//   },
//   durationButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//   },
//   durationButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   durationButtonActive: {
//     borderColor: '#2563eb',
//     backgroundColor: '#2563eb',
//   },
//   durationButtonText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   durationButtonTextActive: {
//     color: '#fff',
//   },
//   summaryGrid: {
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryCard: {
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#e5e7eb',
//   },
//   summaryCardBlue: {
//     backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
//   },
//   summaryCardPurple: {
//     backgroundColor: isDarkMode ? '#4c1d95' : '#f3e8ff',
//   },
//   summaryCardGreen: {
//     backgroundColor: isDarkMode ? '#064e3b' : '#ecfdf3',
//   },
//   summaryCardOrange: {
//     backgroundColor: isDarkMode ? '#78350f' : '#fff7ed',
//   },
//   summaryCardTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: isDarkMode ? '#f1f5f9' : '#374151',
//     marginBottom: 8,
//   },
//   summaryCardText: {
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//     marginBottom: 2,
//   },
//   summaryCardSubtext: {
//     fontSize: 11,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//     marginTop: 2,
//   },
//   summaryCardLarge: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//     marginBottom: 4,
//   },
//   summaryTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 4,
//     marginTop: 6,
//   },
//   summaryTag: {
//     fontSize: 10,
//     color: '#2563eb',
//     backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   termsContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     backgroundColor: isDarkMode ? '#1e293b' : '#f3f4f6',
//     padding: 16,
//     borderRadius: 12,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   termsText: {
//     flex: 1,
//     fontSize: 12,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//     lineHeight: 18,
//   },
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
//     padding: 12,
//     borderRadius: 12,
//     marginTop: 12,
//   },
//   errorText: {
//     flex: 1,
//     fontSize: 12,
//     color: '#ef4444',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//     borderTopWidth: 1,
//     borderTopColor: isDarkMode ? '#334155' : '#e5e7eb',
//   },
//   footerButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: isDarkMode ? '#334155' : '#d1d5db',
//     minWidth: 100,
//     alignItems: 'center',
//     backgroundColor: isDarkMode ? '#0f172a' : '#fff',
//   },
//   footerButtonDisabled: {
//     opacity: 0.5,
//   },
//   footerButtonPrimary: {
//     backgroundColor: '#2563eb',
//     borderColor: '#2563eb',
//     flexDirection: 'row',
//     gap: 4,
//   },
//   footerButtonSuccess: {
//     backgroundColor: '#10b981',
//     borderColor: '#10b981',
//     flexDirection: 'row',
//     gap: 4,
//   },
//   footerButtonText: {
//     fontSize: 14,
//     color: isDarkMode ? '#cbd5e1' : '#4b5563',
//   },
//   footerButtonTextDisabled: {
//     color: isDarkMode ? '#64748b' : '#9ca3af',
//   },
//   footerButtonTextPrimary: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   modalOverlay: {
//   flex: 1,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: 16,
// },

//   modalContent: {
//     width: '80%',
//     backgroundColor: isDarkMode ? '#1e293b' : '#fff',
//     borderRadius: 24,
//     padding: 24,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: isDarkMode ? '#f1f5f9' : '#1f2937',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   modalText: {
//     fontSize: 14,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   modalInfoContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   modalInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   modalInfoText: {
//     fontSize: 12,
//     color: isDarkMode ? '#94a3b8' : '#6b7280',
//   },
//   modalButton: {
//     width: '100%',
//     backgroundColor: '#2563eb',
//     paddingVertical: 12,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import { useTheme } from '../../src/context/ThemeContext'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AD_OBJECTIVES = [
  { id: 'AWARENESS', icon: 'eye', label: 'Awareness', desc: 'Increase visibility' },
  { id: 'ENGAGEMENT', icon: 'message-circle', label: 'Engagement', desc: 'Get interactions' },
  { id: 'FOLLOWERS', icon: 'users', label: 'Followers', desc: 'Grow audience' },
  { id: 'WEBSITE', icon: 'mouse-pointer', label: 'Website', desc: 'Drive traffic' },
  { id: 'SALES', icon: 'shopping-bag', label: 'Sales', desc: 'Boost purchases' },
  { id: 'LEADS', icon: 'download', label: 'Leads', desc: 'Collect info' },
];

const CTA_OPTIONS = [
  { value: 'FOLLOW', label: 'Follow Us', icon: 'users' },
  { value: 'VISIT', label: 'Visit Site', icon: 'globe' },
  { value: 'SHOP_NOW', label: 'Shop Now', icon: 'shopping-bag' },
  { value: 'LEARN_MORE', label: 'Learn More', icon: 'info' },
  { value: 'SIGN_UP', label: 'Sign Up', icon: 'download' },
  { value: 'CONTACT', label: 'Contact', icon: 'message-circle' },
];

const AUDIENCE_INTERESTS = [
  'Tech', 'Fashion', 'Fitness', 'Food', 'Travel',
  'Music', 'Gaming', 'Business', 'Education', 'Sports'
];

const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT (Abuja)'
].sort();

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const BUDGET_PRESETS = [500, 1000, 5000, 10000];

export default function CreateAdForm({ onClose, onAdCreated }) {
  const navigation = useNavigation();
  const { colors, theme, isDark } = useTheme(); // Use theme context instead of useColorScheme
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    profileImage: ''
  });

  const [adContent, setAdContent] = useState({
    headline: '',
    description: '',
    image: null,
    imagePreview: '',
    video: null,
    videoPreview: '',
    mediaType: 'IMAGE',
    link: '',
    hashtags: [],
    customHashtag: ''
  });

  const [adSettings, setAdSettings] = useState({
    objective: 'AWARENESS',
    cta: '',
    budget: '1000',
    duration: 7,
    scheduleType: 'immediate',
    scheduledDate: new Date(),
    scheduledTime: new Date(),
    scheduledDateString: '',
    scheduledTimeString: ''
  });

  const [targeting, setTargeting] = useState({
    location: '',
    locations: [],
    ageRanges: [],
    gender: 'all',
    interests: [],
    customInterest: '',
    showLocationDropdown: false,
    locationSearch: ''
  });

  const [advanced, setAdvanced] = useState({
    rewardEnabled: false,
    rewardAmount: '',
    maxBid: '',
    optimizationGoal: 'engagement',
    excludeLocations: [],
    deviceTargeting: 'all',
    frequencyCap: 3
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedUserString = await AsyncStorage.getItem('userData');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      
      if (!token || !storedUser?.id) return;

      const res = await axios.get(`${API_ROUTE}/user/${storedUser.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData({
        name: res.data.name,
        username: res.data.username,
        profileImage: `${API_ROUTE_IMAGE}${res.data.profile_picture}`
      });
    } catch {
      setError('Failed to load user profile');
    }
  };

  const handleMediaSelect = (type) => {
    const options = {
      mediaType: type === 'image' ? 'photo' : 'video',
      quality: 1,
      videoQuality: 'high',
      durationLimit: 60,
      includeBase64: false,
      maxWidth: 1200,
      maxHeight: 1200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to select media: ' + response.error);
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        
        if (type === 'image') {
          setAdContent({
            ...adContent,
            image: {
              uri: asset.uri,
              type: asset.type,
              name: asset.fileName || 'image.jpg',
              size: asset.fileSize
            },
            imagePreview: asset.uri,
            mediaType: 'IMAGE',
            video: null,
            videoPreview: ''
          });
        } else {
          setAdContent({
            ...adContent,
            video: {
              uri: asset.uri,
              type: asset.type,
              name: asset.fileName || 'video.mp4',
              size: asset.fileSize
            },
            videoPreview: asset.uri,
            mediaType: 'VIDEO',
            image: null,
            imagePreview: ''
          });
        }
      }
    });
  };

  const addHashtag = () => {
    if (adContent.customHashtag.trim() && !adContent.hashtags.includes(adContent.customHashtag)) {
      setAdContent({
        ...adContent,
        hashtags: [...adContent.hashtags, adContent.customHashtag],
        customHashtag: ''
      });
    }
  };

  const removeHashtag = (tag) => {
    setAdContent({
      ...adContent,
      hashtags: adContent.hashtags.filter(t => t !== tag)
    });
  };

  const addInterest = () => {
    if (targeting.customInterest.trim() && !targeting.interests.includes(targeting.customInterest)) {
      setTargeting({
        ...targeting,
        interests: [...targeting.interests, targeting.customInterest],
        customInterest: ''
      });
    }
  };

  const removeInterest = (interest) => {
    setTargeting({
      ...targeting,
      interests: targeting.interests.filter(i => i !== interest)
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAdSettings({
        ...adSettings,
        scheduledDate: selectedDate,
        scheduledDateString: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAdSettings({
        ...adSettings,
        scheduledTime: selectedTime,
        scheduledTimeString: selectedTime.toTimeString().split(' ')[0].substring(0, 5)
      });
    }
  };

  const toggleLocation = (state) => {
    setTargeting(prev => {
      const newLocations = prev.locations.includes(state)
        ? prev.locations.filter(l => l !== state)
        : [...prev.locations, state];
      
      return {
        ...prev,
        locations: newLocations,
        location: newLocations.length > 0 ? newLocations.join(', ') : ''
      };
    });
  };

  const selectAllLocations = () => {
    setTargeting(prev => ({
      ...prev,
      locations: NIGERIA_STATES,
      location: 'All Nigeria',
      showLocationDropdown: false
    }));
  };

  const clearLocations = () => {
    setTargeting(prev => ({
      ...prev,
      locations: [],
      location: '',
      showLocationDropdown: false
    }));
  };

  const filteredStates = NIGERIA_STATES.filter(state =>
    state.toLowerCase().includes(targeting.locationSearch.toLowerCase())
  );

  const toggleAgeRange = (range) => {
    setTargeting(prev => ({
      ...prev,
      ageRanges: prev.ageRanges.includes(range)
        ? prev.ageRanges.filter(r => r !== range)
        : [...prev.ageRanges, range]
    }));
  };

  const handleCreateAd = async () => {
    setLoading(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();

      formData.append('headline', adContent.headline);
      formData.append('description', adContent.description);
      formData.append('link', adContent.link || '');
      formData.append('hashtags', JSON.stringify(adContent.hashtags));
      formData.append('media_type', adContent.mediaType);

      if (adContent.mediaType === 'IMAGE' && adContent.image) {
        formData.append('image', {
          uri: adContent.image.uri,
          type: adContent.image.type,
          name: adContent.image.name
        });
      } else if (adContent.mediaType === 'VIDEO' && adContent.video) {
        formData.append('video', {
          uri: adContent.video.uri,
          type: adContent.video.type,
          name: adContent.video.name
        });
      }

      formData.append('objective', adSettings.objective);
      formData.append('cta', adSettings.cta || '');

      const budgetValue = parseFloat(adSettings.budget);
      if (isNaN(budgetValue) || budgetValue < 100) {
        throw new Error('Budget must be at least ₦100');
      }
      formData.append('budget', budgetValue.toString());
      formData.append('duration_days', adSettings.duration.toString());
      formData.append('schedule_type', adSettings.scheduleType);

      if (adSettings.scheduleType === 'scheduled') {
        if (adSettings.scheduledDateString && adSettings.scheduledTimeString) {
          const scheduledDateTime = `${adSettings.scheduledDateString}T${adSettings.scheduledTimeString}`;
          formData.append('scheduled_start', scheduledDateTime);
        }
      }

      formData.append('targeting', JSON.stringify({
        locations: targeting.locations,
        ageRanges: targeting.ageRanges,
        gender: targeting.gender,
        interests: targeting.interests
      }));

      formData.append('advanced', JSON.stringify({
        reward_enabled: advanced.rewardEnabled,
        reward_amount: advanced.rewardAmount || '0',
        max_bid: advanced.maxBid || '',
        optimization_goal: advanced.optimizationGoal,
        frequency_cap: advanced.frequencyCap
      }));

      const response = await axios.post(`${API_ROUTE}/ads/create/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        if (onAdCreated) onAdCreated(response.data);
        navigation.goBack();
      }, 3000);

    } catch (err) {
      console.error('Error creating ad:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        let errorMessage = 'Validation errors:\n';

        Object.keys(validationErrors).forEach(key => {
          const errorValue = validationErrors[key];
          if (Array.isArray(errorValue)) {
            errorMessage += `${key}: ${errorValue.join(', ')}\n`;
          } else if (typeof errorValue === 'object') {
            const nestedMessages = [];
            Object.values(errorValue).forEach(nestedError => {
              if (Array.isArray(nestedError)) {
                nestedMessages.push(nestedError.join(', '));
              } else if (typeof nestedError === 'string') {
                nestedMessages.push(nestedError);
              }
            });
            errorMessage += `${key}: ${nestedMessages.join(', ')}\n`;
          } else if (typeof errorValue === 'string') {
            errorMessage += `${key}: ${errorValue}\n`;
          }
        });

        setError(errorMessage);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to create ad');
      }
    } finally {
      setLoading(false);
    }
  };

  const estimatedReach = adSettings.budget ? Math.round(parseInt(adSettings.budget) * 50) : 0;
  const estimatedClicks = adSettings.budget ? Math.round(parseInt(adSettings.budget) * 5) : 0;
  const totalCost = adSettings.budget ? parseInt(adSettings.budget) * adSettings.duration : 0;

  const SuccessModal = () => (
    <Modal visible={showSuccess} transparent animationType="fade">
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>🎉 Ad Created Successfully!</Text>
          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
            Your advertisement has been submitted for review. It will go live once approved by our team.
          </Text>
          <View style={styles.modalInfoContainer}>
            <View style={styles.modalInfoRow}>
              <Icon name="clock" size={16} color={colors.textTertiary} />
              <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>Review process usually takes 24-48 hours</Text>
            </View>
            <View style={styles.modalInfoRow}>
              <Icon name="eye" size={16} color={colors.textTertiary} />
              <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>Estimated reach: {estimatedReach.toLocaleString()} people</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setShowSuccess(false);
              navigation.goBack();
            }}
          >
            <Text style={styles.modalButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const StepIndicator = () => (
    <View style={[styles.stepIndicatorContainer, { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border 
    }]}>
      {[1, 2, 3, 4, 5].map((step) => (
        <View
          key={step}
          style={[
            styles.stepDot,
            step <= currentStep && [styles.stepDotActive, { backgroundColor: colors.primary }],
            step === currentStep && styles.stepDotCurrent,
            step <= currentStep && { backgroundColor: colors.primary },
            step > currentStep && { backgroundColor: colors.surfaceTertiary || '#d1d5db' }
          ]}
        />
      ))}
    </View>
  );

  const renderAdContentStep = () => (
    <View style={[styles.stepContainer, { 
      backgroundColor: colors.surface,
      shadowColor: isDark ? 'transparent' : '#000'
    }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        <Icon name="zap" size={24} color={colors.primary} /> Create Your Ad Content
      </Text>

      <View style={styles.mediaTypeContainer}>
        <TouchableOpacity
          style={[
            styles.mediaTypeButton,
            adContent.mediaType === 'IMAGE' && [styles.mediaTypeButtonActive, { 
              borderColor: colors.primary,
              backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
            }],
            { borderColor: isDark ? colors.border : '#e5e7eb' }
          ]}
          onPress={() => setAdContent({
            ...adContent,
            mediaType: 'IMAGE',
            video: null,
            videoPreview: ''
          })}
        >
          <Icon
            name="image"
            size={24}
            color={adContent.mediaType === 'IMAGE' ? colors.primary : colors.textTertiary}
          />
          <Text style={[
            styles.mediaTypeLabel,
            adContent.mediaType === 'IMAGE' && [styles.mediaTypeLabelActive, { color: colors.primary }],
            { color: adContent.mediaType === 'IMAGE' ? colors.primary : colors.textTertiary }
          ]}>Image Ad</Text>
          <Text style={[styles.mediaTypeDesc, { color: colors.textTertiary }]}>Single image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mediaTypeButton,
            adContent.mediaType === 'VIDEO' && [styles.mediaTypeButtonActive, { 
              borderColor: colors.primary,
              backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
            }],
            { borderColor: isDark ? colors.border : '#e5e7eb' }
          ]}
          onPress={() => setAdContent({
            ...adContent,
            mediaType: 'VIDEO',
            image: null,
            imagePreview: ''
          })}
        >
          <Icon
            name="video"
            size={24}
            color={adContent.mediaType === 'VIDEO' ? colors.primary : colors.textTertiary}
          />
          <Text style={[
            styles.mediaTypeLabel,
            adContent.mediaType === 'VIDEO' && [styles.mediaTypeLabelActive, { color: colors.primary }],
            { color: adContent.mediaType === 'VIDEO' ? colors.primary : colors.textTertiary }
          ]}>Video Ad</Text>
          <Text style={[styles.mediaTypeDesc, { color: colors.textTertiary }]}>Up to 60s</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.uploadContainer, { 
        borderColor: isDark ? colors.border : '#e5e7eb',
        backgroundColor: isDark ? colors.background : 'transparent'
      }]}>
        {adContent.mediaType === 'IMAGE' && adContent.imagePreview ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: adContent.imagePreview }} style={styles.previewImage} />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error || '#ef4444' }]}
              onPress={() => setAdContent({ ...adContent, image: null, imagePreview: '' })}
            >
              <Icon name="x" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : adContent.mediaType === 'VIDEO' && adContent.videoPreview ? (
          <View style={styles.previewContainer}>
            <View style={[styles.videoPreviewContainer, { 
              backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' 
            }]}>
              <Icon name="video" size={48} color={colors.primary} />
              <Text style={[styles.videoPreviewText, { color: colors.primary }]}>Video selected</Text>
            </View>
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error || '#ef4444' }]}
              onPress={() => setAdContent({ ...adContent, video: null, videoPreview: '' })}
            >
              <Icon name="x" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadPlaceholder}
            onPress={() => handleMediaSelect(adContent.mediaType.toLowerCase())}
          >
            <Icon name={adContent.mediaType === 'IMAGE' ? 'image' : 'video'} size={48} color={colors.textTertiary} />
            <Text style={[styles.uploadTitle, { color: colors.textSecondary }]}>
              Upload {adContent.mediaType === 'IMAGE' ? 'Image' : 'Video'}
            </Text>
            <Text style={[styles.uploadSubtitle, { color: colors.textTertiary }]}>
              {adContent.mediaType === 'IMAGE' ? 'JPG, PNG up to 10MB' : 'MP4 up to 100MB'}
            </Text>
            <View style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Headline *</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: isDark ? colors.border : '#d1d5db',
            backgroundColor: isDark ? colors.background : '#fff',
            color: colors.text
          }]}
          value={adContent.headline}
          onChangeText={(text) => setAdContent({ ...adContent, headline: text })}
          placeholder="Catchy headline for your ad"
          placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
          maxLength={60}
        />
        <Text style={[styles.charCount, { color: colors.textTertiary }]}>{adContent.headline.length}/60</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea, { 
            borderColor: isDark ? colors.border : '#d1d5db',
            backgroundColor: isDark ? colors.background : '#fff',
            color: colors.text
          }]}
          value={adContent.description}
          onChangeText={(text) => setAdContent({ ...adContent, description: text })}
          placeholder="Describe your offer..."
          placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
          multiline
          numberOfLines={4}
          maxLength={220}
        />
        <Text style={[styles.charCount, { color: colors.textTertiary }]}>{adContent.description.length}/220</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Destination Link</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: isDark ? colors.border : '#d1d5db',
            backgroundColor: isDark ? colors.background : '#fff',
            color: colors.text
          }]}
          value={adContent.link}
          onChangeText={(text) => setAdContent({ ...adContent, link: text })}
          placeholder="https://your-website.com"
          placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Hashtags</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1, { 
              borderColor: isDark ? colors.border : '#d1d5db',
              backgroundColor: isDark ? colors.background : '#fff',
              color: colors.text
            }]}
            value={adContent.customHashtag}
            onChangeText={(text) => setAdContent({ ...adContent, customHashtag: text })}
            placeholder="Add custom hashtag"
            placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
            onSubmitEditing={addHashtag}
          />
          <TouchableOpacity style={[styles.addButton, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' 
          }]} onPress={addHashtag}>
            <Icon name="hash" size={20} color={isDark ? colors.textSecondary : '#4b5563'} />
          </TouchableOpacity>
        </View>
        <View style={styles.tagsContainer}>
          {adContent.hashtags.map((tag, idx) => (
            <View key={idx} style={[styles.tag, { backgroundColor: isDark ? colors.surfaceSecondary : '#dbeafe' }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
              <TouchableOpacity onPress={() => removeHashtag(tag)}>
                <Icon name="x" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAudienceStep = () => (
    <View style={[styles.stepContainer, { 
      backgroundColor: colors.surface,
      shadowColor: isDark ? 'transparent' : '#000'
    }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        <Icon name="target" size={24} color={colors.primary} /> Target Audience
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
        <TouchableOpacity
          style={[styles.locationSelector, { 
            borderColor: isDark ? colors.border : '#d1d5db',
            backgroundColor: isDark ? colors.background : '#fff'
          }]}
          onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: !prev.showLocationDropdown }))}
        >
          <Text style={[
            styles.locationText, 
            !targeting.locations.length && [styles.placeholderText, { color: colors.textTertiary }],
            { color: targeting.locations.length ? colors.text : colors.textTertiary }
          ]}>
            {targeting.locations.length > 0 
              ? targeting.locations.length === NIGERIA_STATES.length 
                ? 'All Nigeria'
                : `${targeting.locations.length} state${targeting.locations.length > 1 ? 's' : ''} selected`
              : 'Select states to target'}
          </Text>
          <Icon name="chevron-down" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {targeting.locations.length > 0 && targeting.locations.length < NIGERIA_STATES.length && (
          <View style={styles.selectedLocationsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {targeting.locations.map((state, idx) => (
                <View key={idx} style={[styles.locationTag, { backgroundColor: isDark ? colors.surfaceSecondary : '#dbeafe' }]}>
                  <Text style={[styles.locationTagText, { color: colors.primary }]}>{state}</Text>
                  <TouchableOpacity onPress={() => toggleLocation(state)}>
                    <Icon name="x" size={12} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <Modal
          visible={targeting.showLocationDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
        >
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.locationModalContent, { backgroundColor: colors.surface }]}>
              <View style={styles.locationModalHeader}>
                <Text style={[styles.locationModalTitle, { color: colors.text }]}>Select States to Target</Text>
                <TouchableOpacity 
                  onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
                  style={[styles.closeButton, { backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' }]}
                >
                  <Icon name="x" size={26} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={[styles.searchContainer, { 
                borderColor: isDark ? colors.border : '#e5e7eb',
                backgroundColor: isDark ? colors.background : '#fff'
              }]}>
                <Icon name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search Nigerian states..."
                  placeholderTextColor={colors.textTertiary}
                  value={targeting.locationSearch}
                  onChangeText={(text) => setTargeting(prev => ({ ...prev, locationSearch: text }))}
                />
                {targeting.locationSearch.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setTargeting(prev => ({ ...prev, locationSearch: '' }))}
                    style={styles.clearSearchButton}
                  >
                    <Icon name="x-circle" size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.selectionStats}>
                <Text style={[styles.selectionStatsText, { color: colors.textSecondary }]}>
                  {targeting.locations.length} of {NIGERIA_STATES.length} states selected
                </Text>
                {targeting.locations.length > 0 && (
                  <TouchableOpacity onPress={clearLocations}>
                    <Text style={[styles.clearAllText, { color: colors.error || '#ef4444' }]}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.locationActions}>
                <TouchableOpacity style={[styles.actionButton, { 
                  backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
                }]} onPress={selectAllLocations}>
                  <Icon name="map-pin" size={16} color={colors.primary} />
                  <Text style={[styles.actionButtonText, { color: colors.primary }]}>All States</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.clearButton, { 
                    backgroundColor: isDark ? colors.surfaceSecondary : '#fee2e2' 
                  }]} 
                  onPress={clearLocations}
                >
                  <Icon name="trash-2" size={16} color={colors.error || '#ef4444'} />
                  <Text style={[styles.clearButtonText, { color: colors.error || '#ef4444' }]}>Clear</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.statesList}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.statesListContent}
              >
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => (
                    <TouchableOpacity
                      key={state}
                      style={[
                        styles.stateItem,
                        targeting.locations.includes(state) && [styles.stateItemSelected, { 
                          backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
                        }],
                        { borderBottomColor: isDark ? colors.border : '#f3f4f6' }
                      ]}
                      onPress={() => toggleLocation(state)}
                    >
                      <View style={styles.stateItemLeft}>
                        <Icon 
                          name="map-pin" 
                          size={16} 
                          color={targeting.locations.includes(state) ? colors.primary : colors.textTertiary} 
                          style={styles.stateIcon}
                        />
                        <Text style={[
                          styles.stateItemText,
                          targeting.locations.includes(state) && [styles.stateItemTextSelected, { color: colors.primary }],
                          { color: targeting.locations.includes(state) ? colors.primary : colors.text }
                        ]}>
                          {state}
                        </Text>
                      </View>
                      {targeting.locations.includes(state) && (
                        <View style={styles.checkmarkContainer}>
                          <Icon name="check-circle" size={22} color={colors.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Icon name="search" size={40} color={colors.textTertiary} />
                    <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>No states found</Text>
                    <Text style={[styles.noResultsSubtext, { color: colors.textTertiary }]}>Try a different search term</Text>
                  </View>
                )}
              </ScrollView>

              {targeting.locations.length > 0 && (
                <View style={[styles.selectedSummary, { 
                  backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' 
                }]}>
                  <Text style={[styles.selectedSummaryText, { color: colors.textSecondary }]}>
                    Selected: {targeting.locations.slice(0, 3).join(', ')}
                    {targeting.locations.length > 3 && ` +${targeting.locations.length - 3} more`}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: colors.primary }]}
                onPress={() => setTargeting(prev => ({ ...prev, showLocationDropdown: false }))}
              >
                <Text style={styles.doneButtonText}>✓ Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Age Range {targeting.ageRanges.length > 0 ? `(${targeting.ageRanges.join(', ')})` : ''}
        </Text>
        <View style={styles.ageRangesContainer}>
          {AGE_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.ageRangeChip,
                targeting.ageRanges.includes(range) && [styles.ageRangeChipActive, { backgroundColor: colors.primary }],
                { 
                  borderColor: isDark ? colors.border : '#d1d5db',
                  backgroundColor: isDark ? colors.background : '#fff'
                }
              ]}
              onPress={() => toggleAgeRange(range)}
            >
              <Text style={[
                styles.ageRangeChipText,
                targeting.ageRanges.includes(range) && [styles.ageRangeChipTextActive, { color: '#fff' }],
                { color: targeting.ageRanges.includes(range) ? '#fff' : colors.text }
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>Select multiple age groups to target</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Gender</Text>
        <View style={styles.genderContainer}>
          {['all', 'male', 'female'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderButton,
                targeting.gender === gender && [styles.genderButtonActive, { 
                  borderColor: colors.primary,
                  backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
                }],
                { 
                  borderColor: isDark ? colors.border : '#d1d5db',
                  backgroundColor: isDark ? colors.background : '#fff'
                }
              ]}
              onPress={() => setTargeting({ ...targeting, gender })}
            >
              <Text style={[
                styles.genderText,
                targeting.gender === gender && [styles.genderTextActive, { color: colors.primary }],
                { color: targeting.gender === gender ? colors.primary : colors.text }
              ]}>
                {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Interests</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1, { 
              borderColor: isDark ? colors.border : '#d1d5db',
              backgroundColor: isDark ? colors.background : '#fff',
              color: colors.text
            }]}
            value={targeting.customInterest}
            onChangeText={(text) => setTargeting({ ...targeting, customInterest: text })}
            placeholder="Add custom interest"
            placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
            onSubmitEditing={addInterest}
          />
          <TouchableOpacity style={[styles.addButton, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' 
          }]} onPress={addInterest}>
            <Text style={[styles.addButtonText, { color: colors.textSecondary }]}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestsScroll}>
          <View style={styles.interestsContainer}>
            {AUDIENCE_INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  targeting.interests.includes(interest) && [styles.interestChipActive, { backgroundColor: colors.primary }],
                  { 
                    borderColor: isDark ? colors.border : '#d1d5db',
                    backgroundColor: isDark ? colors.background : '#f3f4f6'
                  }
                ]}
                onPress={() => {
                  if (targeting.interests.includes(interest)) {
                    removeInterest(interest);
                  } else {
                    setTargeting({
                      ...targeting,
                      interests: [...targeting.interests, interest]
                    });
                  }
                }}
              >
                <Text style={[
                  styles.interestChipText,
                  targeting.interests.includes(interest) && [styles.interestChipTextActive, { color: '#fff' }],
                  { color: targeting.interests.includes(interest) ? '#fff' : colors.text }
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.tagsContainer}>
          {targeting.interests.map((interest, idx) => (
            <View key={idx} style={[styles.tag, { backgroundColor: isDark ? colors.surfaceSecondary : '#dbeafe' }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{interest}</Text>
              <TouchableOpacity onPress={() => removeInterest(interest)}>
                <Icon name="x" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderBudgetStep = () => (
    <View style={[styles.stepContainer, { 
      backgroundColor: colors.surface,
      shadowColor: isDark ? 'transparent' : '#000'
    }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        <Icon name="dollar-sign" size={24} color={colors.primary} /> Budget & Objective
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Ad Objective *</Text>
        <View style={styles.objectivesGrid}>
          {AD_OBJECTIVES.map((obj) => (
            <TouchableOpacity
              key={obj.id}
              style={[
                styles.objectiveCard,
                adSettings.objective === obj.id && [styles.objectiveCardActive, { 
                  borderColor: colors.primary,
                  backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
                }],
                { 
                  borderColor: isDark ? colors.border : '#e5e7eb',
                  backgroundColor: isDark ? colors.background : '#fff'
                }
              ]}
              onPress={() => setAdSettings({ ...adSettings, objective: obj.id })}
            >
              <Icon name={obj.icon} size={18} color={adSettings.objective === obj.id ? colors.primary : colors.textTertiary} />
              <Text style={[
                styles.objectiveLabel,
                adSettings.objective === obj.id && [styles.objectiveLabelActive, { color: colors.primary }],
                { color: adSettings.objective === obj.id ? colors.primary : colors.text }
              ]}>{obj.label}</Text>
              <Text style={[styles.objectiveDesc, { color: colors.textTertiary }]}>{obj.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Call To Action</Text>
        <View style={styles.ctaGrid}>
          {CTA_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.ctaButton,
                adSettings.cta === option.value && [styles.ctaButtonActive, { 
                  borderColor: colors.primary,
                  backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
                }],
                { 
                  borderColor: isDark ? colors.border : '#e5e7eb',
                  backgroundColor: isDark ? colors.background : '#fff'
                }
              ]}
              onPress={() => setAdSettings({ ...adSettings, cta: option.value })}
            >
              <Icon name={option.icon} size={16} color={adSettings.cta === option.value ? colors.primary : colors.textTertiary} />
              <Text style={[
                styles.ctaText,
                adSettings.cta === option.value && [styles.ctaTextActive, { color: colors.primary }],
                { color: adSettings.cta === option.value ? colors.primary : colors.text }
              ]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Daily Budget (₦) *</Text>
        <View style={[styles.budgetInputContainer, { 
          borderColor: isDark ? colors.border : '#d1d5db',
          backgroundColor: isDark ? colors.background : '#fff'
        }]}>
          <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>₦</Text>
          <TextInput
            style={[styles.budgetInput, { color: colors.text }]}
            value={adSettings.budget}
            onChangeText={(text) => {
              if (text === '' || /^\d+$/.test(text)) {
                setAdSettings({ ...adSettings, budget: text });
              }
            }}
            placeholder="Minimum ₦100"
            placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.budgetPresets}>
          {BUDGET_PRESETS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.budgetPreset,
                parseInt(adSettings.budget) === amount && [styles.budgetPresetActive, { backgroundColor: colors.primary }],
                { 
                  borderColor: isDark ? colors.border : '#d1d5db',
                  backgroundColor: isDark ? colors.background : '#fff'
                }
              ]}
              onPress={() => setAdSettings({ ...adSettings, budget: amount.toString() })}
            >
              <Text style={[
                styles.budgetPresetText,
                parseInt(adSettings.budget) === amount && [styles.budgetPresetTextActive, { color: '#fff' }],
                { color: parseInt(adSettings.budget) === amount ? '#fff' : colors.text }
              ]}>
                ₦{amount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.advancedCard, { 
        borderColor: isDark ? colors.border : '#e5e7eb',
        backgroundColor: isDark ? colors.background : '#fff'
      }]}>
        <Text style={[styles.advancedTitle, { color: colors.text }]}>
          <Icon name="bar-chart-2" size={18} color={colors.textTertiary} /> Advanced Options
        </Text>

        <View style={styles.advancedRow}>
          <Text style={[styles.advancedLabel, { color: colors.text }]}>Enable Engagement Rewards</Text>
          <Switch
            value={advanced.rewardEnabled}
            onValueChange={(value) => setAdvanced({ ...advanced, rewardEnabled: value })}
            trackColor={{ false: colors.surfaceTertiary || '#d1d5db', true: colors.primary }}
          />
        </View>

        {advanced.rewardEnabled && (
          <View style={[styles.rewardInputContainer, { 
            borderColor: isDark ? colors.border : '#d1d5db',
            backgroundColor: isDark ? colors.background : '#fff'
          }]}>
            <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>₦</Text>
            <TextInput
              style={[styles.rewardInput, { color: colors.text }]}
              value={advanced.rewardAmount}
              onChangeText={(text) => setAdvanced({ ...advanced, rewardAmount: text })}
              placeholder="Reward per engagement"
              placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.advancedRow}>
          <Text style={[styles.advancedLabel, { color: colors.text }]}>Max Bid per Action (₦)</Text>
        </View>
        <View style={[styles.bidInputContainer, { 
          borderColor: isDark ? colors.border : '#d1d5db',
          backgroundColor: isDark ? colors.background : '#fff'
        }]}>
          <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>₦</Text>
          <TextInput
            style={[styles.bidInput, { color: colors.text }]}
            value={advanced.maxBid}
            onChangeText={(text) => setAdvanced({ ...advanced, maxBid: text })}
            placeholder="Optional"
            placeholderTextColor={isDark ? colors.textTertiary : '#9ca3af'}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderScheduleStep = () => (
    <View style={[styles.stepContainer, { 
      backgroundColor: colors.surface,
      shadowColor: isDark ? 'transparent' : '#000'
    }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        <Icon name="calendar" size={24} color={colors.primary} /> Schedule
      </Text>

      <View style={styles.scheduleTypeContainer}>
        <TouchableOpacity
          style={[
            styles.scheduleTypeButton,
            adSettings.scheduleType === 'immediate' && [styles.scheduleTypeButtonActive, { 
              borderColor: colors.primary,
              backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
            }],
            { 
              borderColor: isDark ? colors.border : '#e5e7eb',
              backgroundColor: isDark ? colors.background : '#fff'
            }
          ]}
          onPress={() => setAdSettings({ ...adSettings, scheduleType: 'immediate' })}
        >
          <Icon
            name="zap"
            size={24}
            color={adSettings.scheduleType === 'immediate' ? colors.primary : colors.textTertiary}
          />
          <Text style={[
            styles.scheduleTypeLabel,
            adSettings.scheduleType === 'immediate' && [styles.scheduleTypeLabelActive, { color: colors.primary }],
            { color: adSettings.scheduleType === 'immediate' ? colors.primary : colors.textTertiary }
          ]}>Start Now</Text>
          <Text style={[styles.scheduleTypeDesc, { color: colors.textTertiary }]}>After approval</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scheduleTypeButton,
            adSettings.scheduleType === 'scheduled' && [styles.scheduleTypeButtonActive, { 
              borderColor: colors.primary,
              backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
            }],
            { 
              borderColor: isDark ? colors.border : '#e5e7eb',
              backgroundColor: isDark ? colors.background : '#fff'
            }
          ]}
          onPress={() => setAdSettings({ ...adSettings, scheduleType: 'scheduled' })}
        >
          <Icon
            name="clock"
            size={24}
            color={adSettings.scheduleType === 'scheduled' ? colors.primary : colors.textTertiary}
          />
          <Text style={[
            styles.scheduleTypeLabel,
            adSettings.scheduleType === 'scheduled' && [styles.scheduleTypeLabelActive, { color: colors.primary }],
            { color: adSettings.scheduleType === 'scheduled' ? colors.primary : colors.textTertiary }
          ]}>Schedule</Text>
          <Text style={[styles.scheduleTypeDesc, { color: colors.textTertiary }]}>Set date & time</Text>
        </TouchableOpacity>
      </View>

      {adSettings.scheduleType === 'scheduled' && (
        <View style={styles.scheduleInputs}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { 
                borderColor: isDark ? colors.border : '#d1d5db',
                backgroundColor: isDark ? colors.background : '#fff'
              }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.datePickerText, { color: colors.text }]}>
                {adSettings.scheduledDateString || 'Select Date'}
              </Text>
              <Icon name="calendar" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Start Time</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, { 
                borderColor: isDark ? colors.border : '#d1d5db',
                backgroundColor: isDark ? colors.background : '#fff'
              }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.datePickerText, { color: colors.text }]}>
                {adSettings.scheduledTimeString || 'Select Time'}
              </Text>
              <Icon name="clock" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Duration: {adSettings.duration} days</Text>
        <View style={styles.durationSliderContainer}>
          <View style={styles.durationButtons}>
            {[1, 3, 7, 14, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.durationButton,
                  adSettings.duration === days && [styles.durationButtonActive, { backgroundColor: colors.primary }],
                  { 
                    borderColor: isDark ? colors.border : '#d1d5db',
                    backgroundColor: isDark ? colors.background : '#fff'
                  }
                ]}
                onPress={() => setAdSettings({ ...adSettings, duration: days })}
              >
                <Text style={[
                  styles.durationButtonText,
                  adSettings.duration === days && [styles.durationButtonTextActive, { color: '#fff' }],
                  { color: adSettings.duration === days ? '#fff' : colors.text }
                ]}>{days}d</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {(showDatePicker || showTimePicker) && (
        <DateTimePicker
          value={showDatePicker ? adSettings.scheduledDate : adSettings.scheduledTime}
          mode={showDatePicker ? 'date' : 'time'}
          display="default"
          onChange={showDatePicker ? onDateChange : onTimeChange}
        />
      )}
    </View>
  );

  const renderReviewStep = () => {
    const locationsDisplay = targeting.locations && targeting.locations.length > 0
      ? (targeting.locations.length === NIGERIA_STATES.length ? 'All Nigeria' : `${targeting.locations.length} state(s) selected`)
      : 'Not selected';
    
    const ageDisplay = targeting.ageRanges && targeting.ageRanges.length > 0
      ? targeting.ageRanges.join(', ')
      : 'All ages';
    
    const interestsDisplay = targeting.interests && targeting.interests.length > 0
      ? `${targeting.interests.length} interest(s) selected`
      : 'No interests selected';

    return (
      <View style={[styles.stepContainer, { 
        backgroundColor: colors.surface,
        shadowColor: isDark ? 'transparent' : '#000'
      }]}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          <Icon name="check" size={24} color={colors.success || '#10b981'} /> Review & Launch
        </Text>

        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.summaryCardBlue, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#eff6ff' 
          }]}>
            <Text style={[styles.summaryCardTitle, { color: isDark ? '#f1f5f9' : '#374151' }]}>Ad Content</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>{adContent.headline || '(No headline)'}</Text>
            <Text style={[styles.summaryCardSubtext, { color: isDark ? '#94a3b8' : '#6b7280' }]}>{adContent.description || '(No description)'}</Text>
            {adContent.hashtags && adContent.hashtags.length > 0 && (
              <View style={styles.summaryTags}>
                {adContent.hashtags.map((tag, idx) => (
                  <Text key={idx} style={[styles.summaryTag, { 
                    color: colors.primary,
                    backgroundColor: isDark ? colors.background : '#fff' 
                  }]}>#{tag}</Text>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.summaryCard, styles.summaryCardPurple, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#f3e8ff' 
          }]}>
            <Text style={[styles.summaryCardTitle, { color: isDark ? '#f1f5f9' : '#374151' }]}>Targeting</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>📍 Location: {locationsDisplay}</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>👥 Age: {ageDisplay}</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>🎯 {interestsDisplay}</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>⚥ Gender: {targeting.gender === 'all' ? 'All' : targeting.gender === 'male' ? 'Male' : 'Female'}</Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardGreen, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#ecfdf3' 
          }]}>
            <Text style={[styles.summaryCardTitle, { color: isDark ? '#f1f5f9' : '#374151' }]}>Budget & Schedule</Text>
            <Text style={[styles.summaryCardLarge, { color: isDark ? '#f1f5f9' : '#1f2937' }]}>₦{totalCost.toLocaleString()}</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>₦{adSettings.budget || 0}/day × {adSettings.duration} days</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>
              {adSettings.scheduleType === 'immediate' 
                ? 'Starts immediately after approval' 
                : `Starts on ${adSettings.scheduledDateString || 'Not set'} at ${adSettings.scheduledTimeString || 'Not set'}`}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardOrange, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#fff7ed' 
          }]}>
            <Text style={[styles.summaryCardTitle, { color: isDark ? '#f1f5f9' : '#374151' }]}>Performance</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>👁️ ~{estimatedReach.toLocaleString()} reach</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>👆 ~{estimatedClicks.toLocaleString()} clicks</Text>
            <Text style={[styles.summaryCardText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>💰 ~₦{Math.round(estimatedClicks ? totalCost / estimatedClicks : 0)} per click</Text>
          </View>
        </View>

        <View style={[styles.termsContainer, { 
          backgroundColor: isDark ? colors.surfaceSecondary : '#f3f4f6' 
        }]}>
          <TouchableOpacity style={styles.checkbox}>
            <Icon name="check-square" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.termsText, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>
            I agree to Showa's Advertising Terms and confirm that my ad complies with all policies.
            I understand that I'll be charged based on the budget I've set.
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { 
            backgroundColor: isDark ? colors.surfaceSecondary : '#fee2e2' 
          }]}>
            <Icon name="alert-circle" size={20} color={colors.error || '#ef4444'} />
            <Text style={[styles.errorText, { color: colors.error || '#ef4444' }]}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderAdContentStep();
      case 2: return renderAudienceStep();
      case 3: return renderBudgetStep();
      case 4: return renderScheduleStep();
      case 5: return renderReviewStep();
      default: return null;
    }
  };

  const styles = getStyles(isDark, colors);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {showSuccess && <SuccessModal />}

        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={onClose || (() => navigation.goBack())} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Create New Ad</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep} of 5</Text>
          </View>
          {currentStep === 5 && (
            <TouchableOpacity
              style={[styles.launchButton, { backgroundColor: '#fff' }]}
              onPress={handleCreateAd}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.launchButtonText, { color: colors.primary }]}>Launch</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        <StepIndicator />
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderStep()}
        </ScrollView>

        <View style={[styles.footer, { 
          backgroundColor: colors.surface,
          borderTopColor: isDark ? colors.border : '#e5e7eb'
        }]}>
          <TouchableOpacity
            style={[
              styles.footerButton, 
              currentStep === 1 && styles.footerButtonDisabled,
              { 
                borderColor: isDark ? colors.border : '#d1d5db',
                backgroundColor: isDark ? colors.background : '#fff'
              }
            ]}
            onPress={prevStep}
            disabled={currentStep === 1}
          >
            <Text style={[
              styles.footerButtonText, 
              currentStep === 1 && styles.footerButtonTextDisabled,
              { color: currentStep === 1 ? colors.textTertiary : colors.text }
            ]}>
              Back
            </Text>
          </TouchableOpacity>

          {currentStep < 5 ? (
            <TouchableOpacity 
              style={[styles.footerButton, styles.footerButtonPrimary, { backgroundColor: colors.primary }]} 
              onPress={nextStep}
            >
              <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Continue</Text>
              <Icon name="chevron-right" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonSuccess, { backgroundColor: colors.success || '#10b981' }]}
              onPress={handleCreateAd}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Launch Ad Campaign</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Updated getStyles function to accept isDark and colors parameters
const getStyles = (isDark, colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  launchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  launchButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: '#2563eb',
  },
  stepDotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mediaTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaTypeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  mediaTypeButtonActive: {
    borderColor: '#2563eb',
  },
  mediaTypeLabel: {
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  mediaTypeLabelActive: {
    color: '#2563eb',
  },
  mediaTypeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  videoPreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreviewText: {
    marginTop: 8,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  addButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  locationText: {
    fontSize: 14,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  selectedLocationsContainer: {
    marginTop: 8,
    paddingVertical: 4,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    gap: 4,
  },
  locationTagText: {
    fontSize: 11,
  },
  locationModalContent: {
    borderRadius: 24,
    padding: 24,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
    alignSelf: 'center',
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  clearSearchButton: {
    padding: 8,
  },
  selectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  selectionStatsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontWeight: '500',
  },
  clearButton: {},
  clearButtonText: {
    fontWeight: '500',
  },
  statesList: {
    maxHeight: 400,
  },
  statesListContent: {
    paddingBottom: 10,
  },
  stateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  stateItemSelected: {},
  stateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stateIcon: {
    width: 20,
  },
  stateItemText: {
    fontSize: 14,
  },
  stateItemTextSelected: {
    fontWeight: '500',
  },
  checkmarkContainer: {
    padding: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  selectedSummary: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  selectedSummaryText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  doneButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'center',
    minWidth: 120,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  ageRangesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  ageRangeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  ageRangeChipActive: {},
  ageRangeChipText: {
    fontSize: 12,
  },
  ageRangeChipTextActive: {
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderButtonActive: {},
  genderText: {
    fontSize: 14,
  },
  genderTextActive: {
    fontWeight: '600',
  },
  interestsScroll: {
    marginVertical: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestChipActive: {},
  interestChipText: {
    fontSize: 12,
  },
  interestChipTextActive: {
    color: '#fff',
  },
  objectivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  objectiveCard: {
    width: (SCREEN_WIDTH - 72) / 3,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  objectiveCardActive: {},
  objectiveLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  objectiveLabelActive: {},
  objectiveDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  ctaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ctaButton: {
    width: (SCREEN_WIDTH - 56) / 3,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaButtonActive: {},
  ctaText: {
    fontSize: 12,
  },
  ctaTextActive: {
    fontWeight: '600',
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  budgetPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  budgetPreset: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  budgetPresetActive: {},
  budgetPresetText: {
    fontSize: 12,
  },
  budgetPresetTextActive: {
    color: '#fff',
  },
  advancedCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  advancedTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  advancedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  advancedLabel: {
    fontSize: 14,
  },
  rewardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  rewardInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  bidInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  bidInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  scheduleTypeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  scheduleTypeButtonActive: {},
  scheduleTypeLabel: {
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  scheduleTypeLabelActive: {
    color: '#2563eb',
  },
  scheduleTypeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  scheduleInputs: {
    gap: 12,
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  datePickerText: {
    fontSize: 14,
  },
  durationSliderContainer: {
    marginTop: 8,
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  durationButtonActive: {},
  durationButtonText: {
    fontSize: 12,
  },
  durationButtonTextActive: {
    color: '#fff',
  },
  summaryGrid: {
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  summaryCardBlue: {},
  summaryCardPurple: {},
  summaryCardGreen: {},
  summaryCardOrange: {},
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryCardText: {
    fontSize: 12,
    marginBottom: 2,
  },
  summaryCardSubtext: {
    fontSize: 11,
    marginTop: 2,
  },
  summaryCardLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  summaryTag: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonPrimary: {
    borderColor: '#2563eb',
    flexDirection: 'row',
    gap: 4,
  },
  footerButtonSuccess: {
    borderColor: '#10b981',
    flexDirection: 'row',
    gap: 4,
  },
  footerButtonText: {
    fontSize: 14,
  },
  footerButtonTextDisabled: {
    color: '#9ca3af',
  },
  footerButtonTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '80%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalInfoText: {
    fontSize: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
