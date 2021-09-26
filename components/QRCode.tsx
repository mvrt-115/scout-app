import BottomSheet from "@gorhom/bottom-sheet";
import React, {
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import QRCode from "react-native-qrcode-svg";
import { usePreGame, useAuton, useTeleop, usePostGame } from "../Stores";
import { AutonData, PostGameData, PreGameData, TeleopData } from "../types";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

interface QRCodeBottomSheetProps {
  sheetRef?: RefObject<BottomSheetMethods>;
}

type MatchData = AutonData & TeleopData & PostGameData & PreGameData;

const QRCodeBottomSheet: FC<QRCodeBottomSheetProps> = ({ sheetRef }) => {
  const snapPoints = useMemo(() => [1, "75%"], []);

  const preGameState = usePreGame((state) => state);
  const autonState = useAuton((state) => state);
  const teleopState = useTeleop((state) => state);
  const postGameState = usePostGame((state) => state);

  const getData: () => MatchData = () => {
    return {
      alliance: preGameState.alliance,
      attemptHang: postGameState.attemptHang,
      attemptLevel: postGameState.attemptLevel,
      autonBottom: autonState.autonBottom,
      autonBottomMissed: autonState.autonBottomMissed,
      autonInner: autonState.autonInner,
      autonUpper: autonState.autonUpper,
      autonUpperMissed: autonState.autonUpperMissed,
      teleopBottom: teleopState.teleopBottom,
      teleopBottomMissed: teleopState.teleopBottomMissed,
      teleopInner: teleopState.teleopInner,
      teleopUpper: teleopState.teleopUpper,
      teleopUpperMissed: teleopState.teleopUpperMissed,
      buddy: postGameState.buddy,
      climbTime: postGameState.climbTime,
      comments: postGameState.comments,
      cycles: teleopState.cycles,
      defense: teleopState.defense,
      disabled: teleopState.disabled,
      hangFail: postGameState.hangFail,
      initLineCrosses: autonState.initLineCrosses,
      levelFail: postGameState.levelFail,
      matchNum: preGameState.matchNum,
      minfo: preGameState.minfo,
      preloads: autonState.preloads,
      regional: preGameState.regional,
      rotation: teleopState.rotation,
      stuck: teleopState.stuck,
      teamNum: preGameState.teamNum,
      teams: preGameState.teams,
      trench: teleopState.trench,
    };
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      animateOnMount={false}
      snapPoints={snapPoints}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={{ marginBottom: 20 }}>
          Scan this QR Code with the Super Scout Scanner
        </Text>
        <QRCode
          value={JSON.stringify(getData())}
          size={Dimensions.get("screen").width / 1.3}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: Dimensions.get("screen").width / 1.5,
          }}
        >
          <Button
            style={{ width: "100%", marginVertical: 5 }}
            appearance="outline"
            onPress={() => {
              sheetRef?.current?.close();
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            Continue Scout
          </Button>
          <Button
            status="danger"
            appearance="outline"
            style={{
              width: "100%",
            }}
            onPress={() => {
              // setVisible(true);
              // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }}
          >
            Finish Scout
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  dropdown: {
    width: "70%",
  },
  section: {
    marginVertical: 20,
  },
  contentContainer: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QRCodeBottomSheet;
function useState<T>(arg0: number): [any, any] {
  throw new Error("Function not implemented.");
}
