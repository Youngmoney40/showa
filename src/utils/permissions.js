import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  
  const version = Platform.Version;
  
  try {
    // Android 13+ (including 15)
    if (version >= 33) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];
      
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
      
      if (!allGranted) {
        Alert.alert(
          'Permission Needed',
          'Storage access required to download files',
          [
            { text: 'Cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }
      return true;
    }
    
    // Android 11-12
    if (version >= 30) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    
    // Android 10 and below
    return true;
    
  } catch (err) {
    console.error('Permission error:', err);
    return false;
  }
};