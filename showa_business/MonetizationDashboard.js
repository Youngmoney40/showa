import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Custom Chart Component
const CustomLineChart = ({ data, labels, colors, isDark }) => {
  const chartWidth = Math.max(width - 60, 350);
  const chartHeight = 200;
  const padding = 30;
  const chartAreaWidth = chartWidth - padding * 2;
  const chartAreaHeight = chartHeight - padding * 2;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.chartPlaceholder, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
        <Text style={[styles.chartPlaceholderText, { color: colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }

  const maxValue = Math.max(...data) * 1.2 || 100;
  const minValue = 0;
  const range = maxValue - minValue;

  // Generate points for the line
  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1 || 1)) * chartAreaWidth,
    y: padding + chartAreaHeight - ((value - minValue) / range) * chartAreaHeight,
    value: value,
  }));

  // Create path for the line
  const path = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  // Create gradient area path
  const areaPath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ` L ${points[points.length - 1].x} ${padding + chartAreaHeight} L ${points[0].x} ${padding + chartAreaHeight} Z`;

  return (
    <View style={[styles.chartContainer, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <View style={[styles.chartWrapper, { width: chartWidth, height: chartHeight }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={[styles.axisLabel, { color: colors.textTertiary }]}>
            {Math.round(maxValue)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textTertiary }]}>
            {Math.round(maxValue * 0.5)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textTertiary }]}>
            {Math.round(minValue)}
          </Text>
        </View>

        <View style={styles.chartArea}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                {
                  top: padding + chartAreaHeight * (1 - ratio),
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
              ]}
            />
          ))}

          {/* Gradient area */}
          <View style={[styles.areaGradient, { 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            opacity: 0.2,
            backgroundColor: colors.primary,
          }]} />

          {/* Area fill */}
          <View
            style={[
              styles.areaFill,
              {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                backgroundColor: colors.primary,
                opacity: 0.1,
              }
            ]}
          />

          {/* Line */}
          <View
            style={[
              styles.linePath,
              {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
              }
            ]}
          />

          {/* Dots */}
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                  backgroundColor: colors.primary,
                  borderColor: isDark ? '#1a1a1a' : '#ffffff',
                }
              ]}
            >
              <View style={[styles.dotInner, { backgroundColor: colors.primary }]} />
            </View>
          ))}

          {/* X-axis labels */}
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                {
                  left: padding + (index / (labels.length - 1 || 1)) * chartAreaWidth - 15,
                  top: chartHeight - 5,
                  color: colors.textTertiary,
                }
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const MonetizationDashboard = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [payoutModalVisible, setPayoutModalVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Paystack');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/monetization/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status === 403) {
        Alert.alert(
          'Not Approved',
          'You are not yet approved for monetization. Please complete your application first.',
          [{ text: 'Go Back', onPress: () => navigation.goBack() }]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handlePayoutRequest = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) < 10) {
      Alert.alert('Invalid Amount', 'Minimum payout is $10');
      return;
    }

    setSubmittingPayout(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_ROUTE}/monetization/payout/request/`,
        {
          amount: parseFloat(payoutAmount),
          payment_method: payoutMethod,
          payment_details: { method: payoutMethod }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Payout request submitted successfully!');
        setPayoutModalVisible(false);
        setPayoutAmount('');
        fetchDashboard();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to request payout');
    } finally {
      setSubmittingPayout(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
      )}
    </View>
  );

  const renderMetricCard = (title, value, growth, icon) => (
    <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.metricHeader}>
        <Icon name={icon} size={20} color={colors.primary} />
        <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color: colors.text }]}>
        {value?.toLocaleString() || 0}
      </Text>
      {growth !== undefined && (
        <View style={styles.metricGrowth}>
          <Icon 
            name={growth >= 0 ? 'arrow-up' : 'arrow-down'} 
            size={14} 
            color={growth >= 0 ? '#4CAF50' : '#FF3B30'} 
          />
          <Text style={[styles.metricGrowthText, { color: growth >= 0 ? '#4CAF50' : '#FF3B30' }]}>
            {Math.abs(growth)}%
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading Dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color={colors.warning || '#FFA000'} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            No data available
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={fetchDashboard}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { dashboard, weekly_analytics, monthly_analytics, growth, recent_payouts } = dashboardData;

  // Prepare chart data
  const chartLabels = weekly_analytics.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en', { weekday: 'short' });
  });

  const chartData = weekly_analytics.map(item => item.views || 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={[styles.header, { 
        backgroundColor: colors.primary,
        borderBottomColor: colors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monetization</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Channel Info */}
        <View style={[styles.channelCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.channelHeader}>
            <View style={[styles.channelAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.channelAvatarText}>
                {dashboardData.application.channel_name?.charAt(0) || 'C'}
              </Text>
            </View>
            <View style={styles.channelInfo}>
              <Text style={[styles.channelName, { color: colors.text }]}>
                {dashboardData.application.channel_name}
              </Text>
              <Text style={[styles.channelStatus, { color: colors.textSecondary }]}>
                {dashboardData.application.category}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.statusBadgeText}>Approved</Text>
            </View>
          </View>
        </View>

        {/* Revenue Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Revenue"
            value={`$${dashboard.total_revenue || 0}`}
            icon="cash-outline"
            color="#2ECC71"
          />
          <StatCard
            title="Pending Payout"
            value={`$${dashboard.pending_payout || 0}`}
            icon="time-outline"
            color="#F39C12"
          />
          <StatCard
            title="Lifetime Earnings"
            value={`$${dashboard.lifetime_earnings || 0}`}
            icon="trophy-outline"
            color="#9B59B6"
          />
          <StatCard
            title="Followers"
            value={dashboard.followers_count || 0}
            icon="people-outline"
            color="#3498DB"
          />
        </View>

        {/* Content Stats */}
        <View style={styles.contentStats}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Overview</Text>
          <View style={styles.contentGrid}>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="document-text-outline" size={24} color={colors.primary} />
              <Text style={[styles.contentNumber, { color: colors.text }]}>
                {dashboard.total_posts || 0}
              </Text>
              <Text style={[styles.contentLabel, { color: colors.textSecondary }]}>Posts</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="videocam-outline" size={24} color={colors.primary} />
              <Text style={[styles.contentNumber, { color: colors.text }]}>
                {dashboard.total_videos || 0}
              </Text>
              <Text style={[styles.contentLabel, { color: colors.textSecondary }]}>Videos</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="storefront-outline" size={24} color={colors.primary} />
              <Text style={[styles.contentNumber, { color: colors.text }]}>
                {dashboard.total_listings || 0}
              </Text>
              <Text style={[styles.contentLabel, { color: colors.textSecondary }]}>Listings</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="briefcase-outline" size={24} color={colors.primary} />
              <Text style={[styles.contentNumber, { color: colors.text }]}>
                {dashboard.total_services || 0}
              </Text>
              <Text style={[styles.contentLabel, { color: colors.textSecondary }]}>Services</Text>
            </View>
          </View>
        </View>

        {/* Engagement Metrics */}
        <View style={styles.metricsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Engagement</Text>
          <View style={styles.metricsGrid}>
            {[
              { title: 'Likes', value: dashboard.total_likes, growth: growth?.likes, icon: 'heart-outline' },
              { title: 'Comments', value: dashboard.total_comments, growth: growth?.comments, icon: 'chatbubble-outline' },
              { title: 'Shares', value: dashboard.total_shares, growth: growth?.shares, icon: 'share-outline' },
              { title: 'Views', value: dashboard.total_views, growth: growth?.views, icon: 'eye-outline' },
            ].map((metric, index) => (
              <View key={index} style={styles.metricWrapper}>
                {renderMetricCard(metric.title, metric.value, metric.growth, metric.icon)}
              </View>
            ))}
          </View>
        </View>

        {/* Chart Section - Custom Chart */}
        {weekly_analytics.length > 0 && (
          <View style={[styles.chartSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Views</Text>
            <CustomLineChart
              data={chartData}
              labels={chartLabels}
              colors={colors}
              isDark={isDark}
            />
          </View>
        )}

        {/* Payout History */}
        {recent_payouts.length > 0 && (
          <View style={[styles.payoutSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Payouts</Text>
            {recent_payouts.map((payout, index) => (
              <View key={index} style={[styles.payoutItem, { borderBottomColor: colors.border }]}>
                <View>
                  <Text style={[styles.payoutAmount, { color: colors.text }]}>
                    ${payout.amount}
                  </Text>
                  <Text style={[styles.payoutDate, { color: colors.textSecondary }]}>
                    {new Date(payout.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.payoutStatus, { 
                  backgroundColor: payout.status === 'completed' ? '#4CAF50' : 
                                 payout.status === 'pending' ? '#F39C12' : '#FF3B30' 
                }]}>
                  <Text style={styles.payoutStatusText}>
                    {payout.status_display || payout.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => setPayoutModalVisible(true)}
          >
            <Icon name="cash-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Request Payout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => navigation.navigate('MyServicePostsScreen')}
          >
            <Icon name="briefcase-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Manage Services
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payout Modal */}
      <Modal
        visible={payoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPayoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Request Payout</Text>
              <TouchableOpacity onPress={() => setPayoutModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Available Balance: ${dashboard.pending_payout || 0}
            </Text>

            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                color: colors.text 
              }]}
              placeholder="Enter amount (min $10)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={payoutAmount}
              onChangeText={setPayoutAmount}
            />

            <View style={styles.paymentMethods}>
              {['Paystack', 'Stripe', 'Bank Transfer'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentMethod,
                    payoutMethod === method && { borderColor: colors.primary },
                    { 
                      borderColor: payoutMethod === method ? colors.primary : colors.border,
                      backgroundColor: payoutMethod === method ? colors.primary + '10' : colors.backgroundSecondary
                    }
                  ]}
                  onPress={() => setPayoutMethod(method)}
                >
                  <Text style={[styles.paymentMethodText, { 
                    color: payoutMethod === method ? colors.primary : colors.text 
                  }]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitPayoutButton, { backgroundColor: colors.primary }]}
              onPress={handlePayoutRequest}
              disabled={submittingPayout}
            >
              {submittingPayout ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitPayoutText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, marginTop: 10, textAlign: 'center' },
  retryButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  headerRight: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  channelCard: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  channelHeader: { flexDirection: 'row', alignItems: 'center' },
  channelAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  channelAvatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  channelInfo: { flex: 1, marginLeft: 12 },
  channelName: { fontSize: 16, fontWeight: '600' },
  channelStatus: { fontSize: 13 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  statIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statTitle: { fontSize: 13, marginTop: 2 },
  statSubtitle: { fontSize: 11, marginTop: 2 },
  contentStats: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  contentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  contentCard: { width: '48%', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10, borderWidth: 1 },
  contentNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  contentLabel: { fontSize: 13, marginTop: 2 },
  metricsSection: { marginBottom: 16 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricWrapper: { width: '48%', marginBottom: 10 },
  metricCard: { borderRadius: 12, padding: 16, borderWidth: 1 },
  metricHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metricTitle: { fontSize: 13, marginLeft: 8 },
  metricValue: { fontSize: 20, fontWeight: 'bold' },
  metricGrowth: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metricGrowthText: { fontSize: 12, marginLeft: 4 },
  chartSection: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  chartPlaceholder: { height: 200, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  chartPlaceholderText: { fontSize: 14 },
  chartContainer: { borderRadius: 12, overflow: 'hidden' },
  chartWrapper: { padding: 10, flexDirection: 'row' },
  yAxisLabels: { justifyContent: 'space-between', paddingVertical: 30, paddingRight: 8, height: 200 },
  axisLabel: { fontSize: 10, textAlign: 'right' },
  chartArea: { flex: 1, height: 200, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1 },
  areaFill: { borderRadius: 12 },
  linePath: { borderRadius: 12 },
  dot: { 
    position: 'absolute', 
    width: 10, 
    height: 10, 
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  xAxisLabel: { 
    position: 'absolute', 
    fontSize: 10, 
    textAlign: 'center',
    width: 30,
  },
  payoutSection: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  payoutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  payoutAmount: { fontSize: 16, fontWeight: '600' },
  payoutDate: { fontSize: 12, marginTop: 2 },
  payoutStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  payoutStatusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', borderRadius: 16, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalSubtitle: { fontSize: 14, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 16 },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  paymentMethod: { flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  paymentMethodText: { fontSize: 14, fontWeight: '500' },
  submitPayoutButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitPayoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default MonetizationDashboard;