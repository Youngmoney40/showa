
import React, { createContext, useState, useContext, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../../api_routing/api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async (page = 1) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return;

      const response = await fetch(
        `${API_ROUTE}/notifications/?page=${page}&page_size=20`,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      
      const data = await response.json();
      if (response.ok) {
        if (page === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications(prev => [...prev, ...data.notifications]);
        }
        setUnreadCount(data.unread_count);
        return data;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${API_ROUTE}/notifications/mark-read/${notificationId}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      
      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${API_ROUTE}/notifications/mark-all-read/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${API_ROUTE}/notifications/delete/${notificationId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      
      if (response.ok) {
        const deletedNotif = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (deletedNotif && !deletedNotif.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const initializeNotifications = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        await NotificationService.initialize(userToken);
        await fetchNotifications();
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const logout = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    await NotificationService.logout(userToken);
    setNotifications([]);
    setUnreadCount(0);
    setIsInitialized(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isInitialized,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        initializeNotifications,
        logout,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};