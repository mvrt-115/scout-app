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
import { db, auth, SEASON_YEAR } from '../firebase';


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
        const loadFields = async () => {
            try {
                await fetchData();
            } catch (e) {
                console.warn('Firebase scouting fields not found, using fallback', e);
                hardCode();
            }
        };
        loadFields();

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
        const autonStuff = ["(A) Coral L1 Scored 🪸✅: counter", "(A) Coral L1 Missed 🪸❌: counter", "(A) Coral L2 Scored 🪸✅: counter", 
            "(A) Coral L2 Missed 🪸❌: counter", "(A) Coral L3 Scored 🪸✅: counter", "(A) Coral L3 Missed 🪸❌: counter", 
            "(A) Coral L4 Scored 🪸✅: counter", "(A) Coral L4 Missed 🪸❌: counter", "(A) Algae Processor Scored 🎾✅: counter", 
            "(A) Algae Processor Missed 🎾❌: counter", "(A) Algae Net Scored 🥅✅: counter", "(A) Algae Net Missed 🥅❌: counter", 
            "Mobility: boolean", "Starts on 1: boolean", "Starts on 2: boolean", "Starts on 3: boolean", "Starts on 4: boolean", 
            "Starts on 5: boolean", "(A) Algae Removed Success ✅: counter", "(A) Algae Removed Failed ❌: counter"]
        setAutonFields(autonStuff.map((field: any) => getData(field)));
        const teleopStuff = ["(T) Coral L1 Scored 🪸✅: counter", "(T) Coral L1 Missed 🪸❌: counter", "(T) Coral L2 Scored 🪸✅: counter", 
            "(T) Coral L2 Missed 🪸❌: counter", "(T) Coral L3 Scored 🪸✅: counter", "(T) Coral L3 Missed 🪸❌: counter", 
            "(T) Coral L4 Scored 🪸✅: counter", "(T) Coral L4 Missed 🪸❌: counter", "(T) Algae Processor Scored 🎾✅: counter", 
            "(T) Algae Processor Missed 🎾❌: counter", "(T) Algae Net Scored 🥅✅: counter", "(T) Algae Net Missed 🥅❌: counter", 
            "Played Defense: boolean", "Got Defended: boolean", "(T) Algae Removed Success ✅: counter", "(T) Algae Removed Failed ❌: counter"]
        setTeleopFields(teleopStuff.map((field: any) => getData(field)));
        // const endgameStuff = ["Did Climb: boolean", "Climb Time: timer", {"Climb Level": ["None", "Shallow", "Deep"]}, 
        //     "Recieved Auton RP: boolean", "Recieved Coral RP: boolean", "Recieved Coopertition RP: boolean", 
        //     "Recieved Barge RP: boolean", "Drive Rating: rating", "Comments: text", "Park: boolean", "Tipped: boolean"]
        const endgameStuff = ["Climb Information (toggle this): boolean", "Climb Time: timer", {"Climb Level": ["None", "Shallow Success", "Deep Success", "Shallow Failed", "Deep Failed"]}, 
            "Drive Rating: rating", "Received Coral RP: boolean", "Scouter_Name_and_Comments: text", "Park: boolean", "Tipped: boolean", 
            "Can Score Front: boolean", "Can Score Front Left: boolean", "Can Score Front Right: boolean", 
            "Can Score Back: boolean", "Can Score Back Left: boolean", "Can Score Back Right: boolean", "Disabled: boolean", "Total Coral/Algae Scored: text"]
        setEndGameFields(endgameStuff.map((field: any) => getData(field)));
    }
    const fetchData = async () => {
        let scoutingCollection = collection(db, 'years', SEASON_YEAR, 'scouting');
        let autonDocRef = doc(scoutingCollection, 'auton');
        let autonSnap = await getDoc(autonDocRef);
        const autonData = Object.values(autonSnap.data()?.autonFields || {}).map((field: any) => getData(field));
        let endgameDocRef = doc(scoutingCollection, 'endgame');
        let endgameSnap = await getDoc(endgameDocRef);
        const endgameData = Object.values(endgameSnap.data()?.endgameFields || {}).map((field: any) => getData(field));
        let teleopDocRef = doc(scoutingCollection, 'teleop');
        let teleopSnap = await getDoc(teleopDocRef);
        const teleopData = Object.values(teleopSnap.data()?.teleopFields || {}).map((field: any) => getData(field));

        if (autonData.length > 0 && endgameData.length > 0 && teleopData.length > 0) {
            setAutonFields(autonData);
            setEndGameFields(endgameData);
            setTeleopFields(teleopData);
        } else {
            throw new Error('Firebase returned empty field definitions');
        }
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

