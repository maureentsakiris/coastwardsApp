import { Image } from "react-native";
import Drawer from "expo-router/drawer";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

import I18n from "@/i18n/i18n";
import theme from "@/theme";
import AppDrawerContent from "@/components/AppDrawerContent";

const tinyTurtleBlue = require("@/assets/images/tinyTurtleBlue.png");

const headerStyle = {
  backgroundColor: "white",
  borderBottomWidth: 0,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
};

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerStyle,
        headerTintColor: theme.primary,
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
        ),
        headerLeft: ({ tintColor }) => (
          <MaterialIcons
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 10 }}
            size={30}
            name="menu"
            color={tintColor}
          />
        ),
        drawerType: "back",
        drawerStyle: { backgroundColor: theme.primary },
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: theme.waterMap,
        drawerActiveBackgroundColor: "#01659c",
        gestureEnabled: false,
      })}
      drawerContent={(props) => <AppDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: I18n.t("map"),
          drawerLabel: I18n.t("map"),
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons size={26} name="globe" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="how"
        options={{
          title: I18n.t("how"),
          drawerLabel: I18n.t("how"),
          drawerIcon: ({ color }) => (
            <FontAwesome size={26} name="question-circle" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="guidelines"
        options={{
          title: I18n.t("any_picture_title"),
          drawerLabel: I18n.t("any_picture_title"),
          drawerIcon: ({ color }) => (
            <MaterialIcons size={26} name="photo-camera" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="team"
        options={{
          title: I18n.t("about"),
          drawerLabel: I18n.t("about"),
          drawerIcon: ({ color }) => (
            <MaterialIcons size={26} name="people" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          title: I18n.t("feedback"),
          drawerLabel: I18n.t("feedback"),
          drawerIcon: ({ color }) => (
            <MaterialIcons size={26} name="feedback" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="privacy"
        options={{
          title: I18n.t("privacy_policy"),
          drawerLabel: I18n.t("privacy_policy"),
          drawerIcon: ({ color }) => (
            <MaterialIcons size={26} name="lock" color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
