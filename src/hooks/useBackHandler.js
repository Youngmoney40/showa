import { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export const useBackHandler = (navigation, fallbackScreen = 'PHome') => {
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        
        // If cannot go back, navigate to fallback screen instead of closing
        navigation.navigate(fallbackScreen);
        return true;
      };

      // Handle hardware back button (Android)
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      // Handle swipe back gesture (Android 13+)
      const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
        // If there's no previous screen, prevent removal and navigate to fallback
        if (!navigation.canGoBack()) {
          e.preventDefault();
          navigation.navigate(fallbackScreen);
        }
      });

      return () => {
        backHandler.remove();
        beforeRemoveListener();
      };
    }, [navigation, fallbackScreen])
  );
};