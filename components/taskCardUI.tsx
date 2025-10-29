import React from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet
} from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";


//@ local component and function
import { capitalize } from "@/utility_functions/capatilize";
import TaskMenu from "./taskMenu";

interface CardUIProps {
  item: any;
  tasks: any;
  getTask: any;
}

const CardUI:React.FC<CardUIProps> = ({item, tasks, getTask}) =>{
    const router = useRouter();
  return (
      <Card
        // key={index}
        contentStyle={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        style={styles.content_container_child}
        onPress={() =>
          router.push(`/task/task_details?task_id=${item.id}`)
        }
        onLongPress={() =>
          Alert.alert("View Task", "Click to view task details")
        }
      >
        <View style={{ maxWidth: "90%", width: "90%" }}>
          <Card.Title
            title={capitalize(item.title)}
            subtitle={capitalize(item.description)}
            titleStyle={{ color: "#094568", fontWeight: "900" }}
            subtitleStyle={{ color: "#000" }}
          />
        </View>
        <Text>
          <TaskMenu
            id={item.id}
            tasks={tasks}
            refreshTask={getTask}
          />
        </Text>
      </Card>
  );
}

const styles = StyleSheet.create({
  content_container_child: {
    width: "100%",
    padding: 8,
  }
});

export default CardUI;