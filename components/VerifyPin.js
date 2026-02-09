import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';

const VerifyPinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');

  const handleVerifyPin = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`${API_ROUTE}/verify-pin/`, { pin }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.replace('Home');
    } catch (error) {
      Alert.alert("Incorrect PIN", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your PIN</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={6}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Verify" onPress={handleVerifyPin} />
    </View>
  );
};

export default VerifyPinScreen;

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
  },
});
