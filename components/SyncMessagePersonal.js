import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncContacts } from '../components/SyncContact';
import colors from '../theme/colors';

const SyncContactsScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSyncContacts = async () => {
    setIsSyncing(true);
    const authToken = await AsyncStorage.getItem('userToken');
    
    if (!authToken) {
      Alert.alert('Error', 'Please login first.');
      setIsSyncing(false);
      return;
    }

    try {
      const result = await syncContacts(authToken);
      //console.log('Contact sync successful:', result.data);

      if (result.success) {
        const message =
          result.syncedContacts > 0
            ? `${result.syncedContacts} of your contacts are now connected and ready to chat.`
            : 'No matching contacts were found. Invite your friends to join the app!';

        setSyncComplete(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('UserContactListPersonalAccount');
        }, 2000);
      } else {
        Alert.alert('Error', result.error || 'Failed to sync contacts.');
      }
    } catch (error) {
      //console.log('Sync error:', error.message);
      Alert.alert('Error', 'An error occurred while syncing your contacts.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/ConversationLottieAnimation.json")}
        autoPlay
        loop={true}
        style={styles.image}
      />

      <Text style={styles.heading}>Connect With Friends</Text>

      <Text style={styles.description}>
        To start chatting, we need access to your contacts to help you find friends who are already using the app. Don't worry, we don't store your contacts.
      </Text>

      <TouchableOpacity 
        style={styles.syncButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.syncButtonText}>Sync Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isSyncing && setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isSyncing || syncComplete ? (
              <>
                <LottieView
                  source={require("../assets/animations/DocumentProcessing.json")}
                  autoPlay
                  loop={!syncComplete}
                  style={styles.lottie}
                />
                <Text style={styles.thankYouText}>
                  {syncComplete ? 'Contacts Synced Successfully ' : 'Processing Contacts...'}
                </Text>
                {!syncComplete && (
                  <Text style={styles.processingText}>Please wait while we sync your contacts</Text>
                )}
              </>
            ) : (
              <>
                
                <Text style={styles.modalSubtitle}>Why We Ask for Contact Access</Text>
                <Text style={styles.modalDescription}>
                  • Instantly find and chat with friends already using the app.{'\n'}
                  • Suggest people you may know for easier connections.{'\n'}
                  • No spam, no sharing — your contacts stay private.
                </Text>
                <Text style={styles.noteText}>
                  We do not upload or store your contact list.dyyy Everything is matched securely on your device.
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.dismissBtn} 
                    onPress={() => setModalVisible(false)}
                    disabled={isSyncing}
                  >
                    <Text style={styles.dismissText}>Not Now</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.allowBtn} 
                    onPress={handleSyncContacts}
                    disabled={isSyncing}
                  >
                    <Text style={styles.allowText}>Allow Access</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 220,
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontFamily:'SourceSansPro-Bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  syncButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  skipText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dismissBtn: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginRight: 10,
  },
  dismissText: {
    textAlign: 'center',
    color: '#666',
  },
  allowBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.primary,
    flex: 1,
    marginLeft: 10,
  },
  allowText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  processingText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default SyncContactsScreen;