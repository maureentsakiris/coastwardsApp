import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator'
import { MaterialIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width, height } = Dimensions.get('window')
const RATIO = '1:1'
const MATERIALS = [
	{
		label: 'Sand',
		value: 'sand',
		color: '#ffc417',
	},
	{
		label: 'Pebble',
		value: 'pebble',
		color: '#bed839',
	},
	{
		label: 'Rock',
		value: 'rock',
		color: '#f46e36',
	},
	{
		label: 'Mud',
		value: 'mud',
		color: '#bb80ef',
	},
	{
		label: 'Ice',
		value: 'ice',
		color: '#ff99ad',
	},
	{
		label: 'Man-made',
		value: 'manmade',
		color: '#24adbb',
	},
	{
		label: 'Not sure',
		value: 'notsure',
		color: '#a9a9a9',
	},
]

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	scrollView: {
		paddingBottom: 20,
	},
	fullscreen: {
		width,
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		// flex: 1,
	},
	cancelBtn: {
		paddingTop: theme.safePadding,
		paddingRight: 20,
		paddingBottom: 20,
		alignSelf: 'flex-end',
		zIndex: 5,
		// position: 'absolute',
		// top: theme.safePadding,
		// left: 20,
		// zIndex: 3,
		// shadowColor: '#000',
		// shadowOffset: {
		// 	width: 0,
		// 	height: 5,
		// },
		// shadowOpacity: 0.36,
		// shadowRadius: 6.68,
		// elevation: 11,
	},
	cancelBtnTxt: {
		color: 'white',
		fontSize: 18,
	},
	takePic: {
		flex: 1,
		zIndex: 1,
		alignItems: 'flex-start',
		backgroundColor: 'white',
	},
	takePicBtnContainer: {
		flex: 1,
		width,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	takePicBtn: {
		backgroundColor: theme.primary,

		alignItems: 'center',
		justifyContent: 'center',
		width: 80,
		height: 80,
		borderRadius: 50,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	validating: {
		zIndex: 2,
		// pointerEvents: 'none',
	},
	// https://github.com/facebook/react-native/issues/18415
	validatingInner: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
		padding: theme.safePadding,
	},
	validatingTxt: {
		color: 'white',
		marginTop: 20,
	},
	camera: {
		width,
		height: width,
		// zIndex: 0,
	},
	picture: {
		width,
		height: width,
	},
	takePicInner: {
		padding: theme.padding,
	},
	hurray: {
		fontSize: 24,
		fontWeight: '300',
		color: theme.body,
		marginBottom: 15,
	},
	hurraySubtitle: {
		fontSize: 18,
		fontWeight: '600',
		color: theme.body,
	},
	materialBtnsContainer: {
		marginTop: 20,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	materialBtn: {
		// flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'center',
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 15,
		paddingLeft: 15,
		borderRadius: 3,
		borderWidth: 3,
	},
	materialBtnTxt: {
		color: 'white',
		fontSize: 18,
		marginLeft: 5,
	},
})

const Contribute = ({ navigation }) => {
	useEffect(() => {
		async function fetchGotItStorage() {
			return AsyncStorage.getItem('GOTIT')
		}

		fetchGotItStorage()
			.then(value => {
				let val
				switch (value) {
					case null:
						navigation.navigate('Guidelines')
						break
					case 'false':
						navigation.navigate('Guidelines')
						break
					case 'true':
						navigation.navigate('Contribute')
						break
					default:
						navigation.navigate('Guidelines')
						break
				}

				return val
			})
			.catch(error => {
				Alert.alert(error)
			})
	}, [])

	const [cameraRef, setCameraRef] = useState(false)
	const [cameraReady, setCameraReady] = useState(false)
	const [ratio, setRatio] = useState(RATIO)
	// const [pictureSize, setPictureSize] = useState(null)
	const [validating, setValidating] = useState(false)
	const [validatingMsg, setValidatingMsg] = useState(false)
	const [picture, setPicture] = useState(null)
	const [pictureResized, setPictureResized] = useState(null)
	const [location, setLocation] = useState(null)

	const [hurray, setHurray] = useState(false)

	const isSafe = useRef(true)

	// setting states after asynchronous calls was causing memory leak. calls cannot be wrapped into an effect because they are not called onMount but when user clicks btn
	// https://jeffchheng.github.io/brains-base/2019-08-02-usestatesafely/?utm_campaign=Week%20of%20React&utm_medium=email&utm_source=Revue%20newsletter
	useEffect(() => {
		// Future proofing for double-invoking
		// effects in Strict Mode.
		isSafe.current = true
		return () => {
			isSafe.current = false
		}
	}, [])

	const resetContribute = () => {
		if (isSafe.current) {
			setValidating(false)
			setValidatingMsg(false)
			setPicture(null)
			setPictureResized(null)
			setLocation(null)

			setHurray(false)
		}
	}

	const checkForFaces = pic => {
		return new Promise((resolve, reject) => {
			const options = {
				mode: FaceDetector.Constants.Mode.fast,
				detectLandmarks: FaceDetector.Constants.Landmarks.none,
				runClassifications: FaceDetector.Constants.Classifications.none,
			}

			FaceDetector.detectFacesAsync(pic.uri, options)
				.then(value => {
					if (value.faces.length > 0) {
						reject(Error('faces_detected'))
					}
					resolve(pic)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	const takePic = () => {
		const pictureOptions = {
			exif: true,
			quality: 0,
			// base64: true,
			// skipProcessing: true,
			// onPictureSaved: () => {

			// },
		}

		if (isSafe.current) {
			setValidating(true)
			setValidatingMsg(I18n.t('saving_picture'))
		}

		cameraRef
			.takePictureAsync(pictureOptions)
			.then(pic => {
				if (isSafe.current) {
					setPicture(pic)
				}
				return pic
			})
			.then(pic => {
				if (isSafe.current) {
					setValidatingMsg(I18n.t('processing_picture'))
				}
				return ImageManipulator.manipulateAsync(pic.uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: true })
			})
			.then(picResized => {
				if (isSafe.current) {
					setPictureResized(picResized)
				}
				return picResized
			})
			.then(picResized => {
				if (isSafe.current) {
					setValidatingMsg(I18n.t('checking_for_faces'))
				}
				return checkForFaces(picResized)
			})

			.then(() => {
				if (isSafe.current) {
					setValidatingMsg(I18n.t('getting_location'))
				}
				return true
				return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
			})
			.then(loc => {
				if (isSafe.current) {
					setLocation(loc)
					setValidating(false)
					setValidatingMsg(false)
					setHurray(true)
				}
			})
			.catch(error => {
				const translatedErrorMessages = ['faces_detected']
				const msg = translatedErrorMessages.includes(error.message) ? I18n.t(error.message) : error.message
				if (isSafe.current) {
					setValidating(false)
				}
				Alert.alert(
					I18n.t('oops'),
					msg,
					[
						{
							text: I18n.t('try_again'),
							style: 'cancel',
							onPress: () => {
								resetContribute()
							},
						},
						{
							text: I18n.t('cancel'),
							onPress: () => {
								navigation.navigate('Main')
							},
						},
					],

					{ cancelable: false } // Don't allow to cancel by tapping outside
				)
			})

		// const asset = await MediaLibrary.createAssetAsync(uri)
	}

	const setupCamera = () => {
		if (Platform.OS === 'android') {
			cameraRef
				.getSupportedRatiosAsync()
				.then(value => {
					if (value.includes(RATIO)) {
						if (isSafe.current) {
							setRatio(RATIO)
							setCameraReady(true)
						}
						return RATIO
					}
					if (isSafe.current) {
						setRatio('4:3')
						setCameraReady(true)
					}
					return '4:3'
				})
				/*
				.then(availableRatio => {
					return cameraRef.getAvailablePictureSizesAsync(availableRatio)
				})
				.then(availableSizes => {
					// alert(availableSizes)
					if(isSafe.current){
					setCameraReady(true)
					}
				})
				*/
				.catch(error => {
					Alert.alert(
						I18n.t('something_went_wrong'),
						error.message,
						[
							{
								text: I18n.t('cancel'),
								style: 'cancel',
								onPress: () => {
									navigation.navigate('Main')
								},
							},
						],
						{ cancelable: false } // Don't allow to cancel by tapping outside
					)

					resetContribute()
				})
		} else {
			if (isSafe.current) {
				setCameraReady(true)
			}
			/*
			cameraRef
				.getAvailablePictureSizesAsync(RATIO)
				.then(availableSizes => {
					// alert(availableSizes)
					if(isSafe.current){
					setCameraReady(true)
					}
				})
				.catch(error => {
					alert(error)
				})
				*/
		}
	}

	const materialBtns = MATERIALS.map(material => {
		return (
			<TouchableOpacity key={material.value} style={{ ...styles.materialBtn, borderColor: material.color }}>
				<MaterialIcons name="radio-button-unchecked" size={40} color={material.color} />
				<Text style={{ ...styles.materialBtnTxt, color: material.color }}>{I18n.t(material.value)}</Text>
			</TouchableOpacity>
		)
	})

	return (
		<View style={styles.safeAreaView}>
			{!picture && (
				<View style={{ ...styles.fullscreen, ...styles.takePic }}>
					<Camera
						style={styles.camera}
						type="back"
						ref={ref => {
							setCameraRef(ref)
						}}
						onCameraReady={() => {
							setupCamera()
						}}
						onMountError={error => {
							Alert.alert(
								I18n.t('something_went_wrong'),
								error.message,
								[
									{
										text: I18n.t('cancel'),
										style: 'cancel',
										onPress: () => {
											navigation.navigate('Main')
										},
									},
								],

								{ cancelable: false } // Don't allow to cancel by tapping outside
							)
						}}
						ratio={ratio}
					/>
					<View style={styles.takePicBtnContainer}>
						<TouchableOpacity style={styles.guidelinesBtn}>
							<MaterialIcons
								onPress={() => {
									navigation.navigate('Guidelines')
								}}
								name="help-outline"
								size={40}
								color={theme.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={{ ...styles.takePicBtn, display: cameraReady ? 'flex' : 'none' }}>
							<MaterialIcons onPress={takePic} name="photo-camera" size={40} color="white" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.guidelinesBtn}>
							<MaterialIcons
								onPress={() => {
									navigation.navigate('Guidelines')
								}}
								name="help-outline"
								size={40}
								color={theme.primary}
							/>
						</TouchableOpacity>
					</View>
				</View>
			)}

			<ScrollView contentContainerStyle={styles.scrollView}>
				{picture && <Image style={styles.picture} source={{ uri: picture.uri }} />}
				{hurray && (
					<View style={styles.takePicInner}>
						<Text style={styles.hurray}>{I18n.t('hurray')}</Text>
						<Text style={styles.hurraySubtitle}>{I18n.t('select_material')}</Text>
						<View style={styles.materialBtnsContainer}>{materialBtns}</View>
					</View>
				)}
			</ScrollView>

			<View style={{ ...styles.fullscreen, ...styles.validating }} pointerEvents="none">
				<View style={{ ...styles.validatingInner, display: validating ? 'flex' : 'none' }}>
					<ActivityIndicator size="large" color="white" />
					{validatingMsg && <Text style={styles.validatingTxt}>{validatingMsg}</Text>}
				</View>
			</View>
		</View>
	)
}

export default Contribute
