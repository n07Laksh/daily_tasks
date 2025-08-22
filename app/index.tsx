import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card } from "react-native-paper";

import TaskMenu from "@/components/taskMenu";
import { capitalize } from "@/utility_functions/capatilize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

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

export default function IndexScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      const getTask = async () => {
        const tasks = await AsyncStorage.getItem("tasks");
        let parsedTasks = tasks?JSON.parse(tasks): [];
        let sortedTasks = parsedTasks.sort((a:any, b:any) => Number(b.pinned) - Number(a.pinned));

        setTasks(sortedTasks);
      };
      getTask();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll_container}>
          <View style={styles.content_container}>
            {tasks.length > 0 ? (
              tasks.map((item, index) => (
                <Card
                  key={index}
                  contentStyle={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  style={styles.content_container_child}
                  onPress={() =>
                    router.push(
                      `/task/task_details?task_id=${item.task_id}&position=${index}`
                    )
                  }
                  onLongPress={() =>
                    Alert.alert("View Task", "Click to view task details")
                  }
                >
                  <Card.Title
                    title={capitalize(item.title)}
                    subtitle={capitalize(item.description)}
                  />
                  <Text>
                    {/* <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="black"
                      onPress={(e) => {
                        e.preventDefault();
                        Alert.alert("something happend");
                        console.log(e.target);
                      }}
                    /> */}
                    <TaskMenu index={index} tasks={tasks} setTask={setTasks}/>
                  </Text>
                </Card>
              ))
            ) : (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Text>Add Task</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/task/task_form")}
        onLongPress={() => Alert.alert("Add Task", "Click to add a new task")}
      >
        <Text>
          <Ionicons name="add-circle-sharp" size={50} color="white" />
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  scroll_container: {
    width: "100%",
    padding: 16,
    paddingBottom: 100,
  },
  content_container: {
    width: "100%",
    gap: 20,
  },
  content_container_child: {
    width: "100%",
    padding: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  p: {
    fontSize: 16,
    color: "#333",
    // textAlign: 'center',
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#094568ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  test: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
