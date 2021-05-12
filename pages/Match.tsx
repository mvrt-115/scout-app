import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Auton from "./Auton";
import Teleop from "./Teleop";
import PostGame from "./PostGame";
import { Ionicons } from "@expo/vector-icons";
import { NavigationState, RouteProp } from "@react-navigation/native";
import { SettingContext } from "../context/SettingContext";
import { DataProvider, useData } from "../context/DataContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { NavigationScreenProp, NavigationParams } from "react-navigation";

const Tab = createBottomTabNavigator();

type MInfo = {
  regional: string;
  matchNum: number;
  alliance: string;
  teams: [number, number, number];
};

type Props = {
  route: DataProp;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const Match: FC<Props> = ({ route, navigation }) => {
  const [matchInfo, setMatchInfo] = useState<MInfo>();

  const { data, setData } = useData();

  const { getSettingState } = React.useContext(
    SettingContext
  ) as SettingContextType;

  const [haptic, setHaptic] = useState(getSettingState("Haptic Feedback"));

  useEffect(() => {
    setHaptic(getSettingState("Haptic Feedback"));
  }, [getSettingState("Haptic Feedback")]);

  useEffect(() => {
    const matchInfo: string = route.params.data;

    const matchStrs: string[] = matchInfo.split(/[:@\[\,\]]/).slice(0, -1);

    const regional: string = matchStrs[1];
    const matchNum: number = parseInt(matchStrs[0]);
    const alliance: string = matchStrs[2];
    const teams: [number, number, number] = [
      parseInt(matchStrs[3]),
      parseInt(matchStrs[4]),
      parseInt(matchStrs[5]),
    ];

    setMatchInfo({
      regional,
      matchNum,
      alliance,
      teams,
    });

    setData({
      ...data,
      regional,
      matchNum,
      alliance,
    });
  }, []);

  const AutonComponent = () => (
    <Auton
      matchInfo={matchInfo}
      settings={{
        haptic: haptic,
      }}
      navigation={navigation}
    />
  );

  const TeleopComponent = () => (
    <Teleop
      matchInfo={matchInfo}
      settings={{
        haptic: haptic,
      }}
      navigation={navigation}
    />
  );

  const PostGameComponent = () => (
    <PostGame
      matchInfo={matchInfo}
      settings={{
        haptic: haptic,
      }}
      navigation={navigation}
    />
  );

  return (
    <DataProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName:
              | "car"
              | "car-outline"
              | "game-controller"
              | "game-controller-outline"
              | "alarm"
              | "alarm-outline";

            if (route.name === "Auton") {
              iconName = focused ? "car" : "car-outline";
            } else if (route.name === "Teleop") {
              iconName = focused
                ? "game-controller"
                : "game-controller-outline";
            } else if (route.name === "PostGame") {
              iconName = focused ? "alarm" : "alarm-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#598BFF",
          inactiveTintColor: "gray",
          style: { height: 90 },
        }}
      >
        <Tab.Screen name="Auton" component={AutonComponent} />
        <Tab.Screen name="Teleop" component={TeleopComponent} />
        <Tab.Screen name="PostGame" component={PostGameComponent} />
      </Tab.Navigator>
    </DataProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

type RootStackParamList = {
  data: { data: string };
};

type DataProp = RouteProp<RootStackParamList, "data">;

export default Match;

export type MatchData = {
  alliance: string;
  attemptHang: boolean;
  attemptLevel: boolean;
  autonInner: number;
  autonUpper: number;
  autonBottom: number;
  autonInnerMissed: number;
  autonUpperMissed: number;
  autonBottomMissed: number;
  comments: string;
  defense: boolean;
  stuck: boolean;
  disabled: boolean;
  hangFail: boolean;
  levelFail: boolean;
  matchNum: number;
  minfo: string;
  regional: string;
  teamNum: number;
  teleopInner: number;
  teleopUpper: number;
  teleopBottom: number;
  cycles: number;
  rotationDisabled: boolean;
  crossedInitLine: boolean;
  soloClimb: boolean;
  start: 1 | 2 | 3;
  preloads: number;
  positionDisabled: boolean;
  trench: boolean;
  climbTime: number;
};

export type MatchProps = {
  matchInfo: MInfo;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  settings?;
};
