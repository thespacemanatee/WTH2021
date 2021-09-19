import React, { useCallback, useEffect, useState } from "react"
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native"
import { encode as atob } from "base-64"

import { Button, Screen, Text } from "../../components"
import ShelfAnimation from "../../components/ShelfAnimation"
import TableDeployedAnimation from "../../components/TableDeployedAnimation"
import { useAppSelector } from "../../models/hooks"
import { getTableUsers } from "../../services/firebase"
import { color } from "../../theme"
import { decodeBleString, getCoreCharacteristic } from "../../utils/bluetooth/BleHelper"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
  button: {
    margin: 16,
    height: 56,
  },
  buttonText: {
    fontSize: 16,
  },
})

const TableScreen = ({ route, navigation }) => {
  const currentUser = useAppSelector((state) => state.settings.currentUser)
  const [deployed, setDeployed] = useState(false)
  const [userNo, setUserNo] = useState(0)

  const { macId } = route.params

  const { width, height } = useWindowDimensions()

  const getTableState = useCallback(async () => {
    try {
      let payload
      const char = await getCoreCharacteristic(macId)
      const decodedBleString = decodeBleString((await char.read())?.value)
      console.log(decodedBleString.charCodeAt(0), decodedBleString.charCodeAt(1))
      if (decodedBleString.charCodeAt(userNo) === 0) {
        if (userNo === 0) {
          payload = atob(String.fromCharCode(2, decodedBleString.charCodeAt(1)))
        } else {
          payload = atob(String.fromCharCode(decodedBleString.charCodeAt(0), 2))
        }
        setDeployed(true)
      }
      if (decodedBleString.charCodeAt(userNo) === 1) {
        if (userNo === 0) {
          payload = atob(String.fromCharCode(1, decodedBleString.charCodeAt(1)))
        } else {
          payload = atob(String.fromCharCode(decodedBleString.charCodeAt(0), 1))
        }
        setDeployed(false)
      }
      await char?.writeWithResponse(payload)
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }, [macId, userNo])

  const connectToDevice = useCallback(async () => {
    try {
      const uids = await getTableUsers(macId)
      const userNumber = uids.indexOf(currentUser.uid)
      setUserNo(userNumber)
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }, [currentUser.uid, macId])

  const handleTableRequest = async () => {
    await getTableState()
  }

  useEffect(() => {
    connectToDevice()
  }, [connectToDevice])

  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset="header" text={macId} style={{ fontSize: 36, margin: 16 }} />
      <Text preset="header" text="Your table is currently:" style={{ margin: 16 }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {!deployed ? (
          <ShelfAnimation style={{ height: height / 2.5, width: width * 0.5 }} />
        ) : (
          <TableDeployedAnimation style={{ height: height / 2.5, width: width * 0.5 }} />
        )}
      </View>
      <Button
        text={`${deployed ? "Stow" : "Deploy"} Your Table`}
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleTableRequest}
      />
    </Screen>
  )
}

export default TableScreen
