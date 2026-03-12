import React, { FC, useEffect, useRef } from "react";
import Header from "./Header";
import { useAuton, usePreGame } from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, Image } from "react-native";
import { IndexPath, Input, Select, SelectItem, Toggle } from "@ui-kitten/components";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";
import { useTheme } from "../contexts/ThemeContext";

interface AutonProps {
  navigation: any;
  fields: any[];
}
const Auton: FC<AutonProps> = ({ navigation, fields }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const teams = usePreGame((state) => state.teams);
  const alliance = usePreGame((state) => state.alliance);
  const regional = usePreGame((state) => state.regional);

  const autonFields = useAuton((state) => state.autonFields);
  const setAutonFields = useAuton((state) => state.setAutonFields);
  const setField = useAuton((state) => state.setField);
  const validFields = (fields || []).filter(Boolean);
  const { colors } = useTheme();

  useEffect(() => {
    if (validFields.length === 0) return;
    if (autonFields.length < validFields.length) {
      setAutonFields(initializeAutonFields());
    }
  }, [validFields, autonFields.length, setAutonFields]);

  const initializeAutonFields = () => {
    const temp: any[] = [];
    validFields.forEach((value) => {
      const type = value['type'];
      if (type === "counter" || type === 'timer') temp.push(0);
      else if (type === 'rating') temp.push(1);
      else if (type === "boolean") temp.push(false);
      else if (type === 'text') temp.push("");
      else if (Array.isArray(type)) temp.push(type[0] ?? "");
      else temp.push("");
    });
    return temp;
  };
  return (
    <>
      <Header
        matchInfo={{ teams, alliance, regional }}
        title={"Auton"}
        toggleQRCode={() => sheetRef.current?.snapToIndex(1)}
        navigation={navigation}
      />
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          padding: 0,
          backgroundColor: colors.background,
        }}
        keyboardDismissMode="on-drag"
      >
        {validFields.map((field, index) => {
          if (field['type'] === 'counter' || field['type'] === 'rating') {
            return (
              <Counter
                key={index}
                rating={field['type'] === 'rating'}
                name={field['name']}
                onChange={(val) => {
                  const temp: any[] = [...autonFields];
                  temp[index] = val;
                  setAutonFields(temp);
                }}
                value={autonFields[index] === '' ? 0 : autonFields[index]}
              />
            );
          }
          else if (field['type'] === 'boolean') {
            return (
              <Toggle
                key={index}
                checked={autonFields[index]}
                onChange={(val) => {
                  const temp: any[] = [...autonFields];
                  temp[index] = val;
                  setAutonFields(temp);
                }}
                style={{ marginTop: "3%", padding: 4 }}
              >
                {field['name']}
              </Toggle>
            );
          }
          else if (field['type'] === 'timer') {
            return (
              <Stopwatch
                key={index}
                name={field['name']}
                onChange={setField}
                fieldIndex={index}
                postFields={autonFields}
              />
            );
          }
          else if (Array.isArray(field['type'])) {
            const currentIndex = field['type'].indexOf(autonFields[index]);
            return (
              <Select
                key={index}
                selectedIndex={new IndexPath(currentIndex >= 0 ? currentIndex : 0)}
                onSelect={(currIndex) => {
                  const temp: any[] = [...autonFields];
                  const selected = Array.isArray(currIndex) ? currIndex[0] : currIndex;
                  temp[index] = field['type'][selected.row];
                  setAutonFields(temp);
                }}
                label={field['name']}
                style={{ marginBottom: "3%" }}
                value={autonFields[index]}
              >
                {field['type'].map((val: string, currIndex: number) => (
                  <SelectItem key={currIndex} title={val} />
                ))}
              </Select>
            );
          }
          else {
            return (
              <Input
                key={index}
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder={field.name + "..."}
                label={field['name']}
                value={autonFields[index]}
                onChangeText={(val) => {
                  const temp: any[] = [...autonFields];
                  temp[index] = val;
                  setAutonFields(temp);
                }}
              />
            );
          }
        })}
		{ <Image 
				source={require("../assets/autonstart.png")} 
				style={{
					width: 700,
					height: 200,
					maxHeight: 300,
					alignSelf: 'center',
					marginTop: 15,
					marginBottom: 10,
					borderRadius: 8,
				}}
			/> }
      </ScrollView>
      <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
    </>
  );
};

export default Auton;