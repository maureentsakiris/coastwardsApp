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
	takePic: {
		flex: 1,
		zIndex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	takePicBtn: {
		position: 'relative',
		top: 10,
		// backgroundColor: 'red',
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
})

const Contribute = () => {
	const [cameraRef, setCameraRef] = useState(false)
	const [cameraReady, setCameraReady] = useState(false)
	const [ratio, setRatio] = useState(RATIO)
	// const [pictureSize, setPictureSize] = useState(null)
	const [validating, setValidating] = useState('')
	const [picture, setPicture] = useState(null)
	const [pictureResized, setPictureResized] = useState(null)
	const [location, setLocation] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)

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
			setValidating('')
			setPicture(null)
			setPictureResized(null)
			setLocation(null)
			setErrorMsg(null)
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
			//  setValidating(false)
			// },
		}

		if (isSafe.current) {
			setValidating('saving_picture')
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
					setValidating('resizing_picture')
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
					setValidating('checking_for_faces')
				}
				return checkForFaces(picResized)
			})

			.then(() => {
				if (isSafe.current) {
					setValidating('getting_location')
				}
				return false
				// return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
			})
			.then(loc => {
				if (isSafe.current) {
					setLocation(loc)
					setValidating('')
				}
			})
			.catch(error => {
				alert(error)
				resetContribute()
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
					alert(error)
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
			{errorMsg && <Text>{errorMsg}</Text>}
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
							setErrorMsg(error.message)
						}}
						ratio={ratio}
					/>
					<TouchableOpacity style={{ ...styles.takePicBtn, display: cameraReady ? 'flex' : 'none' }}>
						<MaterialIcons onPress={takePic} name="photo-camera" size={40} color="white" />
					</TouchableOpacity>
				</View>
			)}

			<ScrollView contentContainerStyle={styles.scrollView}>{picture && <Image style={styles.picture} source={{ uri: picture.uri }} />}</ScrollView>

			<View style={{ ...styles.fullscreen, ...styles.validating }} pointerEvents="none">
				<View style={{ ...styles.validatingInner, display: validating ? 'flex' : 'none' }}>
					<ActivityIndicator size="large" color="white" />
					<Text style={styles.validatingTxt}>{I18n.t(validating)}</Text>
				</View>
			</View>
			<Guidelines />
		</View>
	)
}

export default Contribute
