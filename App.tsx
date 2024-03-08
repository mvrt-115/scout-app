import { enableScreens } from "react-native-screens";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Home from "./pages/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import QRScanner from "./pages/QRScanner";
import Login from "./pages/Login";
import Match from "./pages/Match";
import PitScout from './pages/PitScout';
import Comment from "./components/Comment";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import { auth } from "./firebase";

console.warn = () => { };
console.log = () => { };
console.error = () => { };

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={Home}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="QRScanner"
              component={QRScanner}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Match"
              component={Match}
            />
            <Stack.Screen
              name="PitScout"
              component={PitScout}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Comment"
              component={Comment}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ApplicationProvider>
  );
}
