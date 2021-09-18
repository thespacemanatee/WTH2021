import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 250,
    height: 250,
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
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const TableCard = observer(function TableCard(props: TableCardProps) {
  return (
    <View style={styles.container}>
      <Text preset="header" text="{Table Name}" style={styles.headerText} />
    </View>
  )
})
