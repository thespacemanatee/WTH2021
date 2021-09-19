#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ESP32Servo.h>

/* UUIDs */
#define CORE_SERVICE_UUID "9a4c6954-cb18-4f9e-a7ff-9ec4b6c10783"
#define CORE_CHARACTERISTIC_UUID "a39be9a9-57d0-4710-9567-9dfb181378b6"

#define CORE_DATA_REFRESH_INTERVAL 16

BLEServer *pServer;           //main BLE server
BLEService *pCoreService;     //service for core data
BLECharacteristic *pCoreCharacteristic;
BLECharacteristicCallbacks *tableUpdateCallback;

bool deviceConnected = false;
bool oldDeviceConnected = false;
unsigned long prevCoreMillis = 0; //timer for the important data service

Servo myservo1, myservo2; // create servo object to control a servo
                          // twelve servo objects can be created on most boards

uint16_t tableMessage[2];
uint8_t pos_user_1 = 0;     // variable to store the servo position
uint8_t pos_user_2 = 0;     // variable to store the servo position
uint8_t command_user_1 = 0; //1:table 1 down, 2:table 1 up, 3:table 2 down, 4:table 2 up
uint8_t command_user_2 = 0; //1:table 1 down, 2:table 1 up, 3:table 2 down, 4:table 2 up
uint8_t user_1_deployed = 0;
uint8_t user_2_deployed = 0;

void setTableState(uint8_t *value);
void updateCoreData();
void setCoreCharacteristic();

/* For Debug */
#define ACC_PIN 34