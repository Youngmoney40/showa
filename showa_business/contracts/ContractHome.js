import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';
import colors from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API configuration
const API = axios.create({
  baseURL: `${API_ROUTE}`,
});

API.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
const fetchContracts = async (params = {}) => {
  try {
    const response = await API.get('/contracts/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

const fetchMyContracts = async () => {
  try {
    const response = await API.get('/contracts/my-contracts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching my contracts:', error);
    throw error;
  }
};

// Contract Card Component
const ContractCard = ({ contract, onPress }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#28a745';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getContractTypeIcon = (type) => {
    switch(type) {
      case 'employment': return 'work';
      case 'service': return 'build';
      case 'rental': return 'home';
      case 'sales': return 'shopping-cart';
      case 'partnership': return 'handshake';
      default: return 'description';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon 
              name={getContractTypeIcon(contract.contract_type)} 
              size={24} 
              color={colors.primary} 
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle} numberOfLines={1}>{contract.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(contract.status) }]}>
            <Text style={styles.statusText}>{contract.status.replace('_', ' ')}</Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>{contract.description}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Icon name="person" size={16} color="#6c757d" />
            <Text style={styles.footerText}>{contract.created_by.username}</Text>
          </View>
          
          <View style={styles.footerItem}>
            <Icon name="calendar-today" size={16} color="#6c757d" />
            <Text style={styles.footerText}>
              {new Date(contract.start_date).toLocaleDateString()}
            </Text>
          </View>
          
          {contract.budget && (
            <View style={styles.footerItem}>
              <Icon name="attach-money" size={16} color="#28a745" />
              <Text style={[styles.footerText, { color: '#28a745', fontWeight: 'bold' }]}>
                ${contract.budget}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContracts = async () => {
    try {
      const data = await fetchContracts({ ordering: '-created_at', limit: 5 });
      setContracts(data.results || data);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadContracts();
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Latest Contracts</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('ContractsList')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Icon name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : contracts.length === 0 ? (
          <View style={styles.emptyContainer}>
            {/* <Image 
              source={require('../assets/images/empty-contracts.png')} 
              style={styles.emptyImage}
            /> */}
            <Text style={styles.emptyText}>No contracts available</Text>
          </View>
        ) : (
          contracts.map(contract => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onPress={() => navigation.navigate('ContractDetail', { contractId: contract.id })}
            />
          ))
        )}
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ContractForm')}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="add" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Post Contract</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('MyContracts')}
          >
            <LinearGradient
              colors={['#6c757d', '#495057']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="assignment" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>My Contracts</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    width: '48%',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Card Styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardDescription: {
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  footerText: {
    marginLeft: 4,
    color: '#6c757d',
    fontSize: 14,
  },
});

export default HomeScreen;