import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import { syncContacts } from '../components/SyncContact'; 

const { width } = Dimensions.get("window");

const SyncContactsScreen = () => {
  const navigation = useNavigation();


  const [isVisible2, setIsVisible2] = React.useState(false);
  const [showAnimationImage, setShowAnimationImage] = useState(false);


  const handleSyncContacts = async () => {
  const authToken = await AsyncStorage.getItem('userToken');
  
  if (!authToken) {
    //Alert.alert('Error', 'Please login first.');
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

      Alert.alert('Contacts Synced Successfully ✅', message);
      await navigation.navigate('UserContactList')
    } else {
      Alert.alert('Error', result.error || 'Failed to sync contacts.');
    }
  } catch (error) {
    //console.log('Sync error:', error.message);
    Alert.alert('Error', 'An error occurred while syncing your contacts.');
  }
};

  const handleSkip = () => {
    navigation.replace('ChatScreen');
  };

  return (
    <View style={styles.container}>
     

      <Text style={styles.heading}>Connect With Friends</Text>

      <Text style={styles.description}>
        To start chatting, we need access to your contacts to help you find friends who are already using the app. Don’t worry, we don’t store your contacts.
      </Text>

      <TouchableOpacity style={styles.syncButton} onPress={handleSyncContacts}>
        <Text style={styles.syncButtonText}>Sync Contacts</Text>
      </TouchableOpacity>

      <View style={styles.emptyList}>
              
                <TouchableOpacity 
                onPress={()=>{
                  // setShowStartChatModal(true)
                  // handleSyncContacts();
                  setIsVisible2(true);
                }}
                  // 
                  
                >
                  <View  style={{padding:15,marginTop:10,backgroundColor:'#fff'}}>
                  <Text>Connect with your Friends on Showa App </Text>
                  <Text style={{color:'blue', alignSelf:'center'}}>click to get started </Text>
                </View>
                </TouchableOpacity>
                
              </View>

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <Modal
            isVisible={isVisible2}
            animationIn="slideInUp"
            animationOut="fadeOutDown"
            backdropOpacity={0.5}
            useNativeDriver
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {showAnimationImage ? (
                  <>
                    {/* <LottieView
                      source={require("../assets/animations/DocumentProcessing.json")}
                      autoPlay
                      loop={true}
                      style={styles.lottie}
                    /> */}
                    <Text style={styles.thankYouText}>Contacts Access Granted ✅</Text>
                    <Text style={[styles.thankYouText, {color:'#777', fontFamily:'Lato-Italic'}]}>Sync is processing please wait...</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.title, {fontFamily:'Lato-Bold'}]}>Sync Contacts to Find Friends</Text>
                    <Text style={styles.description}>
                      Want to see which of your friends are already here? Just let us access your contacts and we’ll show you who’s online — no stress, no spam.
                      {'\n\n'}
                    <Text style={styles.title}>Why We Ask for Contact Access</Text>
                    <Text style={styles.description}>{'\n'}
                      • Instantly find and chat with friends already using the app.{'\n'}
                      • Suggest people you may know for easier connections.{'\n'}
                      • No spam, no sharing — your contacts stay private.
                      {'\n\n'}
                      We do not upload or store your contact list. Everything is matched securely on your device.
                    </Text>
                    </Text>
      
      
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.dismissBtn} onPress={()=>setIsVisible2(false)}>
                        <Text style={styles.dismissText}>Not Now</Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity style={styles.allowBtn} onPress={()=>{
                        handleSyncContacts();
                       setShowAnimationImage(true);
                       
                      }}>
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

export default SyncContactsScreen;

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
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  syncButton: {
    backgroundColor: '#1DA1F2',
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
});
