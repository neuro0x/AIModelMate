import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      return token;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
