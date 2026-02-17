import { Platform, StatusBar, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  RNMLKitFaceDetectorOptions,
  FaceDetectionProvider,
} from "@infinitered/react-native-mlkit-face-detection";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const FACE_DETECTION_OPTIONS: RNMLKitFaceDetectorOptions = {
  performanceMode: "accurate",
  landmarkMode: false,
  classificationMode: false,
  minFaceSize: 0.01,
  isTrackingEnabled: false,
};

const RootLayout = () => {
  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={styles.container}>
        <FaceDetectionProvider
          options={FACE_DETECTION_OPTIONS}
          deferInitialization
        >
          <StatusBar
            barStyle={Platform.OS === "ios" ? "default" : "dark-content"}
            hidden={false}
          />
          <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="upload" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="guidelines-modal"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </FaceDetectionProvider>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
};

export default RootLayout;
