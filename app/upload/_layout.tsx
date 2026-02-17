import { Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import theme from "@/theme";

const tinyTurtleBlue = require("@/assets/images/tinyTurtleBlue.png");

const UploadLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={
        { headerTitleAlign: "center", gestureEnabled: false } as any
      }
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "white",
            borderBottomWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 7,
          } as any,
          headerTintColor: theme.primary,
          headerTitle: () => (
            <Image style={{ width: 40, height: 17 }} source={tinyTurtleBlue} />
          ),
          headerRight: () => (
            <MaterialIcons
              onPress={() => router.replace("/")}
              name="close"
              size={30}
              color={theme.primary}
              style={{ marginRight: 10 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="hurray"
        options={{
          title: "",
          headerLeft: () => null,
          headerTransparent: true,
          headerTintColor: theme.primary,
          headerRight: () => (
            <MaterialIcons
              onPress={() => router.replace("/")}
              name="close"
              size={30}
              color={theme.primary}
              style={{ marginRight: 10 }}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default UploadLayout;
