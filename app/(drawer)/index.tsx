import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WebView from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

import I18n from "@/i18n/i18n";
import theme from "@/theme";
import { setUploadDraft } from "@/state/upload-draft";
import type {
  ExifData,
  PendingGuidelinesAction,
  UploadDraft,
  UploadLocation,
} from "@/state/types";
import turtle from "@/assets/images/tinyTurtleBlue.png";
import { DrawerActions } from "@react-navigation/native";
import { useFaceDetection } from "@infinitered/react-native-mlkit-face-detection";

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, alignItems: "center", justifyContent: "center" },
  webview: { backgroundColor: theme.waterMap, flex: 1, alignSelf: "stretch" },
  webviewInner: { flex: 1, alignSelf: "stretch" },
  uploadButton: {
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  controlsTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    position: "absolute",
    top: theme.safePadding,
    left: 0,
    paddingLeft: theme.padding,
    paddingRight: theme.padding,
  },
  controlsBottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 120,
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingLeft: theme.padding,
    paddingRight: theme.padding,
    backgroundColor: "rgba(255,255,255,0)",
  },
  menuButton: { position: "absolute", left: theme.padding },
  counterControl: {
    position: "absolute",
    left: theme.padding,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  counter: { fontSize: 28, color: theme.primary, marginLeft: 5, flex: 1 },
  refreshIndicator: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  logo: {},
});

const toUploadLocation = (coords: {
  latitude: number;
  longitude: number;
}): UploadLocation => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
});

const MapScreen = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const navigation = useNavigation();
  const { pendingGuidelinesAction, flowId } = useLocalSearchParams<{
    pendingGuidelinesAction?: string | string[];
    flowId?: string | string[];
  }>();
  const lastHandledGuidelinesFlowId = useRef<string | null>(null);
  const [counter, setCounter] = useState<number | false>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showingActionSheet, setShowingActionSheet] = useState(false);
  const [validating, setValidating] = useState(false);

  const faceDetector = useFaceDetection();

  const refreshMap = useCallback(
    (alertUser: boolean) => {
      setRefreshing(true);
      fetch("http://coastwards.org/contribute/count", { method: "GET" })
        .then((response) => response.json())
        .then((responseJson) => {
          const newCount = responseJson.count as number;
          if (newCount !== counter) {
            setCounter(newCount);
          } else if (newCount === responseJson.count && alertUser) {
            Alert.alert(
              I18n.t("no_new_contributions_title"),
              I18n.t("no_new_contributions"),
              [{ text: I18n.t("ok"), style: "cancel" }],
              { cancelable: false },
            );
          }
          setRefreshing(false);
        })
        .catch((error) => {
          setRefreshing(false);
          alert(error);
        });
    },
    [counter],
  );

  useEffect(() => {
    refreshMap(false);
  }, [refreshMap]);

  useEffect(() => {
    faceDetector.initialize();
  }, [faceDetector]);

  const checkForFaces = useCallback(
    (res: ImageManipulator.ImageResult) => {
      const imageUri = res.uri;
      return new Promise((resolve, reject) => {
        faceDetector
          .detectFaces(imageUri)
          .then((value) => {
            if (value && value.faces.length > 0) {
              reject(Error("faces_detected"));
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    [faceDetector],
  );

  const takePicture = useCallback(() => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 1,
      base64: false,
      exif: true,
    };

    const params: Partial<UploadDraft> = {};

    ImagePicker.launchCameraAsync(options)
      .then((result) => {
        const cancelled = result.canceled;
        if (!cancelled) return result;
        throw Error("cancelled");
      })
      .then((res) => {
        setValidating(true);
        const image = res.assets[0];
        params.exif = image.exif as ExifData;
        return image;
      })
      .then((image) =>
        ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 800 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
          },
        ),
      )
      .then((smallImage) => {
        params.uri = smallImage.uri;
        return checkForFaces(smallImage);
      })
      .then(() =>
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        }),
      )
      .then((location) => {
        params.location = toUploadLocation(location.coords);
      })
      .then(() => {
        params.source = "appCamera";
        setUploadDraft(params as UploadDraft);
        router.push("/upload");
        setValidating(false);
      })
      .catch((error) => {
        setValidating(false);
        const message = error?.message as string;
        if (message !== "cancelled") {
          const translatedErrorMessages = ["faces_detected"];
          const msg = translatedErrorMessages.includes(message)
            ? I18n.t(message)
            : message;
          Alert.alert(
            I18n.t("oops"),
            msg,
            [{ text: I18n.t("ok"), style: "cancel" }],
            { cancelable: false },
          );
        }
      });
  }, [checkForFaces, router]);

  const pickImage = useCallback(() => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 1,
      base64: false,
      exif: true,
    };
    const params: Partial<UploadDraft> = {};

    ImagePicker.launchImageLibraryAsync(options)
      .then((result) => {
        const cancelled = result.canceled;
        if (cancelled) throw Error("cancelled");
        return result;
      })
      .then((res) => {
        const image = res.assets[0];
        setValidating(true);
        if (!image.exif) throw Error("exifdata_empty");
        const exif = image.exif as Record<string, any>;
        if (
          !exif.GPSLatitude ||
          !exif.GPSLongitude ||
          !exif.GPSLatitudeRef ||
          !exif.GPSLongitudeRef
        )
          throw Error("location_undefined_app");

        let lat = exif.GPSLatitude as number;
        let long = exif.GPSLongitude as number;
        if (exif.GPSLatitudeRef === "S" && lat > 0) lat = -lat;
        if (exif.GPSLongitudeRef === "W" && long > 0) long = -long;

        params.location = { latitude: lat, longitude: long };
        params.exif = exif;
        return image;
      })
      .then((image: any) =>
        ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 800 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
          },
        ),
      )
      .then((smallImage) => {
        params.uri = smallImage.uri;
        return checkForFaces(smallImage);
      })
      .then(() => {
        params.source = "appLibrary";
        setValidating(false);
        setUploadDraft(params as UploadDraft);
        router.push("/upload");
      })
      .catch((error) => {
        setValidating(false);
        const message = error?.message as string;
        if (message !== "cancelled") {
          const translatedErrorMessages = [
            "faces_detected",
            "exifdata_empty",
            "location_undefined_app",
          ];
          const msg = translatedErrorMessages.includes(message)
            ? I18n.t(message)
            : message;
          Alert.alert(
            I18n.t("oops"),
            msg,
            [{ text: I18n.t("ok"), style: "cancel" }],
            { cancelable: false },
          );
        }
      });
  }, [checkForFaces, router]);

  const fetchGotIt = (action: PendingGuidelinesAction) => {
    return new Promise<boolean>((resolve, reject) => {
      const nextFlowId = Date.now().toString();
      AsyncStorage.getItem("GOTIT")
        .then((value) => {
          if (value === "true") {
            resolve(true);
          } else if (value === null || value === "false") {
            router.push({
              pathname: "/guidelines-modal",
              params: { action, flowId: nextFlowId },
            });
            resolve(false);
          } else {
            reject(value);
          }
        })
        .catch(reject);
    });
  };

  const checkLocationPermission = () => {
    return new Promise<string>((resolve, reject) => {
      Location.requestForegroundPermissionsAsync()
        .then((res) => {
          if (res.status === "granted") resolve(res.status);
          else reject(res.status);
        })
        .catch(reject);
    });
  };

  const checkCameraPermission = () => {
    return new Promise<string>((resolve, reject) => {
      ImagePicker.requestCameraPermissionsAsync()
        .then((results) => {
          if (results.status === "granted") resolve(results.status);
          else reject(results.status);
        })
        .catch(reject);
    });
  };

  const prepareCamera = () => {
    checkLocationPermission()
      .then(checkCameraPermission)
      .then(async () => {
        const canContinue = await fetchGotIt("camera");
        if (canContinue) takePicture();
      })
      .catch((error) => {
        if (error === "denied") {
          Alert.alert(
            I18n.t("permissions_missing_title"),
            I18n.t("permissions_take_picture_missing_msg"),
            [
              { text: I18n.t("ok"), style: "cancel" },
              {
                text: I18n.t("open_settings"),
                onPress: () => {
                  if (Platform.OS === "ios") Linking.openURL("app-settings:");
                  else
                    IntentLauncher.startActivityAsync(
                      (IntentLauncher as any).ACTION_APPLICATION_SETTINGS,
                    );
                },
                style: "cancel",
              },
            ],
            { cancelable: false },
          );
        } else {
          alert(`[prepareCamera] ${error}`);
        }
      });
  };

  const checkPhotoLibraryPermissions = () => {
    return new Promise<string>((resolve, reject) => {
      ImagePicker.requestMediaLibraryPermissionsAsync()
        .then((results) => {
          if (results.status === "granted") resolve(results.status);
          else reject(results.status);
        })
        .catch(reject);
    });
  };

  const preparePhotoLibrary = () => {
    checkPhotoLibraryPermissions()
      .then(async () => {
        const canContinue = await fetchGotIt("library");
        if (canContinue) pickImage();
      })
      .catch((error) => {
        if (error === "denied") {
          Alert.alert(
            I18n.t("permissions_missing_title"),
            I18n.t("permissions_photo_library_missing_msg"),
            [
              { text: I18n.t("ok"), style: "cancel" },
              {
                text: I18n.t("open_settings"),
                onPress: () => {
                  if (Platform.OS === "ios") Linking.openURL("app-settings:");
                  else
                    IntentLauncher.startActivityAsync(
                      (IntentLauncher as any).ACTION_APPLICATION_SETTINGS,
                    );
                },
                style: "cancel",
              },
            ],
            { cancelable: false },
          );
        } else {
          alert(`[preparePhotoLibrary] ${error}`);
        }
      });
  };

  const showActionSheet = () => {
    setShowingActionSheet(true);
    const options = {
      options: [
        I18n.t("take_photo"),
        I18n.t("open_photo_library"),
        I18n.t("cancel"),
      ],
      cancelButtonIndex: 2,
      tintColor: theme.primary,
    };

    showActionSheetWithOptions(options, (index) => {
      setShowingActionSheet(false);
      if (index === 0) prepareCamera();
      else if (index === 1) preparePhotoLibrary();
    });
  };

  useFocusEffect(
    useCallback(() => {
      const actionParam = Array.isArray(pendingGuidelinesAction)
        ? pendingGuidelinesAction[0]
        : pendingGuidelinesAction;
      const flowIdParam = Array.isArray(flowId) ? flowId[0] : flowId;

      if (
        flowIdParam &&
        flowIdParam !== lastHandledGuidelinesFlowId.current &&
        (actionParam === "camera" || actionParam === "library")
      ) {
        lastHandledGuidelinesFlowId.current = flowIdParam;
        if (actionParam === "camera") {
          setTimeout(() => {
            takePicture();
          }, 250);
        }
        if (actionParam === "library") {
          setTimeout(() => {
            pickImage();
          }, 250);
        }
      }

      refreshMap(false);
    }, [refreshMap, pickImage, takePicture, pendingGuidelinesAction, flowId]),
  );

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.webview}>
        {counter && (
          <WebView
            onShouldStartLoadWithRequest={(req) => {
              if (req.url === `http://coastwards.org/map?id=${counter}`)
                return true;
              WebBrowser.openBrowserAsync(req.url);
              return false;
            }}
            style={styles.webviewInner}
            source={{ uri: `http://coastwards.org/map?id=${counter}` }}
            useWebKit
          />
        )}
      </View>
      <View style={styles.controlsTop} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <MaterialIcons name="menu" size={50} color={theme.primary} />
        </TouchableOpacity>
        <Image source={turtle} style={styles.logo} />
      </View>
      <View style={styles.controlsBottom} pointerEvents="box-none">
        {counter && (
          <TouchableOpacity
            style={styles.counterControl}
            onPress={() => {
              refreshMap(true);
            }}
          >
            <View style={styles.refreshIndicator}>
              {!refreshing && (
                <MaterialIcons name="refresh" size={40} color={theme.primary} />
              )}
              {refreshing && (
                <ActivityIndicator size="small" color={theme.primary} />
              )}
            </View>
            <Text style={styles.counter}>{counter}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          disabled={showingActionSheet}
          onPress={() => {
            showActionSheet();
          }}
        >
          {!validating && (
            <MaterialIcons name="add-a-photo" size={30} color="white" />
          )}
          {validating && <ActivityIndicator size="large" color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapScreen;
