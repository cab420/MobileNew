import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useState, useRef} from 'react'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
import TextInputContainer from '../components/TextInputContainer';
import ScreenShare from '../components/ScreenShare';


const StreamScreen = ({ navigation }) => {
  
  const localImage = require('../assets/greyscaleQPSlogo.png'); // for background image
  const otherUserId = useRef(null);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ImageBackground source={localImage} style={styles.image}>


        <Text style = {styles.msg}>SHARE TEST</Text>
        <Text></Text>
        <Text></Text>
        <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId.current}
                setValue={text => {
                  otherUserId.current = text;
                  console.log('TEST', otherUserId.current);
                }}
                keyboardType={'number-pad'}
              />
          <Button 
            onPress={() => {
              navigation.navigate("RecordHistory")
              //startRecording();
            }}
            containerStyle={styles.button} title= "Begin Share" 
          />
        <Button onPress={() => navigation.navigate("Home")} 
          containerStyle={styles.button} title="Return Home" />
        
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default StreamScreen

//style sheet for different things on record history screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
    //flex: null,
  },
  button: {
    //width: 300,
    marginBottom: 20,
  },
  //input: {
    //height: 40,
    //margin: 12,
    //borderWidth: 1,
    //padding: 10,
  //},
  msg: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    //height: 100,
  },

  image: { // the background image
    //flex: 1,
    justifyContent: 'center',
    resizeMode: 'contain',
    height: 300,
    height: 300,
    width: 250,
  }

});