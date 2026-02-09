import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import Iconn from 'react-native-vector-icons/Ionicons';

const BottomNav = ({ activeTab, setActiveTab, scaleAnim, navigation }) => {
  

  const defaultScaleAnim = React.useRef(new Animated.Value(1)).current;
  const animValue = scaleAnim || defaultScaleAnim;

  const handleNavigation = (tabName, screenName) => {
    setActiveTab(tabName);
    if (screenName && navigation) {
      navigation.navigate(screenName);
    }
  };

  const handleMainAction = () => {
   
    navigation.navigate('ExploreFeatures');
    
    
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === "discover" && styles.activeNavItem]}
        onPress={() => handleNavigation("discover", "CDashboard")}
      >
        <Icon 
          name="explore" 
          size={24} 
          color={activeTab === "discover" ? "#FF3366" : "#999"} 
        />
        <Text style={[
          styles.navText,
          activeTab === "discover" && styles.activeNavText
        ]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === "matches" && styles.activeNavItem]}
        onPress={() => handleNavigation("matches", "WalletDashboard")}
      >
        <Iconn
          name="wallet" 
          size={24} 
          color={activeTab === "matches" ? "#FF3366" : "#999"} 
        />
        <Text style={[
          styles.navText,
          activeTab === "matches" && styles.activeNavText
        ]}>Wallet</Text>
      </TouchableOpacity>
      
      <Animated.View style={{ transform: [{ scale: animValue }] }}>
        <TouchableOpacity 
          style={styles.mainAction}
          onPress={handleMainAction}
        >
          <LinearGradient
            colors={["#FF3366", "#FF6F00"]}
            style={styles.mainActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="add" size={30} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === "messages" && styles.activeNavItem]}
        onPress={() => handleNavigation("messages", "CSettings")}
      >
        <Icon 
          name="settings" 
          size={24} 
          color={activeTab === "messages" ? "#FF3366" : "#999"} 
        />
        <Text style={[
          styles.navText,
          activeTab === "messages" && styles.activeNavText
        ]}>settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === "profile" && styles.activeNavItem]}
        onPress={() => handleNavigation("profile", "Profile")}
      >
        <Icon 
          name="person" 
          size={24} 
          color={activeTab === "profile" ? "#FF3366" : "#999"} 
        />
        <Text style={[
          styles.navText,
          activeTab === "profile" && styles.activeNavText
        ]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },
  activeNavItem: {
    
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavText: {
    color: '#FF3366',
    fontWeight: 'bold',
  },
  mainAction: {
    marginBottom: 25,
    shadowColor: "#FF3366",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  mainActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomNav;