import React, { createRef } from "react"
import { BleManager, Characteristic, Device } from "react-native-ble-plx"
import { decode as btoa } from "base-64"

export const CORE_SERVICE_UUID = "9a4c6954-cb18-4f9e-a7ff-9ec4b6c10783"
export const CORE_CHARACTERISTIC_UUID = "a39be9a9-57d0-4710-9567-9dfb181378b6"

export const isReadyRef: React.MutableRefObject<boolean | null> = createRef()

export const bleManagerRef: React.MutableRefObject<BleManager | null> = createRef()

export const decodeBleString = (value: string | undefined | null): string => {
  if (!value) {
    return ""
  }
  return btoa(value)
}

export const getCoreCharacteristic = async (
  device: Device,
): Promise<Characteristic | undefined> => {
  return getCharacteristic(CORE_SERVICE_UUID, device, CORE_CHARACTERISTIC_UUID)
}

const getCharacteristic = async (
  serviceUUID: string,
  device: Device,
  characteristicUUID: string,
): Promise<Characteristic | undefined> => {
  let characteristic: Characteristic | undefined
  if (device) {
    const services = await (await device.discoverAllServicesAndCharacteristics()).services()
    const service = services.find((e) => e.uuid === serviceUUID)
    const characteristics = await service?.characteristics()
    characteristic = characteristics?.find((e) => e.uuid === characteristicUUID)
  }
  return characteristic
}
