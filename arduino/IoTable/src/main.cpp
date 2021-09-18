#include <IoTable.h>

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
    for (pos_user_1; pos_user_1 >= 0; pos_user_1 -= 1)
    { // table 1 down
      // in steps of 1 degree
      myservo1.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
  }
  if (command_user_2 == 1)
  {
    for (pos_user_2; pos_user_2 >= 0; pos_user_2 -= 1)
    { // table 2 down
      // in steps of 1 degree
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
  }
  if (command_user_1 == 2)
  {
    for (pos_user_1; pos_user_1 <= 90; pos_user_1 += 1)
    { // table 1 up
      // in steps of 1 degree
      myservo1.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
  }
  if (command_user_2 == 2)
  {
    for (pos_user_2; pos_user_2 <= 90; pos_user_2 += 1)
    { // table 1 up
      // in steps of 1 degree
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
  }
  if (command_user_1 == 3)
  {
    for (pos_user_1; pos_user_1 <= 90; pos_user_1 += 1)
    { // table 2 down
      // in steps of 1 degree
      myservo1.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
  }
  if (command_user_2 == 3)
  {
    for (pos_user_2; pos_user_2 <= 90; pos_user_2 += 1)
    { // table 2 down
      // in steps of 1 degree
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
  }
  if (command_user_1 == 4)
  {
    for (pos_user_1; pos_user_1 >= 0; pos_user_1 -= 1)
    { // table 2 up
      // in steps of 1 degree
      myservo2.write(pos_user_1); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_1 = 0;
  }
  if (command_user_2 == 4)
  {
    for (pos_user_2; pos_user_2 >= 0; pos_user_2 -= 1)
    { // table 2 up
      // in steps of 1 degree
      myservo2.write(pos_user_2); // tell servo to go to position in variable 'pos_user_1'
      delay(100);           // waits 15ms for the servo to reach the position
    }
    command_user_2 = 0;
  }

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