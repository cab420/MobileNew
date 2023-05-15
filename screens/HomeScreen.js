import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, {useState, useContext} from 'react'
import { Button, Input, Image } from "react-native-elements";    
import { AuthContext } from '../context/AuthContext';
import {ImageBackground} from 'react-native'; // for background image
import ScreenRecord, {_handleOnRecording} from '../components/ScreenRecord'
import fileReader from '../components/ScreenRecordHistory';

const HomeScreen = ({ navigation }) => {
    const {isLoading, logout, userInfo} = useContext(AuthContext);
    const localImage = require('../assets/greyscaleQPSlogo.png'); // for background image
    
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground source={localImage} style={styles.image}>

          <Text style={styles.welcomeText}>Welcome {userInfo.name}</Text>
          <Text></Text>
          <Text></Text>
        
          <Button 
            onPress={() => {
              navigation.navigate("ScreenRecord")
            }}
            containerStyle={styles.button} title="Record Session" 
          />
        
          <Text></Text>
          <Button 
            onPress={() => {
              navigation.navigate("RecordHistory")
            }}
            containerStyle={styles.button} title= "Screen Records History" 
          />
        
          <Text></Text>
          <Button 
            onPress={() => {
              logout();
              //navigation.navigate("Login")
            }}
            containerStyle={styles.button} title="Logout" 
          />

            <Text></Text>

          </ImageBackground>

        
      </KeyboardAvoidingView>
    )
  }

export default HomeScreen

//style sheet for different things on home screen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    inputContainer: {
      width: 300,
    },
    button: {
      //width: 200,
      marginBottom: 20,
    },
    
    welcomeText: { //format the text at top of page to welcome user
      fontSize: 20,
      fontWeight: "bold",
      textAlign: 'center',
      //height: 100,
    },
    
    image: { // the background image
      //flex: 1,
      justifyContent: 'center',
      resizeMode: 'contain',
      height: 300,
      width: 250,
    }

  });