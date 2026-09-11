import React, { useState, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View, Alert, Linking, Text, Image, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import WebView from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import { MaterialIcons } from '@expo/vector-icons'
import { useActionSheet } from '@expo/react-native-action-sheet'
import I18n from '../i18n/i18n'
import theme from '../theme'

const turtle = require('../assets/images/tinyTurtleBlue.png')

const MAP_URL = 'http://coastwards.org/map'
const COUNT_URL = 'http://coastwards.org/contribute/count'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	webview: {
		backgroundColor: theme.waterMap,
		flex: 1,
		alignSelf: 'stretch',
	},
	webviewInner: {
		flex: 1,
		alignSelf: 'stretch',
	},
	uploadButton: {
		backgroundColor: theme.primary,
		alignItems: 'center',
		justifyContent: 'center',
		width: 80,
		height: 80,
		borderRadius: 50,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11,
	},
	controlsTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 50,
		position: 'absolute',
		top: theme.safePadding,
		left: 0,
		paddingLeft: theme.padding,
		paddingRight: theme.padding,
	},
	controlsBottom: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 120,
		position: 'absolute',
		bottom: 0,
		left: 0,
		paddingLeft: theme.padding,
		paddingRight: theme.padding,
		backgroundColor: 'rgba(255,255,255,0)',
	},
	menuButton: {
		position: 'absolute',
		left: theme.padding,
	},
	logo: {},
	counterControl: {
		position: 'absolute',
		left: theme.padding,
		flexDirection: 'row',
		alignItems: 'center',
	},
	counter: {
		fontSize: 28,
		color: theme.primary,
		marginLeft: 5,
		flex: 1,
	},
	refreshIndicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
	},
})

const IMAGE_PICKER_OPTIONS = {
	mediaTypes: ['images'],
	allowsEditing: false,
	quality: 1,
	base64: false,
	exif: true,
}

const showOops = message => {
	const translatedErrorMessages = ['faces_detected', 'exifdata_empty', 'location_undefined_app']
	const msg = translatedErrorMessages.includes(message) ? I18n.t(message) : message

	Alert.alert(I18n.t('oops'), msg, [{ text: I18n.t('ok'), style: 'cancel' }], { cancelable: false })
}

const showPermissionMissing = msgKey => {
	Alert.alert(
		I18n.t('permissions_missing_title'),
		I18n.t(msgKey),
		[
			{
				text: I18n.t('ok'),
				style: 'cancel',
			},
			{
				text: I18n.t('open_settings'),
				onPress: () => {
					Linking.openSettings()
				},
				style: 'cancel',
			},
		],
		{ cancelable: false }
	)
}

const requirePermission = request => {
	return request().then(({ status }) => {
		if (status === 'granted') {
			return status
		}
		throw Error('denied')
	})
}

const shrink = uri => {
	return ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: false })
}

const firstAsset = result => {
	if (result.canceled || !result.assets || !result.assets[0]) {
		throw Error('cancelled')
	}
	return result.assets[0]
}

const MapScreen = ({ navigation }) => {
	const { showActionSheetWithOptions } = useActionSheet()

	const [counter, setCounter] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [showingActionSheet, setShowingActionSheet] = useState(false)
	const [validating, setValidating] = useState(false)

	const refreshMap = alertUser => {
		setRefreshing(true)
		fetch(COUNT_URL, { method: 'GET' })
			.then(response => response.json())
			.then(responseJson => {
				const newCount = responseJson.count
				if (newCount !== counter) {
					setCounter(newCount)
				} else if (alertUser) {
					Alert.alert(I18n.t('no_new_contributions_title'), I18n.t('no_new_contributions'), [{ text: I18n.t('ok'), style: 'cancel' }], { cancelable: false })
				}
				setRefreshing(false)
			})
			.catch(error => {
				setRefreshing(false)
				alert(error)
			})
	}

	useFocusEffect(
		useCallback(() => {
			refreshMap(false)
		}, [])
	)

	const goToUpload = params => {
		navigation.navigate('UploadFlow', { screen: 'Upload', params })
	}

	const takePicture = () => {
		const params = {}

		ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS)
			.then(firstAsset)
			.then(image => {
				setValidating(true)
				params.exif = image.exif || {}
				return shrink(image.uri)
			})
			.then(smallImage => {
				params.uri = smallImage.uri
				return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
			})
			.then(location => {
				params.location = location.coords // always in degrees
				params.source = 'appCamera'
				setValidating(false)
				goToUpload(params)
			})
			.catch(error => {
				setValidating(false)
				if (error.message !== 'cancelled') {
					showOops(error.message)
				}
			})
	}

	const pickImage = () => {
		const params = {}

		ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS)
			.then(firstAsset)
			.then(image => {
				// Decimal degrees (DD): 41.40338, 2.17403.
				// Positive latitude is above the equator (N), negative below (S).
				// Positive longitude is east of the prime meridian, negative west (W).
				setValidating(true)

				if (!image.exif) {
					throw Error('exifdata_empty') // Probably not a digital image
				}

				const { exif } = image

				if (!exif.GPSLatitude || !exif.GPSLongitude || !exif.GPSLatitudeRef || !exif.GPSLongitudeRef) {
					throw Error('location_undefined_app')
				}

				const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } = exif

				let lat = GPSLatitude
				let long = GPSLongitude

				if (GPSLatitudeRef === 'S' && GPSLatitude > 0) {
					lat = -lat
				}

				if (GPSLongitudeRef === 'W' && GPSLongitude > 0) {
					long = -long
				}

				params.location = { latitude: lat, longitude: long }
				params.exif = exif
				return shrink(image.uri)
			})
			.then(smallImage => {
				params.uri = smallImage.uri
				params.source = 'appLibrary'
				setValidating(false)
				goToUpload(params)
			})
			.catch(error => {
				setValidating(false)
				if (error.message !== 'cancelled') {
					showOops(error.message)
				}
			})
	}

	const fetchGotIt = onDismiss => {
		return AsyncStorage.getItem('GOTIT').then(value => {
			if (value === 'true') {
				onDismiss()
			} else {
				navigation.navigate('GuidelinesModal', { onDismiss })
			}
			return value
		})
	}

	const prepareCamera = () => {
		requirePermission(Location.requestForegroundPermissionsAsync)
			.then(() => requirePermission(ImagePicker.requestCameraPermissionsAsync))
			.then(() => fetchGotIt(takePicture))
			.catch(error => {
				if (error.message === 'denied') {
					showPermissionMissing('permissions_take_picture_missing_msg')
				} else {
					alert(error)
				}
			})
	}

	const preparePhotoLibrary = () => {
		requirePermission(ImagePicker.requestMediaLibraryPermissionsAsync)
			.then(() => fetchGotIt(pickImage))
			.catch(error => {
				if (error.message === 'denied') {
					showPermissionMissing('permissions_photo_library_missing_msg')
				} else {
					alert(error)
				}
			})
	}

	const showActionSheet = () => {
		setShowingActionSheet(true)

		const options = {
			options: [I18n.t('take_photo'), I18n.t('open_photo_library'), I18n.t('cancel')],
			cancelButtonIndex: 2,
			tintColor: theme.primary,
		}

		showActionSheetWithOptions(options, index => {
			setShowingActionSheet(false)
			if (index === 0) {
				prepareCamera()
			} else if (index === 1) {
				preparePhotoLibrary()
			}
		})
	}

	const mapUrl = `${MAP_URL}?id=${counter}`

	return (
		<View style={styles.safeAreaView}>
			<View style={styles.webview}>
				{counter !== false && (
					<WebView
						onShouldStartLoadWithRequest={req => {
							if (req.url === mapUrl) {
								return true
							}
							WebBrowser.openBrowserAsync(req.url)
							return false
						}}
						style={styles.webviewInner}
						source={{ uri: mapUrl }}
						geolocationEnabled
					/>
				)}
			</View>
			<View style={styles.controlsTop} pointerEvents="box-none">
				<TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
					<MaterialIcons name="menu" size={50} color={theme.primary} />
				</TouchableOpacity>
				<Image source={turtle} style={styles.logo} />
			</View>
			<View style={styles.controlsBottom} pointerEvents="box-none">
				{counter !== false && (
					<TouchableOpacity style={styles.counterControl} onPress={() => refreshMap(true)}>
						<View style={styles.refreshIndicator}>
							{!refreshing && <MaterialIcons name="refresh" size={40} color={theme.primary} />}
							{refreshing && <ActivityIndicator size="small" color={theme.primary} />}
						</View>
						<Text style={styles.counter}>{counter}</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity style={styles.uploadButton} disabled={showingActionSheet || validating} onPress={showActionSheet}>
					{!validating && <MaterialIcons name="add-a-photo" size={30} color="white" />}
					{validating && <ActivityIndicator size="large" color="white" />}
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default MapScreen
