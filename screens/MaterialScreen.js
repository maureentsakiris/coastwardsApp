import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, AsyncStorage, Alert, Image, Dimensions, ScrollView, ActivityIndicator, Platform, StatusBar } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width } = Dimensions.get('window')

const MATERIALS = [
	{
		label: 'Sand',
		value: 'sand',
		color: '#ffc417',
	},
	{
		label: 'Pebble',
		value: 'pebble',
		color: '#bed839',
	},
	{
		label: 'Rock',
		value: 'rock',
		color: '#f46e36',
	},
	{
		label: 'Mud',
		value: 'mud',
		color: '#bb80ef',
	},
	{
		label: 'Ice',
		value: 'ice',
		color: '#ff99ad',
	},
	{
		label: 'Man-made',
		value: 'manmade',
		color: '#24adbb',
	},
	{
		label: 'Not sure',
		value: 'notsure',
		color: '#a9a9a9',
	},
]

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	picture: {
		width,
		height: width,
	},
	formContainer: {
		padding: theme.padding,
	},
	hurray: {
		fontSize: 28,
		fontWeight: '300',
		color: theme.body,
		marginBottom: 15,
	},
	hurraySubtitle: {
		fontSize: 18,
		fontWeight: '600',
		color: theme.body,
	},
	materialBtnsContainer: {
		marginTop: 20,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	materialBtn: {
		// width: '45%',
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'center',
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 15,
		paddingLeft: 15,
		borderRadius: 3,
		borderWidth: 3,
	},
	materialBtnTxt: {
		color: 'white',
		fontSize: 18,
		marginLeft: 5,
	},
})

const MaterialScreen = ({ navigation }) => {
	const materialBtns = MATERIALS.map(material => {
		return (
			<TouchableOpacity key={material.value} style={{ ...styles.materialBtn, borderColor: material.color }}>
				<MaterialIcons name="radio-button-unchecked" size={40} color={material.color} />
				<Text style={{ ...styles.materialBtnTxt, color: material.color }}>{I18n.t(material.value)}</Text>
			</TouchableOpacity>
		)
	})

	// <Image style={styles.picture} source={{ uri: picture.uri }} />
	// alert(JSON.stringify(navigation.state.params))
	const picture = navigation.getParam('picture')
	const location = navigation.getParam('location')

	return (
		<ScrollView style={styles.safeAreaView}>
			<StatusBar barStyle="dark-content" />
			<Image style={styles.picture} source={{ uri: picture.uri }} />
			<View style={styles.formContainer}>
				<Text style={styles.hurray}>{I18n.t('hurray')}</Text>
				<Text style={styles.hurraySubtitle}>{I18n.t('select_material')}</Text>
				<View style={styles.materialBtnsContainer}>{materialBtns}</View>
			</View>
		</ScrollView>
	)
}

export default MaterialScreen
