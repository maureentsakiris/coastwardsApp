import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Dimensions, FlatList, ActivityIndicator } from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import DateTimePicker from '@react-native-community/datetimepicker'

import AssetPure from '../components/AssetPure'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width } = Dimensions.get('window')
const THUMBSIZE = width / theme.columnsLibrary

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		alignItems: 'center',
	},
	loading: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	continueView: {
		position: 'absolute',
		bottom: 30,
		backgroundColor: 'white',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	continue: {
		backgroundColor: theme.primary,
		padding: 20,

		borderRadius: 5,
		minWidth: '66%',
	},
	continueTxt: {
		color: 'white',
		fontSize: 21,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	fetching: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	datepicker: {
		width: '100%',
		// height: 300,
	},
})

const ImagePickerScreen = ({ navigation }) => {
	const isSafe = useRef(true)
	useEffect(() => {
		// Future proofing for double-invoking
		// effects in Strict Mode.
		isSafe.current = true
		pickImage()
		return () => {
			isSafe.current = false
		}
	}, [])

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		alert(result)

		if (!result.cancelled) {
			// this.setState({ image: result.uri })
		}
	}

	return <View style={styles.safeAreaView}></View>
}

export default ImagePickerScreen
