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

