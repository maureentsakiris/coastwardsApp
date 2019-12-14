import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, SafeAreaView, Alert, Linking, AsyncStorage } from 'react-native'

import WebView from 'react-native-webview'
import * as Permissions from 'expo-permissions'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

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
		position: 'absolute',
		bottom: theme.safePadding,
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
	menuButton: {
		position: 'absolute',
		top: theme.safePadding,
		left: theme.padding,
	},
})

const MapScreen = ({ navigation }) => {
	const checkLocationServicesPermission = () => {
		return new Promise((resolve, reject) => {
			Location.hasServicesEnabledAsync()
				.then(status => {
					switch (status) {
						case true:
							resolve(status)
							break
						case false:
							resolve(status)
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
	const checkLocationPermission = () => {
		return new Promise((resolve, reject) => {
			const askLocationPermission = async () => {
				const { status } = await Permissions.askAsync(Permissions.LOCATION)
				return status
			}

			askLocationPermission()
				.then(status => {
					switch (status) {
						case 'granted':
							resolve(status)
							break
						case 'denied':
							resolve(status)
							break
						case 'undetermined':
							resolve(status)
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
			const askCameraPermission = async () => {
				const { status } = await Permissions.askAsync(Permissions.CAMERA)
				return status
			}

			askCameraPermission()
				.then(status => {
					switch (status) {
						case 'granted':
							resolve(status)
							break
						case 'denied':
							resolve(status)
							break
						case 'undetermined':
							resolve(status)
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
	/*
	const fetchGotItStorage = () => {
		return new Promise((resolve, reject) => {
			async function fetchGotIt() {
				return AsyncStorage.getItem('GOTIT')
			}

			fetchGotIt()
				.then(status => {
					let val
					switch (status) {
						case null:
							resolve(true)
							break
						case 'false':
							resolve(true)
							break
						case 'true':
							resolve(false)
							break
						default:
							resolve(true)
							break
					}
					return val
				})
				.catch(error => {
					reject(error)
				})
		})
	}
	*/

	const checkPermissions = () => {
		const results = []
		// Only breacking permissions
		checkLocationServicesPermission()
			.then(val => {
				results[0] = val
				return checkLocationPermission()
			})
			.then(val => {
				results[1] = val
				return checkCameraPermission()
			})
			.then(val => {
				results[2] = val

				// const resultsMsg = `Location Services are on: ${results[0]}\nPermission to access location: ${results[1]}\nPermission to use camera: ${results[2]}`

				let resultsMsg = results[0] ? '' : 'Location Services\n'
				resultsMsg += results[1] === 'granted' ? '' : 'Location\n'
				resultsMsg += results[2] === 'granted' ? '' : 'Camera\n'

				if (results.includes(false) || results.includes('denied')) {
					Alert.alert(
						I18n.t('permissions_missing_title'),
						`\n${I18n.t('permissions_missing_msg')}\n\n${resultsMsg}\n`,
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
					navigation.navigate('Contribute')
				}
				return true
			})
			/*
			.then(() => {
				return fetchGotItStorage()
			})
			.then(val => {
				if (val) {
					navigation.navigate('Guidelines')
				} else {
					navigation.navigate('Contribute')
				}
			})
			*/
			.catch(error => {
				alert(error)
			})
	}

	// <WebView style={styles.webviewInner} source={{ uri: 'http://coastwards.org/map' }} />

	return (
		<View style={styles.safeAreaView}>
			<View style={styles.webview}></View>
			<TouchableOpacity style={styles.uploadButton}>
				<MaterialIcons
					name="add-a-photo"
					size={30}
					color="white"
					onPress={() => {
						checkPermissions()
					}}
				/>
			</TouchableOpacity>
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
