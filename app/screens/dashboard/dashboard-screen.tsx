import React, { useCallback, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { Button, Screen, TableCard, Text } from "../../components"
import { color } from "../../theme"
import { bleManagerRef } from "../../utils/bluetooth/BleHelper"
import { useFocusEffect, useNavigation } from "@react-navigation/core"
import { AddNewDeviceModal } from "../../components/add-new-device-modal/add-new-device-modal"
import { Device } from "react-native-ble-plx"
import { getTableByUid, getWorkspaces } from "../../services/firebase"
import {
  updateDashboardTables,
  updateDashboardWorkspaces,
  Workspace,
} from "../../models/features/settings/settingsSlice"
import { useAppDispatch, useAppSelector } from "../../models/hooks"
import { TouchableOpacity } from "react-native-gesture-handler"
import { WorkspaceCard } from "../../components/workspace-card/workspace-card"

const styles = StyleSheet.create({
  button: {
    margin: 16,
    height: 56,
  },
  buttonText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  hamburger: {
    marginLeft: 16,
    marginTop: 16,
  },
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
})

export const DashboardScreen = () => {
  const settingsStore = useAppSelector((state) => state.settings)
  const [bluetoothLoading, setBluetoothLoading] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [visible, setVisible] = useState(false)

  const dispatch = useAppDispatch()

  const navigation = useNavigation()

  const navigateAddTableScreen = (device: Device) => {
    navigation.navigate("AddTable", { device })
    setVisible(false)
  }

  const navigateTableScreen = (macId: string) => {
    navigation.navigate("Table", { macId })
  }

  const navigateWorkspaceScreen = (workspace: Workspace) => {
    navigation.navigate("Workspace", { workspace })
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
      if (scannedDevice.name === "IoTable" && !devices.some((e) => e.id === scannedDevice.id)) {
        setDevices(devices.concat(scannedDevice))
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      const getTablesFromFirebase = async () => {
        try {
          const tables = await getTableByUid(settingsStore.currentUser.uid)
          const workspaces = await getWorkspaces(settingsStore.currentUser.uid)
          dispatch(updateDashboardTables(tables))
          dispatch(updateDashboardWorkspaces(workspaces))
        } catch (err) {
          Alert.alert("Error", err.message)
        }
      }
      getTablesFromFirebase()
    }, [dispatch, settingsStore.currentUser.uid]),
  )

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
        <Text
          preset="header"
          text={`Welcome ${settingsStore.currentUser.name}!`}
          style={{ fontSize: 32, margin: 16 }}
        />
        <Text preset="header" text="Your Tables" style={{ marginHorizontal: 20 }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {settingsStore.dashboardTables?.map((e) => {
            return (
              <TouchableOpacity
                key={e.macId}
                activeOpacity={0.6}
                onPress={() => navigateTableScreen(e.macId)}
              >
                <TableCard table={e} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <Button
          text="Add New Table"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={scanDevices}
        />
        <Text preset="header" text="Your Workspaces" style={{ marginHorizontal: 20 }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {settingsStore.dashboardWorkspaces?.map((e) => {
            return (
              <TouchableOpacity
                key={e.name}
                activeOpacity={0.6}
                onPress={() => navigateWorkspaceScreen(e)}
              >
                <WorkspaceCard workspace={e} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <AddNewDeviceModal
          devices={devices}
          visible={visible}
          onPress={navigateAddTableScreen}
          loading={bluetoothLoading}
          dismiss={() => setVisible(false)}
        />
      </View>
    </Screen>
  )
}
