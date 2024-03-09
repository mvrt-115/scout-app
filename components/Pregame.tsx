import React, { FC, useRef, useState, useEffect } from "react";
import Header from "./Header";
import { usePreGame } from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, View, Alert } from "react-native";
import { IndexPath, Input, Select, SelectItem } from "@ui-kitten/components/ui";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from "react-navigation";

// data to account for
// matchNum: number | string;
// alliance: string;
// regional: string;
// minfo: string;
// teams: [string | number, string | number, string | number];
// teamNum: string | number;

interface PreGameProps {
  navigation: any; // NavigationScreenProp<NavigationState, NavigationParams>;
}
const PreGame: FC<PreGameProps> = ({ navigation }) => {
  const matchNum = usePreGame((state) => state.matchNum);
  const teams = usePreGame((state) => state.teams);
  const alliance = usePreGame((state) => state.alliance);
  const regional = usePreGame((state) => state.regional);
  const teamNum = usePreGame((state) => state.teamNum);

  const setMatchNum = usePreGame((state) => state.setMatchNum);
  const setAlliance = usePreGame((state) => state.setAlliance);
  const setRegional = usePreGame((state) => state.setRegional);
  const setTeamNum = usePreGame((state) => state.setTeamNum);

  const [selectedTeam, setSelectedTeam] = useState<IndexPath>(
    new IndexPath(teamNum ? teams.indexOf(teamNum) : 0)
  );


  const sheetRef = useRef<BottomSheet>(null);
  return (
    <>
      <Header
        matchInfo={{ teams, alliance, regional }}
        title={"PreGame"}
        toggleQRCode={() => sheetRef.current?.snapToIndex(1)}
        navigation={navigation}
      />

      <ScrollView
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10%",
        }}
        keyboardDismissMode="on-drag"
      >
        <Input
          style={{ marginBottom: "3%" }}
          placeholder="Match Number"
          value={`${matchNum}`}
          keyboardType="number-pad"
          label="Match Number"
          onChangeText={(nextValue) => setMatchNum(nextValue)}
        />
        <Input
          style={{ marginBottom: "3%" }}
          placeholder="Regional"
          value={`${regional}`}
          label="Regional"
          disabled={true}
          onChangeText={(nextValue) => setRegional(nextValue)}
        />
        <Select
          selectedIndex={alliance === "b" ? new IndexPath(0) : new IndexPath(1)}
          onSelect={(index) =>
            setAlliance(!Array.isArray(index) && index.row === 0 ? "b" : "r")
          }
          label="Alliance"
          style={{ marginBottom: "3%" }}
          value={alliance === "b" ? "Blue" : "Red"}
        >
          <SelectItem title="Blue" />
          <SelectItem title="Red" />
        </Select>
        <Select
          selectedIndex={selectedTeam}
          onSelect={(index) => {
            if (!Array.isArray(index)) {
              setTeamNum(teams[index.row]);
              setSelectedTeam(index);
            }
          }}
          value={teamNum || teams[0]}
          label="Team Number"
        >
          <SelectItem title={`${teams[0]}`} />
          <SelectItem title={`${teams[1]}`} />
          <SelectItem title={`${teams[2]}`} />
        </Select>
      </ScrollView>
      <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
    </>
  );
};

export default PreGame;
