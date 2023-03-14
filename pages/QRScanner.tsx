import { Button, Modal, Card, Text } from "@ui-kitten/components";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Vibration, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";

import { Ionicons } from "@expo/vector-icons";
import {
  ForceTouchGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const QRScanner: FC<Props> = ({ navigation }) => {
  const [facing, setFacing] = useState("back");
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<string>("");

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);

    setData(data);

    setVisible(true);
    Vibration.vibrate(100)
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      setScanning(true);
    })();
  }, []);

  return (
    <>
      <ForceTouchGestureHandler
        minForce={0.8}
        onHandlerStateChange={() => {
          setFacing(facing === "back" ? "front" : "back");
        }}
      >
        <View style={styles.container}>
          {hasPermission && scanning && (
            <BarCodeScanner
              type={facing === "back" ? "back" : "front"}
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <SafeAreaView style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="chevron-back-outline" size={35} color={"white"} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </ForceTouchGestureHandler>
      <ConfirmModal
        data={data}
        visible={visible}
        setVisible={setVisible}
        navigation={navigation}
        setData={setData}
        setScanning={setScanning}
      />
    </>
  );
};

interface ConfirmModalProps {
  visible: boolean;
  setVisible: (value: boolean) => any;
  data: string;
  setData: (value: string) => any;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  setScanning: (value: boolean) => any;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  data,
  setData,
  visible,
  setVisible,
  navigation,
  setScanning,
}) => {
  const yes = () => {
    setVisible(false);
    setScanning(false);
    navigation.navigate("Match", { data });
  };

  const no = () => {
    setVisible(false);
    setScanning(false);
    setData("");
    setScanning(true);
  };

  return (
    <Modal
      visible={visible}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onBackdropPress={no}
    >
      <Card
        disabled={true}
        style={{ marginHorizontal: 25, paddingTop: 10, paddingBottom: 16 }}
      >
        <Text category="h4" style={{ fontSize: 20 }}>
          Confirm Match
        </Text>
        <Text
          category="p1"
          style={{ marginVertical: 10, marginBottom: 15, textAlign: "center" }}
        >
          Are you scouting the match, {data}?
        </Text>
        <View style={styles.confirmButtons}>
          <Button appearance="outline" style={styles.button} onPress={yes}>
            Yes
          </Button>
          <Button appearance="outline" style={styles.button} onPress={no}>
            No
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonContainer: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  button: {
    width: "49%",
    marginRight: 2,
    flex: 1,
  },
  confirmButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default QRScanner;