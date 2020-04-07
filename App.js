/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';


import Home from './Screens/Home/Home'
import BikeShop from './Screens/BikeShop/BikeShop'
import LandingScreen from './Screens/LandingScreen/LandingScreen'
import Login from './Screens/LandingScreen/Login/Login'
import Signup from './Screens/LandingScreen/Signup/Signup'
import Record from './Screens/Record/Record'
import Profile from './Screens/Profile/Profile'
import Notifications from './Screens/Notifications/Notifications'
import SaveActivity from './Screens/SaveActivity/SaveActivity'
import TrailInfo from './Screens/Home/TrailsInfo'
import RacesInfo from './Screens/Home/RacesInfo'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PushNotification from 'react-native-push-notification'

import { Icon } from 'native-base';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

global.globalUserID = ""
global.globalUserData = []
global.globalReloadData = ""



function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home';
          } else if (route.name === 'Record') {
            iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
          } else if (route.name === 'BikeShop') {
            iconName = focused ? 'md-bicycle' : 'md-bicycle';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-contact' : 'ios-contact';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} style={{ color: color }} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Record" component={Record} />
      <Tab.Screen name="BikeShop" component={BikeShop} />
      <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>
  )
}

function Stacks() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="SaveActivity" component={SaveActivity} />
      <Stack.Screen name="TrailInfo" component={TrailInfo} />
      <Stack.Screen name="RacesInfo" component={RacesInfo} />
    </Stack.Navigator>
  )
}



export default class App extends Component {

  async componentDidMount() {
    PushNotification.configure({
      // // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function (token) {
      //   console.log("TOKEN:", token);
      // },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

      },

      // // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: "YOUR GCM (OR FCM) SENDER ID",

      // // IOS ONLY (optional): default: all - Permissions to register.
      // permissions: {
      //   alert: true,
      //   badge: true,
      //   sound: true
      // },

      // Should the initial notification be popped automatically
      // default: true
      // popInitialNotification: true,

      // /**
      //  * (optional) default: true
      //  * - Specified if permissions (ios) and token (android and ios) will requested or not,
      //  * - if not, you must call PushNotificationsHandler.requestPermissions() later
      //  */
      // requestPermissions: true
    });
  }
  render() {
    return (
      <NavigationContainer>
        <Stacks />
      </NavigationContainer>
    );
  }
}
