



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
// import { useTheme } from '../src/context/ThemeContext';

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
//   const { colors, isDark } = useTheme();
  
//   // State management
//   const [content, setContent] = useState('');
//   const [selectedHashtag, setSelectedHashtag] = useState('');
//   const [images, setImages] = useState([]); 
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userfullname, setFullname] = useState('');
//   const [userprofileimage, setUserProfileImage] = useState('');
//   const [emojiModalVisible, setEmojiModalVisible] = useState(false);
//   const [hashtagModalVisible, setHashtagModalVisible] = useState(false);

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

//   const selectImages = async () => {
//     const options = {
//       mediaType: 'photo',
//       selectionLimit: 4, // Allow up to 4 images
//       includeBase64: false,
//     };

//     ImagePicker.launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//         Alert.alert('Error', 'Failed to select images');
//       } else if (response.assets) {
//         const selectedImages = response.assets.map(asset => ({
//           uri: asset.uri,
//           name: asset.fileName || `image_${Date.now()}.jpg`,
//           type: asset.type || 'image/jpeg',
//         }));

//         // Check if adding these would exceed 4 images
//         if (images.length + selectedImages.length > 4) {
//           Alert.alert('Limit Reached', 'You can only upload up to 4 images');
//           return;
//         }

//         setImages([...images, ...selectedImages]);
//       }
//     });
//   };

//   const removeImage = (index) => {
//     setImages(images.filter((_, i) => i !== index));
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
      
//       // Append multiple images
//       if (images.length > 0) {
//         images.forEach((image, index) => {
//           formData.append('images', {
//             uri: image.uri,
//             name: image.name,
//             type: image.type,
//           });
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
      
//       // Reset state
//       setContent('');
//       setSelectedHashtag('');
//       setImages([]);
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

//   const renderHashtagItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.hashtagItem, { borderBottomColor: colors.border }]}
//       onPress={() => selectHashtag(item)}
//     >
//       <Text style={[styles.hashtagText, { color: colors.text }]}>#{item.label}</Text>
//     </TouchableOpacity>
//   );

//   // Render image grid
//   const renderImageGrid = () => {
//     if (images.length === 0) return null;

//     const getGridStyle = () => {
//       switch (images.length) {
//         case 1:
//           return styles.singleImageContainer;
//         case 2:
//           return styles.doubleImageContainer;
//         case 3:
//           return styles.tripleImageContainer;
//         case 4:
//           return styles.quadImageContainer;
//         default:
//           return styles.singleImageContainer;
//       }
//     };

//     return (
//       <View style={[styles.imageGridContainer, { 
//         backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
//         borderColor: colors.border 
//       }]}>
//         <View style={getGridStyle()}>
//           {images.map((image, index) => (
//             <View key={index} style={styles.gridImageWrapper}>
//               <Image 
//                 source={{ uri: image.uri }} 
//                 style={styles.gridImage} 
//                 resizeMode="cover"
//               />
//               <TouchableOpacity
//                 style={styles.removeImageButton}
//                 onPress={() => removeImage(index)}
//               >
//                 <Icon name="close-circle" size={24} color="white" />
//               </TouchableOpacity>
              
//               {/* Show image counter on first image */}
//               {index === 0 && images.length > 1 && (
//                 <View style={styles.imageCounter}>
//                   <Text style={styles.imageCounterText}>+{images.length - 1}</Text>
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="#0d64dd" 
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[styles.container, { backgroundColor: colors.background }]}
//       >
//         {/* Header with gradient */}
//         <LinearGradient
//           colors={['#0d64dd', '#1a73e8']}
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
          
//           <Text style={styles.headerTitle}>New Post</Text>
          
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

//           {/* Image Grid Preview */}
//           {renderImageGrid()}

//           {/* Selected Hashtag */}
//           {selectedHashtag && (
//             <View style={[styles.selectedHashtagContainer, { backgroundColor: '#0d64dd' }]}>
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
//               onPress={selectImages}
//             >
//               <Icon name="images" size={20} color="#0d64dd" />
//               <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>
//                 {images.length > 0 ? `${images.length}/4 Photos` : 'Photos'}
//               </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setHashtagModalVisible(true)}
//             >
//               <Icon name="pricetag" size={20} color="#0d64dd" />
//               <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Hashtag</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setEmojiModalVisible(true)}
//             >
//               <Icon name="happy" size={20} color="#0d64dd" />
//               <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Emoji</Text>
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
//                   placeholder="Search emoji..."
//                   searchStyle={{
//                     backgroundColor: colors.backgroundSecondary,
//                     color: colors.text,
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

// // Add these new styles
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
//   // New image grid styles
//   imageGridContainer: {
//     margin: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     padding: 4,
//   },
//   singleImageContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     aspectRatio: 1,
//   },
//   doubleImageContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     aspectRatio: 2,
//   },
//   tripleImageContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     aspectRatio: 1.5,
//   },
//   quadImageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     width: '100%',
//     aspectRatio: 1,
//   },
//   gridImageWrapper: {
//     position: 'relative',
//     flex: 1,
//     minWidth: '50%',
//     minHeight: '50%',
//     padding: 2,
//   },
//   gridImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 12,
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     padding: 2,
//     zIndex: 10,
//   },
//   imageCounter: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -15 }, { translateY: -15 }],
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 20,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 5,
//   },
//   imageCounterText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
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
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');

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

// AI Post Inspiration Ideas
const POST_INSPIRATIONS = [
  {
    id: '1',
    title: ' Weekend Vibes',
    content: 'Just enjoying this beautiful weekend! Sometimes the best moments are the simplest ones. What are you all up to? #WeekendMode #GoodVibes',
    category: 'lifestyle',
    icon: 'sunny',
  },
  {
    id: '2',
    title: 'Motivational Monday',
    content: 'Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward everyone! 🌟 #Motivation #Success',
    category: 'motivation',
    icon: 'bulb',
  },
  {
    id: '3',
    title: 'Photo Dump',
    content: 'Some moments from the past week 📸 Swipe to see! Which one is your favorite?',
    category: 'photo',
    icon: 'camera',
  },
  {
    id: '4',
    title: 'Question Time',
    content: 'Question of the day: What\'s one thing you wish you knew 5 years ago? Drop your answers below! 👇',
    category: 'interaction',
    icon: 'chatbubbles',
  },
  {
    id: '5',
    title: ' Music Monday',
    content: 'Starting the week with this amazing track! What\'s everyone listening to today? Share your playlist! 🎧 #MusicMonday',
    category: 'entertainment',
    icon: 'musical-notes',
  },
  {
    id: '6',
    title: 'Achievement Unlocked',
    content: 'Proud moment! Finally achieved a goal I\'ve been working towards. Hard work really does pay off!',
    category: 'personal',
    icon: 'trophy',
  },
  {
    id: '7',
    title: 'Foodie Post',
    content: 'Made this amazing dish today! Recipe in the comments if anyone wants it. 🍽️ #Foodie #Cooking',
    category: 'food',
    icon: 'restaurant',
  },
  {
    id: '8',
    title: 'Travel Throwback',
    content: 'Missing these views! Best travel memory so far. Where should I go next?  #Travel #Wanderlust',
    category: 'travel',
    icon: 'airplane',
  },
  {
    id: '9',
    title: 'Fitness Journey',
    content: 'Day 30 of my fitness journey! Feeling stronger every day. Remember, consistency is key!  #Fitness #Health',
    category: 'fitness',
    icon: 'fitness',
  },
  {
    id: '10',
    title: ' Learning New Things',
    content: 'Just finished an amazing book! Knowledge is the only thing that grows when shared. What are you reading?  #Learning #Books',
    category: 'education',
    icon: 'book',
  },
  {
    id: '11',
    title: 'Work Wins',
    content: 'Celebrating small wins today! Got a project done ahead of schedule. Hard work pays off!  #Work #Success',
    category: 'business',
    icon: 'briefcase',
  },
  {
    id: '12',
    title: 'Gratitude Post',
    content: 'Grateful for another beautiful day, amazing friends, and endless opportunities. What are you grateful for today?  #Gratitude',
    category: 'mindfulness',
    icon: 'heart',
  },
];

export default function CreatePost({ navigation }) {
  const { colors, isDark } = useTheme();
  
  // State management
  const [content, setContent] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userfullname, setFullname] = useState('');
  const [userprofileimage, setUserProfileImage] = useState('');
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [hashtagModalVisible, setHashtagModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'lifestyle', label: 'Life', icon: 'sunny' },
    { id: 'motivation', label: 'Motivation', icon: 'bulb' },
    { id: 'business', label: 'Work', icon: 'briefcase' },
    { id: 'travel', label: 'Travel', icon: 'airplane' },
    { id: 'food', label: 'Food', icon: 'restaurant' },
    { id: 'fitness', label: 'Fitness', icon: 'fitness' },
    { id: 'entertainment', label: 'Fun', icon: 'tv' },
  ];

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
      }
    };

    fetchUserData();
  }, []);

  // Filter inspirations based on category
  const getFilteredInspirations = () => {
    if (selectedCategory === 'all') {
      return POST_INSPIRATIONS;
    }
    return POST_INSPIRATIONS.filter(item => item.category === selectedCategory);
  };

  const selectImages = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 4,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to select images');
      } else if (response.assets) {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        }));

        if (images.length + selectedImages.length > 4) {
          Alert.alert('Limit Reached', 'You can only upload up to 4 images');
          return;
        }

        setImages([...images, ...selectedImages]);
      }
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
      
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          });
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
      
      // Reset state
      setContent('');
      setSelectedHashtag('');
      setImages([]);
    } catch (error) {
      console.error('Post error:', error);
      Alert.alert('Error', 'Could not create post');
    } finally {
      setLoading(false);
    }
  };

  // AI Functions
  const openAIAssistant = () => {
    setAiModalVisible(true);
  };

  const closeAIAssistant = () => {
    setAiModalVisible(false);
    setAiPrompt('');
    setSelectedCategory('all');
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert('Required', 'Please describe what you want to post about');
      return;
    }

    setAiLoading(true);
    Keyboard.dismiss();

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      // Use your existing AI chat endpoint
      const response = await axios.post(
        `${API_ROUTE}/gemini/chat/`,
        {
          message: `Create a social media post about: ${aiPrompt}. Make it engaging and include relevant emojis. Keep it under 280 characters.`,
          temperature: 0.7,
          max_tokens: 2048
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 30000
        }
      );

      if (response.data.status === 'success') {
        setContent(response.data.response);
        closeAIAssistant();
      } else {
        throw new Error('Failed to generate post');
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      
      // Fallback: Use local inspiration if API fails
      const randomIndex = Math.floor(Math.random() * POST_INSPIRATIONS.length);
      setContent(POST_INSPIRATIONS[randomIndex].content);
      closeAIAssistant();
      
      Alert.alert('✨ Inspiration Found!', 'Used local inspiration (API unavailable)');
    } finally {
      setAiLoading(false);
    }
  };

  const useInspiration = (inspirationContent) => {
    setContent(inspirationContent);
    closeAIAssistant();
  };

  const selectHashtag = (hashtag) => {
    setSelectedHashtag(hashtag.value);
    setContent(content ? `${content} #${hashtag.label}` : `#${hashtag.label}`);
    setHashtagModalVisible(false);
  };

  const renderHashtagItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.hashtagItem, { borderBottomColor: colors.border }]}
      onPress={() => selectHashtag(item)}
    >
      <Text style={[styles.hashtagText, { color: colors.text }]}>#{item.label}</Text>
    </TouchableOpacity>
  );

  const renderInspirationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.inspirationCard, { backgroundColor: colors.backgroundSecondary }]}
      onPress={() => useInspiration(item.content)}
      activeOpacity={0.7}
    >
      <View style={styles.inspirationHeader}>
        <View style={styles.inspirationTitleContainer}>
          <Icon name={item.icon} size={20} color="#0d64dd" />
          <Text style={[styles.inspirationTitle, { color: colors.text }]}>
            {item.title}
          </Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: '#0d64dd20' }]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <Text style={[styles.inspirationContent, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.inspirationFooter}>
        <Text style={styles.useThisText}>Tap to use this idea</Text>
        <Icon name="add-circle" size={20} color="#0d64dd" />
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
        { backgroundColor: colors.backgroundSecondary }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={16} 
        color={selectedCategory === item.id ? '#FFFFFF' : colors.textSecondary} 
      />
      <Text style={[
        styles.categoryChipText,
        { color: selectedCategory === item.id ? '#FFFFFF' : colors.textSecondary }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderImageGrid = () => {
    if (images.length === 0) return null;

    const getGridStyle = () => {
      switch (images.length) {
        case 1:
          return styles.singleImageContainer;
        case 2:
          return styles.doubleImageContainer;
        case 3:
          return styles.tripleImageContainer;
        case 4:
          return styles.quadImageContainer;
        default:
          return styles.singleImageContainer;
      }
    };

    return (
      <View style={[styles.imageGridContainer, { 
        backgroundColor: isDark ? colors.backgroundSecondary : colors.background,
        borderColor: colors.border 
      }]}>
        <View style={getGridStyle()}>
          {images.map((image, index) => (
            <View key={index} style={styles.gridImageWrapper}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.gridImage} 
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0d64dd" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={['#0d64dd', '#1a73e8']}
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

          {/* Image Grid Preview */}
          {renderImageGrid()}

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
              onPress={selectImages}
            >
              <Icon name="images" size={20} color="#0d64dd" />
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>
                {images.length > 0 ? `${images.length}/4` : 'Photos'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setHashtagModalVisible(true)}
            >
              <Icon name="pricetag" size={20} color="#0d64dd" />
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Hashtag</Text>
            </TouchableOpacity>
            
            {/* AI Button - Replaces Emoji Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.aiButton]}
              onPress={openAIAssistant}
            >
              <LinearGradient
                colors={['#0d64dd', '#8B5CF6']}
                style={styles.aiButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="sparkles" size={20} color="white" />
              </LinearGradient>
              <Text style={[styles.actionButtonText, { color: '#0d64dd' }]}>Showa AI</Text>
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
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
          />
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

        {/* AI Assistant Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={aiModalVisible}
          onRequestClose={closeAIAssistant}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
          />
          <View style={styles.aiModalOverlay}>
            <View style={[styles.aiModalContainer, { backgroundColor: colors.background }]}>
              {/* Header */}
              <View style={styles.aiModalHeader}>
                <View>
                  <Text style={[styles.aiModalTitle, { color: colors.text }]}>
                    AI Post Assistant 
                  </Text>
                  <Text style={[styles.aiModalSubtitle, { color: colors.textSecondary }]}>
                    Describe what you want to post or get inspired
                  </Text>
                </View>
                <TouchableOpacity onPress={closeAIAssistant}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* AI Input Section */}
                <View style={[styles.aiInputSection, { backgroundColor: colors.backgroundSecondary }]}>
                  <TextInput
                    style={[styles.aiInput, { color: colors.text }]}
                    placeholder="e.g., a motivational post about success, my weekend trip, new recipe..."
                    placeholderTextColor={colors.textSecondary}
                    value={aiPrompt}
                    onChangeText={setAiPrompt}
                    multiline
                    numberOfLines={3}
                  />
                  
                  <TouchableOpacity
                    style={[
                      styles.generateButton,
                      (!aiPrompt.trim() || aiLoading) && styles.generateButtonDisabled
                    ]}
                    onPress={generateWithAI}
                    disabled={!aiPrompt.trim() || aiLoading}
                  >
                    <LinearGradient
                      colors={aiPrompt.trim() && !aiLoading ? ['#0d64dd', '#0d64dd'] : ['#2D2D32', '#1F1F23']}
                      style={styles.generateButtonGradient}
                    >
                      {aiLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <>
                         
                          <Text style={[styles.generateButtonText,{padding:0, marginBottom:25}]}>Generate with AI</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or get inspired</Text>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                </View>

                {/* Category Filter */}
                <FlatList
                  horizontal
                  data={categories}
                  renderItem={renderCategoryChip}
                  keyExtractor={item => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                  style={styles.categoryFlatList}
                />

                {/* Inspirations Grid */}
                <View style={styles.inspirationsGrid}>
                  {getFilteredInspirations().map((item) => (
                    <View key={item.id} style={styles.inspirationItem}>
                      {renderInspirationItem({ item })}
                    </View>
                  ))}
                </View>
              </ScrollView>
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
  imageGridContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 4,
  },
  singleImageContainer: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 1,
  },
  doubleImageContainer: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 2,
  },
  tripleImageContainer: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 1.5,
  },
  quadImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
  },
  gridImageWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '50%',
    minHeight: '50%',
    padding: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
    zIndex: 10,
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
    gap: 6,
  },
  actionButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  aiButton: {
    backgroundColor: 'transparent',
  },
  aiButtonGradient: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 16,
    width: width - 40,
    maxHeight: '60%',
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
  // AI Modal Styles
  aiModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  aiModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
    padding: 20,
  },
  aiModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  aiModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiModalSubtitle: {
    fontSize: 14,
  },
  aiInputSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  aiInput: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryFlatList: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#0d64dd',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inspirationsGrid: {
    gap: 12,
    paddingBottom: 20,
  },
  inspirationItem: {
    marginBottom: 8,
  },
  inspirationCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inspirationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspirationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#0d64dd',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  inspirationContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  inspirationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  useThisText: {
    fontSize: 12,
    color: '#0d64dd',
    fontWeight: '500',
  },
});