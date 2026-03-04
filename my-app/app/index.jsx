import { Text, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href={"/login"}>
        <Text style={{ fontFamily: "OutfitRegular", fontSize: 24 }}>Login</Text>
      </Link>
    </View>
  );
}