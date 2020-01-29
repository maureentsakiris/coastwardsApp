import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ImageBackground, StyleSheet, Dimensions, View, ActivityIndicator, TouchableHighlight, AsyncStorage, Alert } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import * as ImageManipulator from 'expo-image-manipulator'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import I18n from '../i18n/i18n'
import theme from '../theme'

const { width } = Dimensions.get('window')
const THUMBSIZE = width / theme.columnsLibrary

const styles = StyleSheet.create({
	thumb: {
		width: THUMBSIZE,
		height: THUMBSIZE,
	},
	image: {
		width: '100%',
		height: '100%',
		borderWidth: 1,
		borderColor: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	fetching: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.7)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	thumbDarkBg: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.7)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkView: {
		borderColor: 'white',
		borderWidth: 0.5,
		backgroundColor: 'white',
		borderRadius: 50,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},
	block: {
		width: '100%',
		height: '100%',
		backgroundColor: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.9,
	},
	uploadedIcon: {
		opacity: 0.8,
	},
})

class Asset extends PureComponent {
	static propTypes = {
		asset: PropTypes.object.isRequired,
		onSelect: PropTypes.func.isRequired,
		onBlocked: PropTypes.func.isRequired,
		selected: PropTypes.bool,
	}

	static defaultProps = {
		selected: false,
	}

	constructor() {
		super()
		this.state = {
			fetching: false,
			blocked: false,
			mounted: false,
			uploaded: false,
			// fetched: false,
			// assetLocation: null,
			// assetExif: null,
		}
	}

	componentDidMount() {
		this.setState({ mounted: true })
	}

	componentWillUnmount() {
		this.setState({ mounted: false })
	}

	resizeImage = uri => {
		return new Promise((resolve, reject) => {
			const { mounted } = this.state

			ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: false })
				.then(pic => {
					if (mounted) {
						resolve(pic)
					}
				})
				.catch(error => {
					if (mounted) {
						reject(error)
					}
				})
		})
	}

	fetchAssetInfo = asset => {
		return new Promise((resolve, reject) => {
			const { mounted } = this.state

			MediaLibrary.getAssetInfoAsync(asset)
				.then(result => {
					if (mounted) {
						resolve(result)
					}
				})
				.catch(error => {
					if (mounted) {
						reject(error)
					}
				})
		})
	}

	checkIfAlreadyUploaded = id => {
		return AsyncStorage.getItem(id)
	}

	selectMe = () => {
		const { asset, onSelect, onBlocked } = this.props
		const { id } = asset
		const { mounted } = this.state
		// const { fetched, assetLocation, assetExif } = this.state

		this.setState({ fetching: true })

		let assetInfo

		AsyncStorage.getItem(id)
			.then(result => {
				if (mounted) {
					if (result === 'true') {
						this.setState({ uploaded: true })
						throw Error('already_uploaded')
					}
					return true
				}
			})
			.then(() => {
				return this.fetchAssetInfo(asset)
			})
			.then(result => {
				if (mounted) {
					const { location, localUri, exif } = result

					if (!location || !localUri || !exif) {
						this.setState({ fetching: false })
						this.setState({ blocked: true })
						onBlocked({ location, localUri, exif })
						return false
					}

					assetInfo = result
					return this.resizeImage(localUri)
				}
			})
			.then(resizedImage => {
				if (mounted && resizedImage) {
					this.setState({ fetching: false })
					const { uri } = resizedImage

					const { location, exif } = assetInfo
					onSelect({ asset, uri, location, exif })
				}
			})
			.catch(error => {
				if (mounted) {
					this.setState({ fetching: false })
					const translatedErrorMessages = ['already_uploaded']
					const msg = translatedErrorMessages.includes(error.message) ? I18n.t(error.message) : error.message
					Alert.alert(
						I18n.t('oops'),
						msg,
						[
							{
								text: I18n.t('ok'),
								style: 'cancel',
							},
						],

						{ cancelable: false } // Don't allow to cancel by tapping outside
					)
				}
			})
	}

	render() {
		const { asset, selected } = this.props
		const { fetching, blocked, uploaded } = this.state
		const { uri } = asset

		const showSelected = selected && !fetching

		return (
			<TouchableHighlight
				style={styles.thumb}
				onPress={() => {
					this.selectMe()
				}}
				activeOpacity={0.6}
				disabled={blocked || fetching || uploaded}
			>
				<ImageBackground source={{ uri }} style={styles.image}>
					{fetching && (
						<View style={styles.fetching} pointerEvents="none">
							<ActivityIndicator size="large" color="white" />
						</View>
					)}
					{blocked && (
						<View style={styles.block}>
							<MaterialIcons name="block" size={40} color="rgba(0,0,0,0.1)" />
						</View>
					)}
					{uploaded && (
						<View style={styles.thumbDarkBg} pointerEvents="none">
							<MaterialCommunityIcons style={styles.uploadedIcon} name="cloud-check" size={40} color="white" />
						</View>
					)}
					{showSelected && (
						<View style={styles.thumbDarkBg} pointerEvents="none">
							<View style={styles.checkView}>
								<MaterialIcons style={styles.checkIcon} name="check-circle" size={40} color={theme.primary} />
							</View>
						</View>
					)}
				</ImageBackground>
			</TouchableHighlight>
		)
	}
}

export default Asset
