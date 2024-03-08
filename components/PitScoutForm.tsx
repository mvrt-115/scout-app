import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, Alert, View, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import { Button, IndexPath, Input, Select, SelectItem, Spinner, Toggle } from '@ui-kitten/components';
import { usePitScout } from "../Stores";
import Counter from "./Counter";
import Toast from 'react-native-toast-message';

interface PitScoutProps {
    navigation: any,
}

//keyboard avoiding view
import KeyboardAvoidingWrapper from "./KeyboardAvoidingWrapper";

const PitScoutForm: FC<PitScoutProps> = ({ navigation }) => {

    const pitScoutFields = usePitScout((state) => state.pitScoutFields);
    const setPitScoutFields = usePitScout((state) => state.setPitScoutFields);
    const [regionals, setRegionals] = useState<string[]>(['cave']);
    const [regional, setRegional] = useState<string>('cave');
    const year = new Date().getFullYear();
   // const [teamNum, setTeamNum] = useState<number>();
    const [hasData, setHasData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState<string>('');
    const [levels, setLevels] = React.useState([
        new IndexPath(0),
        new IndexPath(-1),
        new IndexPath(-1),
      ]);
      const [teams, setTeams] = useState<Object[]>([{name: '', value: false}]);
      const [team, setTeam] = useState<string>('115');
      const [finishTeam, setFinishTeam] = useState(false);

    useEffect(() => {
        (async () => {
            setRegionals(await getRegionals());
        })();
        if (pitScoutFields.length === 0) {
            (async () => {
                setPitScoutFields(await initalizePitScoutFields());
            })();
        }
        (async () => {
            //setTeams(await getTeams());
        })();
        setLoading(false);
    }, [])

    useEffect(() => {
        (async () => {
            //setTeams(await getTeams());
        })();
    }, [finishTeam, regional])

    useEffect(() => {
        setTeams
    })
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

    const getTeams = async () => {
        const prompts: any[] = []
        await db
            .collection('years')
            .doc(year+'')
            .collection('regionals')
            .doc(regional)
            .collection('teamChecklist').doc("teams").get().then((data) => {
                let arr: any = data.data();
                arr = Object.entries(arr);
                arr?.map((field, index: number) => {
                    let data = {
                        name: field[0],
                        value: field[1],
                    } 
                    {prompts.push(data)}
                });
            });
        setHasData(false);
        return prompts;
    }
    const pushData = async () => {
        // if (team && isNaN(Number(team))) {
        //     Alert.alert('Enter valid team number');
        //     return;
        // }
        let answers: any = {};
        pitScoutFields.forEach((field) => {
            if (typeof field['value'] === 'object') answers[field['name']] = field['selected'];
            else answers[field['name']] = field['value'];
        });
        //answers["Team Number"] = team;
        let team = parseInt(answers["Team Number"])+"";
        let teamNew: any = {};
        let temp = [...teams];
        const newVal = {name: team, value: true}
        temp[temp.findIndex(i => i["name"] === team)] = newVal;
        setTeams(temp);
        temp.forEach((field) => {
            teamNew[field['name']] = field['value'];
        });
        db
            .collection('years')
            .doc(`${new Date().getFullYear()}`)
            .collection('regionals')
            .doc(regional)
            .collection('teams')
            .doc(team)
            .collection('pitScoutData')
            .doc('pitScoutAnswers')
            .set(answers).then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully saved data!'
                })
                clearData();
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err.message
                })
            });
            
            db
            .collection('years')
            .doc(year+'')
            .collection('regionals')
            .doc(regional)
            .collection('teamChecklist').doc("teams")
            .set(teamNew).then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully saved data!'
                });
                setFinishTeam(true);
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
        return true;
    }

    const handlePictureCapture = (data: any) => {
        setImage(data.uri);
        Alert.alert(image);
    }

    return (!loading ?
        <KeyboardAvoidingWrapper>
            <View style={{width: "90%", paddingLeft: "10%"}}>
            <Toast position="bottom" bottomOffset={20} />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        marginVertical: 40,
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "800",
                            fontSize: 24,
                        }}
                    >
                        ←
                    </Text>
                </TouchableOpacity>
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
                        if(field['name'].indexOf(":") != -1) {
                            const levelsValues = levels.map((indexpath, index) => {
                                return field['value'][indexpath.row];
                              });
                            return(
                                <>
                                {levels.map((index)=>{<Text> {index.row} </Text>})}
                                <Select
                                multiSelect={true}
                                selectedIndex={levels}
                                onSelect={(currIndex) => {
                                    setLevels(currIndex);
                                    const temp: any[] = [...pitScoutFields];
                                    const currLevel = temp[index];
                                    const newLevelsValues = currIndex.map((indexpath, index) => {
                                        return field['value'][indexpath.row];
                                      });
                                    const newField = {
                                        "name": field['name'],
                                        "value": field['value'],
                                        "selected": newLevelsValues.join(' '),
                                    }
                                    temp[index] = newField;
                                    setPitScoutFields(temp);
                                    setHasData(true);
                                }}
                              value={levelsValues.join(' ')}
                              label={field['name'].substring(0, field['name'].indexOf(':'))}
                              style={{ marginBottom: "3%" }}
                            >
                                {field['value'].map((val: any) => {
                                    return <SelectItem title={val} />
                                })}
                            </Select>
                                </>
                            )
                        }
                        else {
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
                    }} 
                    else if (typeof field['value'] === 'boolean') {
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
                                    
                                    setHasData(true);
                                }}
                            />
                        );
                    } else if(field['value'] === 'multiselect') {
                    
                    }
                    else {
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
                        if (!team || isNaN(parseInt(team))) {
                            Toast.show({
                                type: 'error',
                                text1: "Enter a valid team number"
                            })
                        }
                        else if (!regional || regional == "Option 0") {
                            Toast.show({
                                type: 'error',
                                text1: "Enter a valid regional"
                            })
                        }
                        else {
                            navigation?.navigate('PitScoutCamera', {
                                year: new Date().getFullYear(),
                                regional,
                                team,
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
                        pushData();
                    }}
                >
                    Finish Scout
                </Button>
            </View>
        </KeyboardAvoidingWrapper> :
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