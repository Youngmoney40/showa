import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

const CatalogComponent = forwardRef(({ 
  userId: propUserId, 
  businessId: propBusinessId,
  onCatalogPress,
  onBusinessPress,
  horizontal = true,
  showHeader = false,
  showBusinessInfo = true,
  maxItems,
  containerStyle,
  onDataLoaded,
  navigation 
}, ref) => {
  const { colors, isDark } = useTheme();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    refreshCatalogs: () => handleRefresh(),
    getCatalogs: () => catalogs,
    getBusinessInfo: () => businessInfo
  }));

  useEffect(() => {
    fetchData();
  }, [propUserId, propBusinessId]);

  const fetchData = async () => {
    await Promise.all([
      fetchCatalogs(),
      propBusinessId && fetchBusinessInfo()
    ]);
  };

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const targetUserId = propUserId || (await AsyncStorage.getItem('userId'));
      
      const response = await axios.get(`${API_ROUTE}/user/${targetUserId}/catalogs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 && response.data.success) {
        let catalogData = response.data.data;
        
        if (maxItems && maxItems > 0) {
          catalogData = catalogData.slice(0, maxItems);
        }
        
        setCatalogs(catalogData);
        console.log('fetch catalog successful',response.data)
        
        if (onDataLoaded) {
          onDataLoaded({
            catalogs: catalogData,
            businessInfo: businessInfo
          });
        }
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBusinessInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/${propBusinessId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setBusinessInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCatalogs();
  };
const handleCatalogPress = (catalog) => {
  if (onCatalogPress) {
    onCatalogPress(catalog);
  } else if (navigation) {
    navigation.navigate('OtherUserCatalogDetail', { 
      product: catalog,  
      catalogItem: catalog, 
      businessId: propBusinessId,
      userId: propUserId
    });
  }
};

  const handleBusinessPress = () => {
    if (onBusinessPress) {
      onBusinessPress(businessInfo);
    } else if (navigation && businessInfo) {
      navigation.navigate('BusinessProfile', { userId: businessInfo.user });
    }
  };

  const renderCatalogItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.catalogCard,
        horizontal ? styles.horizontalCard : styles.verticalCard,
        { backgroundColor: colors.card }
      ]}
      
      onPress={()=>{handleCatalogPress(item)}}

    >
      <Image 
        source={`${item.image}` ? { uri: `${API_ROUTE_IMAGE}${item.image_url}` } : require('../assets/images/dad.jpg')}
        style={horizontal ? styles.horizontalImage : styles.verticalImage}
      />
      <View style={styles.catalogInfo}>
        <Text style={[styles.catalogName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={[styles.catalogDescription, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.description}
          </Text>
        )}
        <View style={styles.catalogFooter}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ₦{parseFloat(item.price || 0).toLocaleString()}
          </Text>
          {item.sale_price > 0 && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleText}>SALE</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBusinessHeader = () => {
    if (!showBusinessInfo || !businessInfo) return null;

    return (
      <TouchableOpacity 
        style={[styles.businessHeader, { backgroundColor: colors.card }]}
        onPress={handleBusinessPress}
      >
        <Image 
          source={businessInfo.image ? { uri: `${API_ROUTE_IMAGE}${businessInfo.image}` } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
          style={styles.businessAvatar}
        />
        <View style={styles.businessInfo}>
          <Text style={[styles.businessName, { color: colors.text }]}>{businessInfo.name}</Text>
          <Text style={[styles.businessDescription, { color: colors.textSecondary }]} numberOfLines={1}>
            {businessInfo.description || 'Business Catalog'}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (horizontal) {
    return (
      <View style={[styles.container, containerStyle]}>
        {showHeader && renderBusinessHeader()}
        
        {catalogs.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {catalogs.map((item) => (
              <View key={item.id.toString()}>
                {renderCatalogItem({ item })}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyHorizontalContainer}>
            <Icon name="folder-open" size={30} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No catalogs
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Vertical list layout
  return (
    <View style={[styles.container, containerStyle]}>
      {showHeader && renderBusinessHeader()}
      
      <FlatList
        data={catalogs}
        renderItem={renderCatalogItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="folder-open" size={60} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No catalogs found
            </Text>
          </View>
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  businessAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  businessDescription: {
    fontSize: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
  },
  listContent: {
    padding: 16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  // Horizontal card styles
  horizontalCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  // Vertical card styles
  verticalCard: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  verticalImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
  },
  catalogInfo: {
    flex: 1,
    padding: 8,
  },
  catalogName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  catalogDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  catalogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  saleBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  saleText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyHorizontalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: width - 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default CatalogComponent;