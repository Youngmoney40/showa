
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Dimensions
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import { Linking } from 'react-native';

// const { width } = Dimensions.get('window');
// const itemsPerPage = 10;

// const API_CONFIGS = [
//   {
//     "url": "https://autoapi.theautographcollections.ng/api/getAllFashion",
//     "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "title",
//       "image": "image1",
//       "slug": "slug",
//       "websiteName": "The Autograph Collections",
//       "linkBase": "https://theautographcollections.ng/content/",
//       "streetAddress": "address"
//     },
//     "resultKey": "posts",
//     "totalKey": "total",
//     "searchCategories": ["latest", "blog", "magazine", "fashion"],
//     "icon": "Home"
//   },
//   {
//     "url": "https://api.evenue.ng/api/getAllVenues",
//     "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "title",
//       "image": "coverImage",
//       "slug": "slug",
//       "websiteName": "(Evenue) Get available venue, events services for all types of event",
//       "linkBase": "https://evenue.ng/venue/",
//       "streetAddress": "fullAddress"
//     },
//     "resultKey": "venues",
//     "totalKey": "totalVenues",
//     "searchCategories": ["venue", "venues", "party", "conference", "halls", "weddings"],
//     "icon": "Building"
//   },
//   {
//     "url": "https://api.evenue.ng/api/getAllEvents",
//     "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "title",
//       "image": "coverImage",
//       "slug": "slug",
//       "eventType": "eventType",
//       "websiteName": "(Evenue) Get available upcoming and live events on Evenue",
//       "linkBase": "https://evenue.ng/event-showcase",
//       "streetAddress": "location"
//     },
//     "resultKey": "events",
//     "totalKey": "total",
//     "searchCategories": ["events", "conference", "webinar", "meetings", "live", "upcoming events"],
//     "icon": "Building"
//   },
//   {
//     "url": "https://api-whoiswho.tests.com.ng/api/getAllBiographies",
//     "queryParams": (page, query) => ({ search: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "title",
//       "image": "image1",
//       "slug": "slug",
//       "websiteName": "(WhoIsWho)..Know who is who in nigeria and beyond",
//       "linkBase": "https://whoiswho.tests.com.ng/biography/",
//       "streetAddress": "address"
//     },
//     "resultKey": "biographies",
//     "totalKey": "total",
//     "searchCategories": ["bio", "biography", "person", "people", "profile", "history"],
//     "icon": "User"
//   },
//   {
//     "url": "https://hotelbackend.edirect.ng/api/property/search",
//     "queryParams": (page, query, search_term) => ({ searchTerm: query || search_term, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "hotel_name",
//       "image": "photos[0].photo_path",
//       "slug": "id",
//       "websiteName": "eDirect Hotels",
//       "linkBase": "https://ehotels.ng/hotel/",
//       "streetAddress": "street_address"
//     },
//     "resultKey": "data",
//     "totalKey": "total",
//     "searchCategories": ["hotel", "hotels", "accommodation", "stay", "lodging"],
//     "icon": "Building"
//   },
//   {
//     "url": "https://backend.ejobs.com.ng/api/v1/job/externalJobs",
//     "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "jobTitle",
//       "image": null,
//       "slug": "_id",
//       "websiteName": "eJobs",
//       "linkBase": "https://ejobs.com.ng/job/",
//       "streetAddress": "address",
//       "companyName": "employer.companyName",
//       "salary": "salary",
//       "state": "state"
//     },
//     "resultKey": "data",
//     "totalKey": "total",
//     "searchCategories": ["job", "jobs", "career", "employment", "work", "works", "ejobs"],
//     "icon": "Building"
//   },
//   {
//     "url": "https://api.eschoolconnect.ng/eschools/schools/filter-schools",
//     "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "schoolName",
//       "image": null,
//       "slug": "slug",
//       "websiteName": "eSchoolConnect",
//       "linkBase": "https://eschoolconnect.ng/schooldetail/",
//       "streetAddress": "state"
//     },
//     "resultKey": "data",
//     "totalKey": "total",
//     "searchCategories": ["school", "schools", "education", "learning", "academy"],
//     "icon": "Building"
//   },
//   {
//     "url": "https://backend.edirect.ng/api/search?",
//     "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "name",
//       "image": "primary_image",
//       "slug": "slug",
//       "websiteName": "Essential Directories",
//       "linkBase": "https://edirect.ng/",
//       "streetAddress": "full_address",
//       "businessType": "business_line"
//     },
//     "resultKey": "data",
//     "totalKey": "data.length",
//     "searchCategories": ["business", "branch", "contact", "people"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "https://api.emedicals.ng/api/getHospital2",
//     "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "name",
//       "image": null,
//       "slug": "slug",
//       "websiteName": "E-Medicals",
//       "linkBase": "https://emedicals.ng/",
//       "streetAddress": "city"
//     },
//     "resultKey": "users",
//     "totalKey": "users.length",
//     "searchCategories": ["hospital", "hospitals", "phermacy", "medical", "medicals"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "https://api.emedicals.ng/api/getAllDoctors2",
//     "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "fullname",
//       "image": "profilePicture",
//       "slug": "_id",
//       "websiteName": "E-Medicals",
//       "linkBase": "https://emedicals.ng/doctordetails/",
//       "streetAddress": "officeAddress"
//     },
//     "resultKey": "doctors",
//     "totalKey": "doctors.length",
//     "searchCategories": ["doctors", "doctor", "nurse", "nurses", "specialist"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "http://www.estores.ng/api/search.php",
//     "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "product_name",
//       "image": "product_image",
//       "slug": "id",
//       "websiteName": "E-Stores",
//       "linkBase": "product_details",
//       "streetAddress": "product_address",
//       "price": "product_price"
//     },
//     "resultKey": "products",
//     "totalKey": "products.length",
//     "searchCategories": ["products", "stores", "items", "shop", "shops"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "http://www.efixit.ng/api/search.php",
//     "queryParams": (page, query) => ({ query: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "product_speciality",
//       "image": "product_image",
//       "slug": "id",
//       "websiteName": "E-fixit",
//       "linkBase": "https://efixit.ng/service-provider-details.php?id=",
//       "streetAddress": "product_location",
//       "phone": "product_number"
//     },
//     "resultKey": "products",
//     "totalKey": "products.length",
//     "searchCategories": ["fix", "plumber", "electrician", "carpenter", "painter"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "https://ehangoutbackend.etimeplan.com/api/global-search",
//     "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
//     "fieldMap": {
//       "title": "title",
//       "image": "image",
//       "slug": "id",
//       "websiteName": "E-Hangout",
//       "linkBase": "link",
//       "streetAddress": "location"
//     },
//     "resultKey": "results",
//     "totalKey": "results.length",
//     "searchCategories": ["Hangout", "Party", "Events", "Get together"],
//     "icon": "Building",
//     "group": null
//   },
//   {
//     "url": "https://backend.essentialnews.ng/api/search",
//     "queryParams": (page, query, typeFilter) => ({ query: query, page: page, limit: itemsPerPage, type: typeFilter }),
//     "fieldMap": {
//       "title": "title",
//       "image": "featured_image",
//       "slug": "slug",
//       "type": "type",
//       "websiteName": "Essential News",
//       "linkBase": "https://essentialnews.ng/post/"
//     },
//     "resultKey": "data",
//     "totalKey": "pagination.total",
//     "searchCategories": ["news", "birthday", "caveat", "announcement", "missing", "wanted"],
//     "postTypes": ["news", "birthday", "caveat", "announcement", "missing_and_wanted", "dedication"],
//     "icon": "Globe",
//     "group": null
//   }
// ];

// const DEFAULT_CONFIG = API_CONFIGS[7]; // Using edirect.ng as default

// const Avatar = ({ name, image, size = 60 }) => {
//   if (image) {
//     return (
//       <Image 
//         source={{ uri: image }} 
//         style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} 
//         resizeMode="cover"
//       />
//     );
//   }

//   const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
//   const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA27F'];
//   const color = colors[name?.length % colors.length] || '#4ECDC4';

//   return (
//     <View style={[styles.avatarFallback, { 
//       width: size, 
//       height: size, 
//       borderRadius: size / 2,
//       backgroundColor: color 
//     }]}>
//       <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{firstLetter}</Text>
//     </View>
//   );
// };

// export default function OfficialSearchScreen({ navigation }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [popularSearches, setPopularSearches] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   useEffect(() => {
//     fetchPopularSearches();
//   }, []);

//   const fetchPopularSearches = async () => {
//     try {
//       const response = await fetch(DEFAULT_CONFIG.popularSearchesUrl);
//       const data = await response.json();
//       setPopularSearches(data.popular || []);
//     } catch (error) {
//       //console.error('Error fetching popular searches:', error);
//       setPopularSearches([
//         'Restaurants', 
//         'Phone Repair', 
//         'Business', 
//         'NewCraft Furnitures', 
//         'Salons', 
//         'Lagos State',
//         'Engineer',
//         'Gadgets',
//       ]);
//     }
//   };

//   const performSearch = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       setShowResults(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setShowResults(true);
      
//       // Search using the default config first
//       const defaultResults = await searchWithConfig(DEFAULT_CONFIG, query);
      
//       // Then search with other configs that match the query
//       const matchingConfigs = API_CONFIGS.filter(config => 
//         config !== DEFAULT_CONFIG &&
//         config.searchCategories.some(category => 
//           query.toLowerCase().includes(category.toLowerCase())
//         )
//       );
      
//       const otherResults = await Promise.all(
//         matchingConfigs.map(config => searchWithConfig(config, query))
//       );
      
//       // Combine all results
//       const allResults = [
//         ...defaultResults,
//         ...otherResults.flat()
//       ].filter(item => item !== null);
      
//       setSearchResults(allResults);
//     } catch (error) {
//       //console.error('Search error:', error);
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchWithConfig = async (config, query) => {
//     try {
//       const params = config.queryParams(1, query);
//       let url = config.url;
      
//       // Handle query parameters
//       if (config.url.includes('?')) {
//         url += '&' + Object.entries(params)
//           .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
//           .join('&');
//       } else {
//         url += '?' + Object.entries(params)
//           .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
//           .join('&');
//       }
      
//       //console.log('Fetching:', url);
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       const results = data[config.resultKey] || [];
      
//       return results.map(item => ({
//         ...item,
//         config
//       }));
//     } catch (error) {
//       console.error(`Error searching ${config.url}:`, error);
//       return [];
//     }
//   };

//   const handleOpenWebsite = (item) => {
//     try {
//       const { config } = item;
//       const linkBase = config.fieldMap.linkBase;
//       const slug = item[config.fieldMap.slug] || item.id || item._id;
      
//       let url;
//       if (linkBase.startsWith('http')) {
//         url = linkBase.endsWith('=') ? `${linkBase}${slug}` : `${linkBase}${slug}`;
//       } else if (linkBase === 'product_details' && item.product_details) {
//         url = item.product_details;
//       } else {
//         url = `${linkBase}${slug}`;
//       }
      
//       console.log('Opening URL:', url);
//       Linking.openURL(url).catch(err => {
//         console.error('Failed to open URL:', err);
//       });
//     } catch (error) {
//       console.error('Error handling URL:', error);
//     }
//   };

//   const handleSearch = () => {
//     performSearch(searchQuery);
//   };

//   const handlePopularSearchPress = (item) => {
//     setSearchQuery(item);
//     performSearch(item);
//   };

//   const renderResultItem = ({ item }) => {
//     const config = item.config || DEFAULT_CONFIG;
//     const fieldMap = config.fieldMap;
    
//     const title = item[fieldMap.title] || 'Untitled';
//     const image = fieldMap.image ? item[fieldMap.image] : null;
//     const address = fieldMap.streetAddress ? item[fieldMap.streetAddress] : 'Address not available';
//     const websiteName = config.fieldMap.websiteName;
    
//     return (
//       <TouchableOpacity 
//         style={styles.resultCard}
//         onPress={() => handleOpenWebsite(item)}
//       >
//         <View style={styles.cardContent}>
//           <Avatar name={title} image={image} />
//           <View style={styles.resultContent}>
//             <Text style={styles.resultTitle} numberOfLines={1}>{title}</Text>
//             <Text style={styles.websiteName}>{websiteName}</Text>
//             <View style={styles.infoRow}>
//               <Icon name="location-outline" size={14} color="#6c757d" />
//               <Text style={styles.resultAddress} numberOfLines={1}>
//                 {address || 'Address not available'}
//               </Text>
//             </View>
//           </View>
//           <Icon name="chevron-forward" size={20} color="#adb5bd" />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderPopularSearchItem = ({ item }) => {
//     const colors = ['#E3F2FD', '#E8F5E9', '#FFF8E1', '#F3E5F5', '#E0F7FA'];
//     const color = colors[item.length % colors.length];
    
//     return (
//       <TouchableOpacity
//         style={[styles.popularSearchItem, { backgroundColor: color }]}
//         onPress={() => handlePopularSearchPress(item)}
//       >
//         <Text style={styles.popularSearchText}>{item}</Text>
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={16} color="#000" />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//           colors={['#0d64dd', '#0750b5']}
//         style={styles.headerGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.appTitle}>Essential Search</Text>
//           <Text style={styles.appSubtitle}>Nigeria's Largest Business Directory</Text>
//         </View>
//       </LinearGradient>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.content}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.searchContainer}>
//             <View style={styles.searchWrapper}>
//               <Icon
//                 name="search"
//                 size={20}
//                 color="#6c757d"
//                 style={styles.searchIcon}
//               />
//               <TextInput
//                 placeholder="Search businesses, services..."
//                 placeholderTextColor="#adb5bd"
//                 style={styles.searchInput}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 onSubmitEditing={handleSearch}
//                 returnKeyType="search"
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     setSearchQuery('');
//                     setSearchResults([]);
//                     setShowResults(false);
//                   }}
//                   style={styles.clearButton}
//                 >
//                   <Icon name="close" size={20} color="#6c757d" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#4361EE" />
//               <Text style={styles.loadingText}>Searching across all services...</Text>
//             </View>
//           ) : showResults ? (
//             <View style={styles.resultsContainer}>
//               <Text style={styles.sectionTitle}>
//                 {searchResults.length > 0 ? 
//                   `Found ${searchResults.length} results` : 
//                   'Search Results'
//                 }
//               </Text>
//               {searchResults.length > 0 ? (
//                 <FlatList
//                   data={searchResults}
//                   renderItem={renderResultItem}
//                   keyExtractor={(item) => `${item.config?.url}-${item.slug || item.id || item._id || Math.random()}`}
//                   scrollEnabled={false}
//                 />
//               ) : (
//                 <View style={styles.noResultsContainer}>
//                   <Icon name="search-outline" size={60} color="#adb5bd" />
//                   <Text style={styles.noResultsText}>No results found</Text>
//                   <Text style={styles.noResultsSubtext}>Try a different search term</Text>
//                 </View>
//               )}
//             </View>
//           ) : (
//             <View style={styles.popularSearchesContainer}>
//               <Text style={styles.sectionTitle}>Trending Searches</Text>
//               <View style={styles.popularSearchesGrid}>
//                 {popularSearches.map((item, index) => (
//                   <View key={index} style={{ width: '48%', marginBottom: 12 }}>
//                     {renderPopularSearchItem({ item })}
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   headerGradient: {
//     paddingTop: 0,
//     paddingBottom: 30,
//     paddingHorizontal: 0,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   headerContent: {
//     padding:20,
//     alignItems: 'center',
//   },
//   appTitle: {
//     fontSize: 45,
//     fontWeight: '800',
//     color: 'white',
//     marginBottom: 5,
//     textShadowColor: 'rgba(0,0,0,0.1)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   appSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     maxWidth: '80%',
//   },
//   content: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   searchContainer: {
//     marginBottom: 25,
//   },
//   searchWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#495057',
//     fontFamily: 'System',
//   },
//   clearButton: {
//     padding: 5,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#343a40',
//     marginBottom: 20,
//     paddingLeft: 5,
//   },
//   resultsContainer: {
//     flex: 1,
//   },
//   resultCard: {
//     marginBottom: 12,
//     borderRadius: 12,
//     backgroundColor: 'white',
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     marginRight: 15,
//   },
//   avatarFallback: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   resultContent: {
//     flex: 1,
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#212529',
//     marginBottom: 4,
//   },
//   websiteName: {
//     fontSize: 12,
//     color: '#6c757d',
//     marginBottom: 6,
//     fontStyle: 'italic',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   resultAddress: {
//     fontSize: 13,
//     color: '#6c757d',
//     marginLeft: 5,
//     flex: 1,
//   },
//   categoryBadge: {
//     backgroundColor: '#E9ECEF',
//     borderRadius: 6,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     alignSelf: 'flex-start',
//   },
//   categoryText: {
//     fontSize: 12,
//     color: '#495057',
//     fontWeight: '500',
//   },
//   popularSearchesContainer: {
//     flex: 1,
//   },
//   popularSearchesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   popularSearchItem: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   popularSearchText: {
//     fontSize: 15,
//     color: '#343a40',
//     fontWeight: '500',
//     flex: 1,
//     marginRight: 10,
//   },
//   searchIconContainer: {
//     backgroundColor: 'rgba(203, 197, 197, 0.3)',
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   loadingText: {
//     marginTop: 15,
//     color: '#6c757d',
//     fontSize: 16,
//   },
//   noResultsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   noResultsText: {
//     fontSize: 18,
//     color: '#495057',
//     marginTop: 15,
//     marginBottom: 5,
//     fontWeight: '600',
//   },
//   noResultsSubtext: {
//     fontSize: 14,
//     color: '#adb5bd',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Linking } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');
const itemsPerPage = 10;

const API_CONFIGS = [
  {
    "url": "https://autoapi.theautographcollections.ng/api/getAllFashion",
    "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "title",
      "image": "image1",
      "slug": "slug",
      "websiteName": "The Autograph Collections",
      "linkBase": "https://theautographcollections.ng/content/",
      "streetAddress": "address"
    },
    "resultKey": "posts",
    "totalKey": "total",
    "searchCategories": ["latest", "blog", "magazine", "fashion"],
    "icon": "Home"
  },
  {
    "url": "https://api.evenue.ng/api/getAllVenues",
    "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "title",
      "image": "coverImage",
      "slug": "slug",
      "websiteName": "(Evenue) Get available venue, events services for all types of event",
      "linkBase": "https://evenue.ng/venue/",
      "streetAddress": "fullAddress"
    },
    "resultKey": "venues",
    "totalKey": "totalVenues",
    "searchCategories": ["venue", "venues", "party", "conference", "halls", "weddings"],
    "icon": "Building"
  },
  {
    "url": "https://api.evenue.ng/api/getAllEvents",
    "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "title",
      "image": "coverImage",
      "slug": "slug",
      "eventType": "eventType",
      "websiteName": "(Evenue) Get available upcoming and live events on Evenue",
      "linkBase": "https://evenue.ng/event-showcase",
      "streetAddress": "location"
    },
    "resultKey": "events",
    "totalKey": "total",
    "searchCategories": ["events", "conference", "webinar", "meetings", "live", "upcoming events"],
    "icon": "Building"
  },
  {
    "url": "https://api-whoiswho.tests.com.ng/api/getAllBiographies",
    "queryParams": (page, query) => ({ search: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "title",
      "image": "image1",
      "slug": "slug",
      "websiteName": "(WhoIsWho)..Know who is who in nigeria and beyond",
      "linkBase": "https://whoiswho.tests.com.ng/biography/",
      "streetAddress": "address"
    },
    "resultKey": "biographies",
    "totalKey": "total",
    "searchCategories": ["bio", "biography", "person", "people", "profile", "history"],
    "icon": "User"
  },
  {
    "url": "https://hotelbackend.edirect.ng/api/property/search",
    "queryParams": (page, query, search_term) => ({ searchTerm: query || search_term, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "hotel_name",
      "image": "photos[0].photo_path",
      "slug": "id",
      "websiteName": "eDirect Hotels",
      "linkBase": "https://ehotels.ng/hotel/",
      "streetAddress": "street_address"
    },
    "resultKey": "data",
    "totalKey": "total",
    "searchCategories": ["hotel", "hotels", "accommodation", "stay", "lodging"],
    "icon": "Building"
  },
  {
    "url": "https://backend.ejobs.com.ng/api/v1/job/externalJobs",
    "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "jobTitle",
      "image": null,
      "slug": "_id",
      "websiteName": "eJobs",
      "linkBase": "https://ejobs.com.ng/job/",
      "streetAddress": "address",
      "companyName": "employer.companyName",
      "salary": "salary",
      "state": "state"
    },
    "resultKey": "data",
    "totalKey": "total",
    "searchCategories": ["job", "jobs", "career", "employment", "work", "works", "ejobs"],
    "icon": "Building"
  },
  {
    "url": "https://api.eschoolconnect.ng/eschools/schools/filter-schools",
    "queryParams": (page, query) => ({ searchTerm: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "schoolName",
      "image": null,
      "slug": "slug",
      "websiteName": "eSchoolConnect",
      "linkBase": "https://eschoolconnect.ng/schooldetail/",
      "streetAddress": "state"
    },
    "resultKey": "data",
    "totalKey": "total",
    "searchCategories": ["school", "schools", "education", "learning", "academy"],
    "icon": "Building"
  },
  {
    "url": "https://backend.edirect.ng/api/search?",
    "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "name",
      "image": "primary_image",
      "slug": "slug",
      "websiteName": "Essential Directories",
      "linkBase": "https://edirect.ng/",
      "streetAddress": "full_address",
      "businessType": "business_line"
    },
    "resultKey": "data",
    "totalKey": "data.length",
    "searchCategories": ["business", "branch", "contact", "people"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "https://api.emedicals.ng/api/getHospital2",
    "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "name",
      "image": null,
      "slug": "slug",
      "websiteName": "E-Medicals",
      "linkBase": "https://emedicals.ng/",
      "streetAddress": "city"
    },
    "resultKey": "users",
    "totalKey": "users.length",
    "searchCategories": ["hospital", "hospitals", "phermacy", "medical", "medicals"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "https://api.emedicals.ng/api/getAllDoctors2",
    "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "fullname",
      "image": "profilePicture",
      "slug": "_id",
      "websiteName": "E-Medicals",
      "linkBase": "https://emedicals.ng/doctordetails/",
      "streetAddress": "officeAddress"
    },
    "resultKey": "doctors",
    "totalKey": "doctors.length",
    "searchCategories": ["doctors", "doctor", "nurse", "nurses", "specialist"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "http://www.estores.ng/api/search.php",
    "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "product_name",
      "image": "product_image",
      "slug": "id",
      "websiteName": "E-Stores",
      "linkBase": "product_details",
      "streetAddress": "product_address",
      "price": "product_price"
    },
    "resultKey": "products",
    "totalKey": "products.length",
    "searchCategories": ["products", "stores", "items", "shop", "shops"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "http://www.efixit.ng/api/search.php",
    "queryParams": (page, query) => ({ query: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "product_speciality",
      "image": "product_image",
      "slug": "id",
      "websiteName": "E-fixit",
      "linkBase": "https://efixit.ng/service-provider-details.php?id=",
      "streetAddress": "product_location",
      "phone": "product_number"
    },
    "resultKey": "products",
    "totalKey": "products.length",
    "searchCategories": ["fix", "plumber", "electrician", "carpenter", "painter"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "https://ehangoutbackend.etimeplan.com/api/global-search",
    "queryParams": (page, query) => ({ q: query, page: page, limit: itemsPerPage }),
    "fieldMap": {
      "title": "title",
      "image": "image",
      "slug": "id",
      "websiteName": "E-Hangout",
      "linkBase": "link",
      "streetAddress": "location"
    },
    "resultKey": "results",
    "totalKey": "results.length",
    "searchCategories": ["Hangout", "Party", "Events", "Get together"],
    "icon": "Building",
    "group": null
  },
  {
    "url": "https://backend.essentialnews.ng/api/search",
    "queryParams": (page, query, typeFilter) => ({ query: query, page: page, limit: itemsPerPage, type: typeFilter }),
    "fieldMap": {
      "title": "title",
      "image": "featured_image",
      "slug": "slug",
      "type": "type",
      "websiteName": "Essential News",
      "linkBase": "https://essentialnews.ng/post/"
    },
    "resultKey": "data",
    "totalKey": "pagination.total",
    "searchCategories": ["news", "birthday", "caveat", "announcement", "missing", "wanted"],
    "postTypes": ["news", "birthday", "caveat", "announcement", "missing_and_wanted", "dedication"],
    "icon": "Globe",
    "group": null
  }
];

const DEFAULT_CONFIG = API_CONFIGS[7]; 

const Avatar = ({ name, image, size = 60, isDark }) => {
  if (image) {
    return (
      <Image 
        source={{ uri: image }} 
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} 
        resizeMode="cover"
      />
    );
  }

  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
  const colors = isDark 
    ? ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA27F']
    : ['#E74C3C', '#2ECC71', '#3498DB', '#9B59B6', '#F39C12'];
  const color = colors[name?.length % colors.length] || (isDark ? '#4ECDC4' : '#3498DB');

  return (
    <View style={[styles.avatarFallback, { 
      width: size, 
      height: size, 
      borderRadius: size / 2,
      backgroundColor: color 
    }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{firstLetter}</Text>
    </View>
  );
};

export default function OfficialSearchScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch(DEFAULT_CONFIG.popularSearchesUrl);
      const data = await response.json();
      setPopularSearches(data.popular || []);
    } catch (error) {
      setPopularSearches([
        'Restaurants', 
        'Phone Repair', 
        'Business', 
        'NewCraft Furnitures', 
        'Salons', 
        'Lagos State',
        'Engineer',
        'Gadgets',
      ]);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      setShowResults(true);
      
      const defaultResults = await searchWithConfig(DEFAULT_CONFIG, query);
      
      const matchingConfigs = API_CONFIGS.filter(config => 
        config !== DEFAULT_CONFIG &&
        config.searchCategories.some(category => 
          query.toLowerCase().includes(category.toLowerCase())
        )
      );
      
      const otherResults = await Promise.all(
        matchingConfigs.map(config => searchWithConfig(config, query))
      );
      
      const allResults = [
        ...defaultResults,
        ...otherResults.flat()
      ].filter(item => item !== null);
      
      setSearchResults(allResults);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchWithConfig = async (config, query) => {
    try {
      const params = config.queryParams(1, query);
      let url = config.url;
      
      if (config.url.includes('?')) {
        url += '&' + Object.entries(params)
          .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
          .join('&');
      } else {
        url += '?' + Object.entries(params)
          .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
          .join('&');
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const results = data[config.resultKey] || [];
      
      return results.map(item => ({
        ...item,
        config
      }));
    } catch (error) {
      return [];
    }
  };

  const handleOpenWebsite = (item) => {
    try {
      const { config } = item;
      const linkBase = config.fieldMap.linkBase;
      const slug = item[config.fieldMap.slug] || item.id || item._id;
      
      let url;
      if (linkBase.startsWith('http')) {
        url = linkBase.endsWith('=') ? `${linkBase}${slug}` : `${linkBase}${slug}`;
      } else if (linkBase === 'product_details' && item.product_details) {
        url = item.product_details;
      } else {
        url = `${linkBase}${slug}`;
      }
      
      Linking.openURL(url).catch(err => {
        console.error('Failed to open URL:', err);
      });
    } catch (error) {
      console.error('Error handling URL:', error);
    }
  };

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handlePopularSearchPress = (item) => {
    setSearchQuery(item);
    performSearch(item);
  };

  const renderResultItem = ({ item }) => {
    const config = item.config || DEFAULT_CONFIG;
    const fieldMap = config.fieldMap;
    
    const title = item[fieldMap.title] || 'Untitled';
    const image = fieldMap.image ? item[fieldMap.image] : null;
    const address = fieldMap.streetAddress ? item[fieldMap.streetAddress] : 'Address not available';
    const websiteName = config.fieldMap.websiteName;
    
    return (
      <TouchableOpacity 
        style={[styles.resultCard, { backgroundColor: colors.card }]}
        onPress={() => handleOpenWebsite(item)}
      >
        <View style={styles.cardContent}>
          <Avatar name={title} image={image} isDark={isDark} />
          <View style={styles.resultContent}>
            <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.websiteName, { color: colors.textSecondary }]}>{websiteName}</Text>
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.resultAddress, { color: colors.textSecondary }]} numberOfLines={1}>
                {address || 'Address not available'}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPopularSearchItem = ({ item }) => {
    const lightColors = ['#E3F2FD', '#E8F5E9', '#FFF8E1', '#F3E5F5', '#E0F7FA'];
    const darkColors = ['#2D3748', '#2F855A', '#744210', '#553C9A', '#234E52'];
    const color = isDark 
      ? darkColors[item.length % darkColors.length]
      : lightColors[item.length % lightColors.length];
    
    return (
      <TouchableOpacity
        style={[styles.popularSearchItem, { backgroundColor: color }]}
        onPress={() => handlePopularSearchPress(item)}
      >
        <Text style={[styles.popularSearchText, { color: isDark ? '#E2E8F0' : '#343a40' }]}>{item}</Text>
        <View style={[styles.searchIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(203, 197, 197, 0.3)' }]}>
          <Icon name="search" size={16} color={isDark ? '#E2E8F0' : '#000'} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : ['#0d64dd', '#0750b5']}
        style={[styles.headerGradient, { 
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.4 : 0.2,
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>Essential Search</Text>
          <Text style={styles.appSubtitle}>Nigeria's Largest Business Directory</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchContainer}>
            <View style={[styles.searchWrapper, { backgroundColor: colors.card }]}>
              <Icon
                name="search"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search businesses, services..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                  style={styles.clearButton}
                >
                  <Icon name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Searching across all services...
              </Text>
            </View>
          ) : showResults ? (
            <View style={styles.resultsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {searchResults.length > 0 ? 
                  `Found ${searchResults.length} results` : 
                  'Search Results'
                }
              </Text>
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderResultItem}
                  keyExtractor={(item) => `${item.config?.url}-${item.slug || item.id || item._id || Math.random()}`}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Icon name="search-outline" size={60} color={colors.textSecondary} />
                  <Text style={[styles.noResultsText, { color: colors.text }]}>
                    No results found
                  </Text>
                  <Text style={[styles.noResultsSubtext, { color: colors.textSecondary }]}>
                    Try a different search term
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.popularSearchesContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Trending Searches
              </Text>
              <View style={styles.popularSearchesGrid}>
                {popularSearches.map((item, index) => (
                  <View key={index} style={{ width: '48%', marginBottom: 12 }}>
                    {renderPopularSearchItem({ item })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 30,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    padding: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '800',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 25,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
  },
  clearButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    paddingLeft: 5,
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  websiteName: {
    fontSize: 12,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultAddress: {
    fontSize: 13,
    marginLeft: 5,
    flex: 1,
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  popularSearchesContainer: {
    flex: 1,
  },
  popularSearchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularSearchItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularSearchText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  searchIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  noResultsSubtext: {
    fontSize: 14,
  },
});