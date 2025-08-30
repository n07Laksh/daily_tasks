import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
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

export default function ArchivedTaskMenu({ index, tasks, setTasks }: TaskMenuProps) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const deleteTask = async (ind: number) => {
    let taskCopy = [...tasks];
    taskCopy.splice(ind, 1);
    await AsyncStorage.setItem("archived", JSON.stringify(taskCopy));
    setTasks(taskCopy);
    setVisible(false);
  };
  const unarchive = async (ind: number) => {
    let mainTasks = await AsyncStorage.getItem("tasks");
    let parsedTasks = mainTasks ? JSON.parse(mainTasks) : [];
    parsedTasks.splice(0, 0, tasks[ind]); // add to the start of the array
    await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));

    let archivedCopy = [...tasks];
    archivedCopy.splice(ind, 1);
    await AsyncStorage.setItem("archived", JSON.stringify(archivedCopy));
    setTasks(archivedCopy);
    setVisible(false);
  };
  return (
    <>
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
          onPress={() => unarchive(index)}
          title="Unarchive"
          leadingIcon="archive-arrow-down"
        />
        <Divider />
        <Menu.Item
          onPress={() => deleteTask(index)}
          title="Delete"
          leadingIcon="delete"
        />
      </Menu>
    </>
  );
}
