import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, View } from "react-native";
import { TextInput, Text, useTheme, Button } from "react-native-paper";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";
import { getErrorMessage } from "../utils/getErrorMessge";

interface Form {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const EmailChange: React.FC = () => {
  const theme = useTheme();
  const nav = useNavigation();

  const handleSubmit = async (values: Form, formik: FormikHelpers<Form>) => {
    try {
      const token = await getToken();
      if (!token) {
        nav.navigate("LoginScreen" as never);
        return;
      }

      const { data } = await axios.put(
        "http://localhost:3001/api/auth/change-email",
        { email: values.email },
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
      initialValues={{ email: "" }}
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
      }: FormikProps<{ email: string }>) => (
        <View style={{ gap: 8 }}>
          <View>
            <TextInput
              label="New Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
              <Text style={{ color: "red" }}>
                {touched.email && errors.email}
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
            Update email
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default EmailChange;
