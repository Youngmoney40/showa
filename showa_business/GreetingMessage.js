import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import { useTheme } from '../src/context/ThemeContext'; // Import ThemeContext

export default function GreetingMessageScreen({ navigation }) {
  const { colors, isDark } = useTheme(); // Get theme colors
  const [showExample, setShowExample] = useState(false);
  const [text, setText] = useState({
    greeting_text: '',
    away_text: '',
    is_away_enabled: false,
    auto_greeting_enabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const res = await axios.get(`${API_ROUTE}/messaging-settings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setText(res.data);
        } else {
          setText({
            greeting_text: '',
            away_text: '',
            is_away_enabled: false,
            auto_greeting_enabled: true,
          });
        }
      } catch (error) {
        setText({
          greeting_text: '',
          away_text: '',
          is_away_enabled: false,
          auto_greeting_enabled: true,
        });
      }
    }
  };

  const saveSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return Alert.alert('You must be logged in to save settings.');
      }
      const res = await axios.post(`${API_ROUTE}/messaging-settings/`, text, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        Alert.alert('Greeting Message saved successfully!');
        navigation.goBack();
      } 
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Greeting Message</Text>
          <TouchableOpacity onPress={saveSettings}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.label, { color: colors.text }]}>Message</Text>

          <TextInput
            multiline
            value={text.greeting_text}
            placeholderTextColor={colors.textSecondary}
            onChangeText={text => setText({ ...text, greeting_text: text })}
            placeholder="Enter your message..."
            style={[styles.textArea, { 
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.card 
            }]}
            maxLength={200}
          />
          
          <View style={styles.row}>
            <TouchableOpacity>
              <Icon name="emoji-emotions" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {text.greeting_text.length}/200
            </Text>
          </View>

          <View style={styles.toggleRow}>
            <Text style={{ color: colors.text }}>Enable Greeting</Text>
            <Switch
              value={text.auto_greeting_enabled}
              onValueChange={val => setText({ ...text, auto_greeting_enabled: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? colors.text : text.auto_greeting_enabled ? colors.primary : colors.textSecondary}
              ios_backgroundColor={colors.border}
            />
          </View>

          <TouchableOpacity 
            style={styles.exampleButton} 
            onPress={() => setShowExample(true)}
          >
            <Text style={[styles.exampleText, { color: colors.primary }]}>See example</Text>
          </TouchableOpacity>
          
          {showExample && (
            <Modal
              transparent={true}
              visible={showExample}
              onRequestClose={() => setShowExample(false)}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Greeting Message Example</Text>
                  <View style={[styles.chatBubble, { 
                    backgroundColor: isDark ? '#2d5a27' : '#dcf8c6' 
                  }]}>
                    <Text style={[styles.chatText, { 
                      color: isDark ? '#e0f2d2' : '#222' 
                    }]}>{text.greeting_text || 'Hello! How can I help you today?'}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setShowExample(false)} 
                    style={[styles.closeModalBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  header: {
    backgroundColor: '#0d64dd',
    paddingTop: Platform.OS === 'ios' ? 25 : 35,
    paddingBottom: 25,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
   
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
   
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    
  },
  exampleButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  exampleText: {
    fontSize: 14,
   
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
  },
  modalContent: {
    // backgroundColor handled inline
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    
  },
  chatBubble: {
    padding: 12,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeModalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});