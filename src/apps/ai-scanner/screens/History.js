import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = ({ navigation }) => {
  const analysisHistory = [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      totalGames: 8,
      highRiskGames: 2,
      amount: 50,
      result: 'completed',
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '19:15',
      totalGames: 5,
      highRiskGames: 1,
      amount: 50,
      result: 'completed',
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '11:45',
      totalGames: 12,
      highRiskGames: 4,
      amount: 50,
      result: 'completed',
    },
  ];

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View>
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString('en-NG', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>₦{item.amount}</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Icon name="sports-soccer" size={16} color="#39FF14" />
          <Text style={styles.statText}>{item.totalGames} games</Text>
        </View>
        <View style={styles.stat}>
          <Icon name="warning" size={16} color="#FFFF33" />
          <Text style={styles.statText}>{item.highRiskGames} risky</Text>
        </View>
        <View style={styles.statusBadge}>
          <Icon name="check-circle" size={14} color="#39FF14" />
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Analysis</Text>
        <Icon name="chevron-right" size={16} color="#39FF14" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>Your previous bet slip analyses</Text>
      </View>

      {analysisHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="history" size={80} color="#333333" />
          <Text style={styles.emptyTitle}>No Analysis History</Text>
          <Text style={styles.emptySubtitle}>
            You haven't analyzed any bet slips yet
          </Text>
          <TouchableOpacity 
            style={styles.analyzeButton}
            onPress={() => navigation.navigate('Analysis')}
          >
            <Text style={styles.analyzeButtonText}>Analyze First Bet Slip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Stats Summary */}
          <View style={styles.statsSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{analysisHistory.length}</Text>
              <Text style={styles.summaryLabel}>Total Analyses</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {analysisHistory.reduce((sum, item) => sum + item.amount, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Spent</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {analysisHistory.reduce((sum, item) => sum + item.highRiskGames, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Risky Games Found</Text>
            </View>
          </View>

          {/* History List */}
          <FlatList
            data={analysisHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFF33',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  analyzeButton: {
    backgroundColor: '#39FF14',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  analyzeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsSummary: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#333333',
  },
  listContent: {
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222222',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  amountBadge: {
    backgroundColor: '#39FF14',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amountText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;