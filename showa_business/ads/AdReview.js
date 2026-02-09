import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

export default function AdReviewScreen({ navigation }) {
  return (
    <View style={styles.container}>
       <LottieView
                              source={require("../../assets/animations/Success.json")}
                              autoPlay
                              loop={true}
                              style={styles.lottie}
                            />
      <Text style={styles.title}>Your ad is under review</Text>
      <Text style={styles.subtitle}>
        Our team is reviewing your ad and will notify you when it goes live.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BusinessHome')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }, lottie: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 0,
  },
  title: { fontSize: 24, marginTop: 20, color: '#333', textAlign: 'center', fontFamily:'Lato-Black' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
  button: { marginTop: 30, backgroundColor: '#0d64dd', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
