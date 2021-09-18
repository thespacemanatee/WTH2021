import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { UserModel } from "../user/user"
import { withEnvironment } from "../extensions/with-environment"
import { Request, TableSnapshot, Workspace } from ".."

export const SettingsStoreModel = types.late(() => StoreModel)

/**
 * Store containing scanned bluetooth devices
 */
const StoreModel = types
  .model("SettingsStore")
  .props({
    currentlyLoggedIn: types.maybe(UserModel),
    // dashboardTables: types.maybe(types.array(TableModel)),
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
    updateDashboardTables: (tables: TableSnapshot[]) => {
      // self.dashboardTables = tables.map((e) =>
      // TableModel.create({ id: e.id, usedBy: e.usedBy, users: e.users }),
      // )
    },
  }))

type SettingsStoreType = Instance<typeof SettingsStoreModel>
export interface SettingsStore extends SettingsStoreType {}
type SettingsStoreSnapshotType = SnapshotOut<typeof SettingsStoreModel>
export interface SettingsStoreSnapshot extends SettingsStoreSnapshotType {}
export const createSettingsStoreDefaultModel = () => types.optional(SettingsStoreModel, {})
