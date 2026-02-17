import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

import I18n from "@/i18n/i18n";
import theme from "@/theme";
import Guidelines from "@/components/Guidelines";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  actions: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: theme.safePadding,
    paddingRight: theme.safePadding,
    paddingLeft: theme.safePadding,
  },
  gotItBtn: {
    backgroundColor: theme.primary,
    padding: 10,
    marginBottom: 30,
    color: "white",
    fontSize: 18,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 100,
    textAlign: "center",
  },
  dontShowAgain: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dontShowAgainTxt: {
    marginLeft: 5,
  },
});

const GuidelinesModalScreen = () => {
  const router = useRouter();
  const { action, flowId } = useLocalSearchParams<{
    action?: string | string[];
    flowId?: string | string[];
  }>();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("GOTIT")
      .then((value) => {
        setIsChecked(value === "true");
      })
      .catch((error) => {
        Alert.alert(String(error));
      });
  }, []);

  const gotIt = () => {
    const actionParam = Array.isArray(action) ? action[0] : action;
    const flowIdParam = Array.isArray(flowId) ? flowId[0] : flowId;

    AsyncStorage.setItem("GOTIT", String(isChecked))
      .then(() => {
        if (
          flowIdParam &&
          (actionParam === "camera" || actionParam === "library")
        ) {
          router.dismissTo({
            pathname: "/",
            params: {
              pendingGuidelinesAction: actionParam,
              flowId: flowIdParam,
            },
          });
          return;
        } else {
          router.back();
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.safeAreaView} pointerEvents="box-none">
      <Guidelines />
      <View style={styles.actions}>
        <TouchableOpacity onPress={gotIt}>
          <Text style={styles.gotItBtn}>{I18n.t("got_it")}</Text>
        </TouchableOpacity>
        <View style={styles.dontShowAgain}>
          <MaterialIcons
            name={isChecked ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={theme.primary}
            onPress={() => {
              setIsChecked(!isChecked);
            }}
          />
          <Text style={styles.dontShowAgainTxt}>
            {I18n.t("do_not_show_again")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GuidelinesModalScreen;
