import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView } from 'react-native'
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import Swiper from 'react-native-swiper'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

const { height } = Dimensions.get('window')

const turtleWhite = require('../assets/images/turtleWhite.png')

const styles = StyleSheet.create({
	safeAreaView: {
		width: '100%',
		height,
		// backgroundColor: theme.primary,
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
	video: {
		// aspectRatio: 1,
		width: 280,
		height: 157,
		backgroundColor: 'white',
	},
})

const DrawerScreen = ({ navigation }) => {
	return (
		<ScrollView style={styles.safeAreaView}>
			<View style={styles.logoView}>
				<Image source={turtleWhite} style={styles.logoImage} />
				<Text style={styles.headerTxt}>{I18n.t('help_science')}</Text>
				<Text style={styles.headerTxt}>{I18n.t('by')}</Text>
			</View>
			<Video style={styles.video} useNativeControls source={{ uri: 'http://coastwards.org/assets/coastwards.mp4' }} rate={1.0} volume={0} isMuted resizeMode="contain" shouldPlay={false} isLooping={false} />
		</ScrollView>
	)
}

export default DrawerScreen
