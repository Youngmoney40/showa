// screens/OoshBusinessScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const categories = [
  { id: '1', name: 'Restaurants' },
  { id: '2', name: 'Logistics' },
  { id: '3', name: 'Beauty' },
];

const dummyUsers = [
  { id: '1', name: 'Anna Doe', online: true },
  { id: '2', name: 'John Smith', online: false },
];

export default function OoshBusinessScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Oosh Business</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() => openModal(item)}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedCategory?.name}
            </Text>
          </View>
          <FlatList
            data={dummyUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={{ color: item.online ? 'green' : 'gray' }}>
                  {item.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d64dd',
    height: 60,
    paddingHorizontal: 16,
  },
  title: { color: '#fff', fontSize: 20, marginLeft: 12, fontWeight: '600' },
  category: {
    backgroundColor: '#f4f6f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: { fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginLeft: 12 },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userName: { fontSize: 16 },
});
