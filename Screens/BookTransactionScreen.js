import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import * as firebase from 'firebase';
import db from '../config';

export default class BookTransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal',
        transactionMessage: "",
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      } 
    }

    initiateBookIssue=async()=>{
      db.collection('transactions').add({
        'book_id': this.state.scannedBookId,
        'student_id': this.state.scannedStudentId,
        'type': 'issue',
        'date': firebase.firestore.Timestamp.now().toDate(),
      })

      db.collection('books').doc(this.state.scannedBookId).update({
        'book_availability': false,
      })

      db.collection('students').doc(this.state.scannedStudentId).update({
        'books_issued': firebase.firestore.FieldValue.increment(1),
      })

      this.setState({scannedBookId:'', scannedStudentId:''});
    }

    initiateBookReturn=async()=>{
      db.collection('transactions').add({
        'book_id': this.state.scannedBookId,
        'student_id': this.state.scannedStudentId,
        'type': 'return',
        'date': firebase.firestore.Timestamp.now().toDate(),
      })

      db.collection('books').doc(this.state.scannedBookId).update({
        'book_availability': true,
      })

      db.collection('students').doc(this.state.scannedStudentId).update({
        'books_issued': firebase.firestore.FieldValue.increment(-1),
      })

      this.setState({scannedBookId:'', scannedStudentId:''});
    }

    handleTransaction=async()=>{      
      var transactionType = await this.checkBookEligibility();

      if(!transactionType){
        Alert.alert("Book does not exist in the library!");
        this.setState({scannedBookId:'', scannedStudentId:''});
      }
      else if(transactionType == 'issue'){
        var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
        if(isStudentEligible){
          this.initiateBookIssue();
          Alert.alert("Book Issued!");
        }
      }
      else{
        var isStudentEligible = await this.checkStudentEligibilityForBookReturn();
        if(isStudentEligible){
          this.initiateBookReturn();
          Alert.alert("Book Returned!");
        }
      }
    }

    checkBookEligibility=async()=>{
      const bookRef = await db.collection('books').where('book_id', '==', this.state.scannedBookId).get();
      var transactionType = '';

      if(bookRef.docs.length == 0){
        transactionType = false;
      }
      else{
        bookRef.docs.map(doc=>{
          if(doc.data().book_availability){
            transactionType = 'issue';
          }
          else{
            transactionType = 'return';
          }
        });
      }

      return transactionType;
    }

    checkStudentEligibilityForBookIssue=async()=>{
      const studentRef = await db.collection('students').where('student_id', '==', this.state.scannedStudentId).get();
      var isStudentEligible = null;

      if(studentRef.docs.length == 0){
        isStudentEligible = false;
        this.setState({scannedBookId:'', scannedStudentId:''});
        Alert.alert("Student does not exist in the database!");
      }
      else{
        studentRef.docs.map(doc=>{
          if(doc.data().books_issued < 2){
            isStudentEligible = true;
          }
          else{
            isStudentEligible = false;
            this.setState({scannedBookId:'', scannedStudentId:''});
            Alert.alert("Student has reached maximum book issue limit!");
          }
        });
      }

      return isStudentEligible;
    }

    checkStudentEligibilityForBookReturn=async()=>{
      const transactionRef = await db.collection('transactions').where('book_id', '==', this.state.scannedBookId).limit(1).get();
      var isStudentEligible = null;

      transactionRef.docs.map(doc=>{
        if(doc.data().student_id == this.state.scannedStudentId){
          isStudentEligible = true;
        }
        else{
          isStudentEligible = false;
          this.setState({scannedBookId:'', scannedStudentId:''});
          Alert.alert("Book was not issued to this student!");
        }
      })

      return isStudentEligible;
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <View>
            <StatusBar style='auto' />
              <Image
                source={require("../assets/booklogo.jpg")}
                style={{width:200, height: 200}}/>
              <Text style={{textAlign: 'center', fontSize: 30}}>Wily</Text>
            </View>
			
            <View style={styles.inputView}>
              <TextInput 
                style={styles.inputBox}
                placeholder="Book Id"
                value={this.state.scannedBookId}
                onChangeText={(text)=>{this.setState({scannedBookId: text})}} />
              <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>{
                  this.getCameraPermissions("BookId")
                }}>
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputView}>
              <TextInput 
                style={styles.inputBox}
                placeholder="Student Id"
                value={this.state.scannedStudentId}
                onChangeText={(text)=>{this.setState({scannedStudentId: text})}} />
              <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>{
                  this.getCameraPermissions("StudentId")
                }}>
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton}
            onPress={this.handleTransaction}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>          
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      color: '#ffffff',
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButton:{
      backgroundColor:"#66BB6A",
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      padding: 10,
      borderRadius: 12,
    },
    submitText:{
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
    }
  });