import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import I18n from '../i18n/i18n'
import theme from '../theme'

const crslrLogo = require('../assets/images/logos/crslr.png')
const uniLogo = require('../assets/images/logos/CAU.png')
const foLogo = require('../assets/images/logos/Cluster-of-Excellence-The-Future-Ocean.jpg')

const ceremaLogo = require('../assets/images/logos/cerema.jpg')
const planet2084Logo = require('../assets/images/logos/planet2084.png')

const geoSaisonLogo = require('../assets/images/logos/geo-saison.png')

const nassos = require('../assets/images/team/nassos.jpg')
const claudia = require('../assets/images/team/claudia.jpg')
const maureen = require('../assets/images/team/maureen.jpg')

const styles = StyleSheet.create({
	view: {
		flex: 1,
		padding: theme.padding,
		paddingBottom: theme.comfiPadding,
	},
	logos: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 10,
	},
	logo: {
		margin: 10,
		width: 152,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 20,
	},
	p: {
		marginTop: 10,
		fontSize: 18,
	},
	section: {
		borderTopWidth: 1,
		borderTopColor: '#eee',
		paddingTop: 30,
		paddingBottom: 30,
	},
	sectionHeader: {
		textAlign: 'center',

		fontSize: 18,
		color: theme.primary,
	},
	team: {
		display: 'flex',
		marginBottom: 40,
		marginTop: 40,
	},
	member: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	memberFoto: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginRight: 30,
		flexShrink: 1,
	},
	memberText: {
		flex: 2,
		display: 'flex',
	},
	name: {
		fontWeight: 'bold',
		marginBottom: 3,
	},
	bio: {
		fontSize: 12,
	},
})

const TeamScreen = () => {
	return (
		<ScrollView style={styles.view}>
			<Text style={styles.header}>{I18n.t('about')}</Text>
			<Text style={styles.p}>
				{I18n.t('we_are_app', {
					crslr: 'Coastal Risks and Sea-Level Rise Research Group',
					future_ocean: 'Cluster of Excellence "The Future Ocean"',
				})}
			</Text>
			<View style={styles.team}>
				<View style={styles.member}>
					<Image style={styles.memberFoto} source={nassos} />
					<View style={styles.memberText}>
						<Text style={styles.name}>Athanasios Vafeidis</Text>
						<Text style={styles.bio}>{I18n.t('nassos_bio')}</Text>
					</View>
				</View>
				<View style={styles.member}>
					<Image style={styles.memberFoto} source={claudia} />
					<View style={styles.memberText}>
						<Text style={styles.name}>Claudia Wolff</Text>
						<Text style={styles.bio}>{I18n.t('claudia_bio')}</Text>
					</View>
				</View>
				<View style={styles.member}>
					<Image style={styles.memberFoto} source={maureen} />
					<View style={styles.memberText}>
						<Text style={styles.name}>Maureen Tsakiris</Text>
						<Text style={styles.bio}>{I18n.t('maureen_bio')}</Text>
					</View>
				</View>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionHeader}>{I18n.t('project_by')}:</Text>
				<View style={styles.logos}>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('http://www.crslr.uni-kiel.de/en/people/')}>
						<Image style={styles.logo} source={crslrLogo} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://www.uni-kiel.de/en/')}>
						<Image style={styles.logo} source={uniLogo} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('http://www.futureocean.org/')}>
						<Image style={styles.logo} source={foLogo} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>{I18n.t('collaboration_with')}:</Text>
				<View style={styles.logos}>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://www.cerema.fr/fr')}>
						<Image style={styles.logo} source={ceremaLogo} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://www.planet2084.org/')}>
						<Image style={styles.logo} source={planet2084Logo} />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionHeader}>{I18n.t('featured_by')}:</Text>
				<View style={{ ...styles.logos, paddingBottom: theme.comfiPadding }}>
					<TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://www.geo.de/magazine/17032-thma-geo-saison')}>
						<Image style={styles.logo} source={geoSaisonLogo} />
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	)
}

export default TeamScreen
