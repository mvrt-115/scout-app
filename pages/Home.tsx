import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  SafeAreaView,
} from "react-native";

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

import { db } from "../firebase";
import { Layout, Card, Button, Text, Divider } from "@ui-kitten/components";
import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { PostGame } from ".";

import { SettingContext } from "../context/SettingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const Home: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>("");
  const { settings, getSettingState } = React.useContext(
    SettingContext
  ) as SettingContextType;

  const [haptic, setHaptic] = useState(getSettingState("Haptic Feedback"));

  useEffect(() => {
    setHaptic(getSettingState("Haptic Feedback"));
  }, [getSettingState("Haptic Feedback")]);

  useEffect(() => {
    (async () => {
      const jsonStr = await AsyncStorage.getItem("@scout_data");
      const jsonData = JSON.parse(jsonStr);
      setData(jsonData.minfo);
      console.log(jsonData);
      setLoading(false);
    })();
  }, []);
  return (
    <Layout style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Text category="h1" style={{}}>
          Scout App
        </Text>
        <Divider style={{ width: 40 }} />
      </View>

      <View>
        <Button
          onPress={() => {
            navigation.navigate("QRScanner");
            haptic && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={styles.button}
          size="giant"
        >
          Scan QRCode
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("Match", { data });
            haptic && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={[styles.button, { shadowOpacity: 0 }]}
          appearance="outline"
          size="giant"
        >
          Match
        </Button>
      </View>
      <SafeAreaView style={styles.settings}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings");
            haptic && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Ionicons name="cog" size={30} />
        </TouchableOpacity>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
  },
  button: {
    marginVertical: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  settings: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default Home;
