import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = ({ onBack }) => {
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
        setType(prevType => prevType === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true, skipProcessing: true };
            const photo = await cameraRef.current.takePictureAsync(options);
            setCapturedImage(photo);
            if (hasMediaLibraryPermission) {
                const asset = await MediaLibrary.createAssetAsync(photo.uri);
                await MediaLibrary.createAlbumAsync('MyApp', asset, false);
                Alert.alert('Saved', 'Photo saved to camera roll!');
                setTimeout(() => setCapturedImage(null), 5000);
            } else {
                Alert.alert('Error', 'Camera roll permission is not granted');
            }
        }
    };

    if (hasCameraPermission === null || hasMediaLibraryPermission === null || hasLocationPermission === null) {
        return <View style={styles.container} />;
    }

    if (hasCameraPermission === false || hasMediaLibraryPermission === false || hasLocationPermission === false) {
        return <View style={styles.container}><Text style={styles.errorText}>No access to camera or media library.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Camera ref={cameraRef} style={styles.camera} type={type}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.closeButton} onPress={onBack}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                        <Ionicons name="camera-reverse-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <Ionicons name="camera-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
            {capturedImage && (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    flipButton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
    },
    captureButton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    previewContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    previewImage: {
        width: 100,
        height: 100,
    },
    errorText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CameraScreen;
