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
import { collection, doc, getDoc } from 'firebase/firestore';
import { db, SEASON_YEAR } from '../firebase';
import { useTheme } from "../contexts/ThemeContext";


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
    const { colors, isDark } = useTheme();

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
                console.warn('Firebase scouting fields not found', e);
                setAutonFields([]);
                setEndGameFields([]);
                setTeleopFields([]);
                Alert.alert('Unable to load scouting fields', 'Please check Firebase data for this season and try again.');
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
        // Dropdown object: {"Dropdown Name": ["Opt1", "Opt2"]}
        if (typeof field === 'object' && field !== null) {
            if (field.name && field.type) return field;
            const key = Object.keys(field)[0];
            const options = Object.values(field)[0];
            return {
                name: key.trim(),
                type: 'selection',
                options: options,
            };
        }
        // String format: "Field Name:type [config]"
        const colonIdx = field.indexOf(':');
        if (colonIdx === -1) return { name: field.trim(), type: 'text' };
        const name = field.substring(0, colonIdx).trim();
        const rest = field.substring(colonIdx + 1).trim();

        // Parse type and optional config
        const parts = rest.split(' ');
        const baseType = parts[0]; // e.g. "slider", "radio", "counter", etc.

        if (baseType === 'slider' && parts.length >= 3) {
            return { name, type: 'slider', min: parseInt(parts[1]), max: parseInt(parts[2]) };
        }
        if (baseType === 'radio') {
            // "radio Opt1,Opt2,Opt3"
            const options = parts.slice(1).join(' ').split(',').map(o => o.trim());
            return { name, type: 'radio', options };
        }
        if (baseType === 'selection') {
            const options = parts.slice(1).join(' ').split(',').map(o => o.trim());
            return { name, type: 'selection', options };
        }
        return { name, type: baseType };
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
                        let iconName: any = "alarm";
                        if (route.name === "PreGame") iconName = focused ? "checkmark-done" : "checkmark-done-outline";
                        else if (route.name === "Auton") iconName = focused ? "car" : "car-outline";
                        else if (route.name === "Teleop") iconName = focused ? "game-controller" : "game-controller-outline";
                        else if (route.name === "EndGame") iconName = focused ? "alarm" : "alarm-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.gray,
                    tabBarStyle: {
                        height: 90,
                        backgroundColor: colors.surface,
                        borderTopColor: colors.border,
                    },
                })}
            >
                <Tab.Screen name="PreGame" component={PreGameComponent} />
                <Tab.Screen name="Auton" component={AutonComponent} />
                <Tab.Screen name="Teleop" component={TeleopComponent} />
                <Tab.Screen name="EndGame" component={EndGameComponent} />
            </Tab.Navigator>
        </>
    );
};

export default Match;

