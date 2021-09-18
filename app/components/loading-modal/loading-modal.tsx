import * as React from "react"
import { ActivityIndicator, Modal, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"

const styles = StyleSheet.create({
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

export interface LoadingModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  loading: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const LoadingModal = observer(function LoadingModal({ loading, style }: LoadingModalProps) {
  return (
    <Modal animationType="fade" hardwareAccelerated transparent visible={loading}>
      <View style={styles.backdrop}>
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </View>
    </Modal>
  )
})
