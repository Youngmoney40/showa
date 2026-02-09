import React, { useState, useEffect } from 'react';
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
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../src/context/ThemeContext'; 
const { width } = Dimensions.get('window');

const ContactsScreen = ({ navigation }) => {
  
  const { theme, toggleTheme, isDark, isAuto, colors } = useTheme();
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonStates, setButtonStates] = useState({});

  
  useEffect(() => {
    console.log('Theme state in ContactsScreen:', { theme, isDark, isAuto });
  }, [theme, isDark, isAuto]);

  useEffect(() => {
    fetchContacts();
  }, []);

  // Function to force HTTPS for image URLs
  const getSecureImageUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace('http://', 'https://');
    }
    
    // If it's a relative path, prepend the API route and force HTTPS
    const baseUrl = API_ROUTE_IMAGE.replace('http://', 'https://');
    return baseUrl + url;
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('fetch contacttttttttt',response.data)

      // Combine all contact types into one array
      const allContacts = [
        ...(response.data.synced_contacts || []),
        ...(response.data.all_users || [])
      ];
      
      // Remove duplicates
      const uniqueContacts = allContacts.filter(
        (contact, index, self) =>
          index === self.findIndex((c) => (
            c.id === contact.id || 
            c.phone_number === contact.phone_number
          ))
      );

      setContacts(uniqueContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  const handleConnect = async (userId) => {
    try {
      // Set loading state for this specific button
      setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
    } catch (error) {
      console.error('Error connecting with user:', error);
      // Reset on error
      setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
    }
  };

  const getButtonState = (user) => {
    if (user.is_friend) return 'friends';
    return buttonStates[user.id] || 'add';
  };

  // Create dynamic styles based on theme
  const dynamicStyles = {
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: colors.background 
    },
    loadingText: { 
      marginTop: 16, 
      fontSize: 16, 
      color: colors.textSecondary || colors.text, 
      fontWeight: '500' 
    },
    header: { 
      padding: 24, 
      paddingBottom: 16, 
      backgroundColor: colors.surface || colors.background 
    },
    headerTitle: { 
      fontSize: 28, 
      fontWeight: '700', 
      color: colors.text, 
      marginBottom: 4 
    },
    headerSubtitle: { 
      fontSize: 16, 
      color: colors.textSecondary || colors.text, 
      fontWeight: '400' 
    },
    sectionHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: 24, 
      paddingVertical: 16, 
      backgroundColor: colors.card || colors.surface 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: '600', 
      color: colors.text 
    },
    contactsCount: { 
      fontSize: 14, 
      color: colors.textSecondary || colors.text, 
      fontWeight: '500' 
    },
    listContent: { 
      paddingHorizontal: 16, 
      paddingVertical: 8 
    },
    contactCard: {
      width: 160,
      backgroundColor: colors.surface || '#FFFFFF',
      borderRadius: 16,
      margin: 8,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.shadow || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.15 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    contactAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.avatarBackground || '#F3F4F6',
    },
    avatarPlaceholder: {
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactInfo: {
      alignItems: 'center',
      width: '100%',
    },
    contactName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
      width: '100%',
    },
    actionButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 36,
    },
    addButton: {
      backgroundColor: colors.primary,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    loadingButton: {
      backgroundColor: colors.disabled || '#9CA3AF',
    },
    sentButton: {
      backgroundColor: colors.success || '#10B981',
    },
    sentButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    friendsButton: {
      backgroundColor: colors.card || '#E5E7EB',
    },
    friendsButtonText: {
      color: colors.textSecondary || colors.text,
      fontSize: 14,
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
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.textSecondary || colors.text,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
    },
  };

  const renderButton = (user) => {
    const buttonState = getButtonState(user);
    
    switch (buttonState) {
      case 'loading':
        return (
          <TouchableOpacity 
            style={[dynamicStyles.actionButton, dynamicStyles.loadingButton]} 
            disabled
          >
            <ActivityIndicator size="small" color="#FFFFFF" />
          </TouchableOpacity>
        );
      
      case 'sent':
        return (
          <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.sentButton]}>
            <Text style={dynamicStyles.sentButtonText}>Invite Sent</Text>
          </TouchableOpacity>
        );
      
      case 'friends':
        return (
          <View style={[dynamicStyles.actionButton, dynamicStyles.friendsButton]}>
            <Text style={dynamicStyles.friendsButtonText}>Friends</Text>
          </View>
        );
      
      case 'add':
      default:
        return (
          <TouchableOpacity 
            style={[dynamicStyles.actionButton, dynamicStyles.addButton]}
            onPress={() => handleConnect(user.id)}
          >
            <Text style={dynamicStyles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        );
    }
  };

  const renderContactItem = ({ item }) => {
    const user = item.user_details || item;
    const imageUrl = user.profile_picture ? getSecureImageUrl(user.profile_picture) : null;
    
    return (
      <View style={dynamicStyles.contactCard}>
        <View style={styles.avatarContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={dynamicStyles.contactAvatar}
            />
          ) : (
            <View style={[dynamicStyles.contactAvatar, dynamicStyles.avatarPlaceholder]}>
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={dynamicStyles.contactInfo}>
          <Text style={dynamicStyles.contactName} numberOfLines={1}>
            {item.name || user.username || user.phone_number}
          </Text>
          
          {renderButton(user)}
        </View>
      </View>
    );
  };

  

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Discover People</Text>
        <Text style={dynamicStyles.headerSubtitle}>Connect with friends and contacts</Text>
      </View>
      
      {/* Contacts Section */}
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>People You May Know</Text>
        {contacts.length > 0 && (
          <Text style={dynamicStyles.contactsCount}>
            {contacts.length} {contacts.length === 1 ? 'person' : 'people'}
          </Text>
        )}
      </View>
      
      <FlatList
        horizontal
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id?.toString() || item.phone_number}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={dynamicStyles.emptyContainer}>
            <Ionicons 
              name="people-outline" 
              size={80} 
              color={colors.textSecondary || '#E5E7EB'} 
            />
            <Text style={dynamicStyles.emptyTitle}>No contacts found</Text>
            <Text style={dynamicStyles.emptySubtitle}>
              Your contacts will appear here once they join
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginBottom: 12,
  },
});

export default ContactsScreen;