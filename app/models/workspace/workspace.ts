import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TableModel } from "../table/table"

/**
 * Model description here for TypeScript hints.
 */
export const WorkspaceModel = types.model("Workspace").props({
  name: types.string,
  tables: types.optional(types.array(TableModel), []),
})

type WorkspaceType = Instance<typeof WorkspaceModel>
export interface Workspace extends WorkspaceType {}
type WorkspaceSnapshotType = SnapshotOut<typeof WorkspaceModel>
export interface WorkspaceSnapshot extends WorkspaceSnapshotType {}
export const createWorkspaceDefaultModel = () => types.optional(WorkspaceModel, {})
