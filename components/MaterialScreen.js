import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Dimensions, ScrollView, ActivityIndicator, Platform, TextInput, KeyboardAvoidingView, ImageBackground, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import uuid from 'uuid/v1'
import I18n from '../i18n/i18n'
import theme from '../theme'

const { width, height } = Dimensions.get('window')

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
		alignItems: 'center',
	},
	picture: {
		width,
		height: (width / 3) * 1.7,
	},
	formContainer: {
		padding: theme.padding,
	},
	hurray: {
		fontSize: 28,
		fontWeight: '300',
		color: theme.body,
		marginBottom: 15,
	},
	hurraySubtitle: {
		fontSize: 18,
		fontWeight: '600',
		color: theme.body,
		marginBottom: 20,
	},
	materialBtnsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 30,
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

	helpTxtContainer: {
		backgroundColor: theme.primary,

		borderRadius: 3,
		padding: 10,
	},

	helpTxt: {
		color: 'white',
	},

	uploadNow: {
		padding: theme.padding,
		paddingBottom: 20,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,

		elevation: 7,
	},
	comment: {
		borderColor: '#c1d7e2',
		borderWidth: 1,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15,
		color: theme.primary,
		borderRadius: 30,
		marginRight: 10,
		flex: 1,
		backgroundColor: theme.waterMap,
	},
	uploadBtn: {
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

	uploading: {
		width,
		height,
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 3,
		display: 'flex',
		flexDirection: 'row',
	},
	// https://github.com/facebook/react-native/issues/18415
	uploadingInner: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
		padding: theme.safePadding,
	},
	uploadingTxt: {
		color: 'white',
		marginTop: 20,
	},
})

const MaterialScreen = ({ navigation, uri, location, exif, landingSheet, libraryId }) => {
	const [materialUser, setMaterialUser] = useState('notset')
	const [commentUser, setCommentUser] = useState('')
	const [uploading, setUploading] = useState(false)
	const [termsAccepted, setTermsAccepted] = useState(false)

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

	const [alreadyUploaded, setAlreadyUploaded] = useState(false)

	useEffect(() => {
		async function fetchGotItStorage() {
			return AsyncStorage.getItem('TERMSACCEPTED')
		}

		fetchGotItStorage()
			.then(value => {
				let val
				switch (value) {
					case null:
						setTermsAccepted(false)
						break
					case 'false':
						setTermsAccepted(false)
						break
					case 'true':
						setTermsAccepted(true)
						break
					default:
						setTermsAccepted(false)
						break
				}

				return val
			})
			.catch(error => {
				Alert.alert(error)
			})
	}, [])

	const materialBtns = MATERIALS.map(material => {
		const active = materialUser === material.value

		return (
			<TouchableOpacity
				onPress={() => {
					setMaterialUser(material.value)
				}}
				key={material.value}
				style={{ ...styles.materialBtn, borderColor: material.color, backgroundColor: active ? material.color : 'white' }}
			>
				<MaterialIcons name={active ? 'radio-button-checked' : 'radio-button-unchecked'} size={40} color={active ? 'white' : material.color} />
				<Text style={{ ...styles.materialBtnTxt, color: active ? 'white' : material.color }}>{I18n.t(material.value)}</Text>
			</TouchableOpacity>
		)
	})

	const uploadPicture = () => {
		if (isSafe.current) {
			setUploading(true)
		}

		const { latitude, longitude } = location

		const datetime = exif.DateTimeOriginal || exif.DateTimeDigitized || exif.DateTime
		const uid = uuid()
		const fileType = uri.substring(uri.lastIndexOf('.') + 1)

		const formData = new FormData()
		formData.append('file', {
			uri,
			name: `${uid}.${fileType}`,
			type: `image/${fileType}`,
		})
		formData.append('exifdata', JSON.stringify(exif))
		formData.append('lat', latitude)
		formData.append('long', longitude)
		formData.append('manual', 0)
		formData.append('corrected', 0)
		formData.append('uid', uid)
		formData.append('datetime', datetime)
		// formData.append('labels', JSON.stringify(devLabels)) <--- DONE ON SERVER
		formData.append('material', materialUser)
		formData.append('comment', commentUser)
		formData.append('source', 'app')

		fetch('http://coastwards.org/contribute/upload', {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(responseJson => {
				if (isSafe.current) {
					if (responseJson.status === 'OK') {
						setAlreadyUploaded(true)
						if (libraryId) {
							AsyncStorage.setItem(libraryId, 'true')
						}
						navigation.navigate(landingSheet)
					} else {
						const { message } = responseJson
						const translatedErrors = ['spam_detected']

						if (translatedErrors.includes(message)) {
							alert(I18n.t(message))
						} else {
							alert(I18n.t('upload_error') + '\n\nError: ' + message)
						}

						setUploading(false)
					}
				}
			})
			.catch(error => {
				if (isSafe.current) {
					setUploading(false)
					alert('upload_error' + '\n\nError: ' + error)
				}
			})
	}

	const checkTerms = () => {
		Keyboard.dismiss()
		if (termsAccepted) {
			uploadPicture()
		} else {
			Alert.alert(
				I18n.t('terms_header'),
				`\n${I18n.t('terms_author')}\n\n${I18n.t('honor_privacy')}\n\n${I18n.t('terms_cc0_app', { license: I18n.t('license') })}\n`,
				[
					{
						text: I18n.t('cancel'),
						style: 'cancel',
					},
					{
						text: I18n.t('accept_once'),
						onPress: () => {
							uploadPicture()
						},
					},
					{
						text: I18n.t('accept_always'),
						onPress: () => {
							AsyncStorage.setItem('TERMSACCEPTED', 'true')
								.then(() => {
									uploadPicture()
								})
								.catch(error => {
									alert(error)
								})
						},
					},
				],

				{ cancelable: false } // Don't allow to cancel by tapping outside
			)
		}
	}

	return (
		<View style={styles.safeAreaView}>
			<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 63 : 80} enabled>
				<ScrollView>
					<ImageBackground style={styles.picture} source={{ uri }} />
					<View style={styles.formContainer}>
						<Text style={styles.hurraySubtitle}>{I18n.t('select_material')}</Text>

						<View style={styles.materialBtnsContainer}>{materialBtns}</View>
						<View style={styles.helpTxtContainer}>
							<Text style={{ ...styles.helpTxt, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{I18n.t('guideline_material_help_app')}</Text>
							<Text style={{ ...styles.helpTxt, marginBottom: 10 }}>{I18n.t('the_obvious_header')}</Text>
							<Text style={{ ...styles.helpTxt, marginBottom: 15 }}>{I18n.t('the_obvious_text')}</Text>
							<Text style={{ ...styles.helpTxt, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{I18n.t('multiple_materials_header')}</Text>
							<Text style={{ ...styles.helpTxt, marginBottom: 10 }}>{I18n.t('multiple_materials_text')}</Text>
						</View>
					</View>
				</ScrollView>
				<View style={styles.uploadNow}>
					<TextInput
						style={styles.comment}
						onChangeText={txt => {
							setCommentUser(txt)
						}}
						value={commentUser}
						placeholder={I18n.t('comment_placeholder')}
						placeholderTextColor={theme.primary}
						textAlignVertical="top"
						multiline
					/>
					<TouchableOpacity
						style={styles.uploadBtn}
						onPress={() => {
							checkTerms()
						}}
					>
						<MaterialIcons name="send" size={40} color="white" />
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
			<View style={styles.uploading} pointerEvents={uploading ? 'all' : 'none'}>
				<View style={{ ...styles.uploadingInner, display: uploading ? 'flex' : 'none' }}>
					{!alreadyUploaded && (
						<View>
							<ActivityIndicator size="large" color="white" />
							<Text style={styles.uploadingTxt}>{I18n.t('status_uploading_app')}</Text>
						</View>
					)}
					{alreadyUploaded && <Text style={styles.uploadingTxt}>{I18n.t('already_uploaded')}</Text>}
				</View>
			</View>
		</View>
	)
}

MaterialScreen.defaultProps = {
	libraryId: null,
}

MaterialScreen.propTypes = {
	navigation: PropTypes.object.isRequired,
	uri: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	exif: PropTypes.object.isRequired,
	landingSheet: PropTypes.string.isRequired,
	libraryId: PropTypes.string,
}

export default MaterialScreen
