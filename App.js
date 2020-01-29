import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

import { createAppContainer } from 'react-navigation'
import { Ionicons } from '@expo/vector-icons'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import MainNavigator from './navigation/MainNavigator'

const icon = require('./assets/images/icon.png')
const anyCoast = require('./assets/guidelines/anycoast.png')
const closeup = require('./assets/guidelines/closeup.png')
const nofaces = require('./assets/guidelines/nofaces.png')
const coastmaterial = require('./assets/guidelines/coastmaterial.png')
const notonlybeaches = require('./assets/guidelines/notonlybeaches.png')
const tinyTurtleBlue = require('./assets/images/tinyTurtleBlue.png')
const logoWhite = require('./assets/images/logoWhite.png')

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
})

const AppNavigator = createAppContainer(MainNavigator)

async function loadResourcesAsync() {
	await Promise.all([
		// AsyncStorage.clear(),
		Asset.loadAsync([icon, anyCoast, closeup, nofaces, coastmaterial, notonlybeaches, tinyTurtleBlue, logoWhite]),
		Font.loadAsync({
			// This is the font that we are using for our tab bar
			...Ionicons.font,
			// We include SpaceMono because we use it in HomeScreen.js. Feel free to
			// remove this if you are not using it in your app
			// 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
		}),
	])
}

function handleLoadingError(error: Error) {
	// In this case, you might want to report the error to your error reporting
	// service, for example Sentry
	console.warn(error)
}

function handleFinishLoading(setLoadingComplete) {
	setLoadingComplete(true)
}

const App = props => {
	const { skipLoadingScreen } = props
	const [isLoadingComplete, setLoadingComplete] = useState(false)

	if (!isLoadingComplete && !skipLoadingScreen) {
		return <AppLoading startAsync={loadResourcesAsync} onError={handleLoadingError} onFinish={() => handleFinishLoading(setLoadingComplete)} />
	}

	return (
		<ActionSheetProvider>
			<View style={styles.container}>
				{Platform.OS === 'ios' && <StatusBar barStyle="default" hidden={false} />}
				<AppNavigator />
			</View>
		</ActionSheetProvider>
	)
}

App.defaultProps = {
	skipLoadingScreen: null,
}

App.propTypes = {
	skipLoadingScreen: PropTypes.bool,
}

export default App
