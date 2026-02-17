import { Image, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import I18n from "@/i18n/i18n";
import theme from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const logoWhite = require("@/assets/images/logoWhite.png");

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  logoView: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.padding,
    paddingTop: 50,
    paddingBottom: 30,
  },
  logoImage: {
    width: 150,
    height: 89,
    marginBottom: 15,
  },
  headerTxt: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  items: {
    flex: 1,
  },
  bottomDrawer: {
    padding: theme.padding,
    paddingLeft: theme.padding,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  madeWith: {
    fontSize: 14,
    color: theme.waterMap,
  },
  social: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  socialIcon: {
    marginLeft: theme.padding,
  },
});

const version =
  Constants.expoConfig?.version ||
  Constants.manifest2?.extra?.expoClient?.version ||
  "0.0.0";

const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.view}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <View style={styles.logoView}>
          <Image source={logoWhite} style={styles.logoImage} />
          <Text style={styles.headerTxt}>
            {I18n.t("help_science")} {I18n.t("by")}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={[
          styles.bottomDrawer,
          { paddingBottom: Math.max(bottom, theme.padding) },
        ]}
      >
        <Text style={styles.madeWith}>v{version} Made with ❤︎</Text>
        <View style={styles.social}>
          <Ionicons
            onPress={() =>
              Linking.openURL("https://www.facebook.com/coastwards/")
            }
            style={styles.socialIcon}
            size={30}
            name="logo-facebook"
            color={theme.waterMap}
          />
          <Ionicons
            onPress={() => Linking.openURL("https://twitter.com/gocoastwards")}
            style={styles.socialIcon}
            size={30}
            name="logo-twitter"
            color={theme.waterMap}
          />
        </View>
      </View>
    </View>
  );
};

export default AppDrawerContent;
