import React from "react";
import { Button, IconButton, Title, useTheme } from "react-native-paper";
import { View } from "react-native";
import ModelSelection from "../components/ModelSelection";
import EmailChange from "../components/EmailChange";
import PasswordChange from "../components/PasswordChange";
import Navbar from "../components/Navbar";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RootStackParamList = {
  ChatScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  SettingsScreen: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SettingsScreen"
>;

type SettingsScreenRouteProp = RouteProp<RootStackParamList, "SettingsScreen">;

type Props = {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
};

const SettingsScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingTop: 24,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      <Navbar />
      <Title>Model Selection</Title>
      <ModelSelection />

      <Title>Email</Title>
      <EmailChange />

      <Title>Password</Title>
      <PasswordChange />

      <Button
        buttonColor={theme.colors.secondaryContainer}
        textColor={theme.colors.onSecondaryContainer}
        onPress={() => navigation.goBack()}
        icon={({ size, color }) => <MaterialCommunityIcons />}
      >
        Back
      </Button>
    </View>
  );
};

export default SettingsScreen;
