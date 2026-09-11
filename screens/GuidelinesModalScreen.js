import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'
import Guidelines from '../components/Guidelines'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		paddingTop: theme.safePadding,
		backgroundColor: 'white',
	},
	actions: {
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: theme.safePadding,
		paddingRight: theme.safePadding,
		paddingLeft: theme.safePadding,
	},
	gotItBtn: {
		backgroundColor: theme.primary,
		padding: 10,
		marginBottom: 30,
		color: 'white',
		fontSize: 18,
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
		textAlign: 'center',
	},
	dontShowAgain: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dontShowAgainTxt: {
		marginLeft: 5,
	},
})

const GuidelinesModalScreen = ({ navigation, route }) => {
	const onDismiss = route.params && route.params.onDismiss
	const [isChecked, setIsChecked] = useState(false)

	useEffect(() => {
		AsyncStorage.getItem('GOTIT')
			.then(value => {
				setIsChecked(value === 'true')
				return value
			})
			.catch(error => {
				Alert.alert(String(error))
			})
	}, [])

	const gotIt = () => {
		AsyncStorage.setItem('GOTIT', String(isChecked))
			.then(() => {
				navigation.goBack()
				if (onDismiss) {
					onDismiss()
				}
			})
			.catch(error => {
				alert(error)
			})
	}

	return (
		<View style={styles.safeAreaView}>
			<Guidelines />
			<View style={styles.actions}>
				<TouchableOpacity onPress={gotIt}>
					<Text style={styles.gotItBtn}>{I18n.t('got_it')}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.dontShowAgain} onPress={() => setIsChecked(!isChecked)}>
					<MaterialIcons name={isChecked ? 'check-box' : 'check-box-outline-blank'} size={24} color={theme.primary} />
					<Text style={styles.dontShowAgainTxt}>{I18n.t('do_not_show_again')}</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default GuidelinesModalScreen
