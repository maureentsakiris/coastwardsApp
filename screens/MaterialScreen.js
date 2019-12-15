import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform, StatusBar, Animated, TextInput, KeyboardAvoidingView, ImageBackground } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
		height: 150,
	},
	formContainer: {
		padding: theme.padding,
		paddingBottom: 150,
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
		// width: '45%',
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
	comment: {
		borderColor: '#ddd',
		borderWidth: 1,
		padding: 10,
		height: 100,
	},
	uploadBtn: {
		position: 'absolute',
		bottom: theme.safePadding,
		right: theme.safePadding,
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
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 2,
		// pointerEvents: 'none',
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

const MaterialScreen = ({ navigation }) => {
	const [materialUser, setMaterialUser] = useState(false)
	const [commentUser, setCommentUser] = useState('')
	const [uploading, setUploading] = useState(false)

	const materialBtns = MATERIALS.map(material => {
		const active = materialUser === material.value ? true : false

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

	// <Image style={styles.picture} source={{ uri: picture.uri }} />
	// alert(JSON.stringify(navigation.state.params))
	const picture = navigation.getParam('picture')
	const pictureResized = navigation.getParam('pictureResized')
	const location = navigation.getParam('location')

	// https://ovpv.me/keyboardavoidingview-rn-expo/

	const uploadPicture = () => {
		setUploading(true)

		const { latitude, longitude, accuracy } = location.coords
		const { exif } = picture
		const { uri, width, height, base64 } = pictureResized

		const datetime = exif.DateTimeOriginal || exif.DateTimeDigitized || exif.DateTime
		const uid = uuid()
		const fileType = uri.substring(uri.lastIndexOf('.') + 1)

		const formData = new FormData()
		formData.append('file', {
			uri,
			name: `${uid}.${fileType}`,
			type: `image/${fileType}`,
		})
		// formData.append('file', base64, `${uid}.jpg`)
		formData.append('exifdata', JSON.stringify(exif))
		formData.append('lat', latitude)
		formData.append('long', longitude)
		formData.append('manual', 0)
		formData.append('corrected', 0)
		formData.append('uid', uid)
		formData.append('datetime', datetime)
		// formData.append('labels', JSON.stringify(devLabels))
		formData.append('material', materialUser)
		formData.append('comment', commentUser)

		// alert(JSON.stringify(formData))

		fetch('http://192.168.0.6:8888/contribute/upload', {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(responseJson => {
				alert(JSON.stringify(responseJson))
				if (responseJson.status === 'OK') {
					setUploading(false)
				} else {
					alert('ERRRRRROR')
				}

				// return responseJson.movies
			})
			.catch(error => {
				alert('error: ' + error)
			})
	}

	return (
		<View style={styles.safeAreaView}>
			<StatusBar barStyle="light-content" />

			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.Os === 'ios' ? 'padding' : 'height'} enabled>
				<ScrollView>
					<ImageBackground style={styles.picture} source={{ uri: picture.uri }} />
					<View style={styles.formContainer}>
						<Text style={styles.hurray}>{I18n.t('hurray')}</Text>
						<Text style={styles.hurraySubtitle}>{I18n.t('select_material')}</Text>
						<View style={styles.materialBtnsContainer}>{materialBtns}</View>
						<Text style={styles.hurraySubtitle}>{I18n.t('comment')}</Text>
						<TextInput
							style={styles.comment}
							onChangeText={txt => {
								setCommentUser(txt)
							}}
							value={commentUser}
							placeholder={I18n.t('comment_placeholder')}
							multiline
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<TouchableOpacity
				style={styles.uploadBtn}
				onPress={() => {
					uploadPicture()
				}}
			>
				<MaterialIcons name="send" size={40} color="white" />
			</TouchableOpacity>
			<View style={styles.uploading} pointerEvents="none">
				<View style={{ ...styles.uploadingInner, display: uploading ? 'flex' : 'none' }}>
					<ActivityIndicator size="large" color="white" />
					<Text style={styles.uploadingTxt}>{I18n.t('status_uploading')}</Text>
				</View>
			</View>
		</View>
	)
}

export default MaterialScreen
