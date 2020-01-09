import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Dimensions, ActivityIndicator, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator'
import { MaterialIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width } = Dimensions.get('window')
const RATIO = '1:1'

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
		flexDirection: 'row',
		alignItems: 'center',
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

const CameraScreen = ({ navigation }) => {
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
						// navigation.navigate('Camera')
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
			quality: 1,
			// base64: true,
			// skipProcessing: true,
			// onPictureSaved: () => {

			// },
		}

		if (isSafe.current) {
			setValidating(true)
			setValidatingMsg(I18n.t('saving_picture'))
		}

		const params = {}

		cameraRef
			.takePictureAsync(pictureOptions)
			.then(pic => {
				if (isSafe.current) {
					setPicture(pic)
				}
				params.picture = pic
				return pic
			})
			.then(pic => {
				if (isSafe.current) {
					setValidatingMsg(I18n.t('processing_picture'))
				}
				return ImageManipulator.manipulateAsync(pic.uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: true })
			})
			.then(picResized => {
				params.pictureResized = picResized
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
				// return true
				return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
			})
			.then(loc => {
				params.location = loc
				if (isSafe.current) {
					setLocation(loc)
					setValidating(false)
					setValidatingMsg(false)

					navigation.navigate({ routeName: 'Material', params })
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

	const choosePic = () => {
		Alert.alert(
			'Choose from library',
			'Sorry, this feature is not ready yet. Please come back in a few days, we hope to have it ready by then!',
			[
				{
					text: I18n.t('ok'),
					style: 'cancel',
				},
			],
			{ cancelable: false } // Don't allow to cancel by tapping outside
		)
	}

	return (
		<View style={styles.safeAreaView}>
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
					autoFocus="on"
				/>
				<View style={styles.takePicBtnContainer}>
					<TouchableOpacity>
						<MaterialIcons onPress={choosePic} name="photo-library" size={40} color={theme.primary} />
					</TouchableOpacity>
					<TouchableOpacity style={{ ...styles.takePicBtn, display: cameraReady ? 'flex' : 'none' }}>
						<MaterialIcons onPress={takePic} name="photo-camera" size={40} color="white" />
					</TouchableOpacity>
					<MaterialIcons name="photo-library" size={40} color="white" />
				</View>
			</View>

			<View style={{ ...styles.fullscreen, ...styles.validating }} pointerEvents={validating ? 'all' : 'none'}>
				<View style={{ ...styles.validatingInner, display: validating ? 'flex' : 'none' }}>
					<ActivityIndicator size="large" color="white" />
					{validatingMsg && <Text style={styles.validatingTxt}>{validatingMsg}</Text>}
				</View>
			</View>
		</View>
	)
}

export default CameraScreen
