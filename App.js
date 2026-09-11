import 'react-native-gesture-handler'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
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

SplashScreen.preventAutoHideAsync().catch(() => {})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
})

async function loadResourcesAsync() {
	await Promise.all([
		Asset.loadAsync([icon, anyCoast, closeup, nofaces, coastmaterial, notonlybeaches, tinyTurtleBlue, logoWhite]),
		Font.loadAsync({
			...Ionicons.font,
			...MaterialIcons.font,
			...FontAwesome.font,
		}),
	])
}

const App = () => {
	const [isLoadingComplete, setLoadingComplete] = useState(false)

	useEffect(() => {
		loadResourcesAsync()
			.catch(error => {
				console.warn(error)
			})
			.finally(() => {
				setLoadingComplete(true)
			})
	}, [])

	const onLayoutRootView = useCallback(() => {
		if (isLoadingComplete) {
			SplashScreen.hideAsync().catch(() => {})
		}
	}, [isLoadingComplete])

	if (!isLoadingComplete) {
		return null
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<ActionSheetProvider>
					<View style={styles.container} onLayout={onLayoutRootView}>
						<StatusBar style="dark" />
						<NavigationContainer>
							<MainNavigator />
						</NavigationContainer>
					</View>
				</ActionSheetProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

export default App
