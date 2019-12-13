import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator'
import { MaterialIcons } from '@expo/vector-icons'

import Guidelines from '../components/Guidelines'
import I18n from '../i18n/i18n'
import theme from '../theme'

const { width, height } = Dimensions.get('window')
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
		height,
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
		backgroundColor: 'black',
	},
	takePicBtnContainer: {
		flex: 1,
		width,
		alignItems: 'center',
		justifyContent: 'center',
	},
	takePicBtn: {
		backgroundColor: 'white',

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
		padding: theme.safePadding,
	},
	hurray: {
		fontSize: 28,
		fontWeight: '300',
		color: theme.body,
	},
})

const Contribute = ({ navigation }) => {
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
			setValidatingMsg(I18n.t('status_validating'))
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
				return ImageManipulator.manipulateAsync(pic.uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: true })
			})
			.then(picResized => {
				if (isSafe.current) {
					setPictureResized(picResized)
				}
				return picResized
			})
			.then(picResized => {
				return checkForFaces(picResized)
			})

			.then(() => {
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

	return (
		<View style={styles.safeAreaView}>
			{!picture && (
				<View style={{ ...styles.fullscreen, ...styles.takePic }}>
					<TouchableOpacity style={styles.cancelBtn}>
						<Text
							onPress={() => {
								navigation.navigate('Main')
							}}
							style={styles.cancelBtnTxt}
						>
							{I18n.t('cancel')}
						</Text>
					</TouchableOpacity>
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
						<TouchableOpacity style={{ ...styles.takePicBtn, display: cameraReady ? 'flex' : 'none' }}>
							<MaterialIcons onPress={takePic} name="photo-camera" size={40} color="black" />
						</TouchableOpacity>
					</View>
				</View>
			)}
			<TouchableOpacity style={styles.cancelBtn}>
				<Text
					onPress={() => {
						navigation.navigate('Main')
					}}
					style={{ ...styles.cancelBtnTxt, color: theme.primary }}
				>
					{I18n.t('cancel')}
				</Text>
			</TouchableOpacity>
			<ScrollView contentContainerStyle={styles.scrollView}>
				{picture && <Image style={styles.picture} source={{ uri: picture.uri }} />}
				{hurray && (
					<View style={styles.takePicInner}>
						<Text style={styles.hurray}>{I18n.t('hurray')}</Text>
					</View>
				)}
			</ScrollView>

			<View style={{ ...styles.fullscreen, ...styles.validating }} pointerEvents="none">
				<View style={{ ...styles.validatingInner, display: validating ? 'flex' : 'none' }}>
					<ActivityIndicator size="large" color="white" />
					{validatingMsg && <Text style={styles.validatingTxt}>{validatingMsg}</Text>}
				</View>
			</View>
			<Guidelines />
		</View>
	)
}

export default Contribute
