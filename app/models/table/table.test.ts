import { TableModel } from "./table"

test("can be created", () => {
  const instance = TableModel.create({})

  expect(instance).toBeTruthy()
})
