import { WorkspaceModel } from "./workspace"

test("can be created", () => {
  const instance = WorkspaceModel.create({})

  expect(instance).toBeTruthy()
})
