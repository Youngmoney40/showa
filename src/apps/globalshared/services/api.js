// import API_BASE_URL from '../../apiroute/api_config';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../globalshared/services/storage';

const API_BASE_URL = 'http://192.168.1.114:8000/api'






export const authAPI = {
   
  //============================== Create account ===========================================
  async register(userData) {
    
    try {
      console.log('Sending registration data:', userData);
      
      const response = await fetch(`http://192.168.1.105:8000/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        // validation errors from backend =========================
        if (data.username) {
          throw new Error(Array.isArray(data.username) ? data.username[0] : data.username);
        }
        if (data.email) {
          throw new Error(Array.isArray(data.email) ? data.email[0] : data.email);
        }
        if (data.password) {
          throw new Error(Array.isArray(data.password) ? data.password[0] : data.password);
        }
        if (data.non_field_errors) {
          throw new Error(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
        }
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Registration failed. Please try againgg.');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection and backend server.');
      }
      throw error;
    }
  },

  //============================== Login =========================================================
  async login(email, password) {
    
    try {
      
      console.log('Attempting login for password:', password);
      
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (!response.ok) {
        if (data.email) {
          throw new Error(Array.isArray(data.email) ? data.email[0] : data.email);
        }
        if (data.password) {
          throw new Error(Array.isArray(data.password) ? data.password[0] : data.password);
        }
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Login failed. Please check your credentials.');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection and backend server.');
      }
      throw error;
    }
  },

  // Get current user profile
  async getProfile(token) {
    try {
      const response = await fetch(`http://192.168.1.105:8000/api/profiles/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Refresh token===================================
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  async setupEdateProfile(formData) {

      console.log('userData from api', formData);

     try {
    console.log('userData from api', formData);

    const user = await storage.getUser();
    console.log('Retrieved user:', user);

    if (!user || !user.id) {
      console.warn('No user found in storage!');
      return;
    }
    formData.append('user', String(user.id));

    const token = await AsyncStorage.getItem('access_token');
    console.log('Token retrieved from storage:', token);

    const response = await axios.post(`${API_BASE_URL}/profile/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading profile:', error.response?.data || error.message);
    throw error;
  }


  },
  ///=================EVENT CREATION =========================
  async createEvent(formData) {

      console.log('userData from api', formData);

     try {
           const token = await storage.getAccessToken();
           const response = await axios.post(
             'http://192.168.1.105:8000/api/events/',
             formData,
             {
               headers: {
                 'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${token}`,
               },
             }
           );
     
           return response.data;
         } catch (error) {
           console.error('Error:', error.response?.data || error.message);
           Alert.alert('Error', 'Something went wrong while creating the event.');
         } 


  },
  ///=================EVENT CREATION =========================
  async createCompanionProfile(formData) {

      console.log('userData from api', formData);

     try {
           
           const response = await axios.post('http://192.168.1.105:8000/api/companion/profiles/',
             formData,
             {
               headers: {
                 'Accept': 'application/json',
               },
             }
           );
     
           return response.data;
         } catch (error) {
           //console.error('Error:', error.response?.data || error.message);
           //Alert.alert('Error', 'Something went wrong while creating the event.');
         } 


  }
  
};