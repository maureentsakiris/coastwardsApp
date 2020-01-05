import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform, StatusBar, Animated, TextInput, KeyboardAvoidingView, ImageBackground, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const wohoo = require('../assets/images/wohoo.png')
const wohooTurtle = require('../assets/images/wohooTurtle.png')

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.safePadding,
	},
	bg: {
		width,
		height,
		position: 'absolute',
		top: 0,
		left: 0,
	},
	wohooTurtle: {
		width: 200,
		height: 130,
		marginBottom: 20,
	},
	wohoo: {
		fontSize: 28,
		fontWeight: 'bold',
		color: theme.primary,
		textAlign: 'center',
	},
	wohooWait: {
		fontSize: 16,
		color: theme.primary,
		textAlign: 'center',
		marginTop: 20,
	},
	okidoke: {
		backgroundColor: theme.primary,
		padding: 10,
		marginBottom: 30,

		borderRadius: 3,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		minWidth: 100,

		marginTop: 30,
	},
	okidokeTxt: {
		color: 'white',
		fontSize: 18,
		textAlign: 'center',
	},
})

const HurrayScreen = ({ navigation }) => {
	return (
		<View style={styles.safeAreaView}>
			<StatusBar barStyle="dark-content" />
			<ImageBackground style={styles.bg} source={wohoo} />
			<Image style={styles.wohooTurtle} source={wohooTurtle} />
			<Text style={styles.wohoo}>{I18n.t('upload_ok')}</Text>
			<Text style={styles.wohooWait}>({I18n.t('refresh_map')})</Text>
			<TouchableOpacity
				style={styles.okidoke}
				onPress={() => {
					navigation.navigate('Main')
				}}
			>
				<Text style={styles.okidokeTxt}>{I18n.t('ok')}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default HurrayScreen
