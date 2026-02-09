import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ContactProfile = ({navigation}) => {
     const redirectToHomeChat =()=>{
    navigation.navigate('PHome');
  }
  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
                <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={redirectToHomeChat}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => {/* open menu */}}>
          <Icon name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/dad.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.contactName}>Cindy</Text>
        <Text style={styles.contactPhone}>+1 484-838-342</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <ActionItem icon="chatbubble-outline" label="Message" onPress={() => {}} />
        <ActionItem icon="call-outline" label="Call" onPress={() => {}} />
        <ActionItem icon="volume-mute-outline" label="Mute" onPress={() => {}} />
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {[
          'View Media',
          'Settings',
          'Notifications',
          'Share Contact',
          'Block Contact',
        ].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}

          onPress={()=>{

              if (item === 'Settings') {
                navigation.navigate('Settings')
              } else if(item === 'Notifications') {
                navigation.navigate('Settings')
              }else{
                navigation.navigate('Settings')
              }

          }}
          
          >
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    </ScrollView>
  );
};

const ActionItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 130,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  contactName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#0d64dd',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ContactProfile;
