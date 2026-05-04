import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app_version_checked';
const apiUrl = 'https://api.showapp.ng/api/showa/check-app-version/'; 

// Hardcode your current app version here - update manually on each release
const CURRENT_APP_VERSION = '1.0.3';
const CURRENT_APP_VERSION_CODE = 1000003; // e.g., 1.0.0 = 1000000, 1.0.1 = 1000001

const useAppUpdate = (autoCheckOnMount = true) => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const hasShownModalRef = useRef(false);

  const getPlatform = () => {
    return Platform.select({
      ios: 'ios',
      android: 'android',
    });
  };

  // No DeviceInfo - just return hardcoded values
  const getCurrentVersion = async () => {
    return {
      version: CURRENT_APP_VERSION,
      versionCode: CURRENT_APP_VERSION_CODE,
    };
  };

  const checkForUpdate = async (showModalIfAvailable = true) => {
    setIsLoading(true);
    try {
      const { version, versionCode } = await getCurrentVersion();
      const platform = getPlatform();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          current_version: version,
          current_version_code: versionCode,
        }),
      });

      const data = await response.json();

      if (data.update_available) {
        const updateData = {
          ...data,
          current_version: version,
          current_version_code: versionCode,
        };
        
        setUpdateInfo(updateData);

        // Force update - must show modal
        if (data.force_update) {
          setShowModal(true);
          hasShownModalRef.current = true;
        } 
        // Recommended or optional - check if user dismissed recently
        else if (showModalIfAvailable) {
          const lastDismissed = await AsyncStorage.getItem(STORAGE_KEY);
          const shouldShow = !lastDismissed || 
            (Date.now() - parseInt(lastDismissed, 10) > 24 * 60 * 60 * 1000); // Once per day
            
          if (shouldShow) {
            setShowModal(true);
            hasShownModalRef.current = true;
          }
        }
      } else {
        setUpdateInfo(null);
      }

      setLastCheckTime(new Date());
      return data;
    } catch (error) {
      console.error('Error checking for update:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const dismissModal = async () => {
    setShowModal(false);
    if (updateInfo && !updateInfo.force_update) {
      await AsyncStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  };

  useEffect(() => {
    if (autoCheckOnMount) {
      checkForUpdate();
    }
  }, [autoCheckOnMount]);

  return {
    updateInfo,
    isLoading,
    showModal,
    checkForUpdate,
    dismissModal,
    lastCheckTime,
  };
};

export default useAppUpdate;