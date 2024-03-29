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
	const [ didCharge, setDidCharge ] = useState(false);
	const [ gamePiece, setGamePiece ] = useState("");

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
				toggleQRCode={() => sheetRef.current?.snapTo(1)}
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
		
		{gamePiece.match("Cone") ? <Button onPress={()=>{setGamePiece('')}} appearance="filled"> ⚠️	</Button> : <Button onPress={()=>{setGamePiece('Cone')}} appearance="outline"> ⚠️	 </Button>}
      	{gamePiece.match("Cube") ? <Button onPress={()=>{setGamePiece('')}} appearance="filled"> 🟪 </Button> : <Button onPress={()=>{setGamePiece('Cube')}} appearance="outline"> 🟪 </Button>}			
				
				{fields?.map((field, index) => {
					const [name, type] = [field['name'], field['type']];
					if (type === 'counter' || type === 'rating') {
						if(gamePiece == "") return;
          				if(field['name'].includes('Cube') && !gamePiece.match("Cube")) return;
          				if(field['name'].includes('Cone') && !gamePiece.match("Cone")) return;
						var labelname=field['name'];
						if(gamePiece.match('Cone')) {
							if(labelname.indexOf('Cone') != -1) {
							labelname=labelname.substring(0, labelname.indexOf("Cone")) + labelname.substring(labelname.indexOf('Cone') + 4);}
						}
						if(gamePiece.match('Cube')) {
							if(labelname.indexOf('Cube') != -1) {
							labelname=labelname.substring(0, labelname.indexOf("Cube")) + labelname.substring(labelname.indexOf('Cube') + 4);}
						}
						return (
							<>
							<Counter
								rating={field['type'] === "rating"}
								name={labelname}
								onChange={(val) => {
									const temp: any[] = [...autonFields];
									temp[index] = val;
									setAutonFields(temp);
									setTimeout(()=>{setGamePiece("")}, 250);
								}}
								value={autonFields[index] == '' ? 0 : autonFields[index]}
							/>
							</>
						);
					}
					else if (field['type'] == 'boolean') {
						if (!didCharge && (field['name'] === 'Auton Docked' || field['name'] === 'Auton Engaged')) return;
						return (
						  <Toggle
							checked={autonFields[index]}
							onChange={(val) => {
								const temp: any[] = [...autonFields];
								if (field['name'] === 'Auton Did Charge'){
									setDidCharge(val);
									if(!val){
										fields.forEach((value, i)=>{
											if(value['name'].indexOf("Docked")>-1 || value['name'].indexOf("Engaged")>-1){
												temp[i] = false;
											}
											if(value['name'].indexOf("Charge Time")>-1){
												temp[i] = 0;
											}
										})
									}
								}
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
						if(didCharge){
						  return (
							<Stopwatch name={field['name']} onChange={setField} fieldIndex={index} postFields={autonFields} ></Stopwatch>
						  )
						}
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