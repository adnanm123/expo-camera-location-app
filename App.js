import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraPermStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermStatus.status === 'granted');

      const mediaLibraryPermStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermStatus.status === 'granted');

      const locationPermStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationPermStatus.status === 'granted');
    })();
  }, []);

  const flipCamera = () => {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        setCapturedImage(photo);

        if (hasMediaLibraryPermission) {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          await MediaLibrary.createAlbumAsync('MyApp', asset, false);
          Alert.alert('Saved', 'Photo saved to camera roll!');
          
          // Clear the image after 5 seconds
          setTimeout(() => {
            setCapturedImage(null);
          }, 5000);

        } else {
          Alert.alert('Error', 'Camera roll permission is not granted');
        }
      } catch (error) {
        console.error("Error taking picture", error);
      }
    }
  };

  if (hasCameraPermission === null || hasMediaLibraryPermission === null || hasLocationPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasCameraPermission === false || hasMediaLibraryPermission === false || hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera, media library, or location</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <Button title="Flip Image" onPress={flipCamera} />
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      </Camera>
      {capturedImage && (
        <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    position: 'absolute',
    bottom: 100, // Raise the button container to avoid overlapping with the image
  },
  previewImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 10, // Position the preview image at the very bottom
    left: 10,
  },
});
