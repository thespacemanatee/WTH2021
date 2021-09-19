import React, { useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import database from "@react-native-firebase/database"
import * as Yup from "yup"

import { Button, Screen, Text, TextField } from "../../components"
import { color } from "../../theme"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../services/firebase"
import { LoadingModal } from "../../components/loading-modal/loading-modal"
import { loginUser, Request } from "../../models/features/settings/settingsSlice"
import { useAppDispatch } from "../../models/hooks"
import { Formik } from "formik"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
    justifyContent: "center",
  },
  button: {
    margin: 16,
  },
  buttonText: {
    fontSize: 16,
  },
})

export const LoginScreen = () => {
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(values.email, values.password)

      const userRes = await (await database().ref(`/users/${user.uid}`).once("value")).val()

      const requests: Request[] =
        userRes.requests &&
        Object.values(userRes.requests).map((e: Request) => {
          const request: Request = {
            macId: e.macId,
            accepted: e.accepted,
            requestedBy: e.requestedBy,
          }
          return request
        })

      const workSpaces = await Promise.all(
        userRes.workspaces &&
          Object.values(userRes.workspaces).map(async (e) => {
            const workSpace = (await database().ref(`/workspaces/${e.name}`).once("value")).val()

            const tables =
              workSpace.tables &&
              Object.values(workSpace.tables).map((e) => {
                return e.macId
              })

            return { name: workSpace.name, tables: tables }
          }),
      )
      console.log({
        user: { uid: user.uid, name: userRes.name, email: values.email },
        requests,
        workSpaces,
      })

      dispatch(
        loginUser({
          user: { uid: user.uid, name: userRes.name, email: values.email },
          requests,
          workSpaces,
        }),
      )
    } catch (err) {
      Alert.alert("Error", err.message)
    }
    setLoading(false)
  }

  const handleCreateAccount = async () => {
    try {
      const results = await createUserWithEmailAndPassword("test@gmail.com", "123456")
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }

  return (
    <Screen style={styles.root} preset="scroll">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values) => {
          console.log(values)
          handleLogin(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
          <View>
            <Text text="Email" preset="header" style={{ color: "white", marginLeft: 16 }} />
            <TextField
              label={errors.email}
              labelColor="red"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={{ marginHorizontal: 16 }}
            />
            <Text text="Password" preset="header" style={{ color: "white", marginLeft: 16 }} />
            <TextField
              label={errors.password}
              labelColor="red"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={{ marginHorizontal: 16 }}
            />
            <Button
              text="Login"
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={handleSubmit}
            />
            <Button
              text="Create Account"
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={handleCreateAccount}
            />
          </View>
        )}
      </Formik>
      <LoadingModal loading={loading} />
    </Screen>
  )
}
