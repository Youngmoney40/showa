import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('window');

const topicData = {
  account: {
    title: 'Account Management',
    description: 'Complete guide to managing your Showa account',
    icon: 'person',
    color: '#4A6FFF',
    content: `
• **Profile Management**
  - Update profile picture, name, and bio
  - Customize theme and display preferences
  - Link social media accounts
  - Set account privacy levels

• **Account Security**
  - Two-factor authentication setup
  - Login activity monitoring
  - Connected device management
  - Password and recovery options

• **Account Actions**
  - Switch between personal and business modes
  - Deactivate or delete account
  - Data export and download
  - Account verification process
    `,
    features: ['Profile', 'Security', 'Privacy', 'Verification']
  },
  
  messaging: {
    title: 'Messaging Features',
    description: 'Chat, call, and connect with anyone',
    icon: 'chat',
    color: '#00B894',
    content: `
• **Personal & Business Chats**
  - End-to-end encrypted messaging
  - Voice and video calls (individual & group)
  - File sharing up to 2GB
  - Business catalog integration

• **Advanced Features**
  - Disappearing messages (24h/7d/90d)
  - Message reactions and replies
  - Chat wallpapers and themes
  - Message scheduling for businesses

• **Group Management**
  - Create groups up to 512 members
  - Admin controls and permissions
  - Group polls and announcements
  - Community group features
    `,
    features: ['Encryption', 'Video Calls', 'File Share', 'Groups']
  },
  
  social: {
    title: 'Social Features',
    description: 'Connect, share, and engage',
    icon: 'public',
    color: '#FD79A8',
    content: `
• **Showa Posts & Timeline**
  - Post text, images, videos, and polls
  - Like, comment, and share posts
  - Hashtag support and trending topics
  - Bookmark favorite content

• **Short Videos (Showa Reels)**
  - Create 15-60 second videos
  - Add music, filters, and effects
  - Duet and stitch features
  - Video discovery algorithm

• **Live Streaming**
  - Go live to unlimited viewers
  - Live chat and reactions
  - Guest invitations
  - Live recording and replay
    `,
    features: ['Posts', 'Reels', 'Live', 'Hashtags']
  },
  
  earnings: {
    title: 'Earn with Showa',
    description: 'Monetize your engagement',
    icon: 'monetization-on',
    color: '#FDCB6E',
    content: `
• **Earning Methods**
  - Watch sponsored video ads
  - Earn coins for likes, shares, comments
  - Complete surveys and offers
  - Referral bonus program

• **Coin System**
  - 1000 coins = $1 USD
  - Daily earning limits apply
  - Withdrawal threshold: 5000 coins
  - Multiple payout methods

• **Monetization Tools**
  - Creator fund for popular content
  - Brand partnership opportunities
  - Premium subscription features
  - Digital product sales
    `,
    features: ['Ads', 'Surveys', 'Referrals', 'Creator Fund']
  },
  
  privacy: {
    title: 'Privacy & Security',
    description: 'Control your digital presence',
    icon: 'security',
    color: '#6C5CE7',
    content: `
• **Privacy Controls**
  - Customize post visibility (Public/Friends/Only Me)
  - Control who can message/call you
  - Hide Last Seen and Online status
  - Manage story viewers

• **Data Protection**
  - End-to-end encryption for all chats
  - Secure cloud backup
  - Data download and portability
  - Ad personalization controls

• **Safety Features**
  - Block and report users
  - Content moderation tools
  - Age-restricted content filters
  - Community guidelines enforcement
    `,
    features: ['Encryption', 'Visibility', 'Safety', 'Controls']
  },
  
  business: {
    title: 'Business Tools',
    description: 'Grow your business on Showa',
    icon: 'business',
    color: '#00CEC9',
    content: `
• **Business Profile**
  - Showcase products/services
  - Business hours and location
  - Quick replies and automated messages
  - Order management system

• **Marketing Tools**
  - Targeted promotions
  - Business analytics dashboard
  - Customer relationship management
  - Multi-agent support

• **E-commerce Features**
  - Product catalog management
  - Shopping cart integration
  - Secure payment processing
  - Order tracking and fulfillment
    `,
    features: ['Catalog', 'Analytics', 'CRM', 'Payments']
  },
  
  support: {
    title: 'Help & Support',
    description: 'Get assistance anytime',
    icon: 'help',
    color: '#E17055',
    content: `
• **Support Channels**
  - In-app help center
  - Live chat with support agents
  - Community forums
  - Video tutorials and guides

• **Resources**
  - Frequently Asked Questions
  - Troubleshooting guides
  - Feature announcements
  - Developer documentation

• **Contact Options**
  - Email: support@showa.com
  - Twitter: @ShowaSupport
  - Help Center: help.showa.com
  - Business Inquiries: biz@showa.com
    `,
    features: ['Live Chat', 'FAQs', 'Community', 'Contact']
  }
};

export default function HelpTopicScreen({ route, navigation }) {
  const { colors, isDark } = useTheme(); // Get theme colors
  const { topicKey } = route.params;
  const topic = topicData[topicKey];

  const renderFeatureTags = () => (
    <View style={styles.featuresContainer}>
      {topic.features.map((feature, index) => (
        <View key={index} style={[
          styles.featureTag, 
          { backgroundColor: isDark ? colors.backgroundSecondary : topic.color + '15' }
        ]}>
          <Text style={[styles.featureText, { color: topic.color }]}>{feature}</Text>
        </View>
      ))}
    </View>
  );

  const renderContentLines = () => {
    return topic.content.trim().split('\n').map((line, index) => {
      if (line.startsWith('•')) {
        return (
          <Text key={index} style={[styles.bulletPoint, { color: colors.text }]}>
            {line}
          </Text>
        );
      } else if (line.trim() && line.startsWith('  -')) {
        return (
          <Text key={index} style={[styles.subPoint, { color: colors.textSecondary }]}>
            {line}
          </Text>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
            <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>Help Center</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text }]}>{topic.title}</Text>
          </View>
          <TouchableOpacity style={[styles.shareButton, { backgroundColor: isDark ? colors.backgroundSecondary : '#F0F4FF' }]}>
            <Icon name="share" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={[
            styles.heroSection, 
            { backgroundColor: isDark ? colors.backgroundSecondary : topic.color + '10' }
          ]}>
            <View style={[styles.iconContainer, { backgroundColor: topic.color }]}>
              <Icon name={topic.icon} size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
            <Text style={[styles.topicDescription, { color: colors.textSecondary }]}>
              {topic.description}
            </Text>
            {renderFeatureTags()}
          </View>

          {/* Content Section */}
          <View style={[
            styles.contentCard, 
            { 
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
              shadowOpacity: isDark ? 0.1 : 0.08,
            }
          ]}>
            <View style={styles.contentHeader}>
              <Text style={[styles.contentHeaderTitle, { color: colors.text }]}>Detailed Guide</Text>
              <View style={[styles.contentHeaderLine, { backgroundColor: colors.primary }]} />
            </View>
            {renderContentLines()}
          </View>

          {/* Related Topics */}
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, { color: colors.text }]}>Related Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
              {Object.keys(topicData)
                .filter(key => key !== topicKey)
                .slice(0, 3)
                .map(key => (
                  <TouchableOpacity 
                    key={key}
                    style={[
                      styles.relatedCard, 
                      { 
                        backgroundColor: colors.card,
                        borderLeftColor: topicData[key].color,
                        shadowColor: isDark ? '#000' : '#000',
                        shadowOpacity: isDark ? 0.05 : 0.05,
                      }
                    ]}
                    onPress={() => navigation.replace('HelpTopic', { topicKey: key })}
                  >
                    <Icon name={topicData[key].icon} size={20} color={topicData[key].color} />
                    <Text style={[styles.relatedCardTitle, { color: colors.text }]}>
                      {topicData[key].title}
                    </Text>
                    <Text style={[styles.relatedCardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                      {topicData[key].description}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={[styles.actionsTitle, { color: colors.text }]}>Need More Help?</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[
                styles.actionButton, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOpacity: isDark ? 0.05 : 0.05,
                }
              ]}>
                <Icon name="live-help" size={20} color="#4A6FFF" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[
                styles.actionButton, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOpacity: isDark ? 0.05 : 0.05,
                }
              ]}>
                <Icon name="email" size={20} color="#00B894" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Email Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[
                styles.actionButton, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOpacity: isDark ? 0.05 : 0.05,
                }
              ]}>
                <Icon name="forum" size={20} color="#FD79A8" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Community</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerTitle, { color: colors.textSecondary }]}>Showa Help Center</Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Last updated: {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
            <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
              © 2024 Showa Social Platform. All rights reserved.
            </Text>
          </View>
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
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 16,

    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    
  },
  contentCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
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
  contentHeader: {
    marginBottom: 20,
  },
  contentHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color handled inline
    marginBottom: 8,
  },
  contentHeaderLine: {
    height: 3,
    width: 40,
   
    borderRadius: 2,
  },
  bulletPoint: {
    fontSize: 15,
    fontWeight: '600',
   
    marginTop: 12,
    marginBottom: 4,
    lineHeight: 22,
  },
  subPoint: {
    fontSize: 14,
   
    marginLeft: 16,
    marginBottom: 2,
    lineHeight: 20,
  },
  relatedSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    
    marginBottom: 16,
  },
  relatedScroll: {
    flexDirection: 'row',
  },
  relatedCard: {
    width: 180,
   
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderLeftWidth: 4,
   
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  relatedCardTitle: {
    fontSize: 14,
    fontWeight: '600',
   
    marginTop: 12,
    marginBottom: 4,
  },
  relatedCardDesc: {
    fontSize: 12,
   
    lineHeight: 16,
  },
  actionsSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
   
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
   
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    
    marginBottom: 38,
  },
  footerText: {
    fontSize: 12,
   
    marginBottom: 4,
  },
  footerNote: {
    fontSize: 11,
   
    textAlign: 'center',
  },
});