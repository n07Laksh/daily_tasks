import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    const router = useRouter();
    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Page Not Found</Text>
                <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
                    The page you are looking for does not exist.
                </Text>

                {/* <Pressable onPress={() => router.replace("/")}>
                    <Text style={styles.pressBtn}>
                        <Ionicons name="arrow-back-circle-sharp" size={24} color="white" />
                        <Text>
                            Go Back
                        </Text>
                    </Text>
                </Pressable> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
 pressBtn:{
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    fontWeight: "bold",
    backgroundColor: "#094568ff",
    paddingVertical:5,
    paddingHorizontal: 10,
 }
});