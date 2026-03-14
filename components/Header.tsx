import React, { FC, useEffect, useState } from "react";
import { View, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { Text } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import QRCodeBottomSheet from "./QRCode";
import { auth } from '../firebase';
import { Navigator } from 'react-router-dom';
import Toast from "react-native-toast-message";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { usePreGame } from "../Stores";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  title: string;
  matchInfo: {
    teams: [string | number, string | number, string | number];
    alliance: string;
    regional: string;
  };
  toggleQRCode?: () => any;
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

const Header: FC<HeaderProps> = ({ title, matchInfo, toggleQRCode, navigation }) => {

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const teamNum = usePreGame((state) => state.teamNum);
  const { colors, isDark } = useTheme();
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) setLoggedIn(true);
      else setLoggedIn(false);
    });
  }, [])

  return (
    <>
      <Toast position="bottom" bottomOffset={20} autoHide={true} visibilityTime={2000} />
      <ImageBackground
        source={require('../assets/rebuilt_banner.png')}
        style={{
          width: "100%",
          paddingHorizontal: 25,
          paddingBottom: 20,
          paddingTop: "10%",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          overflow: 'hidden',
        }}
        imageStyle={{
          opacity: 0.15, // Subtle tech overlay
        }}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text category="h1" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>{title}</Text>
          <Text category="s1" style={{ opacity: 0.8 }}>
            Team: {matchInfo && teamNum}, &nbsp;
            {matchInfo && matchInfo.alliance}@{matchInfo && matchInfo.regional}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {loggedIn ? <TouchableOpacity
            onPress={() => {
              auth.signOut().then(() => {
                Toast.show({
                  type: "success",
                  text1: "Successfully signed out!",
                  visibilityTime: 2500,
                  autoHide: true,
                });
              }).catch((err) => {
                Toast.show({
                  type: "error",
                  text1: "Error signing out: " + err.message,
                  visibilityTime: 2500,
                  autoHide: true,
                });
              });
            }}
            style={{
              marginRight: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="exit-outline" size={28} color={colors.blue} />
          </TouchableOpacity> :
            <TouchableOpacity
              onPress={() => {
                navigation?.navigate("Login");
                Toast.show({
                  type: "success",
                  text1: "Successfully signed in!",
                  visibilityTime: 2500,
                  autoHide: true,
                });
              }}
              style={{
                marginRight: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="enter-outline" size={28} color={colors.blue} />
            </TouchableOpacity>}
          <TouchableOpacity
            onPress={() => navigation?.navigate("Home")}
            style={{
              marginRight: 15,
              justifyContent: 'center',
            }}
          >
            <Ionicons name="home-outline" size={28} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleQRCode && toggleQRCode();
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text category="c1">Create</Text>
            <Ionicons name="qr-code-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default React.memo(Header);
