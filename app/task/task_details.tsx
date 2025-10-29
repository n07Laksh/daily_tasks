import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

//@ local Components and functions
import { capitalize } from "@/utility_functions/capatilize";
import { Task } from "@/app/types/types";

//@ main function
export default function TaskView() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const { task_id }: any = useLocalSearchParams();
  let id = task_id
    ? parseInt(Array.isArray(task_id) ? task_id[0] : task_id)
    : undefined;
  const [tasks, setTasks] = useState<Task>();
  const [checkedTaskObj, setCheckedTaskObj] = useState({});

  //@ function to handle checkbox toggle
  const handleCheckbox = async (index: number) => {
    let checkListCopy = [...checkedItems];
    checkListCopy[index] = !checkListCopy[index];

    setCheckedItems(checkListCopy);

    if (tasks) {
      let updated = { ...checkedTaskObj, [tasks.id]: checkListCopy };
      await AsyncStorage.setItem("checkedTask", JSON.stringify(updated));
    }
  };

  //@ fetching task details based on position
  useEffect(() => {
    let getTask = async () => {
      let tasks = await AsyncStorage.getItem("tasks");
      let parsedTask = tasks ? JSON.parse(tasks) : [];
      let found = parsedTask.find((task: Task) => task.id === id);
      setTasks(found);
    };
    getTask();
  }, [id]);

  //@ fetching checked tasks from storage
  useEffect(() => {
    let getCheckTasks = async () => {
      if (tasks) {
        let checkedStore = await AsyncStorage.getItem("checkedTask");
        let parsedChecked = checkedStore ? JSON.parse(checkedStore) : {};
        setCheckedTaskObj(parsedChecked);

        if (parsedChecked[tasks.id]) {
          setCheckedItems(parsedChecked[tasks.id]);
        } else {
          let checkedVal = Array(tasks.tasks.length).fill(false);
          setCheckedItems(checkedVal);
          const modifydChecked = { ...parsedChecked, [tasks.id]: checkedVal };
          await AsyncStorage.setItem(
            "checkedTask",
            JSON.stringify(modifydChecked)
          );
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
              <Text
                style={[styles.content_header_heading, { color: "#094568" }]}
              >
                {capitalize(tasks.title)}
              </Text>
              <Text style={styles.text_italic}>{tasks.description}</Text>
            </View>
            <View
              style={[{ alignItems: "flex-end" }, styles.content_header_child]}
            >
              <Text style={{ color: "red" }}>{tasks.due_date}</Text>
              <Text style={[{ color: "#094568", fontWeight: "bold" }]}>
                Task Interval = {tasks.interval}{" "}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <View style={{ width: "100%", gap: 15 }}>
          {tasks ? (
            tasks.tasks.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox.Item
                  status={checkedItems[index] ? "checked" : "unchecked"}
                  label={item}
                  onPress={() => handleCheckbox(index)}
                  labelStyle={{ marginLeft: 0, color: "#094568" }}
                  style={{
                    flexShrink: 1, // allows text to shrink instead of overflowing
                    flexWrap: "wrap", // enables wrapping
                    padding: 0,
                    gap: 5,
                    backgroundColor: "lightgrey",
                    borderRadius: 15,
                  }}
                />
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
    borderBottomColor: "#094568",
  },
  content_header_child: {
    width: "50%",
    gap: 5,
  },
  content_header_heading: {
    fontSize: 22,
    fontWeight: "900",
  },
  content_interval: {
    marginTop: 20,
  },
  text_italic: {
    fontStyle: "italic",
    textAlign: "justify",
  },
});
