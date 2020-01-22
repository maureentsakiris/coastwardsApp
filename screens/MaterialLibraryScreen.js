import React from 'react'
import { View, StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'

import MaterialScreen from '../components/MaterialScreen'
import theme from '../theme'

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

const MaterialLibraryScreen = ({ navigation }) => {
	const selected = Array.from(navigation.getParam('selected'))

	const selectedSheets = selected.map(value => {
		const id = value[0]

		const { uri, location, exif } = value[1]

		return (
			<View style={styles.safeAreaView} key={id}>
				<MaterialScreen navigation={navigation} uri={uri} location={location} exif={exif} landingSheet="HurrayLibrary" libraryId={id} />
			</View>
		)
	})

	return (
		<Swiper style={styles.safeAreaView} showsButtons activeDotColor={theme.primary} loop={false}>
			{selectedSheets}
		</Swiper>
	)
}

export default MaterialLibraryScreen
