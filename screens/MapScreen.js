import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, Alert, Linking, Text, Image, ActivityIndicator } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import WebView from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import * as Permissions from 'expo-permissions'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
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
	const [counter, setCounter] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

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
			.catch(error => {
				alert(error)
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
