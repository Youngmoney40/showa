
// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TouchableOpacity,
// //   Image,
// //   TextInput,
// //   ActivityIndicator,
// //   RefreshControl,
// //   Dimensions,
// //   StatusBar,
// //   Platform,
// //   SafeAreaView,
// //   Modal,
// //   ScrollView,
// //   Animated,
// //   PanResponder,
// // } from "react-native";
// // import Icon from "react-native-vector-icons/MaterialIcons";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import Feather from "react-native-vector-icons/Feather";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_ROUTE } from "../api_routing/api";

// // const { width, height } = Dimensions.get("window");

// // const ServicesScreen = ({ navigation }) => {
// //   const [services, setServices] = useState([]);
// //   const [filteredServices, setFilteredServices] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("all");
// //   const [categories, setCategories] = useState([]);
// //   const [selectedService, setSelectedService] = useState(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [loadingMore, setLoadingMore] = useState(false);

// //   // Animation for modal
// //   const slideAnimation = useRef(new Animated.Value(height)).current;

// //   // Fetch categories
// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);

// //   // Fetch services
// //   useEffect(() => {
// //     fetchServices();
// //   }, []);

// //   const fetchCategories = async () => {
// //     try {
// //       const response = await fetch(`${API_ROUTE}/services/categories/`);
// //       const data = await response.json();
// //       if (data.success) {
// //         setCategories([{ id: "all", name: "All Services" }, ...data.data.categories]);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching categories:", error);
// //     }
// //   };

// //   const fetchServices = async (pageNum = 1, shouldRefresh = false) => {
// //     try {
// //       if (pageNum === 1) {
// //         setLoading(true);
// //       } else {
// //         setLoadingMore(true);
// //       }

// //       const response = await fetch(
// //         `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
// //       );
// //       const data = await response.json();

// //       if (data.success) {
// //         if (shouldRefresh || pageNum === 1) {
// //           setServices(data.data.posts);
// //           setFilteredServices(data.data.posts);
// //         } else {
// //           setServices((prev) => [...prev, ...data.data.posts]);
// //           setFilteredServices((prev) => [...prev, ...data.data.posts]);
// //         }
// //         setHasMore(data.data.pagination.has_next);
// //         setPage(pageNum);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching services:", error);
// //     } finally {
// //       setLoading(false);
// //       setLoadingMore(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const handleRefresh = () => {
// //     setRefreshing(true);
// //     setPage(1);
// //     fetchServices(1, true);
// //   };

// //   const handleLoadMore = () => {
// //     if (hasMore && !loadingMore) {
// //       fetchServices(page + 1);
// //     }
// //   };

// //   const handleSearch = (text) => {
// //     setSearchQuery(text);
// //     if (text.trim() === "") {
// //       setFilteredServices(services);
// //     } else {
// //       const filtered = services.filter(
// //         (service) =>
// //           service.title.toLowerCase().includes(text.toLowerCase()) ||
// //           service.company?.toLowerCase().includes(text.toLowerCase()) ||
// //           service.description?.toLowerCase().includes(text.toLowerCase())
// //       );
// //       setFilteredServices(filtered);
// //     }
// //   };

// //   const handleCategoryFilter = (categoryId) => {
// //     setSelectedCategory(categoryId);
// //     if (categoryId === "all") {
// //       setFilteredServices(services);
// //     } else {
// //       const filtered = services.filter((service) =>
// //         service.categories?.includes(parseInt(categoryId))
// //       );
// //       setFilteredServices(filtered);
// //     }
// //   };

// //   const openServiceDetails = (service) => {
// //     setSelectedService(service);
// //     setModalVisible(true);
// //     // Animate modal from bottom
// //     Animated.timing(slideAnimation, {
// //       toValue: 0,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const closeModal = () => {
// //     Animated.timing(slideAnimation, {
// //       toValue: height,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start(() => {
// //       setModalVisible(false);
// //       setSelectedService(null);
// //     });
// //   };

// //   const renderServiceCard = ({ item }) => (
// //     <TouchableOpacity
// //       style={styles.serviceCard}
// //       onPress={() => openServiceDetails(item)}
// //       activeOpacity={0.7}
// //     >
// //       <View style={styles.cardHeader}>
// //         {item.images && item.images.length > 0 ? (
// //           <Image
// //             source={{ uri: item.images[0].image }}
// //             style={styles.serviceImage}
// //           />
// //         ) : (
// //           <View style={[styles.serviceImage, styles.placeholderImage]}>
// //             <Icon name="image" size={30} color="#CBD5E0" />
// //           </View>
// //         )}
// //         <View style={styles.cardHeaderContent}>
// //           <Text style={styles.serviceTitle} numberOfLines={2}>
// //             {item.title}
// //           </Text>
// //           <Text style={styles.companyName}>{item.company || "Individual"}</Text>
// //           <View style={styles.priceContainer}>
// //             <Text style={styles.priceText}>{item.price_range}</Text>
// //           </View>
// //         </View>
// //       </View>

// //       <View style={styles.cardFooter}>
// //         <View style={styles.userInfo}>
// //           <Image
// //             source={
// //               item.user_profile_picture
// //                 ? { uri: item.user_profile_picture }
// //                 : require("../assets/images/avatar/blank-profile-picture-973460_1280.png")
// //             }
// //             style={styles.userAvatar}
// //           />
// //           <Text style={styles.userName}>{item.user_name}</Text>
// //         </View>
// //         <View style={styles.locationContainer}>
// //           <Icon name="location-on" size={16} color="#718096" />
// //           <Text style={styles.locationText} numberOfLines={1}>
// //             {item.location || "Location not specified"}
// //           </Text>
// //         </View>
// //       </View>

// //       {item.category_names && item.category_names.length > 0 && (
// //         <View style={styles.categoryTags}>
// //           {item.category_names.slice(0, 2).map((cat, index) => (
// //             <View key={index} style={styles.categoryTag}>
// //               <Text style={styles.categoryTagText}>{cat}</Text>
// //             </View>
// //           ))}
// //           {item.category_names.length > 2 && (
// //             <View style={styles.categoryTag}>
// //               <Text style={styles.categoryTagText}>+{item.category_names.length - 2}</Text>
// //             </View>
// //           )}
// //         </View>
// //       )}
// //     </TouchableOpacity>
// //   );

// //   const renderCategoryChip = ({ item }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.categoryChip,
// //         selectedCategory === item.id && styles.categoryChipActive,
// //       ]}
// //       onPress={() => handleCategoryFilter(item.id)}
// //     >
// //       <Text
// //         style={[
// //           styles.categoryChipText,
// //           selectedCategory === item.id && styles.categoryChipTextActive,
// //         ]}
// //       >
// //         {item.name}
// //       </Text>
// //     </TouchableOpacity>
// //   );

// //   const renderFooter = () => {
// //     if (!loadingMore) return null;
// //     return (
// //       <View style={styles.footerLoader}>
// //         <ActivityIndicator size="small" color="#0d64dd" />
// //         <Text style={styles.footerLoaderText}>Loading more...</Text>
// //       </View>
// //     );
// //   };

// //   const renderEmptyState = () => (
// //     <View style={styles.emptyState}>
// //       <Icon name="search-off" size={60} color="#CBD5E0" />
// //       <Text style={styles.emptyStateTitle}>No Services Found</Text>
// //       <Text style={styles.emptyStateText}>
// //         {searchQuery
// //           ? "Try adjusting your search or filters"
// //           : "Be the first to post a service"}
// //       </Text>
// //     </View>
// //   );

// //   const DetailModal = () => {
// //     if (!selectedService) return null;

// //     return (
// //       <Modal
// //         visible={modalVisible}
// //         transparent={true}
// //         animationType="none"
// //         onRequestClose={closeModal}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <Animated.View
// //             style={[
// //               styles.modalContent,
// //               {
// //                 transform: [{ translateY: slideAnimation }],
// //               },
// //             ]}
// //           >
// //             {/* Handle Bar */}
// //             <View style={styles.modalHandle}>
// //               <View style={styles.handleBar} />
// //             </View>

// //             <ScrollView
// //               showsVerticalScrollIndicator={false}
// //               contentContainerStyle={styles.modalScrollContent}
// //             >
// //               {/* Header Image */}
// //               <View style={styles.detailImageContainer}>
// //                 {selectedService.images && selectedService.images.length > 0 ? (
// //                   <Image
// //                     source={{ uri: selectedService.images[0].image }}
// //                     style={styles.detailImage}
// //                   />
// //                 ) : (
// //                   <View style={[styles.detailImage, styles.detailPlaceholderImage]}>
// //                     <Icon name="image" size={50} color="#CBD5E0" />
// //                   </View>
// //                 )}
                
// //                 {/* Image Gallery Dots */}
// //                 {selectedService.images && selectedService.images.length > 1 && (
// //                   <View style={styles.imageDots}>
// //                     {selectedService.images.map((_, index) => (
// //                       <View
// //                         key={index}
// //                         style={[
// //                           styles.imageDot,
// //                           index === 0 && styles.imageDotActive,
// //                         ]}
// //                       />
// //                     ))}
// //                   </View>
// //                 )}

// //                 {/* Close Button */}
// //                 <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
// //                   <Ionicons name="close" size={24} color="#fff" />
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Content */}
// //               <View style={styles.detailContent}>
// //                 {/* Title and Company */}
// //                 <View style={styles.detailHeader}>
// //                   <Text style={styles.detailTitle}>{selectedService.title}</Text>
// //                   <Text style={styles.detailCompany}>
// //                     {selectedService.company || "Individual Service Provider"}
// //                   </Text>
// //                 </View>

// //                 {/* Price and Location Row */}
// //                 <View style={styles.detailInfoRow}>
// //                   <View style={styles.detailPriceContainer}>
// //                     <Icon name="attach-money" size={20} color="#0d64dd" />
// //                     <Text style={styles.detailPrice}>{selectedService.price_range}</Text>
// //                   </View>
// //                   <View style={styles.detailLocationContainer}>
// //                     <Icon name="location-on" size={18} color="#718096" />
// //                     <Text style={styles.detailLocation}>
// //                       {selectedService.location || "Location not specified"}
// //                     </Text>
// //                   </View>
// //                 </View>

// //                 {/* Categories */}
// //                 {selectedService.category_names &&
// //                   selectedService.category_names.length > 0 && (
// //                     <View style={styles.detailCategories}>
// //                       <Text style={styles.detailSectionTitle}>Categories</Text>
// //                       <View style={styles.detailCategoryTags}>
// //                         {selectedService.category_names.map((cat, index) => (
// //                           <View key={index} style={styles.detailCategoryTag}>
// //                             <Text style={styles.detailCategoryTagText}>{cat}</Text>
// //                           </View>
// //                         ))}
// //                       </View>
// //                     </View>
// //                   )}

// //                 {/* Description */}
// //                 <View style={styles.detailSection}>
// //                   <Text style={styles.detailSectionTitle}>Description</Text>
// //                   <Text style={styles.detailDescription}>
// //                     {selectedService.description || "No description provided"}
// //                   </Text>
// //                 </View>

// //                 {/* Contact Information */}
// //                 <View style={styles.detailSection}>
// //                   <Text style={styles.detailSectionTitle}>Contact Information</Text>
                  
// //                   <View style={styles.contactItem}>
// //                     <Icon name="email" size={20} color="#0d64dd" />
// //                     <Text style={styles.contactText}>{selectedService.email}</Text>
// //                   </View>
                  
// //                   {selectedService.contactinfo && (
// //                     <View style={styles.contactItem}>
// //                       <Icon name="phone" size={20} color="#0d64dd" />
// //                       <Text style={styles.contactText}>{selectedService.contactinfo}</Text>
// //                     </View>
// //                   )}
// //                 </View>

// //                 {/* Experience & Availability */}
// //                 {(selectedService.experience_level || selectedService.availability) && (
// //                   <View style={styles.detailSection}>
// //                     <Text style={styles.detailSectionTitle}>Additional Details</Text>
                    
// //                     {selectedService.experience_level && (
// //                       <View style={styles.detailRow}>
// //                         <Icon name="work" size={18} color="#718096" />
// //                         <Text style={styles.detailRowText}>
// //                           Experience: {selectedService.experience_level}
// //                         </Text>
// //                       </View>
// //                     )}
                    
// //                     {selectedService.availability && (
// //                       <View style={styles.detailRow}>
// //                         <Icon name="access-time" size={18} color="#718096" />
// //                         <Text style={styles.detailRowText}>
// //                           Availability: {selectedService.availability}
// //                         </Text>
// //                       </View>
// //                     )}
// //                   </View>
// //                 )}

// //                 {/* Provider Info */}
// //                 <View style={styles.providerSection}>
// //                   <Image
// //                     source={
// //                       selectedService.user_profile_picture
// //                         ? { uri: selectedService.user_profile_picture }
// //                         : require("../assets/images/avatar/blank-profile-picture-973460_1280.png")
// //                     }
// //                     style={styles.providerAvatar}
// //                   />
// //                   <View style={styles.providerInfo}>
// //                     <Text style={styles.providerName}>{selectedService.user_name}</Text>
// //                     <Text style={styles.providerLabel}>Service Provider</Text>
// //                   </View>
// //                   <TouchableOpacity
// //                     style={styles.messageButton}
// //                     onPress={() => {
// //                       closeModal();
// //                       navigation.navigate("Chat", {
// //                         userId: selectedService.user,
// //                         userName: selectedService.user_name,
// //                       });
// //                     }}
// //                   >
// //                     <Ionicons name="chatbubble-outline" size={20} color="#fff" />
// //                     <Text style={styles.messageButtonText}>Message</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </ScrollView>
// //           </Animated.View>
// //         </View>
// //       </Modal>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //           <Ionicons name="arrow-back" size={24} color="#2D3748" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Services</Text>
// //         <TouchableOpacity
// //           onPress={() => navigation.navigate("CreateService")}
// //           style={styles.addButton}
// //         >
// //           <Ionicons name="add" size={24} color="#0d64dd" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Feather name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search services..."
// //           placeholderTextColor="#A0AEC0"
// //           value={searchQuery}
// //           onChangeText={handleSearch}
// //         />
// //         {searchQuery.length > 0 && (
// //           <TouchableOpacity onPress={() => handleSearch("")}>
// //             <Ionicons name="close-circle" size={20} color="#A0AEC0" />
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       {/* Categories Scroll */}
// //       {categories.length > 0 && (
// //         <View style={styles.categoriesContainer}>
// //           <FlatList
// //             data={categories}
// //             renderItem={renderCategoryChip}
// //             keyExtractor={(item) => item.id.toString()}
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={styles.categoriesList}
// //           />
// //         </View>
// //       )}

// //       {/* Services List */}
// //       {loading ? (
// //         <View style={styles.loaderContainer}>
// //           <ActivityIndicator size="large" color="#0d64dd" />
// //           <Text style={styles.loaderText}>Loading services...</Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={filteredServices}
// //           renderItem={renderServiceCard}
// //           keyExtractor={(item) => item.id.toString()}
// //           contentContainerStyle={styles.servicesList}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
// //           }
// //           onEndReached={handleLoadMore}
// //           onEndReachedThreshold={0.3}
// //           ListFooterComponent={renderFooter}
// //           ListEmptyComponent={renderEmptyState}
// //         />
// //       )}

// //       {/* Detail Modal */}
// //       <DetailModal />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: "#F7FAFC",
//   // },
//   // header: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   justifyContent: "space-between",
//   //   paddingHorizontal: 16,
//   //   paddingVertical: 12,
//   //   backgroundColor: "#fff",
//   //   borderBottomWidth: 1,
//   //   borderBottomColor: "#E2E8F0",
//   // },
//   // backButton: {
//   //   padding: 4,
//   // },
//   // headerTitle: {
//   //   fontSize: 20,
//   //   fontWeight: "700",
//   //   color: "#2D3748",
//   // },
//   // addButton: {
//   //   padding: 4,
//   // },
//   // searchContainer: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   backgroundColor: "#fff",
//   //   marginHorizontal: 16,
//   //   marginVertical: 12,
//   //   paddingHorizontal: 12,
//   //   borderRadius: 12,
//   //   borderWidth: 1,
//   //   borderColor: "#E2E8F0",
//   // },
//   // searchIcon: {
//   //   marginRight: 8,
//   // },
//   // searchInput: {
//   //   flex: 1,
//   //   paddingVertical: 12,
//   //   fontSize: 16,
//   //   color: "#2D3748",
//   // },
//   // categoriesContainer: {
//   //   marginBottom: 12,
//   // },
//   // categoriesList: {
//   //   paddingHorizontal: 16,
//   // },
//   // categoryChip: {
//   //   paddingHorizontal: 16,
//   //   paddingVertical: 8,
//   //   backgroundColor: "#EDF2F7",
//   //   borderRadius: 20,
//   //   marginRight: 8,
//   // },
//   // categoryChipActive: {
//   //   backgroundColor: "#0d64dd",
//   // },
//   // categoryChipText: {
//   //   fontSize: 14,
//   //   color: "#4A5568",
//   //   fontWeight: "500",
//   // },
//   // categoryChipTextActive: {
//   //   color: "#fff",
//   // },
//   // servicesList: {
//   //   paddingHorizontal: 16,
//   //   paddingBottom: 20,
//   // },
//   // serviceCard: {
//   //   backgroundColor: "#fff",
//   //   borderRadius: 16,
//   //   padding: 12,
//   //   marginBottom: 12,
//   //   shadowColor: "#000",
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowOpacity: 0.05,
//   //   shadowRadius: 8,
//   //   elevation: 2,
//   //   borderWidth: 1,
//   //   borderColor: "#EDF2F7",
//   // },
//   // cardHeader: {
//   //   flexDirection: "row",
//   //   marginBottom: 12,
//   // },
//   // serviceImage: {
//   //   width: 80,
//   //   height: 80,
//   //   borderRadius: 12,
//   //   marginRight: 12,
//   // },
//   // placeholderImage: {
//   //   backgroundColor: "#EDF2F7",
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   // },
//   // cardHeaderContent: {
//   //   flex: 1,
//   //   justifyContent: "space-between",
//   // },
//   // serviceTitle: {
//   //   fontSize: 16,
//   //   fontWeight: "600",
//   //   color: "#2D3748",
//   //   marginBottom: 4,
//   // },
//   // companyName: {
//   //   fontSize: 14,
//   //   color: "#718096",
//   //   marginBottom: 4,
//   // },
//   // priceContainer: {
//   //   backgroundColor: "#EBF8FF",
//   //   paddingHorizontal: 8,
//   //   paddingVertical: 4,
//   //   borderRadius: 6,
//   //   alignSelf: "flex-start",
//   // },
//   // priceText: {
//   //   fontSize: 13,
//   //   color: "#0d64dd",
//   //   fontWeight: "600",
//   // },
//   // cardFooter: {
//   //   flexDirection: "row",
//   //   justifyContent: "space-between",
//   //   alignItems: "center",
//   //   marginBottom: 8,
//   // },
//   // userInfo: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   // },
//   // userAvatar: {
//   //   width: 24,
//   //   height: 24,
//   //   borderRadius: 12,
//   //   marginRight: 6,
//   // },
//   // userName: {
//   //   fontSize: 13,
//   //   color: "#4A5568",
//   // },
//   // locationContainer: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   maxWidth: "50%",
//   // },
//   // locationText: {
//   //   fontSize: 12,
//   //   color: "#718096",
//   //   marginLeft: 4,
//   // },
//   // categoryTags: {
//   //   flexDirection: "row",
//   //   flexWrap: "wrap",
//   // },
//   // categoryTag: {
//   //   backgroundColor: "#EDF2F7",
//   //   paddingHorizontal: 8,
//   //   paddingVertical: 4,
//   //   borderRadius: 4,
//   //   marginRight: 6,
//   //   marginBottom: 4,
//   // },
//   // categoryTagText: {
//   //   fontSize: 11,
//   //   color: "#4A5568",
//   // },
//   // loaderContainer: {
//   //   flex: 1,
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   // },
//   // loaderText: {
//   //   marginTop: 12,
//   //   fontSize: 16,
//   //   color: "#718096",
//   // },
//   // footerLoader: {
//   //   flexDirection: "row",
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   //   paddingVertical: 16,
//   // },
//   // footerLoaderText: {
//   //   marginLeft: 8,
//   //   fontSize: 14,
//   //   color: "#718096",
//   // },
//   // emptyState: {
//   //   flex: 1,
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   //   paddingVertical: 60,
//   // },
//   // emptyStateTitle: {
//   //   fontSize: 18,
//   //   fontWeight: "600",
//   //   color: "#2D3748",
//   //   marginTop: 16,
//   //   marginBottom: 8,
//   // },
//   // emptyStateText: {
//   //   fontSize: 14,
//   //   color: "#718096",
//   //   textAlign: "center",
//   // },

//   // // Modal Styles
//   // modalOverlay: {
//   //   flex: 1,
//   //   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   //   justifyContent: "flex-end",
//   // },
//   // modalContent: {
//   //   backgroundColor: "#fff",
//   //   borderTopLeftRadius: 20,
//   //   borderTopRightRadius: 20,
//   //   height: height * 0.9,
//   // },
//   // modalHandle: {
//   //   alignItems: "center",
//   //   paddingTop: 12,
//   //   paddingBottom: 8,
//   // },
//   // handleBar: {
//   //   width: 40,
//   //   height: 4,
//   //   backgroundColor: "#CBD5E0",
//   //   borderRadius: 2,
//   // },
//   // modalScrollContent: {
//   //   paddingBottom: 30,
//   // },
//   // closeButton: {
//   //   position: "absolute",
//   //   top: 16,
//   //   right: 16,
//   //   backgroundColor: "rgba(0,0,0,0.5)",
//   //   borderRadius: 20,
//   //   padding: 8,
//   // },
//   // detailImageContainer: {
//   //   position: "relative",
//   //   height: 250,
//   // },
//   // detailImage: {
//   //   width: "100%",
//   //   height: 250,
//   // },
//   // detailPlaceholderImage: {
//   //   backgroundColor: "#EDF2F7",
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   // },
//   // imageDots: {
//   //   flexDirection: "row",
//   //   position: "absolute",
//   //   bottom: 16,
//   //   alignSelf: "center",
//   // },
//   // imageDot: {
//   //   width: 8,
//   //   height: 8,
//   //   borderRadius: 4,
//   //   backgroundColor: "rgba(255,255,255,0.5)",
//   //   marginHorizontal: 4,
//   // },
//   // imageDotActive: {
//   //   backgroundColor: "#fff",
//   //   width: 12,
//   // },
//   // detailContent: {
//   //   padding: 20,
//   // },
//   // detailHeader: {
//   //   marginBottom: 16,
//   // },
//   // detailTitle: {
//   //   fontSize: 24,
//   //   fontWeight: "700",
//   //   color: "#2D3748",
//   //   marginBottom: 4,
//   // },
//   // detailCompany: {
//   //   fontSize: 16,
//   //   color: "#718096",
//   // },
//   // detailInfoRow: {
//   //   flexDirection: "row",
//   //   justifyContent: "space-between",
//   //   alignItems: "center",
//   //   marginBottom: 20,
//   // },
//   // detailPriceContainer: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   backgroundColor: "#EBF8FF",
//   //   paddingHorizontal: 12,
//   //   paddingVertical: 6,
//   //   borderRadius: 8,
//   // },
//   // detailPrice: {
//   //   fontSize: 18,
//   //   fontWeight: "700",
//   //   color: "#0d64dd",
//   //   marginLeft: 4,
//   // },
//   // detailLocationContainer: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   // },
//   // detailLocation: {
//   //   fontSize: 14,
//   //   color: "#718096",
//   //   marginLeft: 4,
//   // },
//   // detailSection: {
//   //   marginBottom: 20,
//   // },
//   // detailSectionTitle: {
//   //   fontSize: 18,
//   //   fontWeight: "600",
//   //   color: "#2D3748",
//   //   marginBottom: 12,
//   // },
//   // detailDescription: {
//   //   fontSize: 15,
//   //   color: "#4A5568",
//   //   lineHeight: 22,
//   // },
//   // detailCategories: {
//   //   marginBottom: 20,
//   // },
//   // detailCategoryTags: {
//   //   flexDirection: "row",
//   //   flexWrap: "wrap",
//   // },
//   // detailCategoryTag: {
//   //   backgroundColor: "#EDF2F7",
//   //   paddingHorizontal: 12,
//   //   paddingVertical: 6,
//   //   borderRadius: 20,
//   //   marginRight: 8,
//   //   marginBottom: 8,
//   // },
//   // detailCategoryTagText: {
//   //   fontSize: 13,
//   //   color: "#4A5568",
//   // },
//   // contactItem: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   marginBottom: 12,
//   // },
//   // contactText: {
//   //   fontSize: 15,
//   //   color: "#4A5568",
//   //   marginLeft: 12,
//   // },
//   // detailRow: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   marginBottom: 8,
//   // },
//   // detailRowText: {
//   //   fontSize: 14,
//   //   color: "#718096",
//   //   marginLeft: 8,
//   // },
//   // providerSection: {
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   backgroundColor: "#F7FAFC",
//   //   padding: 16,
//   //   borderRadius: 12,
//   //   marginTop: 10,
//   // },
//   // providerAvatar: {
//   //   width: 48,
//   //   height: 48,
//   //   borderRadius: 24,
//   //   marginRight: 12,
//   // },
//   // providerInfo: {
//   //   flex: 1,
//   // },
//   // providerName: {
//   //   fontSize: 16,
//   //   fontWeight: "600",
//   //   color: "#2D3748",
//   // },
//   // providerLabel: {
//   //   fontSize: 13,
//   //   color: "#718096",
//   // },
//   // messageButton: {
//   //   backgroundColor: "#0d64dd",
//   //   flexDirection: "row",
//   //   alignItems: "center",
//   //   paddingHorizontal: 16,
//   //   paddingVertical: 8,
//   //   borderRadius: 20,
//   // },
//   // messageButtonText: {
//   //   color: "#fff",
//   //   fontSize: 14,
//   //   fontWeight: "600",
//   //   marginLeft: 6,
//   // },
// // });

// // export default ServicesScreen;
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   StatusBar,
//   Platform,
//   SafeAreaView,
//   Modal,
//   ScrollView,
//   Animated,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import Feather from "react-native-vector-icons/Feather";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_ROUTE } from "../api_routing/api";

// const { width, height } = Dimensions.get("window");

// // Custom Image Component with HTTPS conversion for all images
// const ServiceImage = ({ imageUrl, style, placeholderIcon, isAvatar = false }) => {
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Function to get secure HTTPS URL
//   const getSecureUrl = (url) => {
//     if (!url) return null;
    
//     // If it's a full URL with HTTP, convert to HTTPS
//     if (url.startsWith('http://')) {
//       const httpsUrl = url.replace('http://', 'https://');
//       console.log('Converting to HTTPS:', { original: url, converted: httpsUrl });
//       return httpsUrl;
//     }
    
//     // If it's a relative path (starts with /), prepend HTTPS base URL
//     if (url.startsWith('/')) {
//       const baseUrl = 'https://showa.essential.com.ng';
//       const fullUrl = `${baseUrl}${url}`;
//       console.log('Building profile URL:', { original: url, full: fullUrl });
//       return fullUrl;
//     }
    
//     // Return as is for HTTPS or other
//     return url;
//   };

//   const secureUrl = getSecureUrl(imageUrl);

//   if (error || !imageUrl) {
//     return (
//       <View style={[style, styles.placeholderImage]}>
//         {placeholderIcon || (
//           <Icon 
//             name={isAvatar ? "person" : "image"} 
//             size={isAvatar ? 20 : 30} 
//             color="#CBD5E0" 
//           />
//         )}
//       </View>
//     );
//   }

//   return (
//     <View style={style}>
//       {loading && (
//         <View style={[style, styles.imageLoading]}>
//           <ActivityIndicator size="small" color="#0d64dd" />
//         </View>
//       )}
//       <Image
//         source={{ uri: secureUrl }}
//         style={[style, loading && styles.imageHidden]}
//         onLoadStart={() => setLoading(true)}
//         onLoadEnd={() => setLoading(false)}
//         onError={(e) => {
//           console.log('Failed to load image:', secureUrl, e.nativeEvent.error);
//           setError(true);
//           setLoading(false);
//         }}
//         resizeMode="cover"
//       />
//     </View>
//   );
// };

// const ServicesScreen = ({ navigation }) => {
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Animation for modal
//   const slideAnimation = useRef(new Animated.Value(height)).current;

//   // Fetch categories
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch services
//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_ROUTE}/services/categories/`);
//       const data = await response.json();
//       if (data.success) {
//         setCategories([{ id: "all", name: "All Services" }, ...data.data.categories]);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchServices = async (pageNum = 1, shouldRefresh = false) => {
//     try {
//       if (pageNum === 1) {
//         setLoading(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const response = await fetch(
//         `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
//       );
//       const data = await response.json();

//       if (data.success) {
//         if (shouldRefresh || pageNum === 1) {
//           setServices(data.data.posts);
//           setFilteredServices(data.data.posts);
//         } else {
//           setServices((prev) => [...prev, ...data.data.posts]);
//           setFilteredServices((prev) => [...prev, ...data.data.posts]);
//         }
//         setHasMore(data.data.pagination.has_next);
//         setPage(pageNum);
//       }
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//     fetchServices(1, true);
//   };

//   const handleLoadMore = () => {
//     if (hasMore && !loadingMore) {
//       fetchServices(page + 1);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     if (text.trim() === "") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter(
//         (service) =>
//           service.title.toLowerCase().includes(text.toLowerCase()) ||
//           service.company?.toLowerCase().includes(text.toLowerCase()) ||
//           service.description?.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredServices(filtered);
//     }
//   };

//   const handleCategoryFilter = (categoryId) => {
//     setSelectedCategory(categoryId);
//     if (categoryId === "all") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter((service) =>
//         service.categories?.includes(parseInt(categoryId))
//       );
//       setFilteredServices(filtered);
//     }
//   };

//   const openServiceDetails = (service) => {
//     setSelectedService(service);
//     setModalVisible(true);
//     // Animate modal from bottom
//     Animated.timing(slideAnimation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.timing(slideAnimation, {
//       toValue: height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setModalVisible(false);
//       setSelectedService(null);
//     });
//   };

//   const renderServiceCard = ({ item }) => {
//     // Get image URL from the first image in array
//     const imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
    
//     return (
//       <TouchableOpacity
//         style={styles.serviceCard}
//         onPress={() => openServiceDetails(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.cardHeader}>
//           <ServiceImage
//             imageUrl={imageUrl}
//             style={styles.serviceImage}
//             placeholderIcon={<Icon name="image" size={30} color="#CBD5E0" />}
//           />
//           <View style={styles.cardHeaderContent}>
//             <Text style={styles.serviceTitle} numberOfLines={2}>
//               {item.title}
//             </Text>
//             <Text style={styles.companyName}>{item.company || "Individual"}</Text>
//             <View style={styles.priceContainer}>
//               <Text style={styles.priceText}>{item.price_range}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.cardFooter}>
//           <View style={styles.userInfo}>
//             <ServiceImage
//               imageUrl={item.user_profile_picture}
//               style={styles.userAvatar}
//               isAvatar={true}
//               placeholderIcon={<Icon name="person" size={16} color="#CBD5E0" />}
//             />
//             <Text style={styles.userName}>{item.user_name}</Text>
//           </View>
//           <View style={styles.locationContainer}>
//             <Icon name="location-on" size={16} color="#718096" />
//             <Text style={styles.locationText} numberOfLines={1}>
//               {item.location || "Location not specified"}
//             </Text>
//           </View>
//         </View>

//         {item.category_names && item.category_names.length > 0 && (
//           <View style={styles.categoryTags}>
//             {item.category_names.slice(0, 2).map((cat, index) => (
//               <View key={index} style={styles.categoryTag}>
//                 <Text style={styles.categoryTagText}>{cat}</Text>
//               </View>
//             ))}
//             {item.category_names.length > 2 && (
//               <View style={styles.categoryTag}>
//                 <Text style={styles.categoryTagText}>+{item.category_names.length - 2}</Text>
//               </View>
//             )}
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderCategoryChip = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryChip,
//         selectedCategory === item.id && styles.categoryChipActive,
//       ]}
//       onPress={() => handleCategoryFilter(item.id)}
//     >
//       <Text
//         style={[
//           styles.categoryChipText,
//           selectedCategory === item.id && styles.categoryChipTextActive,
//         ]}
//       >
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderFooter = () => {
//     if (!loadingMore) return null;
//     return (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color="#0d64dd" />
//         <Text style={styles.footerLoaderText}>Loading more...</Text>
//       </View>
//     );
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Icon name="search-off" size={60} color="#CBD5E0" />
//       <Text style={styles.emptyStateTitle}>No Services Found</Text>
//       <Text style={styles.emptyStateText}>
//         {searchQuery
//           ? "Try adjusting your search or filters"
//           : "Be the first to post a service"}
//       </Text>
//     </View>
//   );

//   const DetailModal = () => {
//     if (!selectedService) return null;

//     // Get image URL from the first image in array
//     const imageUrl = selectedService.images && selectedService.images.length > 0 
//       ? selectedService.images[0].image 
//       : null;

//     return (
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="none"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.modalContent,
//               {
//                 transform: [{ translateY: slideAnimation }],
//               },
//             ]}
//           >
//             {/* Handle Bar */}
//             <View style={styles.modalHandle}>
//               <View style={styles.handleBar} />
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.modalScrollContent}
//             >
//               {/* Header Image */}
//               <View style={styles.detailImageContainer}>
//                 <ServiceImage
//                   imageUrl={imageUrl}
//                   style={styles.detailImage}
//                   placeholderIcon={<Icon name="image" size={50} color="#CBD5E0" />}
//                 />
                
//                 {/* Image Gallery Dots */}
//                 {selectedService.images && selectedService.images.length > 1 && (
//                   <View style={styles.imageDots}>
//                     {selectedService.images.map((_, index) => (
//                       <View
//                         key={index}
//                         style={[
//                           styles.imageDot,
//                           index === 0 && styles.imageDotActive,
//                         ]}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 {/* Close Button */}
//                 <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//                   <Ionicons name="close" size={24} color="#fff" />
//                 </TouchableOpacity>
//               </View>

//               {/* Content */}
//               <View style={styles.detailContent}>
//                 {/* Title and Company */}
//                 <View style={styles.detailHeader}>
//                   <Text style={styles.detailTitle}>{selectedService.title}</Text>
//                   <Text style={styles.detailCompany}>
//                     {selectedService.company || "Individual Service Provider"}
//                   </Text>
//                 </View>

//                 {/* Price and Location Row */}
//                 <View style={styles.detailInfoRow}>
//                   <View style={styles.detailPriceContainer}>
//                     <Icon name="attach-money" size={20} color="#0d64dd" />
//                     <Text style={styles.detailPrice}>{selectedService.price_range}</Text>
//                   </View>
//                   <View style={styles.detailLocationContainer}>
//                     <Icon name="location-on" size={18} color="#718096" />
//                     <Text style={styles.detailLocation}>
//                       {selectedService.location || "Location not specified"}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Categories */}
//                 {selectedService.category_names &&
//                   selectedService.category_names.length > 0 && (
//                     <View style={styles.detailCategories}>
//                       <Text style={styles.detailSectionTitle}>Categories</Text>
//                       <View style={styles.detailCategoryTags}>
//                         {selectedService.category_names.map((cat, index) => (
//                           <View key={index} style={styles.detailCategoryTag}>
//                             <Text style={styles.detailCategoryTagText}>{cat}</Text>
//                           </View>
//                         ))}
//                       </View>
//                     </View>
//                   )}

//                 {/* Description */}
//                 <View style={styles.detailSection}>
//                   <Text style={styles.detailSectionTitle}>Description</Text>
//                   <Text style={styles.detailDescription}>
//                     {selectedService.description || "No description provided"}
//                   </Text>
//                 </View>

//                 {/* Contact Information */}
//                 <View style={styles.detailSection}>
//                   <Text style={styles.detailSectionTitle}>Contact Information</Text>
                  
//                   <View style={styles.contactItem}>
//                     <Icon name="email" size={20} color="#0d64dd" />
//                     <Text style={styles.contactText}>{selectedService.email}</Text>
//                   </View>
                  
//                   {selectedService.contactinfo && (
//                     <View style={styles.contactItem}>
//                       <Icon name="phone" size={20} color="#0d64dd" />
//                       <Text style={styles.contactText}>{selectedService.contactinfo}</Text>
//                     </View>
//                   )}
//                 </View>

//                 {/* Experience & Availability */}
//                 {(selectedService.experience_level || selectedService.availability) && (
//                   <View style={styles.detailSection}>
//                     <Text style={styles.detailSectionTitle}>Additional Details</Text>
                    
//                     {selectedService.experience_level && (
//                       <View style={styles.detailRow}>
//                         <Icon name="work" size={18} color="#718096" />
//                         <Text style={styles.detailRowText}>
//                           Experience: {selectedService.experience_level}
//                         </Text>
//                       </View>
//                     )}
                    
//                     {selectedService.availability && (
//                       <View style={styles.detailRow}>
//                         <Icon name="access-time" size={18} color="#718096" />
//                         <Text style={styles.detailRowText}>
//                           Availability: {selectedService.availability}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 {/* Provider Info */}
//                 <View style={styles.providerSection}>
//                   <ServiceImage
//                     imageUrl={selectedService.user_profile_picture}
//                     style={styles.providerAvatar}
//                     isAvatar={true}
//                     placeholderIcon={<Icon name="person" size={24} color="#CBD5E0" />}
//                   />
//                   <View style={styles.providerInfo}>
//                     <Text style={styles.providerName}>{selectedService.user_name}</Text>
//                     <Text style={styles.providerLabel}>Service Provider</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.messageButton}
//                     onPress={() => {
//                       closeModal();
//                       // navigation.navigate("Chat", {
//                       //   userId: selectedService.user,
//                       //   userName: selectedService.user_name,
//                       // });
//                       navigation.navigate('BPrivateChat', {
//                       receiverId: selectedService.user,
//                       name: selectedService.user_name,
//                       chatType: 'single',
//                       profile_image: selectedService.user_profile_picture,
//                     });
//                     }}
//                   >
//                     <Ionicons name="chatbubble-outline" size={20} color="#fff" />
//                     <Text style={styles.messageButtonText}>Message</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>
//           </Animated.View>
//         </View>
//       </Modal>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#2D3748" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Services</Text>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("CreateService")}
//           style={styles.addButton}
//         >
//           <Ionicons name="add" size={24} color="#0d64dd" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Feather name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search services..."
//           placeholderTextColor="#A0AEC0"
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => handleSearch("")}>
//             <Ionicons name="close-circle" size={20} color="#A0AEC0" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Categories Scroll */}
//       {categories.length > 0 && (
//         <View style={styles.categoriesContainer}>
//           <FlatList
//             data={categories}
//             renderItem={renderCategoryChip}
//             keyExtractor={(item) => item.id.toString()}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoriesList}
//           />
//         </View>
//       )}

//       {/* Services List */}
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#0d64dd" />
//           <Text style={styles.loaderText}>Loading services...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredServices}
//           renderItem={renderServiceCard}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.servicesList}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//           }
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.3}
//           ListFooterComponent={renderFooter}
//           ListEmptyComponent={renderEmptyState}
//         />
//       )}

//       {/* Detail Modal */}
//       <DetailModal />
//     </SafeAreaView>
//   );
// };

// // Add these new styles
// const styles = StyleSheet.create({
//   // ... keep all your existing styles
  
//   // Add these new styles for the image component
//   imageLoading: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     zIndex: 1,
//   },
//   imageHidden: {
//     opacity: 0,
//   },
//   placeholderImage: {
//     backgroundColor: '#EDF2F7',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//     container: {
//     flex: 1,
//     backgroundColor: "#F7FAFC",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#2D3748",
//   },
//   addButton: {
//     padding: 4,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: "#2D3748",
//   },
//   categoriesContainer: {
//     marginBottom: 12,
//   },
//   categoriesList: {
//     paddingHorizontal: 16,
//   },
//   categoryChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#EDF2F7",
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   categoryChipActive: {
//     backgroundColor: "#0d64dd",
//   },
//   categoryChipText: {
//     fontSize: 14,
//     color: "#4A5568",
//     fontWeight: "500",
//   },
//   categoryChipTextActive: {
//     color: "#fff",
//   },
//   servicesList: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   serviceCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#EDF2F7",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   serviceImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//     marginRight: 12,
//   },
//   placeholderImage: {
//     backgroundColor: "#EDF2F7",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardHeaderContent: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2D3748",
//     marginBottom: 4,
//   },
//   companyName: {
//     fontSize: 14,
//     color: "#718096",
//     marginBottom: 4,
//   },
//   priceContainer: {
//     backgroundColor: "#EBF8FF",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     alignSelf: "flex-start",
//   },
//   priceText: {
//     fontSize: 13,
//     color: "#0d64dd",
//     fontWeight: "600",
//   },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   userAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 6,
//   },
//   userName: {
//     fontSize: 13,
//     color: "#4A5568",
//   },
//   locationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     maxWidth: "50%",
//   },
//   locationText: {
//     fontSize: 12,
//     color: "#718096",
//     marginLeft: 4,
//   },
//   categoryTags: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   categoryTag: {
//     backgroundColor: "#EDF2F7",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     marginRight: 6,
//     marginBottom: 4,
//   },
//   categoryTagText: {
//     fontSize: 11,
//     color: "#4A5568",
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loaderText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: "#718096",
//   },
//   footerLoader: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 16,
//   },
//   footerLoaderText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: "#718096",
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 60,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2D3748",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: "#718096",
//     textAlign: "center",
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: height * 0.9,
//   },
//   modalHandle: {
//     alignItems: "center",
//     paddingTop: 12,
//     paddingBottom: 8,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: "#CBD5E0",
//     borderRadius: 2,
//   },
//   modalScrollContent: {
//     paddingBottom: 30,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 20,
//     padding: 8,
//   },
//   detailImageContainer: {
//     position: "relative",
//     height: 250,
//   },
//   detailImage: {
//     width: "100%",
//     height: 250,
//   },
//   detailPlaceholderImage: {
//     backgroundColor: "#EDF2F7",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imageDots: {
//     flexDirection: "row",
//     position: "absolute",
//     bottom: 16,
//     alignSelf: "center",
//   },
//   imageDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "rgba(255,255,255,0.5)",
//     marginHorizontal: 4,
//   },
//   imageDotActive: {
//     backgroundColor: "#fff",
//     width: 12,
//   },
//   detailContent: {
//     padding: 20,
//   },
//   detailHeader: {
//     marginBottom: 16,
//   },
//   detailTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#2D3748",
//     marginBottom: 4,
//   },
//   detailCompany: {
//     fontSize: 16,
//     color: "#718096",
//   },
//   detailInfoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   detailPriceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EBF8FF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   detailPrice: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0d64dd",
//     marginLeft: 4,
//   },
//   detailLocationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   detailLocation: {
//     fontSize: 14,
//     color: "#718096",
//     marginLeft: 4,
//   },
//   detailSection: {
//     marginBottom: 20,
//   },
//   detailSectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2D3748",
//     marginBottom: 12,
//   },
//   detailDescription: {
//     fontSize: 15,
//     color: "#4A5568",
//     lineHeight: 22,
//   },
//   detailCategories: {
//     marginBottom: 20,
//   },
//   detailCategoryTags: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   detailCategoryTag: {
//     backgroundColor: "#EDF2F7",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   detailCategoryTagText: {
//     fontSize: 13,
//     color: "#4A5568",
//   },
//   contactItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   contactText: {
//     fontSize: 15,
//     color: "#4A5568",
//     marginLeft: 12,
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   detailRowText: {
//     fontSize: 14,
//     color: "#718096",
//     marginLeft: 8,
//   },
//   providerSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F7FAFC",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   providerAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   providerInfo: {
//     flex: 1,
//   },
//   providerName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2D3748",
//   },
//   providerLabel: {
//     fontSize: 13,
//     color: "#718096",
//   },
//   messageButton: {
//     backgroundColor: "#0d64dd",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   messageButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 6,
//   },
// });

// export default ServicesScreen;
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
  SafeAreaView,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { API_ROUTE } from "../api_routing/api";

const { width, height } = Dimensions.get("window");

// SIMPLIFIED Image Component for debugging
const ServiceImage = ({ imageUrl, style, isAvatar = false }) => {
  const [error, setError] = useState(false);
  
  console.log('🎨 ServiceImage received:', { 
    imageUrl, 
    type: typeof imageUrl,
    isAvatar 
  });

  // If no image URL or error, show placeholder
  if (!imageUrl || error) {
    console.log('📦 Showing placeholder for:', imageUrl);
    return (
      <View style={[style, { backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center' }]}>
        <Icon 
          name={isAvatar ? "person" : "image"} 
          size={isAvatar ? 20 : 30} 
          color="#CBD5E0" 
        />
      </View>
    );
  }

  // For service images (HTTP), convert to HTTPS
  let finalUrl = imageUrl;
  if (typeof imageUrl === 'string' && imageUrl.startsWith('http://')) {
    finalUrl = imageUrl.replace('http://', 'https://');
    console.log('🔒 Converted HTTP to HTTPS:', { original: imageUrl, final: finalUrl });
  }
  
  // For relative paths (profile images)
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
    finalUrl = `https://showa.essential.com.ng${imageUrl}`;
    console.log('🔗 Built profile URL:', { original: imageUrl, final: finalUrl });
  }

  console.log('🚀 Attempting to load image:', finalUrl);

  return (
    <Image
      source={{ uri: finalUrl }}
      style={style}
      onError={(e) => {
        console.log('❌ Image failed to load:', finalUrl, e.nativeEvent.error);
        setError(true);
      }}
      onLoad={() => console.log('✅ Image loaded successfully:', finalUrl)}
      resizeMode="cover"
    />
  );
};

const ServicesScreen = ({ navigation }) => {
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

  // Animation for modal
  const slideAnimation = useRef(new Animated.Value(height)).current;

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
        `${API_ROUTE}/services/all/?page=${pageNum}&page_size=10`
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
          service.title.toLowerCase().includes(text.toLowerCase()) ||
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

  const openServiceDetails = (service) => {
    console.log('🔍 Opening service details:', service.id, service.title);
    console.log('🖼️ Service images:', service.images);
    setSelectedService(service);
    setModalVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedService(null);
    });
  };

  const renderServiceCard = ({ item }) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
    
    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => openServiceDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <ServiceImage
            imageUrl={imageUrl}
            style={styles.serviceImage}
          />
          <View style={styles.cardHeaderContent}>
            <Text style={styles.serviceTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.companyName}>{item.company || "Individual"}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{item.price_range}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.userInfo}>
            <ServiceImage
              imageUrl={item.user_profile_picture}
              style={styles.userAvatar}
              isAvatar={true}
            />
            <Text style={styles.userName}>{item.user_name}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color="#718096" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location || "Location not specified"}
            </Text>
          </View>
        </View>

        {item.category_names && item.category_names.length > 0 && (
          <View style={styles.categoryTags}>
            {item.category_names.slice(0, 2).map((cat, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{cat}</Text>
              </View>
            ))}
            {item.category_names.length > 2 && (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>+{item.category_names.length - 2}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0d64dd" />
        <Text style={styles.footerLoaderText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={60} color="#CBD5E0" />
      <Text style={styles.emptyStateTitle}>No Services Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? "Try adjusting your search or filters"
          : "Be the first to post a service"}
      </Text>
    </View>
  );

  const DetailModal = () => {
    if (!selectedService) return null;

    const imageUrl = selectedService.images && selectedService.images.length > 0 
      ? selectedService.images[0].image 
      : null;

    console.log('📱 Modal rendering with image:', imageUrl);

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Header Image */}
              <View style={styles.detailImageContainer}>
                <ServiceImage
                  imageUrl={imageUrl}
                  style={styles.detailImage}
                />
                
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{selectedService.title}</Text>
                  <Text style={styles.detailCompany}>
                    {selectedService.company || "Individual Service Provider"}
                  </Text>
                </View>

                <View style={styles.detailInfoRow}>
                  <View style={styles.detailPriceContainer}>
                    <Icon name="attach-money" size={20} color="#0d64dd" />
                    <Text style={styles.detailPrice}>{selectedService.price_range}</Text>
                  </View>
                  <View style={styles.detailLocationContainer}>
                    <Icon name="location-on" size={18} color="#718096" />
                    <Text style={styles.detailLocation}>
                      {selectedService.location || "Location not specified"}
                    </Text>
                  </View>
                </View>

                {selectedService.category_names &&
                  selectedService.category_names.length > 0 && (
                    <View style={styles.detailCategories}>
                      <Text style={styles.detailSectionTitle}>Categories</Text>
                      <View style={styles.detailCategoryTags}>
                        {selectedService.category_names.map((cat, index) => (
                          <View key={index} style={styles.detailCategoryTag}>
                            <Text style={styles.detailCategoryTagText}>{cat}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Description</Text>
                  <Text style={styles.detailDescription}>
                    {selectedService.description || "No description provided"}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Contact Information</Text>
                  
                  <View style={styles.contactItem}>
                    <Icon name="email" size={20} color="#0d64dd" />
                    <Text style={styles.contactText}>{selectedService.email}</Text>
                  </View>
                  
                  {selectedService.contactinfo && (
                    <View style={styles.contactItem}>
                      <Icon name="phone" size={20} color="#0d64dd" />
                      <Text style={styles.contactText}>{selectedService.contactinfo}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.providerSection}>
                  <ServiceImage
                    imageUrl={selectedService.user_profile_picture}
                    style={styles.providerAvatar}
                    isAvatar={true}
                  />
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{selectedService.user_name}</Text>
                    <Text style={styles.providerLabel}>Service Provider</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                      closeModal();
                     navigation.navigate('BPrivateChat', {
                      receiverId: selectedService.user,
                      name: selectedService.user_name,
                      chatType: 'single',
                      profile_image: selectedService.user_profile_picture,
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
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateServices")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#0d64dd" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        )}
      </View>

      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0d64dd" />
          <Text style={styles.loaderText}>Loading services...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      <DetailModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2D3748",
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
    backgroundColor: "#EDF2F7",
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#0d64dd",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#4A5568",
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDF2F7",
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
    backgroundColor: "#EDF2F7",
  },
  cardHeaderContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  priceContainer: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  priceText: {
    fontSize: 13,
    color: "#0d64dd",
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
    backgroundColor: "#EDF2F7",
  },
  userName: {
    fontSize: 13,
    color: "#4A5568",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "50%",
  },
  locationText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  categoryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryTag: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryTagText: {
    fontSize: 11,
    color: "#4A5568",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#718096",
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
    color: "#718096",
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
    color: "#2D3748",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9,
  },
  modalHandle: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#CBD5E0",
    borderRadius: 2,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  detailImageContainer: {
    position: "relative",
    height: 250,
    width: "100%",
    backgroundColor: "#EDF2F7",
  },
  detailImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#EDF2F7",
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
    color: "#2D3748",
    marginBottom: 4,
  },
  detailCompany: {
    fontSize: 16,
    color: "#718096",
  },
  detailInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  detailPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0d64dd",
    marginLeft: 4,
  },
  detailLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLocation: {
    fontSize: 14,
    color: "#718096",
    marginLeft: 4,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 15,
    color: "#4A5568",
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
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  detailCategoryTagText: {
    fontSize: 13,
    color: "#4A5568",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: "#4A5568",
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailRowText: {
    fontSize: 14,
    color: "#718096",
    marginLeft: 8,
  },
  providerSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#EDF2F7",
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  providerLabel: {
    fontSize: 13,
    color: "#718096",
  },
  messageButton: {
    backgroundColor: "#0d64dd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default ServicesScreen;
