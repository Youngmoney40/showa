// src/services/Edate_api.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.edate.ng/api';

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// ============================================
// MAIN API FUNCTION WITH AUTH OPTIONgff
// ============================================

const api = async (endpoint, options = {}, requiresAuth = true) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Only add Authorization header if:
    // 1. requiresAuth is true
    // 2. We have a token
    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    console.log(`📡 Auth required: ${requiresAuth}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📡 Response Status: ${response.status}`);

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      if (requiresAuth) {
        // Only clear token if this was an authenticated request
        await AsyncStorage.removeItem('userToken');
        throw new Error('SESSION_EXPIRED');
      }
      // If it's a public endpoint with 401, just return the error
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || data.detail || 'Something went wrong');
    }
    
    return data;

  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
};

// ============================================
// PUBLIC API - NO AUTH REQUIRED
// ============================================

export const discoverProfiles = async (params = {}) => {
  try {
    const {
      category = 'all',
      limit = 50,
      offset = 0,
      gender = 'all',
      minAge = 18,
      maxAge = 99,
    } = params;

    const queryParams = new URLSearchParams({
      category,
      limit: limit.toString(),
      offset: offset.toString(),
      gender,
      min_age: minAge.toString(),
      max_age: maxAge.toString(),
    });

    // Add optional role filter for sugar profiles
    if (params.role && params.role !== 'all') {
      queryParams.append('role', params.role);
    }

    const endpoint = `/discover/global/?${queryParams.toString()}`;
    console.log(`🔍 Discovering profiles: ${endpoint}`);
    
    // 🔥 IMPORTANT: Pass requiresAuth = false
    const result = await api(endpoint, {}, false);
    
    return {
      success: true,
      category: result.category || category,
      total_count: result.total_count || 0,
      count: result.count || 0,
      results: result.results || [],
      pagination: result.pagination || {
        offset: offset,
        limit: limit,
        has_more: false
      }
    };
    
  } catch (error) {
    console.error('❌ Discover API error:', error);
    return {
      success: false,
      error: error.message,
      results: [],
      total_count: 0,
      count: 0,
      pagination: { has_more: false }
    };
  }
};

export const getProfileDetail = async (userId, type = 'sugar') => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const endpoint = `/profile/global/detail/?user_id=${userId}&type=${type}`;
    console.log(`👤 Fetching profile detail: ${endpoint}`);
    
    // 🔥 IMPORTANT: Pass requiresAuth = false
    const result = await api(endpoint, {}, false);
    
    return {
      success: true,
      profile: result.profile || result,
    };
    
  } catch (error) {
    console.error('❌ Profile detail error:', error);
    return {
      success: false,
      error: error.message,
      profile: null
    };
  }
};

// ============================================
// AUTHENTICATION APIS - AUTH REQUIRED
// ============================================

export const login = async (email, password) => {
  try {
    const result = await api('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false); // Login doesn't require token
    
    if (result.access) {
      await AsyncStorage.setItem('userToken', result.access);
      if (result.refresh) {
        await AsyncStorage.setItem('refreshToken', result.refresh);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const result = await api('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false); // Register doesn't require token
    return result;
  } catch (error) {
    console.error('❌ Register error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('❌ Logout error:', error);
  }
};

// ============================================
// SUGAR PROFILE APIS - AUTH REQUIRED
// ============================================

export const getSugarProfile = async () => {
  return api('/sugar/profile/my-profile/', {}, true);
};

export const updateSugarProfile = async (data) => {
  return api('/sugar/profile/my-profile/', {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
};

export const checkSugarProfile = async () => {
  return api('/sugar/check-profile/', {}, true);
};

// ============================================
// E-DATE PROFILE APIS - AUTH REQUIRED
// ============================================

export const getMyEdateProfile = async () => {
  return api('/edate/profile/my-profile/', {}, true);
};

export const getEdateProfileById = async (userId) => {
  return api(`/edate/profile/${userId}/`, {}, true);
};

// ============================================
// NEARBY DISCOVERY - AUTH REQUIRED (uses location)
// ============================================

export const discoverNearby = async (params = {}) => {
  try {
    const {
      category = 'all',
      maxDistance = 50,
      limit = 50,
    } = params;

    const queryParams = new URLSearchParams({
      category,
      max_distance: maxDistance.toString(),
      limit: limit.toString(),
    });

    // Nearby requires auth for location data
    return api(`/discover/nearby/?${queryParams}`, {}, true);
  } catch (error) {
    console.error('❌ Nearby discovery error:', error);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
};

// ============================================
// TEST HELPER
// ============================================

export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    // Test with a public endpoint
    const result = await discoverProfiles({ limit: 1 });
    console.log('✅ API connection successful!');
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Auth
  login,
  register,
  logout,
  
  // Discovery (Public)
  discoverProfiles,
  getProfileDetail,
  discoverNearby,
  
  // Sugar (Auth)
  getSugarProfile,
  updateSugarProfile,
  checkSugarProfile,
  
  // E-Date (Auth)
  getMyEdateProfile,
  getEdateProfileById,
  
  // Utility
  testApiConnection,
};