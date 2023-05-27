import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useState, useContext} from 'react'
import { Button, Input, Image } from "react-native-elements";   
import {ImageBackground} from 'react-native'; // for background image    
import { AuthContext } from '../context/AuthContext';
import * as RNFS from 'react-native-fs';

const ServerScreen = ({ navigation }) => {
  
  const localImage = require('../assets/greyscaleQPSlogo.png'); // for background image

  const {isLoading, mfaVerify, err} = useContext(AuthContext);  
  const [ip, setIp] = useState(null);
  
  const saveIp = ((ipinput) => {

     var path = RNFS.DocumentDirectoryPath  + '/ipconfig.txt';
     console.log(path);
     //`${ipinput}`
     RNFS.writeFile(path, `${ipinput}`)
    .then((success) => {
    console.log('FILE WRITTEN!');
    })
    .catch((err) => {
    console.log(err.message);
    });
})

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ImageBackground source={localImage} style={styles.image}>

      <Text style = {styles.msg}>Please enter the servers IP address</Text>
      <TextInput style={styles.input}
        value={ip}
        autoFocus={true}
        onChangeText={(text) => setIp(text)}
      ></TextInput>
      <Text>{err}</Text>

      <Button onPress={() => {
              saveIp(ip);
            }}
            containerStyle={styles.button} title="Set" />
            <Button onPress={() => {

                  navigation.navigate("Login")

            }}
            containerStyle={styles.button} title="Back to Login" />

      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default ServerScreen

//style sheet for different things on auth screen
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
    //width: 300,
    marginTop: 30,
  },
  logo: {
    width:200,
    height: 250
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  msg: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    height: 100,
  },

  image: { // the background image
    //flex: 1,
    justifyContent: 'center',
    resizeMode: 'contain',
    height: 300,
    width: 250,
  }
});