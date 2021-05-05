import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { MatchData } from "../pages/Match";

let data: MatchData = {
  alliance: "",
  attemptHang: false,
  attemptLevel: false,
  autonInner: 0,
  autonUpper: 0,
  autonBottom: 0,
  autonInnerMissed: 0,
  autonUpperMissed: 0,
  autonBottomMissed: 0,
  comments: "",
  defense: false,
  stuck: false,
  disabled: false,
  hangFail: false,
  levelFail: false,
  matchNum: 0,
  minfo: "",
  regional: "",
  teamNum: 0,
  teleopInner: 0,
  teleopUpper: 0,
  teleopBottom: 0,
  cycles: 0,
  rotationDisabled: false,
  crossedInitLine: false,
  soloClimb: false,
  start: 1,
  preloads: 0,
  positionDisabled: false,
  trench: false,
  climbTime: 0,
};

let setData: React.Dispatch<React.SetStateAction<MatchData>> = (
  newData: MatchData
) => (data = newData);
const DataContext = createContext({
  data,
  changeData: setData,
});

const useData = () => {
  return useContext(DataContext);
};

const DataProvider: FC = ({ children }) => {
  const [data, setData] = useState<MatchData>({
    alliance: "",
    attemptHang: false,
    attemptLevel: false,
    autonInner: 0,
    autonUpper: 0,
    autonBottom: 0,
    autonInnerMissed: 0,
    autonUpperMissed: 0,
    autonBottomMissed: 0,
    comments: "",
    defense: false,
    stuck: false,
    disabled: false,
    hangFail: false,
    levelFail: false,
    matchNum: 0,
    minfo: "",
    regional: "",
    teamNum: 0,
    teleopInner: 0,
    teleopUpper: 0,
    teleopBottom: 0,
    cycles: 0,
    rotationDisabled: false,
    crossedInitLine: false,
    soloClimb: false,
    start: 1,
    preloads: 0,
    positionDisabled: false,
    trench: false,
    climbTime: 0,
  });

  useEffect(() => {
    (async () => {
      const jsonStr = await AsyncStorage.getItem("@scout_data");
      const jsonData = JSON.parse(jsonStr);
      setData(jsonData);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log(data);
      await AsyncStorage.setItem("@scout_data", JSON.stringify(data));
    })();
  }, [data]);

  const changeData = (newData: MatchData) => setData(newData);

  const value = {
    data,
    changeData,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { useData, DataProvider };
