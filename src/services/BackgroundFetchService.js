import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

// Cache configuration
const POSTS_CACHE_KEY = 'posts_cache';
const ALL_POSTS_CACHE_KEY = 'all_posts_cache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

class BackgroundFetchService {
  constructor() {
    this.isFetching = false;
    this.lastFetchTime = 0;
    this.FETCH_INTERVAL = 2 * 60 * 1000; // 2 minutes
  }

  // Initialize background fetching
  init() {
    console.log('🔄 Background fetch service initialized');
    
    // Start periodic fetching
    this.startPeriodicFetch();
    
    // Fetch immediately on app start
    this.fetchAllData();
  }

  // Start periodic background fetching
  startPeriodicFetch() {
    // Fetch every 2 minutes when app is active
    this.intervalId = setInterval(() => {
      this.fetchAllData();
    }, this.FETCH_INTERVAL);

    // Also fetch when app comes to foreground
    this.setupAppStateListener();
  }

  setupAppStateListener() {
    // This would typically use AppState from react-native
    // For now, we'll rely on the interval
    console.log('📱 App state listener setup');
  }

  // Stop background fetching
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    console.log('🛑 Background fetch service stopped');
  }

  // Fetch all necessary data in background
  async fetchAllData() {
    if (this.isFetching) return;
    
    const now = Date.now();
    if (now - this.lastFetchTime < 30000) { 
      return;
    }

    this.isFetching = true;
    console.log('🔄 Background fetch started');

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
       // console.log(' No token available for background fetch');
        return;
      }

      // Fetch all data in parallel
      await Promise.allSettled([
        this.fetchPosts(token),
        this.fetchAllPosts(token),
        this.fetchLiveStreams(token),
        this.fetchStatus(token),
        this.fetchSuggestedFriends(token),
      ]);

      this.lastFetchTime = Date.now();
     // console.log('✅ Background fetch completed');

    } catch (error) {
      //console.error(' Background fetch error:', error);
    } finally {
      this.isFetching = false;
    }
  }

  // Fetch posts
  async fetchPosts(token) {
    try {
      const response = await axios.get(`${API_ROUTE}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          POSTS_CACHE_KEY,
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
       // console.log('✅ Posts cached in background');
      }
    } catch (error) {
      //console.error(' Background posts fetch failed:', error.message);
    }
  }

  // Fetch all posts
  async fetchAllPosts(token) {
    try {
      const response = await axios.get(`${API_ROUTE}/get-all-post/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          ALL_POSTS_CACHE_KEY,
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
        console.log('✅ All posts cached in background');
      }
    } catch (error) {
      //console.error('❌ Background all posts fetch failed:', error.message);
    }
  }

  // Fetch live streams
  async fetchLiveStreams(token) {
    try {
      const response = await axios.get(`${API_ROUTE}/live-streams/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'live_streams_cache',
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
        console.log('✅ Live streams cached in background');
      }
    } catch (error) {
      //console.error('❌ Background live streams fetch failed:', error.message);
    }
  }

  // Fetch status
  async fetchStatus(token) {
    try {
      const response = await axios.get(`${API_ROUTE}/status/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'status_cache',
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
       
      }
    } catch (error) {
     // console.error('❌ Background status fetch failed:', error.message);
    }
  }

  // Fetch suggested friends
  async fetchSuggestedFriends(token) {
    try {
      const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem(
          'suggested_friends_cache',
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
        console.log('✅ Suggested friends cached in background');
      }
    } catch (error) {
      //console.error('❌ Background suggested friends fetch failed:', error.message);
    }
  }

  // Force immediate fetch (can be called from components)
  async forceFetch() {
    console.log('🚀 Force fetching data...');
    await this.fetchAllData();
  }

  // Check if cache is fresh
  async isCacheFresh(cacheKey) {
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (!cachedData) return false;

      const { timestamp } = JSON.parse(cachedData);
      return Date.now() - timestamp < CACHE_EXPIRATION_TIME;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const backgroundFetchService = new BackgroundFetchService();

export default backgroundFetchService;