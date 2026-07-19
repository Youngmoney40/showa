// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Linking, 
//   StyleSheet, 
//   Dimensions, 
//   Pressable, 
//   Platform 
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../src/context/ThemeContext'; 

// const { width } = Dimensions.get('window');

// const formatSalary = (salary) => {
//   if (!salary || salary === 'Negotiable') return 'Negotiable';
//   const num = parseInt(salary);
//   if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
//   if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
//   return `₦${num}`;
// };

// const getTimeAgo = (dateString) => {
//   if (!dateString) return 'Recently';
  
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
//   if (diffDays === 0) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return 'Over a month ago';
// };

// // Premium Job Card Component
// const PremiumJobCard = ({ job, colors, isDark }) => {
//   const [isPressed, setIsPressed] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);

//   const truncateDescription = (text) => {
//     const description = text?.[0] || text || '';
//     if (description.length <= 80) return description;
//     return `${description.substring(0, 80)}...`;
//   };

//   return (
//     <Pressable 
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       style={[
//         styles.cardContainer,
//         { 
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//         },
//         isPressed && styles.cardPressed
//       ]}
//     >
//       {/* Premium Badge */}
//       {job.isFeatured && (
//         <View style={[styles.premiumBadge, { backgroundColor: colors.card }]}>
//           <View style={styles.premiumBadgeInner}>
//             <MaterialCommunityIcon name="star" size={12} color={colors.primary} />
//             <Text style={[styles.premiumBadgeText, { color: colors.primary }]}>Featured</Text>
//           </View>
//         </View>
//       )}

//       {/* Header Section */}
//       <View style={[styles.header, { backgroundColor: colors.primary }]}>
//         <View style={styles.headerContent}>
//           <View style={styles.headerTop}>
//             {job.isUrgent && (
//               <Text style={[styles.urgentTag, { backgroundColor: colors.background }]}>Urgent</Text>
//             )}
//           </View>
          
//           <Text style={[styles.jobTitle, { color: '#fff' }]} numberOfLines={1}>
//             {job.jobTitle}
//           </Text>
          
//           <View style={styles.companyContainer}>
//             <MaterialCommunityIcon name="office-building" size={16} color="#fff" />
//             <Text style={[styles.companyName, { color: '#fff' }]} numberOfLines={1}>
//               {job.employer?.companyName || 'Confidential'}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Location & Work Type */}
//       <View style={[styles.locationWorkType, { backgroundColor: colors.primary }]}>
//         <View style={styles.locationContainer}>
//           <Icon name="map-pin" size={14} color="#fff" />
//           <Text style={[styles.locationText, { color: '#fff' }]} numberOfLines={1}>
//             {job.city || 'Remote'}, {job.state || 'Worldwide'}
//           </Text>
//         </View>
//         <View style={styles.workTypeContainer}>
//           <Icon name="clock" size={14} color="#fff" />
//           <Text style={[styles.workTypeText, { color: '#fff' }]} numberOfLines={1}>
//             {job.workType || 'Full-time'} - {formatSalary(job.salary)}
//           </Text>
//           {/* <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
//                 {formatSalary(job.salary)}
//           </Text> */}
//         </View>
//       </View>

//       {/* Main Content */}
//       <View style={styles.mainContent}>
       
        

//         {/* Job Description */}
//         <View style={styles.descriptionSection}>
//           <View style={styles.descriptionHeader}>
//             <Icon name="briefcase" size={14} color={colors.text} />
//             <Text style={[styles.descriptionTitle, { color: colors.text }]}>About this position</Text>
//           </View>
//           <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
//             {truncateDescription(job.jobDescription || job.jobSummary)}
//           </Text>
//         </View>

//         {/* Tags Section */}
//         {/* {job.jobTag?.length > 0 && (
//           <View style={styles.tagsSection}>
//             <View style={styles.tagsContainer}>
//               {job.jobTag.slice(0, 3).map((tag, index) => (
//                 <Text 
//                   key={index}
//                   style={[styles.tag, { 
//                     backgroundColor: colors.primary + '20', // 20% opacity
//                     color: colors.primary,
//                     borderColor: colors.primary + '30'
//                   }]}
//                   numberOfLines={1}
//                 >
//                   {tag}
//                 </Text>
                
//               ))}
//             </View>
            
//           </View>
//         )} */}
//       </View>

//       {/* Footer Section */}
//       <View style={[styles.footer, { borderTopColor: colors.border }]}>
        
        
//         <TouchableOpacity 
//           onPress={() => Linking.openURL(`https://ejobs.com.ng/job/${job._id}`)}
//           style={[
//             styles.viewDetailsButton,
//             { 
//               backgroundColor: isPressed ? colors.primary : 'transparent',
//               borderColor: colors.primary
//             },
//             isPressed && styles.viewDetailsPressed
//           ]}
//         >
//           <Text style={[
//             isPressed ? styles.viewDetailsTextPressed : styles.viewDetailsTextNormal,
//             { color: isPressed ? '#fff' : colors.primary }
//           ]}>
//            Apply
//           </Text>
         
//         </TouchableOpacity>
//       </View>
//     </Pressable>
//   );
// };

// // Loading Skeleton Component with Theme
// const JobCardSkeleton = ({ colors, isDark }) => (
//   <View style={[styles.skeletonContainer, { backgroundColor: colors.background }]}>
//     <View style={[styles.skeletonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <View style={[styles.skeletonHeader, { backgroundColor: colors.primary }]}>
//         <View style={[styles.skeletonSmallBar, { backgroundColor: colors.background }]} />
//         <View style={[styles.skeletonLargeBar, { backgroundColor: colors.background }]} />
//         <View style={[styles.skeletonMediumBar, { backgroundColor: colors.background }]} />
//       </View>
//       <View style={styles.skeletonMain}>
//         <View style={styles.skeletonMetrics}>
//           {[1, 2].map((i) => (
//             <View key={i} style={[styles.skeletonMetric, { backgroundColor: colors.backgroundSecondary }]}>
//               <View style={[styles.skeletonSmallBarFull, { backgroundColor: colors.border }]} />
//               <View style={[styles.skeletonMediumBarShort, { backgroundColor: colors.border }]} />
//             </View>
//           ))}
//         </View>
//         <View style={[styles.skeletonDescription, { backgroundColor: colors.backgroundSecondary }]} />
//         <View style={styles.skeletonTags}>
//           {[1, 2, 3].map((i) => (
//             <View key={i} style={[styles.skeletonTag, { backgroundColor: colors.backgroundSecondary }]} />
//           ))}
//         </View>
//       </View>
//     </View>
//   </View>
// );

// // Main Component
// const PremiumJobScroll = () => {
//   const { colors, isDark } = useTheme(); // Get theme colors
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://backend.ejobs.com.ng/api/v1/job/jobs/');
      
//       if (response.data.status && response.data.data) {
//         const jobsData = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : [response.data.data];
        
//         // Enhance jobs with additional data
//         const enhancedJobs = jobsData.map((job, index) => ({
//           ...job,
//           isFeatured: index % 3 === 0,
//           isUrgent: index % 5 === 0,
//           rating: 4.0 + Math.random() * 1.5,
//           views: Math.floor(Math.random() * 1500) + 500
//         }));
        
//         setJobs(enhancedJobs.slice(0, 6)); 
//       }
//     } catch (err) {
//       setError('Unable to load opportunities at the moment. Please try again.');
//       console.error('Error fetching jobs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollLeft = () => {
//     scrollRef.current?.scrollTo({ 
//       x: scrollRef.current.contentOffset.x - (width * 0.8), 
//       animated: true 
//     });
//   };

//   const scrollRight = () => {
//     scrollRef.current?.scrollTo({ 
//       x: scrollRef.current.contentOffset.x + (width * 0.8), 
//       animated: true 
//     });
//   };

//   if (error) {
//     return (
//       <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
//         <View style={[styles.errorIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
//           <Icon name="trending-up" size={40} color={colors.primary} />
//         </View>
//         <Text style={[styles.errorTitle, { color: colors.text }]}>Connection Error</Text>
//         <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error}</Text>
//         <TouchableOpacity 
//           onPress={fetchJobs}
//           style={[styles.refreshButton, { backgroundColor: colors.primary }]}
//         >
//           <Text style={styles.refreshText}>Refresh Opportunities</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
//       <View style={styles.titleSection}>
//         <View>
//           <Text style={[styles.mainTitle, { color: colors.text }]}>Jobs You May Like</Text>
//           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//             Discover your next career opportunity
//           </Text>
//         </View>
//         {!loading && jobs.length > 0 && (
//         <View style={styles.viewAllContainer}>
//           <TouchableOpacity 
//             onPress={() => Linking.openURL('https://ejobs.com.ng/jobs')}
//             style={styles.viewAllButton}
//           >
//             <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
//             <Icon name="external-link" size={16} color={colors.primary} />
//           </TouchableOpacity>
//         </View>
//       )}

//       </View>

//       {/* Job Cards Container */}
//       <ScrollView 
//         ref={scrollRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         snapToInterval={width * 0.8 + 16}
//         decelerationRate="fast"
//         snapToAlignment="start"
//       >
//         {loading ? (
//           Array.from({ length: 3 }).map((_, index) => (
//             <JobCardSkeleton 
//               key={`skeleton-${index}`} 
//               colors={colors} 
//               isDark={isDark} 
//             />
//           ))
//         ) : (
//           jobs.map((job, index) => (
//             <PremiumJobCard 
//               key={`${job._id}_${index}`} 
//               job={job} 
//               colors={colors}
//               isDark={isDark}
//             />
//           ))
//         )}
//       </ScrollView>

     
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // Main container
//   mainContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
  
//   // Title section
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginHorizontal: 8,
//   },
//   mainTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     opacity: 0.8,
//   },
//   navButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   navButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
  
//   // Job card container
//   cardContainer: {
//     width: width * 0.8,
//     borderRadius: 14,
//     borderWidth: 1,
//     overflow: 'hidden',
//     marginHorizontal: 8,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   cardPressed: {
//     transform: [{ translateY: -4 }],
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 6,
//   },
  
//   // Premium badge
//   premiumBadge: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     zIndex: 10,
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   premiumBadgeInner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   premiumBadgeText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
  
//   // Header section
//   header: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   urgentTag: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   companyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   companyName: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
  
//   // Location & work type
//   locationWorkType: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     flex: 1,
//   },
//   locationText: {
//     fontSize: 12,
//   },
//   workTypeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     flex: 1,
//   },
//   workTypeText: {
//     fontSize: 12,
//   },
  
//   // Main content
//   mainContent: {
//     paddingLeft:16,
//     paddingRight:16,
//     paddingTop:16,

//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 10,
//   },
//   metricItem: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     padding: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   metricIconContainer: {
//     padding: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   metricLabel: {
//     fontSize: 11,
//     fontWeight: '500',
//   },
//   metricValue: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
  
//   // Description section
//   descriptionSection: {
//     marginBottom: 16,
//   },
//   descriptionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 8,
//   },
//   descriptionTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   descriptionText: {
//     fontSize: 13,
//     lineHeight: 18,
//   },
  
//   // Tags section
//   tagsSection: {
//     marginBottom: 16,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   tag: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     fontSize: 11,
//     fontWeight: '500',
//     borderRadius: 6,
//     borderWidth: 1,
//   },
  
//   // Footer section
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderTopWidth: 1,
//   },
//   footerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   separator: {
//     width: 1,
//     height: 12,
//   },
//   timeAgo: {
//     fontSize: 13,
//   },
//   viewDetailsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 2,
//   },
//   viewDetailsPressed: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//     transform: [{ scale: 1.05 }],
//   },
//   viewDetailsTextNormal: {
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   viewDetailsTextPressed: {
//     fontWeight: '600',
//     fontSize: 13,
//   },
  
//   // Skeleton loading styles
//   skeletonContainer: {
//     width: width * 0.8,
//     marginHorizontal: 8,
//   },
//   skeletonCard: {
//     borderRadius: 14,
//     borderWidth: 1,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   skeletonHeader: {
//     padding: 16,
//   },
//   skeletonSmallBar: {
//     height: 12,
//     borderRadius: 4,
//     width: '25%',
//     marginBottom: 12,
//   },
//   skeletonLargeBar: {
//     height: 20,
//     borderRadius: 4,
//     width: '75%',
//     marginBottom: 8,
//   },
//   skeletonMediumBar: {
//     height: 12,
//     borderRadius: 4,
//     width: '50%',
//   },
//   skeletonMain: {
//     padding: 16,
//   },
//   skeletonMetrics: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   skeletonMetric: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 10,
//   },
//   skeletonSmallBarFull: {
//     height: 12,
//     borderRadius: 4,
//     width: '100%',
//     marginBottom: 6,
//   },
//   skeletonMediumBarShort: {
//     height: 16,
//     borderRadius: 4,
//     width: '66%',
//   },
//   skeletonDescription: {
//     height: 48,
//     borderRadius: 4,
//     marginBottom: 16,
//   },
//   skeletonTags: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   skeletonTag: {
//     height: 20,
//     borderRadius: 6,
//     width: 60,
//   },
  
//   // Error state
//   errorContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 40,
//     alignItems: 'center',
//     borderRadius: 14,
//     marginHorizontal: 8,
//   },
//   errorIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   errorTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   errorMessage: {
//     fontSize: 14,
//     marginBottom: 24,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   refreshButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   refreshText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
  
//   // Scroll content
//   scrollContent: {
//     paddingBottom: 8,
//     paddingRight: 16,
//   },
  
//   // View all container
//   viewAllContainer: {
//     alignItems: 'center',
    
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   viewAllText: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

// export default PremiumJobScroll;

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  StyleSheet, 
  Dimensions, 
  Pressable, 
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../src/context/ThemeContext';
import { createMMKV } from 'react-native-mmkv';

const { width } = Dimensions.get('window');

// Initialize MMKV storage
const storage = createMMKV({
  id: 'jobs-storage',
});

// Cache keys
const JOBS_CACHE_KEY = 'jobs_premium_cache';
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

// ============================================================
// MMKV CACHE FUNCTIONS
// ============================================================

const saveToMMKV = (key, data) => {
  try {
    console.log(`💾 Saving ${key} to MMKV cache...`);
    storage.set(key, JSON.stringify({
      data: data,
      timestamp: Date.now()
    }));
    console.log(`✅ ${key} saved to MMKV cache (${data.length} items)`);
  } catch (error) {
    console.error(`❌ Error saving ${key} to MMKV:`, error);
  }
};

const getFromMMKV = (key) => {
  try {
    const cached = storage.getString(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      const { data, timestamp } = parsed;
      const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
      
      if (isCacheValid && data && data.length > 0) {
        console.log(`✅ ${key} loaded from MMKV cache (${data.length} items)`);
        return data;
      } else {
        console.log(`⏰ ${key} cache expired`);
      }
    }
    console.log(`📭 ${key} not found in MMKV cache`);
    return null;
  } catch (error) {
    console.error(`❌ Error getting ${key} from MMKV:`, error);
    return null;
  }
};

const clearMMKVCache = () => {
  try {
    console.log('🗑️ Clearing jobs MMKV cache...');
    storage.delete(JOBS_CACHE_KEY);
    console.log('✅ Jobs MMKV cache cleared');
  } catch (error) {
    console.error('❌ Error clearing MMKV cache:', error);
  }
};

// ============================================================
// HELPERS
// ============================================================

const formatSalary = (salary) => {
  if (!salary || salary === 'Negotiable') return 'Negotiable';
  const num = parseInt(salary);
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
  return `₦${num}`;
};

const getTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return 'Over a month ago';
};

// ============================================================
// PREMIUM JOB CARD
// ============================================================

const PremiumJobCard = ({ job, colors, isDark }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const truncateDescription = (text) => {
    const description = text?.[0] || text || '';
    if (description.length <= 80) return description;
    return `${description.substring(0, 80)}...`;
  };

  return (
    <Pressable 
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.cardContainer,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        isPressed && styles.cardPressed
      ]}
    >
      {/* Premium Badge */}
      {job.isFeatured && (
        <View style={[styles.premiumBadge, { backgroundColor: colors.card }]}>
          <View style={styles.premiumBadgeInner}>
            <MaterialCommunityIcon name="star" size={12} color={colors.primary} />
            <Text style={[styles.premiumBadgeText, { color: colors.primary }]}>Featured</Text>
          </View>
        </View>
      )}

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            {job.isUrgent && (
              <Text style={[styles.urgentTag, { backgroundColor: colors.background }]}>Urgent</Text>
            )}
          </View>
          
          <Text style={[styles.jobTitle, { color: '#fff' }]} numberOfLines={1}>
            {job.jobTitle}
          </Text>
          
          <View style={styles.companyContainer}>
            <MaterialCommunityIcon name="office-building" size={16} color="#fff" />
            <Text style={[styles.companyName, { color: '#fff' }]} numberOfLines={1}>
              {job.employer?.companyName || 'Confidential'}
            </Text>
          </View>
        </View>
      </View>

      {/* Location & Work Type */}
      <View style={[styles.locationWorkType, { backgroundColor: colors.primary }]}>
        <View style={styles.locationContainer}>
          <Icon name="map-pin" size={14} color="#fff" />
          <Text style={[styles.locationText, { color: '#fff' }]} numberOfLines={1}>
            {job.city || 'Remote'}, {job.state || 'Worldwide'}
          </Text>
        </View>
        <View style={styles.workTypeContainer}>
          <Icon name="clock" size={14} color="#fff" />
          <Text style={[styles.workTypeText, { color: '#fff' }]} numberOfLines={1}>
            {job.workType || 'Full-time'} - {formatSalary(job.salary)}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Job Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionHeader}>
            <Icon name="briefcase" size={14} color={colors.text} />
            <Text style={[styles.descriptionTitle, { color: colors.text }]}>About this position</Text>
          </View>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {truncateDescription(job.jobDescription || job.jobSummary)}
          </Text>
        </View>
      </View>

      {/* Footer Section */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => Linking.openURL(`https://ejobs.com.ng/job/${job._id}`)}
          style={[
            styles.viewDetailsButton,
            { 
              backgroundColor: isPressed ? colors.primary : 'transparent',
              borderColor: colors.primary
            },
            isPressed && styles.viewDetailsPressed
          ]}
        >
          <Text style={[
            isPressed ? styles.viewDetailsTextPressed : styles.viewDetailsTextNormal,
            { color: isPressed ? '#fff' : colors.primary }
          ]}>
           Apply
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

// ============================================================
// SKELETON COMPONENT
// ============================================================

const JobCardSkeleton = ({ colors, isDark }) => (
  <View style={[styles.skeletonContainer, { backgroundColor: colors.background }]}>
    <View style={[styles.skeletonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.skeletonHeader, { backgroundColor: colors.primary }]}>
        <View style={[styles.skeletonSmallBar, { backgroundColor: colors.background }]} />
        <View style={[styles.skeletonLargeBar, { backgroundColor: colors.background }]} />
        <View style={[styles.skeletonMediumBar, { backgroundColor: colors.background }]} />
      </View>
      <View style={styles.skeletonMain}>
        <View style={styles.skeletonMetrics}>
          {[1, 2].map((i) => (
            <View key={i} style={[styles.skeletonMetric, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.skeletonSmallBarFull, { backgroundColor: colors.border }]} />
              <View style={[styles.skeletonMediumBarShort, { backgroundColor: colors.border }]} />
            </View>
          ))}
        </View>
        <View style={[styles.skeletonDescription, { backgroundColor: colors.backgroundSecondary }]} />
        <View style={styles.skeletonTags}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.skeletonTag, { backgroundColor: colors.backgroundSecondary }]} />
          ))}
        </View>
      </View>
    </View>
  </View>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const PremiumJobScroll = () => {
  const { colors, isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const scrollRef = useRef(null);

  // ============================================================
  // LOAD FROM MMKV CACHE
  // ============================================================

  const loadFromCache = useCallback(() => {
    try {
      const cachedJobs = getFromMMKV(JOBS_CACHE_KEY);
      if (cachedJobs && cachedJobs.length > 0) {
        console.log('📦 Loading jobs from MMKV cache:', cachedJobs.length);
        setJobs(cachedJobs);
        setLoading(false);
        setHasLoadedOnce(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error loading jobs from cache:', error);
      return false;
    }
  }, []);

  // ============================================================
  // FETCH JOBS
  // ============================================================

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🌐 Fetching jobs from API...');
      
      const response = await axios.get('https://backend.ejobs.com.ng/api/v1/job/jobs/');
      
      if (response.data.status && response.data.data) {
        const jobsData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        
        // Enhance jobs with additional data
        const enhancedJobs = jobsData.map((job, index) => ({
          ...job,
          isFeatured: index % 3 === 0,
          isUrgent: index % 5 === 0,
          rating: 4.0 + Math.random() * 1.5,
          views: Math.floor(Math.random() * 1500) + 500
        }));
        
        const limitedJobs = enhancedJobs.slice(0, 6);
        setJobs(limitedJobs);
        setHasLoadedOnce(true);
        
        // Save to MMKV cache
        saveToMMKV(JOBS_CACHE_KEY, limitedJobs);
        console.log(`✅ Saved ${limitedJobs.length} jobs to MMKV cache`);
      }
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
      setError('Unable to load opportunities at the moment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD - CACHE FIRST
  // ============================================================

  useEffect(() => {
    console.log('🚀 Initial load - checking MMKV cache...');
    const hasCache = loadFromCache();
    
    if (hasCache) {
      console.log('📂 Cache loaded, fetching fresh data in background...');
      // Fetch in background
      setTimeout(() => {
        fetchJobs();
      }, 500);
    } else {
      console.log('📭 No cache, fetching from API...');
      fetchJobs();
    }
  }, []);

  // ============================================================
  // HANDLERS
  // ============================================================

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ 
      x: scrollRef.current.contentOffset.x - (width * 0.8), 
      animated: true 
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollTo({ 
      x: scrollRef.current.contentOffset.x + (width * 0.8), 
      animated: true 
    });
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    clearMMKVCache();
    setLoading(true);
    fetchJobs();
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (error && !hasLoadedOnce) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.errorIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="trending-up" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Connection Error</Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity 
          onPress={handleRefresh}
          style={[styles.refreshButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.refreshText}>Refresh Opportunities</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <View style={styles.titleSection}>
        <View>
          <Text style={[styles.mainTitle, { color: colors.text }]}>Jobs You May Like</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover your next career opportunity
          </Text>
        </View>
        {!loading && jobs.length > 0 && (
          <View style={styles.viewAllContainer}>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://ejobs.com.ng/jobs')}
              style={styles.viewAllButton}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
              <Icon name="external-link" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Job Cards Container */}
      <ScrollView 
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.8 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {loading && !hasLoadedOnce ? (
          Array.from({ length: 3 }).map((_, index) => (
            <JobCardSkeleton 
              key={`skeleton-${index}`} 
              colors={colors} 
              isDark={isDark} 
            />
          ))
        ) : (
          jobs.map((job, index) => (
            <PremiumJobCard 
              key={`${job._id}_${index}`} 
              job={job} 
              colors={colors}
              isDark={isDark}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  
  // Title section
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Job card container
  cardContainer: {
    width: width * 0.8,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ translateY: -4 }],
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Premium badge
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Header section
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgentTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '600',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Location & work type
  locationWorkType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
  },
  workTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  workTypeText: {
    fontSize: 12,
  },
  
  // Main content
  mainContent: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  metricIconContainer: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Description section
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  // Tags section
  tagsSection: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '500',
    borderRadius: 6,
    borderWidth: 1,
  },
  
  // Footer section
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 12,
  },
  timeAgo: {
    fontSize: 13,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
  },
  viewDetailsPressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  viewDetailsTextNormal: {
    fontWeight: '600',
    fontSize: 13,
  },
  viewDetailsTextPressed: {
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Skeleton loading styles
  skeletonContainer: {
    width: width * 0.8,
    marginHorizontal: 8,
  },
  skeletonCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonHeader: {
    padding: 16,
  },
  skeletonSmallBar: {
    height: 12,
    borderRadius: 4,
    width: '25%',
    marginBottom: 12,
  },
  skeletonLargeBar: {
    height: 20,
    borderRadius: 4,
    width: '75%',
    marginBottom: 8,
  },
  skeletonMediumBar: {
    height: 12,
    borderRadius: 4,
    width: '50%',
  },
  skeletonMain: {
    padding: 16,
  },
  skeletonMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  skeletonMetric: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  skeletonSmallBarFull: {
    height: 12,
    borderRadius: 4,
    width: '100%',
    marginBottom: 6,
  },
  skeletonMediumBarShort: {
    height: 16,
    borderRadius: 4,
    width: '66%',
  },
  skeletonDescription: {
    height: 48,
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 6,
  },
  skeletonTag: {
    height: 20,
    borderRadius: 6,
    width: 60,
  },
  
  // Error state
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
    borderRadius: 14,
    marginHorizontal: 8,
  },
  errorIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Scroll content
  scrollContent: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  
  // View all container
  viewAllContainer: {
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PremiumJobScroll;
// import { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Linking, 
//   StyleSheet, 
//   Dimensions, 
//   Pressable, 
//   Platform,
//   RefreshControl,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../src/context/ThemeContext'; 
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');

// const CACHE_KEY = '@job_listings_cache';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// const formatSalary = (salary) => {
//   if (!salary || salary === 'Negotiable') return 'Negotiable';
//   const num = parseInt(salary);
//   if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
//   if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
//   return `₦${num}`;
// };

// const getTimeAgo = (dateString) => {
//   if (!dateString) return 'Recently';
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (diffDays === 0) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays < 7) return `${diffDays}d ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
//   return 'Over a month ago';
// };

// // Enhanced Professional Job Card
// const PremiumJobCard = ({ job, colors, isDark }) => {
//   const [isPressed, setIsPressed] = useState(false);

//   const getGradientColor = () => {
//     if (job.isFeatured) return colors.primary;
//     if (job.isUrgent) return '#FF6B6B';
//     return colors.primary;
//   };

//   return (
//     <Pressable 
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       style={[
//         styles.cardContainer,
//         { 
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//         },
//         isPressed && styles.cardPressed
//       ]}
//       onPress={() => Linking.openURL(`https://ejobs.com.ng/job/${job._id}`)}
//     >
//       <View style={[styles.accentBar, { backgroundColor: getGradientColor() }]} />

//       {job.isFeatured && (
//         <View style={[styles.premiumBadge, { backgroundColor: colors.primary + '15' }]}>
//           <MaterialCommunityIcon name="star" size={10} color={colors.primary} />
//           <Text style={[styles.premiumBadgeText, { color: colors.primary }]}>Featured</Text>
//         </View>
//       )}

//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.titleContainer}>
//             <View style={[styles.titleIcon, { backgroundColor: colors.primary + '10' }]}>
//               <MaterialCommunityIcon name="briefcase" size={14} color={colors.primary} />
//             </View>
//             <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
//               {job.jobTitle}
//             </Text>
//           </View>
//           {job.isUrgent && (
//             <View style={[styles.urgentTag, { backgroundColor: '#FF4444' }]}>
//               <Text style={styles.urgentText}>●</Text>
//             </View>
//           )}
//         </View>
        
//         <View style={styles.companyContainer}>
//           <View style={[styles.companyIcon, { backgroundColor: colors.backgroundSecondary }]}>
//             <MaterialCommunityIcon name="office-building" size={12} color={colors.textSecondary} />
//           </View>
//           <Text style={[styles.companyName, { color: colors.textSecondary }]} numberOfLines={1}>
//             {job.employer?.companyName || 'Confidential'}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.detailsRow}>
//         <View style={styles.detailItem}>
//           <View style={[styles.detailIcon, { backgroundColor: colors.primary + '08' }]}>
//             <Icon name="map-pin" size={10} color={colors.primary} />
//           </View>
//           <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
//             {job.city || 'Remote'}, {job.state || ''}
//           </Text>
//         </View>
        
//         <View style={styles.detailDivider} />
        
//         <View style={styles.detailItem}>
//           <View style={[styles.detailIcon, { backgroundColor: colors.primary + '08' }]}>
//             <Icon name="clock" size={10} color={colors.primary} />
//           </View>
//           <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
//             {job.workType || 'Full-time'}
//           </Text>
//         </View>
        
//         <View style={styles.detailDivider} />
        
//         <View style={styles.detailItem}>
//           <View style={[styles.detailIcon, { backgroundColor: colors.primary + '08' }]}>
//             <Icon name="dollar-sign" size={10} color={colors.primary} />
//           </View>
//           <Text style={[styles.salaryText, { color: colors.primary }]} numberOfLines={1}>
//             {formatSalary(job.salary)}
//           </Text>
//         </View>
//       </View>

//       {job.jobTag?.length > 0 && (
//         <View style={styles.tagsContainer}>
//           {job.jobTag.slice(0, 2).map((tag, index) => (
//             <View 
//               key={index}
//               style={[styles.tagWrapper, { 
//                 backgroundColor: colors.primary + '08',
//                 borderColor: colors.primary + '15',
//               }]}
//             >
//               <Text style={[styles.tagText, { color: colors.primary }]}>
//                 #{tag}
//               </Text>
//             </View>
//           ))}
//           {job.jobTag.length > 2 && (
//             <View style={[styles.tagWrapper, { 
//               backgroundColor: colors.backgroundSecondary,
//               borderColor: colors.border,
//             }]}>
//               <Text style={[styles.tagText, { color: colors.textSecondary }]}>
//                 +{job.jobTag.length - 2} more
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       <View style={[styles.footer, { borderTopColor: colors.border }]}>
//         <View style={styles.footerLeft}>
//           <View style={styles.ratingContainer}>
//             <Icon name="star" size={12} color="#F59E0B" />
//             <Text style={[styles.ratingText, { color: colors.text }]}>
//               {job.rating?.toFixed(1) || '4.8'}
//             </Text>
//           </View>
//           <View style={[styles.separator, { backgroundColor: colors.border }]} />
//           <View style={styles.timeContainer}>
//             <Icon name="clock" size={10} color={colors.textSecondary} />
//             <Text style={[styles.timeAgo, { color: colors.textSecondary }]}>
//               {getTimeAgo(job.createdAt)}
//             </Text>
//           </View>
//         </View>
        
//         <TouchableOpacity 
//           onPress={() => Linking.openURL(`https://ejobs.com.ng/job/${job._id}`)}
//           style={[
//             styles.viewButton,
//             { 
//               backgroundColor: colors.primary,
//               shadowColor: colors.primary,
//             }
//           ]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.viewButtonText}>Apply</Text>
//           <Icon name="arrow-right" size={14} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </Pressable>
//   );
// };

// // Placeholder Card (shown while loading)
// const PlaceholderCard = ({ colors }) => (
//   <View style={[styles.cardContainer, { 
//     backgroundColor: colors.card,
//     borderColor: colors.border,
//     opacity: 0.6,
//   }]}>
//     <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <View style={styles.titleContainer}>
//           <View style={[styles.titleIcon, { backgroundColor: colors.primary + '10' }]}>
//             <MaterialCommunityIcon name="briefcase" size={14} color={colors.primary} />
//           </View>
//           <Text style={[styles.jobTitle, { color: colors.text, opacity: 0.5 }]} numberOfLines={1}>
//             Loading...
//           </Text>
//         </View>
//       </View>
//       <View style={styles.companyContainer}>
//         <View style={[styles.companyIcon, { backgroundColor: colors.backgroundSecondary }]}>
//           <MaterialCommunityIcon name="office-building" size={12} color={colors.textSecondary} />
//         </View>
//         <Text style={[styles.companyName, { color: colors.textSecondary, opacity: 0.5 }]} numberOfLines={1}>
//           Loading...
//         </Text>
//       </View>
//     </View>
//     <View style={styles.detailsRow}>
//       {[1, 2, 3].map((i) => (
//         <View key={i} style={styles.detailItem}>
//           <View style={[styles.detailIcon, { backgroundColor: colors.primary + '08' }]}>
//             <Icon name="map-pin" size={10} color={colors.primary} />
//           </View>
//           <Text style={[styles.detailText, { color: colors.textSecondary, opacity: 0.5 }]}>•••••</Text>
//         </View>
//       ))}
//     </View>
//     <View style={[styles.footer, { borderTopColor: colors.border }]}>
//       <View style={styles.footerLeft}>
//         <View style={styles.ratingContainer}>
//           <Icon name="star" size={12} color="#F59E0B" />
//           <Text style={[styles.ratingText, { color: colors.text, opacity: 0.5 }]}>4.8</Text>
//         </View>
//       </View>
//       <View style={[styles.viewButton, { backgroundColor: colors.primary, opacity: 0.5 }]}>
//         <Text style={styles.viewButtonText}>Apply</Text>
//         <Icon name="arrow-right" size={14} color="#fff" />
//       </View>
//     </View>
//   </View>
// );

// // Main Component - Optimized for Speed
// const PremiumJobScroll = () => {
//   const { colors, isDark } = useTheme();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const scrollRef = useRef(null);
//   const isMounted = useRef(true);

//   // Load cached data immediately
//   const loadCachedData = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(CACHE_KEY);
//       if (cached) {
//         const { data, timestamp } = JSON.parse(cached);
//         const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
//         if (!isExpired && data.length > 0) {
//           setJobs(data);
//           setLoading(false);
//           return true;
//         }
//       }
//       return false;
//     } catch (error) {
//       console.log('Cache read error:', error);
//       return false;
//     }
//   }, []);

//   // Fetch fresh data
//   const fetchJobs = useCallback(async (isRefresh = false) => {
//     if (isRefresh) {
//       setRefreshing(true);
//     }

//     try {
//       const response = await axios.get('https://backend.ejobs.com.ng/api/v1/job/jobs/', {
//         timeout: 8000, // 8 second timeout
//         headers: {
//           'Cache-Control': 'no-cache',
//         }
//       });
      
//       if (response.data.status && response.data.data) {
//         const jobsData = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : [response.data.data];
        
//         const enhancedJobs = jobsData.map((job, index) => ({
//           ...job,
//           isFeatured: index % 3 === 0,
//           isUrgent: index % 5 === 0,
//           rating: 4.0 + Math.random() * 1.5,
//         }));
        
//         const slicedJobs = enhancedJobs.slice(0, 6);
        
//         if (isMounted.current) {
//           setJobs(slicedJobs);
//           setError(null);
          
//           // Cache the data
//           await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
//             data: slicedJobs,
//             timestamp: Date.now(),
//           }));
//         }
//       }
//     } catch (err) {
//       console.log('Fetch error:', err.message);
      
//       // Only show error if we have no cached data
//       if (isMounted.current) {
//         const hasCache = await loadCachedData();
//         if (!hasCache) {
//           setError('Unable to load opportunities');
//         }
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     }
//   }, [loadCachedData]);

//   // Initialize - load cache first, then fetch
//   useEffect(() => {
//     isMounted.current = true;
    
//     const initialize = async () => {
//       // 1. Load cached data immediately
//       const hasCache = await loadCachedData();
      
//       // 2. Always fetch fresh data in background
//       await fetchJobs(false);
//     };
    
//     initialize();

//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const handleRefresh = () => {
//     fetchJobs(true);
//   };

//   if (error && jobs.length === 0) {
//     return (
//       <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
//         <Icon name="alert-circle" size={32} color={colors.primary} />
//         <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error}</Text>
//         <TouchableOpacity onPress={() => fetchJobs(false)}>
//           <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Show placeholders while loading (no spinner)
//   const displayJobs = jobs.length > 0 ? jobs : Array(3).fill(null);

//   return (
//     <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
//       <View style={styles.titleSection}>
//         <View>
//           <Text style={[styles.mainTitle, { color: colors.text }]}>Jobs You May Like</Text>
//           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//             Discover your next career opportunity
//           </Text>
//         </View>
//         {!loading && jobs.length > 0 && (
//           <TouchableOpacity 
//             onPress={() => Linking.openURL('https://ejobs.com.ng/jobs')}
//             style={styles.viewAllButton}
//           >
//             <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
//             <Icon name="chevron-right" size={16} color={colors.primary} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView 
//         ref={scrollRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         snapToInterval={width * 0.75 + 12}
//         decelerationRate="fast"
//         snapToAlignment="start"
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             tintColor={colors.primary}
//             colors={[colors.primary]}
//           />
//         }
//       >
//         {displayJobs.map((job, index) => (
//           job ? (
//             <PremiumJobCard 
//               key={`${job._id}_${index}`} 
//               job={job} 
//               colors={colors}
//               isDark={isDark}
//             />
//           ) : (
//             <PlaceholderCard key={`placeholder-${index}`} colors={colors} />
//           )
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
  
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//     paddingHorizontal: 4,
//   },
//   mainTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   subtitle: {
//     fontSize: 13,
//     opacity: 0.7,
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     gap: 2,
//   },
//   viewAllText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
  
//   cardContainer: {
//     width: width * 0.75,
//     borderRadius: 14,
//     borderWidth: 1,
//     padding: 16,
//     marginHorizontal: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   cardPressed: {
//     transform: [{ scale: 0.97 }],
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
  
//   accentBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 3,
//     borderTopLeftRadius: 14,
//     borderTopRightRadius: 14,
//   },
  
//   premiumBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     marginBottom: 10,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   premiumBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
  
//   header: {
//     marginBottom: 10,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     gap: 8,
//   },
//   titleIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     flex: 1,
//   },
//   urgentTag: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 4,
//   },
//   urgentText: {
//     color: '#fff',
//     fontSize: 8,
//   },
//   companyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingLeft: 4,
//   },
//   companyIcon: {
//     width: 20,
//     height: 20,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   companyName: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
  
//   detailsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 10,
//     backgroundColor: 'transparent',
//     borderRadius: 8,
//     paddingVertical: 2,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 4,
//   },
//   detailIcon: {
//     width: 18,
//     height: 18,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailText: {
//     fontSize: 11,
//     fontWeight: '400',
//   },
//   detailDivider: {
//     width: 1,
//     height: 14,
//     backgroundColor: '#E5E7EB',
//     marginHorizontal: 4,
//   },
//   salaryText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
  
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//     marginBottom: 12,
//   },
//   tagWrapper: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//   },
//   tagText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
  
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 12,
//     borderTopWidth: 0.5,
//   },
//   footerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   separator: {
//     width: 1,
//     height: 14,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//   },
//   timeAgo: {
//     fontSize: 11,
//     opacity: 0.7,
//   },
//   viewButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   viewButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
  
//   // Error
//   errorContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     alignItems: 'center',
//     borderRadius: 12,
//     marginHorizontal: 16,
//   },
//   errorMessage: {
//     fontSize: 13,
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   retryText: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 8,
//   },
  
//   scrollContent: {
//     paddingBottom: 4,
//     paddingRight: 10,
//   },
// });

// export default PremiumJobScroll;