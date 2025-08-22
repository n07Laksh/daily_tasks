import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Checkbox } from "react-native-paper";

interface Task {
  task_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  interval: string;
  tasks: string[];
}

export default function TaskView() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const { position }: any = useLocalSearchParams();
  const [tasks, setTasks] = useState<Task>();

  const handleCheckbox = async (index: number) => {
    let checkItm;
    setCheckedItems((prev) => {
      let newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      checkItm = newCheckedItems;
      return newCheckedItems;
    });
    if (tasks) {
      await AsyncStorage.setItem(tasks.title, JSON.stringify(checkItm));
    }
  };

  useEffect(() => {
    let getTask = async () => {
      let tasks = await AsyncStorage.getItem("tasks");
      let parsedTask = tasks ? JSON.parse(tasks) : [];
      setTasks(parsedTask[position]);
    };
    getTask();
  }, [position]);

  useEffect(() => {
    let getCheckTasks = async () => {
      if (tasks) {
        let checkedStore = await AsyncStorage.getItem(tasks.title);
        let parsedCheked = checkedStore ? JSON.parse(checkedStore) : null;
        if (parsedCheked) {
          setCheckedItems(parsedCheked);
        } else {
          let checkedVal = Array(tasks.tasks.length).fill(false);
          setCheckedItems(checkedVal);
          await AsyncStorage.setItem(tasks.title, JSON.stringify(checkedVal));
        }
      }
    };
    getCheckTasks();
  }, [tasks]);

  return (
    <>
      {tasks && (
        <View style={styles.container}>
          <View style={styles.content_header}>
            <View style={styles.content_header_child}>
              <Text style={styles.content_header_heading}>{tasks.title}</Text>
              <Text style={styles.text_italic}>{tasks.description}</Text>
            </View>
            <View
              style={[{ alignItems: "flex-end" }, styles.content_header_child]}
            >
              <Text style={{ color: "red" }}>{tasks.due_date}</Text>
              <Text
                style={[
                  { color: "green", fontWeight: "bold" },
                  styles.text_italic,
                ]}
              >
                Task Interval = {tasks.interval}{" "}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ marginTop: 20 }}></View>

      <View>
        <View>
          {tasks ? (
            tasks.tasks.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox
                  status={checkedItems[index] ? "checked" : "unchecked"}
                  onPress={() => handleCheckbox(index)}
                  color="green"
                />
                <Text>{item}</Text>
              </View>
            ))
          ) : (
            <Text>No tasks found</Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
  },
  content_header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  content_header_child: {
    width: "50%",
    gap: 5,
  },
  content_header_heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content_interval: {
    marginTop: 20,
  },
  text_italic: {
    fontStyle: "italic",
    textAlign: "justify",
  },
});
