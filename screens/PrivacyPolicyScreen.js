import React from 'react'
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import I18n from '../i18n/i18n'

import theme from '../theme'

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		padding: theme.padding,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 20,
	},
	headerSub: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 20,
	},
	p: {
		marginTop: 10,
		fontSize: 18,
	},
	list: {
		marginTop: 20,
		marginBottom: 10,
	},
	itemView: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	hash: {
		flex: 1,
		marginRight: 10,
	},
	item: {
		fontSize: 18,
		flex: 10,
		// fontWeight: 'bold',
	},
})

const PrivacyPolicyScreen = () => {
	return (
		<ScrollView style={styles.safeAreaView}>
			<Text style={styles.header}>{I18n.t('privacy_policy')}</Text>
			<Text style={styles.p}>Your privacy is of utmost importance to us.</Text>

			<Text style={styles.p}>For this reason, participation was kept completely anonymous and does not require an account.</Text>
			<Text style={styles.p}>The information we collect through the App are:</Text>

			<FlatList
				style={styles.list}
				data={[{ key: 'the image you take through the App, together with its EXIF data' }, { key: 'your location at the time the image was taken' }, { key: 'the coast material you define' }, { key: 'the comment you leave' }, { key: 'your IP Address' }]}
				renderItem={({ item, index }) => (
					<View style={styles.itemView}>
						<MaterialIcons style={styles.hash} size={26} name="check-circle" color={theme.primary} />
						<Text style={styles.item}>{item.key}</Text>
					</View>
				)}
			/>

			<Text style={styles.p}>We collect this information by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</Text>
			<Text style={styles.p}>What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</Text>
			<Text style={styles.p}>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</Text>
			<Text style={styles.p}>Our app may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</Text>
			<Text style={styles.p}>Your continued use of our App will be regarded as acceptance of our practices around privacy and personal information. If you have any questions, feel free to contact us.</Text>
			<Text style={{ ...styles.p, paddingBottom: theme.comfiPadding }}>This policy is effective as of 8 January 2020.</Text>
		</ScrollView>
	)
}

export default PrivacyPolicyScreen
