import React, { FC, useEffect, useRef, useState } from "react";
import { useAuton, usePreGame } from '../Stores';
import Header from "./Header";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, View, Alert, Pressable } from "react-native";
import { Button, Input, Text, Toggle } from "@ui-kitten/components";
import Counter from "./Counter";
import {
	NavigationScreenProp,
	NavigationState,
	NavigationParams,
} from "react-navigation";
import Stopwatch from "./Stopwatch";
import Toast from "react-native-toast-message";
interface AutonProps {
	navigation: any; // NavigationScreenProp<NavigationState, NavigationParams>;
	fields: any[];
}

const Auton: FC<AutonProps> = ({ navigation, fields }) => {
	const teams = usePreGame((state) => state.teams);
	const alliance = usePreGame((state) => state.alliance);
	const regional = usePreGame((state) => state.regional);
	const autonFields = useAuton((state) => state.autonFields);
	const setAutonFields = useAuton((state) => state.setAutonFields);
	const setField = useAuton((state) => state.setField);

	const initializeAutonFields = () => {
		const tempAuton: any[] = [];
		fields?.map((field) => {
			const [name, type] = [field['name'], field['type']];
			if (type === 'counter' || type === 'timer') tempAuton.push(0);
			else if (type === 'boolean') tempAuton.push(false);
			else if (type === 'text') tempAuton.push("");
			else if (Array.isArray(type))
				tempAuton.push(type['type'][0]);
			else
				tempAuton.push("");
		});
		return tempAuton;
	}
	useEffect(() => {
		if (autonFields.length < fields.length) setAutonFields(initializeAutonFields());
	}, []);

	// useEffect(() => {
	// 	Alert.alert(JSON.stringify(autonFields));
	// }, [autonFields])
	const sheetRef = useRef<BottomSheet>(null);
	// (navigation);
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
					padding: "10%",
				}}
			// keyboardDismissMode="on-drag"
			>
				
				{fields?.map((field, index) => {
					const [name, type] = [field['name'], field['type']];
					if (type === 'counter' || type === 'rating') {
						var labelname=field['name'];
						return (
							<>
							<Counter
								rating={field['type'] === "rating"}
								name={labelname}
								onChange={(val) => {
									const temp: any[] = [...autonFields];
									temp[index] = val;
									setAutonFields(temp);
								}}
								value={autonFields[index] == '' ? 0 : autonFields[index]}
							/>
							</>
						);
					}
					else if (field['type'] == 'boolean') {
						return (
						  <Toggle
							checked={autonFields[index]}
							onChange={(val) => {
								const temp: any[] = [...autonFields];
								temp[index] = val;
								setAutonFields(temp);
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
					else if (field['type'] == 'timer') {
						return (
							<Stopwatch name={field['name']} onChange={setField} fieldIndex={index} postFields={autonFields} ></Stopwatch>
						)
					}
					else {
						return (
							<Input
								multiline={true}
								textStyle={{ minHeight: 64 }}
								placeholder={field.name + "..."}
								label={name}
								value={autonFields[index]}
								onChangeText={(val) => {
									const temp: any[] = [...autonFields];
									temp[index] = val;
									setAutonFields(temp);
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

export default Auton;