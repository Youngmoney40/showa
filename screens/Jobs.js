import { useState, useEffect, useRef } from 'react';
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
import { useTheme } from '../src/context/ThemeContext'; // Adjust path as needed

const { width } = Dimensions.get('window');

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

// Premium Job Card Component
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
            <MaterialCommunityIcon name="sparkles" size={12} color={colors.primary} />
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
            {job.workType || 'Full-time'}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricItem, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: colors.card }]}>
              <Icon name="award" size={14} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Experience</Text>
              <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
                {job.experienceLength || 'Not specified'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.metricItem, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.metricIconContainer, { backgroundColor: colors.card }]}>
              <Icon name="layers" size={14} color="#16A34A" />
            </View>
            <View>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Salary</Text>
              <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
                {formatSalary(job.salary)}
              </Text>
            </View>
          </View>
        </View>

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

        {/* Tags Section */}
        {job.jobTag?.length > 0 && (
          <View style={styles.tagsSection}>
            <View style={styles.tagsContainer}>
              {job.jobTag.slice(0, 3).map((tag, index) => (
                <Text 
                  key={index}
                  style={[styles.tag, { 
                    backgroundColor: colors.primary + '20', // 20% opacity
                    color: colors.primary,
                    borderColor: colors.primary + '30'
                  }]}
                  numberOfLines={1}
                >
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Footer Section */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerLeft}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {job.rating?.toFixed(1) || '4.8'}
            </Text>
          </View>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <Text style={[styles.timeAgo, { color: colors.textSecondary }]}>
            {getTimeAgo(job.createdAt)}
          </Text>
        </View>
        
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
            View Details
          </Text>
          <Icon name="external-link" size={14} color={isPressed ? '#fff' : colors.primary} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

// Loading Skeleton Component with Theme
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

// Main Component
const PremiumJobScroll = () => {
  const { colors, isDark } = useTheme(); // Get theme colors
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
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
        
        setJobs(enhancedJobs.slice(0, 6)); // Reduced from 8 to 6
      }
    } catch (err) {
      setError('Unable to load opportunities at the moment. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.errorIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="trending-up" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Connection Error</Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity 
          onPress={fetchJobs}
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

        <View style={styles.navButtons}>
          <TouchableOpacity 
            onPress={scrollLeft}
            style={[styles.navButton, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}
          >
            <Icon name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={scrollRight}
            style={[styles.navButton, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}
          >
            <Icon name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
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
        {loading ? (
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

      {/* View All Link */}
      {!loading && jobs.length > 0 && (
        <View style={styles.viewAllContainer}>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://ejobs.com.ng/jobs')}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View all Jobs</Text>
            <Icon name="external-link" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
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
    fontSize: 22,
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
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
    marginTop: 16,
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