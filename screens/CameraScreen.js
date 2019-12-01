import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert } from 'react-native'
import Swiper from 'react-native-swiper'
import { Camera } from 'expo-camera'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	guidelines: {
		flex: 1,
	},
	swiper: {
		// flex: 1
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dismiss: {
		// height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: theme.safePadding,
		paddingRight: theme.safePadding,
		paddingLeft: theme.safePadding,
	},
	dismissBtn: {
		backgroundColor: theme.primary,
		padding: 10,
		marginBottom: 20,
		color: 'white',
		fontSize: 18,
		borderRadius: 3,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	dismissForever: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dismissForeverTxt: {
		marginLeft: 5,
	},
})

const CameraScreen = () => {
	const [hideGuidelines, setHideGuidelines] = useState(false)
	useEffect(() => {
		async function checkHideGuidelinesStorage() {
			return AsyncStorage.getItem('HIDE_GUIDELINES')
		}

		checkHideGuidelinesStorage()
			.then(value => {
				// const val = value === null ? false : Boolean(value)
				let val
				switch (value) {
					case null:
						val = false
						break
					case 'false':
						val = false
						break
					case 'true':
						val = true
						break
					default:
						val = false
						break
				}
				setHideGuidelines(val)
				return val
			})
			.catch(error => {
				Alert.alert(error)
			})
	}, [])

	const [isChecked, setIsChecked] = useState(false)

	const gotIt = () => {
		async function setShowGuidelinesStorage() {
			return AsyncStorage.setItem('HIDE_GUIDELINES', String(isChecked))
		}

		setShowGuidelinesStorage()
			.then(() => {
				setHideGuidelines(true)
			})
			.catch(error => {
				Alert.alert(error)
			})
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{hideGuidelines && <Camera style={styles.camera} type="back" />}
			{!hideGuidelines && (
				<View style={styles.guidelines}>
					<Swiper style={styles.swiper} showsButtons={false}>
						<View style={styles.slide}>
							<Text>Hello Swiper</Text>
						</View>
						<View style={styles.slide}>
							<Text>Beautiful</Text>
						</View>
						<View style={styles.slide}>
							<Text>And simple</Text>
						</View>
					</Swiper>
					<View style={styles.dismiss}>
						<TouchableOpacity
							onPress={() => {
								gotIt()
							}}
						>
							<Text style={styles.dismissBtn}>{I18n.t('got_it')}</Text>
						</TouchableOpacity>
						<View style={styles.dismissForever}>
							<MaterialIcons
								name={isChecked ? 'check-box' : 'check-box-outline-blank'}
								size={24}
								color={theme.primary}
								onPress={() => {
									setIsChecked(!isChecked)
								}}
							/>
							<Text style={styles.dismissForeverTxt}>{I18n.t('do_not_show_again')}</Text>
						</View>
					</View>
				</View>
			)}
		</SafeAreaView>
	)
}

export default CameraScreen
