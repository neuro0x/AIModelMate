import axios from "axios";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Menu, Divider } from "react-native-paper";
import { getToken } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";

type Model = {
  id: string;
  name: string;
};

const DEFAULT_MODEL = { id: "default", name: "GPT-4-All Lora Quantized" };

const ModelSelection: React.FC = () => {
  const nav = useNavigation();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>(DEFAULT_MODEL);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const token = await getToken();
      if (!token) {
        nav.navigate("LoginScreen" as never);
        return;
      }

      const { data } = await axios.get("http://localhost:3001/api/llm", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModels(data);
    } catch (error) {
      setModels([DEFAULT_MODEL]);
      console.error(error);
    }
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    setMenuVisible(false);
  };

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button onPress={() => setMenuVisible(true)}>
            {selectedModel ? selectedModel.name : "Select a Model"}
          </Button>
        }
      >
        {models.map((model) => (
          <React.Fragment key={model.id}>
            <Menu.Item
              dense
              onPress={() => handleModelSelect(model)}
              title={model.name}
            />
            <Divider />
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
};

export default ModelSelection;
