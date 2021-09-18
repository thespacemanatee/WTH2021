import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { Text } from "../text/text"
import { Workspace } from "../../models/features/settings/settingsSlice"
import TableAnimation from "../TableAnimation"
import WorkspaceAnimation from "../WorkspaceAnimation"

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
    fontSize: 20,
  },
})

export interface WorkspaceCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  workspace: Workspace
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const WorkspaceCard = (props: WorkspaceCardProps) => {
  return (
    <View style={styles.container}>
      <Text preset="header" text={props.workspace.name} style={styles.headerText} />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <WorkspaceAnimation style={{ width: 200, height: 200 }} />
      </View>
    </View>
  )
}
