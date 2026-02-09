import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const dummyLiveVideos = [
  {
    id: '1',
    title: 'Football Match',
    username: 'sportsfan23',
    thumbnail: 'https://www.hollywoodreporter.com/wp-content/uploads/2017/04/rozman_20170405_14146_2115r-h_2017.jpg?w=1296&h=730&crop=1',
  },
  {
    id: '2',
    title: 'Cooking Show',
    username: 'chefmaster',
    thumbnail: 'https://i.ytimg.com/vi/rbfpkmu2siY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AG-B4AC0AWKAgwIABABGH8gOSgTMA8=&amp;rs=AOn4CLCINccxw6ELrW3ow7SQL7tFI-aohw',
  },
  {
    id: '3',
    title: 'Music Concert',
    username: 'djparty',
    thumbnail: 'https://avatars.mds.yandex.net/i?id=23b89bfc2eb4f115994446e3f310f21f-5859957-images-thumbs&ref=rim&n=33&w=300&h=200',
  },
];

export default function LiveScreen({ navigation }) {
  const renderLiveItem = ({ item }) => (
    <TouchableOpacity
      style={styles.liveCard}
      onPress={() => navigation.navigate('LivePlayer', { video: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.badgeContainer}>
        <Text style={styles.liveBadge}>LIVE</Text>
      </View>
     
      <View style={styles.overlay}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Live</Text>
        <TouchableOpacity
          onPress={() => console.log('Go Live')}
          style={styles.goLiveButton}
        >
          <Text style={styles.goLiveText}>Go Live</Text>
        </TouchableOpacity>
      </View>
       <Text style={{fontSize:20, color:'#333', fontFamily:'Lato-Bold', marginLeft:20, marginTop:20,}}>Happening Now</Text>

      {/* Live Videos */}
      <FlatList
        data={dummyLiveVideos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderLiveItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No live videos right now.</Text>
        }
      />
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
    justifyContent: 'space-between',
  },
  navTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  goLiveButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  goLiveText: {
    color: '#0d64dd',
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  liveCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  thumbnail: {
    width: '100%',
    height: 150,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'red',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  liveBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  overlay: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 15,
  },
});
