import React from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet } from "react-native"
import { Screen, Text } from "../../components"

//login dependencies
import "firebase/auth";
import firebase from "firebase/app";

import { color } from "../../theme"

const styles = StyleSheet.create({
  backgroundColor: color.palette.black,
  flex: 1,
})

const firebaseConfig = {
  apiKey: "AIzaSyBKAR9ecnMf8nq08Ji-qQGA8GAkPX5-V7c",
  authDomain: "iotable-852f0.firebaseapp.com",
  databaseURL: "https://iotable-852f0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iotable-852f0",
  storageBucket: "iotable-852f0.appspot.com",
  messagingSenderId: "318935961792",
  appId: "1:318935961792:web:30da4e3d62650efdcfdd25",
  measurementId: "G-P3VW46WLN2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = app.database();

export const LoginScreen = observer(function LoginScreen() {
  var usernameRef = null;
  var passwordRef = null;
  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset= <View style={styles.container}>
        <Text style={styles.headerText}>Login{"\n"} </Text>
        <Text style={styles.normalText}>Username</Text>
        <TextInput
          nativeID="username"
          ref={textInput => usernameRef = textInput}
          style={styles.basicTextInput}
          placeholder="Enter username"
          onChangeText={(text) => { this.setLoginUsername(text); }}
        />
        <Text style={styles.normalText}>{"\n"}Password</Text>
        <TextInput
          nativeID="password"
          ref={textInput => passwordRef = textInput}
          style={styles.basicTextInput}
          secureTextEntry={true}
          placeholder="Enter password"
          onChangeText={(text) => { this.setLoginPassword(text); }}
        />
        <Text> {"\n"} </Text>
        <View nativeID="loginButton">
          <Button
            onPress={() => {
              authUtils.login(this.state.loginUsername, this.state.loginPassword, (val) => {
                if (val === 1) {
                  this.setIndicator("Error: Invalid credentials");
                }
                else if (val === 2) {
                  this.setIndicator("Error: Network error");
                }
                else {
                  usernameRef.clear();
                  passwordRef.clear();
                  this.setLoginUsername("");
                  this.setLoginPassword("");
                  this.setIndicator("");
                  this.props.navigation.navigate("Home", { "userObject": val, "loginPage": this });
                }
              });
            }}
            title="Login"
          />
        </View>

        {this.state.indicator}
      </View>"header" text="" />
    </Screen>
  )
})
