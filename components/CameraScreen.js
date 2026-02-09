import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Button,
  Dimensions,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/Ionicons';

const CameraScreen = ({ navigation }) => {
  const [type, setType] = useState(CameraType.Back);
  const [flashMode, setFlashMode] = useState('off');
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [mediaType, setMediaType] = useState(null); // 'photo' or 'video'
  const [isRecording, setIsRecording] = useState(false);
  const [caption, setCaption] = useState('');
  const cameraRef = useRef(null);

  const flipCamera = () => {
    setType(prev => (prev === CameraType.Back ? CameraType.Front : CameraType.Back));
  };

  const toggleFlash = () => {
    setFlashMode(prev => (prev === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.capture();
        setCapturedMedia(uri);
        setMediaType('photo');
        setIsPreviewVisible(true);
      } catch (error) {
       // console.error('Failed to take picture:', error);
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const { uri } = await cameraRef.current.startRecording();
        setCapturedMedia(uri);
        setMediaType('video');
      } catch (error) {
        
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
        setIsPreviewVisible(true);
      } catch (error) {
        
      } finally {
        setIsRecording(false);
      }
    }
  };

  const retake = () => {
    setCapturedMedia(null);
    setIsPreviewVisible(false);
    setMediaType(null);
  };

  const handlePost = () => {
    navigation.navigate('StatusEditorScreen', {
      mediaUri: capturedMedia,
      mediaType,
      caption,
    });
  };

  return (
    <View style={styles.container}>
      {!isPreviewVisible ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          cameraType={type}
          flashMode={flashMode}
          zoomMode={true}
          focusMode="on"
        >
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Icon name={flashMode === 'on' ? 'flash' : 'flash-off'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <View style={styles.captureContainer}>
              {!isRecording ? (
                <>
                  <TouchableOpacity
                    style={styles.videoButton}
                    onPress={startRecording}
                    onLongPress={startRecording}
                  >
                    <Text style={styles.videoButtonText}>Hold for Video</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                    <Icon name="camera-reverse" size={30} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                  <View style={styles.stopButtonInner} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          {mediaType === 'photo' ? (
            <Image source={{ uri: capturedMedia }} style={styles.previewImage} />
          ) : (
            <Video
              source={{ uri: capturedMedia }}
              style={styles.previewVideo}
              resizeMode="cover"
              repeat={true}
              controls={true}
            />
          )}
          
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption (optional)"
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
          
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={retake}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  controlButton: {
    padding: 10,
  },
  bottomControls: {
    paddingBottom: 40,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  videoButton: {
    padding: 10,
  },
  videoButtonText: {
    color: 'white',
    fontSize: 14,
  },
  flipButton: {
    padding: 10,
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewVideo: {
    flex: 1,
  },
  captionInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    fontSize: 16,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  retakeButton: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  postButton: {
    padding: 15,
    backgroundColor: '#0d64dd',
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;