import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import I18n from '../i18n/i18n'; 

export default function ShareScreen() {
  return (
    <WebView style={styles.container} source={{ uri: 'http://coastwards.org' }} onNavigationStateChange={this.handleWebViewNavigationStateChange} />
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
