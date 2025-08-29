import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { Alert, View } from "react-native";
import { Divider, Menu } from "react-native-paper";

interface Task {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  interval: string;
  tasks: string[];
  pinned?: boolean;
}
interface TaskMenuProps {
  index: number;
  tasks: Task[];
  setTasks: any;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ index, tasks, setTasks }) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const deleteTask = async (ind: number) => {
    let taskCopy = tasks.filter((_, i) => i !== ind);
    await AsyncStorage.setItem("tasks", JSON.stringify(taskCopy));
    setTasks(taskCopy);
    setVisible(false);
  };

  const togglePin = (ind: number) => {
    // const updated = [...tasks].map((task, index) =>
    //   index === ind ? { ...task, pinned: !task.pinned } : task
    // );

    // setTasks(updated);
    // AsyncStorage.setItem("tasks", JSON.stringify(updated));

    const updated = [...tasks].map((task, index) =>
      index === ind ? { ...task, pinned: !task.pinned } : task
    );
    const sorted = [...updated].sort(
      (a, b) => Number(b.pinned) - Number(a.pinned)
    );
    setTasks(sorted);
    AsyncStorage.setItem("tasks", JSON.stringify(sorted));
    setVisible(false);
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
            color="black"
            onPress={(e) => {
              e.preventDefault();
              openMenu();
              Alert.alert("something happend");
            }}
          />
        }
      >
        <Menu.Item
          onPress={() => {}}
          title="Edit"
          leadingIcon="square-edit-outline"
        />
        <Menu.Item
          onPress={() => {}}
          title="Archive"
          leadingIcon="archive-arrow-down"
        />
        <Menu.Item
          onPress={() => togglePin(index)}
          title={tasks[index].pinned ? "Unpin" : "Pin"}
          leadingIcon="pin"
        />
        <Divider />
        <Menu.Item
          onPress={() => deleteTask(index)}
          title="Delete"
          leadingIcon="delete"
        />
      </Menu>
    </View>
  );
};

export default TaskMenu;
