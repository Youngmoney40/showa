
import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colorscustom';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNav = ({ navigation, activeRoute }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.goBack()}
      >
        <View style={styles.iconContainer}>
          <View style={{justifyContent:'center', alignItems:'center',alignSelf:'center'}}>
             <Icon 
            name="home" 
            size={24} 
            color={activeRoute === 'SocialHome' ? colors.primary : '#fff'} 
          />
          <Text style={{color:'#fff', fontSize:10}}>Home</Text>
          </View>
         
          {activeRoute === 'SocialHome' }
    </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Discover')}
      >
        <View style={styles.iconContainer}>
          <View style={{justifyContent:'center', alignItems:'center',alignSelf:'center'}}>
            <Icon 
            name="search" 
            size={24} 
            color={activeRoute === 'Discover' ? colors.primary : '#fff'} 
          />
          <Text style={{color:'#fff', fontSize:10}}>Discover</Text>
          </View>
          {activeRoute === 'Discover' }
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => navigation.navigate('UploadshortVideo')}
        activeOpacity={0.7}
      >
        <View style={styles.uploadIconContainer}>
          <View style={styles.uploadIconBackground}>
            <Icon name="plus" size={28} color="#fff" style={styles.plusIcon} />
          </View>
          <View style={styles.uploadPulseEffect} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('BroadcastHome')}
      >
        <View style={styles.iconContainer}>
          <View style={{justifyContent:'center', alignItems:'center',alignSelf:'center',justifyContent:'center'}}>
             <MaterialCommunityIcons
                            name="broadcast" 
                            size={24}
                            color={activeRoute === 'BroadcastHome' ? colors.primary : '#fff'} 
                          />
          
          <Text style={{color:'#fff', fontSize:10}}>Broadcast</Text>
          </View>
          
          {activeRoute === 'BroadcastHome' }
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={()=>navigation.navigate('UserPersonalAccountProfile')}
        
      >
        <View style={styles.iconContainer}>
          <View style={{justifyContent:'center', alignItems:'center',alignSelf:'center'}}>
            <Ionicons 
            name="person-outline" 
            size={24} 
            color={activeRoute === 'UserProfile' ? colors.primary : '#fff'} 
          />
          <Text style={{color:'#fff', fontSize:10}}>Me</Text>
          </View>
          
          {activeRoute === 'UserProfile'}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingVertical: 0,
    borderTopWidth: 0.2,
    borderTopColor: 'rgba(255,255,255,0.15)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navItem: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  uploadButton: {
    position: 'relative',
    bottom: 10,
    marginHorizontal: 10,
  },
  uploadIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconBackground: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  plusIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadPulseEffect: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 132, 255, 0.3)',
    zIndex: 1,
  },
});

export default BottomNav;