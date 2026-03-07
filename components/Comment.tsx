import React, { FC, useEffect, useState } from "react";
import { ScrollView, Text, Alert, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, dbCurYear, SEASON_YEAR } from '../firebase';
import { Button, IndexPath, Input, Select, SelectItem, Spinner, Toggle } from '@ui-kitten/components';
import { usePitScout } from "../Stores";
import Counter from "./Counter";
import Toast from 'react-native-toast-message';
import Header from "./Header";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface CommentProps {
    navigation: any,
}
interface Team {
    name: string;
    value: boolean;
  }

const Comment: FC<CommentProps> = ({ navigation }) => {

    const { colors } = useTheme();

    const [regionals, setRegionals] = useState<string[]>(['idbo']);
    const [regional, setRegional] = useState<string>('idbo');
    const [hasData, setHasData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Team[]>([{name: '', value: false}]);
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
            const regionals: any[] = []
            /*
            let regionalsCollection = collection(dbCurYear, 'years', SEASON_YEAR, 'regionals');
            let data = await getDoc(pitScoutingDoc);
            let arr = data.data()?.regionals;
            arr.forEach((doc) => {
                regionals.push(doc.id);
            })
            return regionals;
            */
            let regionalsCollection = collection(dbCurYear, SEASON_YEAR, 'regionals');
            let data = await getDocs(regionalsCollection);
            data.forEach(docSnap => {
                regionals.push(docSnap.id);
            });
            
            return regionals;
        }

    const getTeams = async () => {
        const prompts: any[] = [];
        let teamsCollection = collection(dbCurYear, SEASON_YEAR, 'regionals', regional, 'teams');
        let data = await getDocs(teamsCollection);
        // data.forEach((docSnap) => {
        //     let docData = docSnap.data();
        //     Object.entries(docData).forEach(([key, value]) => {
        //         prompts.push({ name: key, value });
        //     });
        // });
        data.forEach(docSnap => {
            prompts.push({ name: docSnap.id, value: docSnap.data()?.value ?? false });
        });
        
        setHasData(false);
        return prompts;
    };

    const pushData = async () => {
        const val = {
            'comment': comment,
            'match': match,
        }
        Alert.alert(JSON.stringify(val));
        addDoc(
            collection(
              dbCurYear,
              SEASON_YEAR,
              'regionals',
              regional,
              'teams',
              team,
              'comments'
            ), val).then(() => {
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
        return auth.currentUser != null;
    }

    return (!loading ?
        <>
            <View style={{width: "90%", paddingLeft: "10%", backgroundColor: colors.background, flex: 1}}>
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
                            color: colors.text,
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
                    selectedIndex={new IndexPath(
                        Math.max(teams.findIndex((t) => t.name === team), 0)
                    )}
                    label={'Select Team'}
                    onSelect={(currIndex) => {
                        const i = parseInt(currIndex.toString()) - 1;
                        setTeam(teams[i].name);
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
                        isLoggedIn() ? pushData() : navigation?.navigate("Login");
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
export default Comment;