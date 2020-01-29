import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, Alert, Linking, Text, Image, ActivityIndicator, AsyncStorage } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import WebView from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import * as Permissions from 'expo-permissions'

import * as IntentLauncher from 'expo-intent-launcher'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator'

import { MaterialIcons } from '@expo/vector-icons'
import { useActionSheet } from '@expo/react-native-action-sheet'
import I18n from '../i18n/i18n'
import theme from '../theme'

import turtle from '../assets/images/tinyTurtleBlue.png'

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
	buttonText: {
		fontSize: 20,
		color: 'white',
	},
	controlsTop: {
		display: 'flex',
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
		display: 'flex',
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
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	counter: {
		fontSize: 28,
		color: theme.primary,
		marginLeft: 5,
		flex: 1,
	},
	bottomLeft: {
		position: 'absolute',
		left: theme.padding,
		bottom: theme.safePadding,
	},
	refreshIndicator: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
	},
})

const MapScreen = ({ navigation }) => {
	const { showActionSheetWithOptions } = useActionSheet()

	const [counter, setCounter] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [showingActionSheet, setShowingActionSheet] = useState(false)
	const [validating, setValidating] = useState(false)

	const refreshMap = alertUser => {
		setRefreshing(true)
		fetch('http://coastwards.org/contribute/count', {
			method: 'GET',
		})
			.then(response => response.json())
			.then(responseJson => {
				const newCount = responseJson.count
				if (newCount !== counter) {
					setCounter(responseJson.count)
				} else if (newCount === responseJson.count && alertUser) {
					Alert.alert(
						I18n.t('no_new_contributions_title'),
						I18n.t('no_new_contributions'),
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
						],
						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
				}
				setRefreshing(false)
			})
			.catch(error => {
				setRefreshing(false)
				alert(error)
			})
	}

	useEffect(() => {
		// Future proofing for double-invoking
		// effects in Strict Mode.
		refreshMap(false)
	}, [])

	const checkForFaces = imageOrPic => {
		return new Promise((resolve, reject) => {
			const options = {
				mode: FaceDetector.Constants.Mode.fast,
				detectLandmarks: FaceDetector.Constants.Landmarks.none,
				runClassifications: FaceDetector.Constants.Classifications.none,
			}

			const { uri } = imageOrPic

			FaceDetector.detectFacesAsync(uri, options)
				.then(value => {
					if (value.faces.length > 0) {
						reject(Error('faces_detected'))
					}
					resolve(imageOrPic)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const takePicture = () => {
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
			base64: false,
			exif: true,
		}

		const params = {}

		ImagePicker.launchCameraAsync(options)
			.then(result => {
				const { cancelled } = result
				if (!cancelled) {
					return result
				}
				throw Error('cancelled')
			})
			.then(image => {
				setValidating(true)
				const { exif } = image
				params.exif = exif
				return image
			})
			.then(image => {
				const { uri } = image
				return ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: false })
			})
			.then(smallImage => {
				const { uri } = smallImage
				params.uri = uri
				return checkForFaces(smallImage)
			})
			.then(() => {
				return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
			})
			.then(location => {
				const { coords } = location
				params.location = coords
				return location
			})
			.then(() => {
				navigation.navigate({ routeName: 'Upload', params })
				setValidating(false)
			})
			.catch(error => {
				setValidating(false)
				const { message } = error
				if (message !== 'cancelled') {
					const translatedErrorMessages = ['faces_detected']
					const msg = translatedErrorMessages.includes(message) ? I18n.t(message) : message

					Alert.alert(
						I18n.t('oops'),
						msg,
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
						],

						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
				}
			})
	}

	const pickImage = () => {
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			allowsMultipleSelection: true,
			aspect: [1, 1],
			quality: 1,
			base64: false,
			exif: true,
		}

		const params = {}

		ImagePicker.launchImageLibraryAsync(options)
			.then(result => {
				const { cancelled } = result
				if (cancelled) {
					throw Error('cancelled')
				}
				return result
			})
			.then(image => {
				setValidating(true)

				if (!image.exif) {
					throw Error('exifdata_empty')
				}

				const { exif } = image
				if (!exif.GPSLatitude || !exif.GPSLongitude) {
					throw Error('location_undefined_app')
				}

				const { GPSLatitude, GPSLongitude } = exif
				params.location = { latitude: GPSLatitude, longitude: GPSLongitude }
				params.exif = exif
				const { uri } = image
				return ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: false })
			})

			.then(smallImage => {
				const { uri } = smallImage
				params.uri = uri
				return checkForFaces(smallImage)
			})
			.then(image => {
				setValidating(false)
				navigation.navigate({ routeName: 'Upload', params })
				return image
			})
			.catch(error => {
				setValidating(false)
				const { message } = error
				if (message !== 'cancelled') {
					const translatedErrorMessages = ['faces_detected', 'exifdata_empty', 'location_undefined_app']
					const msg = translatedErrorMessages.includes(message) ? I18n.t(message) : message

					Alert.alert(
						I18n.t('oops'),
						msg,
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
						],

						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
				}
			})
	}

	const fetchGotIt = onDismiss => {
		return new Promise((resolve, reject) => {
			const params = {}
			params.onDismiss = onDismiss

			AsyncStorage.getItem('GOTIT')
				.then(value => {
					switch (value) {
						case null:
							navigation.navigate({ routeName: 'GuidelinesModal', params })
							break
						case 'false':
							navigation.navigate({ routeName: 'GuidelinesModal', params })
							break
						case 'true':
							onDismiss()
							break
						default:
							reject(value)
							break
					}

					return value
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const checkLocationPermission = () => {
		return new Promise((resolve, reject) => {
			Permissions.askAsync(Permissions.LOCATION)
				.then(results => {
					const { status } = results
					switch (status) {
						case 'granted':
							resolve(status)
							break
						case 'denied':
							reject(status)
							break
						default:
							reject(status)
							break
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const checkCameraPermission = () => {
		return new Promise((resolve, reject) => {
			Permissions.askAsync(Permissions.CAMERA)
				.then(results => {
					const { status } = results
					switch (status) {
						case 'granted':
							resolve(status)
							break
						case 'denied':
							reject(status)
							break
						default:
							reject(status)
							break
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const launchCamera = () => {
		//  iOS is not working with this permission being not individually,
		checkLocationPermission()
			.then(() => {
				// granted
				return checkCameraPermission()
			})
			.then(() => {
				// granted
				return fetchGotIt(takePicture)
			})
			.catch(error => {
				if (error === 'denied') {
					Alert.alert(
						I18n.t('permissions_missing_title'),
						I18n.t('permissions_take_picture_missing_msg'),
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
							{
								text: I18n.t('open_settings'),
								onPress: () => {
									if (Platform.OS === 'ios') {
										Linking.openURL('app-settings:')
									} else {
										// IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
										IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
									}
								},
								style: 'cancel',
							},
						],
						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
				} else {
					alert(error)
				}
			})
	}

	const checkPhotoLibraryPermissions = () => {
		return new Promise((resolve, reject) => {
			Permissions.askAsync(Permissions.CAMERA_ROLL)
				.then(results => {
					const { status } = results
					switch (status) {
						case 'granted':
							resolve(status)
							break
						case 'denied':
							reject(status)
							break
						default:
							reject(status)
							break
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const launchPhotoLibrary = () => {
		checkPhotoLibraryPermissions()
			.then(() => {
				// granted
				return fetchGotIt(pickImage)
			})
			.catch(error => {
				if (error === 'denied') {
					Alert.alert(
						I18n.t('permissions_missing_title'),
						I18n.t('permissions_photo_library_missing_msg'),
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
							{
								text: I18n.t('open_settings'),
								onPress: () => {
									if (Platform.OS === 'ios') {
										Linking.openURL('app-settings:')
									} else {
										// IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
										IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
									}
								},
								style: 'cancel',
							},
						],
						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
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
				// CAMERA
				launchCamera()
			} else if (index === 1) {
				// PHOTO LIBRARY
				launchPhotoLibrary()
			}
		})
	}

	return (
		<View style={styles.safeAreaView}>
			<NavigationEvents onWillFocus={() => refreshMap(false)} />
			<View style={styles.webview}>
				{counter && (
					<WebView
						onShouldStartLoadWithRequest={req => {
							if (req.url === `http://coastwards.org/map?id=${counter}`) {
								return true
							}
							WebBrowser.openBrowserAsync(req.url)
							return false
						}}
						style={styles.webviewInner}
						source={{ uri: `http://coastwards.org/map?id=${counter}` }}
						useWebKit
					/>
				)}
			</View>
			<View style={styles.controlsTop} pointerEvents="box-none">
				<TouchableOpacity style={styles.menuButton}>
					<MaterialIcons
						name="menu"
						size={50}
						color={theme.primary}
						onPress={() => {
							navigation.openDrawer()
						}}
					/>
				</TouchableOpacity>
				<Image source={turtle} style={styles.logo} />
			</View>
			<View style={styles.controlsBottom} pointerEvents="box-none">
				{counter && (
					<TouchableOpacity
						style={styles.counterControl}
						onPress={() => {
							refreshMap(true)
						}}
					>
						<View style={styles.refreshIndicator}>
							{!refreshing && <MaterialIcons name="refresh" size={40} color={theme.primary} />}
							{refreshing && <ActivityIndicator size="small" color={theme.primary} />}
						</View>
						<Text style={styles.counter}>{counter}</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity style={styles.uploadButton} disabled={showingActionSheet}>
					{!validating && (
						<MaterialIcons
							name="add-a-photo"
							size={30}
							color="white"
							onPress={() => {
								showActionSheet()
							}}
						/>
					)}
					{validating && <ActivityIndicator size="large" color="white" />}
				</TouchableOpacity>
			</View>
		</View>
	)
}

MapScreen.navigationOptions = {
	title: 'Home',
	headerStyle: {
		backgroundColor: '#f4511e',
	},
}

export default MapScreen
