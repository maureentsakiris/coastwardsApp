import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import Swiper from 'react-native-swiper'

import I18n from '../i18n/i18n'
import theme from '../theme'

const anycoast = require('../assets/guidelines/anycoast.png')
const closeup = require('../assets/guidelines/closeup.png')
const nofaces = require('../assets/guidelines/nofaces.png')
const coastmaterial = require('../assets/guidelines/coastmaterial.png')
const notonlybeaches = require('../assets/guidelines/notonlybeaches.png')

const styles = StyleSheet.create({
	swiper: {},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: theme.padding,
		paddingRight: theme.padding,
	},
	slideIcon: {
		width: 150,
		height: 150,
		marginBottom: 20,
	},
	slideTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
	},
	slideText: {
		textAlign: 'center',
	},
})

const Guidelines = () => {
	return (
		<Swiper style={styles.swiper} showsButtons={false} activeDotColor={theme.primary} loop={false}>
			<View style={styles.slide}>
				<Image source={anycoast} style={styles.slideIcon} />
				<Text style={styles.slideTitle}>{I18n.t('any_picture')}</Text>
				<Text style={styles.slideText}>{I18n.t('any_coast')}</Text>
			</View>
			<View style={styles.slide}>
				<Image source={nofaces} style={styles.slideIcon} />
				<Text style={styles.slideTitle}>{I18n.t('guideline_faces_header')}</Text>
				<Text style={styles.slideText}>{I18n.t('guideline_faces_text')}</Text>
			</View>
			<View style={styles.slide}>
				<Image source={coastmaterial} style={styles.slideIcon} />
				<Text style={styles.slideTitle}>{I18n.t('guideline_material_header')}</Text>
				<Text style={styles.slideText}>{I18n.t('guideline_material_text')}</Text>
			</View>
			<View style={styles.slide}>
				<Image source={notonlybeaches} style={styles.slideIcon} />
				<Text style={styles.slideTitle}>{I18n.t('guideline_coasts_header')}</Text>
				<Text style={styles.slideText}>{I18n.t('guideline_coasts_text')}</Text>
			</View>
			<View style={styles.slide}>
				<Image source={closeup} style={styles.slideIcon} />
				<Text style={styles.slideTitle}>{I18n.t('guideline_closer_header')}</Text>
				<Text style={styles.slideText}>{I18n.t('guideline_closer_text')}</Text>
			</View>
		</Swiper>
	)
}

export default Guidelines
