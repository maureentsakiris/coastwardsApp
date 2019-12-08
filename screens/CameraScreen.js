import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView } from 'react-native'
import Swiper from 'react-native-swiper'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

const anycoast = require('../assets/guidelines/anycoast.png')
// const original = require('../assets/guidelines/original.png')
const closeup = require('../assets/guidelines/closeup.png')
const nofaces = require('../assets/guidelines/nofaces.png')
const coastmaterial = require('../assets/guidelines/coastmaterial.png')
const notonlybeaches = require('../assets/guidelines/notonlybeaches.png')

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	takePic: {
		flex: 1,
		alignItems: 'center',
	},
	cameraView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	camera: {
		height: width,
		width,
		zIndex: 0,
	},
	validating: {
		position: 'absolute',
		top: 0,
		left: 0,
		width,
		height: width,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		flex: 1,
		zIndex: 20,
	},
	picture: {
		width,
		height: width,
		zIndex: 2,
	},
	takePicBtn: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 0,
	},
	form: {
		flex: 2,
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
		padding: theme.safePadding,
		textAlign: 'center',
	},
	icon: {
		width: 150,
		height: 150,
		marginBottom: 20,
	},
	slideTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
	},
	slideText: {
		textAlign: 'center',
	},
	dismiss: {
		height: 150,
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
		minWidth: 100,
		textAlign: 'center',
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

	const [cameraReady, setCameraReady] = useState(false)
	const [cameraRef, setCameraRef] = useState(false)
	const [picture, setPicture] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)
	const [validating, setValidating] = useState(false)

	const takePic = () => {
		const pictureOptions = {
			exif: true,
			quality: 0,
			// base64: true,

			// onPictureSaved: () => {
			// 	setValidating(false)
			// },
		}

		setValidating(true)
		cameraRef
			.takePictureAsync(pictureOptions)
			.then(pic => {
				setPicture(pic)
				setValidating(false)
			})
			.catch(error => {
				alert(error)
			})

		// const asset = await MediaLibrary.createAssetAsync(uri)
	}

	// alert(pictureURI)

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{hideGuidelines && (
				<View style={styles.takePic}>
					<View style={styles.cameraView}>
						{!picture && (
							<View style={styles.cameraView}>
								<Camera
									style={styles.camera}
									type="back"
									ref={ref => {
										setCameraRef(ref)
									}}
									onCameraReady={() => {
										setCameraReady(true)
									}}
									onMountError={error => {
										setErrorMsg(error.message)
									}}
									ratio="1:1"
								/>

								{cameraReady && (
									<TouchableOpacity style={styles.takePicBtn}>
										<MaterialIcons onPress={takePic} name="radio-button-checked" size={80} color="white" />
									</TouchableOpacity>
								)}

								{validating && (
									<View style={styles.validating}>
										<Text>Validating</Text>
									</View>
								)}
							</View>
						)}

						{picture && <Image style={styles.picture} source={{ uri: picture.uri }} />}
					</View>
					<View style={styles.form}>
						<Text>Error:</Text>
						{errorMsg && <Text>{errorMsg}</Text>}
					</View>
				</View>
			)}
			{!hideGuidelines && (
				<View style={styles.guidelines}>
					<Swiper style={styles.swiper} showsButtons={false} activeDotColor={theme.primary} loop={false}>
						<View style={styles.slide}>
							<Image source={anycoast} style={styles.icon} />
							<Text style={styles.slideTitle}>{I18n.t('any_picture')}</Text>
							<Text style={styles.slideText}>{I18n.t('any_coast')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={nofaces} style={styles.icon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_faces_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_faces_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={coastmaterial} style={styles.icon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_material_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_material_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={notonlybeaches} style={styles.icon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_coasts_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_coasts_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={closeup} style={styles.icon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_closer_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_closer_text')}</Text>
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
