import React from "react";
import { Alert, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { getToken } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessge";

interface Form {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

const PasswordChange: React.FC = () => {
  const nav = useNavigation();

  const handleSubmit = async (values: Form, formik: FormikHelpers<Form>) => {
    try {
      const token = await getToken();
      if (!token) {
        nav.navigate("LoginScreen" as never);
      }

      const { data } = await axios.put(
        "http://localhost:3001/api/auth/change-password",
        {
          newPassword: values.newPassword,
          currentPassword: values.currentPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", data.message);
      formik.resetForm();
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
      }: FormikProps<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }>) => (
        <View style={{ gap: 8 }}>
          <View>
            <TextInput
              secureTextEntry
              label="Current Password"
              value={values.currentPassword}
              onChangeText={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              error={touched.currentPassword && !!errors.currentPassword}
            />
            {touched.currentPassword && errors.currentPassword && (
              <Text style={{ color: "red" }}>
                {touched.currentPassword && errors.currentPassword}
              </Text>
            )}
          </View>
          <View>
            <TextInput
              secureTextEntry
              label="New Password"
              value={values.newPassword}
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              error={touched.newPassword && !!errors.newPassword}
            />
            {touched.newPassword && errors.newPassword && (
              <Text style={{ color: "red" }}>
                {touched.newPassword && errors.newPassword}
              </Text>
            )}
          </View>
          <View>
            <TextInput
              secureTextEntry
              label="Confirm New Password"
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={touched.confirmPassword && !!errors.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={{ color: "red" }}>
                {touched.confirmPassword && errors.confirmPassword}
              </Text>
            )}
          </View>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-lock"
                size={size}
                color={color}
              />
            )}
          >
            Change Password
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default PasswordChange;
