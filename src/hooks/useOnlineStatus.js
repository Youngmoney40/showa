import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

export const useOnlineStatus = (userId) => {
  const heartbeatInterval = useRef(null);
  const appState = useRef(AppState.currentState);
  const [isOnline, setIsOnline] = useState(false);
  const isMounted = useRef(true);
  const retryTimeout = useRef(null);
  const isUnmounting = useRef(false);

  const updateOnlineStatus = async (online) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found, cannot update status');
        return false;
      }

      // Don't update if unmounting and going offline - use background API call
      if (isUnmounting.current && !online) {
        // Use a separate API call that doesn't depend on component lifecycle
        try {
          await axios.post(
            `${API_ROUTE}/update-online-status/`,
            { is_online: false },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              timeout: 3000,
            }
          );
          console.log('✅ Offline status updated on unmount');
        } catch (e) {
          // Silent fail - backend will handle via timeout
        }
        setIsOnline(false);
        return true;
      }

      setIsOnline(online);
      
      const response = await axios.post(
        `${API_ROUTE}/update-online-status/`,
        { is_online: online },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      console.log(`✅ Online status updated to: ${online ? 'Online' : 'Offline'}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update online status:', error.response?.data || error.message);
      
      if (isMounted.current && !isUnmounting.current) {
        if (retryTimeout.current) clearTimeout(retryTimeout.current);
        retryTimeout.current = setTimeout(() => {
          if (isMounted.current && !isUnmounting.current) {
            updateOnlineStatus(online);
          }
        }, 2000);
      }
      
      return false;
    }
  };

  const sendHeartbeat = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      await axios.post(
        `${API_ROUTE}/heartbeat/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 3000,
        }
      );
    } catch (error) {
      // Silent fail for heartbeat
    }
  };

  const startHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    heartbeatInterval.current = setInterval(sendHeartbeat, 15000);
    console.log('💓 Heartbeat started');
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
      console.log('🛑 Heartbeat stopped');
    }
  };

  useEffect(() => {
    if (!userId) {
      stopHeartbeat();
      return;
    }

    isMounted.current = true;
    isUnmounting.current = false;

    const initialize = async () => {
      console.log('🔄 Initializing online status for user:', userId);
      await updateOnlineStatus(true);
      startHeartbeat();
    };

    initialize();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      const prevState = appState.current;
      
      if (prevState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('📱 App came to foreground - Updating to online');
        await updateOnlineStatus(true);
        startHeartbeat();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('📱 App went to background - Updating to offline');
        await updateOnlineStatus(false);
        stopHeartbeat();
      }
      
      appState.current = nextAppState;
    });

    return () => {
      isMounted.current = false;
      isUnmounting.current = true;
      subscription.remove();
      stopHeartbeat();
      
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
      
      // Try to update to offline on unmountggg
      updateOnlineStatus(false);
    };
  }, [userId]);

  const forceUpdateStatus = async (online) => {
    return await updateOnlineStatus(online);
  };

  return { 
    updateOnlineStatus, 
    sendHeartbeat, 
    forceUpdateStatus,
    isOnline 
  };
};

export default useOnlineStatus;