import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Linking } from 'expo'
import I18n from '../i18n/i18n'

import theme from '../theme'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		padding: theme.padding,
		paddingBottom: theme.comfiPadding,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 20,
	},
	p: {
		marginTop: 10,
		fontSize: 18,
	},
	emailBtn: {
		backgroundColor: theme.primary,
		padding: 10,
		borderRadius: 3,

		width: '100%',
		marginTop: 20,
	},
	emailBtnTxt: {
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
})

// <Text style={styles.header}>{I18n.t('any_picture_title')}</Text>

const FeedbackScreen = () => {
	return (
		<View style={styles.safeAreaView}>
			<Text style={styles.header}>{I18n.t('feedback_title')}</Text>
			<Text style={styles.p}>{I18n.t('feedback_text')}</Text>
			<TouchableOpacity style={styles.emailBtn} onPress={() => Linking.openURL('mailTo:go@coastwards.org')}>
				<Text style={styles.emailBtnTxt}>{I18n.t('send_email')}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default FeedbackScreen
