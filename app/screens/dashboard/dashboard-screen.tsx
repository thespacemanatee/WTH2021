import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { Button, Screen, TableCard, Text } from "../../components"
import { color } from "../../theme"
import { bleManagerRef } from "../../utils/bluetooth/BleHelper"
import { useNavigation } from "@react-navigation/core"
import { AddNewDeviceModal } from "../../components/add-new-device-modal/add-new-device-modal"
import { Device } from "react-native-ble-plx"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
  hamburger: {
    marginTop: 16,
    marginLeft: 16,
  },
  contentContainer: {
    flex: 1,
  },
  button: {
    margin: 16,
  },
  buttonText: {
    fontSize: 16,
  },
})

export const DashboardScreen = observer(function DashboardScreen() {
  const [bluetoothLoading, setBluetoothLoading] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [visible, setVisible] = useState(false)

  const navigation = useNavigation()

  const navigateAddTableScreen = (device: Device) => {
    navigation.navigate("AddTable", { device })
    setVisible(false)
  }

  const scanDevices = async () => {
    setBluetoothLoading(true)
    setVisible(true)
    setDevices([])
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
        if (scannedDevice.name === "IoTable" && !devices.some((e) => e.id === scannedDevice.id)) {
          setDevices([...devices, scannedDevice])
        }
      }
    })
  }

  return (
    <Screen style={styles.root} preset="scroll">
      <Icon
        name="menu"
        size={32}
        color="white"
        onPress={() => navigation.openDrawer()}
        style={styles.hamburger}
      />
      <View style={styles.contentContainer}>
        <Text preset="header" text="Welcome {Name}!" style={{ fontSize: 32, margin: 16 }} />
        <Text preset="header" text="Your Tables" style={{ marginHorizontal: 20 }} />
        <TableCard />
        <Button
          text="Add New Table"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={scanDevices}
        />
        <Text preset="header" text="Your Workspaces" style={{ marginHorizontal: 20 }} />
        <TableCard />
        <AddNewDeviceModal
          devices={devices}
          visible={visible}
          onPress={navigateAddTableScreen}
          dismiss={() => setVisible(false)}
        />
      </View>
    </Screen>
  )
})
