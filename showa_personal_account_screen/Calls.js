

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
  Alert,
  AppState
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache for immediate display
let callHistoryCache = [];
let isCacheLoaded = false;

const CallsScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Calls');
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [callType, setCallType] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);

  // Load from cache immediately, then update from AsyncStorage
  useEffect(() => {
    initializeCallHistory();
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground, refresh data
      refreshCallHistoryInBackground();
    }
    appState.current = nextAppState;
  };

  const initializeCallHistory = async () => {
    try {
      // First, display cached data immediately if available
      if (isCacheLoaded && callHistoryCache.length > 0) {
        setCallHistory(callHistoryCache);
        setLoading(false);
      }

      // Then load fresh data from AsyncStorage
      await loadCallHistory();
      
      // Also set up a background refresh
      refreshCallHistoryInBackground();
    } catch (error) {
      console.error('[CallsScreen] Error initializing call history:', error);
      setLoading(false);
    }
  };

  const refreshCallHistoryInBackground = async () => {
    try {
      const history = await AsyncStorage.getItem('callHistory');
      if (history) {
        const parsedHistory = JSON.parse(history);
        if (Array.isArray(parsedHistory)) {
          const sortedHistory = parsedHistory
            .filter(call => call && call.timestamp && call.contact)
            .sort((a, b) => b.timestamp - a.timestamp);
          
          // Update cache
          callHistoryCache = sortedHistory;
          isCacheLoaded = true;
          
          // Update state if different
          setCallHistory(prevHistory => {
            if (JSON.stringify(prevHistory) !== JSON.stringify(sortedHistory)) {
              return sortedHistory;
            }
            return prevHistory;
          });
        }
      }
    } catch (error) {
      console.error('[CallsScreen] Background refresh error:', error);
    }
  };

  const loadCallHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('callHistory');
      console.log('[CallsScreen] Raw call history from AsyncStorage:', history);
      
      if (history) {
        const parsedHistory = JSON.parse(history);
        console.log('[CallsScreen] Parsed call history:', parsedHistory);
        
        if (Array.isArray(parsedHistory)) {
          const sortedHistory = parsedHistory
            .filter(call => call && call.timestamp && call.contact)
            .sort((a, b) => b.timestamp - a.timestamp);
          
          // Update cache
          callHistoryCache = sortedHistory;
          isCacheLoaded = true;
          
          setCallHistory(sortedHistory);
          console.log('[CallsScreen] Sorted call history:', sortedHistory);
        } else {
          console.error('[CallsScreen] Parsed history is not an array:', parsedHistory);
          setCallHistory([]);
        }
      } else {
        console.log('[CallsScreen] No call history found in AsyncStorage');
        setCallHistory([]);
      }
    } catch (error) {
      console.error('[CallsScreen] Error loading call history:', error);
      setCallHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCallHistory();
    setRefreshing(false);
  };

  const formatCallTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCallDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusIcon = (status, direction) => {
    if (status === 'missed' || status === 'rejected') {
      return { icon: 'call-missed', color: '#e53e3e' };
    } else if (status === 'ended' || status === 'connected') {
      return { 
        icon: direction === 'incoming' ? 'call-received' : 'call-made', 
        color: '#4CAF50' 
      };
    }
    return { icon: 'call', color: '#4CAF50' };
  };

  const groupCallsByDate = () => {
    const grouped = {};
    callHistory.forEach(call => {
      if (!call || !call.timestamp || !call.contact) {
        console.warn('[CallsScreen] Invalid call entry:', call);
        return;
      }
      const date = formatCallDate(call.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(call);
    });
    console.log('[CallsScreen] Grouped calls:', grouped);
    return grouped;
  };

  const deleteCallHistoryItem = async (callId) => {
    try {
      Alert.alert(
        "Delete Call",
        "Are you sure you want to delete this call from history?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const updatedHistory = callHistory.filter(call => call.id !== callId);
                
                // Update AsyncStorage
                await AsyncStorage.setItem('callHistory', JSON.stringify(updatedHistory));
                
                // Update cache immediately
                callHistoryCache = updatedHistory;
                
                // Update state
                setCallHistory(updatedHistory);
                
                Snackbar.show({
                  text: "Call deleted successfully",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: '#4CAF50',
                });
              } catch (error) {
                console.error('[CallsScreen] Error deleting call:', error);
                Snackbar.show({
                  text: "Error deleting call",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: '#e53e3e',
                });
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('[CallsScreen] Error in delete confirmation:', error);
    }
  };

  const deleteAllCallHistory = async () => {
    if (callHistory.length === 0) return;
    
    Alert.alert(
      "Delete All Calls",
      "Are you sure you want to delete all call history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.removeItem('callHistory');
              
              // Clear cache
              callHistoryCache = [];
              isCacheLoaded = true;
              
              // Update state
              setCallHistory([]);
              
              Snackbar.show({
                text: "All calls deleted successfully",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#4CAF50',
              });
            } catch (error) {
              console.error('[CallsScreen] Error deleting all calls:', error);
              Snackbar.show({
                text: "Error deleting calls",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#e53e3e',
              });
            }
          }
        }
      ]
    );
  };

  const renderCallItem = ({ item }) => {
    if (!item || !item.contact || !item.status || !item.direction) {
      console.warn('[CallsScreen] Invalid call item:', item);
      return null;
    }

    const receiverId = item.contact?.id || '';
    const statusIcon = getCallStatusIcon(item.status, item.direction);
    const profileImage = item.contact?.profileImage || '';
    const displayName = item.contact?.name || 'Unknown Caller';
    
    return (
      <TouchableOpacity 
        style={styles.callItem} 
        activeOpacity={0.7}
        onLongPress={() => deleteCallHistoryItem(item.id)}
        delayLongPress={500}
      >
        <Image 
          source={profileImage 
            ? { uri: profileImage } 
            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
          } 
          style={styles.avatar}
        /> 
        <View style={styles.callInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.callDetails}>
            <Icon
              name={statusIcon.icon}
              size={16}
              color={statusIcon.color}
              style={styles.statusIcon}
            />
            <Text style={[styles.callType, { color: statusIcon.color }]}>
              {item.direction === 'incoming' ? 'Incoming' : 'Outgoing'} • 
              {item.isVideoCall ? ' Video' : ' Audio'}
            </Text>
          </View>
          {item.status === 'ended' && item.duration > 0 && (
            <Text style={styles.duration}>
              Duration: {formatDuration(item.duration)}
            </Text>
          )}
          {item.status !== 'ended' && (
            <Text style={[styles.callStatus, { color: statusIcon.color }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          )}
          <View style={styles.callMeta}>
            <Text style={styles.time}>{formatCallTime(item.timestamp)}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('VoiceCalls', {
              targetUserId: receiverId,
              name: displayName,
              profile_image: profileImage,
              roomId: 'unique-room-id',
              isInitiator: true
            })
          }
          style={[styles.callButton, { marginRight: 10 }]}
        >
          <Icon name="call" size={24} color="#0d64dd" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('VideoCalls', {
              targetUserId: receiverId,
              name: displayName,
              profile_image: profileImage,
              roomId: 'unique-room-id',
              isInitiator: true
            })
          }
          style={styles.callButton}
        >
          <Icon name="videocam" size={24} color="#0d64dd" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteCallHistoryItem(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="delete-outline" size={20} color="#e53e3e" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const showSnackbar = (type) => {
    setCallType(type);
    Snackbar.show({
      text: `Please select a user from home page to initiate ${type} call`,
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'SELECT',
        textColor: '#0d64dd',
        onPress: async () => {
          await navigation.goBack();
        },
      },
      backgroundColor: '#db9d02ff',
    });
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const groupedCalls = groupCallsByDate();
  const sections = Object.keys(groupedCalls).map(date => ({
    title: date,
    data: groupedCalls[date]
  }));

  if (loading && callHistory.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Calls</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text>Loading call history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Calls</Text>
          {callHistory.length > 0 && (
            <TouchableOpacity onPress={deleteAllCallHistory}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.tabRow}>
          {['Chats', 'Status', 'Calls'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                if (item === 'Status') {
                  navigation.navigate('StatusBar');
                } else if (item === 'Calls') {
                  navigation.navigate('Calls');
                } else if (item === 'Chats') {
                  navigation.goBack();
                } else {
                  setTab(item);
                }
              }}>
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>
                {item}
              </Text>
              {tab === item && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderCallItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.callList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Icon name="call" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No call history</Text>
              <Text style={styles.emptySubText}>Your calls will appear here</Text>
            </View>
          )
        }
      />

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  clearAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  tabText: {
    color: '#e6e6e6',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 4,
  },
  callList: {
    paddingBottom: 80,
  },
  sectionHeader: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  callType: {
    fontSize: 14,
  },
  duration: {
    fontSize: 12,
    color: '#888',
  },
  callStatus: {
    fontSize: 12,
  },
  callMeta: {
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  callButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d64dd',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  callOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  callText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#0d64dd',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CallsScreen;