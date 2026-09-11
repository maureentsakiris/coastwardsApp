import React from 'react'
import { View, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	webview: {
		flex: 1,
	},
})

const PrivacyPolicyScreen = () => {
	return (
		<View style={styles.safeAreaView}>
			<WebView style={styles.webview} source={{ uri: 'http://coastwards.org/privacypolicy' }} />
		</View>
	)
}

export default PrivacyPolicyScreen
