import * as React from "react"
import { Modal, StyleProp, View, ViewStyle, StyleSheet, Dimensions, Pressable } from "react-native"
import { observer } from "mobx-react-lite"
import { Device } from "react-native-ble-plx"
import DeviceCard from "../bleDevice/DeviceCard"
import { Text } from ".."
import { useNavigation } from "@react-navigation/core"

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  activityIndicator: {
    maxHeight: Dimensions.get("window").height * 0.8,
    width: Dimensions.get("window").width * 0.8,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "white",
  },
})

export interface AddNewDevicesModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  devices: any
  visible: boolean
  onPress: (device: Device) => void
  dismiss: () => void
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const AddNewDeviceModal = observer(function LoadingModal({
  devices,
  visible,
  onPress,
  dismiss,
  style,
}: AddNewDevicesModalProps) {
  return (
    <Modal animationType="fade" hardwareAccelerated transparent visible={visible}>
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <View style={styles.activityIndicator}>
          <Text preset="header" text="Devices" style={{ fontSize: 32, color: "black" }} />
          {devices.map((device: Device) => {
            return <DeviceCard key={device.id} device={device} onPress={onPress} />
          })}
        </View>
      </Pressable>
    </Modal>
  )
})
