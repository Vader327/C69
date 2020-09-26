import React from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
	constructor(){
		super();
		this.state={
			email: '',
			password: '',
		}
	}

	login=async(email, password)=>{
		if(email && password){
			try{
				const response = await firebase.auth().signInWithEmailAndPassword(email, password);
				if(response){
					this.props.navigation.navigate("Transaction");
				}
			}
			catch(error){
				console.log(error.code);
				switch(error.code){
					case 'auth/user-not-found':
						Alert.alert("User does not exist!");
						break;

					case 'auth/invalid-email':
						Alert.alert("Incorrect Email ID or Password!");
						break;
										
					default:
						Alert.alert("Error");
						break;
				}
			}			
		}
		else{
			Alert.alert("Please enter your Email ID and Password!");
		}
	}

	render() {
		return(
			<KeyboardAvoidingView behavior="padding" enabled>
				<View style={{marginTop: 150,}}>
					<TextInput 
					style={styles.inputBox}
					placeholder="Email ID"
					keyboardType="email-address"
					onChangeText={(text)=>{this.setState({email: text})}} />

					<TextInput 
					style={styles.inputBox}
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(text)=>{this.setState({password: text})}} />
				</View>

				<TouchableOpacity style={styles.submitButton}
				onPress={()=>{this.login(this.state.email, this.state.password)}}>
					<Text style={styles.submitText}>Login</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	inputBox:{
		width: 250,
		height: 40,
		borderWidth: 1.5,
		fontSize: 20,
		alignSelf: 'center',
		marginTop: 30,
		borderRadius: 6,
	},
	submitButton:{
		backgroundColor:"#66BB6A",
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: 120,
		padding: 10,
		borderRadius: 12,
		marginTop: 20,
	},
	submitText:{
		fontSize: 20,
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'white',
	},
});