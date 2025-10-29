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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

//@ local Components and functions
import { Task } from "@/app/types/types";
import CardUI from "@/components/taskCardUI";

export default function IndexScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pinnedTasks, setPinnedTasks] = useState<Task[]>([]);
  const [nonePinnedTasks, setNonPinnedTasks] = useState<Task[]>([]);

  const getTask = async () => {
    const tasks = await AsyncStorage.getItem("tasks");
    let parsedTasks: Task[] = tasks ? JSON.parse(tasks) : [];

    // filtering pinned tasks and sorting with modified date & updating the state
    let pinnedTasks = parsedTasks
      .filter((task) => task.pinned)
      .sort(
        (a: any, b: any) =>
          new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
      );
    setPinnedTasks(pinnedTasks);

    // filtering other tasks and sorting with modified date & updating the states
    let nonPinnedTasks = parsedTasks
      .filter((task) => !task.pinned)
      .sort(
        (a: any, b: any) =>
          new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
      );
    setNonPinnedTasks(nonPinnedTasks);

    

    const sortedTasks = [...pinnedTasks, ...nonPinnedTasks];
    setTasks(sortedTasks);

    // console.log( "concated tasks", sortedTasks);

    if (parsedTasks.length === 0) {
      await AsyncStorage.removeItem("TaskCount");
      await AsyncStorage.removeItem("tasks");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTask();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll_container}>
          <View style={styles.content_container}>
            {pinnedTasks.length > 0 ? (
              <>
                <Text style={{marginTop:10, padding:5}}>Pinned </Text>
                {pinnedTasks.map((item, index) => (
                  <View key={`pinned-${item.id}`}>
                    <CardUI
                      item={item}
                      tasks={tasks}
                      getTask={getTask}
                    />
                  </View>
                ))}
                <Text style={{ marginTop: 20, padding:5 }}>Others </Text>
              </>
            ) : (
              <Text></Text>
            )}
            {nonePinnedTasks.length > 0 ? (
              nonePinnedTasks.map((item, index) => (
                <View key={`none-pinned-${item.id}`}>
                  <CardUI
                    item={item}
                    tasks={tasks}
                    getTask={getTask}
                  />
                </View>
                // <Card
                //   key={index}
                //   contentStyle={{
                //     width: "100%",
                //     flexDirection: "row",
                //     justifyContent: "space-between",
                //     alignItems: "center",
                //   }}
                //   style={styles.content_container_child}
                //   onPress={() =>
                //     router.push(
                //       `/task/task_details?task_id=${item.id}&pos=${index}`
                //     )
                //   }
                //   onLongPress={() =>
                //     Alert.alert("View Task", "Click to view task details")
                //   }
                // >
                //   <View style={{ maxWidth: "90%", width:"90%" }}>
                //     <Card.Title
                //       title={capitalize(item.title)}
                //       subtitle={capitalize(item.description)}
                //       titleStyle={{ color:"#094568", fontWeight: "900"}}
                //       subtitleStyle={{ color:"#000"}}
                //     />
                //   </View>
                //   <Text>
                //     <TaskMenu index={index} tasks={tasks} setTasks={setTasks} refreshTask={getTask} />
                //   </Text>
                // </Card>
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
          <Ionicons name="add-circle-sharp" size={50} color="#094568" />
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    color: "#094568",
    backgroundImage: "url('@/app/assets/images/icon1.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
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
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // shadow for Android
    shadowColor: "#094568", // shadow for iOS
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
