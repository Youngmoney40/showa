import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';

export default function AwayMessageScreen({navigation}) {
  const [enabled, setEnabled] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  

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
        const res = await axios.get(`${API_ROUTE}/messaging-settings/`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setText(res.data);
          console.log('Fetched settings:', res.data);
        }else{
          setText({
            greeting_text: '',
            away_text: '',
            is_away_enabled: false,
            auto_greeting_enabled: true,
          });
        }
        
      } catch (error) {
        //console.error('Error fetching settings:', error);
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
        Alert.alert('Away Message saved successfully!');
        setModalVisible(false);
        navigation.goBack();
      } 
    } catch (error) {
     // console.error('Error saving settings:', error);
      
    }
    
    
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.screen}>
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Away Message</Text>
            <TouchableOpacity onPress={saveSettings}>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Send away messages</Text>
              <Text style={styles.sectionDesc}>
                Automatically reply with a message when you are away
              </Text>
            </View>
            <Switch
              value={text.is_away_enabled}
              onValueChange={val => setText({ ...text, is_away_enabled: val })}
            />
            
          </View>

          {/* Away Message */}
          <View style={styles.messageBox}>
            <Text style={styles.sectionTitle}>Away message</Text>
            <Text style={styles.sectionDesc}>{text.away_text}</Text>
            <TouchableOpacity style={styles.editIcon} onPress={() => {
              setText(text);
              setModalVisible(true);
            }}>
              <Icon name="edit" size={18} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Schedule */}
          {/* <TouchableOpacity style={styles.messageBox}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Text style={styles.sectionDesc}>Always send</Text>
          </TouchableOpacity> */}

          {/* Recipients */}
          {/* <TouchableOpacity style={styles.messageBox}>
            <Text style={styles.sectionTitle}>Recipients</Text>
            <Text style={styles.sectionDesc}>Send to everyone</Text>
          </TouchableOpacity> */}

          {/* Note */}
          <Text style={styles.labelNote}>
            Away messages are only sent when the phone has an active internet connection.
          </Text>

          {/* Modal for editing away message */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Edit Away Message</Text>
                <TextInput
                  multiline
                  style={styles.modalInput}
                  value={text.away_text}
                  onChangeText={text => setText({ ...text, away_text: text })}
                  placeholder="Enter your away message"
                />
                <TouchableOpacity style={styles.modalSave} onPress={saveSettings}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  save: {
    color: '#0d64dd',
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#555',
  },
  messageBox: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: 16,
    padding: 4,
  },
  labelNote: {
    fontSize: 12,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
  modalInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalSave: {
    backgroundColor: '#0d64dd',
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalSaveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalCancel: {
    textAlign: 'center',
    marginTop: 10,
    color: '#f00',
  },
});
