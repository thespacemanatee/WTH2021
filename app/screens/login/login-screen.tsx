import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet } from "react-native"
import database from "@react-native-firebase/database"

import { Button, Screen, Text } from "../../components"
import { color } from "../../theme"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../services/firebase"
import { Request, RequestModel, TableModel, useStores, WorkspaceModel } from "../../models"
import { LoadingModal } from "../../components/loading-modal/loading-modal"

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

export const LoginScreen = observer(function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const { settingsStore } = useStores()
  const handleLogin = async () => {
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword("test@gmail.com", "123456")

      const requestsRes = (await database().ref(`/users/${user.uid}/requests`).once("value")).val()

      const requests = Object.keys(requestsRes).map((id) => {
        return RequestModel.create({ id, accepted: requestsRes[id].accepted })
      })

      const workspacesRes = await (
        await database().ref(`/users/${user.uid}/workspaces`).once("value")
      ).val()

      const workspaceNames = Object.keys(workspacesRes)

      const workspaces = await Promise.all(
        workspaceNames.map(async (e) => {
          const workspace = (await database().ref(`/workspaces/${e}`).once("value")).val()

          const tableNames = Object.keys(workspace)
          const tables = await Promise.all(
            tableNames.map(async (e) => {
              const { users, usedBy } = (await database().ref(`/tables/${e}`).once("value")).val()
              return TableModel.create({ id: e, users: Object.keys(users), usedBy })
            }),
          )
          return WorkspaceModel.create({ name: e, tables })
        }),
      )

      settingsStore.login(user.uid, user.email, requests, workspaces)
    } catch (err) {
      Alert.alert("Error", err.message)
    }
    setLoading(false)
  }

  const handleCreateAccount = async () => {
    try {
      const results = await createUserWithEmailAndPassword("test@gmail.com", "123456")
      console.log(results)
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
})
