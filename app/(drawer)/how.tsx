import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

import I18n from "@/i18n/i18n";
import theme from "@/theme";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  video: {
    width,
    height: width * 0.56,
    backgroundColor: "white",
  },
  transcript: {
    padding: theme.padding,
    paddingBottom: theme.comfiPadding,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 20,
  },
  p: {
    marginTop: 10,
    fontSize: 18,
  },
});

const HowScreen = () => {
  const player = useVideoPlayer(
    "http://coastwards.org/assets/coastwards.mp4",
    (currentPlayer) => {
      currentPlayer.loop = false;
      currentPlayer.muted = true;
      currentPlayer.play();
    },
  );

  return (
    <ScrollView style={styles.view}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
      />
      <View style={styles.transcript}>
        <Text style={styles.header}>{I18n.t("how")}</Text>
        <Text style={styles.p}>{I18n.t("in_a_nutshell")}</Text>
        <Text style={styles.p}>{I18n.t("how_it_works")}</Text>
        <Text style={styles.p}>{I18n.t("place_on_map")}</Text>
        <Text style={styles.p}>{I18n.t("determine_coastal_type")}</Text>
        <Text style={styles.p}>{I18n.t("the_more_the_better")}</Text>
        <Text style={styles.p}>{I18n.t("computer_programs")}</Text>
        <Text style={styles.p}>{I18n.t("policy_makers")}</Text>
        <Text style={styles.p}>{I18n.t("best_advice")}</Text>
      </View>
    </ScrollView>
  );
};

export default HowScreen;
