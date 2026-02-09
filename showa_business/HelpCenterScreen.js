import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('window');

const helpCategories = [
  {
    key: 'account',
    title: 'Account & Profile',
    description: 'Manage your account settings and profile',
    icon: 'person',
    color: '#4A6FFF',
    gradient: ['#4A6FFF', '#6B8CFF'],
  },
  {
    key: 'messaging',
    title: 'Messaging & Calls',
    description: 'Chats, voice/video calls, groups',
    icon: 'chat',
    color: '#00B894',
    gradient: ['#00B894', '#55EFC4'],
  },
  {
    key: 'social',
    title: 'Social Features',
    description: 'Posts, reels, live streaming',
    icon: 'public',
    color: '#FD79A8',
    gradient: ['#FD79A8', '#FF9ACD'],
  },
  {
    key: 'earnings',
    title: 'Earn Money',
    description: 'Coins, rewards, monetization',
    icon: 'monetization-on',
    color: '#FDCB6E',
    gradient: ['#FDCB6E', '#FFEAA7'],
  },
  {
    key: 'privacy',
    title: 'Privacy & Security',
    description: 'Safety controls and data protection',
    icon: 'security',
    color: '#6C5CE7',
    gradient: ['#6C5CE7', '#A29BFE'],
  },
  {
    key: 'business',
    title: 'Business Tools',
    description: 'Catalog, analytics, e-commerce',
    icon: 'business',
    color: '#00CEC9',
    gradient: ['#00CEC9', '#81ECEC'],
  },
  {
    key: 'support',
    title: 'Help & Support',
    description: 'Contact us and get assistance',
    icon: 'help',
    color: '#E17055',
    gradient: ['#E17055', '#FAB1A0'],
  },
];

const quickActions = [
  {
    title: 'Live Chat Support',
    description: 'Chat with our support team',
    icon: 'live-help',
    color: '#4A6FFF',
  },
  {
    title: 'Community Forum',
    description: 'Get help from other users',
    icon: 'forum',
    color: '#00B894',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch how-to guides',
    icon: 'ondemand-video',
    color: '#FD79A8',
  },
];

export default function HelpCenterScreen({ navigation }) {
  const { colors, isDark } = useTheme(); // Get theme colors

  const renderCategoryItem = (category, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.categoryCard, { 
        borderBottomColor: colors.border,
        backgroundColor: colors.card 
      }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('HelpTopic', { topicKey: category.key })}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={category.icon} size={28} color="#FFFFFF" />
      </LinearGradient>
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
        <Text style={[styles.categoryDescription, { color: colors.textSecondary }]} numberOfLines={1}>
          {category.description}
        </Text>
      </View>
      <Icon name="chevron-right" size={22} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderQuickAction = (action, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionCard, { 
        borderBottomColor: colors.border,
        backgroundColor: colors.card 
      }]}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIconContainer, { 
        backgroundColor: isDark ? colors.backgroundSecondary : action.color + '15' 
      }]}>
        <Icon name={action.icon} size={24} color={action.color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
        <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>{action.description}</Text>
      </View>
      <Icon name="arrow-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.card}
        barStyle={isDark ? "light-content" : "dark-content"}
        animated={true}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        }]}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Get answers to your questions
            </Text>
          </View>
          <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="search" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Banner */}
          <LinearGradient
            colors={['#0d64dd', '#0750b5']}
            style={styles.heroBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>How can we help you?</Text>
              <Text style={styles.heroSubtitle}>
                Browse help topics or contact our support team
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Search help below</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Categories Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by Category</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                
              </Text>
            </View>
            <View style={[styles.categoriesGrid, { 
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
              shadowOpacity: isDark ? 0.1 : 0.08,
            }]}>
              {helpCategories.map(renderCategoryItem)}
            </View>
          </View>

          {/* Popular Articles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Articles</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.primary }]}></Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.articlesList, { 
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
              shadowOpacity: isDark ? 0.1 : 0.08,
            }]}>
              {[
                'How to earn coins on Showa',
                'Setting up your business profile',
                'Going live: Complete guide',
                'Privacy settings explained',
                'Creating engaging short videos',
              ].map((article, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.articleItem, { 
                    borderBottomColor: colors.border,
                    backgroundColor: colors.card 
                  }]}
                >
                  <View style={[styles.articleIcon, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}>
                    <Icon name="article" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.articleText, { color: colors.text }]} numberOfLines={2}>
                    {article}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Section */}
          <LinearGradient
            colors={isDark ? [colors.backgroundSecondary, colors.background] : ['#F8F9FA', '#FFFFFF']}
            style={[styles.contactSection, {
              shadowColor: isDark ? '#000' : '#000',
              shadowOpacity: isDark ? 0.15 : 0.1,
            }]}
          >
            <Icon name="support-agent" size={40} color={colors.primary} />
            <Text style={[styles.contactTitle, { color: colors.text }]}>Still need help?</Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              Our support team is available 24/7 to assist you
            </Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ContactUs')} 
                style={[
                  styles.contactButton, 
                  styles.emailButton, 
                  { 
                    backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF',
                    borderColor: colors.primary 
                  }
                ]}
              >
                <Icon name="email" size={18} color={colors.primary} />
                <Text style={[styles.contactButtonText, { color: colors.primary }]}>
                  Visit Support Page
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
   
  },
  container: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
   
    borderBottomWidth: 1,
   
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor handled inline
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    
  },
  headerSubtitle: {
    fontSize: 12,
    
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroBanner: {
    margin: 16,
    borderRadius: 20,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#4A6FFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  heroContent: {
    padding: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A6FFF',
  },
  heroIcon: {
    marginRight: 80,
    opacity: 0.8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
   
  },
  sectionSubtitle: {
    fontSize: 13,
    
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 14,
    
    fontWeight: '500',
  },
  categoriesGrid: {
    
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
       
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    
  },
  categoryGradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
   
  },
  quickActionsGrid: {
   
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
   
  },
  articlesList: {
   
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
       
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    
  },
  articleIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
   
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  articleText: {
    flex: 1,
    fontSize: 14,
  
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 2,
    marginBottom: 30,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },

        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  emailButton: {
    borderWidth: 1,
    
  },
  chatButton: {
    backgroundColor: '#4A6FFF',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    
  },
});