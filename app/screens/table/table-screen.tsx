import React, { useEffect, useState } from "react"
import { Alert, StyleSheet } from "react-native"
import { Device } from "react-native-ble-plx"

import { Button, Screen, Text } from "../../components"
import { color } from "../../theme"
import { bleManagerRef } from "../../utils/bluetooth/BleHelper"

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

const TableScreen = ({ route, navigation }) => {
  const [device, setDevice] = useState<Device>()

  const { macId } = route.params

  const handleTableRequest = () => {}

  useEffect(() => {
    const connectToDevice = async () => {
      try {
        const device = await bleManagerRef.current?.connectToDevice(macId)
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
