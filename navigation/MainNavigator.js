import React from 'react'
import { StyleSheet, Image, View, Text, Linking } from 'react-native'
import Constants from 'expo-constants'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'

import I18n from '../i18n/i18n'

import MapScreen from '../screens/MapScreen'
import UploadScreen from '../screens/UploadScreen'
import HurrayScreen from '../screens/HurrayScreen'
import GuidelinesModalScreen from '../screens/GuidelinesModalScreen'
import HowScreen from '../screens/HowScreen'
import TeamScreen from '../screens/TeamScreen'
import GuidelinesScreen from '../screens/GuidelinesScreen'
import FeedbackScreen from '../screens/FeedbackScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen'

import theme from '../theme'

const logoWhite = require('../assets/images/logoWhite.png')
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
		paddingBottom: theme.padding + 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	social: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	socialIcon: {
		marginLeft: theme.padding,
	},
	madeWith: {
		fontSize: 14,
		color: theme.waterMap,
	},
	headerTitleImg: {
		width: 40,
		height: 17,
	},
	menuIcon: {
		marginLeft: 10,
	},
	closeIcon: {
		marginRight: 10,
	},
})

const appVersion = (Constants.expoConfig && Constants.expoConfig.version) || ''

const DrawerContent = props => {
	return (
		<View style={styles.view}>
			<DrawerContentScrollView {...props} style={styles.scrollView} contentContainerStyle={{ paddingTop: 0 }}>
				<View style={styles.logoView}>
					<Image source={logoWhite} style={styles.logoImage} />
					<Text style={styles.headerTxt}>
						{I18n.t('help_science')} {I18n.t('by')}
					</Text>
				</View>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			<View style={styles.bottomDrawer}>
				<Text style={styles.madeWith}>v{appVersion} Made with ❤︎</Text>
				<View style={styles.social}>
					<Ionicons onPress={() => Linking.openURL('https://www.facebook.com/coastwards/')} style={styles.socialIcon} size={30} name="logo-facebook" color={theme.waterMap} />
					<Ionicons onPress={() => Linking.openURL('https://twitter.com/gocoastwards')} style={styles.socialIcon} size={30} name="logo-twitter" color={theme.waterMap} />
				</View>
			</View>
		</View>
	)
}

const HeaderTitle = () => <Image style={styles.headerTitleImg} source={tinyTurtleBlue} />

const stackScreenOptions = ({ navigation }) => ({
	headerStyle: {
		backgroundColor: 'white',
	},
	headerShadowVisible: true,
	headerTintColor: theme.primary,
	headerTitleAlign: 'center',
	headerTitle: HeaderTitle,
	headerLeft: ({ tintColor }) => <MaterialIcons onPress={() => navigation.openDrawer()} style={styles.menuIcon} size={30} name="menu" color={tintColor || theme.primary} />,
})

const makeStack = (name, Component) => {
	const Stack = createNativeStackNavigator()
	const StackComponent = () => (
		<Stack.Navigator screenOptions={stackScreenOptions}>
			<Stack.Screen name={name} component={Component} />
		</Stack.Navigator>
	)
	StackComponent.displayName = `${name}Stack`
	return StackComponent
}

const HowStack = makeStack('HowMain', HowScreen)
const TeamStack = makeStack('TeamMain', TeamScreen)
const GuidelinesStack = makeStack('GuidelinesMain', GuidelinesScreen)
const FeedbackStack = makeStack('FeedbackMain', FeedbackScreen)
const PrivacyPolicyStack = makeStack('PrivacyPolicyMain', PrivacyPolicyScreen)

const Drawer = createDrawerNavigator()

const DrawerNavigator = () => (
	<Drawer.Navigator
		drawerContent={props => <DrawerContent {...props} />}
		screenOptions={{
			headerShown: false,
			drawerType: 'back',
			drawerStyle: { backgroundColor: theme.primary },
			drawerInactiveTintColor: theme.waterMap,
			drawerActiveTintColor: 'white',
			drawerActiveBackgroundColor: '#01659c',
		}}
	>
		<Drawer.Screen
			name="Map"
			component={MapScreen}
			options={{
				drawerLabel: I18n.t('map'),
				drawerIcon: ({ color }) => <Ionicons size={26} name="globe-outline" color={color} />,
			}}
		/>
		<Drawer.Screen
			name="How"
			component={HowStack}
			options={{
				drawerLabel: I18n.t('how'),
				drawerIcon: ({ color }) => <FontAwesome size={26} name="question-circle" color={color} />,
			}}
		/>
		<Drawer.Screen
			name="Guidelines"
			component={GuidelinesStack}
			options={{
				drawerLabel: I18n.t('any_picture_title'),
				drawerIcon: ({ color }) => <MaterialIcons size={26} name="photo-camera" color={color} />,
			}}
		/>
		<Drawer.Screen
			name="Team"
			component={TeamStack}
			options={{
				drawerLabel: I18n.t('about'),
				drawerIcon: ({ color }) => <MaterialIcons size={26} name="people" color={color} />,
			}}
		/>
		<Drawer.Screen
			name="Feedback"
			component={FeedbackStack}
			options={{
				drawerLabel: I18n.t('feedback'),
				drawerIcon: ({ color }) => <MaterialIcons size={26} name="feedback" color={color} />,
			}}
		/>
		<Drawer.Screen
			name="PrivacyPolicy"
			component={PrivacyPolicyStack}
			options={{
				drawerLabel: I18n.t('privacy_policy'),
				drawerIcon: ({ color }) => <MaterialIcons size={26} name="lock" color={color} />,
			}}
		/>
	</Drawer.Navigator>
)

const UploadStack = createNativeStackNavigator()

const closeToMap = navigation => <MaterialIcons onPress={() => navigation.navigate('Main', { screen: 'Map' })} name="close" size={30} color={theme.primary} style={styles.closeIcon} />

const UploadNavigator = () => (
	<UploadStack.Navigator
		screenOptions={{
			gestureEnabled: false,
			headerTintColor: theme.primary,
			headerTitleAlign: 'center',
			headerBackVisible: false,
			animation: 'fade',
		}}
	>
		<UploadStack.Screen
			name="Upload"
			component={UploadScreen}
			options={({ navigation }) => ({
				headerStyle: { backgroundColor: 'white' },
				headerShadowVisible: true,
				headerTitle: HeaderTitle,
				headerRight: () => closeToMap(navigation),
			})}
		/>
		<UploadStack.Screen
			name="Hurray"
			component={HurrayScreen}
			options={({ navigation }) => ({
				headerTransparent: true,
				headerTitle: '',
				headerRight: () => closeToMap(navigation),
			})}
		/>
	</UploadStack.Navigator>
)

const RootStack = createNativeStackNavigator()

const MainNavigator = () => (
	<RootStack.Navigator
		screenOptions={{
			headerShown: false,
			presentation: 'modal',
			gestureEnabled: false,
		}}
	>
		<RootStack.Screen name="Main" component={DrawerNavigator} />
		<RootStack.Screen name="UploadFlow" component={UploadNavigator} />
		<RootStack.Screen name="GuidelinesModal" component={GuidelinesModalScreen} />
	</RootStack.Navigator>
)

export default MainNavigator
