import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  Image,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../globalshared/constants/colors';

const { width } = Dimensions.get('window');

export default function ECompanionScreen({ navigation }) {
  const roles = [
    {
      id: 'daddy',
      title: 'Sugar Daddy',
      subtitle: 'Provide support & mentorship',
      description: 'Connect with companions seeking guidance and support. Build meaningful relationships while offering financial assistance and life mentorship.',
      icon: 'sparkles-outline',
      gradient: ['#FF3366', '#FF6F00'],
      buttonText: 'Continue as Sugar Daddy',
      image: 'https://www.bugremoda.com.br/wp-content/uploads/2024/08/100-Beards-100-Bearded-Men-On-Instagram-To-Follow-For-Beardspiration.jpeg',
    },
    {
      id: 'mummy',
      title: 'Sugar Mummy',
      subtitle: 'Offer care & companionship',
      description: 'Find genuine connections with younger companions. Share your wisdom and resources while receiving companionship and appreciation.',
      icon: 'sparkles-outline',
      gradient: ['#8B5CF6', '#6366F1'],
      buttonText: 'Continue as Sugar Mummy',
      image: 'https://www.ofuxico.com.br/wp-content/uploads/2023/09/jojo-todynho-vestido-branco.jpg',
    },
    {
      id: 'boy',
      title: 'Sugar Boy',
      subtitle: 'Receive support & guidance',
      description: 'Connect with generous benefactors who can provide financial support, mentorship, and help you achieve your personal and professional goals.',
      icon: 'person-outline',
      gradient: ['#10B981', '#059669'],
      buttonText: 'Continue as Sugar Boy',
      image: 'https://cdn.shopify.com/s/files/1/0987/9106/files/how-to-wear-a-pork-pie-hat.jpg',
    },
    {
      id: 'girl',
      title: 'Sugar Girl',
      subtitle: 'Receive support & guidance',
      description: 'Connect with generous benefactors who can provide financial support, mentorship, and help you achieve your personal and professional goals.',
      icon: 'person-outline',
      gradient: ['#EC4899', '#BE185D'],
      buttonText: 'Continue as Sugar Baby',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    }
  ];

  const handleRoleSelection = (roleId) => {
    navigation.navigate('SugarSetupProfile', { status: roleId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor={Colors.background} />
    
      <View style={styles.header}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={[styles.headerContent]}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                 <Icon name='arrow-back' size={22}/>

            </TouchableOpacity>
           
            <Text style={styles.headerTitle}>Elite Sugar</Text>
            
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Choose Your Role</Text>
          <Text style={styles.welcomeDescription}>
            Join our exclusive community where meaningful connections are formed. 
            Select your role to begin your journey.
          </Text>
        </View>

        {/* Grid Layout for Roles ======================*/}
        <View style={styles.gridContainer}>
          {roles.map((role) => (
            <View key={role.id} style={styles.gridItem}>
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: role.image }} 
                    style={styles.cardImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  />
                  
                 
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Icon name={role.icon} size={24} color="#FFFFFF" />
                  </View>
                  
                  <View style={styles.imageTextContainer}>
                    <Text style={styles.cardTitle}>{role.title}</Text>
                    <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
                  </View>
                </View>

               
                <View style={styles.cardContent}>
                  <Text style={styles.cardDesc}>
                    {role.description}
                  </Text>

                 
                  <TouchableOpacity 
                    style={styles.cardButton}
                    onPress={() => handleRoleSelection(role.id)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={role.gradient}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.cardButtonText}>{role.buttonText}</Text>
                      <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* =============Disclaimer==================== */}
        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          All members are verified to ensure a safe and exclusive community.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background || '#F8FAFC',
  },
  header: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 0,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'flex-start',
    display:'flex',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center'
  },
  headerTitle: {
    color: Colors.textPrimary || '#1E293B',
    fontWeight: '800',
    fontSize: 24,
    marginLeft:20,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: Colors.textSecondary || '#64748B',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary || '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: Colors.textSecondary || '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridItem: {
    width: (width - 40) / 1, 
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.card || '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border || '#E2E8F0',
    height: 360, 
  },
  imageContainer: {
    height: 210,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardDesc: {
    color: Colors.textSecondary || '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    flex: 1,
  },
  cardButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginRight: 6,
    textAlign: 'center',
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textTertiary || '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginTop: 8,
  },
});