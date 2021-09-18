import React, { useState } from "react"
import { Alert, StyleSheet } from "react-native"
import database from "@react-native-firebase/database"

import { Button, Screen, Text } from "../../components"
import { color } from "../../theme"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../services/firebase"
import { LoadingModal } from "../../components/loading-modal/loading-modal"
import { loginUser, Request, Table } from "../../models/features/settings/settingsSlice"
import { useAppDispatch } from "../../models/hooks"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
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

  const handleLogin = async ({ email = "test@gmail.com", password = "123456" }) => {
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(email, password)

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

            const tables = await Promise.all(
              Object.values(workSpace.tables).map(async (e) => {
                const tableRes = (await database().ref(`/tables/${e.macId}`).once("value")).val()

                const table: Table = {
                  macId: tableRes.macId,
                  usedBy: tableRes.usedBy,
                  users: Object.values(tableRes.users),
                }
                return table
              }),
            )
            return { name: workSpace.name, tables: tables }
          }),
      )
      console.log({ user: { uid: user.uid, name: userRes.name, email }, requests, workSpaces })

      dispatch(
        loginUser({ user: { uid: user.uid, name: userRes.name, email }, requests, workSpaces }),
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
      <Text preset="header" />
      <Button
        text="Login"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleLogin}
      />
      <Button
        text="Create Account"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleCreateAccount}
      />
      <LoadingModal loading={loading} />
    </Screen>
  )
}
