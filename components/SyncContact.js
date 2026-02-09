// import Contacts from 'react-native-contacts';
// import { PermissionsAndroid, Platform } from 'react-native';
// import axios from 'axios';
// import { API_ROUTE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createHash } from 'react-native-quick-crypto';

// const normalizePhoneNumber = (phoneNumber) => {
//   if (!phoneNumber) return '';
  
//   // Remove all non-digit characters
//   let normalized = phoneNumber.replace(/[^0-9]/g, '');
  
//   // Remove international prefix if present
//   if (normalized.startsWith('0')) {
//     normalized = normalized.substring(1);
//   }
  
//   // Take last 10 digits (standard US number length)
//   return normalized.slice(-10);
// };

// const computePhoneHash = (phoneNumber) => {
//   const normalized = normalizePhoneNumber(phoneNumber);
//   return createHash('sha256').update(normalized).digest('hex');
// };

// export const requestContactsPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//         {
//           title: 'Contacts Permission',
//           message: 'We need access to your contacts to find friends.',
//           buttonPositive: 'OK',
//           buttonNegative: 'Cancel',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (error) {
//       console.error('Permission request error:', error);
//       return false;
//     }
//   }
//   return true;
// };

// export const syncContacts = async (authToken, onProgress = () => {}) => {
//   try {
//     if (!authToken) {
//       return { success: false, error: 'Not authenticated' };
//     }

//     const hasPermission = await requestContactsPermission();
//     if (!hasPermission) {
//       return { success: false, error: 'Contacts permission denied' };
//     }

//     const contacts = await Contacts.getAll();
    
//     const formattedContacts = contacts
//       .filter(contact => contact.phoneNumbers?.length > 0)
//       .map(contact => ({
//         name: contact.displayName || '',
//         phone_number: contact.phoneNumbers[0].number,
//         phone_hash: computePhoneHash(contact.phoneNumbers[0].number),
//       }))
//       .filter(contact => contact.phone_hash);

//     // Calculate progress for contact processing
//     const totalContacts = formattedContacts.length;
//     let processedContacts = 0;

//     // Simulate progress for contact processing
//     onProgress(0.1); // Initial progress for getting contacts

//     // Batch contacts to reduce API calls
//     const batchSize = 100;
//     const batches = [];
//     for (let i = 0; i < formattedContacts.length; i += batchSize) {
//       batches.push(formattedContacts.slice(i, i + batchSize));
//     }

//     let syncedContactsCount = 0;

//     for (let i = 0; i < batches.length; i++) {
//       const batch = batches[i];
//       const response = await axios.post(
//         `${API_ROUTE}/contacts/sync/`,
//         { 
//           hashes: batch.map(c => c.phone_hash),
//           contacts: batch.map(c => ({
//             name: c.name,
//             phone_number: c.phone_number
//           }))
//         },
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );

//       processedContacts += batch.length;
//       syncedContactsCount += response.data.synced_contacts || 0;
      
//       // Update progress (0 to 1)
//       onProgress(0.1 + (0.9 * processedContacts / totalContacts));
//     }

//     return { 
//       success: true,
//       syncedContacts: syncedContactsCount,
//       totalContacts: formattedContacts.length,
//     };
//   } catch (error) {
//     console.error('Sync contacts error:', error);
    
//     let errorMessage = 'Failed to sync contacts';
//     if (error.response) {
//       errorMessage = error.response.data.message || 
//                     `Server error: ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'No response from server';
//     }
    
//     return { 
//       success: false, 
//       error: errorMessage,
//       code: error.response?.status,
//     };
//   }
// };
// contacts.js

import Contacts from 'react-native-contacts';
import { PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
//import NetInfo from '@react-native-community/netinfo';


const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  let normalized = phoneNumber.replace(/[^0-9]/g, '');
  
  // Remove international prefix if present
  if (normalized.startsWith('0')) {
    normalized = normalized.substring(1);
  }
  
  // Take last 10 digits (standard US number length)
  return normalized.slice(-10);
};

const computePhoneHash = (phoneNumber) => {
  const normalized = normalizePhoneNumber(phoneNumber);
  return CryptoJS.SHA256(normalized).toString(CryptoJS.enc.Hex);
};

// Retry logic helper
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
    }
  }
};

// Network checking

// Network checking (NetInfo DISABLED)
const checkNetworkConnection = async () => {
  // NetInfo removed/commented out
  // Always assume device is online
  return true;
};

// const checkNetworkConnection = async () => {
//   try {
//     const state = await NetInfo.fetch();
//     return state.isConnected && state.isInternetReachable;
//   } catch (error) {
//     console.error('Error checking network:', error);
//     return false;
//   }
// };

// Request contacts permission
export const requestContactsPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'We need access to your contacts to find friends.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }
  return true;
};

// Main sync contacts function
export const syncContacts = async (authToken, onProgress = () => {}) => {
  try {
    // Check network before starting
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      return { 
        success: false, 
        error: 'No internet connection. Please check your network and try again.',
        code: 'NO_INTERNET' 
      };
    }

    if (!authToken) {
      return { success: false, error: 'Not authenticated. Please log in again.' };
    }

    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      return { 
        success: false, 
        error: 'Contacts permission denied. Please enable contacts access in settings.',
        code: 'PERMISSION_DENIED' 
      };
    }

    console.log('📱 Fetching contacts...');
    
    // Get all contacts
    const contacts = await Contacts.getAll();
    console.log(`📱 Found ${contacts.length} total contacts`);
    
    // Process and filter contacts
    const formattedContacts = contacts
      .filter(contact => {
        // Check if contact has phone numbers
        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
          return false;
        }
        
        // Get first valid phone number
        const phoneNumber = contact.phoneNumbers[0]?.number;
        if (!phoneNumber || phoneNumber.trim() === '') {
          return false;
        }
        
        // Check if we can compute a valid hash
        const hash = computePhoneHash(phoneNumber);
        return hash && hash.length === 64; // SHA-256 hash is 64 characters
      })
      .map(contact => {
        const phoneNumber = contact.phoneNumbers[0].number;
        return {
          name: contact.displayName || contact.givenName || contact.familyName || '',
          phone_number: phoneNumber,
          phone_hash: computePhoneHash(phoneNumber),
        };
      });

    console.log(`📱 ${formattedContacts.length} valid contacts after filtering`);

    if (formattedContacts.length === 0) {
      return { 
        success: true, 
        syncedContacts: 0, 
        totalContacts: 0,
        message: 'No valid contacts found with phone numbers.' 
      };
    }

    // Calculate progress for contact processing
    const totalContacts = formattedContacts.length;
    let processedContacts = 0;

    // Initial progress
    onProgress(0.05);

    // Batch contacts to reduce API calls - smaller batches for reliability
    const batchSize = 25; 
    const batches = [];
    for (let i = 0; i < formattedContacts.length; i += batchSize) {
      batches.push(formattedContacts.slice(i, i + batchSize));
    }

    console.log(`📱 Creating ${batches.length} batches of ${batchSize} contacts each`);

    let syncedContactsCount = 0;
    let failedBatches = [];

    // Process batches sequentially with delays
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;
      const totalBatches = batches.length;
      
      // Check network before each batch
      const isStillConnected = await checkNetworkConnection();
      if (!isStillConnected) {
        return { 
          success: false, 
          error: 'Lost internet connection during sync. Please reconnect and try again.',
          code: 'CONNECTION_LOST',
          syncedContacts: syncedContactsCount,
          totalProcessed: processedContacts,
          totalContacts: totalContacts
        };
      }
      
      // Add progressive delay between batches (starts at 300ms, increases with each batch)
      if (i > 0) {
        const delay = Math.min(300 * i, 2000); // Cap at 2 seconds
        console.log(`⏳ Waiting ${delay}ms before batch ${batchNumber}/${totalBatches}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      try {
        console.log(`🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} contacts)...`);
        
        // Create the request function for retry logic
        const makeRequest = () => axios.post(
          `${API_ROUTE}/contacts/sync/`,
          { 
            hashes: batch.map(c => c.phone_hash),
            contacts: batch.map(c => ({
              name: c.name,
              phone_number: c.phone_number
            }))
          },
          { 
            headers: { 
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Showa-App/1.0'
            },
            timeout: 60000, // 60 second timeout for slow networks
            validateStatus: (status) => status < 500 
          }
        );
        
        // Execute with retry logic
        const response = await retryRequest(makeRequest, 2, 1000); // 2 retries
        
        processedContacts += batch.length;
        syncedContactsCount += response.data.synced_contacts || 0;
        
        // Calculate and update progress
        const progress = 0.05 + (0.95 * processedContacts / totalContacts);
        onProgress(Math.min(progress, 0.99));
        
        console.log(`✅ Batch ${batchNumber}/${totalBatches} synced successfully. Total synced: ${syncedContactsCount}`);
        
      } catch (batchError) {
        failedBatches.push({
          batchIndex: i,
          batchNumber: batchNumber,
          error: batchError.message || 'Unknown error',
          errorCode: batchError.code,
          contactsCount: batch.length
        });
        
        console.error(`❌ Batch ${batchNumber} failed:`, {
          message: batchError.message,
          code: batchError.code,
          response: batchError.response?.status
        });
        
        // Don't stop on individual batch failure, continue with next batch
        console.log(`⏭️  Skipping batch ${batchNumber} and continuing...`);
      }
    }

    // Final progress
    onProgress(1.0);
    
    console.log(`🎉 Sync completed: ${syncedContactsCount}/${totalContacts} contacts synced`);
    
    if (failedBatches.length > 0) {
      console.warn(`⚠️ ${failedBatches.length} batches failed out of ${batches.length}`);
    }

    return { 
      success: true,
      syncedContacts: syncedContactsCount,
      totalContacts: totalContacts,
      failedBatches: failedBatches.length,
      failedBatchesDetails: failedBatches,
      message: `Synced ${syncedContactsCount} of ${totalContacts} contacts successfully${failedBatches.length > 0 ? ` (${failedBatches.length} batches failed)` : ''}`
    };
    
  } catch (error) {
    console.error('❌ Sync contacts error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    let errorMessage = 'Failed to sync contacts. Please try again.';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || 
                    `Server error: ${error.response.status}`;
      errorCode = `HTTP_${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response
      errorMessage = 'No response from server. Please check your internet connection.';
      errorCode = 'NO_RESPONSE';
    } else if (error.message) {
      // Other errors
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
        errorCode = 'NETWORK_ERROR';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
        errorCode = 'TIMEOUT';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Contacts permission required. Please enable contacts access.';
        errorCode = 'PERMISSION_ERROR';
      }
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: errorCode,
      details: error.message
    };
  }
};

// Alternative: Fetch API version (sometimes more reliable than axios)
export const syncContactsWithFetch = async (authToken, onProgress = () => {}) => {
  try {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      return { 
        success: false, 
        error: 'No internet connection',
        code: 'NO_INTERNET' 
      };
    }

    if (!authToken) {
      return { success: false, error: 'Not authenticated' };
    }

    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      return { success: false, error: 'Contacts permission denied' };
    }

    const contacts = await Contacts.getAll();
    
    const formattedContacts = contacts
      .filter(contact => contact.phoneNumbers?.length > 0)
      .map(contact => ({
        name: contact.displayName || '',
        phone_number: contact.phoneNumbers[0].number,
        phone_hash: computePhoneHash(contact.phoneNumbers[0].number),
      }))
      .filter(contact => contact.phone_hash);

    if (formattedContacts.length === 0) {
      return { 
        success: true, 
        syncedContacts: 0, 
        totalContacts: 0,
        message: 'No valid contacts found' 
      };
    }

    onProgress(0.1);

    const batchSize = 20;
    const batches = [];
    for (let i = 0; i < formattedContacts.length; i += batchSize) {
      batches.push(formattedContacts.slice(i, i + batchSize));
    }

    let syncedContactsCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Check network
      const isStillConnected = await checkNetworkConnection();
      if (!isStillConnected) {
        return { 
          success: false, 
          error: 'Lost connection',
          code: 'CONNECTION_LOST',
          syncedContacts: syncedContactsCount
        };
      }
      
      // Add delay
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        
        const response = await fetch(`${API_ROUTE}/contacts/sync/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hashes: batch.map(c => c.phone_hash),
            contacts: batch.map(c => ({
              name: c.name,
              phone_number: c.phone_number
            }))
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          syncedContactsCount += data.synced_contacts || 0;
          
          const progress = 0.1 + (0.9 * (i + 1) / batches.length);
          onProgress(progress);
        }
        
      } catch (error) {
        console.error(`Batch ${i} fetch error:`, error.message);
        // Continue with next batch
      }
    }

    onProgress(1.0);
    
    return { 
      success: true,
      syncedContacts: syncedContactsCount,
      totalContacts: formattedContacts.length,
    };
    
  } catch (error) {
    console.error('Fetch sync error:', error);
    
    return { 
      success: false, 
      error: error.message || 'Unknown error',
      code: 'FETCH_ERROR',
    };
  }
};

// Utility functions
export const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized.length >= 7 && normalized.length <= 15;
};

export const getUniqueContacts = async () => {
  try {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      return [];
    }

    const contacts = await Contacts.getAll();
    
    const uniqueMap = new Map();
    
    contacts
      .filter(contact => contact.phoneNumbers?.length > 0)
      .forEach(contact => {
        const phoneNumber = contact.phoneNumbers[0].number;
        const hash = computePhoneHash(phoneNumber);
        
        if (!uniqueMap.has(hash)) {
          uniqueMap.set(hash, {
            name: contact.displayName || '',
            phone_number: phoneNumber,
            phone_hash: hash,
          });
        }
      });
    
    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error('Error getting unique contacts:', error);
    return [];
  }
};

// Test function to verify contacts access
export const testContactsAccess = async () => {
  try {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      return { success: false, error: 'No permission' };
    }
    
    const contacts = await Contacts.getAll();
    const sample = contacts.slice(0, 5).map(c => ({
      name: c.displayName,
      phones: c.phoneNumbers?.map(p => p.number) || []
    }));
    
    return {
      success: true,
      totalContacts: contacts.length,
      sample,
      canComputeHash: contacts[0]?.phoneNumbers?.[0]?.number ? 
        computePhoneHash(contacts[0].phoneNumbers[0].number).length === 64 : false
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get contact count only (for UI display)
export const getContactCount = async () => {
  try {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      return 0;
    }
    
    const contacts = await Contacts.getAll();
    const validContacts = contacts.filter(c => 
      c.phoneNumbers?.length > 0 && 
      c.phoneNumbers[0].number && 
      c.phoneNumbers[0].number.trim() !== ''
    );
    
    return validContacts.length;
  } catch (error) {
    console.error('Error getting contact count:', error);
    return 0;
  }
};