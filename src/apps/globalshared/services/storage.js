// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage utilities using AsyncStorage
export const storage = {
  // Set item in storage
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage error:', error);
    }
  },

  // Get item from storage
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage error:', error);
      return null;
    }
  },

  // Remove item from storage
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage error:', error);
    }
  },

  // Clear all storage
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('AsyncStorage error:', error);
    }
  },

  // Get user data
  async getUser() {
    try {
      const user = await this.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  },

  // Get access token
  async getAccessToken() {
    return await this.getItem('access_token');
  },

  // Get refresh token
  async getRefreshToken() {
    return await this.getItem('refresh_token');
  },

  // Set user data
  async setUser(user) {
    await this.setItem('user', JSON.stringify(user));
  },

  // Set tokens
  async setTokens(access, refresh) {
    await this.setItem('access_token', access);
    await this.setItem('refresh_token', refresh);
  },

  // Clear authentication data
  async clearAuth() {
    await this.removeItem('access_token');
    await this.removeItem('refresh_token');
    await this.removeItem('user');
  },

  // Check if user is logged in
  async isLoggedIn() {
    const token = await this.getAccessToken();
    return !!token;
  },

  // Get multiple items
  async multiGet(keys) {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.warn('AsyncStorage multiGet error:', error);
      return null;
    }
  },

  // Set multiple items
  async multiSet(keyValuePairs) {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.warn('AsyncStorage multiSet error:', error);
    }
  },
};