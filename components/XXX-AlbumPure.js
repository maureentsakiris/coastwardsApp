import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ImageBackground, StyleSheet, Dimensions, View, ActivityIndicator, TouchableHighlight, AsyncStorage, Alert, Text } from 'react-native'
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
})

class Asset extends PureComponent {
	static propTypes = {
		album: PropTypes.object.isRequired,
		onSelect: PropTypes.func.isRequired,
	}

	static defaultProps = {
		// selected: false,
	}

	constructor() {
		super()
		this.state = {
			fetching: false,
		}
	}

	componentDidMount() {
		this.setState({ mounted: true })
	}

	componentWillUnmount() {
		this.setState({ mounted: false })
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

	render() {
		const { album } = this.props
		const { fetching } = this.state
		const { title } = album

		return (
			<TouchableHighlight
				style={styles.thumb}
				onPress={() => {
					this.selectMe()
				}}
				activeOpacity={0.6}
				disabled={fetching}
			>
				<Text>{title}</Text>
			</TouchableHighlight>
		)
	}
}

export default Asset
