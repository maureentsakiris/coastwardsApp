import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import MaterialScreen from "@/components/MaterialScreen";
import { consumeUploadDraft } from "@/state/upload-draft";

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: { textAlign: "center", marginBottom: 16 },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#0076b7",
  },
  backBtnTxt: { color: "white", fontWeight: "600" },
});

const UploadScreen = () => {
  const router = useRouter();
  const draft = consumeUploadDraft();
  const source = "app";

  const navigationCompat = {
    navigate: (screen: string) => {
      if (screen === "Hurray") {
        router.push("/upload/hurray");
      }
    },
  };

  if (!draft?.uri || !draft.location || !draft.exif) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>
          Upload session expired. Start again from map.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backBtnTxt}>Back to map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeAreaView}>
      <MaterialScreen
        navigation={navigationCompat}
        uri={draft.uri}
        location={draft.location}
        exif={draft.exif}
        source={source}
        landingSheet="Hurray"
      />
    </View>
  );
};

export default UploadScreen;
