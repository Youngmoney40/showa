
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../../services/NotificationService';

export const setupTokenRefresh = () => {
  messaging().onTokenRefresh(async token => {
    console.log('Token refreshed:', token);
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      await NotificationService.registerTokenWithBackend(token, userToken);
    }
  });
};