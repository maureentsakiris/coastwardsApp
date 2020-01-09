import React from 'react'
import { View, StyleSheet } from 'react-native'

import theme from '../theme'
import Guidelines from '../components/Guidelines'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		padding: theme.padding,
		paddingBottom: theme.comfiPadding,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',

		marginTop: 20,
		textAlign: 'center',
	},
})

// <Text style={styles.header}>{I18n.t('any_picture_title')}</Text>

const GuidelinesGalleryScreen = () => {
	return (
		<View style={styles.safeAreaView}>
			<Guidelines />
		</View>
	)
}

export default GuidelinesGalleryScreen
