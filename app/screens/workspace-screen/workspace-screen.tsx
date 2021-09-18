import React, { useCallback, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Device } from "react-native-ble-plx"

import { Button, Screen, TableCard, Text, TextField } from "../../components"
import { updateDashboardTables } from "../../models/features/settings/settingsSlice"
import { useAppDispatch, useAppSelector } from "../../models/hooks"
import { getTableByUid } from "../../services/firebase"
import { color } from "../../theme"

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
})

const WorkspaceScreen = ({ route, navigation }) => {
  const settingsStore = useAppSelector((state) => state.settings)

  const { workspace } = route.params

  useEffect(() => {
    const getTablesFromFirebase = async () => {
      const tables = await getTableByUid(settingsStore.currentUser.uid)
    }
    getTablesFromFirebase()
  }, [settingsStore.currentUser.uid])

  return (
    <Screen style={styles.root} preset="scroll">
      <Text preset="header" text={workspace.name} style={{ fontSize: 36, margin: 16 }} />
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
    </Screen>
  )
}

export default WorkspaceScreen
function navigateTableScreen(macId: string): void {
  throw new Error("Function not implemented.")
}
