import { SettingsStoreModel } from "./settings-store"

test("can be created", () => {
  const instance = SettingsStoreModel.create({})

  expect(instance).toBeTruthy()
})
