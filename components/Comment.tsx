import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, Alert, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import { Button, IndexPath, Input, Select, SelectItem, Spinner, Toggle } from '@ui-kitten/components';
import { usePitScout } from "../Stores";
import Counter from "./Counter";
import Toast from 'react-native-toast-message';
import Header from "./Header";
import { Ionicons } from "@expo/vector-icons";

interface CommentProps {
    navigation: any,
}

const Comment: FC<CommentProps> = ({ navigation }) => {

    const [regionals, setRegionals] = useState<string[]>(['cave']);
    const [regional, setRegional] = useState<string>('cave');
    const [hasData, setHasData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Object[]>([{name: '', value: false}]);
    const [team, setTeam] = useState<string>('115');
    const [comment, setComment] = useState("");
    const [match, setMatch] = useState("");
    const year = new Date().getFullYear();

    useEffect(() => {
        (async () => {
            setRegionals(await getRegionals());
        })();
        (async () => {
            setTeams(await getTeams());
        })();
        setLoading(false);
    }, [])


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
        const val = {
            'comment': comment,
            'match': match,
        }
        Alert.alert(JSON.stringify(val));
        db
            .collection('years')
            .doc(`${new Date().getFullYear()}`)
            .collection('regionals')
            .doc(regional)
            .collection('teams')
            .doc(`${team}`).collection('comments').add(val).then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully saved data!'
                });
                navigation?.goBack();
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err.message
                })
            });;

    }

    const isLoggedIn = (): boolean => {
        return true;
    }

    return (!loading ?
        <></> : <></>)/*
            <View style={{width: "90%", paddingLeft: "10%"}}>
            <Toast position="bottom" bottomOffset={20} />
            <ScrollView
                contentContainerStyle={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: 15,
                    paddingTop: "7%",
                }}
                keyboardDismissMode="on-drag"
            >
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
                <Select
                    selectedIndex={new IndexPath(teams.indexOf(team || ''))}
                    label={'Select Team'}
                    onSelect={(currIndex) => {
                        setTeam(teams[parseInt(currIndex.toString()) - 1].name);
                    }}
                    placeholder="Select Team"
                    style={{ marginBottom: '4%' }}
                    value={team}
                >
                    {teams.map(r => <SelectItem title={r.name}/>)}
                </Select>

                <Input
                    multiline={true}
                    textStyle={{ minHeight: 28 }}
                    label={"Match Number"}
                    placeholder="Match Number"
                    value={match}
                    onChangeText={(val) => {
                        setMatch(val);
                    }}
                />
                
                <Input
                    multiline={true}
                    textStyle={{ minHeight: 28 }}
                    label={"Add comment"}
                    placeholder="Add Comment"
                    value={comment}
                    onChangeText={(val) => {
                        setComment(val);
                    }}
                />

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
                    Add Comment
                </Button>
            </ScrollView>
            </View>
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
*/}
export default Comment;