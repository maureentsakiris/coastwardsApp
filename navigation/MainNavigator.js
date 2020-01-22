import React from 'react'
import { StyleSheet, ScrollView, Image, View, Platform, Text } from 'react-native'
import { Linking } from 'expo'
import Constants from 'expo-constants'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'

import I18n from '../i18n/i18n'

import MapScreen from '../screens/MapScreen'
import CameraScreen from '../screens/CameraScreen'
import LibraryScreen from '../screens/LibraryScreen'
import MaterialLibraryScreen from '../screens/MaterialLibraryScreen'
import MaterialCameraScreen from '../screens/MaterialCameraScreen'
import HurrayScreen from '../screens/HurrayScreen'
import GuidelinesScreen from '../screens/GuidelinesScreen'
import HowScreen from '../screens/HowScreen'
import TeamScreen from '../screens/TeamScreen'
import GuidelinesGalleryScreen from '../screens/GuidelinesGalleryScreen'
import FeedbackScreen from '../screens/FeedbackScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen'

import theme from '../theme'

const turtleWhite = require('../assets/images/turtleWhite.png')
const tinyTurtleBlue = require('../assets/images/tinyTurtleBlue.png')

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	logoView: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.padding,
		paddingTop: 50,
		paddingBottom: 30,
		backgroundColor: theme.primary,
		flex: 1,
	},
	logoImage: {
		width: 150,
		height: 89,
		marginBottom: 15,
	},
	headerTxt: {
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
		color: 'white',
	},
	items: {
		marginBottom: 40,
		flex: 1,
	},
	itemStyle: {},
	iconContainerStyle: {
		flexShrink: 1,
	},
	labelStyle: {
		flex: 1,
		flexGrow: 1,
		marginLeft: 0,
	},
	socialDrawer: {
		display: 'flex',
		flexDirection: 'column',
	},
	followUs: {
		fontSize: 14,
		color: 'white',
		marginRight: 20,
	},
	bottomDrawer: {
		backgroundColor: theme.primary,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		padding: theme.padding,

		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	social: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	socialIcon: {
		marginLeft: theme.padding,
	},
	version: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: 'white',
		alignSelf: 'flex-start',
	},
	madeWith: {
		fontSize: 14,
		color: theme.waterMap,
	},
})

const Drawer = props => {
	return (
		<View style={styles.view}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.logoView}>
					<Image source={turtleWhite} style={styles.logoImage} />
					<Text style={styles.headerTxt}>
						{I18n.t('help_science')} {I18n.t('by')}
					</Text>
				</View>
				<DrawerItems itemsContainerStyle={styles.items} itemStyle={styles.itemStyle} iconContainerStyle={styles.iconContainerStyle} labelStyle={styles.labelStyle} {...props} />
			</ScrollView>
			<View style={styles.bottomDrawer}>
				<Text style={styles.madeWith}>v{Constants.manifest.version} Made with ❤︎</Text>
				<View style={styles.social}>
					<Ionicons onPress={() => Linking.openURL('https://www.facebook.com/coastwards/')} style={styles.socialIcon} size={30} name="logo-facebook" color={theme.waterMap} />
					<Ionicons onPress={() => Linking.openURL('https://twitter.com/gocoastwards')} style={styles.socialIcon} size={30} name="logo-twitter" color={theme.waterMap} />
				</View>
			</View>
		</View>
	)
}

const config = {
	defaultNavigationOptions: ({ navigation }) => ({
		headerStyle: {
			backgroundColor: 'white',
			borderBottomWidth: 0,
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
		headerLeft: ({ tintColor }) => {
			return <MaterialIcons onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }} size={30} name="menu" color={tintColor} />
		},
		headerTitle: () => {
			return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
		},
		headerTitleAlign: 'center',
	}),
}

const HowStack = createStackNavigator(
	{
		How: HowScreen,
	},
	config
)
const TeamStack = createStackNavigator(
	{
		Team: TeamScreen,
	},
	config
)
const GuidelinesStack = createStackNavigator(
	{
		Guidelines2: GuidelinesGalleryScreen,
	},
	config
)
const FeedbackStack = createStackNavigator(
	{
		Feedback: FeedbackScreen,
	},
	config
)
const PrivacyPolicyStack = createStackNavigator(
	{
		PrivacyPolicy: PrivacyPolicyScreen,
	},
	config
)

const DrawerNavigator = createDrawerNavigator(
	{
		Map: {
			screen: MapScreen,
			navigationOptions: {
				drawerLabel: I18n.t('map'),
				drawerIcon: ({ tintColor }) => {
					return <Ionicons size={26} name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'} color={tintColor} />
				},
			},
		},
		How: {
			screen: HowStack,
			navigationOptions: {
				drawerLabel: I18n.t('how'),
				drawerIcon: ({ tintColor }) => {
					return <FontAwesome size={26} name="question-circle" color={tintColor} />
				},
			},
		},
		Guidelines2: {
			screen: GuidelinesStack,
			navigationOptions: {
				drawerLabel: I18n.t('any_picture_title'),
				drawerIcon: ({ tintColor }) => {
					return <MaterialIcons size={26} name="photo-camera" color={tintColor} />
				},
			},
		},
		Team: {
			screen: TeamStack,
			navigationOptions: {
				drawerLabel: I18n.t('about'),
				drawerIcon: ({ tintColor }) => {
					return <MaterialIcons size={26} name="people" color={tintColor} />
				},
			},
		},
		Feedback: {
			screen: FeedbackStack,
			navigationOptions: {
				drawerLabel: I18n.t('feedback'),
				drawerIcon: ({ tintColor }) => {
					return <MaterialIcons size={26} name="feedback" color={tintColor} />
				},
			},
		},
		PrivacyPolicy: {
			screen: PrivacyPolicyStack,
			navigationOptions: {
				drawerLabel: I18n.t('privacy_policy'),
				drawerIcon: ({ tintColor }) => {
					return <MaterialIcons size={26} name="lock" color={tintColor} />
				},
			},
		},
	},
	{
		drawerType: 'back',
		drawerBackgroundColor: theme.primary,
		contentComponent: Drawer,
		contentOptions: {
			inactiveTintColor: theme.waterMap,
			activeTintColor: 'white',
			activeBackgroundColor: '#01659c',
		},
	}
)

const ContributeStack = createStackNavigator(
	{
		Camera: {
			screen: CameraScreen,
			navigationOptions: ({ navigation }) => ({
				headerStyle: {
					backgroundColor: 'white',
					borderBottomWidth: 0,
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
				headerTitle: () => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},
			}),
		},
		MaterialCamera: {
			screen: MaterialCameraScreen,
			navigationOptions: () => ({
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
				headerTransparent: false,
				headerTitle: () => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},
			}),
		},
		HurrayCamera: {
			screen: HurrayScreen,

			navigationOptions: ({ navigation }) => ({
				headerTintColor: theme.primary,
				headerLeft: null,
				headerTransparent: true,
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
		headerBackTitleVisible: false,
		headerTransitionPreset: 'fade-in-place',
		headerLayoutPreset: 'center',
		defaultNavigationOptions: {
			gesturesEnabled: false,
		},
	}
)

const ContributeLibraryStack = createStackNavigator(
	{
		Library: {
			screen: LibraryScreen,
			navigationOptions: ({ navigation }) => ({
				headerStyle: {
					backgroundColor: 'white',
					borderBottomWidth: 0,
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
				headerTitle: () => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},
			}),
		},
		MaterialLibrary: {
			screen: MaterialLibraryScreen,
			navigationOptions: () => ({
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
				headerTransparent: false,
				headerTitle: () => {
					return <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
				},
			}),
		},
		HurrayLibrary: {
			screen: HurrayScreen,

			navigationOptions: ({ navigation }) => ({
				headerTintColor: theme.primary,
				headerLeft: null,
				headerTransparent: true,
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
		headerBackTitleVisible: false,
		headerTransitionPreset: 'fade-in-place',
		headerLayoutPreset: 'center',
		defaultNavigationOptions: {
			gesturesEnabled: false,
		},
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
		ContributeLibrary: {
			screen: ContributeLibraryStack,
		},
		Guidelines: {
			screen: GuidelinesScreen,
		},
	},
	{
		mode: 'modal',
		headerMode: 'none',
		defaultNavigationOptions: {
			gesturesEnabled: false,
		},
	}
)

export default MainNavigator
