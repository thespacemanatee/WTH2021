import React, { useEffect, useState } from "react"
import { StyleProp, Text, ViewStyle } from "react-native"
import { Device } from "react-native-ble-plx"
import { decode as btoa } from "base-64"

import BaseCard from "./BaseCard"

interface DeviceCardProps {
  device: Device
  onPress: (device: Device) => void
  style?: StyleProp<ViewStyle>
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, style }) => {
  return (
    <BaseCard style={style} onPress={() => onPress(device)}>
      <Text>{`ID: ${device.id}`}</Text>
      <Text>{`Name: ${device.name}`}</Text>
      <Text>{`RSSI: ${device.rssi}`}</Text>
      {device.manufacturerData ? (
        <Text>{`Manufacturer: ${btoa(device.manufacturerData)}`}</Text>
      ) : null}
      <Text>{`UUIDs: ${device.serviceUUIDs}`}</Text>
    </BaseCard>
  )
}

DeviceCard.defaultProps = {
  style: undefined,
}

export default DeviceCard
