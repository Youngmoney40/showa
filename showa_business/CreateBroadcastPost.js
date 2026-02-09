

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'react-native-image-picker';
// import EmojiSelector from 'react-native-emoji-selector';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../src/context/ThemeContext'; // Add theme context

// const { width } = Dimensions.get('window');

// const HASHTAG_CHOICES = [
//   { value: 'TRENDING', label: 'Trending' },
//   { value: 'VIRAL', label: 'Viral' },
//   { value: 'CHALLENGES', label: 'Challenges' },
//   { value: 'MEMES', label: 'Memes' },
//   { value: 'INSPIRATION', label: 'Inspiration' },
//   { value: 'LIFESTYLE', label: 'Lifestyle' },
//   { value: 'FASHION', label: 'Fashion' },
//   { value: 'BEAUTY', label: 'Beauty' },
//   { value: 'TRAVEL', label: 'Travel' },
//   { value: 'FOOD', label: 'Food' },
//   { value: 'TECH', label: 'Tech' },
//   { value: 'ENTERTAINMENT', label: 'Entertainment' },
//   { value: 'FUNNY', label: 'Funny' },
//   { value: 'MUSIC', label: 'Music' },
//   { value: 'ART', label: 'Art' },
// ];

// export default function CreatePost({ navigation }) {
//   const { colors, isDark } = useTheme(); // Get theme colors
  
//   // State management
//   const [content, setContent] = useState('');
//   const [selectedHashtag, setSelectedHashtag] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userfullname, setFullname] = useState('');
//   const [userprofileimage, setUserProfileImage] = useState('');
//   const [emojiModalVisible, setEmojiModalVisible] = useState(false);
//   const [pollModalVisible, setPollModalVisible] = useState(false);
//   const [hashtagModalVisible, setHashtagModalVisible] = useState(false);
//   const [pollOption1, setPollOption1] = useState('');
//   const [pollOption2, setPollOption2] = useState('');

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const json = await AsyncStorage.getItem('userData');
//         const parsed = json ? JSON.parse(json) : null;

//         let userID = parsed?.id;
//         if (!token || !userID) return;

//         const response = await axios.get(`${API_ROUTE}/user/${userID}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.status === 200) {
//           setFullname(response.data.name);
//           setUsername(response.data.name);
//           setUserProfileImage(`${API_ROUTE_IMAGE}${response.data.profile_picture}`);
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//         Alert.alert('Error', 'Failed to load user data');
//       }
//     };

//     fetchUserData();
//   }, []);

//   const selectImage = async () => {
//     ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.assets?.[0]) {
//         const asset = response.assets[0];
//         setImage({
//           uri: asset.uri,
//           name: asset.fileName,
//           type: asset.type,
//         });
//       }
//     });
//   };

//   const handlePost = async () => {
//     if (!content.trim()) {
//       Alert.alert('Required', 'Please enter some content');
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         Alert.alert('Authentication Required', 'Please log in');
//         return;
//       }
      
//       const formData = new FormData();
//       formData.append('content', content);
//       if (selectedHashtag) formData.append('hashtags', selectedHashtag);
//       formData.append('user_profile_picture', userprofileimage);
      
//       if (image) {
//         formData.append('image', {
//           uri: image.uri,
//           name: image.name,
//           type: image.type,
//         });
//       }

//       await axios.post(`${API_ROUTE}/create-posts/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       Alert.alert('Success', 'Your post was published!');
//       navigation.navigate('BroadcastHome');
//       setContent('');
//       setSelectedHashtag('');
//       setImage(null);
//     } catch (error) {
//       console.error('Post error:', error);
//       Alert.alert('Error', 'Could not create post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectHashtag = (hashtag) => {
//     setSelectedHashtag(hashtag.value);
//     setContent(content ? `${content} #${hashtag.label}` : `#${hashtag.label}`);
//     setHashtagModalVisible(false);
//   };

//   const handlePollSubmit = () => {
//     if (!pollOption1.trim() || !pollOption2.trim()) {
//       Alert.alert('Required', 'Please enter both options');
//       return;
//     }
//     const pollText = `Poll: ${pollOption1} vs ${pollOption2}`;
//     setContent(content ? `${content}\n${pollText}` : pollText);
//     setPollOption1('');
//     setPollOption2('');
//     setPollModalVisible(false);
//   };

//   const renderHashtagItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.hashtagItem, { 
//         borderBottomColor: colors.border 
//       }]}
//       onPress={() => selectHashtag(item)}
//     >
//       <Text style={[styles.hashtagText, { color: colors.text }]}>#{item.label}</Text>
//     </TouchableOpacity>
//   );

//   // Get gradient colors based on theme
//   const getGradientColors = () => {
//     return isDark ? ['#0d64dd', '#0d64dd'] : ['#0d64dd', '#1a73e8'];
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
//       <StatusBar 
//         barStyle={isDark ? "light-content" : "dark-content"} 
//         backgroundColor={isDark ? '#0d64dd' : '#0d64dd'} 
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[styles.container, { backgroundColor: colors.background }]}
//       >
//         {/* Header with gradient */}
//         <LinearGradient
//           colors={getGradientColors()}
//           style={styles.header}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="close" size={24} color="white" />
//           </TouchableOpacity>
          
//           <Text style={styles.headerTitle}>Create New Post</Text>
          
//           <TouchableOpacity
//             style={[styles.postButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
//             onPress={handlePost}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="white" size="small" />
//             ) : (
//               <Text style={styles.postButtonText}>Publish</Text>
//             )}
//           </TouchableOpacity>
//         </LinearGradient>

//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Author Section */}
//           <View style={[styles.authorContainer, { 
//             backgroundColor: colors.card,
//             borderBottomColor: colors.border 
//           }]}>
//             <Image 
//               source={userprofileimage ? { uri: userprofileimage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
//               style={[styles.avatar, { borderColor: colors.border }]}
//             />
//             <View style={styles.authorInfo}>
//               <Text style={[styles.authorName, { color: colors.text }]}>
//                 {userfullname || 'User'}
//               </Text>
//               <Text style={[styles.authorUsername, { color: colors.textSecondary }]}>
//                 @{username || 'username'}
//               </Text>
//             </View>
//           </View>

//           {/* Content Input */}
//           <TextInput
//             placeholder="Share your thoughts..."
//             placeholderTextColor={colors.textSecondary}
//             style={[styles.contentInput, { 
//               backgroundColor: colors.card,
//               color: colors.text
//             }]}
//             value={content}
//             onChangeText={setContent}
//             multiline
//             maxLength={280}
//             autoFocus
//           />
          
//           <Text style={[styles.charCount, { color: colors.textSecondary }]}>
//             {content.length}/280
//           </Text>

//           {/* Image Preview */}
//           {image && (
//             <View style={[styles.imagePreviewContainer, { 
//               backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
//               borderColor: colors.border 
//             }]}>
//               <Image 
//                 source={{ uri: image.uri }} 
//                 style={styles.previewImage} 
//                 resizeMode="cover"
//               />
//               <TouchableOpacity
//                 style={styles.removeImageButton}
//                 onPress={() => setImage(null)}
//               >
//                 <Icon name="close-circle" size={24} color="white" />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Selected Hashtag */}
//           {selectedHashtag && (
//             <View style={[styles.selectedHashtagContainer, { backgroundColor: colors.primary }]}>
//               <Text style={styles.selectedHashtag}>
//                 #{HASHTAG_CHOICES.find(h => h.value === selectedHashtag)?.label}
//               </Text>
//               <TouchableOpacity onPress={() => setSelectedHashtag('')}>
//                 <Icon name="close" size={16} color="white" />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Action Buttons */}
//           <View style={[styles.actionButtons, { 
//             backgroundColor: colors.card,
//             borderTopColor: colors.border 
//           }]}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={selectImage}
//             >
//               <Icon name="image" size={20} color={colors.primary} />
//               <Text style={[styles.actionButtonText, { color: colors.primary }]}>Photo</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setHashtagModalVisible(true)}
//             >
//               <Icon name="pricetag" size={20} color={colors.primary} />
//               <Text style={[styles.actionButtonText, { color: colors.primary }]}>Hashtag</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setEmojiModalVisible(true)}
//             >
//               <Icon name="happy" size={20} color={colors.primary} />
//               <Text style={[styles.actionButtonText, { color: colors.primary }]}>Emoji</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* Hashtag Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={hashtagModalVisible}
//           onRequestClose={() => setHashtagModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
//               <View style={styles.modalHeader}>
//                 <Text style={[styles.modalTitle, { color: colors.text }]}>Select Hashtag</Text>
//                 <TouchableOpacity onPress={() => setHashtagModalVisible(false)}>
//                   <Icon name="close" size={24} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={HASHTAG_CHOICES}
//                 renderItem={renderHashtagItem}
//                 keyExtractor={(item) => item.value}
//                 contentContainerStyle={styles.hashtagList}
//                 showsVerticalScrollIndicator={false}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Poll Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={pollModalVisible}
//           onRequestClose={() => setPollModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
//               <View style={styles.modalHeader}>
//                 <Text style={[styles.modalTitle, { color: colors.text }]}>Create Poll</Text>
//                 <TouchableOpacity onPress={() => setPollModalVisible(false)}>
//                   <Icon name="close" size={24} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
              
//               <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
//                 Enter two options for your poll
//               </Text>
              
//               <TextInput
//                 placeholder="First option"
//                 placeholderTextColor={colors.textSecondary}
//                 style={[styles.modalInput, { 
//                   backgroundColor: colors.backgroundSecondary,
//                   borderColor: colors.border,
//                   color: colors.text
//                 }]}
//                 value={pollOption1}
//                 onChangeText={setPollOption1}
//               />
              
//               <TextInput
//                 placeholder="Second option"
//                 placeholderTextColor={colors.textSecondary}
//                 style={[styles.modalInput, { 
//                   backgroundColor: colors.backgroundSecondary,
//                   borderColor: colors.border,
//                   color: colors.text
//                 }]}
//                 value={pollOption2}
//                 onChangeText={setPollOption2}
//               />
              
//               <TouchableOpacity
//                 style={[styles.modalSubmitButton, { backgroundColor: colors.primary }]}
//                 onPress={handlePollSubmit}
//               >
//                 <Text style={styles.modalSubmitButtonText}>Add Poll</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Emoji Modal */}
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={emojiModalVisible}
//           onRequestClose={() => setEmojiModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={[styles.emojiModalContainer, { backgroundColor: colors.card }]}>
//               <View style={styles.modalHeader}>
//                 <Text style={[styles.modalTitle, { color: colors.text }]}>Select Emoji</Text>
//                 <TouchableOpacity onPress={() => setEmojiModalVisible(false)}>
//                   <Icon name="close" size={24} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <EmojiSelector
//                   onEmojiSelected={(emoji) => {
//                     setContent(content + emoji);
//                     setEmojiModalVisible(false);
//                   }}
//                   showSearchBar={true}
//                   showTabs={true}
//                   columns={8}
//                   categoryEmojiSize={24}
//                   emojiSize={24}
//                   // Custom theme for EmojiSelector
//                   theme={isDark ? 'dark' : 'light'}
//                   placeholder="Search emoji..."
//                   searchStyle={{
//                     backgroundColor: colors.backgroundSecondary,
//                     color: colors.text,
//                     placeholderTextColor: colors.textSecondary,
//                   }}
//                 />
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     paddingBottom: 100,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: Platform.OS === 'ios' ? 0 : 16,
//     paddingBottom: 16,
//     width: '100%',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: 'white',
//     marginTop: 20,
//     marginBottom: 20
//   },
//   backButton: {
//     padding: 8,
//     marginTop: 20,
//     marginBottom: 20,
//     marginLeft: 20,
//   },
//   postButton: {
//     marginRight: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   postButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   authorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//     borderWidth: 1,
//   },
//   authorInfo: {
//     flex: 1,
//   },
//   authorName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   authorUsername: {
//     fontSize: 14,
//     marginTop: 2,
//   },
//   contentInput: {
//     minHeight: 150,
//     fontSize: 16,
//     padding: 16,
//     lineHeight: 24,
//   },
//   charCount: {
//     textAlign: 'right',
//     paddingRight: 16,
//     fontSize: 12,
//     marginTop: 8,
//   },
//   imagePreviewContainer: {
//     margin: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     position: 'relative',
//     borderWidth: 1,
//   },
//   previewImage: {
//     width: '100%',
//     height: 200,
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     padding: 4,
//   },
//   selectedHashtagContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     alignSelf: 'flex-start',
//   },
//   selectedHashtag: {
//     color: 'white',
//     fontWeight: '600',
//     marginRight: 8,
//     fontSize: 14,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 16,
//     borderTopWidth: 1,
//     marginTop: 16,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   actionButtonText: {
//     marginLeft: 8,
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     borderRadius: 16,
//     width: width - 40,
//     maxHeight: '60%',
//     padding: 16,
//   },
//   emojiModalContainer: {
//     borderRadius: 16,
//     width: width - 40,
//     height: '80%',
//     padding: 16,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     marginBottom: 16,
//   },
//   hashtagList: {
//     paddingBottom: 16,
//   },
//   hashtagItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   hashtagText: {
//     fontSize: 16,
//   },
//   modalInput: {
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//   },
//   modalSubmitButton: {
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   modalSubmitButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext'; // Add theme context

const { width } = Dimensions.get('window');

const HASHTAG_CHOICES = [
  { value: 'TRENDING', label: 'Trending' },
  { value: 'VIRAL', label: 'Viral' },
  { value: 'CHALLENGES', label: 'Challenges' },
  { value: 'MEMES', label: 'Memes' },
  { value: 'INSPIRATION', label: 'Inspiration' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'FOOD', label: 'Food' },
  { value: 'TECH', label: 'Tech' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'FUNNY', label: 'Funny' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'ART', label: 'Art' },
];

export default function CreatePost({ navigation }) {
  const { colors, isDark } = useTheme(); // Get theme colors
  
  // State management
  const [content, setContent] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userfullname, setFullname] = useState('');
  const [userprofileimage, setUserProfileImage] = useState('');
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [pollModalVisible, setPollModalVisible] = useState(false);
  const [hashtagModalVisible, setHashtagModalVisible] = useState(false);
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const json = await AsyncStorage.getItem('userData');
        const parsed = json ? JSON.parse(json) : null;

        let userID = parsed?.id;
        if (!token || !userID) return;

        const response = await axios.get(`${API_ROUTE}/user/${userID}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setFullname(response.data.name);
          setUsername(response.data.name);
          setUserProfileImage(`${API_ROUTE_IMAGE}${response.data.profile_picture}`);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const selectImage = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]) {
        const asset = response.assets[0];
        setImage({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        });
      }
    });
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Required', 'Please enter some content');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in');
        return;
      }
      
      const formData = new FormData();
      formData.append('content', content);
      if (selectedHashtag) formData.append('hashtags', selectedHashtag);
      formData.append('user_profile_picture', userprofileimage);
      
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      }

      await axios.post(`${API_ROUTE}/create-posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Your post was published!');
      navigation.navigate('BroadcastHome');
      setContent('');
      setSelectedHashtag('');
      setImage(null);
    } catch (error) {
      console.error('Post error:', error);
      Alert.alert('Error', 'Could not create post');
    } finally {
      setLoading(false);
    }
  };

  const selectHashtag = (hashtag) => {
    setSelectedHashtag(hashtag.value);
    setContent(content ? `${content} #${hashtag.label}` : `#${hashtag.label}`);
    setHashtagModalVisible(false);
  };

  const handlePollSubmit = () => {
    if (!pollOption1.trim() || !pollOption2.trim()) {
      Alert.alert('Required', 'Please enter both options');
      return;
    }
    const pollText = `Poll: ${pollOption1} vs ${pollOption2}`;
    setContent(content ? `${content}\n${pollText}` : pollText);
    setPollOption1('');
    setPollOption2('');
    setPollModalVisible(false);
  };

  const renderHashtagItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.hashtagItem, { 
        borderBottomColor: colors.border 
      }]}
      onPress={() => selectHashtag(item)}
    >
      <Text style={[styles.hashtagText, { color: colors.text }]}>#{item.label}</Text>
    </TouchableOpacity>
  );

  // Get gradient colors - keeping blue for both themes
  const getGradientColors = () => {
    return isDark ? ['#0d64dd', '#1a73e8'] : ['#0d64dd', '#1a73e8']; // Same blue gradient for both
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle="light-content" // Always light content since we keep blue background
        backgroundColor="#0d64dd" // Fixed blue background
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header with gradient - keeping blue for both themes */}
        <LinearGradient
          colors={getGradientColors()}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>New Post</Text>
          
          <TouchableOpacity
            style={[styles.postButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Publish</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Author Section */}
          <View style={[styles.authorContainer, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border 
          }]}>
            <Image 
              source={userprofileimage ? { uri: userprofileimage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
              style={[styles.avatar, { borderColor: colors.border }]}
            />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>
                {userfullname || 'User'}
              </Text>
              <Text style={[styles.authorUsername, { color: colors.textSecondary }]}>
                @{username || 'username'}
              </Text>
            </View>
          </View>

          {/* Content Input */}
          <TextInput
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.contentInput, { 
              backgroundColor: colors.card,
              color: colors.text
            }]}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={280}
            autoFocus
          />
          
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {content.length}/280
          </Text>

          {/* Image Preview */}
          {image && (
            <View style={[styles.imagePreviewContainer, { 
              backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
              borderColor: colors.border 
            }]}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Icon name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Selected Hashtag */}
          {selectedHashtag && (
            <View style={[styles.selectedHashtagContainer, { backgroundColor: '#0d64dd' }]}>
              <Text style={styles.selectedHashtag}>
                #{HASHTAG_CHOICES.find(h => h.value === selectedHashtag)?.label}
              </Text>
              <TouchableOpacity onPress={() => setSelectedHashtag('')}>
                <Icon name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={[styles.actionButtons, { 
            backgroundColor: colors.card,
            borderTopColor: colors.border 
          }]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={selectImage}
            >
              <Icon name="image" size={20} color="#0d64dd" />
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setHashtagModalVisible(true)}
            >
              <Icon name="pricetag" size={20} color="#0d64dd" />
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Hashtag</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setEmojiModalVisible(true)}
            >
              <Icon name="happy" size={20} color="#0d64dd" />
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Emoji</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Hashtag Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={hashtagModalVisible}
          onRequestClose={() => setHashtagModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Hashtag</Text>
                <TouchableOpacity onPress={() => setHashtagModalVisible(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={HASHTAG_CHOICES}
                renderItem={renderHashtagItem}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.hashtagList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

        {/* Poll Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={pollModalVisible}
          onRequestClose={() => setPollModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Create Poll</Text>
                <TouchableOpacity onPress={() => setPollModalVisible(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Enter two options for your poll
              </Text>
              
              <TextInput
                placeholder="First option"
                placeholderTextColor={colors.textSecondary}
                style={[styles.modalInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={pollOption1}
                onChangeText={setPollOption1}
              />
              
              <TextInput
                placeholder="Second option"
                placeholderTextColor={colors.textSecondary}
                style={[styles.modalInput, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={pollOption2}
                onChangeText={setPollOption2}
              />
              
              <TouchableOpacity
                style={[styles.modalSubmitButton, { backgroundColor: '#0d64dd' }]}
                onPress={handlePollSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>Add Poll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Emoji Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={emojiModalVisible}
          onRequestClose={() => setEmojiModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.emojiModalContainer, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Emoji</Text>
                <TouchableOpacity onPress={() => setEmojiModalVisible(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <EmojiSelector
                  onEmojiSelected={(emoji) => {
                    setContent(content + emoji);
                    setEmojiModalVisible(false);
                  }}
                  showSearchBar={true}
                  showTabs={true}
                  columns={8}
                  categoryEmojiSize={24}
                  emojiSize={24}
                  // Custom theme for EmojiSelector
                  theme={isDark ? 'dark' : 'light'}
                  placeholder="Search emoji..."
                  searchStyle={{
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.text,
                    placeholderTextColor: colors.textSecondary,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 20
  },
  backButton: {
    padding: 8,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  postButton: {
    marginRight: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  contentInput: {
    minHeight: 150,
    fontSize: 16,
    padding: 16,
    lineHeight: 24,
  },
  charCount: {
    textAlign: 'right',
    paddingRight: 16,
    fontSize: 12,
    marginTop: 8,
  },
  imagePreviewContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  selectedHashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  selectedHashtag: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 16,
    width: width - 40,
    maxHeight: '60%',
    padding: 16,
  },
  emojiModalContainer: {
    borderRadius: 16,
    width: width - 40,
    height: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  hashtagList: {
    paddingBottom: 16,
  },
  hashtagItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  hashtagText: {
    fontSize: 16,
  },
  modalInput: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  modalSubmitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  modalSubmitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});