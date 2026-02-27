

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  Share,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ navigation, route }) {
  const { colors, isDark } = useTheme();
  const { product: routeProduct, businessProfile } = route.params || {};

  const [product, setProduct] = useState(routeProduct || null);
  const [loading, setLoading] = useState(!routeProduct);
  const [business, setBusiness] = useState(businessProfile || null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [isProductOwner, setIsProductOwner] = useState(false);
  const [userBusinessAccounts, setUserBusinessAccounts] = useState([]); 
  const [checkingOwnership, setCheckingOwnership] = useState(true);
  const [productImages, setProductImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserData();
      
      if (routeProduct) {
        setProduct(routeProduct);
        setLoading(false);
        
       
        const images = [];
        if (routeProduct.image) {
          images.push(routeProduct.image);
        }
        if (routeProduct.image_url) {
          images.push(routeProduct.image_url);
        }
        if (routeProduct.images && Array.isArray(routeProduct.images)) {
          images.push(...routeProduct.images.map(img => img.image || img));
        }
        setProductImages(images.filter(Boolean));
        
        // Fetch business profile if not provided and product has owner
        if (!businessProfile && routeProduct.owner) {
          await fetchBusinessProfile(routeProduct.owner);
        } else if (businessProfile) {
          setBusiness(businessProfile);
        }
      } else if (route.params?.catalogItem) {
        // Handle if passed as catalogItem
        const catalogItem = route.params.catalogItem;
        setProduct(catalogItem);
        setLoading(false);
        
        // Process catalog item images
        const images = [];
        if (catalogItem.image) images.push(catalogItem.image);
        if (catalogItem.image_url) images.push(catalogItem.image_url);
        setProductImages(images.filter(Boolean));
        
        if (catalogItem.owner) {
          await fetchBusinessProfile(catalogItem.owner);
        }
      } else {
        Alert.alert('Error', 'Product information not available');
        setLoading(false);
      }
    };
    
    initializeData();
  }, [routeProduct, businessProfile, route.params?.catalogItem]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;
      
      if (!token || !parsed?.id) {
        console.error('Missing token or userID');
        setCheckingOwnership(false);
        return null;
      }
      
      setUserId(parsed.id);
      setUsername(parsed.name || 'User');
      
      
      await fetchUserBusinessAccounts(parsed.id, token);
      
      
      if (parsed.profile_picture) {
        setUserProfileImage(`${API_ROUTE_IMAGE}${parsed.profile_picture}`);
      }
      
      return parsed.id;
    } catch (error) {
      console.error('Error fetching user:', error);
      setCheckingOwnership(false);
      return null;
    }
  };

  const fetchUserBusinessAccounts = async (userId, token) => {
    try {
      const response = await axios.get(
        `${API_ROUTE}/users/${userId}/business-accounts/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        setUserBusinessAccounts(response.data);
        
        // Check if the product owner (business account) is in user's business accounts
        if (product && product.owner && response.data.some(business => business.id === product.owner)) {
          setIsProductOwner(true);
        }
      }
    } catch (error) {
      console.error('Error fetching business accounts:', error);
      // Alternative approach if API endpoint doesn't exist
      checkOwnershipAlternative();
    } finally {
      setCheckingOwnership(false);
    }
  };

  const checkOwnershipAlternative = async () => {
    try {
      if (!product || !product.owner) {
        setIsProductOwner(false);
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(
        `${API_ROUTE}/profiles/${product.owner}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const businessData = response.data;
        
        if (businessData.owner === userId) {
          setIsProductOwner(true);
          return;
        }
      }
    } catch (error) {
      console.error('Alternative ownership check failed:', error);
    } finally {
      setCheckingOwnership(false);
    }
  };

  const fetchBusinessProfile = async (businessUserId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_ROUTE}/profiles/${businessUserId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setBusiness(response.data);
        
        // Also check ownership after fetching business profile
        if (userId && response.data.owner === userId) {
          setIsProductOwner(true);
        }
      }
    } catch (error) {
      console.error('Business profile fetch error:', error);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    try {
      const price = product.sale_price && parseFloat(product.sale_price) > 0 
        ? product.sale_price 
        : product.price;
      
      const shareMessage = `Check out "${product.name}" - ₦${parseFloat(price).toLocaleString()}\n\n${product.description || ''}\n\nSold by: ${product.owner_name || business?.name || 'Business'}`;
      
      await Share.share({
        title: product.name,
        message: shareMessage,
        url: product.image ? getFullImageUrl(product.image) : '',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ROUTE_IMAGE}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  const handleSelectImage = () => {
    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setSelectedImage({
            uri: selectedImage.uri,
            type: selectedImage.type || 'image/jpeg',
            name: selectedImage.fileName || `product_inquiry_${Date.now()}.jpg`,
          });
        }
        setShowImagePicker(false);
      }
    );
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const sendMessageToSeller = async () => {
    if (!business?.user && !product?.owner) {
      Alert.alert('Error', 'Seller information not available');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'Please login to send messages');
      return;
    }

    if (!message.trim() && !selectedImage) {
      Alert.alert('Error', 'Please enter a message or attach an image');
      return;
    }

    // Prevent sending message if user is the product owner
    if (isProductOwner) {
      Alert.alert('Not Allowed', 'You cannot send messages to your own business. This is your product listing.');
      return;
    }

    setSendingMessage(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to send messages');
        setSendingMessage(false);
        return;
      }

      const formData = new FormData();
      
      
      let messageContent = message.trim();
      const price = product.sale_price && parseFloat(product.sale_price) > 0 
        ? product.sale_price 
        : product.price;
      
      if (product) {
        if (messageContent) {
          messageContent += `\n\n📦 Product: ${product.name}`;
          messageContent += `\n💰 Price: ₦${parseFloat(price).toLocaleString()}`;
          if (product.description) {
            messageContent += `\n📝 Description: ${product.description.substring(0, 100)}...`;
          }
        } else {
          messageContent = `I'm interested in: ${product.name}\n💰 Price: ₦${parseFloat(price).toLocaleString()}`;
          if (product.description) {
            messageContent += `\n📝 ${product.description.substring(0, 100)}...`;
          }
        }
      }
      
      if (messageContent.trim()) {
        formData.append('content', messageContent.trim());
      }


      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        });
      }

  
      formData.append('chat_type', 'single');
      formData.append('account_mode', 'business');
      formData.append('receiver', business?.user || product?.owner);

      const response = await axios.post(
        `${API_ROUTE}/chat/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert(
          'Message Sent!',
          'Your message has been sent to the seller.',
          [
            {
              text: 'Continue Shopping',
              style: 'cancel',
              onPress: () => {
                setMessage('');
                setSelectedImage(null);
                setMessageModalVisible(false);
              }
            },
            {
              text: 'View Chat',
              onPress: () => {
                navigation.navigate('PersonalPrivateChatScreen', {
                  chatType: 'single',
                  receiverId: business?.user || product?.owner,
                  name: business?.name || product?.owner_name,
                  profile_image: business?.image,
                });
                setMessage('');
                setSelectedImage(null);
                setMessageModalVisible(false);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Send message error:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to send message';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid message data.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const sendQuickInquiry = (inquiryType) => {
   
    if (isProductOwner) {
      Alert.alert('Not Allowed', 'You cannot send inquiries about your own product.');
      return;
    }

    const price = product.sale_price && parseFloat(product.sale_price) > 0 
      ? product.sale_price 
      : product.price;
    
    let messageText = '';
    
    switch(inquiryType) {
      case 'availability':
        messageText = `Is "${product?.name}" available?`;
        break;
      case 'price':
        messageText = `Is the price of ₦${parseFloat(price).toLocaleString()} for "${product?.name}" negotiable?`;
        break;
      case 'details':
        messageText = `Can I get more details about "${product?.name}"?`;
        break;
      default:
        messageText = `I'm interested in "${product?.name}"`;
    }
    
    if (product) {
      messageText += `\n\n📦 Product: ${product.name}`;
      messageText += `\n💰 Price: ₦${parseFloat(price).toLocaleString()}`;
      if (product.description) {
        messageText += `\n📝 Description: ${product.description.substring(0, 100)}...`;
      }
    }
    
    setMessage(messageText);
    setMessageModalVisible(true);
  };

  const renderLoading = () => (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading product details...</Text>
    </View>
  );

  const renderHeader = () => (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
        shadowColor: isDark ? '#000' : '#000',
      }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {product?.name || 'Product Details'}
        </Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerIconButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={handleShare}
          >
            <Icon name="share" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderImageGallery = () => {
    const images = productImages.length > 0 ? productImages : [product?.image, product?.image_url].filter(Boolean);
    
    if (images.length === 0) {
      return (
        <View style={[styles.productImage, styles.placeholderImage, { backgroundColor: colors.card }]}>
          <Icon name="image" size={50} color={colors.textSecondary} />
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>No image available</Text>
        </View>
      );
    }

    return (
      <View style={[styles.imageGalleryContainer, { backgroundColor: colors.card }]}>
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(newIndex);
          }}
        >
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: getFullImageUrl(img) }}
              style={styles.productImage}
              resizeMode="cover"
              onError={() => console.log('Image failed to load')}
            />
          ))}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imagePagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === activeImageIndex ? colors.primary : colors.textSecondary },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderProductInfo = () => {
    const price = product?.sale_price && parseFloat(product.sale_price) > 0 
      ? product.sale_price 
      : product?.price;
    
    const originalPrice = product?.sale_price && parseFloat(product.sale_price) > 0 ? product.price : null;
    const discountPercent = originalPrice 
      ? Math.round(((originalPrice - product.sale_price) / originalPrice) * 100) 
      : 0;

    return (
      <View style={[styles.productInfo, { backgroundColor: colors.card }]}>
        <Text style={[styles.productName, { color: colors.text }]}>{product?.name || 'Product Name'}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>
            ₦{parseFloat(price || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          {originalPrice && (
            <>
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ₦{parseFloat(originalPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
            </>
          )}
        </View>
        
        {product?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>
        )}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="person" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              Seller: {product?.owner_name || business?.name || 'Unknown'}
            </Text>
          </View>
          
          {product?.created_at && (
            <View style={styles.metaItem}>
              <Icon name="calendar-today" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                Listed: {new Date(product.created_at).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {product?.slug && (
            <View style={styles.metaItem}>
              <Icon name="link" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                ID: {product.slug}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderBusinessInfo = () => {
    if (!business && !product?.owner_name) return null;

    return (
      <TouchableOpacity 
        style={[styles.businessCard, { backgroundColor: colors.card }]}
        activeOpacity={0.7}
        onPress={() => {
          const businessId = business?.user || product?.owner;
          if (businessId) {
            navigation.navigate('BusinessProfile', { userId: businessId });
          }
        }}
        disabled={isProductOwner || !(business?.user || product?.owner)}
      >
        <View style={styles.businessHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sold By</Text>
          {!isProductOwner && <Icon name="chevron-right" size={20} color={colors.textSecondary} />}
        </View>
        
        <View style={styles.businessInfo}>
          <Image
            source={
              business?.image
                ? { uri: getFullImageUrl(business.image) }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.businessAvatar}
          />
          <View style={styles.businessDetails}>
            <Text style={[styles.businessName, { color: colors.text }]}>
              {business?.name || product?.owner_name || 'Business Name'}
            </Text>
            {business?.description && (
              <Text style={[styles.businessDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {business.description}
              </Text>
            )}
          </View>
        </View>
        
        {!isProductOwner && (
          <TouchableOpacity 
            style={[styles.messageButton, { borderColor: colors.primary }]}
            onPress={() => setMessageModalVisible(true)}
          >
            <Icon name="chat" size={18} color={colors.primary} />
            <Text style={[styles.messageButtonText, { color: colors.primary }]}>Message Seller</Text>
          </TouchableOpacity>
        )}
        {isProductOwner && (
          <View style={[styles.ownerInfoContainer, { 
            backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF',
            borderColor: colors.primary 
          }]}>
            <Icon name="store" size={18} color={colors.primary} />
            <Text style={[styles.ownerInfoText, { color: colors.primary }]}>Your Business Product</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderQuickInquiries = () => {
    if (checkingOwnership) {
      return (
        <View style={[styles.quickInquiries, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Inquiries</Text>
          <View style={styles.loadingInquiries}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingInquiriesText, { color: colors.textSecondary }]}>Checking ownership...</Text>
          </View>
        </View>
      );
    }

    if (!business && !product?.owner) return null;

    return (
      <View style={[styles.quickInquiries, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Inquiries</Text>
        <View style={styles.inquiryButtons}>
          {!isProductOwner ? (
            <>
              <TouchableOpacity 
                style={[styles.inquiryButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}
                onPress={() => sendQuickInquiry('availability')}
              >
                <Icon name="inventory" size={18} color={colors.primary} />
                <Text style={[styles.inquiryButtonText, { color: colors.primary }]}>Available?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.inquiryButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}
                onPress={() => sendQuickInquiry('price')}
              >
                <Icon name="price-change" size={18} color={colors.primary} />
                <Text style={[styles.inquiryButtonText, { color: colors.primary }]}>Price?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.inquiryButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}
                onPress={() => sendQuickInquiry('details')}
              >
                <Icon name="info" size={18} color={colors.primary} />
                <Text style={[styles.inquiryButtonText, { color: colors.primary }]}>More Info</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.ownerInquiryMessage}>
              <Icon name="business" size={24} color={colors.primary} />
              <Text style={[styles.ownerInquiryText, { color: colors.textSecondary }]}>
                Manage this product from your business dashboard
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMessageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={messageModalVisible}
      onRequestClose={() => setMessageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Message Seller</Text>
              {product?.name && (
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  About: {product.name}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setMessageModalVisible(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {isProductOwner && (
            <View style={[styles.warningContainer, { 
              backgroundColor: isDark ? colors.backgroundSecondary : '#FFF3E0',
              borderColor: '#FF9800' 
            }]}>
              <Icon name="warning" size={24} color="#FF9800" />
              <Text style={[styles.warningText, { color: '#FF9800' }]}>
                This is your business product. You cannot message yourself.
              </Text>
            </View>
          )}
          
          {product?.image && (
            <View style={[styles.productPreview, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border 
            }]}>
              <Image 
                source={{ uri: getFullImageUrl(product.image_url) }}
                style={styles.productPreviewImage}
              />
              <View style={styles.productPreviewInfo}>
                <Text style={[styles.productPreviewName, { color: colors.text }]} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPreviewPrice}>
                  ₦{parseFloat(product.sale_price && parseFloat(product.sale_price) > 0 ? product.sale_price : product.price || 0).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
          
          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={removeSelectedImage}
              >
                <Icon name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={[styles.modalLabel, { color: colors.text }]}>Your Message:</Text>
          <TextInput
            style={[styles.messageInput, { 
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.backgroundSecondary 
            }, isProductOwner && [styles.disabledInput, { backgroundColor: colors.background }]]}
            placeholder={isProductOwner ? "This is your business product" : "Type your message here..."}
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isProductOwner}
          />
          
          <View style={styles.modalActions}>
            {/* <TouchableOpacity 
              style={[styles.attachButton, { 
                backgroundColor: colors.backgroundSecondary 
              }, isProductOwner && [styles.disabledButton, { backgroundColor: colors.background }]]}
              onPress={() => !isProductOwner && setShowImagePicker(true)}
              disabled={isProductOwner}
            >
              <Icon name="attach-file" size={20} color={colors.textSecondary} />
              <Text style={[styles.attachButtonText, { color: colors.textSecondary }]}>Attach Image</Text>
            </TouchableOpacity> */}
            
            <View style={styles.sendButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setMessageModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.sendButton, { 
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOpacity: isDark ? 0.3 : 0.2,
                }, isProductOwner && [styles.disabledButton, { backgroundColor: colors.backgroundSecondary }]]}
                onPress={() => !isProductOwner && sendMessageToSeller()}
                disabled={isProductOwner || (!message.trim() && !selectedImage) || sendingMessage}
              >
                {sendingMessage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="send" size={18} color="#FFFFFF" style={styles.sendIcon} />
                    <Text style={styles.sendButtonText}>
                      {isProductOwner ? 'Your Business' : 'Send Message'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderImagePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImagePicker}
      onRequestClose={() => setShowImagePicker(false)}
    >
      <View style={styles.imagePickerOverlay}>
        <View style={[styles.imagePickerContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.imagePickerHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.imagePickerTitle, { color: colors.text }]}>Attach Image</Text>
            <TouchableOpacity onPress={() => setShowImagePicker(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.imagePickerOption, { borderBottomColor: colors.border }]}
            onPress={handleSelectImage}
          >
            <Icon name="photo-library" size={28} color={colors.primary} />
            <Text style={[styles.imagePickerOptionText, { color: colors.text }]}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.imagePickerOption, styles.cancelOption]}
            onPress={() => setShowImagePicker(false)}
          >
            <Text style={styles.cancelOptionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading || checkingOwnership) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderLoading()}
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Icon name="error-outline" size={64} color="#FF5252" />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Product Not Found</Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            The product information could not be loaded.
          </Text>
          <TouchableOpacity 
            style={[styles.backToCatalogButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToCatalogText}>Back to Catalog</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <ScrollView 
        style={[styles.scrollContainer, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {renderImageGallery()}
        {renderProductInfo()}
        {renderBusinessInfo()}
        {renderQuickInquiries()}
        <View style={{ height: 20 }} />
      </ScrollView>

      {!isProductOwner && (
        <View style={[styles.floatingAction, { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          shadowColor: isDark ? '#000' : '#000',
        }]}>
          <TouchableOpacity 
            style={[styles.messageActionButton, { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: isDark ? 0.4 : 0.3,
            }]}
            onPress={() => setMessageModalVisible(true)}
          >
            <Icon name="chat" size={20} color="#FFFFFF" style={styles.actionIcon} />
            <Text style={styles.messageActionText}>Message Seller</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderMessageModal()}
      {renderImagePickerModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    // backgroundColor handled inline
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor handled inline
    borderBottomWidth: 1,
    // borderBottomColor handled inline
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    // backgroundColor handled inline
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    // backgroundColor handled inline
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    // color handled inline
  },
  loadingInquiries: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingInquiriesText: {
    marginTop: 8,
    fontSize: 14,
    // color handled inline
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    // backgroundColor handled inline
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    // color handled inline
    marginTop: 20,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    // color handled inline
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backToCatalogButton: {
    // backgroundColor handled inline
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToCatalogText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGalleryContainer: {
    
    position: 'relative',
  },
  productImage: {
    width: width,
    height: 350,
    backgroundColor: '#F5F5F5',
  },
  imagePagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // backgroundColor handled inline
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    // color handled inline
  },
  productInfo: {
    // backgroundColor handled inline
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    // color handled inline
    marginBottom: 12,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 20,
    // color handled inline
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 15,
    // color handled inline
    lineHeight: 22,
  },
  metaContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  businessCard: {
    // backgroundColor handled inline
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    // color handled inline
    marginBottom: 8,
    lineHeight: 18,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    // borderColor handled inline
    borderRadius: 8,
    paddingVertical: 10,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    // color handled inline
    marginLeft: 8,
  },
  ownerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    // borderColor handled inline
  },
  ownerInfoText: {
    fontSize: 14,
    fontWeight: '500',
    // color handled inline
    marginLeft: 8,
  },
  quickInquiries: {
    // backgroundColor handled inline
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inquiryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  inquiryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  inquiryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    // color handled inline
    marginLeft: 6,
  },
  ownerInquiryMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  ownerInquiryText: {
    fontSize: 14,
    // color handled inline
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor handled inline
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    // borderTopColor handled inline
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
  },
  messageActionButton: {
    // backgroundColor handled inline
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor handled inline
    shadowOffset: { width: 0, height: 4 },
    // shadowOpacity handled inline
    shadowRadius: 8,
    elevation: 6,
  },
  actionIcon: {
    marginRight: 8,
  },
  messageActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    // backgroundColor handled inline
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color handled inline
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    // color handled inline
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor handled inline
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor handled inline
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    // color handled inline
    marginLeft: 8,
  },
  productPreview: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    // backgroundColor handled inline
    borderRadius: 12,
    borderWidth: 1,
    // borderColor handled inline
  },
  productPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  productPreviewInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    // color handled inline
    marginBottom: 4,
  },
  productPreviewPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  selectedImageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  selectedImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    // color handled inline
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  messageInput: {
    borderWidth: 1,
    // borderColor handled inline
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    // color handled inline
    minHeight: 120,
    textAlignVertical: 'top',
  },
  disabledInput: {
    // backgroundColor handled inline
    // color handled inline
  },
  modalActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor handled inline
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  attachButtonText: {
    fontSize: 14,
    // color handled inline
    marginLeft: 8,
  },
  sendButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    // backgroundColor handled inline
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    // color handled inline
  },
  sendButton: {
    // backgroundColor handled inline
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerContainer: {
    // backgroundColor handled inline
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  imagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color handled inline
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    // borderBottomColor handled inline
  },
  imagePickerOptionText: {
    fontSize: 16,
    // color handled inline
    marginLeft: 16,
    flex: 1,
  },
  cancelOption: {
    borderBottomWidth: 0,
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});