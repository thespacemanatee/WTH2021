import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { BluetoothDeviceModel, BluetoothDeviceSnapshot } from "../bluetooth-device/bluetooth-device"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Store containing scanned bluetooth devices
 */
export const SettingsStoreModel = types
  .model("SettingsStore")
  .props({
    bluetoothDevices: types.optional(types.array(BluetoothDeviceModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveBluetoothDevice: (device: BluetoothDeviceSnapshot) => {
      if (!self.bluetoothDevices.some((e) => e.id === device.id)) self.bluetoothDevices.push(device)
    },
  }))
  .actions((self) => ({
    clearBluetoothDevices: () => {
      self.bluetoothDevices.clear()
    },
  }))

type SettingsStoreType = Instance<typeof SettingsStoreModel>
export interface SettingsStore extends SettingsStoreType {}
type SettingsStoreSnapshotType = SnapshotOut<typeof SettingsStoreModel>
export interface SettingsStoreSnapshot extends SettingsStoreSnapshotType {}
export const createSettingsStoreDefaultModel = () => types.optional(SettingsStoreModel, {})
