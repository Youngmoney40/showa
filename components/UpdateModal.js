

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const UpdateModal = ({ visible, updateInfo, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => { 
    setIsLoading(true);
    try {
      const { download_url, platform } = updateInfo;
      
      if (download_url) {
        // Use provided download URL
        await Linking.openURL(download_url);
      } else {
        // Fallback to store URLs
        const storeUrl = Platform.select({
          ios: 'https://apps.apple.com/app/idYOUR_APP_ID', 
          android: 'https://play.google.com/store/apps/details?id=com.showa&hl=en_US', // Replace with your package name
        });
        
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.error('Error opening store:', error);
      Alert.alert('Error', 'Could not open app store. Please update manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdateTypeStyle = () => {
    const { update_type, force_update } = updateInfo;
    if (force_update || update_type === 'force') {
      return styles.forceUpdateContainer;
    }
    if (update_type === 'recommended') {
      return styles.recommendedContainer;
    }
    return styles.optionalContainer;
  };

  const getUpdateTypeIcon = () => {
    const { update_type, force_update } = updateInfo;
    if (force_update || update_type === 'force') {
      return 'warning';
    }
    if (update_type === 'recommended') {
      return 'info';
    }
    return 'system-update';
  };

  const getUpdateTypeColor = () => {
    const { update_type, force_update } = updateInfo;
    if (force_update || update_type === 'force') return '#dc3545';
    if (update_type === 'recommended') return '#ffc107';
    return '#28a745';
  };

  const getUpdateTypeText = () => {
    const { update_type, force_update } = updateInfo;
    if (force_update || update_type === 'force') return 'Required Update';
    if (update_type === 'recommended') return 'Recommended Update';
    return 'New Update Available';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        if (!updateInfo.force_update) onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, getUpdateTypeStyle()]}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="system-update" size={50} color={getUpdateTypeColor()} />
            <Text style={[styles.title, { color: getUpdateTypeColor() }]}>
              {getUpdateTypeText()}
            </Text>
          </View>

          {/* Version Info */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>
              New Version: <Text style={styles.versionNumber}>{updateInfo.latest_version}</Text>
            </Text>
            <Text style={styles.currentVersionText}>
              Current Version: {updateInfo.current_version}
            </Text>
          </View>

          {/* Release Notes */}
          <ScrollView style={styles.releaseNotesContainer}>
            {updateInfo.release_notes ? (
              <Text style={styles.releaseNotes}>{updateInfo.release_notes}</Text>
            ) : null}

            {updateInfo.whats_new && updateInfo.whats_new.length > 0 && (
              <View style={styles.whatsNew}>
                <Text style={styles.whatsNewTitle}>What's New:</Text>
                {updateInfo.whats_new.map((item, index) => (
                  <View key={index} style={styles.whatsNewItem}>
                    <Icon name="check-circle" size={16} color="#28a745" />
                    <Text style={styles.whatsNewText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.updateButton, { backgroundColor: getUpdateTypeColor() }]}
              onPress={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Icon name="cloud-download" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Update Now</Text>
                </>
              )}
            </TouchableOpacity>

            {!updateInfo.force_update && (
              <TouchableOpacity style={[styles.button, styles.laterButton]} onPress={onClose}>
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  forceUpdateContainer: {
    borderTopWidth: 5,
    borderTopColor: '#dc3545',
  },
  recommendedContainer: {
    borderTopWidth: 5,
    borderTopColor: '#ffc107',
  },
  optionalContainer: {
    borderTopWidth: 5,
    borderTopColor: '#28a745',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  versionText: {
    fontSize: 16,
    color: '#333',
  },
  versionNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#007aff',
  },
  currentVersionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  releaseNotesContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  releaseNotes: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  whatsNew: {
    marginTop: 15,
  },
  whatsNewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  whatsNewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  whatsNewText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#007aff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  laterButton: {
    backgroundColor: '#f0f0f0',
  },
  laterButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdateModal;