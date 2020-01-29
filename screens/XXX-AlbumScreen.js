import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Dimensions, FlatList, ActivityIndicator } from 'react-native'

import * as MediaLibrary from 'expo-media-library'

import AlbumPure from '../components/AlbumPure'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width } = Dimensions.get('window')
const THUMBSIZE = width / theme.columnsLibrary

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		alignItems: 'center',
	},
	loading: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	continueView: {
		position: 'absolute',
		bottom: 30,
		backgroundColor: 'white',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	continue: {
		backgroundColor: theme.primary,
		padding: 20,

		borderRadius: 5,
		minWidth: '66%',
	},
	continueTxt: {
		color: 'white',
		fontSize: 21,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	fetching: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

const AlbumScreen = ({ navigation }) => {
	const isSafe = useRef(true)
	useEffect(() => {
		// Future proofing for double-invoking
		// effects in Strict Mode.
		isSafe.current = true
		return () => {
			isSafe.current = false
		}
	}, [])

	useEffect(() => {
		// alert('fetching gotit')
		async function fetchGotItStorage() {
			return AsyncStorage.getItem('GOTIT')
		}

		fetchGotItStorage()
			.then(value => {
				if (isSafe.current) {
					let val
					switch (value) {
						case null:
							navigation.navigate('Guidelines')
							break
						case 'false':
							navigation.navigate('Guidelines')
							break
						case 'true':
							// openImagePicker()
							break
						default:
							navigation.navigate('Guidelines')
							break
					}

					return val
				}
			})
			.catch(error => {
				if (isSafe.current) {
					alert(error)
				}
			})
	}, [])

	const [albumList, setAlbumList] = useState([])
	const [fetching, setFetching] = useState(false)

	useEffect(() => {
		if (isSafe.current) {
			setFetching(true)
		}
		MediaLibrary.getAlbumsAsync()
			.then(results => {
				if (isSafe.current) {
					setAlbumList(results)
					alert(JSON.stringify(results))
					setFetching(false)
					return results
				}
			})
			.catch(error => {
				if (isSafe.current) {
					alert(error)
				}
			})
	}, [])

	return (
		<View style={styles.safeAreaView}>
			{!fetching && (
				<FlatList
					data={albumList}
					renderItem={({ item }) => {
						return <AlbumPure album={item} />
					}}
					keyExtractor={item => item.id}
					numColumns={theme.columnsLibrary}
					horizontal={false}
					getItemLayout={(data, index) => ({ length: THUMBSIZE, offset: THUMBSIZE * index, index })}
					removeClippedSubviews
					maxToRenderPerBatch={10}
					updateCellsBatchingPeriod={50}
					initialNumToRender={40}
					windowSize={1}
				/>
			)}
			{fetching && (
				<View style={styles.fetching} pointerEvents="none">
					<ActivityIndicator size="large" color="black" />
				</View>
			)}
		</View>
	)
}

export default AlbumScreen
