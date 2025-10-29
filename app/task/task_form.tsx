import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

//@ local components and utility functions
import { capitalize } from "../../utility_functions/capatilize";
import { Task } from "@/app/types/types";

export default function TaskForm({ id }: { id?: number }) {
  const router = useRouter();
  const [taskObj, setTaskObj] = React.useState({
    title: "",
    desc: "",
    days: "",
    interval: "",
  });
  const [taskList, setTaskList] = React.useState<string[]>([]);
  const [taskTxt, setTaskTxt] = React.useState<string>("");

  const [visible, setVisible] = React.useState<boolean>(false);
  const [wrongTask, setWrongTask] = React.useState<boolean>(false);
  const [saveButton, setSaveButton] = React.useState<boolean>(true);

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = React.useState<boolean>(false);

  const showModal = (): void => setModalVisible(true);
  const hideModal = (): void => setModalVisible(false);

  const addTask = (): void => {
    let inputTxt = taskTxt.trim();
    if (inputTxt !== "") {
      setTaskList([inputTxt, ...taskList]);
      setAddModalVisible(false);
      setTaskTxt("");
    } else setWrongTask(true);
  };

  const handleSave = async () => {
    let stTasks = await AsyncStorage.getItem("tasks");
    let taskCount = await AsyncStorage.getItem("TaskCount");
    let parsedCount = parseInt(taskCount || "0");
    let parseResult: Task[] = stTasks ? JSON.parse(stTasks) : [];
    let found = parseResult.find((task) => task.id === id);

    let taskCountNum: number = found ? found.id : parsedCount + 1;

    if (setTaskList.length === 0) {
      Alert.alert("Error", "Add some tasks first!");
      return;
    }
    if (!taskObj.title || !taskObj.desc || !taskObj.days || !taskObj.interval) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    let priority = taskObj.interval === "day" ? "high" : "low";
    let dt = new Date();
    dt.setDate(dt.getDate() + parseInt(taskObj.days));

    let data: Task = {
      id: taskCountNum,
      title: taskObj.title,
      description: taskObj.desc,
      due_date: (dt as Date).toISOString(),
      priority: priority,
      tasks: taskList,
      pinned: false,
      interval: taskObj.interval,
      modified_at: new Date().toISOString(),
    };
    try {
      if (id !== undefined) {
        let updated = parseResult.map((task) =>(
          task.id === id ? data : task
        ))
        await AsyncStorage.setItem("tasks", JSON.stringify(updated));
      } else {
        parseResult.push(data);
        await AsyncStorage.setItem("tasks", JSON.stringify(parseResult));
      }
      await AsyncStorage.setItem(
        "TaskCount",
        id ? parsedCount.toString() : (parsedCount + 1).toString()
      );
      setTaskObj({ title: "", desc: "", days: "", interval: "" });
      setTaskList([]);
      router.back();
    } catch (error) {
      Alert.alert("Save Error", String(error));
    } finally {
      Alert.alert("Saved!", "Task saved in memory.");
    }
  };

  const removeItem = (ind: number) => () => {
    let filtered = taskList.filter((_, index) => index !== ind);
    setTaskList(filtered);
  };

  useEffect(() => {
    if (
      taskObj.title &&
      taskObj.desc &&
      taskObj.interval &&
      taskObj.days &&
      taskList.length > 0
    ) {
      setSaveButton(false);
    }
  }, [taskObj, taskList]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        let tasks = await AsyncStorage.getItem("tasks");
        let parsedTasks = tasks ? JSON.parse(tasks) : [];

        // let task = parsedTasks.find((task) => task.id === id);
        let task = parsedTasks.find((task:Task) => (task.id === id));
        if (task) {
          setTaskObj({
            title: task.title,
            desc: task.description,
            days: Math.ceil(
              (new Date(task.due_date).getTime() - new Date().getTime()) /
                (1000 * 3600 * 24)
            ).toString(),
            interval: task.interval || "",
          });
          setTaskList(task.tasks || []);
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };
    if (id !== undefined) fetchTask();
  }, [id]);

  useEffect(() => {
    const getTaskCount = async () => {
      let taskCount = await AsyncStorage.getItem("TaskCount");
      let taskCountNum = taskCount ? parseInt(taskCount) : 0;
      if (taskCountNum === 0) {
        await AsyncStorage.setItem("TaskCount", "0");
      }
    };
    getTaskCount();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{ marginBottom: 20 }}>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <View>
              <Text style={styles.h3}>Choose Interval</Text>
              <Text style={styles.p}>
                Select the interval for the task repetition.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 20,
                }}
              >
                {["day", "week", "month", "year"].map((int) => (
                  <Text
                    key={int}
                    onPress={() => {
                      setTaskObj({
                        ...taskObj,
                        interval: int as "day" | "week" | "month" | "year",
                      });
                      hideModal();
                    }}
                    style={{
                      padding: 10,
                      backgroundColor:
                        taskObj.interval === int ? "#ddd" : "#fff",
                    }}
                  >
                    {capitalize(int)}
                  </Text>
                ))}
              </View>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={addModalVisible}
            onDismiss={() => setAddModalVisible(false)}
            contentContainerStyle={containerStyle}
          >
            <View style={styles.addtask_container}>
              <Text style={styles.h3}> Write Task </Text>
              <View>
                <TextInput
                  mode="outlined"
                  label="Task"
                  placeholder="Eg. bath, read book, etc."
                  value={taskTxt}
                  onChangeText={(text) => {
                    setWrongTask(false);
                    setTaskTxt(text);
                  }}
                  autoFocus
                />
                {wrongTask && (
                  <HelperText type="error" visible={true}>
                    What are you doing 😡! Add some value first please!
                  </HelperText>
                )}
              </View>
              <Button mode="contained" onPress={() => addTask()}>
                Add
              </Button>
            </View>
          </Modal>
        </Portal>

        <View style={styles.container}>
          <TextInput
            mode="outlined"
            label="Title"
            placeholder="Enter task title"
            value={taskObj.title}
            onChangeText={(text) => setTaskObj({ ...taskObj, title: text })}
            autoFocus
          />
          <TextInput
            mode="outlined"
            label="Description"
            placeholder="Enter the task description"
            value={taskObj.desc}
            onChangeText={(text) => setTaskObj({ ...taskObj, desc: text })}
          />
          <TextInput
            mode="outlined"
            label="Task Days"
            placeholder="Enter days eg. 5, 23, 35, ..."
            value={taskObj.days}
            onChangeText={(text) => setTaskObj({ ...taskObj, days: text })}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            keyboardAppearance="dark"
            keyboardType="numeric"
          />
          <HelperText type="info" visible={visible}>
            How many days/month/year this task will be repeated.
          </HelperText>

          <View style={styles.modal_container}>
            <Text onPress={showModal} style={styles.modal_container_child}>
              {taskObj.interval
                ? capitalize(taskObj.interval)
                : "Choose Interval"}
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.task_container}>
              <Text style={[styles.h3]}> Add Tasks </Text>
              <Text>
                {" "}
                <Ionicons
                  name="add-circle"
                  onPress={() => setAddModalVisible(true)}
                  size={30}
                  color="black"
                />{" "}
              </Text>
            </View>
            <View style={styles.list_container}>
              {taskList.length > 0 &&
                taskList.map((item, index) => (
                  <View style={styles.task_list} key={index}>
                    {/* <Text>{`\u2022' ${capitalize(item)}`}</Text> */}
                    <Text>{`${capitalize(item)}`}</Text>
                    <Ionicons
                      onPress={removeItem(index)}
                      name="close"
                      size={20}
                      color="black"
                    />
                  </View>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: saveButton ? "rgba(0,0,0,0.5)" : "#094568ff" },
        ]}
        onLongPress={() => Alert.alert("Save the task")}
        onPress={handleSave}
        disabled={saveButton}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            padding: 10,
          }}
        >
          {id ? "Update Task" : "Save Task"}
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    gap: 10,
    marginBottom: 50,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  p: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modal_container: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  modal_container_child: {
    padding: 15,
    backgroundColor: "white",
    fontSize: 15,
  },
  task_container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  addtask_container: {
    gap: 20,
  },
  flatlist_child: {
    color: "red",
  },
  fab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  list_container: {
    marginTop: 20,
    marginHorizontal: 10,
    gap: 20,
  },
  task_list: {
    backgroundColor: "#09456812",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const containerStyle = { backgroundColor: "white", padding: 20, margin: 10 };
