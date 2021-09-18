import { BluetoothDeviceModel } from "./bluetooth-device"

test("can be created", () => {
  const instance = BluetoothDeviceModel.create({ id: "" })

  expect(instance).toBeTruthy()
})
