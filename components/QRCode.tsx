import BottomSheet from "@gorhom/bottom-sheet";
import React, {
    FC,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { View, Dimensions, StyleSheet, Alert } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import QRCode from "react-native-qrcode-svg";
import { usePreGame, useAuton, useTeleop, usePostGame } from "../Stores";
import { AutonData, PostGameData, PreGameData, TeleopData } from "../types";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import {
    NavigationScreenProp,
    NavigationState,
    NavigationParams,
} from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from '../firebase'
import Toast from "react-native-toast-message";
import { Navigate } from 'react-router-dom';

interface QRCodeBottomSheetProps {
    sheetRef?: RefObject<BottomSheetMethods>;
    navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

type MatchData = AutonData & TeleopData & PostGameData & PreGameData;

const QRCodeBottomSheet: FC<QRCodeBottomSheetProps> = ({
    sheetRef,
    navigation,
}) => {
    const snapPoints = useMemo(() => [1, "75%"], []);

    const [showQR, setShowQR] = useState<boolean>(false);
    const [login, setLogin] = useState<boolean>(false);
    const preGameState = usePreGame((state) => state);
    const autonState = useAuton((state) => state);
    const teleopState = useTeleop((state) => state);
    const postGameState = usePostGame((state) => state);
    const setAutonFields = useAuton((state) => state.setAutonFields);
    const setTeleopFields = useTeleop((state) => state.setTeleopFields);
    const setPostGameFields = usePostGame((state) => state.setPostGameFields);

    const isLoggedIn = () => {
        return auth.currentUser != null;
    }

    const dataType = (field: any) => {
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
    const pushData = async () => {
        const data = getData();
        let autonFields: any[] = [], teleopFields: any[] = [], endGameFields: any[] = [];
        const scoutingDocs = db.collection('years').doc('2024').collection('scouting');
        await scoutingDocs.doc('auton').get().then((autonData) => {
            autonFields = Object.values(autonData.data()?.autonFields || {}).map((field: any) => dataType(field));
        });
        await scoutingDocs.doc('endgame').get().then((endgameData) => {
            endGameFields = Object.values(endgameData.data()?.endgameFields || {}).map((field: any) => dataType(field));
        })
        await scoutingDocs.doc('teleop').get().then((teleopData) => {
            teleopFields = Object.values(teleopData.data()?.teleopFields || {}).map((field: any) => dataType(field));
        })
        let pushingData = {};
        autonFields.forEach((field, index) => {
            pushingData[field['name']] = data.autonFields[index];
        });
        teleopFields.forEach((field, index) => {
            pushingData[field['name']] = data.teleopFields[index];
        });
        endGameFields.forEach((field, index) => {
            pushingData[field['name']] = data.postGameFields[index];
        });
        pushingData['matchNum'] = preGameState.matchNum;
        await db.collection('years').doc('2024').collection('regionals').doc(preGameState.regional)
            .collection("teams").doc(data.teamNum + "").collection("matches").doc(preGameState.matchNum + '').set(pushingData);
        Toast.show({ type: 'success', text1: 'Successfully saved data!' });
        setTimeout(() => {
            navigation?.navigate("Home");
            clearData();
        }, 2000);
    }
    const handleSheetChanges = useCallback((index: number) => {
        if (index === 0) setShowQR(false);
        else setShowQR(true);
    }, []);

    const clearData = () => {
        setAutonFields([]);
        setTeleopFields([]);
        setPostGameFields([]);
    }
    useEffect(() => {
        AsyncStorage.setItem("@scout_pregame", JSON.stringify(preGameState));
    }, [preGameState]);

    useEffect(() => {
        AsyncStorage.setItem("@scout_auton", JSON.stringify(autonState));
    }, [autonState]);

    useEffect(() => {
        AsyncStorage.setItem("@scout_teleop", JSON.stringify(teleopState));
    }, [teleopState]);

    useEffect(() => {
        AsyncStorage.setItem("@scout_postgame", JSON.stringify(postGameState));
    }, [postGameState]);

    const getData: () => MatchData = () => {
        return {
            autonFields: autonState.autonFields,
            postGameFields: postGameState.postGameFields,
            teleopFields: teleopState.teleopFields,
            alliance: preGameState.alliance,
            matchNum: preGameState.matchNum,
            minfo: preGameState.minfo,
            regional: preGameState.regional,
            teamNum: preGameState.teamNum,
            teams: preGameState.teams,
        };
    };

    return (
        <>
            <Toast position='top' topOffset={20} />
            <BottomSheet
                ref={sheetRef}
                index={0}
                animateOnMount={false}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,

                    elevation: 11,
                }}
            >
                <View style={styles.contentContainer}>
                    <Text style={{ marginBottom: 20 }}>
                        Scan this QR Code with the Super Scout Scanner
                    </Text>
                    {showQR && (
                        <QRCode
                            value={JSON.stringify(getData())}
                            size={Dimensions.get("screen").width / 1.3}
                        />
                    )}
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get("screen").width / 1.5,
                        }}
                    >
                        <Button
                            style={{ width: "100%", marginVertical: 5 }}
                            appearance="outline"
                            onPress={() => {
                                sheetRef?.current?.close();
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            }}
                        >
                            Continue Scout
                        </Button>
                        <Button
                            status="danger"
                            appearance="outline"
                            style={{
                                width: "100%",
                            }}
                            onPress={() => {
                                isLoggedIn() ? pushData() : navigation?.navigate("Login");
                            }}
                        >
                            Finish Scout
                        </Button>
                    </View>
                </View>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
    },
    dropdown: {
        width: "70%",
    },
    section: {
        marginVertical: 20,
    },
    contentContainer: {
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default QRCodeBottomSheet;