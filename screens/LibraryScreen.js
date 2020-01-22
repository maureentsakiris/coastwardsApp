import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Dimensions, FlatList, ActivityIndicator } from 'react-native'

import * as MediaLibrary from 'expo-media-library'

import AssetPure from '../components/AssetPure'

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

const LibraryScreen = ({ navigation }) => {
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

	const [assetList, setAssetList] = useState([])
	const [fetching, setFetching] = useState(false)

	const getTotalCount = () => {
		return new Promise((resolve, reject) => {
			MediaLibrary.getAssetsAsync()
				.then(results => {
					if (isSafe.current) {
						const { totalCount } = results
						resolve(totalCount)
					}
				})
				.catch(error => {
					if (isSafe.current) {
						reject(error)
					}
				})
		})
	}

	const getAssets = count => {
		return new Promise((resolve, reject) => {
			MediaLibrary.getAssetsAsync({ first: count, sortBy: [[MediaLibrary.SortBy.default, true]] })
				.then(results => {
					if (isSafe.current) {
						const { assets } = results
						resolve(assets)
					}
				})
				.catch(error => {
					if (isSafe.current) {
						reject(error)
					}
				})
		})
	}

	useEffect(() => {
		if (isSafe.current) {
			setFetching(true)
		}
		getTotalCount()
			.then(totalCount => {
				if (isSafe.current) {
					return getAssets(totalCount)
				}
			})
			.then(assets => {
				if (isSafe.current) {
					setFetching(false)
					setAssetList(assets)
					return assets
				}
			})
			.catch(error => {
				if (isSafe.current) {
					alert(error)
				}
			})
	}, [])

	const onBlocked = ({ location, localUri, exif }) => {
		AsyncStorage.getItem('ASSETINVALIDALERT')
			.then(result => {
				if (isSafe.current) {
					if (result !== 'true') {
						let msg = location ? '' : `\n${I18n.t('location_undefined_app')}\n`
						msg += localUri ? '' : `\n${I18n.t('localUri_undefined')}\n`
						msg += exif ? '' : `\n${I18n.t('exifdata_empty')}\n`

						Alert.alert(
							I18n.t('image_not_valid'),
							msg,
							[
								{
									text: I18n.t('ok'),
									style: 'cancel',
								},
								{
									text: I18n.t('do_not_show_again'),
									style: 'cancel',
									onPress: () => {
										AsyncStorage.setItem('ASSETINVALIDALERT', 'true').catch(error => {
											if (isSafe.current) {
												alert(error)
											}
										})
									},
								},
							],
							{ cancelable: false } // Don't allow to cancel by tapping outside
						)
					}
				}
			})
			.catch(error => {
				if (isSafe.current) {
					alert(error)
				}
			})
	}

	const [selected, setSelected] = useState(new Map())

	const onSelect = useCallback(
		({ asset, uri, location, exif }) => {
			if (isSafe.current) {
				const { id } = asset
				const newSelected = new Map(selected)

				if (newSelected.has(id)) {
					newSelected.delete(id)
				} else {
					newSelected.clear()
					newSelected.set(id, { asset, uri, location, exif })
				}

				setSelected(newSelected)
			}
		},
		[selected]
	)

	return (
		<View style={styles.safeAreaView}>
			{!fetching && (
				<FlatList
					data={assetList}
					renderItem={({ item }) => {
						return <AssetPure asset={item} onSelect={onSelect} onBlocked={onBlocked} selected={!!selected.get(item.id)} />
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
					extraData={selected}
				/>
			)}
			{fetching && (
				<View style={styles.fetching} pointerEvents="none">
					<ActivityIndicator size="large" color="black" />
				</View>
			)}
			<View style={styles.continueView}>
				<TouchableOpacity
					onPress={() => {
						const params = { selected }
						navigation.navigate({ routeName: 'MaterialLibrary', params })
					}}
					style={{ ...styles.continue, display: selected.size > 0 ? 'flex' : 'none' }}
					activeOpacity={0.7}
				>
					<Text style={styles.continueTxt}>{I18n.t('continue')}</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default LibraryScreen
