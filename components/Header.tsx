import React, { FC, useEffect, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Text } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import QRCodeBottomSheet from "./QRCode";
import { Navigator } from 'react-router-dom';
import Toast from "react-native-toast-message";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { usePreGame } from "../Stores";

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

  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const teamNum = usePreGame((state) => state.teamNum);
  useEffect(() => {
    // auth.onAuthStateChanged(user => {
    //   if (user) setLoggedIn(true);
    //   else setLoggedIn(false);
    // });
  }, [])

  return (
    <>
      <Toast position="bottom" bottomOffset={20} autoHide={true} visibilityTime={2000} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 25,
          paddingBottom: 15,
          paddingTop: "7%",
          backgroundColor: "#e0e0e0",
        }}
      >
        <View>
          <Text category="h1">{title}</Text>
          <Text category="s1">
            Team: {matchInfo && teamNum}, &nbsp;
            {matchInfo && matchInfo.alliance}@{matchInfo && matchInfo.regional}{" "}
          </Text>
        </View>
        {loggedIn ? <TouchableOpacity
          onPress={() => {
            // auth.signOut().then(() => {
            //   Toast.show({
            //     type: "success",
            //     text1: "Successfully signed out!",
            //     visibilityTime: 2500,
            //     autoHide: true,
            //   });
            // }).catch((err) => {
            //   Toast.show({
            //     type: "error",
            //     text1: "Error signing out: " + err.message,
            //     visibilityTime: 2500,
            //     autoHide: true,
            //   });
            // });
          }}
          style={{
            marginTop: 10,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="exit-outline" size={28} color={'#0782F9'} />
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
              marginTop: 10,
              marginRight: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="enter-outline" size={28} color={'#0782F9'} />
          </TouchableOpacity>}
        <TouchableOpacity
          onPress={() => navigation?.navigate("Home")}
          style={{
            marginTop: 10,
            justifyContent: 'center',
          }}
        >
          {/* <Text style = {{
                  fontWeight: '900',
                  fontSize: 24,
                  color: '#0782F9'
              }}>
                  ⌂
              </Text> */}
          <Ionicons name="home-outline" size={28} color={'#0782F9'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            toggleQRCode && toggleQRCode();
          }}
          style={{
            marginTop: 10,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text category="c1" style={{}}>
            Create
          </Text>
          <Ionicons name="qr-code-outline" size={30} color={"black"} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default React.memo(Header);
