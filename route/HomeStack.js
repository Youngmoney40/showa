/* eslint-disable prettier/prettier */
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Register from '../screens/Register';
import Sign_in from '../screens/Sign_in';

const screens = {
    Sign_in: {
        screen: Sign_in
    },
    Home: {
        screen: Home
    },
    Register: {
        screen: Register
    },
      
};

const HomeStack = createStackNavigator(screens);
export default createAppContainer(HomeStack);
