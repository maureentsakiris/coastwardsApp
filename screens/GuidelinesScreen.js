import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'
import Guidelines from '../components/Guidelines'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
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

const GuidelinesScreen = ({ navigation }) => {
	const [isChecked, setIsChecked] = useState(false)
	useEffect(() => {
		async function fetchGotItStorage() {
			return AsyncStorage.getItem('GOTIT')
		}

		fetchGotItStorage()
			.then(value => {
				let val
				switch (value) {
					case null:
						setIsChecked(false)
						break
					case 'false':
						setIsChecked(false)
						break
					case 'true':
						setIsChecked(true)
						break
					default:
						setIsChecked(false)
						break
				}

				return val
			})
			.catch(error => {
				Alert.alert(error)
			})
	}, [])

	const gotIt = () => {
		AsyncStorage.setItem('GOTIT', String(isChecked))
			.then(() => {
				navigation.navigate('Contribute')
			})
			.catch(error => {
				Alert.alert(error)
			})
	}

	return (
		<View style={styles.safeAreaView} pointerEvents="box-none">
			<Guidelines />
			<View style={styles.actions}>
				<TouchableOpacity onPress={gotIt}>
					<Text style={styles.gotItBtn}>{I18n.t('got_it')}</Text>
				</TouchableOpacity>
				<View style={styles.dontShowAgain}>
					<MaterialIcons
						name={isChecked ? 'check-box' : 'check-box-outline-blank'}
						size={24}
						color={theme.primary}
						onPress={() => {
							setIsChecked(!isChecked)
						}}
					/>
					<Text style={styles.dontShowAgainTxt}>{I18n.t('do_not_show_again')}</Text>
				</View>
			</View>
		</View>
	)
}

export default GuidelinesScreen
