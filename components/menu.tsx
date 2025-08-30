import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { Divider, Menu } from "react-native-paper";

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Pressable onPress={() => setVisible(true)} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="#fff" />
        </Pressable>
      }
    >
      <Menu.Item
        onPress={() => {
          router.push("/task/task_form");
          setVisible(false);
        }}
        title="Add New Task"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setVisible(false);
        }}
        title="Completed Tasks"
      />
      <Menu.Item
        onPress={() => {
          router.push("/task/archive");
          setVisible(false);
        }}
        title="Archives"
      />
    </Menu>
  );
};

export default HeaderMenu;
