import React, { useRef, useState } from "react";
import { View, ScrollView, Linking, Alert } from "react-native";
import {
  TextInput,
  Text,
  ActivityIndicator,
  useTheme,
  Surface,
  IconButton,
} from "react-native-paper";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Markdown from "@valasolutions/react-native-markdown";
import { getErrorMessage } from "../utils/getErrorMessge";

type RootStackParamList = {
  ChatScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  SettingsScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChatScreen"
>;

type LoginScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const [input, setInput] = useState<string>("");
  const [responses, setResponses] = useState<
    { input: string; output: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>();

  const sendPrompt = async (prompt: string) => {
    setLoading(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }

    const token = await getToken();

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/bot/prompt",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      setResponses((state) => [
        ...state,
        { input: prompt, output: data.message },
      ]);
      setInput("");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleDelete = (index: number) => {
    console.log("index:", index);
    const responsesCopy = JSON.parse(JSON.stringify(responses)) as {
      input: string;
      output: string;
    }[];

    setResponses(
      responsesCopy.slice(0, index).concat(responsesCopy.slice(index + 1))
    );
  };

  const handleSave = async (index: number) => {
    const token = await getToken();

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/bot/prompt",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", data.message);
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  const handleMarkdownLink = (URL: string): boolean => {
    if (/\b(http|https)/.test(URL)) {
      Linking.openURL(URL);
      return true;
    }

    return false;
  };

  return (
    <View
      style={{
        paddingTop: 24,
        paddingHorizontal: 12,
      }}
    >
      <Navbar />
      <ScrollView
        style={{ marginBottom: 20, height: "70%" }}
        ref={scrollViewRef}
      >
        {responses.map((it, index) => (
          <Surface
            key={index + Math.random() * 10000}
            style={{
              marginBottom: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.backdrop,
              borderRadius: theme.roundness,
              shadowRadius: theme.roundness,
            }}
          >
            <Text>
              <Icon name="account" size={20} />: {it.input}
            </Text>
            <Text>
              <Icon name="robot" size={20} />
              ...{" "}
              <Markdown
                mergeStyle
                onLinkPress={handleMarkdownLink}
                style={{
                  body: { color: theme.colors.onSurface },
                  blockquote: {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.onBackground,
                  },
                  blocklink: {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.onBackground,
                  },
                  code_inline: {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.onBackground,
                  },
                  code_block: {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.onBackground,
                  },
                  fence: {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.onBackground,
                  },
                }}
              >
                {it.output}
              </Markdown>
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <IconButton
                size={12}
                icon="delete"
                mode="outlined"
                iconColor={theme.colors.error}
                onPress={() => handleDelete(index)}
              />
              <IconButton
                size={12}
                icon="content-save"
                mode="outlined"
                iconColor={theme.colors.primary}
                onPress={() => handleSave(index)}
              />
            </View>
          </Surface>
        ))}
        {!!responses.length ? (
          <Text>
            <Icon name="account" size={20} />: {input}
          </Text>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Enter a prompt to get the conversation started!
            </Text>
            <View style={{ width: "80%", gap: 8 }}>
              <Text>
                For example, you could tell me to find popular place to visit in
                South America.
              </Text>
            </View>
          </View>
        )}
        {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}
      </ScrollView>

      <TextInput
        label="Enter your message"
        value={input}
        onChangeText={(text) => setInput(text)}
        right={
          <TextInput.Icon
            iconColor={theme.colors.primary}
            onPress={() => sendPrompt(input)}
            icon="send"
          />
        }
      />

      <Text style={{ marginVertical: 8, fontSize: 10 }}>
        <Icon name="frequently-asked-questions" size={20} />: This app is still
        under development and may contain bugs. Additionally, our AI models are
        constantly being improved. Your patience and understanding are
        appreciated as we work to enhance your user experience. Thank you!
      </Text>
    </View>
  );
};

export default ChatScreen;
