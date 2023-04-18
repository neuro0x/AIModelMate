import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Navbar() {
  const ref = useRef<Image>(null);
  const nav = useNavigation();
  const [visible, setVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const getIsAuthenticated = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);

      const routeIndex = nav.getState().index;
      const routeName = nav.getState().routeNames[routeIndex];
      // First two routes in the stack are not protected
      // They are the LoginScreen and SignupScreen
      const nonProtectedRoutes = nav.getState().routes.slice(2);
      const isProtectedRoute = nonProtectedRoutes.includes(routeName);

      if (isProtectedRoute) {
        nav.navigate("LoginScreen" as never);
      }
    }
  };

  useEffect(() => {
    getIsAuthenticated();
  });

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: isAuthenticated ? "space-between" : "center",
      }}
    >
      <Image source={require("../assets/logo-full.png")} />

      {isAuthenticated && (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              size={32}
              mode="outlined"
              icon={() => (
                <Image
                  ref={ref}
                  source={require("../assets/logo-light.png")}
                  alt="logo-light"
                />
              )}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              // TODO: show saved conversations
              console.log("Saved Conversations clicked");
              closeMenu();
            }}
            title="Saved Conversations"
            leadingIcon={({ size, color }) => (
              <MaterialCommunityIcons
                name="bookmark"
                size={size}
                color={color}
              />
            )}
          />
          <Menu.Item
            onPress={() => {
              nav.navigate("SettingsScreen" as never);
              closeMenu();
            }}
            title="Settings"
            leadingIcon={({ size, color }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            )}
          />
          <Menu.Item
            onPress={async () => {
              await AsyncStorage.removeItem("token");
              nav.navigate("LoginScreen" as never);
              closeMenu();
            }}
            title="Sign Out"
            leadingIcon={({ size, color }) => (
              <MaterialCommunityIcons name="logout" size={size} color={color} />
            )}
          />
        </Menu>
      )}
    </View>
  );
}
