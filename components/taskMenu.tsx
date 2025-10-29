import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as React from "react";
import { View, Text } from "react-native";
import { Divider, Menu } from "react-native-paper";

import { Task } from "@/app/types/types"; // Importing Task interface
interface TaskMenuProps {
  id: number;
  tasks: Task[];
  refreshTask: any;
}

const TaskMenu: React.FC<TaskMenuProps> = ({
  id,
  tasks,
  refreshTask,
}) => {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const deleteTask = async (id: number) => {
    let taskCopy = tasks.filter((item, i) => item.id !== id);
    await AsyncStorage.setItem("tasks", JSON.stringify(taskCopy));

    // task deletion from checked/unchecked storage
    let checkedTasks = await AsyncStorage.getItem("checkedTask");
    let parsedTasks = checkedTasks ? JSON.parse(checkedTasks) : {};
    delete parsedTasks[id];
    await AsyncStorage.setItem("checkedTask", JSON.stringify(parsedTasks));

    refreshTask();
    setVisible(false);
  };

  const togglePin = (id: number) => {
    const updated = [...tasks].map((task) =>
      task.id === id
        ? {
            ...task,
            pinned: !task.pinned,
            modified_at: new Date().toISOString(),
          }
        : task
    );

    AsyncStorage.setItem("tasks", JSON.stringify(updated));
    refreshTask();
    setVisible(false);
  };

  const archive = async (id: number) => {
    try {
      let archived = await AsyncStorage.getItem("archived");
      let archivedTasks = archived ? JSON.parse(archived) : [];

      // pushing the task to be archived into archived tasks array and updating storage
      let found = [...tasks].find((task) => task.id === id);
      if (found) archivedTasks.push(found);
      await AsyncStorage.setItem("archived", JSON.stringify(archivedTasks));

      // removing the task from main tasks array and updating storage
      let taskCopy = tasks.filter((task) => task.id !== id);
      await AsyncStorage.setItem("tasks", JSON.stringify(taskCopy));
      refreshTask();
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="#094568"
            onPress={(e) => {
              e.preventDefault();
              openMenu();
            }}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            router.push(`/task/edit_task?task_id=${id}`);
            setVisible(false);
          }}
          title={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={24}
                color="#094568"
              />
              <Text
                style={{
                  color: "#094568",
                  marginLeft: 8,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                Edit
              </Text>
            </View>
          }
        />
        <Menu.Item
          onPress={() => archive(id)}
          title={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                // name="square-edit-outline"
                name="archive-arrow-down"
                size={24}
                color="#094568"
              />
              <Text
                style={{
                  color: "#094568",
                  marginLeft: 8,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                Archive
              </Text>
            </View>
          }
        />
        <Menu.Item
          onPress={() => togglePin(id)}
          title={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="pin" size={24} color="#094568" />
              <Text
                style={{
                  color: "#094568",
                  marginLeft: 8,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                {[...tasks].find((task) => task.id === id)?.pinned ? "Unpin" : "Pin"}
              </Text>
            </View>
          }
        />
        <Divider />
        <Menu.Item
          onPress={() => deleteTask(id)}
          title={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 15,
              }}
            >
              <MaterialCommunityIcons name="delete" size={24} color="red" />
              <Text
                style={{
                  color: "red",
                  marginLeft: 8,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                Delete
              </Text>
            </View>
          }
        />
      </Menu>
    </View>
  );
};

export default TaskMenu;
