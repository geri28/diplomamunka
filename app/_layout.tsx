import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";
import { themeColor } from "../src/controller/utils/constants";

const RootLayout = () => {
  const pathname = usePathname();

  const isSchedulePage = pathname.includes("schedule");

  const logoOpacity = isSchedulePage ? 0.45 : 1;
  return (
    <ImageBackground
      source={require("../assets/images/udlogo.png")}
      resizeMode="contain"
      style={style.backgroundImage}
      imageStyle={[style.backgroundImageContent, { opacity: logoOpacity }]}
    >
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "transparent" },
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: themeColor.primary },
          headerTintColor: themeColor.secondory,
          tabBarStyle: {
            backgroundColor: themeColor.primary,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: themeColor.secondory,
          tabBarInactiveTintColor: themeColor.defaultColor,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Debreceni Egyetem",
            tabBarLabel: "Térkép",
            tabBarIcon: ({ color }) => (
              <Ionicons name="map" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Órarendem",
            tabBarLabel: "Órarend",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ImageBackground>
  );
};

export default RootLayout;

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: themeColor.defaultColor,
  },
  backgroundImageContent: {
    opacity: 1,
    width: "60%",
    height: "40%",
    left: "21%",
    top: "30%",
  },
});
