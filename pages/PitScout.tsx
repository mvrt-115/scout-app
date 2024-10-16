import React, { FC } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import PitScoutForm from '../components/PitScoutForm';
import PitScoutCamera from '../components/PitScoutCamera';
import { Button } from '@ui-kitten/components';

const Stack = createNativeStackNavigator();

const PitScout: FC<any> = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName='PitScoutForm'>
            <Stack.Screen
                component={PitScoutForm}
                name='PitScoutForm'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                component={PitScoutCamera}
                name='PitScoutCamera'
            />
        </Stack.Navigator>
    );
}

export default PitScout;