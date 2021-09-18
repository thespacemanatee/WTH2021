import React, { useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet } from "react-native"

import { Screen, Text, TextField } from "../../components"
import { color } from "../../theme"
import { Subscription } from "react-native-ble-plx"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
})

export const AddTableScreen = observer(function AddTableScreen({ route, navigation }) {
  const { device } = route.params

  const disconnectDevice = useCallback(async () => {
    console.log("disconnecting")
    const isDeviceConnected = await device.isConnected()
    if (isDeviceConnected) {
      await device.cancelConnection()
    }
  }, [])

  useEffect(() => {
    let subscription: Subscription | null
    const getDeviceInformation = async () => {
      let connectedDevice = device
      try {
        if (!(await device.isConnected())) {
          connectedDevice = await device.connect()
        }
        console.log(connectedDevice)

        subscription = device.onDisconnected(() => {
          Alert.alert("Disconnected", "Device was disconnected")
        })
      } catch (err) {
        console.error(err)
        Alert.alert("Error", "Could not connect to selected device")
      }
    }

    getDeviceInformation()
    return () => {
      subscription.remove()
      disconnectDevice()
    }
  }, [device])

  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset="header" text="Invite Collaborator" style={{ fontSize: 36, margin: 16 }} />
      <Text preset="default" text="Add a friend" style={{ fontSize: 18, margin: 16 }} />
      <TextField style={{ borderRadius: 16, margin: 16 }} />
    </Screen>
  )
})
