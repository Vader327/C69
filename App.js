import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SearchScreen from './Screens/SearchScreen';
import BookTransactionScreen from './Screens/BookTransactionScreen';
import LoginScreen from './Screens/LoginScreen';

const tabNavigator = createBottomTabNavigator({
  Transaction: {screen: BookTransactionScreen},
  Search: {screen: SearchScreen}
},
{
  defaultNavigationOptions: ({navigation})=>({tabBarIcon: ()=>{
    const routeName = navigation.state.routeName;

    if(routeName == 'Transaction'){
      return (<Image source={require('./assets/book.png')} style={{width: 30, height: 30}} />)
    }
    else if(routeName == 'Search'){
      return (<Image source={require('./assets/searchingbook.png')} style={{width: 30, height: 30}} />)
    }
  }})
})

const switchNavigator = createSwitchNavigator({
  Login: {screen: LoginScreen},
  "Tab Navigator": {screen: tabNavigator},
})

const AppContainer = createAppContainer(switchNavigator);

export default class App extends React.Component {
  render(){
    return (
      <AppContainer />
    );
  }
}