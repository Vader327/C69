import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SearchScreen from './Screens/SearchScreen';
import BookTransactionScreen from './Screens/BookTransactionScreen';

const tabNavigator = createBottomTabNavigator({
  Transaction: {screen: BookTransactionScreen},
  Search: {screen: SearchScreen}
})

const AppContainer = createAppContainer(tabNavigator);

export default class App extends React.Component {
  render(){
    return (
      <AppContainer />
    );
  }
}

const styles = StyleSheet.create({
});
