#include <IoTable.h>

Servo myservo1, myservo2; // create servo object to control a servo
                          // twelve servo objects can be created on most boards

uint8_t pos = 0;     // variable to store the servo position
uint8_t command = 1; //1:table 1 down, 2:table 1 up, 3:table 2 down, 4:table 2 up

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
  Serial.println(pos);
  if (command == 1)
  {
    for (pos = 90; pos >= 0; pos -= 1)
    { // table 1 down
      // in steps of 1 degree
      myservo1.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 2)
  {
    for (pos = 0; pos <= 90; pos += 1)
    { // table 1 up
      // in steps of 1 degree
      myservo1.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 3)
  {
    for (pos = 0; pos <= 90; pos += 1)
    { // table 2 down
      // in steps of 1 degree
      myservo2.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
  }
  if (command == 4)
  {
    for (pos = 90; pos >= 0; pos -= 1)
    { // table 2 up
      // in steps of 1 degree
      myservo2.write(pos); // tell servo to go to position in variable 'pos'
      delay(20);           // waits 15ms for the servo to reach the position
    }
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