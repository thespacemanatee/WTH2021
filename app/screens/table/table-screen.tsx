import React, { useEffect, useState } from "react"
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native"
import { Device } from "react-native-ble-plx"

import { Button, Screen, Text } from "../../components"
import ShelfAnimation from "../../components/ShelfAnimation"
import TableDeployedAnimation from "../../components/TableDeployedAnimation"
import { getTableUsers } from "../../services/firebase"
import { color } from "../../theme"
import {
  bleManagerRef,
  decodeBleString,
  getCoreCharacteristic,
} from "../../utils/bluetooth/BleHelper"

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
  const [device, setDevice] = useState<Device>()
  const [deployed, setDeployed] = useState(false)

  const { macId } = route.params

  const { width, height } = useWindowDimensions()

  const handleTableRequest = async () => {
    try {
      const char = await getCoreCharacteristic(device)
      const decodedBleString = decodeBleString((await char.read())?.value)
      console.log(decodedBleString.charCodeAt(0))
      console.log(decodedBleString.charCodeAt(1))
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }

  useEffect(() => {
    const connectToDevice = async () => {
      try {
        const device = await bleManagerRef.current?.connectToDevice(macId)
        const uids = await getTableUsers(device.id)
        console.log(uids)
        setDevice(device)
      } catch (err) {
        Alert.alert("Error", err.message)
      }
    }

    connectToDevice()
  }, [macId])

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
        text="Deploy Your Table"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleTableRequest}
      />
    </Screen>
  )
}

export default TableScreen
