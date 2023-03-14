import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, Alert, View } from 'react-native';
import { auth, db } from '../firebase';
import { Button, IndexPath, Input, Select, SelectItem, Spinner, Toggle } from '@ui-kitten/components';
import { usePitScout } from "../Stores";
import Counter from "./Counter";
import Toast from 'react-native-toast-message';

interface PitScoutProps {
    navigation: any,
}

const PitScoutForm: FC<PitScoutProps> = ({ navigation }) => {

    const pitScoutFields = usePitScout((state) => state.pitScoutFields);
    const setPitScoutFields = usePitScout((state) => state.setPitScoutFields);
    const [regionals, setRegionals] = useState<string[]>(['cacg']);
    const [regional, setRegional] = useState<string>();
    const [teamNum, setTeamNum] = useState<number>();
    const [hasData, setHasData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        (async () => {
            setRegionals(await getRegionals());
        })();
        if (pitScoutFields.length === 0) {
            (async () => {
                setPitScoutFields(await initalizePitScoutFields());
            })();
        }
        setLoading(false);
    }, [])

    const initalizePitScoutFields = async () => {
        const prompts: any[] = []
        await db
            .collection('years')
            .doc(`${new Date().getFullYear()}`)
            .collection('scouting')
            .doc('pitScouting').get().then((data) => {
                let arr = data.data()?.pitScoutingQuestions;
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

    const getRegionals = async () => {
        const year = new Date().getFullYear();
        let regionals: any[] = [];
        await db
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

    const pushData = async () => {
        if (teamNum && isNaN(teamNum)) {
            Alert.alert('Enter valid team number');
            return;
        }
        let answers: any = {};
        pitScoutFields.forEach((field) => {
            if (typeof field['value'] === 'object') answers[field['name']] = field['selected'];
            else answers[field['name']] = field['value'];
        });
        db
            .collection('years')
            .doc(`${new Date().getFullYear()}`)
            .collection('regionals')
            .doc(regional)
            .collection('teams')
            .doc(teamNum + "")
            .collection('pitScoutData')
            .doc('pitScoutAnswers')
            .set(answers).then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully saved data!'
                });
                clearData();
                navigation?.goBack();
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

    const handlePictureCapture = (data: any) => {
        setImage(data.uri);
        Alert.alert(image);
    }

    return (!loading ?
        <>
            <Toast position="bottom" bottomOffset={20} />
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
                    selectedIndex={new IndexPath(regionals.indexOf(regional || ''))}
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
                    } else if (field['value'] === 'short') {
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
                    } else {
                        return (
                            <Input
                                multiline={true}
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
                                    setHasData(true);
                                    if (field['name'] === 'Team Number') setTeamNum(parseInt(val));
                                }}
                            />
                        );
                    }
                })}
                <Button
                    style={{
                        marginTop: '5%',
                        width: '100%',
                    }}
                    appearance="outline"
                    onPress={() => {
                        if (!teamNum || isNaN(teamNum)) {
                            Toast.show({
                                type: 'error',
                                text1: "Enter a valid team number"
                            })
                        }
                        else if (!regional || regional=="Option 0") {
                            Toast.show({
                                type: 'error',
                                text1: "Enter a valid regional"
                            })
                        }
                        else {
                            navigation?.navigate('PitScoutCamera', {
                                year: new Date().getFullYear(),
                                regional,
                                teamNum,
                            });
                        }
                    }}
                >
                    Take Photo!
                </Button>
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
        </> :
        <View
            style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Spinner />
        </View>
    );
}

export default PitScoutForm;