

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';

const ReportPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const scrollViewRef = useRef(null);

  const [reason, setReason] = useState('spam');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, theme, isDark } = useTheme(); 
  
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

  // Scroll to bottom when message input is focused
  const handleMessageFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={{ padding: 20, paddingBottom: 40 }}>
              <Text style={{ 
                fontSize: 25, 
                fontWeight: 'bold', 
                marginBottom: 15, 
                marginTop: Platform.OS === 'ios' ? 0 : 20, 
                color: colors.text 
              }}>
                Report Post
              </Text>
              
              <Text style={{ fontWeight: '600', marginBottom: 8, color: colors.text }}>
                Reason
              </Text>
              
              {reportReasons.map(r => (
                <TouchableOpacity
                  key={r.value}
                  style={{
                    padding: 14,
                    backgroundColor: reason === r.value ? colors.primary : colors.surface,
                    borderRadius: 8,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: reason === r.value ? colors.primary : colors.border,
                  }}
                  onPress={() => setReason(r.value)}
                >
                  <Text style={{ 
                    color: reason === r.value ? '#FFF' : colors.text,
                    fontWeight: reason === r.value ? '600' : '400'
                  }}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={{ fontWeight: '600', marginBottom: 8, marginTop: 10, color: colors.text }}>
                Message (optional)
              </Text>
              
              <TextInput
                value={message}
                onChangeText={setMessage}
                onFocus={handleMessageFocus}
                placeholder="Add any extra details..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 120,
                  backgroundColor: colors.surface,
                  color: colors.text,
                  fontSize: 15,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: colors.primary || '#0d64dd',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: Platform.OS === 'ios' ? 20 : 10,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
                    Submit Report
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReportPostScreen;
