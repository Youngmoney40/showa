
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EarnFloatingButton from '../components/EarningFloatingButton';
import { useTheme } from '../src/context/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler';

// Cache for immediate display
let callHistoryCache = [];
let isCacheLoaded = false;

const CallsScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme(); 
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
      refreshCallHistoryInBackground();
    }
    appState.current = nextAppState;
  };

  const initializeCallHistory = async () => {
    try {
    
      if (isCacheLoaded && callHistoryCache.length > 0) {
        setCallHistory(callHistoryCache);
        setLoading(false);
      }

      
      await loadCallHistory();
      
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
          
          
          callHistoryCache = sortedHistory;
          isCacheLoaded = true;
          
          
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
      return { icon: 'call-missed', color: colors.error };
    } else if (status === 'ended' || status === 'connected') {
      return { 
        icon: direction === 'incoming' ? 'call-received' : 'call-made', 
        color: colors.success 
      };
    }
    return { icon: 'call', color: colors.success };
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
                  backgroundColor: colors.success,
                });
              } catch (error) {
                console.error('[CallsScreen] Error deleting call:', error);
                Snackbar.show({
                  text: "Error deleting call",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.error,
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
                backgroundColor: colors.success,
              });
            } catch (error) {
              console.error('[CallsScreen] Error deleting all calls:', error);
              Snackbar.show({
                text: "Error deleting calls",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: colors.error,
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
        style={[styles.callItem, { borderBottomColor: colors.border }]} 
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
          <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
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
            <Text style={[styles.duration, { color: colors.textTertiary }]}>
              Duration: {formatDuration(item.duration)}
            </Text>
          )}
          {item.status !== 'ended' && (
            <Text style={[styles.callStatus, { color: statusIcon.color }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          )}
          <View style={styles.callMeta}>
            <Text style={[styles.time, { color: colors.textTertiary }]}>{formatCallTime(item.timestamp)}</Text>
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
          <Icon name="call" size={24} color={colors.primary} />
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
          <Icon name="videocam" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteCallHistoryItem(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="delete-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  const showSnackbar = (type) => {
    setCallType(type);
    Snackbar.show({
      text: `Please select a user from home page to initiate ${type} call`,
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'SELECT',
        textColor: colors.primary,
        onPress: async () => {
          await navigation.goBack();
        },
      },
      backgroundColor: colors.warning,
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: '#fff'}]}>Calls</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading call history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

       <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>Calls</Text>
          {callHistory.length > 0 && (
            <TouchableOpacity onPress={deleteAllCallHistory}>
              <Text style={[styles.clearAllText, { color: '#fff',  }]}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.tabRow}>
          {['Chats', 'Status', 'Calls'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                if (item === 'Status') {
                  navigation.goBack();
                } else if (item === 'Calls') {
                  navigation.navigate('BCalls');
                } else if (item === 'Chats') {
                  navigation.goBack();
                } else {
                  setTab(item);
                }
              }}>
              <Text style={[
                styles.tabText, 
                { color: tab === item ? '#fff': 'rgba(255,255,255,0.8)' },
                tab === item && styles.tabTextActive
              ]}>
                {item}
              </Text>
              {tab === item && <View style={[styles.tabUnderline, { backgroundColor: '#fff'}]} />}
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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Icon name="call" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No call history</Text>
              <Text style={[styles.emptySubText, { color: colors.textTertiary }]}>Your calls will appear here</Text>
            </View>
          )
        }
      />

      {/* Call Options Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={[styles.modalBackground, { backgroundColor: colors.overlay }]}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalContainer, 
                  { 
                    backgroundColor: colors.surface,
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim 
                  }
                ]}
              >
                <Text style={[styles.modalTitle, { color: colors.text }]}>Start a call</Text>
                <TouchableOpacity 
                  style={[styles.callOption, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    closeModal();
                    navigation.navigate('VoiceCalls', { isInitiator: true });
                  }}
                >
                  <Icon name="call" size={28} color={colors.primary} />
                  <Text style={[styles.callText, { color: colors.primary }]}>Voice Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.callOption, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    closeModal();
                    navigation.navigate('VideoCalls', { isInitiator: true });
                  }}
                >
                  <Icon name="videocam" size={28} color={colors.primary} />
                  <Text style={[styles.callText, { color: colors.primary }]}>Video Call</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Floating Action Button for starting calls */}
      {/* {!modalVisible && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={openModal}>
          <Icon name="add-call" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      )} */}

      <EarnFloatingButton navigation={navigation} />
    </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 header: {
   paddingBottom: Platform.OS === 'android' ? 16 : 0,
   paddingTop: Platform.OS === 'android' ? 14 : 0,
   borderBottomLeftRadius: Platform.OS === 'android' ? 20 : 0,
   borderBottomRightRadius: Platform.OS === 'android' ? 20 : 0,
   backgroundColor: '#0d64dd',
   elevation: 6,
   zIndex: 1000,
 },
 
   headerTop: {
    paddingTop: Platform.OS === 'android'? 60: 70,
     paddingHorizontal: Platform.OS === 'android'? 20: 20,
     paddingVertical:Platform.OS === 'android'? 0 : 25,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    paddingVertical: 6,
  },
  tabTextActive: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
  },
  tabUnderline: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
  callList: {
    paddingBottom: 80,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
  callStatus: {
    fontSize: 12,
  },
  callMeta: {
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 12,
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
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  callOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
    borderBottomWidth: 1,
  },
  callText: {
    marginLeft: 16,
    fontSize: 18,
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
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CallsScreen;