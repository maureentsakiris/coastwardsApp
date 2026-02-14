import { StyleSheet, View } from "react-native";

import theme from "@/theme";
import Guidelines from "@/components/Guidelines";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: theme.padding,
    paddingBottom: theme.comfiPadding,
  },
});

const GuidelinesScreen = () => {
  return (
    <View style={styles.safeAreaView}>
      <Guidelines />
    </View>
  );
};

export default GuidelinesScreen;
