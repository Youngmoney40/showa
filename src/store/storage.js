// import { MMKV } from 'react-native-mmkv';

// export const storage = new MMKV();


// export const saveDataToStorage = (key, data) => {
//   try {
//     const jsonValue = JSON.stringify(data);
//     storage.set(key, jsonValue);
//     return true;
//   } catch (error) {
//     console.error('Error saving data to storage:', error);
//     return false;
//   }
// };

// export const getDataFromStorage = (key) => {
//   try {
//     const jsonValue = storage.getString(key);
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (error) {
//     console.error('Error getting data from storage:', error);
//     return null;
//   }
// };

// export const removeDataFromStorage = (key) => {
//   try {
//     storage.delete(key);
//     return true;
//   } catch (error) {
//     console.error('Error removing data from storage:', error);
//     return false;
//   }
// };

// // Keys for our data
// export const STORAGE_KEYS = {
//   STATUS_DATA: '@status_data',
//   CHANNELS_DATA: '@channels_data',
//   FOLLOWING_CHANNELS: '@following_channels',
//   USER_DATA: '@user_data',
//   USER_TOKEN: '@user_token'
// };