import React from "react";
import { View, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchApp from "../assets/illustrations/login-illustration.svg";
import Navbar from "../components/Navbar";
import { getErrorMessage } from "../utils/getErrorMessge";

type RootStackParamList = {
  ChatScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  SettingsScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type LoginScreenRouteProp = RouteProp<RootStackParamList, "LoginScreen">;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

interface Form {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleLogin = async (
    email: string,
    password: string,
    formik: FormikHelpers<Form>
  ) => {
    try {
      const {
        data: { token, user, message },
      } = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      if (!token) {
        Alert.alert("Error", message);
        return;
      }

      formik.resetForm();
      await AsyncStorage.setItem("token", token);
      navigation.navigate("ChatScreen");
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(
          values,
          formik: FormikHelpers<{ email: string; password: string }>
        ) => handleLogin(values.email, values.password, formik)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ gap: 24, padding: 24 }}>
            <Navbar />
            <SearchApp style={{ width: 24 }} />
            <View style={{ gap: 8 }}>
              <View>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && !!errors.email}
                />
                {touched.email && errors.email && (
                  <Text style={{ color: theme.colors.error }}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <TextInput
                  secureTextEntry
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={touched.password && !!errors.password}
                />

                {touched.password && !!errors.password && (
                  <Text style={{ color: theme.colors.error }}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <Button
                onPress={handleSubmit}
                disabled={
                  !values.email ||
                  !values.password ||
                  !!errors.email ||
                  !!errors.password
                }
                mode="contained"
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name="login"
                    size={size}
                    color={color}
                  />
                )}
              >
                Login
              </Button>
            </View>
          </View>
        )}
      </Formik>

      <Button
        mode="text"
        onPress={() => navigation.navigate("SignupScreen")}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="login" size={size} color={color} />
        )}
      >
        Need to create an account?
      </Button>
    </View>
  );
};

export default LoginScreen;
