import React from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Image, View, Platform, Button, Easing, Animated } from 'react-native'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack'

import { Transition } from 'react-native-reanimated'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import MapScreen from '../screens/MapScreen'
import SettingsScreen from '../screens/SettingsScreen'
import CameraScreen from '../screens/CameraScreen'
import MaterialScreen from '../screens/MaterialScreen'
import GuidelinesScreen from '../screens/GuidelinesScreen'
import theme from '../theme'

const turtle = require('../assets/images/icon.png')

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
		borderRadius: 50,
	},
})

const Drawer = props => {
	return (
		<View style={styles.safeAreaView}>
			<View style={styles.logoView}>
				<Image source={turtle} style={styles.logoImage} />
			</View>
			<ScrollView>
				<DrawerItems {...props} />
			</ScrollView>
		</View>
	)
}

const DrawerNavigator = createDrawerNavigator(
	{
		Map: {
			screen: MapScreen,
			navigationOptions: {
				drawerLabel: 'Maaaaaap',
				drawerIcon: ({ tintColor }) => {
					return <Ionicons size={26} name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'} color={tintColor} />
				},
			},
		},
		Settings: {
			screen: SettingsScreen,
			navigationOptions: {
				drawerLabel: 'Seeeeetings',
				drawerIcon: ({ tintColor }) => {
					return <Ionicons size={26} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} color={tintColor} />
				},
			},
		},
	},
	{
		drawerType: 'back',
		// hideStatusBar: true,
		// overlayColor: '#0076b785',
		contentComponent: Drawer,
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
					backgroundColor: 'black',

					borderBottomWidth: 0,
					// height: 80,
				},
				headerTintColor: 'white',
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
							color="white"
							style={{ marginRight: 10 }}
						/>
					)
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
				},
				headerTintColor: theme.primary,
				headerLeft: ({ tintColor }) => {
					return <MaterialIcons onPress={() => navigation.navigate('Main')} style={{ marginLeft: 10 }} size={30} name="close" color={tintColor} />
				},
				// headerTransparent: true,
			}),
		},
	},
	{
		// mode: 'modal',
		headerMode: 'float',
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
	}
)

const LogoTitle = () => {
	return <Image source={turtle} style={{ width: 30, height: 30 }} />
}

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
