import React, { FC, useState } from "react";
import { StyleSheet, Animated } from "react-native";
import {
  IndexPath,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { BlurView } from "expo-blur";
import { Dimensions } from "react-native";
import { MInfo } from "../pages/Match";
import { useData } from "../context/DataContext";

interface Props {
  title: string;
  matchInfo: MInfo;
  backgroundColor?: any;
}

const Header: FC<Props> = ({ title, matchInfo, backgroundColor }) => {
  const { data, changeData } = useData();
  const [selected, setSelected] = useState<IndexPath>(
    new IndexPath(
      matchInfo
        ? matchInfo.teams
          ? matchInfo.teams.indexOf(data.teamNum) !== -1
            ? matchInfo.teams.indexOf(data.teamNum)
            : 0
          : 0
        : 0
    )
  );
  const [selectedValue, setSelelectedValue] = useState(
    matchInfo ? (matchInfo.teams ? `${matchInfo.teams[selected.row]}` : "") : ""
  );

  return (
    <BlurView intensity={100} tint="light" style={styles.header}>
      <Animated.View
        style={[
          {
            backgroundColor: backgroundColor ? backgroundColor : "transparent",
            justifyContent: "flex-end",
            paddingHorizontal: 25,
            paddingBottom: 15,
          },
          StyleSheet.absoluteFillObject,
        ]}
      >
        <Text category="h1">{title}</Text>
        <Layout level="1" style={{ flexDirection: "row" }}>
          <Text category="s1">Team: </Text>
          <Select
            size={"small"}
            style={{ width: "30%" }}
            selectedIndex={selected}
            onSelect={(index) => {
              if (!Array.isArray(index)) {
                setSelected(index);
                setSelelectedValue(`${matchInfo.teams[index.row]}`);
                changeData({ ...data, teamNum: matchInfo.teams[index.row] });
              }
            }}
            value={selectedValue}
          >
            {matchInfo &&
              matchInfo.teams &&
              matchInfo.teams.map((team) => (
                <SelectItem key={team} title={team} />
              ))}
          </Select>
          <Text category="s1">
            &nbsp;
            {matchInfo && matchInfo.alliance}@{matchInfo && matchInfo.regional}{" "}
          </Text>
        </Layout>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 10,
    width: Dimensions.get("window").width,
    height: 130,
  },
});

export default Header;
