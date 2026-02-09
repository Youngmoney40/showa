import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';

export default function AddQuickReplyScreen({ navigation }) {
  const [shortcut, setShortcut] = useState('');
  const [message, setMessage] = useState('');

  const saveReply = async () => {
  if (!shortcut || !message) {
    alert('Please fill in both fields');
    return;
  }

  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    alert('You must be logged in to save a quick reply');
    return;
  }

  try {
    const response = await axios.post(
      `${API_ROUTE}/quick-replies/`,
      { title: shortcut, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

        if (response.status === 201) {
      Alert.alert('Success', 'Quick reply saved successfully!');
      
      setShortcut('');
      setMessage('');

      setTimeout(() => {
        navigation.goBack();
      }, 800); 
    }

  } catch (error) {
    //console.error('Error saving quick reply:', error);
    alert('Failed to save quick reply. Please try again.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add quick reply</Text>

      <Text style={styles.label}>Shortcut</Text>
      <TextInput
        style={styles.input}
        placeholder="A word that will quickly retrieve this reply"
        value={shortcut}
        onChangeText={setShortcut}
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter text or select media"
        multiline
        placeholderTextColor='#555'
        numberOfLines={5}
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveReply}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
    fontFamily: 'SourceSansPro-Bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 14,
    color:'#555'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
