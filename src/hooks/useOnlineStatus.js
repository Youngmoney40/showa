import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

export const useOnlineStatus = () => {
  const heartbeatInterval = useRef(null);
  const appState = useRef(AppState.currentState);

  const updateOnlineStatus = async (isOnline) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found, cannot update status');
        return false;
      }

      const response = await axios.post(
        `${API_ROUTE}/update-online-status/`,
        { is_online: isOnline },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log(`Online status updated to: ${isOnline ? 'Online' : 'Offline'}`);
      return true;
    } catch (error) {
      console.error('Failed to update online status:', error.response?.data || error.message);
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
        }
      );
      console.log('Heartbeat sent');
    } catch (error) {
      console.error('Heartbeat failed:', error.response?.data || error.message);
    }
  };

  const startHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    heartbeatInterval.current = setInterval(sendHeartbeat, 30000); // 30 seconds
    console.log('Heartbeat started');
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
      console.log('Heartbeat stopped');
    }
  };

  useEffect(() => {
    // Initialize online status when hook is used
    const initialize = async () => {
      await updateOnlineStatus(true);
      startHeartbeat();
    };

    initialize();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        console.log('App came to foreground');
        await updateOnlineStatus(true);
        startHeartbeat();
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background
        console.log('App went to background');
        await updateOnlineStatus(false);
        stopHeartbeat();
      }
      appState.current = nextAppState;
    });

    // Cleanup on unmount
    return () => {
      subscription.remove();
      stopHeartbeat();
      updateOnlineStatus(false);
    };
  }, []); // Empty dependency array

  return { updateOnlineStatus, sendHeartbeat };
};