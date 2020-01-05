import React from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Image, View, Platform, Button, Easing, Animated } from 'react-native'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack'
import I18n from '../i18n/i18n'

import { Transition } from 'react-native-reanimated'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import MapScreen from '../screens/MapScreen'
import SettingsScreen from '../screens/SettingsScreen'
import CameraScreen from '../screens/CameraScreen'
import MaterialScreen from '../screens/MaterialScreen'
import HurrayScreen from '../screens/HurrayScreen'
import GuidelinesScreen from '../screens/GuidelinesScreen'
import DrawerScreen from '../screens/DrawerScreen'
import theme from '../theme'

// const turtle = require('../assets/images/icon.png')
// const tinyTurtle = require('../assets/images/tinyTurtle.png')
const tinyTurtleBlue = require('../assets/images/tinyTurtleBlue.png')
// const avatar = require('../assets/images/avatar.png')

/*
const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	logoView: {
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: theme.safePadding,
	},
	logoImage: {
		height: 100,
		width: 100,
		// borderRadius: 50,
	},
})

const Drawer = props => {
	return (
		<View style={styles.safeAreaView}>
			<View style={styles.logoView}>
				<Image source={avatar} style={styles.logoImage} />
			</View>
			<ScrollView>
				<DrawerItems {...props} />
			</ScrollView>
		</View>
	)
}
*/

const DrawerNavigator = createDrawerNavigator(
	{
		Map: {
			screen: MapScreen,
			navigationOptions: {
				drawerLabel: I18n.t('browseBtn_label'),
				drawerIcon: ({ tintColor }) => {
					return <Ionicons size={26} name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'} color={tintColor} />
				},
			},
		},
		Settings: {
			screen: SettingsScreen,
			navigationOptions: {
				drawerLabel: I18n.t('settings'),
				drawerIcon: ({ tintColor }) => {
					return <Ionicons size={26} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} color={tintColor} />
				},
			},
		},
	},
	{
		drawerType: 'back',
		// drawerBackgroundColor: theme.primary,
		// hideStatusBar: true,
		// overlayColor: '#0076b785',
		contentComponent: DrawerScreen,
		contentOptions: {
			activeTintColor: theme.primary,
		},
	}
)

const ContributeStack = createStackNavigator(
	{
		Camera: {
			screen: CameraScreen,

			navigationOptions: ({ navigation }) => ({
				// headerShown: false,
				// title: '1/3',
				headerStyle: {
					backgroundColor: 'white',
					// borderBottomColor: '#333',
					borderBottomWidth: 0,
					// height: 80,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,

					elevation: 3,
				},
				headerTintColor: theme.primary,
				// headerLeft: <HeaderBackButton tintColor={theme.primary} onPress={() => navigation.navigate('Main')} />,
				headerLeft: ({ tintColor }) => {
					return <MaterialIcons onPress={() => navigation.navigate('Main')} style={{ marginLeft: 10 }} size={30} name="close" color={tintColor} />
				},
				headerRight: () => {
					return (
						<MaterialIcons
							onPress={() => {
								navigation.navigate('Guidelines')
							}}
							name="help-outline"
							size={30}
							color={theme.primary}
							style={{ marginRight: 10 }}
						/>
					)
				},
				headerTitle: ({ tintColor }) => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},

				// headerTransparent: true,
			}),
		},
		Material: {
			screen: MaterialScreen,

			navigationOptions: ({ navigation }) => ({
				// headerShown: false,
				// title: '2/3',
				headerStyle: {
					backgroundColor: 'white',
					borderBottomWidth: 0,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.29,
					shadowRadius: 4.65,

					elevation: 7,
				},
				headerTintColor: theme.primary,
				// headerLeft: ({ tintColor }) => {
				// 	return <MaterialIcons onPress={() => navigation.navigate('Main')} style={{ marginLeft: 10 }} size={30} name="close" color={tintColor} />
				// },
				headerTransparent: false,
				headerTitle: ({ tintColor }) => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},
			}),
		},
		Hurray: {
			screen: HurrayScreen,

			navigationOptions: ({ navigation }) => ({
				// headerShown: false,
				// title: '2/3',
				// headerStyle: {
				// 	backgroundColor: 'white',
				// 	borderBottomWidth: 0,
				// 	shadowColor: '#000',
				// 	shadowOffset: {
				// 		width: 0,
				// 		height: 1,
				// 	},
				// 	shadowOpacity: 0.22,
				// 	shadowRadius: 2.22,

				// 	elevation: 3,
				// },
				headerTintColor: theme.primary,
				headerLeft: null,
				headerTransparent: true,
				// headerTitle: ({ tintColor }) => {
				// 	return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				// },
				headerRight: () => {
					return (
						<MaterialIcons
							onPress={() => {
								navigation.navigate('Map')
							}}
							name="close"
							size={30}
							color={theme.primary}
							style={{ marginRight: 10 }}
						/>
					)
				},
			}),
		},
	},
	{
		// mode: 'modal',

		// headerMode: 'screen',
		headerBackTitleVisible: false,
		headerTransitionPreset: 'fade-in-place',
		// cardShadowEnabled: false,
		// cardOverlayEnabled: true,
		headerLayoutPreset: 'center',
		defaultNavigationOptions: {
			// gesturesEnabled: false,
			// headerTitle: () => {
			// 	return <LogoTitle />
			// },
		},
		// transitionConfig: () => ({
		// 	transitionSpec: {
		// 		duration: 200,
		// 		easing: Easing.linear,
		// 		timing: Animated.timing,
		// 	},
		// 	screenInterpolator: sceneProps => {
		// 		const { position, scene } = sceneProps
		// 		const { index } = scene

		// 		const opacity = position.interpolate({
		// 			inputRange: [index - 0.7, index, index + 0.7],
		// 			outputRange: [0.3, 1, 0.3],
		// 		})

		// 		return { opacity }
		// 	},
		// }),
	}
)

const MainNavigator = createStackNavigator(
	{
		Main: {
			screen: DrawerNavigator,
		},
		Contribute: {
			screen: ContributeStack,
		},
		Guidelines: {
			screen: GuidelinesScreen,
		},
	},
	{
		mode: 'modal',
		headerMode: 'none',
		cardOverlayEnabled: true,
		// transparentCard: true,
		defaultNavigationOptions: {
			// gesturesEnabled: false,
		},
	}
)

export default MainNavigator
