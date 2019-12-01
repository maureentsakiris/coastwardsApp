import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, SafeAreaView, Alert, Linking } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as IntentLauncher from 'expo-intent-launcher'
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
	uploadButton: {
		position: 'absolute',
		bottom: 20,
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
		left: 20,
	},
})

const MapScreen = ({ navigation }) => {
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

	const checkPermissions = () => {
		checkLocationPermission()
			.then(() => {
				return checkCameraPermission()
			})
			.then(() => {
				navigation.navigate('Modal')
				return true
			})
			.catch(error => {
				if (error === 'denied') {
					Alert.alert(
						I18n.t('permissions_denied_title'),
						I18n.t('permissions_denied_msg'),
						[
							{
								text: I18n.t('cancel'),
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
					Alert.alert(error)
				}
			})
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.webview} />
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
		</SafeAreaView>
	)
}

export default MapScreen
