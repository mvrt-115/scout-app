import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import { useTeleop, usePreGame } from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { Button, IndexPath, Input, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from "react-navigation";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";

interface TeleopProps {
  navigation: any; // NavigationScreenProp<NavigationState, NavigationParams>;
  fields: any[];
}

const Teleop: FC<TeleopProps> = ({ navigation, fields }) => {
  const teams = usePreGame((state) => state.teams);
  const alliance = usePreGame((state) => state.alliance);
  const regional = usePreGame((state) => state.regional);
  const sheetRef = useRef<BottomSheet>(null);
  const teleopFields = useTeleop((state) => state.teleopFields);
  const setTeleopFields = useTeleop((state) => state.setTeleopFields);
  const setField = useTeleop((state) => state.setField);
  const [playedDefense, setPlayedDefense] = useState<boolean>(false);
  const validFields = (fields || []).filter(Boolean);

  useEffect(() => {
    if (validFields.length === 0) return;
    if (teleopFields.length < validFields.length) {
      setTeleopFields(initializeTeleopFields());
    }
  }, [validFields, teleopFields.length, setTeleopFields]);
  const initializeTeleopFields = () => {
    const tempTeleop: any[] = [];
    validFields.map((value) => {
      const type = value['type'];
      if (type == "counter" || type == "timer") tempTeleop.push(0);
      else if (type == 'rating') tempTeleop.push(1);
      else if (type == "boolean") tempTeleop.push(false);
      else if (type == 'text') tempTeleop.push("");
      else if (Array.isArray(type))
        tempTeleop.push(type[0] ?? "");
      else
        tempTeleop.push("");
    });
    return tempTeleop;
  }

  return (
    <>
      <Header
        matchInfo={{ teams, alliance, regional }}
        title={"Teleop"}
        toggleQRCode={() => sheetRef.current?.snapToIndex(1)}
        navigation={navigation}
      />
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          padding: "10%",
        }}
        keyboardDismissMode="on-drag"
      >
      
        {validFields.map((field, index) => {
          if (field['type'] == 'counter' || field['type'] == 'rating') {
            var name=field['name'];
            return (
              <Counter
                rating={field['type'] == 'rating'}
                name={name}
                onChange={(val) => {
                  const temp: any[] = [...teleopFields];
                  temp[index] = val;
                  setTeleopFields(temp);
                }}
                value={teleopFields[index] == '' ? 0 : teleopFields[index]}
              />
            )
          }
          else if (field['type'] == 'boolean') {
            return (
              <Toggle
                checked={teleopFields[index]}
                onChange={(val) => {
                  const temp: any[] = [...teleopFields];
                  temp[index] = val;
                  setTeleopFields(temp);
                }}
                style={{ marginTop: "3%", padding: 4 }}
              >
                {field['name']}
              </Toggle>
            )
          }
          else if (field['type'] == 'timer') {
            return (
              <Stopwatch
                name={field['name']}
                onChange={setField}
                fieldIndex={index}
                postFields={teleopFields}
              />
            )
          }
          else if (Array.isArray(field['type'])) {
            const currentIndex = field['type'].indexOf(teleopFields[index]);
            return <Select
              selectedIndex={new IndexPath(currentIndex >= 0 ? currentIndex : 0)}
              onSelect={(currIndex) => {
                const temp: any[] = [...teleopFields];
                const selected = Array.isArray(currIndex) ? currIndex[0] : currIndex;
                temp[index] = field['type'][selected.row];
                setTeleopFields(temp);
              }}
              label={field['name']}
              style={{ marginBottom: "3%" }}
              value={teleopFields[index]}
            >
              {field['type'].map((val, currIndex) => {
                return <SelectItem title={val} />
              })}
            </Select>
          }
          else {
            return (
              <Input
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder={field.name + "..."}
                label={field['name']}
                value={teleopFields[index]}
                onChangeText={(val) => {
                  const temp: any[] = [...teleopFields];
                  temp[index] = val;
                  setTeleopFields(temp);
                }}
              />
            )
          }
        })}
      </ScrollView>
      <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
    </>
  );
};

export default Teleop;