// import React, { useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Animated,Modal } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const AccountSwitchModal = ({ visible, onClose, onSwitchAccount }) => {
//   const [fadeAnim] = React.useState(new Animated.Value(0));

//   const navigation = useNavigation()

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
//         <View style={styles.accountModalContainer}>
//           <Text style={styles.modalTitle}>Choose Your Showa Experience</Text>
//           <Text style={styles.modalSubtitle}> Switch between e-Vibbz (short videos) and e-Broadcast (posts & updates)</Text>
//           <TouchableOpacity
//             style={[styles.modalButton, { backgroundColor: '#0d64dd' }]}
//             onPress={()=>{
//               navigation.navigate('SocialHome'),
//               onClose

//             }}
//           >
//             <Text style={[styles.modalButtonText, { color: '#fff' }]}>e-Vibbz</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modalButton, { backgroundColor: '#9704e0' }]}
//             onPress={()=>{
//               navigation.navigate('BroadcastHome'),
//               onClose

//             }}
//           >
//             <Text style={[styles.modalButtonText, { color: '#fff' }]}>e-Broadcast</Text>
//           </TouchableOpacity>
//           <View style={styles.accountButtonContainer}>
//             <TouchableOpacity>
//               <Text style={styles.accountButtonText}>Switch Account</Text>
//               <Text>Switch bettwen your account</Text>
              
//             </TouchableOpacity>

//           </View>
//           <TouchableOpacity>
//             <Text style={styles.accountButtonText}>Switch to business</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modalButton, { backgroundColor: '#eee' }]}
//             onPress={onClose}
//           >
//             <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   accountModalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   modalTitle: {
//     fontFamily: 'SourceSansPro-Bold',
//     fontSize: 22,
//     color: '#1a1a1a',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontFamily: 'SourceSansPro-Regular',
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   accountButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 16,
//   },
//   accountButton: {
//     flex: 1,
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   accountButtonText: {
//     color: '#fff',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//   },
//   modalButton: {
//     backgroundColor: '#0d64dd',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontFamily: 'SourceSansPro-SemiBold',
//     fontSize: 16,
//   },
// });

// export default AccountSwitchModal;
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AccountSwitchModal = ({ visible, onClose, onSwitchAccount }) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={22} color="#333" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Choose Your Showa Experience</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Switch between{' '}
            <Text style={{ color: '#9704e0', fontWeight: '600' }}>e-Vibbz</Text>{' '}
            (short videos) and{' '}
            <Text style={{ color: '#0d6efd', fontWeight: '600' }}>
              e-Broadcast
            </Text>{' '}
            (posts & updates)
          </Text>

          {/* e-Vibbz Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9704e0' }]}
            onPress={() => {
              navigation.navigate('SocialHome');
              onClose();
            }}
          >
            <Text style={styles.actionButtonText}>e-Vibbz</Text>
          </TouchableOpacity>

          {/* e-Broadcast Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#0d6efd' }]}
            onPress={() => {
              navigation.navigate('BroadcastHome');
              onClose();
            }}
          >
            <Text style={styles.actionButtonText}>e-Broadcast</Text>
          </TouchableOpacity>

          {/* Switch Account Section */}
          <TouchableOpacity
            style={[styles.secondaryButton, { marginTop: 18 }]}
            onPress={onSwitchAccount}
          >
            <Text style={styles.secondaryText}>Switch Account</Text>
            <Text style={styles.secondarySubText}>
              Switch between your personal and creator accounts
            </Text>
          </TouchableOpacity>

          {/* Switch to Business */}
          <TouchableOpacity
            style={[styles.secondaryButton, { marginTop: 14 }]}
            onPress={() => {
              navigation.navigate('BusinessHome');
              onClose();
            }}
          >
            <Text style={styles.secondaryText}>Switch to Business</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={[styles.cancelButton, { marginTop: 22 }]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  secondarySubText: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default AccountSwitchModal;
