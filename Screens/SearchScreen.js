import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SearchScreen extends React.Component{
    render(){
        return(
            <View style={{flex: 1,}}>
                <Text style={{fontSize: 20, fontWeight: '600'}}>Search</Text>
            </View>
        )
    }
}