import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Bluetooth device model
 */
export const BluetoothDeviceModel = types.model("BluetoothDevice").props({
  id: types.identifier,
  connected: types.boolean,
})

type BluetoothDeviceType = Instance<typeof BluetoothDeviceModel>
export interface BluetoothDevice extends BluetoothDeviceType {}
type BluetoothDeviceSnapshotType = SnapshotOut<typeof BluetoothDeviceModel>
export interface BluetoothDeviceSnapshot extends BluetoothDeviceSnapshotType {}
export const createBluetoothDeviceDefaultModel = () => types.optional(BluetoothDeviceModel, {})
