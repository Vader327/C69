import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermisson: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal",
            scannedBookID: "",
            scannedStudentID: "",
        }
    }

    getCameraPermission=async(id)=>{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({scanned: false, buttonState: id, hasCameraPermisson: status === "granted"})
    }

    handleScanned=async({type, data})=>{
        this.setState({
            scanned: true,
            scannedData: data,
            buttonState: "normal",
        })
    }

    render(){
        const hasCameraPermisson = this.state.hasCameraPermisson;

        if(this.state.buttonState !== "normal" && hasCameraPermisson){
            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned ? undefined : this.handleScanned} />
            )
        }
        else if(this.state.buttonState == "normal"){
            return(
                <View>
                    <View>
                        <Image source={require('../assets/booklogo.jpg')} style={styles.img} />
                    </View>

                    <TextInput placeholder="Book ID" style={styles.input} value={this.state.scannedBookID}
                    onChangeText={(text)=>{this.setState({scannedBookID: text})}}
                    />

                    <TouchableOpacity style={styles.openScanner} onPress={()=>{this.getCameraPermission("bookID")}} >
                        <Text style={styles.buttonText}>Scan Book ID</Text>
                    </TouchableOpacity>

                    <Text style={{alignSelf: 'center', marginTop: 20,}}>
                        {hasCameraPermisson
                        ? this.state.scannedData
                        : "Please allow camera permission!"}
                    </Text>

                    <TextInput placeholder="Student ID" style={[styles.input, {marginTop: 50,}]} value={this.state.scannedStudentID}
                    onChangeText={(text)=>{this.setState({scannedStudentID: text})}}
                    />

                    <TouchableOpacity style={styles.openScanner} onPress={()=>{this.getCameraPermission("studentID")}} >
                        <Text style={styles.buttonText}>Scan Student ID</Text>
                    </TouchableOpacity>

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    openScanner:{
        backgroundColor: 'orange',
        width: 200,
        height: 40,
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText:{
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        alignSelf:'center',
    },
    input:{
        textAlign: 'center',
        width: 150,
        alignSelf: 'center',
        marginTop: 20,
        borderBottomColor: 'coral',
        borderBottomWidth: 2,
        fontSize: 18,
    },
    img:{
        width: 200,
        height: 200,
        alignSelf: 'center',
    }
})
