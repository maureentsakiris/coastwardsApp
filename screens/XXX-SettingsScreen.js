import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { ExpoConfigView } from '@expo/samples'
import { Ionicons } from '@expo/vector-icons'
import theme from '../theme'

const SettingsScreen = ({ navigation }) => {
    /**
     * Go ahead and delete ExpoConfigView and replace it with your content;
     * we just wanted to give you a quick view of your config.
     */
    return (
        <View style={styles.view}>
            <ExpoConfigView />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
})

export default SettingsScreen
