import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

const BiometricUnlock = ({ navigation }) => {
  const [loading, setLoading] = useState(true);



  const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_ROUTE}/profiles/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (response.status === 200) {
          return response.data;
        }
        return null;
      } catch (err) {
        //console.error('fetchProfile error:', err);
        return null;
      }
    };
  
    const switchAccount = async () => {
      try {
        const profile = await fetchProfile();
        if (profile?.name?.trim()) {
          navigation.navigate('BusinessHome');
        } else {
          navigation.navigate('ProceedOptions');
        }
      } catch (error) {
        navigation.navigate('Signin');
      }
    };

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
    if (biometricEnabled === 'true') {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();

      if (available) {
        const result = await rnBiometrics.simplePrompt({
          promptMessage: 'Unlock with Face ID / Fingerprint',
        });

        if (result.success) {
          //console.log('Biometric unlock successful');
          const token = await AsyncStorage.getItem('userToken');
          if (token) {
            await switchAccount();
            //navigation.replace('ProceedOptions'); 
          } else {
            navigation.replace('Signin');
          }
        } else {
          Alert.alert('Cancelled', 'Biometric authentication was cancelled.');
          setLoading(false);
        }
      } else {
        Alert.alert('Unavailable', 'Biometric authentication is not available on this device.');
        setLoading(false);
      }
    } else {
      navigation.replace('Signin');
    }
  };

  const handleFallback = () => {
    navigation.replace('Signin');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#0d64dd" />
          <Text style={styles.loadingText}>Authenticating...</Text>
        </>
      ) : (
        <>
          <Icon name="lock-closed-outline" size={60} color="#0d64dd" />
          <Text style={styles.infoText}>Biometric login was cancelled or failed.</Text>
          <TouchableOpacity onPress={handleFallback} style={styles.button}>
            <Text style={styles.buttonText}>Login Manually</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0d64dd',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BiometricUnlock;
