import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Platform } from "react-native";
import { Layout, Button, Text, Radio, RadioGroup } from "@ui-kitten/components";
import { MatchProps } from "./Match";
import Header from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { useData } from "../context/DataContext";
import MatchStatefulToggle from "../components/MatchStatefulToggle";
import Section from "../components/Section";
import MatchStatefulStopwatch from "../components/MatchStatefulStopwatch";

const PostGame: FC<MatchProps> = ({ matchInfo }) => {
  const [headerBackgroundColor] = useState(new Animated.Value(0));
  const interpolateHeaderBackgroundColor = headerBackgroundColor.interpolate({
    inputRange: [0, 255],
    outputRange: ["#fff0", Platform.OS === "ios" ? "#aaf2" : "#aaf9"],
  });

  const [matchInfoState, setMatchInfoState] = useState(matchInfo);
  const { data, changeData } = useData();
  const defaultHang = data
    ? !data.attemptHang
      ? 2
      : data.hangFail
      ? 1
      : 0
    : 2;
  const defaultLevel = data
    ? !data.attemptLevel
      ? 2
      : data.levelFail
      ? 1
      : 0
    : 2;
  useEffect(() => {
    setMatchInfoState(matchInfo);
  }, [matchInfo]);

  return (
    <Layout style={styles.container} level="1">
      <View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ zIndex: 0 }}>
          <Section headerPadding={120} headerTitle="Climb Time">
            <MatchStatefulStopwatch dataTitle="climbTime" name="Climb Time" />
          </Section>
          <Section headerTitle="Hang">
            <RadioGroupWrapper
              choices={["Success", "Fail", "Did not Attempt"]}
              defaultChoice={defaultHang}
              onDataChange={(index: number) => {
                if (index === 0)
                  changeData({ ...data, attemptHang: true, hangFail: false });
                else if (index === 1)
                  changeData({ ...data, attemptHang: true, hangFail: true });
                else
                  changeData({ ...data, attemptHang: false, hangFail: true });
              }}
            />
          </Section>
          <Section headerTitle="Level">
            <RadioGroupWrapper
              choices={["Success", "Fail", "Did not Attempt"]}
              defaultChoice={defaultLevel}
              onDataChange={(index: number) => {
                if (index === 0)
                  changeData({ ...data, attemptLevel: true, levelFail: false });
                else if (index === 1)
                  changeData({ ...data, attemptLevel: true, levelFail: true });
                else
                  changeData({ ...data, attemptLevel: false, levelFail: true });
              }}
            />
          </Section>
          <Section headerTitle="Solo Climb">
            <MatchStatefulToggle dataTitle="soloClimb" name="Solo Climb" />
          </Section>
        </ScrollView>
      </View>
      <Header
        title="Post Game"
        matchInfo={matchInfoState}
        backgroundColor={interpolateHeaderBackgroundColor}
      />
    </Layout>
  );
};

type WrapperOptions = {
  choices: string[];
  defaultChoice: number;
  onDataChange: (index: number) => void;
};
const RadioGroupWrapper = ({
  choices,
  onDataChange,
  defaultChoice,
}: WrapperOptions) => {
  const [selectedIndex, setSelectedIndex] = React.useState(defaultChoice);

  return (
    <View>
      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index) => {
          setSelectedIndex(index);
          onDataChange(index);
        }}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {choices.map((choice) => (
          <Radio key={choice}>{choice}</Radio>
        ))}
      </RadioGroup>
    </View>
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
  startStopClimb: {
    flex: 1,
    alignItems: "center",
  },
  halfButton: {
    width: "50%",
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
});

export default PostGame;
