import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { UserModel } from "../user/user"
import { BluetoothDeviceModel, BluetoothDeviceSnapshot } from "../bluetooth-device/bluetooth-device"
import { withEnvironment } from "../extensions/with-environment"
import { Request, Workspace } from ".."

export const SettingsStoreModel = types.late(() => StoreModel)

/**
 * Store containing scanned bluetooth devices
 */
const StoreModel = types
  .model("SettingsStore")
  .props({
    currentlyLoggedIn: types.maybe(UserModel),
    bluetoothDevices: types.optional(types.array(BluetoothDeviceModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    login: (id: string, email: string, requests: Request[], workspaces: Workspace[]) => {
      self.currentlyLoggedIn = UserModel.create({
        id,
        email,
        requests,
        workspaces,
      })
    },
  }))
  .actions((self) => ({
    logout: () => {
      self.currentlyLoggedIn = undefined
    },
  }))
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
