import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useState, useContext} from 'react'
import { Button, Input, Image } from "react-native-elements";   
import {ImageBackground} from 'react-native'; // for background image    
import { AuthContext } from '../context/AuthContext';

//import Navigation from '../components/Navigation';

const AuthScreen = ({ navigation }) => {
  
  const localImage = require('../assets/greyscaleQPSlogo.png'); // for background image

  const {isLoading, mfaVerify, err, logout} = useContext(AuthContext);  
  const [token, setToken] = useState(null);
  
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ImageBackground source={localImage} style={styles.image}>

      <Text style = {styles.msg}>Please enter the code sent to the Authenticator App</Text>
      <TextInput style={styles.input}
        value={token}
        autoFocus={true}
        onChangeText={(text) => setToken(text)}
      ></TextInput>
      <Text>{err}</Text>
      <Button onPress={() => {
              mfaVerify(token);
              if (!isLoading) {
                if(err === null) {
                  //navigation.navigate("Authenticator")
                }
              }
            }}
            
            containerStyle={styles.button} title="Continue" />
            <Text></Text>
            <Button 
            onPress={() => {
              logout()
            }}
            containerStyle={styles.button} title= "Return to login" 
          />
            

      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen

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