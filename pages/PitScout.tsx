import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { Button, IndexPath, Input, Select, SelectItem, Toggle } from '@ui-kitten/components';
import { usePitScout } from "../Stores";
import Counter from "../components/Counter";
import Toast from 'react-native-toast-message';
import { useLatestRef } from "@chakra-ui/react";
import { CalendarDataService } from "@ui-kitten/components/ui/calendar/service/calendarData.service";

interface PitScoutProps {
    navigation: any,
}

const PitScout: FC<PitScoutProps> = ({ navigation }) => {

    const pitScoutFields = usePitScout((state) => state.pitScoutFields);
    const setPitScoutFields = usePitScout((state) => state.setPitScoutFields);
    const [regionals, setRegionals] = useState<string[]>([]);
    const [regional, setRegional] = useState<string>('cafr');
    const [teamNum, setTeamNum] = useState<number>(1);
    const [hasData, setHasData] = useState<boolean>(false);
    useEffect(() => {
        setRegionals(getRegionals());
        if (pitScoutFields.length === 0) {
            (async () => {
                setPitScoutFields(await initalizePitScoutFields());
            })();
        }
    }, [])

    const initalizePitScoutFields = async () => {
        const prompts: any[] = []
        await db
            .collection('years')
            .doc('2022')
            .collection('scouting')
            .doc('pitScouting').get().then((data) => {
                let arr = data.data()?.pitScoutingQuestions;
                // Alert.alert(arr);
                arr.forEach((field: object | string, index: number) => {
                    if (typeof field === 'object') {
                        let key: string = Object.keys(field)[0];
                        let data = {
                            "name": key,
                            "value": field[key],
                            "selected": field[key][0]
                        }
                        prompts.push(data);
                    } else {
                        const [name, type] = field.trim().split(":");
                        if (type.trim() === 'boolean') {
                            let data = {
                                "name": name.trim(),
                                "value": false
                            }
                            prompts.push(data);
                        } else if (type.trim() === 'counter') {
                            let data = {
                                "name": name.trim(),
                                "value": 0
                            }
                            prompts.push(data);
                        } else {
                            let data = {
                                "name": name.trim(),
                                "value": ''
                            }
                            prompts.push(data);
                        }
                    }
                });
            });
        setHasData(false);
        return prompts;
    }

    const getRegionals = () => {
        const year = new Date().getFullYear();
        let regionals: any[] = [];
        db
            .collection('years')
            .doc(`${year}`)
            .collection('regionals')
            .get()
            .then((data) => {
                data.docs.forEach((doc) => {
                    regionals.push(doc.id);
                })
            });
        return regionals;
    }

    const pushData = (): void => {
        if (isNaN(teamNum)) {
            Alert.alert('Enter valid team number');
            return;
        }
        let answers: any = {};
        pitScoutFields.forEach((field) => {
            if (typeof field['value'] === 'object') answers[field['name']] = field['selected'];
            else answers[field['name']] = field['value'];
        });
        // Alert.alert(JSON.stringify(answers));
        db
            .collection('years')
            .doc(`${new Date().getFullYear()}`)
            .collection('regionals')
            .doc(regional)
            .collection('teams')
            .doc(`${teamNum}`)
            .collection('pitScoutData')
            .doc('pitScoutAnswers')
            .set(answers).then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully saved data!'
                });
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err.message
                })
            });
    }

    const clearData = async () => {
        setPitScoutFields(await initalizePitScoutFields());
    }

    const isLoggedIn = (): boolean => {
        return auth.currentUser != null;
    }

    return (
        <>
            <Toast position="top" topOffset={20} />
            <ScrollView
                contentContainerStyle={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "10%",
                }}
                keyboardDismissMode="on-drag"
            >
                {hasData ? <Button
                    style={{ width: "100%", marginVertical: 5 }}
                    appearance="outline"
                    onPress={() => {
                        clearData();
                    }}
                >
                    Clear Data
                </Button> : <></>}
                <Select
                    selectedIndex={new IndexPath(regionals.indexOf(regional))}
                    label={'Select Regional'}
                    onSelect={(currIndex) => {
                        setRegional(regionals[parseInt(currIndex.toString()) - 1]);
                    }}
                    style={{ marginBottom: '4%' }}
                    value={regional}
                >
                    {regionals.map(r => <SelectItem title={r} />)}
                </Select>
                {pitScoutFields.map((field: any, index: number) => {
                    if (Array.isArray(field['value'])) {
                        return (
                            // render select
                            <Select
                                //save to zustand
                                selectedIndex={new IndexPath(field['value'].indexOf(field['selected']))}
                                onSelect={(currIndex) => {
                                    const newField = {
                                        "name": field['name'],
                                        "value": field['value'],
                                        "selected": field['value'][parseInt(currIndex.toString()) - 1]
                                    }
                                    const temp: any[] = [...pitScoutFields];
                                    temp[index] = newField;
                                    setPitScoutFields(temp);
                                    setHasData(true);
                                }}
                                label={field['name']}
                                style={{ marginBottom: "3%" }}
                                value={field['selected']}
                            >
                                {field['value'].map((val: any) => {
                                    return <SelectItem title={val} />
                                })}
                            </Select>
                        );
                    } else if (typeof field['value'] === 'boolean') {
                        // render toggle
                        return (
                            <Toggle
                                checked={pitScoutFields[index]['value']}
                                onChange={(val) => {
                                    const newField = {
                                        "name": field['name'],
                                        "value": val
                                    }
                                    const temp: any[] = [...pitScoutFields];
                                    temp[index] = newField;
                                    setPitScoutFields(temp);
                                    setHasData(true);
                                }}
                                style={{ marginTop: "3%", padding: 4 }}
                            >
                                {field['name']}
                            </Toggle>
                        );
                    } else if (typeof field['value'] === 'number') {
                        return (
                            <Counter
                                rating={false}
                                name={field['name']}
                                onChange={(val) => {
                                    const newField = {
                                        "name": field['name'],
                                        "value": val
                                    }
                                    const temp: any[] = [...pitScoutFields];
                                    temp[index] = newField;
                                    setPitScoutFields(temp);
                                    setHasData(true);
                                }}
                                value={pitScoutFields[index]['value']}
                            />
                        );
                    } else {
                        // render text input
                        return (
                            <Input
                                multiline={false}
                                textStyle={{ minHeight: 28 }}
                                placeholder={field.name + "..."}
                                label={field['name']}
                                value={pitScoutFields[index]['value']}
                                onChangeText={(val) => {
                                    const newField = {
                                        "name": field['name'],
                                        "value": val
                                    }
                                    const temp: any[] = [...pitScoutFields];
                                    temp[index] = newField;
                                    setPitScoutFields(temp);
                                    if (field['name'] === 'Team Number') setTeamNum(parseInt(val));
                                    setHasData(true);
                                }}
                            />
                        );
                    }
                })}
                <Button
                    status="danger"
                    style={{
                        width: "100%",
                        marginTop: '5%'
                    }}
                    appearance="outline"
                    onPress={() => {
                        isLoggedIn() ? pushData() : navigation?.navigate("Login");
                    }}
                >
                    Finish Scout
                </Button>
            </ScrollView>
        </>
    );
}

export default PitScout;