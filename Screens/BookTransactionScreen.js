import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
        }
    }

    getCameraPermission=async()=>{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({scanned: false, buttonState: "clicked", hasCameraPermisson: status === "granted"})
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

        if(this.state.buttonState == "clicked" && hasCameraPermisson){
            return(
                <View>
                    <BarCodeScanner onBarCodeScanned={this.state.scanned ? undefined : this.handleScanned} />
                </View>
            )
        }
        else if(this.state.buttonState == "normal"){
            return(
                <View>
                    <TouchableOpacity style={styles.openScanner} onPress={this.getCameraPermission} >
                        <Text style={styles.buttonText}>Scan QR Code</Text>
                    </TouchableOpacity>

                    <Text style={{alignSelf: 'center', marginTop: 20,}}>
                        {hasCameraPermisson
                        ? this.state.scannedData
                        : "Please allow camera permission!"}
                    </Text>
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
        marginTop: 250,
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText:{
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        alignSelf:'center',
    }
})
