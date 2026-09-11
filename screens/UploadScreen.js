import React from 'react'
import { View, StyleSheet } from 'react-native'

import MaterialScreen from '../components/MaterialScreen'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
})

const UploadScreen = ({ navigation, route }) => {
	const { uri, location, exif } = route.params || {}
	const source = 'app'

	return (
		<View style={styles.safeAreaView}>
			<MaterialScreen navigation={navigation} uri={uri} location={location} exif={exif || {}} source={source} landingSheet="Hurray" />
		</View>
	)
}

export default UploadScreen
