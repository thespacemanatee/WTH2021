#include <IoTable.h>

/* Callback for updated lighting data written from client */
class TableUpdateCallback : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    uint8_t *valPtr = pCharacteristic->getData();

    if (pCharacteristic == pCoreCharacteristic)
    {
      // Serial.println("Setting table state");
      setTableState(valPtr);
    }
    else
    {
      Serial.println("No matching characteristic");
    }
  }

  void onRead(BLECharacteristic *pCharacteristic)
  {
    tableMessage[0] = user_1_deployed;
    tableMessage[1] = user_2_deployed;
    pCharacteristic->setValue(*tableMessage);
  }
};

void setTableState(uint8_t *value)
{
  if (value[0] == 1)
  {
    command_user_1 = 1;
  }
  else if (value[0] == 2)
  {
    command_user_1 = 2;
  }
  else if (value[1] == 1)
  {
    command_user_2 = 1;
  }
  else if (value[1] == 2)
  {
    command_user_2 = 2;
  }
}

void setup()
{
  Serial.begin(115200);

  /* BLE Setup */

  // Create the BLE Device
  BLEDevice::init("IoTable");

  // Create the BLE Server
  pServer = BLEDevice::createServer();

  // Create the BLE Service
  BLEService *pCoreService = pServer->createService(CORE_SERVICE_UUID);

  // Create BLE Characteristics
  pCoreCharacteristic = pCoreService->createCharacteristic(
      CORE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_WRITE);

  tableUpdateCallback = new TableUpdateCallback();

  pCoreCharacteristic->setCallbacks(tableUpdateCallback);

  myservo1.attach(12); // attaches the servo on pin 9 to the servo object
  myservo2.attach(13); // attaches the servo on pin 10 to the servo object

  pCoreCharacteristic->addDescriptor(new BLE2902());
  pCoreService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(CORE_SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0); // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection...");
}

void loop()
{
  if (command_user_1 == 1)
  {
    while (pos_user_1 > 0)
    {
      pos_user_1--;
      myservo1.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);                 // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
    user_1_deployed = 0;
  }
  else if (command_user_2 == 2)
  {
    while (pos_user_2 > 0)
    {
      pos_user_2--;
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);                 // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
    user_2_deployed = 1;
  }
  else if (command_user_1 == 2)
  {
    while (pos_user_1 < 85)
    {
      pos_user_1++;
      myservo1.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);                 // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
    user_1_deployed = 1;
  }
  else if (command_user_2 == 1)
  {
    while (pos_user_2 < 85)
    {
      pos_user_2++;
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);                 // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
    user_2_deployed = 0;
  }

  delay(1500);

  // disconnecting
  if (!deviceConnected && oldDeviceConnected)
  {
    delay(500);                  // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("Start advertising...");
    oldDeviceConnected = deviceConnected;
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected)
  {
    // do stuff here on connecting
    oldDeviceConnected = deviceConnected;
  }
}