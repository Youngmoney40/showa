import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function ProfileScreen({ navigation }) {
  

  return (
    <ScrollView>
        <View style={styles.screen}>
              <View style={styles.header}>
                <Icon name="arrow-back" size={24} />
                <Text style={styles.title}>Quick replies</Text>
                <Icon name="more-vert" size={24} />
              </View>
              <View style={styles.quickReplyBox}>
                <Text style={styles.chatName}>Thanks</Text>
                <Text>Thank you for your business! we look forward to working with you again.</Text>
                <Icon name="edit" size={20} style={{ alignSelf: 'flex-end' }} />
              </View>
              <Text style={styles.labelNote}>
                To use type \":?\" with your keyboard to select quick replies from the attachment tray.
              </Text>
            </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { marginLeft: 10 },
  save: { color: '#367BF5', fontSize: 16 },
  cancel: { color: '#367BF5', marginRight: 10 },
  textArea: {
    minHeight: 100,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 16,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  labelNote: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  quickReplyBox: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
});
