import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const TableModel = types.model("Table").props({
  id: types.string,
  users: types.array(types.string),
  usedBy: types.maybe(types.string),
})

type TableType = Instance<typeof TableModel>
export interface Table extends TableType {}
type TableSnapshotType = SnapshotOut<typeof TableModel>
export interface TableSnapshot extends TableSnapshotType {}
export const createTableDefaultModel = () => types.optional(TableModel, {})
