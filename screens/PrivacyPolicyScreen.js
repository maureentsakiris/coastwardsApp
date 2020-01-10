import React from 'react'
import { View, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

// import theme from '../theme'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		// padding: theme.padding,
	},
})

const PrivacyPolicyScreen = () => {
	return (
		<View style={styles.safeAreaView}>
			<WebView useWebKit style={styles.webviewInner} source={{ uri: 'http://coastwards.org/privacypolicy' }} />
		</View>
	)
}

export default PrivacyPolicyScreen
