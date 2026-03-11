import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import { usePostGame, usePreGame } from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { Alert, ScrollView, View, Image } from "react-native";
import { Button, IndexPath, Input, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from "react-navigation";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";
import { useTheme } from "../contexts/ThemeContext";

interface EndGameProps {
  navigation: any; //NavigationScreenProp<NavigationState, NavigationParams>;
  fields: any[];
}
const EndGame: FC<EndGameProps> = ({ navigation, fields }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const teams = usePreGame((state) => state.teams);
  const alliance = usePreGame((state) => state.alliance);
  const regional = usePreGame((state) => state.regional);
  
  const postGameFields = usePostGame((state) => state.postGameFields);
  const setPostGameFields = usePostGame((state) => state.setPostGameFields);
  const setField = usePostGame((state) => state.setField);
  const [didClimb, setDidClimb] = useState<boolean>(false);
  const validFields = (fields || []).filter(Boolean);
  const { colors } = useTheme();
  const hasClimbToggle = validFields.some(
    (f) => f?.name === "Climb Information (toggle this)" && f?.type === "boolean"
  );
  const climbLevelIndex = validFields.findIndex(
    (f) => typeof f?.name === "string" && f.name.includes("Climb Level") && Array.isArray(f.type)
  );
  const derivedDidClimb =
    climbLevelIndex >= 0 &&
    postGameFields?.[climbLevelIndex] !== undefined &&
    postGameFields?.[climbLevelIndex] !== "" &&
    postGameFields?.[climbLevelIndex] !== "None";


  useEffect(() => {
    if (validFields.length === 0) return;
    if (postGameFields.length < validFields.length) {
      setPostGameFields(initializePostGameFields());
    }
    //("Endgame useEffect");
  }, [validFields, postGameFields.length, setPostGameFields]);

  useEffect(() => {
    if (hasClimbToggle) return;
    // If the schema doesn't include the climb toggle, infer "did climb"
    // from the selected climb level (usually "None" vs Level 1/2/3).
    if (climbLevelIndex < 0) return;
    setDidClimb(Boolean(derivedDidClimb));
  }, [hasClimbToggle, climbLevelIndex, derivedDidClimb]);
  const initializePostGameFields = () => {
    const tempPostGame: any[] = [];
    validFields.map((value, index) => {
      const type = value['type'];
      if (type == "counter"|| type == 'timer') {
        tempPostGame.push(0);
      }
      else if (type == 'rating') tempPostGame.push(1);
      else if (type == "boolean") tempPostGame.push(false);
      else if (type == 'text') {
        tempPostGame.push("");
      }
      else if (Array.isArray(type)) {
        tempPostGame.push(type[0] ?? "");
      }
      else {
        tempPostGame.push("");
      }
    })
    return tempPostGame;
  }
  return (
    <>
      <Header
        matchInfo={{ teams, alliance, regional }}
        title={"EndGame"}
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
          if (field['type'] == 'counter' || field['type'] == 'rating') {
            return (
              <Counter
                rating={field['type'] == 'rating'}
                name={field['name']}
                onChange={(val) => {
                  const temp: any[] = [...postGameFields];
                  temp[index] = val;
                  setPostGameFields(temp);
                }}
                value={postGameFields[index]} />
            )
          }
          else if (field['type'] == 'boolean') {
            return (
              <Toggle
                checked={postGameFields[index]}
                onChange={(val) => {
                  const temp: any[] = [...postGameFields];
                  if (field['name'] === 'Climb Information (toggle this)'){
										setDidClimb(val);
										if(!val){
                      validFields.forEach((value, i)=>{
												if(value['name'].indexOf("Climb Level")>-1){
													temp[i] = "None"
												}
												if(value['name'].indexOf("Climb Time")>-1){
													temp[i] = 0;
												}
											})
										}
									}
                  temp[index] = val;
                  setPostGameFields(temp);
                }}
                style={{
                  marginTop: "3%",
                  padding: 4,
                }}
              >
                {field['name']}
              </Toggle>
            )
          }
          else if (field['type'] == 'text') {
            return (
              <Input
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder={field.name + "..."}
                label={field['name']}
                value={postGameFields[index]}
                onChangeText={(val) => {
                  const temp: any[] = [...postGameFields];
                  temp[index] = val;
                  setPostGameFields(temp);
                }}
              />
            )
          }
          else if (field['type'] == 'timer') {
            const isClimbTime = typeof field?.name === "string" && field.name.includes("Climb Time");
            if (hasClimbToggle || isClimbTime) {
              if (!(hasClimbToggle ? didClimb : derivedDidClimb)) return null;
            }
            return (
              <Stopwatch name={field['name']} onChange={setField} fieldIndex={index} postFields={postGameFields} ></Stopwatch>
            )
          }
          else if (Array.isArray(field['type'])) {
            const isClimbLevel = typeof field?.name === "string" && field.name.includes("Climb Level");
            if (hasClimbToggle && isClimbLevel && !didClimb) return null;
            const currentIndex = field['type'].indexOf(postGameFields[index]);
            return <Select
              selectedIndex={new IndexPath(currentIndex >= 0 ? currentIndex : 0)}
              onSelect={(currIndex) => {
                const temp: any[] = [...postGameFields];
                const selected = Array.isArray(currIndex) ? currIndex[0] : currIndex;
                temp[index] = field['type'][selected.row];
                if (!hasClimbToggle && isClimbLevel) {
                  setDidClimb(temp[index] !== "None" && temp[index] !== "");
                }
                setPostGameFields(temp);
              }}
              label={field['name']}
              style={{ marginBottom: "3%" }}
              value={postGameFields[index]}
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
                value={postGameFields[index]}
                onChangeText={(val) => {
                  const temp: any[] = [...postGameFields];
                  temp[index] = val;
                  setPostGameFields(temp);
                }}
              />
            )
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

export default EndGame;