import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { FC, useEffect, useRef, useState } from "react";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { NavigationState, RouteProp } from "@react-navigation/native";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { db } from "../firebase";
import Toast from "react-native-toast-message";
import { Input } from "@ui-kitten/components";

const Tab = createBottomTabNavigator();

type RootStackParamList = {
  data: { data: string };
};

type DataProp = RouteProp<RootStackParamList, "data">;

interface MatchProps {
  route: DataProp;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const Login: FC<MatchProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // const handleLogin = () => {
  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then(() => {
  //       navigation.goBack();
  //       Toast.show({
  //         type: "success",
  //         text1: "Successfully signed in!",
  //         visibilityTime: 2500,
  //         autoHide: true,
  //       });
  //     })
  //     .catch((error) => { 
  //       if (error.code === "auth/invalid-email")
  //         Toast.show({type: 'error', text1: "You did not enter a valid Email"});
  //       else if (error.code === "auth/user-not-found")
  //         Toast.show({type: 'error', text1: "This user could not be found"});
  //       else if (error.code === "auth/wrong-password")
  //         Toast.show({type: 'error', text1: "Invalid Password"});
  //     });
  // };
  return (
    <>
    <Toast position="bottom" bottomOffset={20}/>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 20,
            marginLeft: 20,
            marginVertical: 20,
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
      </View>
      <KeyboardAvoidingView style={styles.container}
        behavior={(Platform.OS === 'ios') ? 'padding' : undefined}
      >
        <View style={styles.inputContainer}>
          <Input 
            label={'Email'}  
            placeholder="Enter email"
            value={email.toLowerCase()}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            style={styles.input}
            autoCorrect
            keyboardType = "visible-password"
          />
          <Input 
            label={'Password'}  
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
         {/* <TextInput
            placeholder="Enter email"
            value={email.toLowerCase()}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            style={styles.input}
            autoCorrect
            keyboardType = "visible-password"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          /> */}
        </View>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#2f064b",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#2f064b",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});