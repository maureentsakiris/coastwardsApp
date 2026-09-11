import React, { useState, useRef } from 'react'
import { Text, View, StyleSheet, Image, FlatList, useWindowDimensions } from 'react-native'

import I18n from '../i18n/i18n'
import theme from '../theme'

const anycoast = require('../assets/guidelines/anycoast.png')
const closeup = require('../assets/guidelines/closeup.png')
const nofaces = require('../assets/guidelines/nofaces.png')
const coastmaterial = require('../assets/guidelines/coastmaterial.png')
const notonlybeaches = require('../assets/guidelines/notonlybeaches.png')

const SLIDES = [
	{ key: 'any', image: anycoast, title: 'any_picture', text: 'any_coast' },
	{ key: 'faces', image: nofaces, title: 'guideline_faces_header', text: 'guideline_faces_text' },
	{ key: 'material', image: coastmaterial, title: 'guideline_material_header', text: 'guideline_material_text' },
	{ key: 'coasts', image: notonlybeaches, title: 'guideline_coasts_header', text: 'guideline_coasts_text' },
	{ key: 'closer', image: closeup, title: 'guideline_closer_header', text: 'guideline_closer_text' },
]

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: theme.padding,
		paddingRight: theme.padding,
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
		maxWidth: 400,
	},
	dots: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 3,
		backgroundColor: 'rgba(0,0,0,.2)',
	},
	dotActive: {
		backgroundColor: theme.primary,
	},
})

const Guidelines = () => {
	const { width } = useWindowDimensions()
	const [index, setIndex] = useState(0)
	const listRef = useRef(null)

	const onMomentumScrollEnd = e => {
		const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
		if (newIndex !== index) {
			setIndex(newIndex)
		}
	}

	return (
		<View style={styles.container}>
			<FlatList
				ref={listRef}
				data={SLIDES}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={onMomentumScrollEnd}
				keyExtractor={item => item.key}
				renderItem={({ item }) => (
					<View style={[styles.slide, { width }]}>
						<Image source={item.image} style={styles.slideIcon} />
						<Text style={styles.slideTitle}>{I18n.t(item.title)}</Text>
						<Text style={styles.slideText}>{I18n.t(item.text)}</Text>
					</View>
				)}
			/>
			<View style={styles.dots}>
				{SLIDES.map((slide, i) => (
					<View key={slide.key} style={[styles.dot, i === index && styles.dotActive]} />
				))}
			</View>
		</View>
	)
}

export default Guidelines
