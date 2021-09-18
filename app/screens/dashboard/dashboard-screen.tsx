import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, Alert, Modal, StyleSheet, View } from "react-native"

import { Button, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { bleManagerRef } from "../../utils/bluetooth/BleHelper"
import { BluetoothDeviceModel, useStores } from "../../models"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: spacing[2],
  },
  buttonText: {
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  activityIndicator: {
    height: 100,
    width: 100,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
})

export const DashboardScreen = observer(function DashboardScreen() {
  const [bluetoothLoading, setBluetoothLoading] = useState(false)
  const { settingsStore } = useStores()

  const scanDevices = async () => {
    setBluetoothLoading(true)
    settingsStore.clearBluetoothDevices()
    bleManagerRef.current?.startDeviceScan(null, null, (error, scannedDevice) => {
      const scanTimeout = setTimeout(() => {
        bleManagerRef.current?.stopDeviceScan()
        setBluetoothLoading(false)
      }, 5000)
      if (error) {
        console.error(error)
        clearTimeout(scanTimeout)
        bleManagerRef.current?.stopDeviceScan()
        setBluetoothLoading(false)
        Alert.alert("Error", error.message)
      }
      if (scannedDevice) {
        console.log(scannedDevice)
        const toSave = BluetoothDeviceModel.create({ id: scannedDevice.id, connected: false })
        settingsStore.saveBluetoothDevice(toSave)
      }
    })
  }

  return (
    <Screen style={styles.root} preset="scroll">
      <View style={styles.contentContainer}>
        <Text preset="header" text="Test Bluetooth" />
        <Button
          text="Click me"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={scanDevices}
        />
        <Modal animationType="fade" hardwareAccelerated transparent visible={bluetoothLoading}>
          <View style={styles.backdrop}>
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color={color.primary} />
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  )
})
