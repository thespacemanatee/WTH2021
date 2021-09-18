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

bool deviceConnected = false;
bool oldDeviceConnected = false;
unsigned long prevCoreMillis = 0; //timer for the important data service

/* Core message to be notified */
uint8_t coreMessage[3];
uint8_t vel;   //Velocity
uint8_t acc;   //Acceleration
uint8_t brake; //Brake


void updateCoreData();
void setCoreCharacteristic();

/* For Debug */
#define ACC_PIN 34