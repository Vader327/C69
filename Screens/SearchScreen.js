import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import db from '../config';

export default class SearchScreen extends React.Component{
	constructor(props){
		super(props);
		this.state={
			allTransactions: [],
			lastVisibleTransaction: null,
			search: '',
		}
	}
	
	fetchModeTransactions=async()=>{
		var text = this.state.search.toUpperCase();
		var enteredText = text.split("");

		if(enteredText[0].toUpperCase() === 'B'){
			const transaction = await db.collection('transactions').where('book_id', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
			transaction.docs.map(doc=>{
				this.setState({
					allTransactions: [...this.state.allTransactions, doc.data()],
					lastVisibleTransaction: doc
				})
			})
		}
		else if(enteredText[0].toUpperCase() === 'S'){
			const transaction = await db.collection('transactions').where('book_id', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
			transaction.docs.map(doc=>{
				this.setState({
					allTransactions: [...this.state.allTransactions, doc.data()],
					lastVisibleTransaction: doc
				})
			})
		}
	}

	searchTransactions=async(text)=>{
		var enteredText = text.split("");
		var text = text.toUpperCase();

		if(enteredText[0].toUpperCase() === 'B'){
			const transaction = await db.collection('transactions').where('book_id', '==', text).get();
			transaction.docs.map(doc=>{
				this.setState({
					allTransactions: [...this.state.allTransactions, doc.data()],
					lastVisibleTransaction: doc
				})
			})
		}
		else if(enteredText[0].toUpperCase() === 'S'){
			const transaction = await db.collection('transactions').where('student_id', '==', text).get();
			transaction.docs.map(doc=>{
				this.setState({
					allTransactions: [...this.state.allTransactions, doc.data()],
					lastVisibleTransaction: doc
				})
			})
		}
	}

	componentDidMount=async()=>{
		const query = await db.collection('transactions').limit(10).get();
		query.docs.map((doc)=>{
			this.setState({
				allTransactions: [...this.state.allTransactions, doc.data()],
				lastVisibleTransaction: doc
			})
		})
	}

	render(){
		return(
			<View>
				<View>
					<TextInput style={styles.searchBar} placeholder={"Enter Book/Student ID"} 
					onChangeText={(text)=>{this.setState({search:text})}} />

					<TouchableOpacity onPress={()=>{this.searchTransactions(this.state.search)}}
					style={styles.searchButton}>
						<Text style={{color:'#ffffff', fontWeight: '600'}}>Search</Text>
					</TouchableOpacity>
				</View>

				<FlatList
				data={this.state.allTransactions}
				renderItem={({item})=>(
					<View style={styles.container}>
						<Text>{"Book ID: " + item.book_id}</Text>
						<Text>{"Student ID: " + item.student_id}</Text>
						<Text>{"Transaction Type: " + item.type}</Text>
						<Text>{"Date: " + item.date.toDate()}</Text>
					</View>
				)}
				keyExtractor={(item, index)=>{return index.toString()}}
				onEndReached={this.fetchModeTransactions}
				onEndReachedThreshold={0.7} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		margin: 5,
		backgroundColor: 'lightgray',
		padding: 5,
		borderRadius: 8,
	},
	searchBar:{
		flexDirection: 'row',
		height: 40,
		width: 'auto',
		borderWidth: 0.5,
		alignItems: 'center',
		backgroundColor: 'lightgray',
		marginTop: 20,
		fontSize: 18,
		textAlign: 'center',
	},
	searchButton:{
		height: 30,
		width: 70,
		borderBottomRightRadius: 7,
		borderBottomLeftRadius: 7,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#66BB6A',
	}
})