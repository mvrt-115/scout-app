import React, { FC, useEffect, useRef, useState } from "react";
import { useAuton, usePreGame } from '../Stores';
import Header from "./Header";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, View, Alert, Pressable, Image } from "react-native";
import { Button, Input, Text, Toggle } from "@ui-kitten/components";
import Counter from "./Counter";
import Stopwatch from "./Stopwatch";
import Toast from "react-native-toast-message";

const Auton: FC<{ navigation: any; fields: any[] }> = ({ navigation, fields }) => {
    const teams = usePreGame((state) => state.teams);
    const alliance = usePreGame((state) => state.alliance);
    const regional = usePreGame((state) => state.regional);
    const autonFields = useAuton((state) => state.autonFields);
    const setAutonFields = useAuton((state) => state.setAutonFields);
    const setField = useAuton((state) => state.setField);

    useEffect(() => {
        if (autonFields.length < fields.length) {
            setAutonFields(fields.map(field => {
                if (field.type === 'counter' || field.type === 'timer') return 0;
                if (field.type === 'boolean') return false;
                return "";
            }));
        }
    }, []);

    const sheetRef = useRef<BottomSheet>(null);
    
    return (
        <>
            <Header
                matchInfo={{ teams, alliance, regional }}
                title={"Auton"}
                toggleQRCode={() => sheetRef.current?.snapToIndex(1)}
                navigation={navigation}
            />
            <ScrollView contentContainerStyle={{ padding: "10%" }}>
                {fields.map((field, index) => (
                    field.type === 'counter' || field.type === 'rating' ? (
                        <Counter
                            key={index}
                            rating={field.type === "rating"}
                            name={field.name}
                            onChange={(val) => {
                                const temp = [...autonFields];
                                temp[index] = val;
                                setAutonFields(temp);
                            }}
                            value={autonFields[index] == '' ? 0 : autonFields[index]}
                        />
                    ) : field.type === 'boolean' ? (
                        <Toggle
                            key={index}
                            checked={autonFields[index]}
                            onChange={(val) => {
                                const temp = [...autonFields];
                                temp[index] = val;
                                setAutonFields(temp);
                            }}
                            style={{ marginTop: "3%", padding: 4 }}
                        >
                            {field.name}
                        </Toggle>
                    ) : field.type === 'timer' ? (
                        <Stopwatch
                            key={index}
                            name={field.name}
                            onChange={setField}
                            fieldIndex={index}
                            postFields={autonFields}
                        />
                    ) : (
                        <Input
                            key={index}
                            multiline={true}
                            textStyle={{ minHeight: 64 }}
                            placeholder={field.name + "..."}
                            label={field.name}
                            value={autonFields[index]}
                            onChangeText={(val) => {
                                const temp = [...autonFields];
                                temp[index] = val;
                                setAutonFields(temp);
                            }}
                        />
                    )
                ))}
                <Image 
                    source={require("../assets/autonstart.png")} 
                    style={{ width: '100%', height: undefined, aspectRatio: 1.8, marginTop: 10}} 
                />
            </ScrollView>
            <QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
        </>
    );
};

export default Auton;