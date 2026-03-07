import React, { FC, useEffect, useRef, useState } from "react";
import { useAuton, usePreGame } from '../Stores';
import Header from "./Header";
import BottomSheet from "@gorhom/bottom-sheet";
import QRCodeBottomSheet from "./QRCode";
import { ScrollView, View, Alert, Pressable, Image } from "react-native";
import { Button, Input, Text, Toggle } from "@ui-kitten/components";
import Counter from "./Counter";
import {
	NavigationScreenProp,
	NavigationState,
	NavigationParams,
} from "react-navigation";
import Stopwatch from "./Stopwatch";
import Toast from "react-native-toast-message";
import { useTheme } from "../contexts/ThemeContext";
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
	const validFields = (fields || []).filter(Boolean);
	const { colors } = useTheme();

	const initializeAutonFields = () => {
		const tempAuton: any[] = [];
		validFields.map((field) => {
			const [name, type] = [field['name'], field['type']];
			if (type === 'counter' || type === 'timer') tempAuton.push(0);
			else if (type === 'boolean') tempAuton.push(false);
			else if (type === 'text') tempAuton.push("");
			else if (Array.isArray(type))
				tempAuton.push(type[0] ?? "");
			else
				tempAuton.push("");
		});
		return tempAuton;
	}
	useEffect(() => {
		if (validFields.length === 0) return;
		if (autonFields.length < validFields.length) setAutonFields(initializeAutonFields());
	}, [validFields, autonFields.length, setAutonFields]);

	// useEffect(() => {
	// 	Alert.alert(JSON.stringify(autonFields));
	// }, [autonFields])
	const sheetRef = useRef<BottomSheet>(null);
	
	const isLoading = !fields;
	const isEmpty = fields && validFields.length === 0;
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
					backgroundColor: colors.background,
				}}
			// keyboardDismissMode="on-drag"
			>
				
				{isLoading ? (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
						<Text category="s1">Loading fields...</Text>
					</View>
				) : isEmpty ? (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
						<Text category="s1">No fields configured.</Text>
					</View>
				) : (
					validFields.map((field, index) => {
					const [name, type] = [field['name'], field['type']];
					if (type === 'counter' || type === 'rating') {
						var labelname=field['name'];
						return (
							<View key={field.name ?? index}>
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
							</View>
						);
					}
					else if (field['type'] == 'boolean') {
						return (
						  <Toggle
							key={field.name ?? index}
							checked={autonFields[index]}
							onChange={(val) => {
								const temp: any[] = [...autonFields];
								temp[index] = val;
								setAutonFields(temp);
							}}
							style={{
							  marginTop: 8,
							  padding: 4,
							}}
						  >
							{field['name']}
						  </Toggle>
						)
					  }
					else if (field['type'] == 'timer') {
						return (
							<Stopwatch key={field.name ?? index} name={field['name']} onChange={setField} fieldIndex={index} postFields={autonFields} />
						)
					}
					else {
						return (
							<Input
								key={field.name ?? index}
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
				}) )}
                { <Image 
                    source={require("../assets/autonstart.png")} 
                    style={{ width: '20%', marginTop: 10}} 
                /> }
			</ScrollView>
			<QRCodeBottomSheet sheetRef={sheetRef} navigation={navigation} />
		</>
	);
};

export default Auton;