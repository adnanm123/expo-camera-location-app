import React, { useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import HomeScreen from './screens/home-screen';
import CameraScreen from './screens/camera-screen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <NativeBaseProvider>
      {currentScreen === 'Home' && 
        <HomeScreen onNavigate={() => handleNavigate('Camera')} />}
      {currentScreen === 'Camera' && 
        <CameraScreen onBack={() => handleNavigate('Home')} />}
    </NativeBaseProvider>
  );
}
