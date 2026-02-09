import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function NewCommunityScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cancel}>Cancel</Text>
        <Text style={styles.title}>New community</Text>
        <View style={{ width: 60 }} /> 
      </View>

      <TouchableOpacity style={styles.imageBox}>
        <Image source={require('../assets/images/avatar/blank-profile-picture-973460_1280.png')} style={styles.imageIcon} />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Community name..."
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        multiline
        numberOfLines={4}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create community</Text>
      </TouchableOpacity>

      <View style={styles.tabBar}>
        <Text style={styles.tabItem}>Home</Text>
        <Text style={styles.tabItem}>Call</Text>
        <Text style={styles.tabCenter}>●</Text>
        <Text style={styles.tabItem}>Stories</Text>
        <Text style={styles.tabItem}>Me</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancel: { color: '#fff' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imageBox: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageIcon: {
    width: 80,
    height: 80,
    tintColor: '#444',
  },
  editText: { color: '#333', marginTop: 4 },
  input: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    height: 100,
  },
  button: {
    backgroundColor: '#2196F3',
    margin: 20,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: { color: '#666' },
  tabCenter: {
    fontSize: 28,
    color: '#2196F3',
  },
});
