import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import I18n from '../i18n/i18n'; 

export default function ShareScreen() {
  return (
    <View style={styles.container}>
    	<Text>Share</Text>
    </View>
  );
}

ShareScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
