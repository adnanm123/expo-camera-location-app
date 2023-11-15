import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ onNavigate }) => {
  const [darkTheme, setDarkTheme] = useState(true);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const dynamicStyles = getStyles(darkTheme);

  return (
    <View style={dynamicStyles.background}>
      <TouchableOpacity style={dynamicStyles.themeToggle} onPress={toggleTheme}>
        <Ionicons 
          name={darkTheme ? 'sunny-outline' : 'moon-outline'} 
          size={24} 
          color={darkTheme ? 'yellow' : 'blue'} 
        />
      </TouchableOpacity>
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.title}>My Camera App</Text>
        <Text style={dynamicStyles.subtitle}>Capture your moments</Text>
        <TouchableOpacity style={dynamicStyles.button} onPress={() => onNavigate('Camera')}>
          <Text style={dynamicStyles.buttonText}>Start Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (darkTheme) => StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: darkTheme ? '#333' : '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: darkTheme ? 'white' : '#333',
    textShadowColor: darkTheme ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: darkTheme ? 'white' : '#333',
    marginBottom: 20,
    textShadowColor: darkTheme ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: darkTheme ? '#ffd700' : '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: darkTheme ? '#000' : '#FFF',
    fontWeight: 'bold',
  },
  themeToggle: {
    position: 'absolute',
    top: 44,
    right: 16,
    backgroundColor: darkTheme ? '#333' : '#FFF',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10, 
  },
});

export default HomeScreen;
