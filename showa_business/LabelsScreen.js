import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function LabelsScreen({ navigation }) {
  const labels = [
    { color: 'violet', name: 'Paid', count: 2 },
    { color: 'cyan', name: 'New order', count: 0 },
    { color: 'red', name: 'Pending payment', count: 0 },
    { color: 'green', name: 'Important', count: 1 },
    { color: 'deepskyblue', name: 'Follow up', count: 2 },
    { color: 'purple', name: 'Lead', count: 1 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Labels</Text>
        <TouchableOpacity>
          <Icon name="add" size={24} color="#0d64dd" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {labels.map((label, index) => (
          <TouchableOpacity key={index} style={styles.labelItem}>
            <View style={[styles.labelDot, { backgroundColor: label.color }]} />
            <View style={styles.labelTextWrapper}>
              <Text style={styles.labelName}>{label.name}</Text>
              <Text style={styles.labelCount}>{label.count} item{label.count !== 1 ? 's' : ''}</Text>
            </View>
            <Icon name="drag-indicator" size={20} color="#999" />
          </TouchableOpacity>
        ))}

        <Text style={styles.labelNote}>
          Use labels to organize your customers and chats. Tap and hold on any message or contact to label it.
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { paddingHorizontal: 16, paddingVertical: 10 },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  labelDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  labelTextWrapper: { flex: 1 },
  labelName: { fontSize: 16, fontWeight: '500' },
  labelCount: { color: '#888', fontSize: 14 },
  labelNote: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});