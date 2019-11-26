import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default function CameraScreen() {

	
  return (
    <Camera style={styles.container}>

    </Camera>
  );
}

CameraScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
