import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera } from 'react-native-image-picker';

const StatusEditorScreen = ({navigation}) => {
  const [statusText, setStatusText] = useState('');

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Camera error', response.errorMessage);
      } else {
        //console.log('Captured photo:', response.assets[0].uri);
       
      }
    });
  };

  const redirectBack =()=>{
    navigation.goBack();
  }

  return (
    <LinearGradient colors={['#0d64dd', '#0a55c3']} style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={redirectBack}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity>
            <Icon name="happy-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openCamera}>
            <Icon name="camera-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="image-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="text" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="color-palette-outline" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Status Input */}
      <View style={styles.centerBox}>
        <TextInput
          style={styles.statusInput}
          placeholder="Type a status"
          placeholderTextColor="#dfe6f1"
          value={statusText}
          onChangeText={setStatusText}
          multiline
        />
      </View>
    </LinearGradient>
  );
};

export default StatusEditorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInput: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
