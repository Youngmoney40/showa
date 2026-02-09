import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import colors from '../theme/colors';

const ReportPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;

  const [reason, setReason] = useState('spam');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'abuse', label: 'Abusive or harmful' },
    { value: 'fake', label: 'Fake information' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No access token found');

      const response = await axios.post(`${API_ROUTE}/report-post/`, {
        post: postId,
        reason,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Post reported successfully.');
      navigation.goBack();
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Error', 'Failed to report the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, color:'#000' }}>Report Post</Text>

      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Reason</Text>
      {reportReasons.map(r => (
        <TouchableOpacity
          key={r.value}
          style={{
            padding: 10,
            backgroundColor: reason === r.value ? '#2A1A5E' : '#EEE',
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={() => setReason(r.value)}
        >
   

          <Text style={{ color: reason === r.value ? '#FFF' : '#000' }}>{r.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Message (optional)</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Add any extra details..."
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: '#CCC',
          borderRadius: 8,
          padding: 10,
          textAlignVertical: 'top',
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: colors.primary,
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ReportPostScreen;
