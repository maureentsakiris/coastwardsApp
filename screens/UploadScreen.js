import React from 'react'
import { View, StyleSheet } from 'react-native'

import MaterialScreen from '../components/MaterialScreen'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	picture: {
		height: 200,
		width: '100%',
		backgroundColor: 'pink',
	},
})

const UploadScreen = ({ navigation }) => {
	const uri = navigation.getParam('uri')
	const location = navigation.getParam('location')
	const exif = navigation.getParam('exif')

	return (
		<View style={styles.safeAreaView}>
			<MaterialScreen navigation={navigation} uri={uri} location={location} exif={exif} landingSheet="Hurray" />
		</View>
	)
}

export default UploadScreen
