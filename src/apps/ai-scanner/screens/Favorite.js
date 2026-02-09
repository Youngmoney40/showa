

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.110:8000/api';

const FavoriteScreen = ({ navigation, route }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    highConfidence: 0,
    today: 0
  });

  // Primary color
  const PRIMARY_COLOR = '#24ad0cff';
  const PRIMARY_DARK = '#1a8009';

  useEffect(() => {
    if (route.params?.refresh) {
      loadFavorites();
    }
  }, [route.params]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/bets/saved-matches/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.saved_matches || []);
        setStats({
          total: data.total_count || 0,
          highConfidence: data.high_confidence_count || 0,
          today: data.today_matches || 0
        });
      } else {
        throw new Error(data.error || 'Failed to load saved matches');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites(getSampleFavorites());
      setStats({
        total: 3,
        highConfidence: 1,
        today: 2
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const getSampleFavorites = () => [
    {
      id: '1',
      home_team: 'Chelsea',
      away_team: 'Arsenal',
      teams: 'Chelsea vs Arsenal',
      confidence_score: 72,
      risk_level: 'MEDIUM_RISK',
      match_time: 'Today, 17:30',
      last_scanned: '2 hours ago',
      notes: 'Strong home advantage for Chelsea',
      analysis_data: {
        insights: ['Chelsea unbeaten at home', 'Arsenal missing key defender'],
        injury_report: [{ team: 'Arsenal', message: '2 key players injured' }]
      }
    },
    {
      id: '2',
      home_team: 'Manchester City',
      away_team: 'Liverpool',
      teams: 'Man City vs Liverpool',
      confidence_score: 48,
      risk_level: 'HIGH_RISK',
      match_time: 'Today, 20:00',
      last_scanned: '1 day ago',
      notes: 'High risk - both teams inconsistent',
      analysis_data: {
        insights: ['Both teams in poor form', 'High scoring draw likely'],
        injury_report: []
      }
    },
  ];

  const handleRescan = async (item) => {
    Alert.alert(
      'Rescan Match',
      `Rescan ${item.teams} with updated data for ₦50?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rescan - ₦50', 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              const response = await fetch(`${API_BASE_URL}/bets/rescan-match/${item.id}/`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              const data = await response.json();
              
              if (response.ok) {
                Alert.alert('Success', 'Match rescanned successfully!');
                loadFavorites();
              } else {
                throw new Error(data.error || 'Rescan failed');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to rescan match');
            }
          }
        },
      ]
    );
  };

  const handleRemoveFavorite = async (item) => {
    Alert.alert(
      'Remove from Saved',
      `Remove ${item.teams} from your saved matches?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              const response = await fetch(`${API_BASE_URL}/bets/unsave-match/${item.id}/`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              const data = await response.json();
              
              if (response.ok) {
                setFavorites(prev => prev.filter(fav => fav.id !== item.id));
                Alert.alert('Success', 'Match removed from saved matches');
              } else {
                throw new Error(data.error || 'Remove failed');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to remove match');
            }
          }
        },
      ]
    );
  };

  const handleShareMatch = async (item) => {
    try {
      const shareMessage = `🔍 AI Bet Analysis: ${item.teams}

📊 Confidence Score: ${item.confidence_score}%
🎯 Risk Level: ${item.risk_level.replace('_', ' ')}
📝 Notes: ${item.notes || 'Professional analysis provided'}

${item.analysis_data?.insights?.slice(0, 2).map(insight => `• ${insight}`).join('\n')}

Shared via BetScan AI`;

      const result = await Share.share({
        message: shareMessage,
        title: `Bet Analysis: ${item.teams}`,
      });

      if (result.action === Share.sharedAction) {
        // Optional: Track share success
        console.log('Match shared successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share match analysis');
    }
  };

  const handleShareAll = async () => {
    if (favorites.length === 0) return;

    try {
      const topMatches = favorites.slice(0, 3);
      const shareMessage = `🎯 My BetScan AI Portfolio

Top ${Math.min(favorites.length, 3)} Saved Matches:

${topMatches.map((match, index) => 
  `${index + 1}. ${match.teams} - ${match.confidence_score}% confidence`
).join('\n')}

Total Saved: ${favorites.length} matches
High Confidence: ${stats.highConfidence} matches

Download BetScan AI for professional betting analysis!`;

      await Share.share({
        message: shareMessage,
        title: 'My BetScan AI Portfolio',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share portfolio');
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return PRIMARY_COLOR;
    if (confidence >= 50) return '#FFA500';
    return '#FF4444';
  };

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW_RISK': return '💎';
      case 'MEDIUM_RISK': return '⚠️';
      case 'HIGH_RISK': return '🚨';
      default: return '❓';
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.matchInfo}>
          <Text style={styles.teams}>{item.teams}</Text>
          <Text style={styles.matchTime}>{item.match_time}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.riskEmoji}>{getRiskEmoji(item.risk_level)}</Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item)}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confidence Score */}
      <View style={styles.confidenceRow}>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>AI Confidence</Text>
          <Text style={[styles.confidenceValue, { color: getConfidenceColor(item.confidence_score) }]}>
            {item.confidence_score}%
          </Text>
        </View>
        <Text style={styles.lastScanned}>Updated {item.last_scanned}</Text>
      </View>

      {/* Notes */}
      {item.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => handleShareMatch(item)}
        >
          <Icon name="share" size={16} color={PRIMARY_COLOR} />
          <Text style={styles.secondaryButtonText}>Share</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Analysis', { savedMatch: item })}
        >
          <Icon name="visibility" size={16} color={PRIMARY_COLOR} />
          <Text style={styles.secondaryButtonText}>View</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => handleRescan(item)}
        >
          <Icon name="refresh" size={16} color="#000" />
          <Text style={styles.primaryButtonText}>Rescan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading saved matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved Matches</Text>
          <Text style={styles.subtitle}>Professional betting analysis portfolio</Text>
        </View>
        <View style={styles.headerActions}>
         
          {/* <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Analysis')}
          >
            <Icon name="search" size={18} color="#000" />
            <Text style={styles.primaryButtonText}>Scan</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Icon name="star_outline" size={64} color="#666" />
          </View>
          <Text style={styles.emptyTitle}>No Saved Matches</Text>
          <Text style={styles.emptySubtitle}>
            Save professional match analyses to build your portfolio
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ForYou')}
          >
            <Text style={styles.primaryButtonText}>Browse Matches</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: PRIMARY_COLOR }]}>
                {stats.highConfidence}
              </Text>
              <Text style={styles.statLabel}>High Confidence</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {stats.today}
              </Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
          </View>

          {/* Favorites List */}
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[PRIMARY_COLOR]}
                tintColor={PRIMARY_COLOR}
              />
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#24ad0cff',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#24ad0cff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  shareAllButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#24ad0cff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#222',
  },
  listContent: {
    paddingBottom: 20,
  },
  favoriteCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#24ad0cff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchInfo: {
    flex: 1,
  },
  teams: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  matchTime: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
  riskEmoji: {
    fontSize: 16,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  lastScanned: {
    fontSize: 12,
    color: '#666',
  },
  notes: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#24ad0cff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#24ad0cff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FavoriteScreen;