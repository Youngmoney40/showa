

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  LogBox,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

const ExploreScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [activeModal, setActiveModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  const categories = ['All', 'Business', 'Content', 'Monetization', 'Connect'];

  const iconColors = {
    'Business Tool': '#066bdeff',
    'Official Broadcast': '#ff9e03ff',
    'Official Search': '#50e3c2',
    'Oosh Business': '#9013fe',
    'Live': '#e94e77',
    'Channels': '#d321beff',
    'e-Music': '#c52f2fff',
    'Monetize': '#ff6f61',
    'Quick Connect': '#246BFD',
    'Market Place': '#8a2be2',
    'Manage': '#ff8c00',
    'Analytics': '#2ecc71',
    'Training': '#9b59b6',
    'Support': '#3498db',
    'Events': '#e74c3c'
  };

  const menuItems = [
    { id: '1', title: 'Business Tool', description: 'Comprehensive tools to manage and grow your business', screen: 'ToolsScreen', icon: 'tools', category: 'Business' },
    { id: '2', title: 'Official Broadcast', description: 'Send official updates to your audience', screen: 'BroadcastHome', icon: 'bullhorn', category: 'Business' },
    { id: '3', title: 'Official Search', description: 'Find verified content and businesses', screen: 'OfficialSearch', icon: 'shield-search', category: 'Business' },
    { id: '4', title: 'Quick Connect', description: 'Instant deals & offers with real-time matching', screen: 'Supplyrequest', icon: 'connection', category: 'Connect' },
    { id: '5', title: 'Market Place', description: 'Browse thousands of products and services', screen: 'MarketPlace', icon: 'store-search', category: 'Business' },
    { id: '6', title: 'Manage Posts', description: 'Manage your account and content in one place', screen: 'ManagePost', icon: 'post', category: 'Content' },
    { id: '7', title: 'Channels', description: 'Create and manage your communication channels', screen: 'BJoinChannel', icon: 'message-text', category: 'Content' },
    { id: '8', title: 'e-Music', description: 'Stream and monetize your music content', screen: 'Music', icon: 'music-note', category: 'Content' },
    { id: '9', title: 'Monetize', description: 'Multiple ways to earn from your activities', screen: 'Monetize', icon: 'currency-usd', category: 'Monetization' },
    { id: '11', title: 'Go Live  or Watch live Streams', description: 'Discover live broadcasts from creators', screen: 'LiveStreaming', icon: 'play-box-multiple', category: 'Content' },
    { id: '12', title: 'Fast Earning', description: 'Make upto 1-million naira with a short perior of time', screen: 'EarningDashbord', icon: 'rocket', category: 'Business' },
    { id: '13', title: 'E-Report', description: 'Report any illegal activities on your area', screen: 'GlobalIssueReport', icon: 'alert-box', category: 'Business' },
    { id: '14', title: 'Support', description: '24/7 assistance for all your needs', screen: 'ContactUs', icon: 'lifebuoy', category: 'Business' },
    { id: '15', title: 'E-News', description: 'Stay updated with the latest news', screen: 'NewsList', icon: 'newspaper-variant', category: 'Connect' },
    { id: '16', title: 'Essential Brands', description: 'Stay updated with the latest news', screen: 'EssentialPlatforms', icon: 'apps', category: 'Connect' },
  ];

  const featuredItems = [
    { id: 'f1', title: 'Premium Features', description: 'Unlock exclusive tools and capabilities', screen: 'Premium', icon: 'crown', color: '#FFD700', category: 'Monetization' },
    { id: 'f2', title: 'Success Stories', description: 'Learn from top performers on our platform', screen: 'SuccessStory', icon: 'trophy', color: '#FF6B6B', category: 'Business' },
  ];

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handlePress = (item) => {
    if (item.title === 'Monetize') return setActiveModal('monetize');
    if (item.title === 'Quick Connect') return setActiveModal('quickConnect');
    if (item.title === 'Premium Features') return setActiveModal('premium');
    navigation.navigate(item.screen);
  };

  const handelNavigation = () => {
    navigation.navigate('MonetizationRequestForm');
    setActiveModal(null);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(item)}
      style={[
        styles.categoryItem,
        { backgroundColor: activeCategory === item ? colors.primary : colors.surfaceVariant },
        activeCategory === item && { elevation: 2 },
      ]}
    >
      <Text style={[
        styles.categoryText,
        { color: activeCategory === item ? '#fff' : colors.textSecondary },
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card || colors.surface,
          borderLeftColor: colors.primary,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.4 : 0.08,
        }
      ]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={isDark ? ['rgba(50, 50, 50, 1)', 'rgba(60, 60, 60, 1)'] : ['rgba(240, 239, 239, 1)', 'rgba(243, 243, 243, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBackground}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={iconColors[item.title] || colors.primary}
        />
      </LinearGradient>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{item.description}</Text>
      {item.color && (
        <View style={styles.featuredBadge}>
          <FontAwesome name="star" size={12} color={item.color} />
          <Text style={[styles.featuredText, { color: item.color }]}>Featured</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: isDark ? `${item.color}30` : `${item.color}20` }]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.featuredIcon, { backgroundColor: isDark ? `${item.color}20` : 'rgba(255,255,255,0.25)' }]}>
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
      </View>
      <View style={styles.featuredTextContainer}>
        <Text style={[styles.featuredTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={[styles.featuredDescription, { color: colors.textSecondary }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      nestedScrollEnabled={true} 
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent={Platform.OS === 'android'}
          backgroundColor={Platform.OS === 'android' ? colors.primaryDark || colors.primary : undefined}
        />

        <LinearGradient
          colors={isDark ? [colors.primaryDark || colors.primary, colors.primary] : [colors.primary, colors.primaryDark || colors.primary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Explore Features</Text>
            <Text style={styles.headerSubtitle}>
              Discover powerful tools to grow your business with our app
            </Text>
          </View>
        </LinearGradient>

        <View style={[styles.featuredSection, { backgroundColor: colors.card || colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Tools</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
              data={featuredItems}
              renderItem={renderFeaturedItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </ScrollView>
        </View>

        <View style={[styles.categoriesContainer, { backgroundColor: colors.card || colors.surface }]}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 16, marginTop: 8 }]}>
              {activeCategory === 'All' ? 'All Features' : activeCategory}
            </Text>
          }
          style={{ backgroundColor: colors.background }}
        />

        {/* Monetize Modal */}
        <Modal
          isVisible={activeModal === 'monetize'}
          onBackdropPress={() => setActiveModal(null)}
          backdropOpacity={isDark ? 0.8 : 0.6}
          style={styles.modal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.card || colors.surface }]}>
            <LottieView 
              source={require("../assets/animations/money.json")} 
              autoPlay 
              loop 
              style={styles.animation} 
            />
            <Text style={[styles.modalTitleM, { color: colors.text }]}>Monetize Your Content</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Unlock multiple revenue streams for your business and content. Our platform offers various ways to monetize:
            </Text>
            <View style={styles.monetizationOptions}>
              {[
                { icon: "advertisements", text: "Ad Revenue Sharing" },
                { icon: "account-cash", text: "Paid Subscriptions" },
                { icon: "gift", text: "Sponsorships" },
              ].map((opt, i) => (
                <View key={i} style={[styles.option, { backgroundColor: colors.backgroundSecondary || colors.surfaceVariant }]}>
                  <MaterialCommunityIcons name={opt.icon} size={20} color={colors.primary} />
                  <Text style={[styles.optionText, { color: colors.text }]}>{opt.text}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={handelNavigation}>
              <Text style={styles.modalButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton2, { borderTopWidth: 1, borderTopColor: colors.border }]} 
              onPress={() => setActiveModal(null)}
            >
              <Text style={[styles.modalButtonText2, { color: colors.textSecondary }]}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Quick Connect Modal */}
        <Modal
          isVisible={activeModal === 'quickConnect'}
          onBackdropPress={() => setActiveModal(null)}
          backdropOpacity={isDark ? 0.8 : 0.6}
          style={styles.modal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.card || colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Quick Connect</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Instantly connect with potential customers or suppliers in real-time. Our smart matching algorithm helps you find the perfect business partners.
            </Text>
            <View style={styles.stepsContainer}>
              {[
                { icon: "pencil-outline", color: colors.primary, bg: isDark ? `${colors.primary}30` : `${colors.primary}20`, text: "Post your offer or request" },
                { icon: "bell-outline", color: "#f5a623", bg: isDark ? '#f5a62330' : '#f5a62320', text: "Get instant notifications" },
                { icon: "chat-outline", color: "#50e3c2", bg: isDark ? '#50e3c230' : '#50e3c220', text: "Connect and finalize deals" },
              ].map((step, i) => (
                <View key={i} style={styles.step}>
                  <View style={[styles.stepIcon, { backgroundColor: step.bg }]}>
                    <MaterialCommunityIcons name={step.icon} size={20} color={step.color} />
                  </View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>{step.text}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.primary }]} 
              onPress={() => { setActiveModal(null); navigation.navigate('Supplyrequest'); }}
            >
              <Text style={styles.modalButtonText}>Start Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton2, { borderTopWidth: 1, borderTopColor: colors.border }]} 
              onPress={() => setActiveModal(null)}
            >
              <Text style={[styles.modalButtonText2, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Premium Modal */}
        <Modal
          isVisible={activeModal === 'premium'}
          onBackdropPress={() => setActiveModal(null)}
          backdropOpacity={isDark ? 0.8 : 0.6}
          style={styles.modal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.card || colors.surface }]}>
            <Text style={[styles.modalTitle, { color: '#FFD700' }]}>Premium Features</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Upgrade to access exclusive tools that will take your business to the next level:
            </Text>
            <View style={styles.premiumFeatures}>
              {[
                { icon: "chart-bar", text: "Advanced Analytics Dashboard" },
                { icon: "badge-account", text: "Priority Customer Support" },
                { icon: "rocket", text: "Increased Visibility" },
              ].map((feat, i) => (
                <View key={i} style={[styles.feature, { backgroundColor: isDark ? colors.backgroundSecondary : '#fffae5' }]}>
                  <MaterialCommunityIcons name={feat.icon} size={20} color="#FFD700" />
                  <Text style={[styles.featureText, { color: colors.text }]}>{feat.text}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FFD700' }]} onPress={() => navigation.navigate('ContactUs')}>
              <Text style={[styles.modalButtonText, { color: '#000' }]}>Upgrade Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton2, { borderTopWidth: 1, borderTopColor: colors.border }]} 
              onPress={() => setActiveModal(null)}
            >
              <Text style={[styles.modalButtonText2, { color: colors.textSecondary }]}>Not Now</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  backButton: { padding: 12 },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 4 : 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Lato-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
  featuredSection: {
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Lato-Bold',
  },
  featuredList: { paddingHorizontal: 16 },
  featuredCard: {
    width: width * 0.72,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredTextContainer: { flex: 1 },
  featuredTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  featuredDescription: { fontSize: 14 },
  categoriesContainer: {
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesList: { paddingHorizontal: 12 },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Lato-SemiBold',
  },
  listContent: { 
    paddingBottom: 32, 
    paddingHorizontal: 4,
    backgroundColor: 'transparent'
  },
  columnWrapper: { 
    justifyContent: 'space-between', 
    marginBottom: 12,
    paddingHorizontal: 12
  },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
 
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Lato-Bold',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Lato-Regular',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  modal: { justifyContent: 'center', alignItems: 'center', margin: 0 },
  modalContainer: {
    width: width * 0.88,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  animation: { width: '100%', height: 220, marginTop: -30, marginBottom: -30 },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Lato-Black',
  },
  modalTitleM: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Lato-Black',
    marginTop: 40,
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'Lato-Regular',
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  modalButton2: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
  },
  modalButtonText2: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 12,
    fontFamily: 'Lato-SemiBold',
  },
  stepsContainer: { width: '100%', marginVertical: 16 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'Lato-Regular',
  },
  monetizationOptions: { width: '100%', marginVertical: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 14,
    fontFamily: 'Lato-Medium',
  },
  premiumFeatures: { width: '100%', marginVertical: 12 },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 14,
    fontFamily: 'Lato-Medium',
  },
});

export default ExploreScreen;
