import ArchivedTaskMenu from "@/components/archivedTaskmenu";
import { capitalize } from "@/utility_functions/capatilize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Card } from "react-native-paper";

export default function Archive() {
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);
  useFocusEffect(
    useCallback(() => {
      const archivedTasks = async () => {
        let archived = await AsyncStorage.getItem("archived");
        let parsedArchived = archived ? JSON.parse(archived) : [];
        setArchivedTasks(parsedArchived.reverse());
      };
      archivedTasks();
    }, [])
  );


  return (
    <>
      <View style={[styles.container, { width: "100%" }]}>
        <ScrollView
          contentContainerStyle={[styles.scroll_container, { width: "100%" }]}
        >
          <View style={[styles.content_container, { width: "100%" }]}>
            {archivedTasks.length > 0 ? (
              archivedTasks.map((item, index) => (
                <Card
                  key={index}
                  contentStyle={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Card.Title
                    title={capitalize(item.title)}
                    subtitle={capitalize(item.description)}
                  />
                  <View>
                   <ArchivedTaskMenu index={index} tasks={archivedTasks} setTasks={setArchivedTasks} />
                  </View>
                </Card>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "gray",
                }}
              >
                No Archived Tasks
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = {
  container: {
    // width: "100%",
    flex: 1,
  },
  scroll_container: {
    // width: "100%",
    padding: 16,
    paddingBottom: 100,
  },
  content_container: {
    // width: "100%",
    gap: 20,
  },
};
