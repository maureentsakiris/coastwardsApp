import React from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Image, View, Platform } from 'react-native'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import { Ionicons } from '@expo/vector-icons'
import MapScreen from '../screens/MapScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ContributeScreen from '../screens/ContributeScreen'
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

const MainNavigator = createStackNavigator(
	{
		Main: {
			screen: DrawerNavigator,
		},
		Modal: {
			screen: ContributeScreen,
		},
	},
	{
		mode: 'modal',
		headerMode: 'none',
	}
)

export default MainNavigator
