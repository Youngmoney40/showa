import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { API_ROUTE } from "../api_routing/api";
import { useTheme } from "../src/context/ThemeContext";

const { width, height } = Dimensions.get("window");
const ITEMS_PER_PAGE = 10;

// Memoized Image Component
const ServiceImage = React.memo(({ imageUrl, style, isAvatar = false, colors }) => {
  const [error, setError] = useState(false);
  
  if (!imageUrl || error) {
    return (
      <View style={[style, { 
        backgroundColor: colors?.surfaceSecondary || '#EDF2F7', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }]}>
        <Icon 
          name={isAvatar ? "person" : "image"} 
          size={isAvatar ? 20 : 30} 
          color="#CBD5E0" 
        />
      </View>
    );
  }

  let finalUrl = imageUrl;
  if (typeof imageUrl === 'string' && imageUrl.startsWith('http://')) {
    finalUrl = imageUrl.replace('http://', 'https://');
  }
  
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
    finalUrl = `https://api.showapp.ng${imageUrl}`;
  }

  return (
    <Image
      source={{ uri: finalUrl }}
      style={style}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
});

// Memoized Service Card
const ServiceCard = React.memo(({ item, onPress, colors, isDark, styles }) => {
  const imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
  
  return (
    <TouchableOpacity
      style={[styles.serviceCard, { 
        backgroundColor: colors.surface,
        borderColor: isDark ? colors.border : '#EDF2F7',
        shadowColor: isDark ? 'transparent' : '#000',
      }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <ServiceImage
          imageUrl={imageUrl}
          style={[styles.serviceImage, { backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7' }]}
          colors={colors}
        />
        <View style={styles.cardHeaderContent}>
          <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.companyName, { color: colors.textSecondary }]}>
            {item.company || "Individual"}
          </Text>
          <View style={[styles.priceContainer, { backgroundColor: isDark ? colors.surfaceSecondary : '#EBF8FF' }]}>
            <Text style={[styles.priceText, { color: colors.primary }]}>
              ₦{item.price_range || "Price on request"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <ServiceImage
            imageUrl={item.user_profile_picture}
            style={[styles.userAvatar, { backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7' }]}
            isAvatar={true}
            colors={colors}
          />
          <Text style={[styles.userName, { color: colors.textSecondary }]}>
            {item.user_name || "Provider"}
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color={colors.textTertiary} />
          <Text style={[styles.locationText, { color: colors.textTertiary }]} numberOfLines={1}>
            {item.location || "Location not specified"}
          </Text>
        </View>
      </View>

      {item.category_names && item.category_names.length > 0 && (
        <View style={styles.categoryTags}>
          {item.category_names.slice(0, 2).map((cat, index) => (
            <View key={index} style={[styles.categoryTag, { backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7' }]}>
              <Text style={[styles.categoryTagText, { color: colors.textTertiary }]}>{cat}</Text>
            </View>
          ))}
          {item.category_names.length > 2 && (
            <View style={[styles.categoryTag, { backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7' }]}>
              <Text style={[styles.categoryTagText, { color: colors.textTertiary }]}>+{item.category_names.length - 2}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

// Optimized Thumbnail Component
const ThumbnailItem = React.memo(({ item, index, activeIndex, onPress, colors, isDark, styles }) => (
  <TouchableOpacity
    style={[
      styles.thumbnailItem,
      activeIndex === index && [styles.thumbnailActive, { borderColor: colors.primary }]
    ]}
    onPress={() => onPress(index)}
  >
    <ServiceImage
      imageUrl={item.image}
      style={[styles.thumbnailImage, { backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7' }]}
      colors={colors}
    />
  </TouchableOpacity>
));

const ServicesScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalReady, setModalReady] = useState(false);

  // Animation for modal
  const slideAnimation = useRef(new Animated.Value(height)).current;
  const flatListRef = useRef(null);
  const modalScrollRef = useRef(null);

  // Define styles inside component using theme colors
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 12 : 14,
      backgroundColor: colors.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 10,
    },
    backButton: {
      padding: 5,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#fff",
      flex: 1,
      textAlign: 'center',
    },
    addButton: {
      padding: 5,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surface,
      borderColor: isDark ? colors.border : '#E2E8F0',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    categoriesContainer: {
      marginBottom: 12,
    },
    categoriesList: {
      paddingHorizontal: 16,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
    },
    categoryChipActive: {},
    categoryChipText: {
      fontSize: 14,
      fontWeight: "500",
    },
    categoryChipTextActive: {
      color: "#fff",
    },
    servicesList: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    serviceCard: {
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
    },
    cardHeader: {
      flexDirection: "row",
      marginBottom: 12,
    },
    serviceImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 12,
    },
    cardHeaderContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    serviceTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    companyName: {
      fontSize: 14,
      marginBottom: 4,
    },
    priceContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    priceText: {
      fontSize: 13,
      fontWeight: "600",
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    userAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 6,
    },
    userName: {
      fontSize: 13,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      maxWidth: "50%",
    },
    locationText: {
      fontSize: 12,
      marginLeft: 4,
    },
    categoryTags: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    categoryTag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 6,
      marginBottom: 4,
    },
    categoryTagText: {
      fontSize: 11,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderText: {
      marginTop: 12,
      fontSize: 16,
    },
    footerLoader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
    },
    footerLoaderText: {
      marginLeft: 8,
      fontSize: 14,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      textAlign: "center",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: height * 0.92,
      backgroundColor: colors.surface,
    },
    modalHandle: {
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 8,
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? colors.border : '#CBD5E0',
    },
    modalScrollContent: {
      paddingBottom: 30,
    },
    closeButton: {
      position: "absolute",
      top: 16,
      right: 16,
      borderRadius: 20,
      padding: 8,
      zIndex: 10,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    detailImageContainer: {
      position: "relative",
      height: 280,
      width: "100%",
      backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7',
    },
    detailImage: {
      width: "100%",
      height: 280,
    },
    imageCounter: {
      position: "absolute",
      bottom: 16,
      right: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    imageCounterText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    thumbnailListContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    thumbnailItem: {
      marginRight: 8,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      overflow: 'hidden',
    },
    thumbnailActive: {
      borderColor: '#0d64dd',
    },
    thumbnailImage: {
      width: 60,
      height: 60,
      borderRadius: 6,
    },
    detailContent: {
      padding: 20,
    },
    detailHeader: {
      marginBottom: 16,
    },
    detailTitle: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
    },
    detailCompany: {
      fontSize: 16,
    },
    detailInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      flexWrap: "wrap",
      gap: 8,
    },
    detailPriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: isDark ? colors.surfaceSecondary : '#EBF8FF',
    },
    detailPrice: {
      fontSize: 18,
      fontWeight: "700",
      marginLeft: 4,
    },
    detailLocationContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailLocation: {
      fontSize: 14,
      marginLeft: 4,
    },
    detailSection: {
      marginBottom: 20,
    },
    detailSectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    detailDescription: {
      fontSize: 15,
      lineHeight: 22,
    },
    detailCategories: {
      marginBottom: 20,
    },
    detailCategoryTags: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    detailCategoryTag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7',
    },
    detailCategoryTagText: {
      fontSize: 13,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    contactText: {
      fontSize: 15,
      marginLeft: 12,
    },
    providerSection: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginTop: 10,
      backgroundColor: isDark ? colors.surfaceSecondary : '#F7FAFC',
    },
    providerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: isDark ? colors.surfaceSecondary : '#EDF2F7',
    },
    providerInfo: {
      flex: 1,
    },
    providerName: {
      fontSize: 16,
      fontWeight: "600",
    },
    providerLabel: {
      fontSize: 13,
    },
    messageButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    messageButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 6,
    },
  }), [colors, isDark]);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ROUTE}/services/categories/`);
      const data = await response.json();
      if (data.success) {
        setCategories([{ id: "all", name: "All Services" }, ...data.data.categories]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async (pageNum = 1, shouldRefresh = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `${API_ROUTE}/services/all/?page=${pageNum}&page_size=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.success) {
        if (shouldRefresh || pageNum === 1) {
          setServices(data.data.posts);
          setFilteredServices(data.data.posts);
        } else {
          setServices((prev) => [...prev, ...data.data.posts]);
          setFilteredServices((prev) => [...prev, ...data.data.posts]);
        }
        setHasMore(data.data.pagination.has_next);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchServices(1, true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchServices(page + 1);
    }
  }, [hasMore, loadingMore, page]);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.title?.toLowerCase().includes(text.toLowerCase()) ||
          service.company?.toLowerCase().includes(text.toLowerCase()) ||
          service.description?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [services]);

  const handleCategoryFilter = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.categories?.includes(parseInt(categoryId))
      );
      setFilteredServices(filtered);
    }
  }, [services]);

  const openServiceDetails = useCallback((service) => {
    setSelectedService(service);
    setActiveImageIndex(0);
    setModalReady(false);
    setModalVisible(true);
    
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalReady(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedService(null);
      setActiveImageIndex(0);
      setModalReady(false);
    });
  }, []);

  const handleImageChange = useCallback((index) => {
    setActiveImageIndex(index);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const renderServiceCard = useCallback(({ item }) => (
    <ServiceCard 
      item={item} 
      onPress={openServiceDetails} 
      colors={colors} 
      isDark={isDark}
      styles={styles}
    />
  ), [colors, isDark, openServiceDetails, styles]);

  const renderCategoryChip = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && [styles.categoryChipActive, { backgroundColor: colors.primary }],
        { 
          backgroundColor: selectedCategory === item.id ? colors.primary : isDark ? colors.surface : '#EDF2F7',
        }
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && [styles.categoryChipTextActive, { color: '#fff' }],
          { color: selectedCategory === item.id ? '#fff' : colors.text }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, colors, isDark, handleCategoryFilter, styles]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.footerLoaderText, { color: colors.textSecondary }]}>Loading more...</Text>
      </View>
    );
  }, [loadingMore, colors, styles]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={60} color={colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Services Found</Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        {searchQuery
          ? "Try adjusting your search or filters"
          : "Be the first to post a service"}
      </Text>
    </View>
  ), [searchQuery, colors, styles]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const categoryKeyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoized thumbnail list
  const renderThumbnails = useMemo(() => {
    if (!selectedService?.images || selectedService.images.length <= 1) return null;
    
    return (
      <FlatList
        data={selectedService.images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ThumbnailItem
            item={item}
            index={index}
            activeIndex={activeImageIndex}
            onPress={handleImageChange}
            colors={colors}
            isDark={isDark}
            styles={styles}
          />
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.thumbnailListContent}
      />
    );
  }, [selectedService, activeImageIndex, colors, isDark, handleImageChange, styles]);

  // Memoized modal content
  const modalContent = useMemo(() => {
    if (!selectedService) return null;

    const images = selectedService.images || [];
    const mainImage = images.length > 0 ? images[activeImageIndex]?.image : null;
    const imageCount = images.length;

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: slideAnimation }],
                  },
                ]}
              >
                <View style={styles.modalHandle}>
                  <View style={styles.handleBar} />
                </View>

                <ScrollView
                  ref={modalScrollRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                  scrollEventThrottle={16}
                  removeClippedSubviews={Platform.OS === 'android'}
                >
                  {/* Image Gallery */}
                  <View style={styles.detailImageContainer}>
                    <ServiceImage
                      imageUrl={mainImage}
                      style={styles.detailImage}
                      colors={colors}
                    />
                    
                    {imageCount > 1 && (
                      <View style={styles.imageCounter}>
                        <Text style={styles.imageCounterText}>
                          {activeImageIndex + 1} / {imageCount}
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={closeModal}
                    >
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* Thumbnails */}
                  {renderThumbnails}

                  {/* Content */}
                  <View style={styles.detailContent}>
                    <View style={styles.detailHeader}>
                      <Text style={[styles.detailTitle, { color: colors.text }]}>
                        {selectedService.title}
                      </Text>
                      <Text style={[styles.detailCompany, { color: colors.textSecondary }]}>
                        {selectedService.company || "Individual Service Provider"}
                      </Text>
                    </View>

                    <View style={styles.detailInfoRow}>
                      <View style={styles.detailPriceContainer}>
                     
                        <Text style={[styles.detailPrice, { color: colors.primary }]}>
                          ₦{selectedService.price_range || "Price on request"}
                        </Text>
                      </View>
                      <View style={styles.detailLocationContainer}>
                        <Icon name="location-on" size={18} color={colors.textTertiary} />
                        <Text style={[styles.detailLocation, { color: colors.textSecondary }]}>
                          {selectedService.location || "Location not specified"}
                        </Text>
                      </View>
                    </View>

                    {selectedService.category_names &&
                      selectedService.category_names.length > 0 && (
                        <View style={styles.detailCategories}>
                          <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Categories</Text>
                          <View style={styles.detailCategoryTags}>
                            {selectedService.category_names.map((cat, index) => (
                              <View key={index} style={styles.detailCategoryTag}>
                                <Text style={[styles.detailCategoryTagText, { color: colors.textSecondary }]}>{cat}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                    <View style={styles.detailSection}>
                      <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Description</Text>
                      <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
                        {selectedService.description || "No description provided"}
                      </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Contact Information</Text>
                      
                      {selectedService.email && (
                        <View style={styles.contactItem}>
                          <Icon name="email" size={20} color={colors.primary} />
                          <Text style={[styles.contactText, { color: colors.textSecondary }]}>{selectedService.email}</Text>
                        </View>
                      )}
                      
                      {selectedService.contactinfo && (
                        <View style={styles.contactItem}>
                          <Icon name="phone" size={20} color={colors.primary} />
                          <Text style={[styles.contactText, { color: colors.textSecondary }]}>{selectedService.contactinfo}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.providerSection}>
                      <ServiceImage
                        imageUrl={selectedService.user_profile_picture}
                        style={styles.providerAvatar}
                        isAvatar={true}
                        colors={colors}
                      />
                      <View style={styles.providerInfo}>
                        <Text style={[styles.providerName, { color: colors.text }]}>
                          {selectedService.user_name || "Provider"}
                        </Text>
                        <Text style={[styles.providerLabel, { color: colors.textSecondary }]}>Service Provider</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => {
                          closeModal();
                          InteractionManager.runAfterInteractions(() => {
                            navigation.navigate('BPrivateChat', {
                              receiverId: selectedService.user,
                              name: selectedService.user_name,
                              chatType: 'single',
                              profile_image: selectedService.user_profile_picture,
                            });
                          });
                        }}
                      >
                        <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                        <Text style={styles.messageButtonText}>Message</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }, [selectedService, modalVisible, slideAnimation, colors, isDark, activeImageIndex, renderThumbnails, closeModal, navigation, styles]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateServices")}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Ionicons name="add-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={categoryKeyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loaderText, { color: colors.textSecondary }]}>Loading services...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredServices}
          renderItem={renderServiceCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      )}

      {modalContent}
    </SafeAreaView>
  );
};

export default ServicesScreen;