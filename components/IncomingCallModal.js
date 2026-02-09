
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_ROUTE_IMAGE } from '../api_routing/api';


const IncomingCallModal = ({
  visible,
  onAccept,
  onReject,
  profileImage,
  callerName,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onReject}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#0f2027', '#203a43', '#2c5364']}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.incomingCallText}>Incoming Call</Text>

            <View style={styles.callerInfo}>
              <View style={styles.modalAvatar}>
                <Image
                  source={{
                    uri: profileImage
                      ? `${API_ROUTE_IMAGE}${profileImage}`
                      : 'https://via.placeholder.com/100',
                  }}
                  style={styles.modalAvatarImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.modalCallerName}>{callerName || 'Caller'}</Text>
              <Text style={styles.modalCallType}>Voice Call</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
                <View style={styles.rejectButtonInner}>
                  <Icon name="call-end" size={30} color="white" />
                </View>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                <View style={styles.acceptButtonInner}>
                  <Icon name="call" size={30} color="white" />
                </View>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
  },
  incomingCallText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4a5568',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  modalCallerName: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalCallType: {
    fontSize: 16,
    color: '#a0aec0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  rejectButton: {
    alignItems: 'center',
  },
  acceptButton: {
    alignItems: 'center',
  },
  rejectButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e53e3e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  acceptButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#38a169',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default IncomingCallModal;