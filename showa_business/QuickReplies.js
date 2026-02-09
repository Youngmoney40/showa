import {React,useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function QuickRepliesScreen({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(()=> {
    const fetchQuickReplies = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to view quick replies');
        return;
      }

      try {
        const response = await axios.get(`${API_ROUTE}/quick-replies/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Quick replies fetched:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching quick replies:', error);
        alert('Failed to fetch quick replies. Please try again.');
      }
    };

    fetchQuickReplies();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick replies</Text>

      <View style={styles.replyBox}>
        <View style={styles.replyRow}>
          <Text style={styles.replyTitle}>Thanks</Text>
          <Icon name="edit" size={20} color="#007AFF" />
        </View>
        {data.map((reply, index) => (
          <Text key={index} style={styles.replyText}>
            {reply.message}
          </Text>
        ))}
        <View>
          

        </View>
        
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('AddQuickReply')}>
        <Text style={styles.addNew}>+ Add new reply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'SourceSansPro-Bold',
  },
  replyBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  replyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  replyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
  },
  addNew: {
    fontSize: 16,
    color: '#007AFF',
  },
});
