import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import Navigation from './components/Navigation';
import { AuthContextProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthContextProvider>      
      <Navigation />
    </AuthContextProvider>
  );
};

export default App;

//when you clone this, open a terminal and make sure your in this folder example C:\User\GitHub\HAZH-Mobile"
//then type: npm install
//this will download all the packages and libraries for this
//then in your phone, go to app store and download "Expo Go"
//once thats done, in the terminal here type: npm start
//a QR code should come up
//scan QR code with your phone to see the app on your phone
//when it crashes, hold three fingers on the screen and click reload from the menu that pops up

//watch this vid ive linked the current time, he explains hwo to set up expo and how it works on iOS and android, basically all the stuff i just said above
//https://youtu.be/VozPNrt-LfE?t=1567

//this other video is what im using to create the login and register functions and how they look
//https://youtu.be/AkEnidfZnCU?t=41594

//asdasd
// :)
// hello

//test
//stuff to install if you need to. but, the npm install command should just grab it all

//npm install @react-navigation/native-stack
//npx expo install react-native-screens react-native-safe-area-context
//npm install @react-navigation/native   
//npx expo install react-native-gesture-handler
//npx expo install react-native-reanimated@~2.14.4
//npm install react-native-elements