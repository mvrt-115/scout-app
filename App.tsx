import { enableScreens } from "react-native-screens";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import Home from "./pages/Home";
import QRScanner from "./pages/QRScanner";
import Login from "./pages/Login";
import Match from "./pages/Match";
import PitScout from './pages/PitScout';
import Comment from "./components/Comment";
import { auth } from "./firebase";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { themeColors } from "./utils/themeColors";

console.warn = () => { };
console.log = () => { };
console.error = () => { };

enableScreens();
const Stack = createNativeStackNavigator();

function AppInner() {
  const { isDark, colors } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
        <NavigationContainer theme={navigationTheme}>
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
              component={(props) => <Login {...props} />}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Match"
              component={(props) => <Match {...props} />}
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
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}