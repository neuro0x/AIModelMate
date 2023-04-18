import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { Alert, View } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Yup from "yup";
import SearchApp from "../assets/illustrations/login-illustration.svg";
import Navbar from "../components/Navbar";
import { StackNavigationProp } from "@react-navigation/stack";
import { getErrorMessage } from "../utils/getErrorMessge";

type RootStackParamList = {
  ChatScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  SettingsScreen: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignupScreen"
>;

type SignupScreenRouteProp = RouteProp<RootStackParamList, "SignupScreen">;

type Props = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignupScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const theme = useTheme();

  const handleLogin = async (
    email: string,
    password: string,
    confirmPassword: string,
    formik: FormikHelpers<{
      email: string;
      password: string;
      confirmPassword: string;
    }>
  ) => {
    try {
      const {
        data: { token, user, message },
      } = await axios.post("http://localhost:3001/api/auth/register", {
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
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={SignupSchema}
        onSubmit={(
          values,
          formik: FormikHelpers<{
            email: string;
            password: string;
            confirmPassword: string;
          }>
        ) =>
          handleLogin(
            values.email,
            values.password,
            values.confirmPassword,
            formik
          )
        }
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
                {touched.email && !!errors.email && (
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

              <View>
                <TextInput
                  secureTextEntry
                  label="Confirm password"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                />
                {touched.confirmPassword && !!errors.confirmPassword && (
                  <Text style={{ color: theme.colors.error }}>
                    {errors.confirmPassword}
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
                Sign up
              </Button>
            </View>
          </View>
        )}
      </Formik>

      <Button
        mode="text"
        onPress={() => navigation.navigate("LoginScreen")}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="login" size={size} color={color} />
        )}
      >
        Already have an account?
      </Button>
    </View>
  );
};

export default SignupScreen;
