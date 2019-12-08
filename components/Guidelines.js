import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'
import theme from '../theme'

const { width, height } = Dimensions.get('window')

const anycoast = require('../assets/guidelines/anycoast.png')
const closeup = require('../assets/guidelines/closeup.png')
const nofaces = require('../assets/guidelines/nofaces.png')
const coastmaterial = require('../assets/guidelines/coastmaterial.png')
const notonlybeaches = require('../assets/guidelines/notonlybeaches.png')

const styles = StyleSheet.create({
	safeAreaView: {
		width,
		height,
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 3,
	},
	guidelinesInner: {
		flex: 1,
		backgroundColor: 'white',
	},
	swiper: {
		flex: 1,
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: theme.safePadding,
		paddingRight: theme.safePadding,
	},
	slideIcon: {
		width: 150,
		height: 150,
		marginBottom: 20,
	},
	slideTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
	},
	slideText: {
		textAlign: 'center',
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

const Guidelines = () => {
	const [showGuidelines, setShowGuidelines] = useState(false)
	useEffect(() => {
		async function fetchGotItStorage() {
			return AsyncStorage.getItem('GOTIT')
		}

		fetchGotItStorage()
			.then(value => {
				let val
				switch (value) {
					case null:
						val = true
						break
					case 'false':
						val = true
						break
					case 'true':
						val = false
						break
					default:
						val = true
						break
				}
				setShowGuidelines(val)
				return val
			})
			.catch(error => {
				Alert.alert(error)
			})
	}, [])

	const [isChecked, setIsChecked] = useState(false)
	const gotIt = () => {
		AsyncStorage.setItem('GOTIT', String(isChecked))
			.then(() => {
				setShowGuidelines(false)
			})
			.catch(error => {
				Alert.alert(error)
			})
	}

	return (
		<View style={styles.safeAreaView} pointerEvents="box-none">
			<View style={{ ...styles.guidelinesInner, display: showGuidelines ? 'flex' : 'none' }}>
				<View style={styles.swiper}>
					<Swiper showsButtons={false} activeDotColor={theme.primary} loop={false}>
						<View style={styles.slide}>
							<Image source={anycoast} style={styles.slideIcon} />
							<Text style={styles.slideTitle}>{I18n.t('any_picture')}</Text>
							<Text style={styles.slideText}>{I18n.t('any_coast')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={nofaces} style={styles.slideIcon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_faces_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_faces_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={coastmaterial} style={styles.slideIcon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_material_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_material_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={notonlybeaches} style={styles.slideIcon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_coasts_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_coasts_text')}</Text>
						</View>
						<View style={styles.slide}>
							<Image source={closeup} style={styles.slideIcon} />
							<Text style={styles.slideTitle}>{I18n.t('guideline_closer_header')}</Text>
							<Text style={styles.slideText}>{I18n.t('guideline_closer_text')}</Text>
						</View>
					</Swiper>
				</View>
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
		</View>
	)
}

export default Guidelines
