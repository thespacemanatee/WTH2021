import React from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet } from "react-native"
import { Screen, Text } from "../../components"

// //login dependencies
// import "firebase/auth";
// import firebase from "firebase/app";

// import { color } from "../../theme"

// const styles = StyleSheet.create({
//   backgroundColor: color.palette.black,
//   flex: 1,
// })

// const firebaseConfig = {
//   apiKey: "AIzaSyBKAR9ecnMf8nq08Ji-qQGA8GAkPX5-V7c",
//   authDomain: "iotable-852f0.firebaseapp.com",
//   databaseURL: "https://iotable-852f0-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "iotable-852f0",
//   storageBucket: "iotable-852f0.appspot.com",
//   messagingSenderId: "318935961792",
//   appId: "1:318935961792:web:30da4e3d62650efdcfdd25",
//   measurementId: "G-P3VW46WLN2"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// export const db = app.database();

export const LoginScreen = observer(function LoginScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset="header" text="" />
    </Screen>
  )
})
