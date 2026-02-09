// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   Image,
//   Modal,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import Colors from '../../../globalshared/constants/colors';

// const CreateEventScreen = ({ navigation }) => {
//   const [eventName, setEventName] = useState('');
//   const [category, setCategory] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [maxAttendees, setMaxAttendees] = useState('');
//   const [showCategoryModal, setShowCategoryModal] = useState(false);

//   const categories = [
//     { id: '1', name: 'Music & Concert', icon: 'musical-notes', color: '#FF6B6B' },
//     { id: '2', name: 'Wellness & Health', icon: 'fitness', color: '#4ECDC4' },
//     { id: '3', name: 'Career & Business', icon: 'briefcase', color: '#45B7D1' },
//     { id: '4', name: 'Social & Networking', icon: 'people', color: '#FFA07A' },
//     { id: '5', name: 'Arts & Culture', icon: 'color-palette', color: '#9B59B6' },
//     { id: '6', name: 'Sports & Fitness', icon: 'basketball', color: '#E74C3C' },
//     { id: '7', name: 'Food & Drink', icon: 'restaurant', color: '#E67E22' },
//     { id: '8', name: 'Education & Learning', icon: 'school', color: '#2ECC71' },
//   ];

//   const CategoryModal = () => (
//     <Modal
//       visible={showCategoryModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowCategoryModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Category</Text>
//             <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
//               <Icon name="close" size={24} color={Colors.textPrimary} />
//             </TouchableOpacity>
//           </View>
          
//           <FlatList
//             data={categories}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.categoryOption}
//                 onPress={() => {
//                   setCategory(item.name);
//                   setShowCategoryModal(false);
//                 }}
//               >
//                 <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
//                   <Icon name={item.icon} size={20} color={item.color} />
//                 </View>
//                 <Text style={styles.categoryOptionText}>{item.name}</Text>
//                 <Icon name="chevron-forward" size={16} color={Colors.textTertiary} />
//               </TouchableOpacity>
//             )}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Create Event</Text>
//         <View style={styles.headerRight} />
//       </View>

//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Hero Section */}
//         <View style={styles.heroSection}>
//           <View style={styles.heroIcon}>
//             <Icon name="sparkles" size={32} color={Colors.primary} />
//           </View>
//           <Text style={styles.heroTitle}>Create Amazing Experiences! </Text>
//           <Text style={styles.heroSubtitle}>
//             Bring people together with meaningful events and conversations
//           </Text>
//         </View>

//         {/* Event Name */}
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Event Name</Text>
//           <TextInput
//             placeholder="e.g., Mindfulness Meditation Session"
//             placeholderTextColor={Colors.textTertiary}
//             value={eventName}
//             onChangeText={setEventName}
//             style={styles.textInput}
//           />
//         </View>

//         {/* Category */}
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Category</Text>
//           <TouchableOpacity 
//             style={styles.categorySelector}
//             onPress={() => setShowCategoryModal(true)}
//           >
//             <View style={styles.categorySelectorLeft}>
//               <View style={styles.categoryIconPlaceholder}>
//                 <Icon name="pricetag" size={20} color={Colors.primary} />
//               </View>
//               <Text style={category ? styles.categorySelectedText : styles.categoryPlaceholder}>
//                 {category || 'Select event category'}
//               </Text>
//             </View>
//             <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
//           </TouchableOpacity>
//         </View>

//         {/* Date & Time */}
//         <View style={styles.row}>
//           <View style={[styles.section, styles.flex]}>
//             <Text style={styles.sectionLabel}>Date/Time</Text>
//             <View style={styles.dateTimeContainer}>
//               <Icon name="calendar" size={20} color={Colors.primary} style={styles.dateTimeIcon} />
//               <TextInput
//                 placeholder="DD/MM/YYYY"
//                 placeholderTextColor={Colors.textTertiary}
//                 value={date}
//                 onChangeText={setDate}
//                 style={styles.dateTimeInput}
//               />
//             </View>
//           </View>

         
//         </View>

//         {/* Location */}
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Location</Text>
//           <View style={styles.locationContainer}>
//             <Icon name="location" size={20} color={Colors.primary} style={styles.inputIcon} />
//             <TextInput
//               placeholder="Virtual meeting or physical address"
//               placeholderTextColor={Colors.textTertiary}
//               value={location}
//               onChangeText={setLocation}
//               style={styles.locationInput}
//             />
//           </View>
//         </View>

//         {/* Max Attendees */}
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Maximum Attendees</Text>
//           <View style={styles.attendeesContainer}>
//             <Icon name="people" size={20} color={Colors.primary} style={styles.inputIcon} />
//             <TextInput
//               placeholder="50"
//               placeholderTextColor={Colors.textTertiary}
//               value={maxAttendees}
//               onChangeText={setMaxAttendees}
//               keyboardType="numeric"
//               style={styles.attendeesInput}
//             />
//           </View>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Description</Text>
//           <TextInput
//             placeholder="Describe your event, what attendees can expect, and any important details..."
//             placeholderTextColor={Colors.textTertiary}
//             value={description}
//             onChangeText={setDescription}
//             style={styles.textArea}
//             multiline
//             numberOfLines={4}
//             textAlignVertical="top"
//           />
//           <Text style={styles.charCount}>{description.length}/500</Text>
//         </View>

//         {/* Create Button */}
//         <TouchableOpacity 
//           style={[
//             styles.createButton,
//             (!eventName || !category || !date || !time) && styles.createButtonDisabled
//           ]}
//           disabled={!eventName || !category || !date || !time}
//         >
//           <LinearGradient
//             colors={(!eventName || !category || !date || !time) 
//               ? ['#CCCCCC', '#999999'] 
//               : Colors.primaryGradient
//             }
//             style={styles.createButtonGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//           >
//             <Icon name="add-circle" size={20} color={Colors.white} />
//             <Text style={styles.createButtonText}>Create Event</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Tips */}
//         <View style={styles.tipsSection}>
//           <View style={styles.tipsHeader}>
//             <Icon name="bulb" size={20} color={Colors.primary} />
//             <Text style={styles.tipsTitle}>Quick Tips</Text>
//           </View>
//           <View style={styles.tipItem}>
//             <Icon name="checkmark-circle" size={16} color="#4CAF50" />
//             <Text style={styles.tipText}>Choose a clear, descriptive event name</Text>
//           </View>
//           <View style={styles.tipItem}>
//             <Icon name="checkmark-circle" size={16} color="#4CAF50" />
//             <Text style={styles.tipText}>Select the most relevant category</Text>
//           </View>
//           <View style={styles.tipItem}>
//             <Icon name="checkmark-circle" size={16} color="#4CAF50" />
//             <Text style={styles.tipText}>Provide detailed description for better engagement</Text>
//           </View>
//         </View>
//       </ScrollView>

//       <CategoryModal />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     backgroundColor: Colors.card,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.05)',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//   },
//   headerRight: {
//     width: 32,
//   },
//   heroSection: {
//     alignItems: 'center',
//     padding: 32,
//     paddingBottom: 24,
//   },
//   heroIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   heroTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   section: {
//     paddingHorizontal: 24,
//     marginBottom: 20,
//   },
//   sectionLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   textInput: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: Colors.textPrimary,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//   },
//   categorySelector: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//   },
//   categorySelectorLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   categoryIconPlaceholder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(255, 51, 102, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   categoryPlaceholder: {
//     fontSize: 16,
//     color: Colors.textTertiary,
//   },
//   categorySelectedText: {
//     fontSize: 16,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   flex: {
//     flex: 1,
//   },
//   timeSection: {
//     marginLeft: 12,
//   },
//   dateTimeContainer: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//   },
//   dateTimeIcon: {
//     marginRight: 12,
//   },
//   dateTimeInput: {
//     flex: 1,
//     fontSize: 16,
//     color: Colors.textPrimary,
//   },
//   locationContainer: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   locationInput: {
//     flex: 1,
//     fontSize: 16,
//     color: Colors.textPrimary,
//   },
//   attendeesContainer: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//   },
//   attendeesInput: {
//     flex: 1,
//     fontSize: 16,
//     color: Colors.textPrimary,
//   },
//   textArea: {
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: Colors.textPrimary,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.08)',
//     minHeight: 120,
//     textAlignVertical: 'top',
//   },
//   charCount: {
//     fontSize: 12,
//     color: Colors.textTertiary,
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   createButton: {
//     marginHorizontal: 24,
//     marginTop: 8,
//     marginBottom: 24,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   createButtonDisabled: {
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   createButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 24,
//   },
//   createButtonText: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: '700',
//     marginLeft: 8,
//   },
//   tipsSection: {
//     backgroundColor: Colors.card,
//     marginHorizontal: 24,
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 51, 102, 0.1)',
//   },
//   tipsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   tipsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//     marginLeft: 8,
//   },
//   tipItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   tipText: {
//     flex: 1,
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginLeft: 8,
//     lineHeight: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: Colors.background,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '70%',
//     paddingBottom: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 24,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.05)',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//   },
//   categoryOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     paddingHorizontal: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.05)',
//   },
//   categoryIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   categoryOptionText: {
//     flex: 1,
//     fontSize: 16,
//     color: Colors.textPrimary,
//     fontWeight: '500',
//   },
// });

// export default CreateEventScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Colors from '../../../globalshared/constants/colors';
import { storage } from '../../../globalshared/services/storage';
import { authAPI } from '../../../globalshared/services/api';

const CreateEventScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [description, setDescription] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const categories = [
    { id: 1, name: 'Music & Concert', icon: 'musical-notes', color: '#FF6B6B' },
    { id: 2, name: 'Wellness & Health', icon: 'fitness', color: '#4ECDC4' },
    { id: 3, name: 'Career & Business', icon: 'briefcase', color: '#45B7D1' },
    { id: 4, name: 'Social & Networking', icon: 'people', color: '#FFA07A' },
  ];

  // Open image picker
  const handleImagePick = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        const asset = response.assets?.[0];
        if (asset) {
          setSelectedImage(asset);
        }
      }
    );
  };


  const handleCreateEvent = async () => {
    if (!eventName || !categoryId || !date || !location) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', eventName);
    formData.append('date', new Date(date).toISOString());
    formData.append('location', location);
    formData.append('attendees', maxAttendees || '');
    formData.append('description', description);
    formData.append('category', categoryId);

    if (selectedImage) {
      formData.append('images', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName || 'event_image.jpg',
      });
    }
    console.log('Selected_image',selectedImage)

    try {
      
      const response = await authAPI.createEvent(formData)
      console.log('res', response.data)

       navigation.goBack();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while creating the event.');
    } finally {
      setLoading(false);
    }
  };

  const CategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Icon name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryOption}
                onPress={() => {
                  setCategory(item.name);
                  setCategoryId(item.id);
                  setShowCategoryModal(false);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.categoryOptionText}>{item.name}</Text>
                <Icon name="chevron-forward" size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.eventImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="image" size={32} color={Colors.primary} />
              <Text style={styles.imagePlaceholderText}>Add Event Image</Text>
            </View>
          )}
        </TouchableOpacity>


        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Event Name</Text>
          <TextInput
            placeholder="e.g., Business Networking Night"
            placeholderTextColor={Colors.textTertiary}
            value={eventName}
            onChangeText={setEventName}
            style={styles.textInput}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <TouchableOpacity style={styles.categorySelector} onPress={() => setShowCategoryModal(true)}>
            <Text style={category ? styles.categorySelectedText : styles.categoryPlaceholder}>
              {category || 'Select event category'}
            </Text>
            <Icon name="chevron-down" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            placeholder="2025-12-01"
            placeholderTextColor={Colors.textTertiary}
            value={date}
            onChangeText={setDate}
            style={styles.textInput}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <TextInput
            placeholder="Event venue or online link"
            placeholderTextColor={Colors.textTertiary}
            value={location}
            onChangeText={setLocation}
            style={styles.textInput}
          />
        </View>

        {/* Max Attendees */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Max Attendees</Text>
          <TextInput
            placeholder="50"
            placeholderTextColor={Colors.textTertiary}
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
            style={styles.textInput}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            placeholder="Describe your event..."
            placeholderTextColor={Colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.createButton, (!eventName || !categoryId || !date || loading) && styles.createButtonDisabled]}
          disabled={!eventName || !categoryId || !date || loading}
          onPress={handleCreateEvent}
        >
          <LinearGradient
            colors={(!eventName || !categoryId || !date)
              ? ['#CCCCCC', '#999999']
              : Colors.primaryGradient}
            style={styles.createButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name={loading ? 'hourglass' : 'add-circle'} size={20} color={Colors.white} />
            <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create Event'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <CategoryModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    marginTop:30
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  imagePicker: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventImage: { width: '100%', height: 200, resizeMode: 'cover' },
  imagePlaceholder: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { marginTop: 8, color: Colors.textTertiary },
  section: { paddingHorizontal: 24, marginTop: 16 },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: Colors.textPrimary },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    color: Colors.textPrimary,
  },
  textArea: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    color: Colors.textPrimary,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  categoryPlaceholder: { color: Colors.textTertiary },
  categorySelectedText: { color: Colors.textPrimary, fontWeight: '500' },
  createButton: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  createButtonText: { color: Colors.white, fontSize: 18, fontWeight: '700', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  categoryOption: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  categoryOptionText: { flex: 1, fontSize: 16 },
  categoryIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
});

export default CreateEventScreen;
