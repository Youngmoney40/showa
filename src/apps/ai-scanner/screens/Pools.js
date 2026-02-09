import React, {useEffect, useState} from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { COLORS, TEXT } from '../../ai-scanner/screens/components/Colors';

const API_BASE_URL = 'http://192.168.1.110:8000/api';
const { width } = Dimensions.get('window');

export default function PollListScreen({ navigation }) {
  const [polls, setPolls] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/polls/`);
      const data = await res.json();
      setPolls(data.results || data);
    } catch (e) {
      console.warn('Failed to fetch polls:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPolls();
  };

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 8000);
    return () => clearInterval(interval);
  }, []);

  const getTrendingStatus = (item) => {
    const total = item.total_votes || 1;
    const homePct = ((item.home_count || 0) / total) * 100;
    const awayPct = ((item.away_count || 0) / total) * 100;
    
    if (total < 10) return { text: 'NEW', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.1)' };
    if (homePct > 70 || awayPct > 70) return { text: 'ONE-SIDED', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
    if (Math.abs(homePct - awayPct) < 10) return { text: 'CLOSE BATTLE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    if (total > 50) return { text: 'TRENDING', color: COLORS.neon, bg: 'rgba(36, 173, 12, 0.1)' };
    
    return { text: 'LIVE', color: COLORS.neon, bg: 'rgba(36, 173, 12, 0.1)' };
  };

  const renderItem = ({item, index}) => (
    <MatchCard 
      item={item} 
      index={index} 
      navigation={navigation}
      status={getTrendingStatus(item)}
    />
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['rgba(36, 173, 12, 0.1)', 'transparent']}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Community Predictions</Text>
        <Text style={styles.headerSubtitle}>
          See what others are betting on • {polls.length} live match{polls.length !== 1 ? 'es' : ''}
        </Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.feature}>
            <Icon name="trending-up" size={20} color={COLORS.neon} />
            <Text style={styles.featureText}>Real-time Votes</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="people" size={20} color={COLORS.neon} />
            <Text style={styles.featureText}>Community Insights</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="qr-code-scanner" size={20} color={COLORS.neon} />
            <Text style={styles.featureText}>Scan to Bet</Text>
          </View>
        </View>
        
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaText}>
            🎯 Join the community • Vote • Scan • Win
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="sports-soccer" size={80} color={COLORS.muted} />
      <Text style={styles.emptyTitle}>No Active Matches</Text>
      <Text style={styles.emptyText}>
        Check back soon for new prediction opportunities
      </Text>
    </View>
  );

  if (loading && polls.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.neon} />
        <Text style={styles.loadingText}>Loading community predictions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={polls} 
        keyExtractor={item => `match-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.neon}
            colors={[COLORS.neon]}
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const MatchCard = React.memo(({ item, index, navigation, status }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const total = item.total_votes || 1;
  const homePct = ((item.home_count || 0) / total) * 100;
  const awayPct = ((item.away_count || 0) / total) * 100;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const getConfidenceLevel = () => {
    const diff = Math.abs(homePct - awayPct);
    if (diff > 30) return 'High Confidence';
    if (diff > 15) return 'Medium Confidence';
    return 'Split Opinion';
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('AiPoolsDetails', { pollId: item.id })}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#1A1A1A', '#151515']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Card Header with Trending Status */}
          <View style={styles.cardHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: status.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.text}
              </Text>
            </View>
            <View style={styles.matchMeta}>
              <Text style={styles.confidenceText}>{getConfidenceLevel()}</Text>
              <Text style={styles.voteCount}>{item.total_votes || 0} predictions</Text>
            </View>
          </View>

          {/* Teams with Visual Vote Distribution */}
          <View style={styles.teamsContainer}>
            <View style={styles.team}>
              <Text style={styles.teamName} numberOfLines={1}>
                {item.home_team}
              </Text>
              <View style={styles.voteBar}>
                <View 
                  style={[
                    styles.voteFill,
                    { 
                      width: `${homePct}%`,
                      backgroundColor: homePct > awayPct ? COLORS.neon : '#374151'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.teamVotes}>{Math.round(homePct)}%</Text>
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.vsSubtext}>Community Vote</Text>
            </View>

            <View style={styles.team}>
              <Text style={styles.teamName} numberOfLines={1}>
                {item.away_team}
              </Text>
              <View style={styles.voteBar}>
                <View 
                  style={[
                    styles.voteFill,
                    { 
                      width: `${awayPct}%`,
                      backgroundColor: awayPct > homePct ? COLORS.neon : '#374151'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.teamVotes}>{Math.round(awayPct)}%</Text>
            </View>
          </View>

          {/* Engagement CTA */}
          <View style={styles.engagementSection}>
            <View style={styles.engagementText}>
              <Icon name="visibility" size={14} color={COLORS.muted} />
              <Text style={styles.engagementCount}>
                See detailed predictions and add to betslip
              </Text>
            </View>
            <View style={styles.ctaArrow}>
              <Text style={styles.ctaArrowText}>TAP TO VIEW</Text>
              <Icon name="arrow-forward" size={16} color={COLORS.neon} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  header: {
    marginBottom: 8,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: TEXT.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  ctaBanner: {
    backgroundColor: 'rgba(36, 173, 12, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.3)',
    width: '100%',
  },
  ctaText: {
    color: COLORS.neon,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: TEXT.white,
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matchMeta: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  voteCount: {
    color: TEXT.white,
    fontSize: 12,
    fontWeight: '700',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    color: TEXT.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  voteBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  voteFill: {
    height: '100%',
    borderRadius: 3,
  },
  teamVotes: {
    color: COLORS.neon,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  vsContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  vsText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 2,
  },
  vsSubtext: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '500',
  },
  engagementSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 173, 12, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(36, 173, 12, 0.1)',
  },
  engagementText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  engagementCount: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  ctaArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaArrowText: {
    color: COLORS.neon,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: TEXT.white,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});