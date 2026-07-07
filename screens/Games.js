import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const GamesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = ['All', 'Puzzle', 'Card', 'Strategy', 'Arcade', 'Word'];

  const games = [
    {
      id: '1',
      title: 'Solitaire',
      icon: 'cards-outline',
      iconType: 'Ionicons',
      color: '#4CAF50',
      category: 'Card',
      plays: '12.5K',
      rating: 4.7,
      downloads: '8.2K',
      description: 'Classic solitaire card game with beautiful animations and multiple difficulty levels.',
      features: ['Multiple game modes', 'Daily challenges', 'Statistics tracking'],
    },
    {
      id: '2',
      title: 'Chess',
      icon: 'chess-king',
      iconType: 'FontAwesome5',
      color: '#2196F3',
      category: 'Strategy',
      plays: '8.2K',
      rating: 4.9,
      downloads: '5.6K',
      description: 'Play chess against AI or challenge your friends in real-time multiplayer matches.',
      features: ['AI opponents', 'Multiplayer mode', 'Game analysis'],
    },
    {
      id: '3',
      title: 'Tic Tac Toe',
      icon: 'grid-outline',
      iconType: 'Ionicons',
      color: '#FF6B35',
      category: 'Puzzle',
      plays: '15.8K',
      rating: 4.5,
      downloads: '11.3K',
      description: 'The classic game of Xs and Os with a modern twist. Play against AI or with friends.',
      features: ['3 difficulty levels', '2-player mode', 'Statistics'],
    },
    {
      id: '4',
      title: 'Memory Match',
      icon: 'brain-outline',
      iconType: 'Ionicons',
      color: '#9C27B0',
      category: 'Puzzle',
      plays: '6.3K',
      rating: 4.6,
      downloads: '4.1K',
      description: 'Test your memory with this fun matching game. Find all pairs to win!',
      features: ['Multiple levels', 'Timer challenge', 'Score tracking'],
    },
    {
      id: '5',
      title: 'Snake',
      icon: 'snake',
      iconType: 'FontAwesome5',
      color: '#FF5722',
      category: 'Arcade',
      plays: '9.1K',
      rating: 4.4,
      downloads: '6.8K',
      description: 'Guide the snake to eat food and grow longer. Avoid hitting walls or yourself!',
      features: ['Classic mode', 'Speed levels', 'High scores'],
    },
    {
      id: '6',
      title: 'Word Search',
      icon: 'text-outline',
      iconType: 'Ionicons',
      color: '#00BCD4',
      category: 'Word',
      plays: '11.7K',
      rating: 4.8,
      downloads: '7.9K',
      description: 'Find hidden words in a grid of letters. Challenge yourself with different categories.',
      features: ['Multiple categories', 'Difficulty levels', 'Timer mode'],
    },
    {
      id: '7',
      title: 'Sudoku',
      icon: 'grid',
      iconType: 'FontAwesome5',
      color: '#FF9800',
      category: 'Puzzle',
      plays: '7.5K',
      rating: 4.7,
      downloads: '5.3K',
      description: 'Classic number puzzle game with multiple difficulty levels and hints.',
      features: ['4 difficulty levels', 'Hint system', 'Auto-save'],
    },
    {
      id: '8',
      title: 'Trivia Quiz',
      icon: 'help-circle-outline',
      iconType: 'Ionicons',
      color: '#E91E63',
      category: 'Word',
      plays: '10.2K',
      rating: 4.3,
      downloads: '6.5K',
      description: 'Test your knowledge with hundreds of trivia questions across multiple categories.',
      features: ['Multiple categories', 'Score tracking', 'Leaderboard'],
    },
  ];

  const filteredGames = selectedCategory === 'All' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back()),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderGameItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.gameItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          marginTop: index === 0 ? 0 : 15,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.gameItemTouchable}
        onPress={() => navigation.navigate('GamesDetail', { game: item })}
        activeOpacity={0.7}
      >
        <View style={styles.gameItemLeft}>
          <View style={[styles.gameItemIcon, { backgroundColor: item.color }]}>
            {item.iconType === 'FontAwesome5' && (
              <FontAwesome5 name={item.icon} size={30} color="#fff" />
            )}
            {item.iconType === 'Ionicons' && (
              <Ionicons name={item.icon} size={30} color="#fff" />
            )}
          </View>
          <View style={styles.gameItemInfo}>
            <Text style={styles.gameItemTitle}>{item.title}</Text>
            <View style={styles.gameItemStats}>
              <View style={styles.gameItemStat}>
                <Ionicons name="people-outline" size={14} color="#666" />
                <Text style={styles.gameItemStatText}>{item.plays} plays</Text>
              </View>
              <View style={styles.gameItemStat}>
                <Ionicons name="star-outline" size={14} color="#666" />
                <Text style={styles.gameItemStatText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.playButtonLarge}>
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.playButtonLargeText}>Play</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Free Games</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          style={[
            styles.headerStats,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{games.length}</Text>
            <Text style={styles.headerStatLabel}>Games</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>5.2K</Text>
            <Text style={styles.headerStatLabel}>Daily Players</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>4.6</Text>
            <Text style={styles.headerStatLabel}>Avg Rating</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Categories */}
        <Animated.View 
          style={[
            styles.categoriesContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Games List */}
        <Animated.View 
          style={[
            styles.gamesListContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <FlatList
            data={filteredGames}
            renderItem={renderGameItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gamesListContent}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    marginHorizontal: 20,
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingVertical: 5,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  gamesListContainer: {
    flex: 1,
  },
  gamesListContent: {
    paddingBottom: 20,
  },
  gameItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  gameItemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  gameItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gameItemInfo: {
    flex: 1,
  },
  gameItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  gameItemStats: {
    flexDirection: 'row',
    gap: 15,
  },
  gameItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameItemStatText: {
    fontSize: 12,
    color: '#666',
  },
  playButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  playButtonLargeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default GamesScreen;