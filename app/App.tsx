import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SettingsScreen from "./screens/SettingsScreen";
import * as Font from "expo-font";

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Courier: require("./assets/fonts/VT323-Regular.ttf"),
        monospace: require("./assets/fonts/VT323-Regular.ttf"),
      });
      setFontsLoaded(true);
    })();
  }, []);

  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <NavigationContainer theme={CombinedDarkTheme}>
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
