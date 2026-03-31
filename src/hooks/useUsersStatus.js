
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';

export const useUsersStatus = (userIds) => {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchStatuses = async () => {
    if (!userIds || userIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

    
      const promises = userIds.map(userId =>
        axios.get(`${API_ROUTE}/user-status/${userId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => ({ error: true, userId }))
      );

      const results = await Promise.all(promises);
      
      const newStatuses = {};
      results.forEach((result, index) => {
        if (!result.error && result.data) {
          newStatuses[userIds[index]] = result.data;
        }
      });
      
      setStatuses(newStatuses);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();

    // Poll every 30 seconds
    intervalRef.current = setInterval(fetchStatuses, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userIds.join(',')]);

  const getUserStatus = (userId) => {
    return statuses[userId] || null;
  };

  const isUserOnline = (userId) => {
    return statuses[userId]?.is_online || false;
  };

  const getLastSeen = (userId) => {
    return statuses[userId]?.last_seen_display || 'Offline';
  };

  return {
    statuses,
    loading,
    getUserStatus,
    isUserOnline,
    getLastSeen,
    refreshStatuses: fetchStatuses
  };
};