
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import Iconn from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

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
    navigation.navigate('Analysis');
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "home" && styles.activeNavItem]}
          onPress={() => handleNavigation("home", "AiHome")}
        >
          <Icon 
            name="home" 
            size={24} 
            color={activeTab === "home" ? "#39FF14" : "#999"} 
          />
          <Text style={[
            styles.navText,
            activeTab === "home" && styles.activeNavText
          ]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "foryou" && styles.activeNavItem]}
          onPress={() => handleNavigation("foryou", "ForYou")}
        >
          <Icon
            name="explore" 
            size={24} 
            color={activeTab === "foryou" ? "#39FF14" : "#999"} 
          />
          <Text style={[
            styles.navText,
            activeTab === "foryou" && styles.activeNavText
          ]}>For You</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "favorite" && styles.activeNavItem]}
          onPress={() => handleNavigation("favorite", "Favorite")}
        >
          <Icon 
            name="star" 
            size={24} 
            color={activeTab === "favorite" ? "#39FF14" : "#999"} 
          />
          <Text style={[
            styles.navText,
            activeTab === "favorite" && styles.activeNavText
          ]}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "favorite" && styles.activeNavItem]}
          onPress={() => handleNavigation("favorite", "AiPools")}
        >
          <Icon 
            name="people" 
            size={24} 
            color={activeTab === "favorite" ? "#39FF14" : "#999"} 
          />
          <Text style={[
            styles.navText,
            activeTab === "favorite" && styles.activeNavText
          ]}>Pool</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "account" && styles.activeNavItem]}
          onPress={() => handleNavigation("account", "AiAccount")}
        >
          <Icon 
            name="person" 
            size={24} 
            color={activeTab === "history" ? "#39FF14" : "#999"} 
          />
          <Text style={[
            styles.navText,
            activeTab === "history" && styles.activeNavText
          ]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 10,
    
    borderTopColor: '#24ad0cff',
    shadowColor: "#24ad0cff",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flex: 1,
    marginBottom: 5,
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#39FF14',
    fontWeight: 'bold',
  },
  mainActionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    flex: 1,
    maxWidth: 70,
  },
  mainAction: {
    shadowColor: "#39FF14",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  mainActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  mainActionText: {
    fontSize: 11,
    color: '#39FF14',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default BottomNav;