import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Image,
  Dimensions,
  Animated,
  Easing,
  Platform,
  ScrollView,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

// Simple QR Code placeholder component
const QRCodePlaceholder = ({ value, size, theme }) => {
  const { colors, isDark } = useTheme();
  const qrColor = isDark ? colors.text : colors.primary;
  const bgColor = colors.surface;
  
  return (
    <View style={[
      styles.qrPlaceholder, 
      { 
        width: size, 
        height: size, 
        backgroundColor: bgColor, 
        borderColor: qrColor 
      }
    ]}>
      <Icon name="qr-code-2" size={size * 0.4} color={qrColor} />
      <Text style={[styles.qrValue, { fontSize: size * 0.06, color: colors.textSecondary }]} numberOfLines={1}>
        {value.substring(0, 20)}...
      </Text>
    </View>
  );
};

export default function InviteLinkScreen({ route, navigation }) {
  const { inviteLink, profile_image, name } = route.params;
  const { colors, theme, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const [qrModalVisible, setQrModalVisible] = React.useState(false);
  const [qrCodeUri, setQrCodeUri] = useState(null);

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Generate QR code if possible
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      // Try to generate QR code with qrcode library
      // First check if we can import it
      const qrcodeModule = await import('qrcode');
      const qrcode = qrcodeModule.default || qrcodeModule;
      
      // Generate QR code as data URL
      const dataUrl = await qrcode.toDataURL(inviteLink, {
        width: 400,
        margin: 2,
        color: {
          dark: isDark ? colors.text : colors.primary,
          light: colors.surface
        }
      });
      setQrCodeUri(dataUrl);
    } catch (error) {
      console.log('QR Code generation failed, using placeholder:', error);
      setQrCodeUri(null);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my channel on Showa: ${inviteLink}`,
        title: 'Invite to Showa Channel',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the link.');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(inviteLink);
    Alert.alert('Copied', 'The link has been copied to your clipboard.');
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const openQRModal = () => {
    setQrModalVisible(true);
  };

  const closeQRModal = () => {
    setQrModalVisible(false);
  };

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const renderQRCode = (size) => {
    if (qrCodeUri) {
      return (
        <Image
          source={{ uri: qrCodeUri }}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      );
    } else {
      return <QRCodePlaceholder value={inviteLink} size={size} theme={theme} />;
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
      {/* Close Button - Top Right */}
      <TouchableOpacity 
        style={[
          styles.closeButton, 
          { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }
        ]}
        onPress={handleClose}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Icon name="close" size={28} color={isDark ? colors.text : colors.primary} />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleValue }]
              }
            ]}
          >
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    profile_image
                      ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
                      : require('../assets/images/channelfallbackimg.png') 
                  }
                  style={[
                    styles.avatar, 
                    { 
                      borderColor: colors.surface,
                      backgroundColor: colors.surfaceSecondary 
                    }
                  ]}
                  resizeMode="cover"
                />
                <View style={[styles.verifiedBadge, { backgroundColor: colors.surface }]}>
                  <Icon name="verified" size={20} color={colors.primary} />
                </View>
              </View>
              <Text style={[styles.channelName, { color: colors.text }]}>{name}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Invite your friends to join this channel
              </Text>
            </View>

            <Animated.View 
              style={[
                styles.card,
                {
                  opacity: cardAnim,
                  transform: [{ translateY: cardTranslateY }],
                  backgroundColor: colors.surface,
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOpacity: isDark ? 0.3 : 0.1,
                }
              ]}
            >
              <Text style={[styles.title, { color: colors.text }]}>Invitation Link</Text>
              
              <View style={[
                styles.linkContainer, 
                { 
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border 
                }
              ]}>
                <Text style={[styles.link, { color: colors.primary }]} numberOfLines={1} ellipsizeMode="tail">
                  {inviteLink}
                </Text>
              </View>

              <View style={styles.qrContainer}>
                <TouchableOpacity 
                  onPress={openQRModal}
                  style={styles.qrTouchable}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.qrBackground, 
                    { 
                      backgroundColor: colors.surface,
                      borderColor: colors.border 
                    }
                  ]}>
                    {renderQRCode(180)}
                  </View>
                </TouchableOpacity>
                <Text style={[styles.qrHint, { color: colors.textSecondary }]}>
                  Tap QR code to enlarge
                </Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.button, styles.shareButton, { backgroundColor: colors.primary }]} 
                  onPress={handleShare}
                  activeOpacity={0.7}
                >
                  <Icon name="share" size={20} color={colors.buttonPrimaryText} style={styles.buttonIcon} />
                  <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>Share Link</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.button, styles.copyButton, { backgroundColor: colors.secondary || '#2ecc71' }]} 
                  onPress={handleCopy}
                  activeOpacity={0.7}
                >
                  <Icon name="content-copy" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* QR Code Modal for better viewing */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={closeQRModal}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.85)' }]} 
          activeOpacity={1} 
          onPress={closeQRModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
              onPress={closeQRModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.modalContent}>
              <View style={[
                styles.modalQrContainer, 
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border 
                }
              ]}>
                {renderQRCode(250)}
              </View>
              <Text style={[styles.modalText, { color: colors.text }]}>
                Scan to join {name}
              </Text>
              <View style={[
                styles.modalLinkContainer, 
                { 
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border 
                }
              ]}>
                <Text style={[styles.modalLink, { color: colors.primary }]} numberOfLines={2}>
                  {inviteLink}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, 
  },
 
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 60,
    right: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    padding: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  channelName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
    textTransform:'capitalize',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
  },
  link: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  qrContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  qrTouchable: {
    alignItems: 'center',
  },
  qrBackground: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  qrValue: {
    textAlign: 'center',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  qrHint: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#fff',
  },
  buttonIcon: {
    marginRight: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalContent: {
    alignItems: 'center',
    width: '100%',
  },
  modalQrContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLinkContainer: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
  },
  modalLink: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});