import React from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const dummySongs = Array(12).fill({
  title: 'Bout U',
  artist: 'Rema',
  plays: '66.7k plays',
  duration: '2:43',
  image: 'https://via.placeholder.com/50', 
});

export default function SongsListScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Songs</Text>
        <Icon name="close" size={24} color="#000" />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" />
        <TextInput placeholder="Add song" style={styles.input} />
      </View>

      <FlatList
        data={dummySongs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songMeta}>{item.artist} • {item.plays} • {item.duration}</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add-circle-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  input: { flex: 1, paddingLeft: 10, fontSize: 16 },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  thumbnail: { width: 50, height: 50, borderRadius: 4 },
  songInfo: { flex: 1, marginLeft: 10 },
  songTitle: { fontWeight: 'bold' },
  songMeta: { fontSize: 12, color: '#555' },
});
