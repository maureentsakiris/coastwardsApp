import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  webviewInner: {
    flex: 1,
  },
});

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.safeAreaView}>
      <WebView
        useWebKit
        style={styles.webviewInner}
        source={{ uri: "http://coastwards.org/privacypolicy" }}
      />
    </View>
  );
};

export default PrivacyPolicyScreen;
