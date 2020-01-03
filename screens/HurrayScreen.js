import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform, StatusBar, Animated, TextInput, KeyboardAvoidingView, ImageBackground, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		alignItems: 'center',
	},
})

const HurrayScreen = ({ navigation }) => {
	return (
		<View style={styles.safeAreaView}>
			<StatusBar barStyle="dark-content" />

			<Text>HURRAY</Text>
		</View>
	)
}

export default HurrayScreen
