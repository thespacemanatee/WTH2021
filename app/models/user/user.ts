import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { WorkspaceModel } from "../workspace/workspace"
import { RequestModel } from "../request/request"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types.model("User").props({
  id: types.string,
  email: types.string,
  requests: types.optional(types.array(RequestModel), []),
  workspaces: types.optional(types.array(WorkspaceModel), []),
})

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
