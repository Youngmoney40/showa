import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useTheme } from '../src/context/ThemeContext';

export default function AdReviewScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <View style={styles.content}>
        <LottieView
          source={require("../assets/animations/Success.json")}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          Broadcast Sent Successfully
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your broadcast message has been sent successfully to all selected recipients.
          You can view the broadcast details in your sent messages. 
          Recipients will receive notifications shortly.
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('BroadcastHome')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 0,
  },
  title: { 
    fontSize: 28, 
    marginTop: 16, 
    textAlign: 'center', 
    fontWeight: '700',
    fontFamily: 'Lato-Black',
  },
  subtitle: { 
    fontSize: 15, 
    marginTop: 10, 
    textAlign: 'center', 
    paddingHorizontal: 20,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  button: { 
    marginTop: 30, 
    paddingVertical: 14, 
    paddingHorizontal: 40, 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
});