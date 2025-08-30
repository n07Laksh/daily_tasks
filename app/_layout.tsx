import { Stack } from "expo-router";
import {
    MD3LightTheme as DefaultTheme,
    PaperProvider
} from 'react-native-paper';
import HeaderMenu from "../components/menu";

export default function Layout() {
    return (
        <PaperProvider theme={theme}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Daily Tasks",
                        headerStyle: { backgroundColor: "#094568ff" },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerTitleAlign: "center",
                        headerRight: () => <HeaderMenu />,

                    }}
                />
                <Stack.Screen
                    name="+not-found"
                    options={{
                        title: "Opps! This screen does not exist",
                        headerStyle: { backgroundColor: "#094568ff" },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerTitleAlign: "center",
                    }}
                />
                <Stack.Screen
                    name="task/task_form"
                    options={{
                        title: "Add New Task",
                        headerStyle: { backgroundColor: "#094568ff" },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerTitleAlign: "center",
                        // headerRight: () => (
                        //     <Pressable
                        //         // onPress={() => setVisible(true)}
                        //         style={{ marginRight: 20 }}
                        //     >
                        //         <Ionicons name="checkmark" size={24} color="#fff" />
                        //     </Pressable>
                        // )
                    }}
                />
                <Stack.Screen
                    name="task/task_details"
                    options={{
                        title: "Task Info",
                        headerStyle: { backgroundColor: "#094568ff" },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerTitleAlign: "center",
                    }}
                />
                <Stack.Screen
                    name="task/archive"
                    options={{
                        title: "Archived Tasks",
                        headerStyle: { backgroundColor: "#094568ff" },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerTitleAlign: "center",
                    }}
                />
            </Stack>
        </PaperProvider>
    );
}
const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    //   Specify custom property in nested object
    colors: {
        ...DefaultTheme.colors,
        myOwnColor: '#BADA55',
    },
};
