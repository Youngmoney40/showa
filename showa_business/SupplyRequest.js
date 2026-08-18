
import React, { useState, useEffect, useRef } from "react";
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
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../src/context/ThemeContext";

const { width, height } = Dimensions.get("window");

const ServiceImage = ({ imageUrl, style, placeholderIcon, isAvatar = false }) => {
  const [error, setError] = useState(false);

  const getCorrectUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
      }
      return url;
    }
    const baseUrl = 'https://api.showapp.ng';
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };

  const finalUrl = getCorrectUrl(imageUrl);

  if (error || !imageUrl) {
    return (
      <View style={[style, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
        {placeholderIcon || (
          <MaterialIcon 
            name={isAvatar ? "person" : "business-center"} 
            size={isAvatar ? 20 : 30} 
            color="#CBD5E0" 
          />
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: finalUrl }}
      style={style}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
};

const ServicesScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    professionals: 0,
    successRate: 98
  });

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ROUTE}/services/categories/`);
      const data = await response.json();
      if (data.success) {
        setCategories([{ id: "all", name: "All" }, ...data.data.categories]);
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
        `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
      );
      const data = await response.json();

      if (data.success) {
        const posts = data.data.posts;
        
        if (shouldRefresh || pageNum === 1) {
          setServices(posts);
          setFilteredServices(posts);
          setStats({
            total: data.data.pagination.total_count || posts.length,
            professionals: new Set(posts.map(p => p.user)).size,
            successRate: 98
          });
        } else {
          setServices(prev => [...prev, ...posts]);
          setFilteredServices(prev => [...prev, ...posts]);
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

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchServices(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchServices(page + 1);
    }
  };

  const handleSearch = (text) => {
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
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.categories?.includes(parseInt(categoryId))
      );
      setFilteredServices(filtered);
    }
  };

  const navigateToServicePage = (service) => {
    navigation.navigate('SupplyRequestDetail', { serviceId: service.id, serviceData: service });
  };

  const renderServiceCard = ({ item, index }) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, { 
          backgroundColor: colors.surface,
          shadowColor: isDark ? 'transparent' : '#000',
        }]}
        onPress={() => navigateToServicePage(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <ServiceImage
            imageUrl={imageUrl}
            style={[styles.serviceImage, { backgroundColor: isDark ? colors.surfaceSecondary : '#F3F4F6' }]}
            placeholderIcon={<MaterialIcon name="business-center" size={30} color="#CBD5E0" />}
          />
          
          <View style={styles.cardInfo}>
            <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.companyName, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.company || "Individual Provider"}
            </Text>
            
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Icon name="location-outline" size={12} color={colors.textTertiary} />
                <Text style={[styles.metaText, { color: colors.textTertiary }]} numberOfLines={1}>
                  {item.location || "Nigeria"}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="time-outline" size={12} color={colors.textTertiary} />
                <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                </Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: colors.primary }]}>
                ₦{item.price_range || "50k - 200k"}
              </Text>
              {item.category_names && item.category_names.length > 0 && (
                <View style={[styles.categoryTag, { backgroundColor: isDark ? colors.surfaceSecondary : '#EFF6FF' }]}>
                  <Text style={[styles.categoryTagText, { color: colors.primary }]}>
                    {item.category_names[0]}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: isDark ? colors.border : '#F0F0F0' }]}>
          <View style={styles.userInfo}>
            <ServiceImage
              imageUrl={item.user_profile_picture}
              style={[styles.userAvatar, { backgroundColor: isDark ? colors.surfaceSecondary : '#F3F4F6' }]}
              isAvatar={true}
              placeholderIcon={<Icon name="person" size={14} color="#CBD5E0" />}
            />
            <Text style={[styles.userName, { color: colors.textSecondary }]}>
              {item.user_name ? item.user_name.slice(0, 16) + (item.user_name.length > 16 ? '...' : '') : "Provider"}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: colors.primary }]}
            onPress={() => navigateToServicePage(item)}
          >
            <Text style={styles.detailsButtonText}>View</Text>
            <Icon name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && [styles.categoryChipActive, { backgroundColor: colors.primary }],
        { 
          backgroundColor: selectedCategory === item.id ? colors.primary : isDark ? colors.surface : '#FFFFFF',
          borderColor: isDark ? colors.border : '#E5E7EB',
        }
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
          { color: selectedCategory === item.id ? '#FFFFFF' : colors.text }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // const renderFooter = () => {
  //   if (!loadingMore) return null;
  //   return (
  //     <View style={styles.footerLoader}>
  //       <ActivityIndicator size="small" color={colors.primary} />
  //       <Text style={[styles.footerLoaderText, { color: colors.textSecondary }]}>
  //         Loading more...
  //       </Text>
  //     </View>
  //   );
  // };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcon name="search-off" size={60} color={colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Services Found</Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        {searchQuery ? "Try adjusting your search" : "Be the first to post a service"}
      </Text>
    </View>
  );

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? colors.primary : undefined}
      />

      {/* Navbar */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateServices")}
          activeOpacity={0.7}
        >
          <Icon name="add-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <ImageBackground
              source={require("../assets/images/dad.jpg")}
              style={styles.headerBanner}
              imageStyle={styles.bannerImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)']}
                style={styles.bannerOverlay}
              />
              
              <View style={styles.bannerContent}>
                <Text style={styles.bannerMainTitle}>
                  Find trusted{'\n'}service providers
                </Text>
                
                <Text style={styles.bannerDescription}>
                  Connect with verified professionals for all your service needs
                </Text>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.95)',
                }]}>
                  <Icon name="search-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    style={[styles.searchInput, { 
                      color: isDark ? '#FFFFFF' : '#1F2937',
                    }]}
                    placeholder="Search for services..."
                    placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                      <Icon name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Stats */}
                <View style={[styles.statsContainer, { 
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }]}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.total}+</Text>
                    <Text style={styles.statLabel}>Services</Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.professionals}+</Text>
                    <Text style={styles.statLabel}>Professionals</Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.successRate}%</Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>

            {/* Categories */}
            {categories.length > 0 && (
              <View style={[styles.categoriesWrapper, { 
                backgroundColor: isDark ? colors.background : '#F3F4F6',
              }]}>
                <FlatList
                  data={categories}
                  renderItem={renderCategoryChip}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>
            )}
          </>
        }
        //ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading && renderEmptyState}
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
      />

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
            Loading services...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
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
    fontWeight: '700',
    color: '#ffffff',
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
  headerBanner: {
    width: width,
    height: height * 0.42,
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bannerMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 8,
  },
  bannerDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  categoriesWrapper: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 14,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 13,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ServicesScreen;
