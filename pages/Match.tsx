import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationState, RouteProp } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePreGame, useAuton, useTeleop, usePostGame } from "../Stores";
import PreGame from "../components/Pregame";
import Auton from "../components/Auton";
import Teleop from "../components/Teleop";
import EndGame from "../components/Endgame";
import { Alert } from 'react-native';
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth, dbCurYear } from '../firebase';


const Tab = createBottomTabNavigator();

type RootStackParamList = {
    data: { data: string };
};

type DataProp = RouteProp<RootStackParamList, "data">;

interface MatchProps {
    route: DataProp;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const Match: FC<MatchProps> = ({ route, navigation }) => {
    const setMinfo = usePreGame((state) => state.set);
    const [autonFields, setAutonFields] = useState<any[]>();
    const [endgameFields, setEndGameFields] = useState<any[]>();
    const [teleopFields, setTeleopFields] = useState<any[]>();
    const setAutonValues = useAuton(state => state.setAutonFields);
    const setTeleopValues = useTeleop(state => state.setTeleopFields);
    const setPostGameValues = usePostGame(state => state.setPostGameFields);

    const clearData = () => {
        AsyncStorage.setItem("@scout_pregame", "");
        AsyncStorage.setItem("@scout_auton", "");
        AsyncStorage.setItem("@scout_teleop", "");
        AsyncStorage.setItem("@scout_postgame", "");
        setAutonValues([]);
        setTeleopValues([]);
        setPostGameValues([]);
    }
    
    useEffect(() => {
        hardCode();
        if (route?.params?.data) {
            clearData();
            const matchInfo: string = route.params.data;
            // regex expression to make 1@mv:r[115, 254, 118] into [1, mv, 115, 254, 118]
            const [matchNum, regional, alliance, team1, team2, team3] = matchInfo
                .split(/[:@\[\,\]]/)
                .slice(0, -1);

            const teams: [string, string, string] = [team1, team2, team3];

            setMinfo({
                matchNum,
                regional,
                alliance,
                minfo: matchInfo,
                teamNum: team1,
                teams,
            });
        }
        //("Match use effect");
    }, []);

    const getData = (field: any) => {
        if (typeof field === 'object') {
            return ({
                name: Object.keys(field)[0].trim(),
                type: Object.values(field)[0]
            });
        }
        const [name, type] = field.trim().split(':');
        if (typeof type === 'string') {
            return ({
                name: name.trim(),
                type: type.trim(),
            });
        }
    }

    const hardCode = () =>{
        const autonStuff = ["Auton Coral Level 1 Scored: counter", "Auton Coral Level 1 Missed: counter", "Auton Coral Level 2 Scored: counter", 
            "Auton Coral Level 2 Missed: counter", "Auton Coral Level 3 Scored: counter", "Auton Coral Level 3 Missed: counter", 
            "Auton Coral Level 4 Scored: counter", "Auton Coral Level 4 Missed: counter", "Auton Algae Processor Scored: counter", 
            "Auton Algae Processor Missed: counter", "Auton Algae Net Scored: counter", "Auton Algae Net Missed: counter", 
            "Mobility: boolean", "Starts on 1: boolean", "Starts on 2: boolean", "Starts on 3: boolean", "Starts on 4: boolean", 
            "Starts on 5: boolean", "Auton Algae Removed Success: counter", "Auton Algae Removed Failed: counter"]
        setAutonFields(autonStuff.map((field: any) => getData(field)));
        const teleopStuff = ["Teleop Coral Level 1 Scored: counter", "Teleop Coral Level 1 Missed: counter", "Teleop Coral Level 2 Scored: counter", 
            "Teleop Coral Level 2 Missed: counter", "Teleop Coral Level 3 Scored: counter", "Teleop Coral Level 3 Missed: counter", 
            "Teleop Coral Level 4 Scored: counter", "Teleop Coral Level 4 Missed: counter", "Teleop Algae Processor Scored: counter", 
            "Teleop Algae Processor Missed: counter", "Teleop Algae Net Scored: counter", "Teleop Algae Net Missed: counter", 
            "Played Defense: boolean", "Got Defended: boolean", "Teleop Algae Removed Success: counter", "Teleop Algae Removed Failed: counter"]
        setTeleopFields(teleopStuff.map((field: any) => getData(field)));
        // const endgameStuff = ["Did Climb: boolean", "Climb Time: timer", {"Climb Level": ["None", "Shallow", "Deep"]}, 
        //     "Recieved Auton RP: boolean", "Recieved Coral RP: boolean", "Recieved Coopertition RP: boolean", 
        //     "Recieved Barge RP: boolean", "Drive Rating: rating", "Comments: text", "Park: boolean", "Tipped: boolean"]
        const endgameStuff = ["Climb Information (toggle this): boolean", "Climb Time: timer", {"Climb Level": ["None", "Shallow Success", "Deep Success", "Shallow Failed", "Deep Failed"]}, 
            "Drive Rating: rating", "Scouter Name and Comments: text", "Park: boolean", "Tipped: boolean", 
            "Can Score Front: boolean", "Can Score Front Left: boolean", "Can Score Front Right: boolean", 
            "Can Score Back: boolean", "Can Score Back Left: boolean", "Can Score Back Right: boolean", "Disabled: boolean", "Total Coral/Algae Scored: text"]
        setEndGameFields(endgameStuff.map((field: any) => getData(field)));
    }
    const fetchData = async () => {
        let scoutingCollection = collection(dbCurYear, '2025', 'scouting');
        let autonDocRef = doc(scoutingCollection, 'auton');
        let autonSnap = await getDoc(autonDocRef);
        setAutonFields(
            Object.values(autonSnap.data()?.autonFields || {}).map((field: any) => getData(field))
        );
        let endgameDocRef = doc(scoutingCollection, 'endgame');
        let endgameSnap = await getDoc(endgameDocRef);
        setEndGameFields(
            Object.values(endgameSnap.data()?.endgameFields || {}).map((field: any) => getData(field))
        );
        let teleopDocRef = doc(scoutingCollection, 'teleop');
        let teleopSnap = await getDoc(teleopDocRef);
        setTeleopFields(
            Object.values(teleopSnap.data()?.teleopFields || {}).map((field: any) => getData(field))
        );
        /*
        const scoutingDocs = db.collection('years').doc(`${new Date().getFullYear()}`).collection('scouting');
        await scoutingDocs.doc('auton').get().then((autonData) => {
            setAutonFields(Object.values(autonData.data()?.autonFields || {}).map((field: any) => getData(field)));
        });
        await scoutingDocs.doc('endgame').get().then((endgameData) => {
            setEndGameFields(Object.values(endgameData.data()?.endgameFields || {}).map((field: any) => getData(field)));
        });
        await scoutingDocs.doc('teleop').get().then((teleopFields) => {
            setTeleopFields(Object.values(teleopFields.data()?.teleopFields || {}).map((field: any) => getData(field)));
        });
        */
    }

    const AutonComponent = useCallback(() => <Auton navigation={navigation} fields={autonFields ? autonFields : []} />, [autonFields]);
    const EndGameComponent = useCallback(() => <EndGame navigation={navigation} fields={endgameFields ? endgameFields : []} />, [endgameFields]);
    const TeleopComponent = useCallback(() => <Teleop navigation={navigation} fields={teleopFields ? teleopFields : []} />, [teleopFields]);
    const PreGameComponent = useCallback(() => <PreGame navigation={navigation} />, []);

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName:
                            | "car"
                            | "car-outline"
                            | "game-controller"
                            | "game-controller-outline"
                            | "alarm"
                            | "alarm-outline"
                            | "checkmark-done"
                            | "checkmark-done-outline";

                        if (route.name === "PreGame")
                            iconName = focused ? "checkmark-done" : "checkmark-done-outline";
                        else if (route.name === "Auton") {
                            iconName = focused ? "car" : "car-outline";
                        } else if (route.name === "Teleop") {
                            iconName = focused
                                ? "game-controller"
                                : "game-controller-outline";
                        } else {
                            iconName = focused ? "alarm" : "alarm-outline";
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    headerShown: false,
                    activeTintColor: "#598BFF",
                    inactiveTintColor: "gray",
                    style: { height: 90 }
                })}
            >
                <Tab.Screen name="PreGame" component={PreGameComponent} />
                <Tab.Screen name="Auton" component={AutonComponent}/>
                <Tab.Screen name="Teleop" component={TeleopComponent} />
                <Tab.Screen name="EndGame" component={EndGameComponent} />
            </Tab.Navigator>
        </>
    );
};

export default Match;

