// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   FlatList, 
// //   TouchableOpacity, 
// //   StyleSheet, 
// //   ActivityIndicator, 
// //   Image,
// //   Dimensions,
// //   RefreshControl,
// //   Animated
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useTheme } from '../src/context/ThemeContext'; 
// // const { width } = Dimensions.get('window');

// // const ContactsScreen = ({ navigation }) => {
  
// //   const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
// //   const [contacts, setContacts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [buttonStates, setButtonStates] = useState({});

  
// //   useEffect(() => {
// //     console.log('Theme state in ContactsScreen:', { theme, isDark, isAuto });
// //   }, [theme, isDark, isAuto]);

// //   useEffect(() => {
// //     fetchContacts();
// //   }, []);

// //   // Function to force HTTPS for image URLs
// //   const getSecureImageUrl = (url) => {
// //     if (!url) return null;
    
// //     // If it's already a full URL
// //     if (url.startsWith('http://') || url.startsWith('https://')) {
// //       return url.replace('http://', 'https://');
// //     }
    
// //     // If it's a relative path, prepend the API route and force HTTPS
// //     const baseUrl = API_ROUTE_IMAGE.replace('http://', 'https://');
// //     return baseUrl + url;
// //   };

// //   const fetchContacts = async () => {
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem('userToken');
      
// //       const response = await axios.get(`${API_ROUTE}/contacts/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       console.log('fetch contacttttttttt',response.data)

// //       // Combine all contact types into one array
// //       const allContacts = [
// //         ...(response.data.synced_contacts || []),
// //         ...(response.data.all_users || [])
// //       ];
      
// //       // Remove duplicates
// //       const uniqueContacts = allContacts.filter(
// //         (contact, index, self) =>
// //           index === self.findIndex((c) => (
// //             c.id === contact.id || 
// //             c.phone_number === contact.phone_number
// //           ))
// //       );

// //       setContacts(uniqueContacts);
// //     } catch (error) {
// //       console.error('Error fetching contacts:', error);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const onRefresh = () => {
// //     setRefreshing(true);
// //     fetchContacts();
// //   };

// //   const handleConnect = async (userId) => {
// //     try {
// //       // Set loading state for this specific button
// //       setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
// //       const token = await AsyncStorage.getItem('userToken');
// //       await axios.post(
// //         `${API_ROUTE}/follow-user/${userId}/`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
// //     } catch (error) {
// //       console.error('Error connecting with user:', error);
// //       // Reset on error
// //       setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
// //     }
// //   };

// //   const getButtonState = (user) => {
// //     if (user.is_friend) return 'friends';
// //     return buttonStates[user.id] || 'add';
// //   };

// //   // Create dynamic styles based on theme
// //   const dynamicStyles = {
// //     container: { flex: 1, backgroundColor: colors.background },
// //     loadingContainer: { 
// //       flex: 1, 
// //       justifyContent: 'center', 
// //       alignItems: 'center', 
// //       backgroundColor: colors.background 
// //     },
// //     loadingText: { 
// //       marginTop: 16, 
// //       fontSize: 16, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '500' 
// //     },
// //     header: { 
// //       padding: 24, 
// //       paddingBottom: 16, 
// //       backgroundColor: colors.surface || colors.background 
// //     },
// //     headerTitle: { 
// //       fontSize: 28, 
// //       fontWeight: '700', 
// //       color: colors.text, 
// //       marginBottom: 4 
// //     },
// //     headerSubtitle: { 
// //       fontSize: 16, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '400' 
// //     },
// //     sectionHeader: { 
// //       flexDirection: 'row', 
// //       justifyContent: 'space-between', 
// //       alignItems: 'center', 
// //       paddingHorizontal: 24, 
// //       paddingVertical: 16, 
// //       backgroundColor: colors.card || colors.surface 
// //     },
// //     sectionTitle: { 
// //       fontSize: 18, 
// //       fontWeight: '600', 
// //       color: colors.text 
// //     },
// //     contactsCount: { 
// //       fontSize: 14, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '500' 
// //     },
// //     listContent: { 
// //       paddingHorizontal: 16, 
// //       paddingVertical: 8 
// //     },
// //     contactCard: {
// //       width: 160,
// //       backgroundColor: colors.surface || '#FFFFFF',
// //       borderRadius: 16,
// //       margin: 8,
// //       padding: 16,
// //       alignItems: 'center',
// //       shadowColor: colors.shadow || '#000',
// //       shadowOffset: { width: 0, height: 2 },
// //       shadowOpacity: isDark ? 0.15 : 0.1,
// //       shadowRadius: 3.84,
// //       elevation: 5,
// //     },
// //     contactAvatar: {
// //       width: 80,
// //       height: 80,
// //       borderRadius: 40,
// //       backgroundColor: colors.avatarBackground || '#F3F4F6',
// //     },
// //     avatarPlaceholder: {
// //       backgroundColor: colors.primary,
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //     },
// //     contactInfo: {
// //       alignItems: 'center',
// //       width: '100%',
// //     },
// //     contactName: {
// //       fontSize: 16,
// //       fontWeight: '600',
// //       color: colors.text,
// //       textAlign: 'center',
// //       marginBottom: 12,
// //       width: '100%',
// //     },
// //     actionButton: {
// //       paddingVertical: 8,
// //       paddingHorizontal: 16,
// //       borderRadius: 20,
// //       width: '100%',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       minHeight: 36,
// //     },
// //     addButton: {
// //       backgroundColor: colors.primary,
// //     },
// //     addButtonText: {
// //       color: '#FFFFFF',
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     loadingButton: {
// //       backgroundColor: colors.disabled || '#9CA3AF',
// //     },
// //     sentButton: {
// //       backgroundColor: colors.success || '#10B981',
// //     },
// //     sentButtonText: {
// //       color: '#FFFFFF',
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     friendsButton: {
// //       backgroundColor: colors.card || '#E5E7EB',
// //     },
// //     friendsButtonText: {
// //       color: colors.textSecondary || colors.text,
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     emptyContainer: {
// //       width: width - 64,
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       padding: 40,
// //       marginHorizontal: 32,
// //     },
// //     emptyTitle: {
// //       fontSize: 18,
// //       fontWeight: '600',
// //       color: colors.text,
// //       marginTop: 16,
// //       textAlign: 'center',
// //     },
// //     emptySubtitle: {
// //       fontSize: 14,
// //       color: colors.textSecondary || colors.text,
// //       marginTop: 8,
// //       textAlign: 'center',
// //       lineHeight: 20,
// //     },
// //   };

// //   const renderButton = (user) => {

// //     const buttonState = getButtonState(user);
    
// //     switch (buttonState) {
// //       case 'loading':
// //         return (
// //           <TouchableOpacity 
// //             style={[dynamicStyles.actionButton, dynamicStyles.loadingButton]} 
// //             disabled
// //           >
// //             <ActivityIndicator size="small" color="#FFFFFF" />
// //           </TouchableOpacity>
// //         );
      
// //       case 'sent':
// //         return (
// //           <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.sentButton]}>
// //             <Text style={dynamicStyles.sentButtonText}>Invite Sent</Text>
// //           </TouchableOpacity>
// //         );
      
// //       case 'friends':
// //         return (
// //           <View style={[dynamicStyles.actionButton, dynamicStyles.friendsButton]}>
// //             <Text style={dynamicStyles.friendsButtonText}>Friends</Text>
// //           </View>
// //         );
      
// //       case 'add':
// //       default:
// //         return (
// //           <TouchableOpacity 
// //             style={[dynamicStyles.actionButton, dynamicStyles.addButton]}
// //             onPress={() => handleConnect(user.id)}
// //           >
// //             <Text style={dynamicStyles.addButtonText}>Add Friend</Text>
// //           </TouchableOpacity>
// //         );
// //     }
// //   };

// //   const renderContactItem = ({ item }) => {
// //     const user = item.user_details || item;
// //     const imageUrl = user.profile_picture ? getSecureImageUrl(user.profile_picture) : null;
    
// //     return (
// //       <View style={dynamicStyles.contactCard}>
// //         <View style={styles.avatarContainer}>
// //           {imageUrl ? (
// //             <TouchableOpacity
// //              onPress={() => navigation.navigate('OtherUserProfile', { userId: item.user_id })}
            
// //             >
// //               <Image 
// //               source={{ uri: imageUrl }} 
// //               style={dynamicStyles.contactAvatar}
// //             />
// //             </TouchableOpacity>
            
// //           ) : (
// //             <View style={[dynamicStyles.contactAvatar, dynamicStyles.avatarPlaceholder]}>
// //               <Ionicons name="person" size={28} color="#FFFFFF" />
// //             </View>
// //           )}
// //         </View>
        
// //         <View style={dynamicStyles.contactInfo}>
// //           <Text style={dynamicStyles.contactName} numberOfLines={1}>
// //             {item.name || user.username || user.phone_number}
// //           </Text>
          
// //           {renderButton(user)}
// //         </View>
// //       </View>
// //     );
// //   };

  

// //   return (
// //     <SafeAreaView style={dynamicStyles.container}>
// //       <View style={dynamicStyles.header}>
// //         <Text style={dynamicStyles.headerTitle}>Discover People</Text>
// //         <Text style={dynamicStyles.headerSubtitle}>Connect with friends and contacts</Text>
// //       </View>
      
// //       {/* Contacts Section */}
// //       <View style={dynamicStyles.sectionHeader}>
// //         <Text style={dynamicStyles.sectionTitle}>People You May Know</Text>
// //         {contacts.length > 0 && (
// //           <Text style={dynamicStyles.contactsCount}>
// //             {contacts.length} {contacts.length === 1 ? 'person' : 'people'}
// //           </Text>
// //         )}
// //       </View>
      
// //       <FlatList
// //         horizontal
// //         data={contacts}
// //         renderItem={renderContactItem}
// //         keyExtractor={(item) => item.id?.toString() || item.phone_number}
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={dynamicStyles.listContent}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[colors.primary]}
// //             tintColor={colors.primary}
// //           />
// //         }
// //         ListEmptyComponent={
// //           <View style={dynamicStyles.emptyContainer}>
// //             <Ionicons 
// //               name="people-outline" 
// //               size={80} 
// //               color={colors.textSecondary || '#E5E7EB'} 
// //             />
// //             <Text style={dynamicStyles.emptyTitle}>No contacts found</Text>
// //             <Text style={dynamicStyles.emptySubtitle}>
// //               Your contacts will appear here once they join
// //             </Text>
// //           </View>
// //         }
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   avatarContainer: {
// //     marginBottom: 12,
// //   },
// // });

// // export default ContactsScreen;


// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   FlatList, 
// //   TouchableOpacity, 
// //   StyleSheet, 
// //   ActivityIndicator, 
// //   Image,
// //   Dimensions,
// //   RefreshControl,
// //   Alert
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation } from '@react-navigation/native'; 
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useTheme } from '../src/context/ThemeContext'; 

// // const { width } = Dimensions.get('window');

// // const ContactsScreen = () => { // Remove navigation from props
  
// //   const navigation = useNavigation(); // Add this hook
// //   const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
// //   const [contacts, setContacts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [buttonStates, setButtonStates] = useState({});

// //   useEffect(() => {
// //     console.log('Theme state in ContactsScreen:', { theme, isDark, isAuto });
// //   }, [theme, isDark, isAuto]);

// //   useEffect(() => {
// //     fetchContacts();
// //   }, []);

// //   // Function to force HTTPS for image URLs
// //   const getSecureImageUrl = (url) => {
// //     if (!url) return null;
    
// //     if (url.startsWith('http://') || url.startsWith('https://')) {
// //       return url.replace('http://', 'https://');
// //     }
    
// //     const baseUrl = API_ROUTE_IMAGE.replace('http://', 'https://');
// //     return baseUrl + url;
// //   };

// //   const fetchContacts = async () => {
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem('userToken');
      
// //       const response = await axios.get(`${API_ROUTE}/contacts/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       //console.log('fetch contacttttttttt',response.data)

// //       const allContacts = [
// //         ...(response.data.synced_contacts || []),
// //         ...(response.data.all_users || [])
// //       ];
      
// //       const uniqueContacts = allContacts.filter(
// //         (contact, index, self) =>
// //           index === self.findIndex((c) => (
// //             c.id === contact.id || 
// //             c.phone_number === contact.phone_number
// //           ))
// //       );

// //       setContacts(uniqueContacts);
// //     } catch (error) {
// //       console.error('Error fetching contacts:', error);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const onRefresh = () => {
// //     setRefreshing(true);
// //     fetchContacts();
// //   };

// //   const handleConnect = async (userId) => {
// //     try {
// //       setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
// //       const token = await AsyncStorage.getItem('userToken');
// //       await axios.post(
// //         `${API_ROUTE}/follow-user/${userId}/`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
// //     } catch (error) {
// //       console.error('Error connecting with user:', error);
// //       setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
// //     }
// //   };

// //   const handleUserPress = (user) => {
// //     if (!navigation) {
// //       console.error('Navigation is undefined - check if screen is in navigator');
// //       Alert.alert('Error', 'Navigation not available');
// //       return;
// //     }

// //     const userId = user.id || user.user_id;
// //     if (!userId) {
// //       console.error('No user ID found:', user);
// //       return;
// //     }

// //     try {
     
// //       navigation.navigate('OtherUserProfile', { userId: userId });

      
// //     } catch (error) {
// //       console.error('Navigation error:', error);
// //       Alert.alert(
// //         'User Profile',
// //         `Viewing ${user.name || user.username || 'User'}'s profile`,
// //         [{ text: 'OK' }]
// //       );
// //     }
// //   };

// //   const getButtonState = (user) => {
// //     if (user.is_friend) return 'friends';
// //     return buttonStates[user.id] || 'add';
// //   };

// //   const dynamicStyles = {
// //     container: { flex: 1, backgroundColor: colors.background },
// //     loadingContainer: { 
// //       flex: 1, 
// //       justifyContent: 'center', 
// //       alignItems: 'center', 
// //       backgroundColor: colors.background 
// //     },
// //     loadingText: { 
// //       marginTop: 16, 
// //       fontSize: 16, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '500' 
// //     },
// //     header: { 
// //       padding: 24, 
// //       paddingBottom: 16, 
// //       backgroundColor: colors.surface || colors.background 
// //     },
// //     headerTitle: { 
// //       fontSize: 28, 
// //       fontWeight: '700', 
// //       color: colors.text, 
// //       marginBottom: 4 
// //     },
// //     headerSubtitle: { 
// //       fontSize: 16, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '400' 
// //     },
// //     sectionHeader: { 
// //       flexDirection: 'row', 
// //       justifyContent: 'space-between', 
// //       alignItems: 'center', 
// //       paddingHorizontal: 24, 
// //       paddingVertical: 16, 
// //       backgroundColor: colors.card || colors.surface 
// //     },
// //     sectionTitle: { 
// //       fontSize: 18, 
// //       fontWeight: '600', 
// //       color: colors.text 
// //     },
// //     contactsCount: { 
// //       fontSize: 14, 
// //       color: colors.textSecondary || colors.text, 
// //       fontWeight: '500' 
// //     },
// //     listContent: { 
// //       paddingHorizontal: 16, 
// //       paddingVertical: 8 
// //     },
// //     contactCard: {
// //       width: 160,
// //       backgroundColor: colors.surface || '#FFFFFF',
// //       borderRadius: 16,
// //       margin: 8,
// //       padding: 10,
// //       alignItems: 'center',
// //       shadowColor: colors.shadow || '#000',
// //       shadowOffset: { width: 0, height: 2 },
// //       shadowOpacity: isDark ? 0.15 : 0.1,
// //       shadowRadius: 3.84,
// //       elevation: 5,
// //     },
// //     contactAvatar: {
// //       width: 100,
// //       height: 100,
// //       borderRadius: 5,
// //       backgroundColor: colors.avatarBackground || '#F3F4F6',
// //     },
// //     avatarPlaceholder: {
// //       backgroundColor: colors.primary,
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //     },
// //     contactInfo: {
// //       alignItems: 'center',
// //       width: '100%',
// //     },
// //     contactName: {
// //       fontSize: 16,
// //       fontWeight: '600',
// //       color: colors.text,
// //       textAlign: 'center',
// //       marginBottom: 12,
// //       width: '100%',
// //     },
// //     actionButton: {
// //       paddingVertical: 8,
// //       paddingHorizontal: 16,
// //       borderRadius: 20,
// //       width: '100%',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       minHeight: 36,
// //     },
// //     addButton: {
// //       backgroundColor: colors.primary,
// //     },
// //     addButtonText: {
// //       color: '#FFFFFF',
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     loadingButton: {
// //       backgroundColor: colors.disabled || '#9CA3AF',
// //     },
// //     sentButton: {
// //       backgroundColor: colors.success || '#10B981',
// //     },
// //     sentButtonText: {
// //       color: '#FFFFFF',
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     friendsButton: {
// //       backgroundColor: colors.card || '#E5E7EB',
// //     },
// //     friendsButtonText: {
// //       color: colors.textSecondary || colors.text,
// //       fontSize: 14,
// //       fontWeight: '600',
// //     },
// //     emptyContainer: {
// //       width: width - 64,
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       padding: 40,
// //       marginHorizontal: 32,
// //     },
// //     emptyTitle: {
// //       fontSize: 18,
// //       fontWeight: '600',
// //       color: colors.text,
// //       marginTop: 16,
// //       textAlign: 'center',
// //     },
// //     emptySubtitle: {
// //       fontSize: 14,
// //       color: colors.textSecondary || colors.text,
// //       marginTop: 8,
// //       textAlign: 'center',
// //       lineHeight: 20,
// //     },
// //   };

// //   const renderButton = (user) => {
// //     const buttonState = getButtonState(user);
    
// //     switch (buttonState) {
// //       case 'loading':
// //         return (
// //           <TouchableOpacity 
// //             style={[dynamicStyles.actionButton, dynamicStyles.loadingButton]} 
// //             disabled
// //           >
// //             <ActivityIndicator size="small" color="#FFFFFF" />
// //           </TouchableOpacity>
// //         );
      
// //       case 'sent':
// //         return (
// //           <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.sentButton]}>
// //             <Text style={dynamicStyles.sentButtonText}>Invite Sent</Text>
// //           </TouchableOpacity>
// //         );
      
// //       case 'friends':
// //         return (
// //           <View style={[dynamicStyles.actionButton, dynamicStyles.friendsButton]}>
// //             <Text style={dynamicStyles.friendsButtonText}>Friends</Text>
// //           </View>
// //         );
      
// //       case 'add':
// //       default:
// //         return (
// //           <TouchableOpacity 
// //             style={[dynamicStyles.actionButton, dynamicStyles.addButton]}
// //             onPress={() => handleConnect(user.id)}
// //           >
// //             <Text style={dynamicStyles.addButtonText}>Add Friend</Text>
// //           </TouchableOpacity>
// //         );
// //     }
// //   };

// //   const renderContactItem = ({ item }) => {
// //     const user = item.user_details || item;
// //     const imageUrl = user.profile_picture ? getSecureImageUrl(user.profile_picture) : null;
// //     const userId = item.user_id || item.id || user.id;
    
// //     return (
// //       <View style={dynamicStyles.contactCard}>
// //         <TouchableOpacity 
// //           style={styles.avatarContainer}
// //           onPress={() => handleUserPress(item)}
// //           activeOpacity={0.7}
// //         >
// //           {imageUrl ? (
// //             <Image 
// //               source={{ uri: imageUrl }} 
// //               style={dynamicStyles.contactAvatar}
// //             />
// //           ) : (
// //             <View style={[dynamicStyles.contactAvatar, dynamicStyles.avatarPlaceholder]}>
// //               <Ionicons name="person" size={28} color="#FFFFFF" />
// //             </View>
// //           )}
// //         </TouchableOpacity>
        
// //         <View style={dynamicStyles.contactInfo}>
// //           <TouchableOpacity onPress={() => handleUserPress(item)}>
// //             <Text style={dynamicStyles.contactName} numberOfLines={1}>
// //               {item.name || user.username || user.phone_number || 'User'}
// //             </Text>
// //           </TouchableOpacity>
          
// //           {renderButton(user)}
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={dynamicStyles.container}>
// //       {/* <View style={dynamicStyles.header}>
// //         <Text style={dynamicStyles.headerTitle}>Discover People</Text>
// //         <Text style={dynamicStyles.headerSubtitle}>Connect with friends and contacts</Text>
// //       </View> */}
      
// //       <View style={dynamicStyles.sectionHeader}>
// //         <Text style={dynamicStyles.sectionTitle}>People You May Know</Text>
// //         {contacts.length > 0 && (
// //           <Text style={dynamicStyles.contactsCount}>
// //             {contacts.length} {contacts.length === 1 ? 'person' : 'people'}
// //           </Text>
// //         )}
// //       </View>
      
// //       <FlatList
// //         horizontal
// //         data={contacts}
// //         renderItem={renderContactItem}
// //         keyExtractor={(item, index) => 
// //           item.id?.toString() || 
// //           item.user_id?.toString() || 
// //           item.phone_number || 
// //           index.toString()
// //         }
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={dynamicStyles.listContent}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[colors.primary]}
// //             tintColor={colors.primary}
// //           />
// //         }
// //         ListEmptyComponent={
// //           <View style={dynamicStyles.emptyContainer}>
// //             <Ionicons 
// //               name="people-outline" 
// //               size={80} 
// //               color={colors.textSecondary || '#E5E7EB'} 
// //             />
// //             <Text style={dynamicStyles.emptyTitle}>No contacts found</Text>
// //             <Text style={dynamicStyles.emptySubtitle}>
// //               Your contacts will appear here once they join
// //             </Text>
// //           </View>
// //         }
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   avatarContainer: {
// //     marginBottom: 12,
// //   },
// // });

// // export default ContactsScreen;

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   Image,
//   Dimensions,
//   RefreshControl,
//   Alert
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native'; 
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.38;

// const ContactsScreen = () => {
  
//   const navigation = useNavigation();
//   const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [buttonStates, setButtonStates] = useState({});

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const getSecureImageUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url.replace('http://', 'https://');
//     }
//     const baseUrl = API_ROUTE_IMAGE.replace('http://', 'https://');
//     return baseUrl + url;
//   };

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const allContacts = [
//         ...(response.data.synced_contacts || []),
//         ...(response.data.all_users || [])
//       ];
      
//       const uniqueContacts = allContacts.filter(
//         (contact, index, self) =>
//           index === self.findIndex((c) => (
//             c.id === contact.id || 
//             c.phone_number === contact.phone_number
//           ))
//       );

//       setContacts(uniqueContacts);
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchContacts();
//   };

//   const handleConnect = async (userId) => {
//     try {
//       setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/follow-user/${userId}/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
//     } catch (error) {
//       console.error('Error connecting with user:', error);
//       setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
//     }
//   };

//   const handleUserPress = (user) => {
//     const userId = user.id || user.user_id;
//     if (!userId) {
//       console.error('No user ID found:', user);
//       return;
//     }
//     navigation.navigate('OtherUserProfile', { userId: userId });
//   };

//   const getButtonState = (user) => {
//     if (user.is_friend) return 'friends';
//     return buttonStates[user.id] || 'add';
//   };

//   const renderButton = (user) => {
//     const buttonState = getButtonState(user);
    
//     switch (buttonState) {
//       case 'loading':
//         return (
//           <TouchableOpacity 
//             style={[dynamicStyles.actionButton, dynamicStyles.loadingButton]} 
//             disabled
//           >
//             <ActivityIndicator size="small" color="#FFFFFF" />
//           </TouchableOpacity>
//         );
      
//       case 'sent':
//         return (
//           <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.sentButton]}>
//             <Text style={dynamicStyles.sentButtonText}>Invite Sent</Text>
//           </TouchableOpacity>
//         );
      
//       case 'friends':
//         return (
//           <View style={[dynamicStyles.actionButton, dynamicStyles.friendsButton]}>
//             <Text style={dynamicStyles.friendsButtonText}>Friends</Text>
//           </View>
//         );
      
//       case 'add':
//       default:
//         return (
//           <TouchableOpacity 
//             style={[dynamicStyles.actionButton, dynamicStyles.addButton]}
//             onPress={() => handleConnect(user.id)}
//           >
//             <Text style={dynamicStyles.addButtonText}>Add Friend</Text>
//           </TouchableOpacity>
//         );
//     }
//   };

//   const renderContactItem = ({ item }) => {
//     const user = item.user_details || item;
//     const imageUrl = user.profile_picture ? getSecureImageUrl(user.profile_picture) : null;
//     const userId = item.user_id || item.id || user.id;
//     const userName = item.name || user.username || user.phone_number || 'User';
//     const isFriend = user.is_friend || false;
//     const mutualFriends = user.mutual_friends_count || Math.floor(Math.random() * 15) + 1;
    
//     return (
//       <View style={[dynamicStyles.contactCard, { backgroundColor: colors.card }]}>
//         <TouchableOpacity 
//           onPress={() => handleUserPress(item)}
//           activeOpacity={0.9}
//         >
//           {imageUrl ? (
//             <Image 
//               source={{ uri: imageUrl }} 
//               style={dynamicStyles.contactAvatar}
//             />
//           ) : (
//             <View style={[dynamicStyles.contactAvatar, dynamicStyles.avatarPlaceholder]}>
//               <Ionicons name="person" size={40} color="#FFFFFF" />
//             </View>
//           )}
//         </TouchableOpacity>
        
//         <View style={dynamicStyles.contactInfo}>
//           <TouchableOpacity onPress={() => handleUserPress(item)}>
//             <Text style={[dynamicStyles.contactName, { color: colors.text }]} numberOfLines={1}>
//               {userName}
//             </Text>
//           </TouchableOpacity>
          
//           {!isFriend && (
//             <Text style={[dynamicStyles.mutualFriendsText, { color: colors.textSecondary }]}>
//               {mutualFriends} {mutualFriends === 1 ? 'mutual friend' : 'mutual friends'}
//             </Text>
//           )}
          
//           {renderButton(user)}
//         </View>
//       </View>
//     );
//   };

//   const dynamicStyles = {
//     container: { 
//       flex: 1, 
//       backgroundColor: colors.background 
//     },
//     loadingContainer: { 
//       flex: 1, 
//       justifyContent: 'center', 
//       alignItems: 'center', 
//       backgroundColor: colors.background 
//     },
//     loadingText: { 
//       marginTop: 16, 
//       fontSize: 16, 
//       color: colors.textSecondary || colors.text, 
//       fontWeight: '500' 
//     },
//     sectionHeader: { 
//       flexDirection: 'row', 
//       justifyContent: 'space-between', 
//       alignItems: 'center', 
//       paddingHorizontal: 16, 
//       paddingVertical: 12,
//       backgroundColor: colors.card || colors.surface,
//       borderBottomWidth: 0,
//     },
//     sectionTitle: { 
//       fontSize: 18, 
//       fontWeight: '700', 
//       color: colors.text,
//     },
//     contactsCount: { 
//       fontSize: 14, 
//       color: colors.textSecondary || colors.text, 
//       fontWeight: '500' 
//     },
//     listContent: { 
//       paddingHorizontal: 12, 
//       paddingVertical: 12,
//       paddingBottom: 20,
//     },
//     contactCard: {
//       width: CARD_WIDTH,
//       marginHorizontal: 6,
//       marginVertical: 4,
//       padding: 12,
//       alignItems: 'center',
//       borderRadius: 12,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: isDark ? 0.2 : 0.08,
//       shadowRadius: 8,
//       elevation: isDark ? 4 : 2,
//     },
//     contactAvatar: {
//       width: CARD_WIDTH - 24,
//       height: CARD_WIDTH - 24,
//       borderRadius: 8,
//       backgroundColor: colors.avatarBackground || '#E8ECF1',
//       marginBottom: 10,
//     },
//     avatarPlaceholder: {
//       backgroundColor: colors.primary || '#0D64DD',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     contactInfo: {
//       alignItems: 'center',
//       width: '100%',
//     },
//     contactName: {
//       fontSize: 15,
//       fontWeight: '600',
//       textAlign: 'center',
//       marginBottom: 2,
//       width: '100%',
//     },
//     mutualFriendsText: {
//       fontSize: 12,
//       textAlign: 'center',
//       marginBottom: 10,
//     },
//     actionButton: {
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 6,
//       width: '100%',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: 32,
//     },
//     addButton: {
//       backgroundColor: colors.primary || '#0D64DD',
//     },
//     addButtonText: {
//       color: '#FFFFFF',
//       fontSize: 13,
//       fontWeight: '600',
//     },
//     loadingButton: {
//       backgroundColor: colors.disabled || '#9CA3AF',
//     },
//     sentButton: {
//       backgroundColor: colors.success || '#10B981',
//     },
//     sentButtonText: {
//       color: '#FFFFFF',
//       fontSize: 13,
//       fontWeight: '600',
//     },
//     friendsButton: {
//       backgroundColor: colors.card || '#F0F2F5',
//       borderWidth: 0,
//     },
//     friendsButtonText: {
//       color: colors.textSecondary || '#65676B',
//       fontSize: 13,
//       fontWeight: '600',
//     },
//     emptyContainer: {
//       width: width - 64,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 40,
//       marginHorizontal: 32,
//     },
//     emptyTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//       color: colors.text,
//       marginTop: 16,
//       textAlign: 'center',
//     },
//     emptySubtitle: {
//       fontSize: 14,
//       color: colors.textSecondary || colors.text,
//       marginTop: 8,
//       textAlign: 'center',
//       lineHeight: 20,
//     },
//   };

//   return (
//     <SafeAreaView style={dynamicStyles.container}>
//       <View style={dynamicStyles.sectionHeader}>
//         <Text style={dynamicStyles.sectionTitle}>People You May Know</Text>
        
//       </View>
      
//       <FlatList
//         horizontal
//         data={contacts}
//         renderItem={renderContactItem}
//         keyExtractor={(item, index) => 
//           item.id?.toString() || 
//           item.user_id?.toString() || 
//           item.phone_number || 
//           index.toString()
//         }
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={dynamicStyles.listContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//         ListEmptyComponent={
//           <View style={dynamicStyles.emptyContainer}>
//             <Ionicons 
//               name="people-outline" 
//               size={80} 
//               color={colors.textSecondary || '#E5E7EB'} 
//             />
//             <Text style={dynamicStyles.emptyTitle}>No contacts found</Text>
//             <Text style={dynamicStyles.emptySubtitle}>
//               Your contacts will appear here once they join
//             </Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// export default ContactsScreen;

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  Dimensions,
  RefreshControl,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext'; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const IMAGE_SIZE = CARD_WIDTH - 32;

// Cache keys
const CONTACTS_CACHE_KEY = 'contacts_cache_v2';
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

// Memoized Contact Card Component
const ContactCard = memo(({ item, onPress, onConnect, buttonStates, colors, isDark }) => {
  const user = item.user_details || item;
  const imageUrl = user.profile_picture ? fixImageUrl(user.profile_picture) : null;
  const userName = item.name || user.username || user.phone_number || 'User';
  const isFriend = user.is_friend || false;
  const mutualFriends = user.mutual_friends_count || Math.floor(Math.random() * 15) + 1;
  
  const getButtonState = () => {
    if (isFriend) return 'friends';
    return buttonStates[item.id] || 'add';
  };

  const renderButton = () => {
    const buttonState = getButtonState();
    
    switch (buttonState) {
      case 'loading':
        return (
          <View style={[styles.actionButton, styles.loadingButton]}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        );
      
      case 'sent':
        return (
          <View style={[styles.actionButton, styles.sentButton]}>
            <Text style={styles.sentButtonText}>✓ Sent</Text>
          </View>
        );
      
      case 'friends':
        return (
          <View style={[styles.actionButton, styles.friendsButton]}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={[styles.friendsButtonText, { color: colors.textSecondary }]}>
              Friends
            </Text>
          </View>
        );
      
      case 'add':
      default:
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.addButton]}
            onPress={() => onConnect(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        );
    }
  };

  // Don't render if no profile picture
  if (!imageUrl) return null;

  return (
    <TouchableOpacity 
      style={[styles.contactCard, { backgroundColor: colors.card }]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.contactImage}
        resizeMode="cover"
      />
      
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]} numberOfLines={1}>
          {userName}
        </Text>
        
        {!isFriend && (
          <Text style={[styles.mutualFriendsText, { color: colors.textSecondary }]}>
            {mutualFriends} {mutualFriends === 1 ? 'mutual friend' : 'mutual friends'}
          </Text>
        )}
        
        <View style={styles.buttonContainer}>
          {renderButton()}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Fix image URL helper
const fixImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.replace('http://', 'https://');
  }
  const baseUrl = API_ROUTE_IMAGE.replace('http://', 'https://');
  return baseUrl + url;
};

const ContactsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonStates, setButtonStates] = useState({});
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const isMountedRef = useRef(true);

  // ============================================================
  // LOAD FROM CACHE - INSTANT DISPLAY
  // ============================================================
  const loadFromCache = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CONTACTS_CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const { data, timestamp } = parsed;
        
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        if (isCacheValid && data && data.length > 0) {
          console.log('📦 Loading contacts from cache:', data.length);
          setContacts(data);
          setLoading(false);
          setHasLoadedOnce(true);
          return true;
        } else {
          console.log('⏰ Cache expired, will fetch fresh data');
        }
      }
    } catch (error) {
      console.error('Error loading contacts from cache:', error);
    }
    return false;
  }, []);

  // ============================================================
  // SAVE TO CACHE
  // ============================================================
  const saveToCache = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem(
        CONTACTS_CACHE_KEY,
        JSON.stringify({
          data: data,
          timestamp: Date.now()
        })
      );
      console.log('💾 Contacts saved to cache:', data.length);
    } catch (error) {
      console.error('Error saving contacts to cache:', error);
    }
  }, []);

  // ============================================================
  // FETCH CONTACTS - OPTIMIZED
  // ============================================================
  const fetchContacts = useCallback(async (forceRefresh = false) => {
    try {
      // Skip if already loaded and not forced
      if (hasLoadedOnce && !forceRefresh) {
        console.log('⏭️ Skipping fetch - already loaded');
        return;
      }

      console.log('🌐 Fetching contacts from API...');
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const allContacts = [
        ...(response.data.synced_contacts || []),
        ...(response.data.all_users || [])
      ];
      
      const uniqueContacts = allContacts.filter(
        (contact, index, self) =>
          index === self.findIndex((c) => (
            c.id === contact.id || 
            c.phone_number === contact.phone_number
          ))
      );

      // Filter out contacts without profile pictures
      const filteredContacts = uniqueContacts.filter(contact => {
        const user = contact.user_details || contact;
        return user.profile_picture !== null && user.profile_picture !== undefined;
      });

      setContacts(filteredContacts);
      setHasLoadedOnce(true);
      
      // Save to cache
      await saveToCache(filteredContacts);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setRefreshing(false);
    }
  }, [hasLoadedOnce, saveToCache]);

  // ============================================================
  // LOAD DATA - CACHE FIRST
  // ============================================================
  const loadData = useCallback(async (forceRefresh = false) => {
    // If already loaded and not forced, skip
    if (hasLoadedOnce && !forceRefresh) {
      console.log('⏭️ Skipping load - already loaded');
      return;
    }

    // Try cache first
    const hasCache = await loadFromCache();
    
    if (hasCache) {
      // Refresh in background if cache exists
      fetchContacts(forceRefresh).catch(err => console.error('Background fetch error:', err));
    } else {
      // No cache, fetch from network
      await fetchContacts(forceRefresh);
    }
  }, [loadFromCache, fetchContacts, hasLoadedOnce]);

  // ============================================================
  // HANDLE CONNECT
  // ============================================================
  const handleConnect = useCallback(async (userId) => {
    try {
      setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
      // Update local state to reflect friend status
      setContacts(prev => 
        prev.map(contact => 
          contact.id === userId 
            ? { ...contact, is_friend: true }
            : contact
        )
      );
      
      // Update cache with new friend status
      saveToCache(contacts);
      
    } catch (error) {
      console.error('Error connecting with user:', error);
      setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
      Alert.alert('Error', 'Failed to connect with user. Please try again.');
    }
  }, [contacts, saveToCache]);

  // ============================================================
  // HANDLE USER PRESS
  // ============================================================
  const handleUserPress = useCallback((user) => {
    const userId = user.id || user.user_id;
    if (!userId) {
      console.error('No user ID found:', user);
      return;
    }
    navigation.navigate('OtherUserProfile', { userId: userId });
  }, [navigation]);

  // ============================================================
  // REFRESH
  // ============================================================
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts(true);
  }, [fetchContacts]);

  // ============================================================
  // INITIAL LOAD - ONLY ONCE
  // ============================================================
  useEffect(() => {
    console.log('🚀 Initial load - checking cache...');
    loadData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array = ONLY RUNS ONCE

  // ============================================================
  // FOCUS EFFECT - BACKGROUND REFRESH IF NEEDED
  // ============================================================
  useFocusEffect(
    useCallback(() => {
      // Check if cache is expired and refresh in background
      const checkCacheAndRefresh = async () => {
        try {
          const cachedData = await AsyncStorage.getItem(CONTACTS_CACHE_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const isCacheValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
            
            if (!isCacheValid) {
              console.log('🔄 Cache expired, refreshing in background...');
              await fetchContacts(true);
            }
          }
        } catch (error) {
          console.error('Error checking cache on focus:', error);
        }
      };
      
      checkCacheAndRefresh();
    }, [fetchContacts])
  );

  // ============================================================
  // RENDER
  // ============================================================
  const renderContactItem = useCallback(({ item }) => {
    // Don't render if no profile picture
    const user = item.user_details || item;
    if (!user.profile_picture) return null;

    return (
      <ContactCard 
        item={item}
        onPress={handleUserPress}
        onConnect={handleConnect}
        buttonStates={buttonStates}
        colors={colors}
        isDark={isDark}
      />
    );
  }, [buttonStates, colors, isDark, handleUserPress, handleConnect]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary,  borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          People You May Know
        </Text>
        
      </View>
      
      <FlatList
        horizontal
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item, index) => 
          item.id?.toString() || 
          item.user_id?.toString() || 
          item.phone_number || 
          index.toString()
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Ionicons 
              name="people-outline" 
              size={80} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No contacts found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              People you know will appear here once they join
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  refreshButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  contactCard: {
    width: CARD_WIDTH,
    marginHorizontal: 6,
    padding: 12,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  contactImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  contactInfo: {
    alignItems: 'center',
    width: '100%',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    width: '100%',
  },
  mutualFriendsText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  addButton: {
    backgroundColor: '#0D64DD',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingButton: {
    backgroundColor: '#9CA3AF',
  },
  sentButton: {
    backgroundColor: '#10B981',
  },
  sentButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  friendsButton: {
    backgroundColor: '#F0F2F5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  friendsButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    width: width - 64,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ContactsScreen;