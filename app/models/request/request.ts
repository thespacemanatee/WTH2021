import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RequestModel = types
  .model("Request")
  .props({
    id: types.string,
    accepted: types.boolean
  })

type RequestType = Instance<typeof RequestModel>
export interface Request extends RequestType {}
type RequestSnapshotType = SnapshotOut<typeof RequestModel>
export interface RequestSnapshot extends RequestSnapshotType {}
export const createRequestDefaultModel = () => types.optional(RequestModel, {})
