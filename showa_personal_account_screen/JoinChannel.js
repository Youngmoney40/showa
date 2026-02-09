import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

const { width } = Dimensions.get('window');

const stationCategories = [
  {
    id: 'movie',
    title: 'Movie',
    stations: [
      { id: '1', name: 'CineVerse', followers: '2.4M', isFollowing: false },
      { id: '2', name: 'Hollywood Talk', followers: '3.1M', isFollowing: true },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    stations: [
      { id: '3', name: 'Forbes Digest', followers: '5.2M', isFollowing: false },
      { id: '4', name: 'Startup Grind', followers: '1.8M', isFollowing: true },
    ],
  },
  {
    id: 'tech',
    title: 'Tech',
    stations: [
      { id: '5', name: 'TechCrunch Live', followers: '6.9M', isFollowing: false },
      { id: '6', name: 'Dev Circle', followers: '900K', isFollowing: false },
    ],
  },
];

const ChatScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stations</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search stations"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover Stations</Text>
          <Divider />

          {stationCategories.map((category) => (
            <View key={category.id} style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle2}>{category.title}</Text>
              {category.stations.map((station) => (
                <View key={station.id} style={styles.communityItem}>
                  <Image
                    source={require('../assets/images/dad.jpg')}
                    style={styles.communityAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.communityName}>{station.name}</Text>
                    <Text style={styles.communityMsg}>{station.followers} followers</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      station.isFollowing && styles.followingBtn,
                    ]}
                  >
                    <Text style={{ color: station.isFollowing ? '#888' : '#000' }}>
                      {station.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Icon name="home-outline" size={24} color="#666" />
          <Text style={styles.navLabel}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Icon name="call-outline" size={24} color="#666" />
          <Text style={styles.navLabel}>Call</Text>
        </View>
        <View style={styles.centerButton}>
          <Icon name="swap-vertical-outline" size={20} color="#fff" />
        </View>
        <TouchableOpacity>
          <View style={styles.navItem}>
            <Icon name="albums-outline" size={24} color="#666" />
            <Text style={styles.navLabel}>Stories</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StatusEditorScreen')}>
          <View style={styles.navItem}>
            <Icon name="person-outline" size={24} color="#666" />
            <Text style={styles.navLabel}>Me</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  searchBox: {
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 60,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle2: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  communityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  communityName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  communityMsg: {
    fontSize: 12,
    color: '#666',
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  followingBtn: {
    backgroundColor: '#ddd',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centerButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3a7bd5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});
