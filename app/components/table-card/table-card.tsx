import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { Table } from "../../models/features/settings/settingsSlice"
import TableAnimation from "../TableAnimation"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 250,
    width: 250,
    borderRadius: 32,
    margin: 16,
    padding: 16,
  },
  headerText: {
    color: "black",
  },
})

export interface TableCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  table: Table
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const TableCard = observer(function TableCard(props: TableCardProps) {
  return (
    <View style={styles.container}>
      <Text preset="header" text={props.table.macId} style={styles.headerText} />
      <TableAnimation />
    </View>
  )
})
