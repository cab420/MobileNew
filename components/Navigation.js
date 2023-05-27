import LoginScreen from "../screens/LoginScreen";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import SplashScreen from "../screens/SplashScreen";
import RecordHistoryScreen from "../screens/RecordHistory";
import ServerScreen from "../screens/ServerScreen";
import ScreenRecord from './ScreenRecord'
//import StreamScreen from "../screens/StreamScreen";
import ScreenShare from "./ScreenShare"
import FileReader from "./ScreenRecordHistory"

import React, {useContext} from "react";
import { AuthContextProvider, AuthContext } from "../context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

//const BASE_URL = "192.168.1.101:3002";

const globalScreenOptions = {
  headerStyle: {backgroundColor: "#2C6BED"},
  headerTitleStyle: {color: "white"},
  headerTintColor: "white",
}

// options={{headerShown: false}} // from under component of each screen
//<Stack.Screen name="ScreenShare" component={ScreenShare} /> put this back into navigation stack screen when rewady
const Navigation = () => {
    const { userInfo, splashLoading } = useContext(AuthContext);
    return (
  <NavigationContainer>
  <Stack.Navigator screenOptions={globalScreenOptions}>
      {userInfo.accessToken ? (
      <>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecordHistory" component={FileReader} />
        <Stack.Screen name="ScreenRecord" component={ScreenRecord} />

      </>
      ) : (
      <>
        

          {userInfo.email ? (
            <Stack.Screen
            name="Authenticator"
            component={AuthScreen}
            options={{headerShown: false}}
            />
          
          ) : (
            <>
            <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="ServerScreen" component={ServerScreen} />
            </>
          )}
        </>
      )}          
  </Stack.Navigator>
</NavigationContainer>    
);
};            
               


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3BC6D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Navigation;



//<Stack.Screen name="Login" component = {LoginScreen} />
//<Stack.Screen name="Authenticator" component = {AuthScreen} />
//<Stack.Screen name="Home" component = {HomeScreen} />