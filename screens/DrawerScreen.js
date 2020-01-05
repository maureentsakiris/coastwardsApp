import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions } from 'react-native'
import { Video } from 'expo-av'
import Swiper from 'react-native-swiper'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

const turtleWhite = require('../assets/images/turtleWhite.png')
const video = require('../assets/video/coastwards.mov')

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	logoView: {
		// height: 120,
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.padding,
		paddingTop: 50,
		paddingBottom: 20,
		backgroundColor: theme.primary,
	},
	logoImage: {
		width: 150,
		height: 89,
		marginBottom: 15,
		// borderRadius: 50,
	},
	headerTxt: {
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		color: 'white',
	},
	videoView: {
		padding: theme.padding,
		height: 200,
	},
	video: {
		flex: 1,
		width: '100%',
		height: 100,
	},
})

const DrawerScreen = ({ navigation }) => {
	return (
		<View style={styles.safeAreaView}>
			<View style={styles.logoView}>
				<Image source={turtleWhite} style={styles.logoImage} />
				<Text style={styles.headerTxt}>{I18n.t('help_science')}</Text>
				<Text style={styles.headerTxt}>{I18n.t('by')}</Text>
			</View>
		</View>
	)
}

export default DrawerScreen
