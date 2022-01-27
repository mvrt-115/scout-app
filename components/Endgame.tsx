import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import { usePostGame, usePreGame} from "../Stores";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { Alert, ScrollView, View } from "react-native";
import { Button, IndexPath, Input, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from "react-navigation";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";

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
  useEffect(() =>{
    if(postGameFields.length<fields.length) setPostGameFields(initializePostGameFields());
    //Alert.alert(JSON.stringify(postGameFields));
  }, [])
  const initializePostGameFields = () =>{
    setPostGameFields([]);
    const tempPostGame: any[] = [];
    fields?.map((value, index)=>{
        if(value['type']=="counter") tempPostGame.push(0);
        else if(value['type']=="boolean") tempPostGame.push(false);
        else if(value['type'] == 'text' || value['type'] == 'timer') tempPostGame.push("");
        else if(Array.isArray(value['type'])){
          tempPostGame.push(value['type'][0]);
        }
        else {
          tempPostGame.push("");
        }
    },)
    return tempPostGame;
  }
  return (
    <>
    <Header
        matchInfo={{ teams, alliance, regional }}
        title={"EndGame"}
        toggleQRCode={() => sheetRef.current?.snapTo(1)}
        navigation = {navigation}
      />
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          padding: "10%",
        }}
        keyboardDismissMode="on-drag"
      >
      {fields?.map((field, index) => {
          if(field['type'] == 'counter' || field['type']=='rating') {
            return(
              <Counter
              rating={field['type']=='rating'}
              name={field['name']}
              onChange={(val) => {
                const temp: any[] = [...postGameFields];
                temp[index] = val;
                setPostGameFields(temp);
              }}
              value={postGameFields[index]}/>
            )
          }
          else if(field['type']=='boolean'){
            return(
              <Toggle checked = {postGameFields[index]} onChange={(val) => {
                const temp: any[] = [...postGameFields];
                temp[index] = val;
                setPostGameFields(temp);
              }} 
              style = {{marginTop: "3%", padding : 4}}>{field['name']}</Toggle>
            )
          }
          else if(field['type']=='text') {
            return(
              <Input
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder={field.name+"..."}
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
          else if(field['type']=='timer'){
            return (
              <Stopwatch name={field['name']} onChange={setPostGameFields} fieldIndex={index} postFields={postGameFields} ></Stopwatch>
            )
          }
          else if(Array.isArray(field['type'])){
            return <Select
              selectedIndex={new IndexPath(field['type'].indexOf(postGameFields[index]))}
              onSelect={(currIndex) =>{
                Alert.alert(postGameFields[index])
                const temp: any[] = [...postGameFields];
                temp[index] = field['type'][parseInt(currIndex.toString())-1];
                setPostGameFields(temp);
              }}
              label={field['name']}
              style={{ marginBottom: "3%" }}
              value={postGameFields[index]}
            >
              {field['type'].map((val, currIndex) =>{
                return <SelectItem title={val}/>
              })}
            </Select>
          }
          else{
            return(
              <Input
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder={field.name+"..."}
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
        
      </ScrollView>
      <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
    </>
  );
};

export default EndGame;