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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

const GameDetailScreen = ({ navigation, route }) => {
  const { game } = route.params;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[game.color || '#1a1a2e', '#0f3460']}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Game Details</Text>
            <View style={styles.headerRight} />
          </View>
          
          <Animated.View 
            style={[
              styles.gameHero,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={[styles.gameHeroIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              {game.iconType === 'FontAwesome5' && (
                <FontAwesome5 name={game.icon} size={60} color="#fff" />
              )}
              {game.iconType === 'Ionicons' && (
                <Ionicons name={game.icon} size={60} color="#fff" />
              )}
            </View>
            <Text style={styles.gameHeroTitle}>{game.title}</Text>
            <View style={styles.gameHeroStats}>
              <View style={styles.gameHeroStat}>
                <Ionicons name="people-outline" size={16} color="#fff" />
                <Text style={styles.gameHeroStatText}>{game.plays} plays</Text>
              </View>
              <View style={styles.gameHeroStat}>
                <Ionicons name="star-outline" size={16} color="#fff" />
                <Text style={styles.gameHeroStatText}>{game.rating} rating</Text>
              </View>
              <View style={styles.gameHeroStat}>
                <Ionicons name="download-outline" size={16} color="#fff" />
                <Text style={styles.gameHeroStatText}>{game.downloads} downloads</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Game</Text>
            <Text style={styles.description}>{game.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {game.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={game.color} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{game.plays}</Text>
                <Text style={styles.statLabel}>Total Plays</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{game.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{game.downloads}</Text>
                <Text style={styles.statLabel}>Downloads</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.playNowButton}>
            <LinearGradient
              colors={[game.color, game.color + 'CC']}
              style={styles.playNowGradient}
            >
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.playNowText}>Play Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingBottom: 30,
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
  headerRight: {
    width: 40,
  },
  gameHero: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameHeroIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameHeroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  gameHeroStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  gameHeroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameHeroStatText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  playNowButton: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  playNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  playNowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default GameDetailScreen;